# Tinglao Gastro Pub — demo premium

Demo conceptual y no oficial de un storefront para Tinglao Gastro Pub, Valencia (Venezuela).

## Ver la demo

- GitHub Pages: https://khronos-blip.github.io/tinglao-gastro-pub-demo/

## Ejecutar localmente

```bash
python3 -m http.server 8080
```

Abre `http://127.0.0.1:8080/`.

## Alcance implementado

- Identidad visual propia basada en la presencia pública de Tinglao.
- Catálogo de muestra con dos correspondencias nombre–foto verificables: Pulpo a la gallega y Tarta Vasca.
- Carta oficial completa conservada como PDF local.
- Búsqueda, filtros, detalle, cantidades, carrito persistente y subtotal.
- Flujos simulados de retiro/entrega, reserva y vista previa de mensajes para WhatsApp.
- La demo no envía pedidos, reservas ni datos al negocio.
- CTA comercial separado hacia Gustavo/Gviso Web.

## Transparencia

**Página web demo · Sitio no oficial · Pedidos y reservas simulados.**

No existe afiliación ni aprobación declarada por Tinglao Gastro Pub. Las marcas, fotografías y contenido original pertenecen a sus respectivos titulares y se incluyen únicamente para presentar esta demo conceptual. No se concede una licencia de reutilización sobre esos activos.

## QA

La versión inicial superó 20/20 comprobaciones funcionales automatizadas:

- desktop 1440×1000 y móvil 390×844;
- cero errores de consola y de página;
- cero solicitudes fallidas o fuera de origen;
- cero desbordamiento horizontal;
- carrito, persistencia, entrega, reserva y confirmaciones simuladas;
- HTML/DOM, referencias locales y JavaScript verificados.

Los reportes y capturas están en [`qa/`](qa/).

## Encargo para Codex

Revisa y mejora la dirección visual sin romper los flujos ni los gates. Prioridades:

1. elevar tipografía, ritmo, microinteracciones y composición manteniendo el hero compacto;
2. conservar verde botella, crema, cobre, carbón y el carácter botánico/nocturno;
3. mantener el disclosure no oficial siempre visible;
4. no inventar productos, descripciones, horarios, reseñas, dirección ni servicios;
5. no añadir dependencias, CDN, analítica, APIs, pagos ni envíos reales;
6. conservar accesibilidad, `prefers-reduced-motion` y funcionamiento estático;
7. probar a 390, 768, 1024 y 1440 px, sin overflow ni errores de consola.

Antes de cerrar cualquier mejora, vuelve a probar búsqueda, filtros, detalle, dos artículos, subtotal, persistencia, retiro/entrega, dirección obligatoria, reserva y ambas confirmaciones.
