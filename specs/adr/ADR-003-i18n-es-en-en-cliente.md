# ADR-003: i18n ES/EN en el cliente

**Estado:** Aceptado · **Fecha:** 2026-10-15

## Contexto
El equipo trabaja en español, pero muchas specs se comparten con equipos o agentes en inglés. EARS se definió originalmente en inglés ("shall"), y su versión en español ("deberá") es habitual en equipos hispanohablantes (REQ-025).

## Decisión
Se usa un diccionario `I18N = { es: {...}, en: {...} }` en `app.js` que cubre etiquetas de la UI, plantillas EARS, nombres de tipos y encabezados del Markdown. Los elementos estáticos de `index.html` usan el atributo `data-i18n="clave"`, y las partes dinámicas leen del diccionario al renderizar. El idioma se guarda en el estado. El contenido del usuario nunca se traduce.

Las plantillas EARS son funciones, no strings con huecos, porque el orden de las palabras difiere entre idiomas:
- ES: `Cuando ${trigger}, ${system} deberá ${response}`
- EN: `When ${trigger}, ${system} shall ${response}`

## Alternativas consideradas
| Opción | Pros | Contras |
|---|---|---|
| Solo español | Más simple | No sirve para compartir con equipos en inglés |
| Librería i18n (i18next) | Pluralización, formatos | Dependencia externa; contradice ADR-001 |
| Archivos JSON por idioma | Separación limpia | `fetch` de JSON no funciona desde `file://` |

## Consecuencias
- (+) Cambio de idioma instantáneo sin recargar.
- (−) Las frases pueden quedar mixtas si el usuario escribe en un idioma y exporta en otro (caso borde aceptado).
- (−) Cada etiqueta nueva debe agregarse en ambos idiomas; `tests.html` verifica que las claves de `es` y `en` coincidan.
