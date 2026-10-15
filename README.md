# EARS Spec

Formulario web para escribir specs de software con una estructura consistente y exportarlas como Markdown con un clic.

Cada spec incluye:

1. **Problema**: enunciado, usuarios, por qué ahora y contexto.
2. **Requisitos en formato [EARS](https://alistairmavin.com/ears/)**: se elige el tipo (Ubicuo, Evento, Estado, Opcional, No deseado o Complejo) y el formulario arma la frase. Avisa si aparecen términos vagos como "rápido" o "fácil".
3. **Criterios de aceptación**: escenarios Dado / Cuando / Entonces vinculados a los requisitos que prueban.
4. **Casos borde**.
5. **No-objetivos**.
6. **Verificación**: método y requisitos que cubre.
7. **Matriz de trazabilidad**, generada automáticamente. Marca con ⚠️ los requisitos que no tienen criterio o verificación.
8. **ADRs**: contexto, decisión, alternativas y consecuencias.

## Uso

Abre `index.html` en el navegador con doble clic. No hace falta instalar nada ni tener conexión.

- **Copy Markdown** copia la spec completa para pegarla en un PR, un ticket, Notion o el repo.
- **Descargar .md** guarda la spec como archivo.
- **Cargar ejemplo** muestra una spec completa como referencia.
- **ES / EN** cambia el idioma de la interfaz, las plantillas EARS y los encabezados. El texto que escribes no se traduce.
- El progreso se guarda solo en el navegador (`localStorage`). **Limpiar** lo borra.

## Desarrollo (Spec-Driven Development)

Este proyecto se construye con SDD: la spec es la fuente de verdad y se actualiza **antes** que el código.

```
specs/
  001-ears-form/spec.md    requisitos REQ-xxx, criterios AC-xxx, casos borde, verificación
  001-ears-form/tasks.md   tareas de implementación y resultados de los AC
  adr/                     decisiones de arquitectura
index.html · styles.css · app.js   la app (sin build ni dependencias)
tests.html · tests.js              tests del núcleo
```

Flujo para un cambio:

1. Edita o agrega los requisitos y criterios en `spec.md`. Si hay una decisión de arquitectura, agrega un ADR.
2. Agrega las tareas en `tasks.md`.
3. Implementa. En `app.js` las funciones clave citan los `REQ-xxx` que cubren.
4. Verifica: `node tests.js` (o abre `tests.html`) y recorre los AC afectados.

## Tests

```sh
node tests.js        # tests del núcleo en la terminal
open tests.html      # los mismos tests en el navegador
```
