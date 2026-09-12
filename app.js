(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const euro = n => new Intl.NumberFormat('es-ES', {style:'currency',currency:'EUR'}).format(n);
  const normalized = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const groups = window.TINGLAO_MENU;
  const photos = {pulpo:{image:'assets/pulpo-gallega.jpg',alt:'Pulpo a la gallega fotografiado por Tinglao',caption:'El momento de compartir.'},tarta:{image:'assets/tarta-vasca.jpg',alt:'Tarta vasca fotografiada por Tinglao',caption:'Siempre hay sitio para el postre.'}};
  const products = groups.flatMap(g => g.items.map(([id,name,price]) => ({id,name,price,category:g.category,group:g.name,note:g.note||'',...photos[id]})));
  const byId = Object.fromEntries(products.map(p => [p.id,p]));
  const selection = ['pulpo','tarta','jamon-serrano','croquetas','camarones','bravas','fideua','bacon-burger','crema-catalana','sangria-tinto'];
  const cartKey = 'tinglao-demo-cart';
  let filter = 'seleccion', cart = {}, activeDialog = null, returnFocus = null, toastTimer;
  let orderState = {mode:'Retiro',address:'',notes:'',terms:false};
  let orderStage = 'cart';
  try {
    const saved = JSON.parse(localStorage.getItem(cartKey)||'{}');
    if (saved && typeof saved==='object' && !Array.isArray(saved)) {
      for (const [id,n] of Object.entries(saved)) if (Object.hasOwn(byId,id) && Number.isInteger(n) && n>0) cart[id]=Math.min(20,n);
    }
  } catch { /* Unreadable local storage should never prevent browsing. */ }
  const count = () => Object.values(cart).reduce((a,b) => a+b,0);
  const subtotal = () => products.reduce((n,p) => n+(cart[p.id]||0)*Math.round(p.price*100),0)/100;
  const entries = () => products.filter(p => cart[p.id]);
  function toast(message) {
    clearTimeout(toastTimer); $('#toast').textContent=message; $('#toast').classList.add('visible');
    toastTimer=setTimeout(() => $('#toast').classList.remove('visible'),2800);
  }
  function save() {
    try { localStorage.setItem(cartKey,JSON.stringify(cart)); } catch { toast('Tu pedido se conserva solo mientras esta página esté abierta.'); }
    renderCart();
  }
  function renderProducts() {
    const query=normalized($('#search').value);
    const list=products.filter(p => query ? normalized(p.name+' '+p.group).includes(query) : filter==='seleccion' ? selection.includes(p.id) : p.category===filter);
    const featured=list.filter(p => p.image);
    $('#resultCount').textContent=`${list.length} ${list.length===1?'opción':'opciones'}${query?' encontradas':' para elegir'}`;
    $('#productGrid').innerHTML=featured.map(p => `<article class="product-card" data-id="${p.id}"><button class="product-image detail-btn" data-id="${p.id}" aria-label="Ver detalle de ${esc(p.name)}"><img src="${p.image}" alt="${p.alt}" width="640" height="640" loading="lazy"></button><div class="product-body"><span class="tag">${esc(p.group)}</span><h3><button class="detail-link detail-btn" data-id="${p.id}">${esc(p.name)}</button></h3><p>${p.caption}</p><div class="product-foot"><span class="price">${euro(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Añadir ${esc(p.name)}">+</button></div></div></article>`).join('');
    $('#productGrid').hidden=!featured.length;
    const displayGroups = !query && filter==='seleccion' ? [{name:'Para seguir disfrutando',selection:true}] : groups;
    $('#menuGroups').innerHTML=list.length ? displayGroups.map(g => {
      const rows=list.filter(p => (g.selection || p.group===g.name)&&!p.image);
      return rows.length ? `<section class="menu-group" aria-label="${esc(g.name)}"><h3>${esc(g.name)}${g.note?`<span class="group-note">${esc(g.note)}</span>`:''}</h3><div class="menu-list">${rows.map(p => `<article class="menu-row" data-id="${p.id}"><div class="menu-row-copy"><h4><button class="detail-link detail-btn" data-id="${p.id}">${esc(p.name)}</button></h4>${g.selection?`<small class="row-group">${esc(p.group)}</small>`:''}</div><span class="price">${euro(p.price)}</span><button class="add-btn" data-add="${p.id}" aria-label="Añadir ${esc(p.name)} (${esc(g.name)})">+</button></article>`).join('')}</div></section>` : '';
    }).join('') : '<div class="empty"><strong>No encontramos ese antojo.</strong><br>Prueba con otro nombre o vuelve a la selección.<br><button class="btn btn-outline" id="clearSearch">Ver la selección</button></div>';
  }
  function renderCart() {
    const items=entries();
    $('#cartCount').textContent=count();$('#mobileCount').textContent=count();
    $('.cart-btn').setAttribute('aria-label',`Abrir pedido, ${count()} artículos`);
    $('#subtotal').textContent=euro(subtotal());
    $('#cartItems').innerHTML=items.length ? items.map(p => `<div class="line-item">${p.image?`<img src="${p.image}" alt="">`:''}<div class="line-item-copy"><strong>${esc(p.name)}</strong><small>${esc(p.group)} · ${euro(p.price)}</small><div class="qty" aria-label="Cantidad de ${esc(p.name)}"><button data-qty="${p.id}" data-delta="-1" aria-label="Restar uno de ${esc(p.name)}">−</button><span>${cart[p.id]}</span><button data-qty="${p.id}" data-delta="1" aria-label="Sumar uno de ${esc(p.name)}" ${cart[p.id]>=20?'disabled':''}>+</button></div></div><strong>${euro(p.price*cart[p.id])}</strong></div>`).join('') : '<div class="empty"><strong>La mesa está por servir.</strong><br>Empieza añadiendo algo de la carta.<br><button class="btn btn-dark" data-close>Explorar la carta</button></div>';
    $('#checkoutBtn').disabled=!items.length;
    if(!items.length){orderStage='cart';$('#checkout').innerHTML='';}
    if(orderStage==='preview') {orderStage='form';checkoutForm();}
    $('.drawer-foot').hidden=orderStage==='preview';
  }
  const background = () => $$('header, main, footer, .mobile-dock');
  function closeAll(restore=true) {
    $$('.modal,.drawer').forEach(el=>{el.classList.remove('open');el.setAttribute('aria-hidden','true');el.inert=true;});
    $('#overlay').classList.remove('open');document.body.style.overflow='';background().forEach(el=>el.inert=false);
    activeDialog=null;
    if(restore){const target=returnFocus?.isConnected&&!returnFocus.closest('[aria-hidden="true"]')?returnFocus:$('.cart-btn');target?.focus({preventScroll:true});}
  }
  function openEl(el) {
    if(!activeDialog) returnFocus=document.activeElement;
    closeAll(false);activeDialog=el;el.inert=false;el.classList.add('open');el.setAttribute('aria-hidden','false');
    $('#overlay').classList.add('open');document.body.style.overflow='hidden';background().forEach(node=>node.inert=true);
    el.querySelector('button,input')?.focus({preventScroll:true});
  }
  function detail(id) {
    const p=byId[id];if(!p)return;
    $('#detailBody').innerHTML=`<div class="detail-grid ${p.image?'':'no-photo'}">${p.image?`<img src="${p.image}" alt="${p.alt}">`:''}<div class="detail-copy"><span class="tag">${esc(p.group)}</span><h3 id="detailTitle">${esc(p.name)}</h3><p class="price">${euro(p.price)}</p>${p.note?`<p>${esc(p.note)}</p>`:''}<p>Precio de referencia de la carta oficial. Consulta ingredientes, alérgenos y disponibilidad con el restaurante antes de un pedido real.</p><div class="field"><label for="detailQty">Cantidad · máximo 20 por artículo en esta demo</label><input id="detailQty" type="number" min="1" max="20" step="1" value="1" inputmode="numeric"></div><div class="error" id="detailError" role="alert"></div><button class="btn btn-dark" id="addDetail" data-id="${p.id}">Añadir al pedido <span>${euro(p.price)}</span></button></div></div>`;
    openEl($('#detailModal'));
  }
  function add(id,n=1,open=false) {
    if(!byId[id]||!Number.isInteger(n)||n<1)return;
    if((cart[id]||0)+n>20){toast('Máximo 20 unidades por artículo en esta demo.');return;}
    cart[id]=(cart[id]||0)+n;save();
    if(open) openEl($('#cartDrawer'));else toast(`${byId[id].name} añadido a tu pedido`);
  }
  function readOrderState() {
    const form=$('#orderForm');if(!form)return;
    const fd=new FormData(form);orderState={mode:fd.get('mode'),address:String(fd.get('address')||''),notes:String(fd.get('notes')||''),terms:$('#terms').checked};
  }
  function checkoutForm() {
    if(!count())return;
    orderStage='form';$('.drawer-foot').hidden=false;
    $('#checkout').innerHTML=`<p class="form-step">01 / PREPARA TU PEDIDO</p><form id="orderForm" novalidate><h3>¿Cómo lo prefieres?</h3><div class="notice">Pedido de prueba. No se envían datos. El servicio de entrega no está verificado.</div><div class="form-grid"><fieldset class="fieldset"><legend>Modalidad de la simulación</legend><label><input type="radio" name="mode" value="Retiro" ${orderState.mode==='Retiro'?'checked':''}> Retiro</label><label><input type="radio" name="mode" value="Entrega" ${orderState.mode==='Entrega'?'checked':''}> Entrega simulada</label></fieldset><div class="field full" id="addressField" ${orderState.mode==='Entrega'?'':'hidden'}><label for="address">Dirección de ejemplo</label><input id="address" name="address" maxlength="300" autocomplete="off" value="${esc(orderState.address)}" ${orderState.mode==='Entrega'?'required':''}></div><div class="field full"><label for="orderNotes">Notas (opcional)</label><textarea id="orderNotes" name="notes" maxlength="500" placeholder="Usa datos ficticios para probar la experiencia.">${esc(orderState.notes)}</textarea></div><div class="field full"><label><input id="terms" type="checkbox" required ${orderState.terms?'checked':''}> Entiendo que es una simulación y no se enviará el pedido.</label></div></div><div class="error" id="orderError" role="alert"></div><button class="btn btn-dark" type="submit" style="width:100%">Revisar pedido <span aria-hidden="true">→</span></button></form>`;
    $('#orderForm').addEventListener('input',readOrderState);
    $('#orderForm').addEventListener('change',e=>{readOrderState();if(e.target.name==='mode'){const delivery=orderState.mode==='Entrega';$('#addressField').hidden=!delivery;$('#address').required=delivery;}});
    $('#orderForm').addEventListener('submit',submitOrder);
  }
  function submitOrder(e) {
    e.preventDefault();readOrderState();
    let err='';if(!count())err='Añade algo a tu pedido.';else if(orderState.mode==='Entrega'&&!orderState.address.trim())err='Indica una dirección para la entrega simulada.';else if(!orderState.terms)err='Debes aceptar que es una simulación.';
    $('#orderError').textContent=err;
    if(err){(orderState.mode==='Entrega'&&!orderState.address.trim()?$('#address'):$('#terms')).focus();return;}
    const lines=entries().map(p=>`${cart[p.id]} × ${p.name} (${p.group}) — ${euro(cart[p.id]*p.price)}`).join('\n');
    const message=`PEDIDO DE PRUEBA · NO ENVIADO\n\n${lines}\n\nSubtotal de referencia: ${euro(subtotal())}\nModalidad: ${orderState.mode}${orderState.mode==='Entrega'?'\nDirección: '+orderState.address.trim():''}${orderState.notes.trim()?'\nNotas: '+orderState.notes.trim():''}`;
    orderStage='preview';$('.drawer-foot').hidden=true;
    $('#checkout').innerHTML=`<p class="form-step">02 / REVISA TU PEDIDO</p><h3>Todo listo para revisar.</h3><div class="notice">Vista previa del mensaje. No se abre WhatsApp ni se envía al restaurante.</div><div class="preview">${esc(message)}</div><div class="form-actions"><button class="btn btn-outline" id="editOrder">Editar datos</button><button class="btn btn-dark" id="confirmOrder">Confirmar simulación</button></div>`;
    $('#editOrder').onclick=()=>{checkoutForm();$('#orderForm input')?.focus();};
    $('#confirmOrder').onclick=()=>confirm('pedido');$('#confirmOrder').focus();
  }
  function confirm(type) {
    const isOrder=type==='pedido';
    if(isOrder){orderStage='cart';cart={};orderState={mode:'Retiro',address:'',notes:'',terms:false};save();}
    else{$('#reservationForm').reset();$('#reservationForm').hidden=false;$('#reservationPreview').innerHTML='';}
    $('#confirmBody').innerHTML=`<div class="success"><div class="success-mark" aria-hidden="true">✓</div><span class="eyebrow">ASÍ SERÍA LA EXPERIENCIA</span><h3>${isOrder?'Pedido simulado':'Reserva simulada'}</h3><p>Has completado la prueba. ${isOrder?'El restaurante no ha recibido ningún pedido.':'No se ha reservado ninguna mesa.'} No se ha enviado información ni realizado ningún pago.</p><button class="btn btn-dark" data-close>Volver a la carta <span aria-hidden="true">→</span></button></div>`;
    openEl($('#confirmModal'));
  }
  function localDate() {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
  function reservationSubmit(e) {
    e.preventDefault();const fd=new FormData(e.currentTarget);let err='',invalid;
    const required=['date','time','people','name','phone'];
    const fields={date:$('#rDate'),time:$('#rTime'),people:$('#rPeople'),name:$('#rName'),phone:$('#rPhone')};
    Object.values(fields).forEach(f=>f.removeAttribute('aria-invalid'));
    const missing=required.find(k=>!String(fd.get(k)||'').trim());
    if(missing){err='Completa todos los campos obligatorios.';invalid=fields[missing];}
    else if(String(fd.get('date'))<localDate()){err='Elige una fecha de hoy en adelante.';invalid=fields.date;}
    else if(!Number.isInteger(Number(fd.get('people')))||Number(fd.get('people'))<1||Number(fd.get('people'))>20){err='Indica entre 1 y 20 personas para esta simulación.';invalid=fields.people;}
    else if(!/^[+()\d\s.-]{7,25}$/.test(String(fd.get('phone')).trim())||String(fd.get('phone')).replace(/\D/g,'').length<7){err='Introduce un teléfono de ejemplo válido, con al menos 7 dígitos.';invalid=fields.phone;}
    else if(!fields.date.validity.valid||!fields.time.validity.valid){err='Revisa la fecha y la hora.';invalid=!fields.date.validity.valid?fields.date:fields.time;}
    $('#reservationError').textContent=err;if(err){invalid.setAttribute('aria-invalid','true');invalid.focus();return;}
    const message=`RESERVA DE PRUEBA · NO ENVIADA\n\nFecha: ${String(fd.get('date')).split('-').reverse().join('/')}\nHora: ${fd.get('time')}\nPersonas: ${fd.get('people')}\nNombre: ${String(fd.get('name')).trim()}\nTeléfono: ${String(fd.get('phone')).trim()}${String(fd.get('notes')).trim()?'\nNotas: '+String(fd.get('notes')).trim():''}`;
    $('#reservationForm').hidden=true;
    $('#reservationPreview').innerHTML=`<p class="form-step">02 / REVISA TU RESERVA</p><h3>Tu próximo encuentro.</h3><div class="notice">La fecha y la hora son de ejemplo. No se comprueba disponibilidad ni se reserva una mesa.</div><div class="preview">${esc(message)}</div><div class="form-actions"><button class="btn btn-outline" id="editReservation">Editar reserva</button><button class="btn btn-dark" id="confirmReservation">Confirmar simulación</button></div>`;
    $('#editReservation').onclick=()=>{$('#reservationForm').hidden=false;$('#reservationPreview').innerHTML='';$('#rDate').focus();};
    $('#confirmReservation').onclick=()=>confirm('reserva');$('#confirmReservation').focus();
  }
  document.addEventListener('click',e=>{
    const d=e.target.closest('.detail-btn');if(d)detail(d.dataset.id);
    const o=e.target.closest('[data-open]');if(o){if(o.dataset.open==='cart')openEl($('#cartDrawer'));if(o.dataset.open==='reservation'){$('#rDate').min=localDate();openEl($('#reservationModal'));}}
    if(e.target.closest('[data-close]'))closeAll();
    const q=e.target.closest('[data-qty]');if(q){readOrderState();const id=q.dataset.qty,delta=Number(q.dataset.delta);cart[id]=Math.max(0,Math.min(20,(cart[id]||0)+delta));if(!cart[id])delete cart[id];save();(document.querySelector(`[data-qty="${id}"][data-delta="${delta}"]:not(:disabled)`)||document.querySelector(`[data-qty="${id}"]:not(:disabled)`)||$('#cartDrawer [data-close]')).focus();}
    const quick=e.target.closest('[data-add]');if(quick)add(quick.dataset.add);
    const detailAdd=e.target.closest('#addDetail');if(detailAdd){const n=Number($('#detailQty').value);if(!Number.isInteger(n)||n<1||n>20){$('#detailError').textContent='Elige una cantidad entera entre 1 y 20.';$('#detailQty').focus();return;}add(detailAdd.dataset.id,n,true);}
    const chip=e.target.closest('.chip');if(chip){$$('.chip').forEach(x=>{x.classList.toggle('active',x===chip);x.setAttribute('aria-pressed',String(x===chip));});filter=chip.dataset.filter;$('#search').value='';renderProducts();}
    if(e.target.closest('#clearSearch')){$('#search').value='';$$('.chip')[0].click();$('#search').focus();}
  });
  document.addEventListener('keydown',e=>{
    if(!activeDialog)return;
    if(e.key==='Escape'){e.preventDefault();closeAll();return;}
    if(e.key==='Tab'){
      const focusable=[...activeDialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),textarea,select,[tabindex="0"]')].filter(n=>n.getClientRects().length);
      const first=focusable[0],last=focusable.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
  });
  document.addEventListener('input',e=>{if(e.target.id==='detailQty'){const n=Number(e.target.value),id=$('#addDetail').dataset.id;$('#addDetail span').textContent=euro(byId[id].price*(Number.isInteger(n)&&n>0?n:1));}});
  $('#search').addEventListener('input',renderProducts);
  $('#checkoutBtn').addEventListener('click',()=>{readOrderState();checkoutForm();$('#orderForm input')?.focus();});
  $('#reservationForm').addEventListener('submit',reservationSubmit);
  $('#rDate').min=localDate();
  $$('.modal,.drawer').forEach(el=>el.inert=true);
  $('#cartDrawer').setAttribute('role','dialog');$('#cartDrawer').setAttribute('aria-modal','true');
  renderProducts();renderCart();
})();
