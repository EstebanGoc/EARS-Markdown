# ADR-001: HTML + JS puro, sin build

**Estado:** Aceptado · **Fecha:** 2026-10-15

## Contexto
La herramienta es un formulario de una sola página, sin backend. Debe poder abrirse con doble clic, compartirse como archivos sueltos y publicarse en cualquier hosting estático (REQ-028). El equipo quiere poder modificarla sin aprender un toolchain.

## Decisión
Se implementa con tres archivos (`index.html`, `styles.css` y `app.js`), sin dependencias y sin paso de build. `app.js` es un script clásico, no un módulo ES, para que funcione desde `file://`. Las funciones puras se exponen en `window.EarsCore` para poder testearlas desde `tests.html`.

## Alternativas consideradas
| Opción | Pros | Contras |
|---|---|---|
| React + Vite | Componentes, ecosistema, escala bien | Requiere npm y build; no abre desde `file://` sin compilar |
| Next.js | Backend y auth a futuro | Sobredimensionado para una página estática |
| Web Components | Encapsulación nativa | Más ceremonia para un formulario simple |

## Consecuencias
- (+) Cero instalación; se abre en cualquier navegador moderno.
- (+) El código fuente es el mismo que se ejecuta, lo que facilita depurarlo.
- (−) El renderizado de listas dinámicas se hace a mano (re-render por sección). Hay que cuidar no perder el foco del input al re-renderizar: solo se re-renderiza la lista cuando cambia su estructura, no al escribir.
- (−) Si la herramienta crece mucho (varias specs, backend), habrá que revisar esta decisión.
