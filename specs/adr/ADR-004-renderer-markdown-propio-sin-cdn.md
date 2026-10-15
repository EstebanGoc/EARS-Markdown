# ADR-004: Renderer de Markdown propio, sin CDN

**Estado:** Aceptado · **Fecha:** 2026-10-15

## Contexto
El preview debe poder verse renderizado (REQ-011), funcionar sin red (REQ-028) y no interpretar como HTML el texto del usuario (REQ-015). El Markdown que genera la herramienta usa un subconjunto conocido: encabezados, listas, tablas, negrita, cursiva, código en línea, citas y enlaces.

## Decisión
Se implementa en `app.js` un renderer mínimo (`renderMarkdown`) que primero escapa todo el HTML (`& < > " '`) y después transforma solo ese subconjunto. Un `<br>` literal dentro de celdas (REQ-016) se convierte en salto de línea después del escape. Los enlaces solo aceptan `http(s):`, rutas relativas o anclas.

## Alternativas consideradas
| Opción | Pros | Contras |
|---|---|---|
| marked + DOMPurify por CDN | Completo y robusto | Requiere red; dos dependencias |
| Copiar marked en el repo | Funciona offline | Código de terceros que hay que mantener; igual necesita sanitizar |
| Solo vista cruda (`<pre>`) | Trivial y seguro | Peor experiencia para revisar la spec |

## Consecuencias
- (+) Funciona offline y es seguro por construcción (escapar primero).
- (−) No soporta Markdown arbitrario (listas anidadas, bloques de código con lenguaje). Basta porque el documento lo genera la propia herramienta; el resultado real se ve en el destino donde se pegue.
