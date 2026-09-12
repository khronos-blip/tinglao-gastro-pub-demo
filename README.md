# Tinglao Gastro Pub — demo para presentar

Demo conceptual y no oficial para Tinglao Gastro Pub, Valencia (Venezuela). No existe afiliación ni aprobación declarada por el restaurante.

**Dominio público principal:** https://tinglao.khronosonline.work/

**Copia en GitHub Pages:** https://khronos-blip.github.io/tinglao-gastro-pub-demo/

## Experiencia

- Dirección visual premium en verde nocturno, marfil y cobre. Cormorant Garamond y Manrope alojadas localmente, iconos SVG uniformes (sin emojis), portada editorial y carta fotográfica adaptable. Detalles inspirados en Liquid Glass: navegación y filtros translúcidos, controles con reflejos y barra flotante en móvil; fondos sólidos cuando se solicita más contraste o menos transparencia.
- Carta digital con **113 opciones en 22 secciones**, transcritas de las dos páginas de `menu-oficial.pdf`. Selección inicial de 12 platos, categorías y búsqueda global que ignora tildes.
- Los importes están en EUR como en el PDF. Son precios de referencia del documento, sin afirmar vigencia o disponibilidad.
- Los 53 platos tienen imagen: pulpo y tarta conservan sus fotografías originales; los 51 restantes usan 50 imágenes de IA creadas individualmente, compartiendo únicamente Chicken Burger entre carta y menú peques. Se presentan como ilustrativas, sin atribuir recetas, ingredientes o emplatados al restaurante. Las bebidas conservan su presentación textual.
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
- `media.js`: correspondencias de imágenes, versiones adaptadas y avisos de origen.
- `docs/image-prompts.json`: prompts y registro de las imágenes generadas con ImageGen.
- `assets/dishes/`: imágenes WebP en 960 y 480 px.
- `assets/fonts/`: tipografías locales y licencias SIL OFL.
- `wrangler.jsonc` y `scripts/prepare-deploy.mjs`: publicación estática del subdominio de Khronos.
- `app.js`: catálogo, carrito, validación y simulaciones.
- `menu-oficial.pdf`: documento original conservado sin modificaciones.
- `assets/`: fotografías originales conservadas.

La web no requiere dependencias de ejecución ni conexiones a CDN. GitHub Pages sirve `main` desde la raíz. El subdominio principal sirve el paquete de archivos públicos preparado en `dist/`, sin backend ni controles de acceso. Los archivos de QA, Git y herramientas de desarrollo no se incluyen en ese paquete.

## Ejecutar localmente

```sh
python3 -m http.server 4186 --bind 127.0.0.1
```

Abre `http://127.0.0.1:4186/`.

## Publicar en el subdominio

```sh
node scripts/prepare-deploy.mjs
npx wrangler deploy --config wrangler.jsonc
```

Usar únicamente la sesión autorizada de Cloudflare. El dominio personalizado cubre también enlaces con parámetros de campaña, sin modificar otros dominios de Khronos. Verificar el estado del despliegue y la web pública antes de entregar.

## Verificación

Esta revisión ha superado **85 comprobaciones en Chromium y 85 en WebKit** tanto en local como en https://tinglao.khronosonline.work/. La publicación también superó 118 verificaciones de archivos, entradas con parámetros y página inexistente. Incluye fotografías completas, iconos y tipografías locales. Cubre: 390, 768, 1024 y 1440 px, categorías, búsqueda, detalle, dos productos, cantidades, decimales, persistencia y recuperación de almacenamiento corrupto, retiro/entrega, edición de revisiones, validación de reservas, confirmaciones, teclado y movimiento reducido. Sin desbordamiento horizontal, errores de navegador, solicitudes externas ni envío de datos.

La evidencia `qa/redesign/` corresponde al primer rediseño; `qa/qa-report.json` y `qa/screenshots/` corresponden a la versión inicial. La nueva revisión utiliza `qa/premium/` para la validación local y los informes `qa/premium/live-*.json` para el subdominio publicado.

Para repetir las pruebas con una instalación existente de Playwright (solo herramienta de QA, no dependencia de la web):

```sh
PLAYWRIGHT_MODULE=/ruta/a/playwright CHROME_PATH=/ruta/al/ejecutable/chrome node qa/verify.mjs
```

Variables opcionales: `QA_BROWSER=webkit` para probar el motor de Safari; `QA_URL` para verificar la web pública y `QA_OUTPUT` para guardar la evidencia en otra carpeta. La prueba no pulsa el enlace de contacto comercial.

## Criterios que deben conservarse

Mantener la transparencia de la demo, el funcionamiento estático, los precios y nombres del documento, las correspondencias fotográficas verificadas y la separación del contacto comercial. No activar reservas, pedidos, pagos, entregas ni servicios reales sin el alcance y los canales autorizados del restaurante.
