# Tareas: 001 Formulario de Specs EARS

Fuente de verdad: [spec.md](spec.md). Cada tarea indica los REQ que cubre. Se marca `[x]` al terminar.

## Núcleo (funciones puras en `app.js` → `window.EarsCore`)
- [x] **T01** Estado por defecto, `I18N` es/en y `mergeState` para tolerar esquemas viejos (REQ-003, REQ-025, REQ-022)
- [x] **T02** `earsSentence(req, lang, defaultSystem)` para los 6 tipos, con marcadores si faltan campos (REQ-007, REQ-008)
- [x] **T03** `detectVague(text)` con la lista de términos vagos ES/EN; revisa ambos idiomas porque el contenido puede ser mixto (REQ-009)
- [x] **T04** `renumber(state)`: las referencias guardan un `uid` interno y los IDs visibles se derivan de la posición (REQ-003, REQ-004, REQ-005)
- [x] **T05** `generateMarkdown(state)`: secciones, omisión de las vacías, matriz con ⚠️ y `escapeCell` (REQ-012, REQ-013, REQ-014, REQ-016)
- [x] **T06** `slugify(title)` / `fileName(title)` (REQ-019)
- [x] **T07** `renderMarkdown(md)` con escape previo (REQ-011, REQ-015)
- [x] **T08** `tests.js` (Node y `tests.html`) con aserciones para T01–T07, incluida la paridad de claves I18N

## UI
- [x] **T09** `index.html`: layout de dos columnas, barra superior y las 8 secciones colapsables con `data-i18n` (REQ-001)
- [x] **T10** `styles.css`: tokens de color, modo oscuro y responsive < 768 px con pestañas (REQ-026, REQ-027)
- [x] **T11** Render de listas dinámicas con Agregar/Eliminar/Subir/Bajar, sin perder el foco al escribir (REQ-002)
- [x] **T12** Editor de requisito con campos según el tipo, frase en vivo y aviso de términos vagos (REQ-006, REQ-007, REQ-009)
- [x] **T13** Checkboxes de referencias a REQ en criterios y verificación (REQ-005, REQ-013)
- [x] **T14** Editor de ADR con alternativas repetibles (REQ-002)
- [x] **T15** Preview en vivo con toggle Markdown/Renderizado (REQ-010, REQ-011)

## Acciones y persistencia
- [x] **T16** Copy Markdown con fallbacks y toast (REQ-017, REQ-018)
- [x] **T17** Descargar .md (REQ-019)
- [x] **T18** Autoguardado con debounce, guardado inmediato en `pagehide`, restauración y aviso de error (REQ-020, REQ-021, REQ-022)
- [x] **T19** Limpiar y Cargar ejemplo con confirmación; el ejemplo se basa en esta spec (REQ-023, REQ-024)
- [x] **T20** Toggle ES/EN (REQ-025)
- [x] **T21** `README.md` con instrucciones de uso y el flujo SDD

## Verificación
- [x] **T22** `node tests.js` en verde: 29/29
- [x] **T23** AC-001..AC-027 recorridos de forma automática en Chrome headless (Playwright): 52/52 checks
- [ ] **T24** Pasada manual en Safari y en Chrome real (portapapeles y descarga en un navegador con UI)

## Iteración 2: guía para quien llena la spec
- [x] **T25** I18N: `typeHelp` (cuándo usar cada tipo + ejemplo) y `ex` (placeholders) en ES/EN (REQ-029, REQ-030)
- [x] **T26** Mostrar la ayuda del tipo bajo el selector y los placeholders en todos los editores de listas; Disparador, Estado y Funcionalidad pasan a campos de varias líneas para que no se corte el texto (REQ-029, REQ-030)
- [x] **T27** Reemplazar el ejemplo por "Recuperación de contraseña" en ES y EN, con los 6 tipos y cobertura completa (REQ-024, REQ-031)
- [x] **T28** Tests unitarios y e2e para AC-020, AC-025, AC-026 y AC-027

### Resultados de AC (2026-10-15, Chrome headless)
| AC | Resultado | Nota |
|---|---|---|
| AC-001 | ✅ | |
| AC-002 | ✅ | El foco va al nuevo requisito |
| AC-003 | ✅ | |
| AC-004 | ✅ | |
| AC-005 | ✅ | |
| AC-006 | ✅ | El foco no se pierde al escribir |
| AC-007 | ✅ | |
| AC-008 | ✅ | |
| AC-009 | ✅ | |
| AC-010 | ✅ | Test unitario |
| AC-011 | ✅ | |
| AC-012 | ✅ | `<img onerror>` y `<script>` se muestran literales |
| AC-013 | ✅ | |
| AC-014 | ✅ | Portapapeles idéntico al preview; el toast se oculta a los 2 s |
| AC-015 | ✅ | Con `navigator.clipboard` deshabilitado |
| AC-016 | ✅ | `login-con-sso.md` |
| AC-017 | ✅ | Se detectó y corrigió la pérdida del último cambio si se recargaba antes de 300 ms (guardado en `pagehide`) |
| AC-018 | ✅ | |
| AC-019 | ✅ | |
| AC-020 | ✅ | "Recuperación de contraseña" en ES y "Password recovery" en EN |
| AC-021 | ✅ | |
| AC-022 | ✅ | 375 px sin scroll horizontal en formulario, preview y renderizado |
| AC-023 | ✅ | |
| AC-024 | ✅ | Toda la suite corre desde `file://`; no hay recursos externos (revisado en el código). Falta probarlo con el Wi-Fi apagado (T24) |
| AC-025 | ✅ | Ayuda del tipo en ES y EN |
| AC-026 | ✅ | Placeholders en requisito y criterio, ES y EN |
| AC-027 | ✅ | Test unitario: 6 tipos, sin ⚠️, sin términos vagos, ES y EN con la misma estructura |
