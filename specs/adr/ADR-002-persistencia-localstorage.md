# ADR-002: Persistencia en localStorage

**Estado:** Aceptado · **Fecha:** 2026-10-15

## Contexto
El usuario no debe perder lo escrito si recarga o cierra la pestaña (REQ-020, REQ-021). No hay backend (ADR-001) y una spec típica pesa unos pocos KB.

## Decisión
El estado completo se guarda como JSON en `localStorage['ears-spec-v1']`, con un debounce de 300 ms. Toda lectura y escritura va dentro de `try/catch`. Al cargar, el estado guardado se combina con el estado por defecto para tolerar cambios de esquema. Si algo falla, se trabaja en memoria y se muestra un aviso (REQ-022).

## Alternativas consideradas
| Opción | Pros | Contras |
|---|---|---|
| IndexedDB | Más capacidad, asíncrono | API más compleja; innecesario para unos pocos KB |
| Sin persistencia | Más simple | Se pierde el trabajo al recargar |
| Backend | Multi-dispositivo y compartir | Contradice ADR-001; requiere auth e infraestructura |

## Consecuencias
- (+) El trabajo sobrevive a recargas, sin infraestructura.
- (−) Los datos viven solo en ese navegador y ese dispositivo; el Markdown exportado es la forma de compartir.
- (−) Una sola spec activa por navegador (ver No-objetivos).
- La versión en la clave (`-v1`) permite migraciones futuras.
