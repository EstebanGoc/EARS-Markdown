# Formulario de Specs EARS → Markdown
> Esteban Gómez · 2026-10-15 · Draft

## 1. Problema

### Enunciado
Las especificaciones de software se escriben sin una estructura consistente. Los requisitos quedan ambiguos ("el sistema debe ser rápido"), faltan criterios de aceptación verificables, no se explicitan los casos borde ni lo que queda fuera del alcance, y las decisiones de arquitectura no quedan registradas. El resultado es retrabajo, discusiones en el code review y specs que ni una persona ni una IA pueden implementar sin hacer suposiciones.

### Usuarios
- Desarrolladores, tech leads y product owners que redactan specs antes de implementar (Spec-Driven Development).
- Equipos que le entregan specs a agentes de IA para implementar.

### ¿Por qué ahora?
El equipo está adoptando SDD y necesita que todas las specs tengan el mismo formato, con requisitos EARS trazables a criterios y a verificación, sin depender de que cada persona recuerde la plantilla.

### Contexto
La herramienta es una página web estática que guía el llenado sección por sección y produce un único documento Markdown. Ese documento se copia con un botón y se pega en un PR, un ticket, Notion o el repositorio.

## 2. Requisitos (EARS)
Sistema por defecto: **el formulario**

**Estructura y edición**
- **REQ-001** _(Ubicuo)_: El formulario deberá presentar, en este orden, las secciones Metadatos, Problema, Requisitos, Criterios de aceptación, Casos borde, No-objetivos, Verificación y ADRs.
- **REQ-002** _(Evento)_: Cuando el usuario pulse Agregar, Eliminar, Subir o Bajar en una lista (requisitos, criterios, casos borde, no-objetivos, verificación, ADRs o alternativas de un ADR), el formulario deberá agregar, eliminar o mover el elemento correspondiente.
- **REQ-003** _(Ubicuo)_: El formulario deberá asignar a requisitos, criterios y ADRs IDs secuenciales con prefijo `REQ-`, `AC-` y `ADR-` y al menos 3 dígitos (p. ej. `REQ-001`).
- **REQ-004** _(Evento)_: Cuando el usuario elimine o reordene un requisito, el formulario deberá renumerar los IDs de forma secuencial y actualizar las referencias a ese requisito en criterios y verificación.
- **REQ-005** _(Evento)_: Cuando el usuario elimine un requisito, el formulario deberá quitar ese requisito de las referencias de todos los criterios y verificaciones.

**EARS**
- **REQ-006** _(Evento)_: Cuando el usuario seleccione un tipo EARS (Ubicuo, Evento, Estado, Opcional, No deseado, Complejo) en un requisito, el formulario deberá mostrar únicamente los campos de ese tipo.
- **REQ-007** _(Evento)_: Cuando el usuario modifique un campo de un requisito, el formulario deberá mostrar debajo la frase EARS compuesta en el idioma activo.
- **REQ-008** _(Opcional)_: Donde esté definido un "Sistema por defecto", el formulario deberá usarlo como sujeto de los requisitos cuyo campo Sistema esté vacío.
- **REQ-009** _(No deseado)_: Si la respuesta de un requisito contiene un término de la lista de términos vagos, entonces el formulario deberá mostrar junto al campo un aviso no bloqueante que nombre el término detectado.

**Preview y Markdown**
- **REQ-010** _(Evento)_: Cuando cambie cualquier dato del formulario, el formulario deberá regenerar el Markdown del panel de preview.
- **REQ-011** _(Evento)_: Cuando el usuario alterne entre vista "Markdown" y "Renderizado" en el preview, el formulario deberá mostrar el texto Markdown crudo o su versión renderizada como HTML.
- **REQ-012** _(Ubicuo)_: El formulario deberá omitir del Markdown generado las secciones que no tengan contenido.
- **REQ-013** _(Ubicuo)_: El formulario deberá incluir en el Markdown una matriz de trazabilidad con, por cada requisito, los criterios y verificaciones que lo referencian.
- **REQ-014** _(Complejo)_: Mientras exista al menos un requisito, cuando un requisito no tenga criterios o no tenga verificaciones que lo referencien, el formulario deberá marcar su fila de la matriz con ⚠️.
- **REQ-015** _(Ubicuo)_: El formulario deberá escapar el texto ingresado por el usuario al renderizar el preview, de modo que nunca se interprete como HTML.
- **REQ-016** _(Ubicuo)_: El formulario deberá escapar los caracteres `|` y reemplazar los saltos de línea por `<br>` en el contenido de las celdas de tablas Markdown.

**Exportar**
- **REQ-017** _(Evento)_: Cuando el usuario pulse "Copy Markdown", el formulario deberá copiar al portapapeles el Markdown completo y mostrar una confirmación durante 2 segundos.
- **REQ-018** _(No deseado)_: Si la API de portapapeles no está disponible o falla, entonces el formulario deberá copiar mediante un textarea temporal y `execCommand('copy')`; y si eso también falla, deberá seleccionar el texto del preview y pedir al usuario que copie manualmente.
- **REQ-019** _(Evento)_: Cuando el usuario pulse "Descargar .md", el formulario deberá descargar un archivo cuyo nombre sea el título en formato slug con extensión `.md`.

**Persistencia**
- **REQ-020** _(Evento)_: Cuando cambie cualquier dato del formulario, el formulario deberá guardar el estado en `localStorage` 300 ms después de la última modificación.
- **REQ-021** _(Evento)_: Cuando se cargue la página, el formulario deberá restaurar el estado guardado.
- **REQ-022** _(No deseado)_: Si `localStorage` no está disponible, no tiene espacio o contiene datos inválidos, entonces el formulario deberá funcionar con el estado en memoria y mostrar un aviso no bloqueante.
- **REQ-023** _(Evento)_: Cuando el usuario pulse "Limpiar" y lo confirme, el formulario deberá vaciar el estado y el almacenamiento.
- **REQ-024** _(Evento)_: Cuando el usuario pulse "Cargar ejemplo", el formulario deberá reemplazar el estado por la spec de ejemplo "Recuperación de contraseña" en el idioma activo, pidiendo antes confirmación si hay datos.

**Idioma, apariencia y entorno**
- **REQ-025** _(Evento)_: Cuando el usuario cambie el idioma (ES/EN), el formulario deberá traducir la interfaz, las plantillas EARS y los encabezados del Markdown, conservando el contenido ingresado.
- **REQ-026** _(Estado)_: Mientras el ancho de la ventana sea menor a 768 px, el formulario deberá mostrar una sola columna con pestañas Formulario/Preview y sin scroll horizontal.
- **REQ-027** _(Estado)_: Mientras el sistema operativo esté en modo oscuro, el formulario deberá usar la paleta oscura.
- **REQ-028** _(Ubicuo)_: El formulario deberá funcionar al abrir `index.html` desde `file://` sin conexión a red ni paso de build.

**Guía para quien llena la spec**
- **REQ-029** _(Evento)_: Cuando el usuario seleccione un tipo EARS en un requisito, el formulario deberá mostrar bajo el selector, en el idioma activo, cuándo usar ese tipo y una frase de ejemplo.
- **REQ-030** _(Ubicuo)_: El formulario deberá mostrar en cada campo vacío de requisitos, criterios, casos borde, no-objetivos, verificación y ADRs un texto de ejemplo (placeholder) en el idioma activo.
- **REQ-031** _(Ubicuo)_: El formulario deberá ofrecer como ejemplo un caso de negocio que no sea la propia herramienta, que use los 6 tipos EARS y en el que todos los requisitos tengan al menos un criterio y una verificación.

## 3. Criterios de aceptación
- **AC-001** (REQ-001) — **Dado** la página recién abierta, **cuando** el usuario recorre el panel izquierdo, **entonces** ve las 8 secciones en el orden indicado.
- **AC-002** (REQ-002, REQ-003) — **Dado** una lista de requisitos vacía, **cuando** el usuario pulsa Agregar tres veces, **entonces** aparecen REQ-001, REQ-002 y REQ-003.
- **AC-003** (REQ-004, REQ-005) — **Dado** REQ-001..REQ-003, con AC-001 referenciando REQ-002 y REQ-003, **cuando** el usuario elimina REQ-001, **entonces** quedan REQ-001 y REQ-002 (los antiguos 2 y 3) y AC-001 referencia REQ-001 y REQ-002.
- **AC-004** (REQ-004) — **Dado** REQ-001 "A" y REQ-002 "B", **cuando** el usuario sube "B", **entonces** "B" pasa a ser REQ-001 y las referencias lo siguen.
- **AC-005** (REQ-006) — **Dado** un requisito de tipo Ubicuo, **cuando** el usuario cambia el tipo a Evento, **entonces** aparece el campo Disparador; y al cambiarlo a Estado, el campo Disparador se oculta y aparece Estado.
- **AC-006** (REQ-007, REQ-025) — **Dado** un requisito Evento con disparador "el usuario guarda" y respuesta "persistir el borrador", **cuando** el idioma es ES, **entonces** la frase es "Cuando el usuario guarda, el formulario deberá persistir el borrador"; y en EN es "When el usuario guarda, el formulario shall persistir el borrador" (las plantillas no agregan artículo: el sujeto se usa tal como se escribió).
- **AC-007** (REQ-008) — **Dado** un Sistema por defecto "la API" y un requisito con el campo Sistema vacío, **cuando** se genera la frase, **entonces** el sujeto es "la API"; y si el requisito define "el worker", el sujeto es "el worker".
- **AC-008** (REQ-009) — **Dado** un requisito, **cuando** la respuesta contiene "rápido", **entonces** aparece un aviso que menciona "rápido" y el Markdown se sigue generando.
- **AC-009** (REQ-010, REQ-011) — **Dado** el preview abierto, **cuando** el usuario escribe en el título, **entonces** el encabezado `#` del preview se actualiza; y al alternar a "Renderizado" se ve como HTML.
- **AC-010** (REQ-012) — **Dado** un formulario con solo título y un requisito, **cuando** se genera el Markdown, **entonces** no aparecen los encabezados de Casos borde, No-objetivos, Verificación ni ADRs.
- **AC-011** (REQ-013, REQ-014) — **Dado** REQ-001 con AC y verificación, y REQ-002 sin AC, **cuando** se genera el Markdown, **entonces** la matriz muestra REQ-001 sin marca y REQ-002 con ⚠️.
- **AC-012** (REQ-015) — **Dado** un problema con el texto `<img src=x onerror=alert(1)>`, **cuando** se ve el preview renderizado, **entonces** el texto aparece literal y no se ejecuta nada.
- **AC-013** (REQ-016) — **Dado** una verificación cuya descripción tiene `a | b` y un salto de línea, **cuando** se genera la tabla, **entonces** la tabla conserva sus columnas.
- **AC-014** (REQ-017) — **Dado** un formulario con datos, **cuando** el usuario pulsa Copy Markdown y pega en un editor, **entonces** el texto pegado es idéntico al preview Markdown y se vio el toast "Copiado".
- **AC-015** (REQ-018) — **Dado** `navigator.clipboard` no disponible, **cuando** el usuario pulsa Copy Markdown, **entonces** el contenido igual se copia con el fallback.
- **AC-016** (REQ-019) — **Dado** el título "Login con SSO", **cuando** el usuario pulsa Descargar, **entonces** se descarga `login-con-sso.md`.
- **AC-017** (REQ-020, REQ-021) — **Dado** datos ingresados, **cuando** el usuario recarga la página, **entonces** los datos y el idioma siguen ahí.
- **AC-018** (REQ-022) — **Dado** `localStorage` con JSON inválido en la clave, **cuando** se abre la página, **entonces** carga vacía con un aviso y sin errores en consola que rompan la página.
- **AC-019** (REQ-023) — **Dado** datos ingresados, **cuando** el usuario pulsa Limpiar y confirma, **entonces** el formulario queda vacío y al recargar sigue vacío; y si cancela, nada cambia.
- **AC-020** (REQ-024) — **Dado** datos ingresados, **cuando** el usuario pulsa Cargar ejemplo, **entonces** se pide confirmación y, si acepta, todas las secciones quedan con el contenido de "Recuperación de contraseña"; y con el idioma EN, el ejemplo está en inglés ("Password recovery").
- **AC-021** (REQ-025) — **Dado** datos ingresados en ES, **cuando** el usuario cambia a EN, **entonces** etiquetas y encabezados están en inglés y el texto del usuario no cambia.
- **AC-022** (REQ-026) — **Dado** una ventana de 375 px de ancho, **cuando** se abre la página, **entonces** hay una columna con pestañas y no hay scroll horizontal.
- **AC-023** (REQ-027) — **Dado** el SO en modo oscuro, **cuando** se abre la página, **entonces** el fondo es oscuro y el texto es legible.
- **AC-024** (REQ-028) — **Dado** el equipo sin red, **cuando** se abre `index.html` con doble clic, **entonces** todo funciona.
- **AC-025** (REQ-029) — **Dado** un requisito, **cuando** el usuario cambia el tipo a Estado, **entonces** bajo el selector aparece "Se mantiene mientras dure una condición…" con un ejemplo que empieza con "Mientras"; y en EN el texto está en inglés.
- **AC-026** (REQ-030) — **Dado** un requisito Evento vacío, **cuando** el usuario mira el campo Disparador, **entonces** ve un ejemplo como placeholder ("p. ej. el usuario pulsa…" / "e.g. the user clicks…"); y lo mismo ocurre en Dado/Cuando/Entonces de un criterio nuevo.
- **AC-027** (REQ-031) — **Dado** el ejemplo cargado, **cuando** se genera el Markdown, **entonces** aparecen los 6 tipos EARS y la matriz de trazabilidad no tiene ningún ⚠️.

## 4. Casos borde
- **Caso:** Título vacío → **Esperado:** encabezado "Sin título" / "Untitled" y archivo `spec.md`.
- **Caso:** Título con tildes, ñ o símbolos ("Diseño: Pagos & Reembolsos") → **Esperado:** slug `diseno-pagos-reembolsos.md`.
- **Caso:** Requisito con todos los campos vacíos → **Esperado:** la frase muestra marcadores `<disparador>` / `<respuesta>` en el preview y el requisito se omite del Markdown.
- **Caso:** Criterio que referencia un requisito eliminado → **Esperado:** la referencia desaparece (REQ-005).
- **Caso:** Más de 999 requisitos → **Esperado:** los IDs siguen siendo únicos (`REQ-1000`).
- **Caso:** `localStorage` lleno (QuotaExceededError) → **Esperado:** aviso no bloqueante y se sigue trabajando en memoria.
- **Caso:** Texto con sintaxis Markdown (`**`, `#`, `` ` ``) en los campos → **Esperado:** se incluye tal cual en el Markdown (el usuario puede usar Markdown a propósito) y se escapa como HTML en el preview renderizado.
- **Caso:** Cambiar de idioma con contenido escrito en otro idioma → **Esperado:** solo cambian las plantillas y las etiquetas, no el contenido (frases mixtas aceptadas).
- **Caso:** Recargar o cerrar la pestaña antes de que pasen los 300 ms del debounce → **Esperado:** el último cambio se guarda igual (guardado inmediato en `pagehide`).
- **Caso:** Datos guardados con una versión anterior del esquema → **Esperado:** se combinan con el estado por defecto; los campos faltantes quedan vacíos.

## 5. No-objetivos
- Backend, cuentas de usuario o colaboración en tiempo real.
- Traducir automáticamente el contenido escrito por el usuario.
- Importar un `.md` existente para editarlo (posible v2).
- Validar gramaticalmente las frases EARS con NLP; solo se usan plantillas y la lista de términos vagos.
- Exportar a PDF, DOCX o integrar con Jira/Linear/Notion.
- Gestionar varias specs a la vez (una sola spec activa por navegador).

## 6. Verificación
| Método | Descripción | Cubre |
|---|---|---|
| Unitaria | `tests.js` (`node tests.js` o `tests.html`) ejecuta aserciones sobre funciones puras: `earsSentence`, `renumber`, `generateMarkdown`, `slugify`, `escapeCell`, `detectVague`, `exampleState` | REQ-003, REQ-004, REQ-005, REQ-007, REQ-008, REQ-009, REQ-012, REQ-013, REQ-014, REQ-016, REQ-019, REQ-024, REQ-029, REQ-030, REQ-031 |
| Manual | Recorrer AC-001..AC-027 en Chrome y Safari y marcar resultado en `tasks.md` | REQ-001..REQ-031 |
| Manual | DevTools a 375 px y modo oscuro emulado | REQ-026, REQ-027 |
| Manual | Abrir desde `file://` con Wi-Fi apagado | REQ-028 |
| Manual | Inyectar HTML/JS en campos y revisar preview renderizado | REQ-015 |

## 7. Matriz de trazabilidad
| Requisito | Criterios | Verificación |
|---|---|---|
| REQ-001 | AC-001 | Manual |
| REQ-002 | AC-002 | Manual |
| REQ-003 | AC-002 | Unitaria, Manual |
| REQ-004 | AC-003, AC-004 | Unitaria, Manual |
| REQ-005 | AC-003 | Unitaria, Manual |
| REQ-006 | AC-005 | Manual |
| REQ-007 | AC-006 | Unitaria, Manual |
| REQ-008 | AC-007 | Unitaria, Manual |
| REQ-009 | AC-008 | Unitaria, Manual |
| REQ-010 | AC-009 | Manual |
| REQ-011 | AC-009 | Manual |
| REQ-012 | AC-010 | Unitaria, Manual |
| REQ-013 | AC-011 | Unitaria, Manual |
| REQ-014 | AC-011 | Unitaria, Manual |
| REQ-015 | AC-012 | Manual |
| REQ-016 | AC-013 | Unitaria, Manual |
| REQ-017 | AC-014 | Manual |
| REQ-018 | AC-015 | Manual |
| REQ-019 | AC-016 | Unitaria, Manual |
| REQ-020 | AC-017 | Manual |
| REQ-021 | AC-017 | Manual |
| REQ-022 | AC-018 | Manual |
| REQ-023 | AC-019 | Manual |
| REQ-024 | AC-020 | Unitaria, Manual |
| REQ-025 | AC-006, AC-021 | Manual |
| REQ-026 | AC-022 | Manual |
| REQ-027 | AC-023 | Manual |
| REQ-028 | AC-024 | Manual |
| REQ-029 | AC-025 | Unitaria, Manual |
| REQ-030 | AC-026 | Unitaria, Manual |
| REQ-031 | AC-027 | Unitaria |

## 8. ADRs
- [ADR-001: HTML + JS puro, sin build](../adr/ADR-001-html-js-sin-build.md): Aceptado
- [ADR-002: Persistencia en localStorage](../adr/ADR-002-persistencia-localstorage.md): Aceptado
- [ADR-003: i18n ES/EN en el cliente](../adr/ADR-003-i18n-es-en-en-cliente.md): Aceptado
- [ADR-004: Renderer de Markdown propio, sin CDN](../adr/ADR-004-renderer-markdown-propio-sin-cdn.md): Aceptado
