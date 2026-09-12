# Tinglao Gastro Pub — demo para presentar

Demo conceptual y no oficial para Tinglao Gastro Pub, Valencia (Venezuela). No existe afiliación ni aprobación declarada por el restaurante.

**Web pública:** https://khronos-blip.github.io/tinglao-gastro-pub-demo/

## Experiencia

- Dirección visual gastronómica en verde botella, crema y cobre, con fotografías originales, tipografía editorial y adaptación a móvil, tableta y escritorio.
- Carta digital con **113 opciones en 22 secciones**, transcritas de las dos páginas de `menu-oficial.pdf`. Selección inicial de 10 opciones, categorías y búsqueda global que ignora tildes.
- Los importes están en EUR como en el PDF. Son precios de referencia del documento, sin afirmar vigencia o disponibilidad.
- Solo Pulpo a la gallega y Tarta Vasca llevan fotografías de platos: son las correspondencias verificadas. Los demás productos se presentan en texto, sin fotografías prestadas ni ingredientes inventados.
- Detalle de cada producto, adición directa, cantidades, subtotales y carrito persistente en el navegador.
- Pedido simulado con retiro o entrega de ejemplo, dirección obligatoria en entrega, revisión, edición y confirmación local. La entrega no está verificada como servicio real.
- Reserva simulada con validación de fecha, cantidad de personas y teléfono; revisión y edición antes de confirmar. No comprueba horarios, capacidad ni disponibilidad. El límite de 20 personas/unidades es únicamente una restricción de la demo.
- Acceso rápido a pedido y reserva en móvil. Diálogos con foco contenido, devolución de foco, cierre con Escape y fondo inerte. Compatibilidad con movimiento reducido.

## Límites de la demo

**Demo no oficial · Pedidos y reservas simulados.** El aviso permanece visible incluso al abrir los formularios.

No se abren WhatsApp ni pasarelas de pago desde los flujos del restaurante. No hay backend, analítica, APIs, autenticación ni recepción real de solicitudes. Los formularios indican que se usen datos ficticios. Solo se guarda el contenido del carrito en `localStorage`; direcciones y datos de reserva no se persisten.

El único enlace externo comercial corresponde a Gustavo/Gviso Web y está separado de los flujos del restaurante. Un clic voluntario permite conversar sobre la propuesta de web, nunca enviar el pedido o la reserva.

Las marcas, fotografías y carta pertenecen a sus titulares. Consulta [ASSET-NOTICE.md](ASSET-NOTICE.md). La demo no concede licencias de reutilización.

## Archivos

- `index.html`: estructura, navegación y formularios.
- `styles.css`: presentación adaptable y estados de la interfaz.
- `menu.js`: transcripción de la carta y referencias de precios.
- `app.js`: catálogo, carrito, validación y simulaciones.
- `menu-oficial.pdf`: documento original conservado sin modificaciones.
- `assets/`: fotografías originales conservadas.

No se añaden dependencias, CDN ni proceso de compilación. GitHub Pages sirve `main` desde la raíz.

## Ejecutar localmente

```sh
python3 -m http.server 4186 --bind 127.0.0.1
```

Abre `http://127.0.0.1:4186/`.

## Verificación

El rediseño superó **81 comprobaciones**: 390, 768, 1024 y 1440 px, categorías, búsqueda, detalle, dos productos, cantidades, decimales, persistencia y recuperación de almacenamiento corrupto, retiro/entrega, edición de revisiones, validación de reservas, confirmaciones, teclado y movimiento reducido. Sin desbordamiento horizontal, errores de navegador, solicitudes externas ni envío de datos.

Evidencia local: [`qa/redesign/report.json`](qa/redesign/report.json) y capturas `qa/redesign/home-*.png`. La evidencia `qa/qa-report.json` y `qa/screenshots/` corresponde a la versión inicial.

Para repetir las pruebas con una instalación existente de Playwright (solo herramienta de QA, no dependencia de la web):

```sh
PLAYWRIGHT_MODULE=/ruta/a/playwright CHROME_PATH=/ruta/al/ejecutable/chrome node qa/verify.mjs
```

Variables opcionales: `QA_URL` para verificar la web pública y `QA_OUTPUT` para guardar la evidencia en otra carpeta. La prueba no pulsa el enlace de contacto comercial.

## Criterios que deben conservarse

Mantener la transparencia de la demo, el funcionamiento estático, los precios y nombres del documento, las correspondencias fotográficas verificadas y la separación del contacto comercial. No activar reservas, pedidos, pagos, entregas ni servicios reales sin el alcance y los canales autorizados del restaurante.
