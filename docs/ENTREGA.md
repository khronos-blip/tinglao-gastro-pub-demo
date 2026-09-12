# Entrega pública · 12 de septiembre de 2026

Web principal: https://tinglao.khronosonline.work/

Versión Cloudflare: `0fba460d-acfd-4072-8234-bc27c94a51a6`.

Diseño editorial en verde, marfil y cobre; iconos SVG sin emojis. 53 platos con imagen: dos fotos originales y 50 imágenes generadas con ImageGen para 51 entradas. Los prompts y correspondencias están en `image-prompts.json` y `media.js`. Versiones WebP de 480/960 px, fuentes locales y carga diferida de la carta.

Validación pública: 85 comprobaciones en Chromium y 85 en WebKit; 118 verificaciones de archivos/entradas/ruta inexistente. Se verificaron HTTPS público, ausencia de login, cuatro anchos de 390 a 1440 px, búsqueda, carrito, cantidades, persistencia, pedido y reserva simulados, teclado y ausencia de errores de navegador. Los enlaces con UTM y fbclid devuelven la misma página sin redirecciones. Informes en `qa/premium/live-*.json`.

La prueba se ejecutó desde España. No constituye una comprobación de cada operador o dispositivo en Venezuela. No se configuró ninguna restricción geográfica de acceso.

Reservas y pedidos son simulados; no se envían datos ni se procesan pagos. Los precios de referencia y nombres originales se conservan. Las imágenes generadas son ilustrativas y así se identifican.

## Detalles Liquid Glass

Actualización del 12 de septiembre: controles con bordes luminosos y reflejos suaves, navegación/filtros translúcidos, barra flotante en móvil y formularios con acabado de cristal. Inspiración: https://developer.apple.com/design/human-interface-guidelines/materials. Implementación CSS, con fondos sólidos de respaldo y adaptación a las preferencias de contraste/transparencia.

Versión Cloudflare: `65ca3f17-3033-47bb-ba3c-b005b4a493c0`. Las 85 comprobaciones existentes pasaron en Chromium y WebKit. Se revisaron además los anchos 320 y 360 px. Evidencia en `qa/liquid-glass/`.

## Coctelería y reserva demo completa

Actualización del 12 de septiembre: se retiran las etiquetas de origen de las fotos de la portada, las tarjetas y los detalles. Se conservan los avisos generales de demo y el registro documental de procedencia.

25 imágenes nuevas generadas individualmente con ImageGen para los 23 cócteles y dos jarras de sangría. Acceso directo a Cócteles, tarjetas con fotografías, detalle y adición al pedido. Archivos WebP 480/960 px en `assets/cocktails/`; prompts en `docs/cocktail-prompts.json`.

La reserva permite revisar, confirmar con referencia DEMO, consultar, modificar y cancelar durante la visita. Usa fecha/hora de Venezuela, rechaza horas pasadas y no almacena datos personales de forma persistente. Al recargar la página se reinicia. Sigue sin comprobar disponibilidad real ni enviar información al restaurante.

Versión Cloudflare: `665ff86f-de24-4ab0-947b-77cfff002ce9`. Pruebas completas de 101 comprobaciones en Chromium y WebKit; 10 pruebas específicas por motor para reservas. Verificación pública de 168 archivos/entradas/rutas. Evidencia en `qa/cocktails-reservations/`.

## Navegación móvil compacta

Cabecera de 62 px con Reservar y Mi pedido, sin acciones duplicadas en el borde inferior. El aviso inicial de demo se desplaza con la página y la cabecera mantiene el indicador DEMO. Categorías y buscador comparten una fila de 56 px; la lupa abre la búsqueda y el cierre o Escape devuelve los filtros. Elegir categoría o buscar coloca los resultados bajo los controles.

En 390 × 844 px, el área ocupada por controles persistentes se reduce de 302 a 118 px: 184 px recuperados para la carta. Comprobaciones específicas en 320, 360, 390, 430 y 768 px: geometría, objetivos táctiles, buscador, foco y acciones de cabecera.

Versión Cloudflare: `e26f5f3d-131c-409e-b514-c0030843c844`. La suite completa superó 101 comprobaciones por motor y la revisión específica de navegación, 46 por motor. Evidencia en `qa/compact-navigation/`.
