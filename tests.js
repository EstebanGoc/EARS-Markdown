/* Tests del núcleo (specs/001-ears-form/spec.md §6).
 * Navegador: abrir tests.html. Terminal: node tests.js
 */
(function () {
  'use strict';
  const isNode = typeof window === 'undefined';
  if (isNode) require('./app.js');
  const C = globalThis.EarsCore;
  const results = [];

  function test(name, fn) {
    try { fn(); results.push({ name, ok: true }); }
    catch (e) { results.push({ name, ok: false, msg: e.message }); }
  }
  function eq(actual, expected) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(`esperado ${b}, obtenido ${a}`);
  }
  function ok(cond, msg) { if (!cond) throw new Error(msg || 'condición falsa'); }

  const req = (uid, type, f) => ({ ...C.NEW.requirements(), uid, type, ...f });
  const stateWith = patch => C.renumber({ ...C.defaultState(), ...patch });

  // --- i18n (ADR-003) ---
  test('I18N: es y en tienen las mismas claves', () => {
    const keys = (o, p = '') => Object.keys(o).flatMap(k =>
      typeof o[k] === 'object' ? keys(o[k], p + k + '.') : [p + k]).sort();
    eq(keys(C.I18N.es), keys(C.I18N.en));
  });

  // --- EARS (REQ-007, REQ-008) ---
  test('AC-006: frase Evento en ES y EN', () => {
    const r = req('x', 'event', { trigger: 'el usuario guarda', response: 'persistir el borrador' });
    eq(C.earsSentence(r, 'es', 'el formulario'), 'Cuando el usuario guarda, el formulario deberá persistir el borrador');
    eq(C.earsSentence(r, 'en', 'el formulario'), 'When el usuario guarda, el formulario shall persistir el borrador');
  });

  test('EARS: los 6 tipos en ES', () => {
    const f = { system: 'la API', trigger: 'T', state: 'S', feature: 'F', response: 'R' };
    eq(C.earsSentence(req('x', 'ubiquitous', f), 'es'), 'La API deberá R');
    eq(C.earsSentence(req('x', 'state', f), 'es'), 'Mientras S, la API deberá R');
    eq(C.earsSentence(req('x', 'optional', f), 'es'), 'Donde F, la API deberá R');
    eq(C.earsSentence(req('x', 'unwanted', f), 'es'), 'Si T, entonces la API deberá R');
    eq(C.earsSentence(req('x', 'complex', f), 'es'), 'Mientras S, cuando T, la API deberá R');
  });

  test('EARS: los 6 tipos en EN', () => {
    const f = { system: 'the API', trigger: 'T', state: 'S', feature: 'F', response: 'R' };
    eq(C.earsSentence(req('x', 'ubiquitous', f), 'en'), 'The API shall R');
    eq(C.earsSentence(req('x', 'event', f), 'en'), 'When T, the API shall R');
    eq(C.earsSentence(req('x', 'state', f), 'en'), 'While S, the API shall R');
    eq(C.earsSentence(req('x', 'optional', f), 'en'), 'Where F, the API shall R');
    eq(C.earsSentence(req('x', 'unwanted', f), 'en'), 'If T, then the API shall R');
    eq(C.earsSentence(req('x', 'complex', f), 'en'), 'While S, when T, the API shall R');
  });

  test('AC-007: sistema por defecto y sistema propio', () => {
    eq(C.earsSentence(req('x', 'ubiquitous', { response: 'R' }), 'es', 'la API'), 'La API deberá R');
    eq(C.earsSentence(req('x', 'ubiquitous', { system: 'el worker', response: 'R' }), 'es', 'la API'), 'El worker deberá R');
  });

  test('EARS: marcadores cuando faltan campos', () => {
    eq(C.earsSentence(req('x', 'event', {}), 'es', ''), 'Cuando <disparador>, <sistema> deberá <respuesta>');
  });

  // --- Términos vagos (REQ-009) ---
  test('AC-008: detecta términos vagos', () => {
    eq(C.detectVague('responder rápido'), ['rápido']);
    eq(C.detectVague('Must be FAST and easy, etc.'), ['fast', 'easy', 'etc']);
    eq(C.detectVague('responder en menos de 200 ms'), []);
    eq(C.detectVague('breakfast rapidez'), []);
  });

  // --- IDs y referencias (REQ-003, REQ-004, REQ-005) ---
  test('AC-002: IDs secuenciales', () => {
    const s = stateWith({ requirements: [req('a', 'event', {}), req('b', 'event', {}), req('c', 'event', {})] });
    eq(s.requirements.map(r => r.id), ['REQ-001', 'REQ-002', 'REQ-003']);
  });

  test('AC-003: eliminar renumera y limpia referencias', () => {
    const s = stateWith({
      requirements: [req('a', 'event', {}), req('b', 'event', {}), req('c', 'event', {})],
      acceptance: [{ ...C.NEW.acceptance(), reqRefs: ['b', 'c'] }],
      verification: [{ ...C.NEW.verification(), reqRefs: ['a', 'c'] }]
    });
    s.requirements.splice(0, 1);
    const r = C.renumber(s);
    eq(r.requirements.map(x => [x.uid, x.id]), [['b', 'REQ-001'], ['c', 'REQ-002']]);
    eq(r.acceptance[0].reqRefs, ['b', 'c']);
    eq(r.verification[0].reqRefs, ['c']);
  });

  test('AC-004: reordenar mantiene referencias', () => {
    const s = stateWith({
      requirements: [req('a', 'ubiquitous', { response: 'A' }), req('b', 'ubiquitous', { response: 'B' })],
      acceptance: [{ ...C.NEW.acceptance(), given: 'g', reqRefs: ['b'] }]
    });
    [s.requirements[0], s.requirements[1]] = [s.requirements[1], s.requirements[0]];
    const md = C.generateMarkdown(C.renumber(s));
    ok(md.includes('**REQ-001** _(Ubicuo)_: <sistema> deberá B'), md);
    ok(md.includes('**AC-001** (REQ-001)'), md);
  });

  test('Borde: más de 999 requisitos', () => {
    const s = stateWith({ requirements: Array.from({ length: 1000 }, (_, i) => req('u' + i, 'event', {})) });
    eq(s.requirements[999].id, 'REQ-1000');
  });

  // --- Markdown (REQ-012, REQ-013, REQ-014, REQ-016) ---
  test('AC-010: omite secciones vacías', () => {
    const s = stateWith({ requirements: [req('a', 'ubiquitous', { system: 'el sistema', response: 'R' })] });
    s.meta.title = 'Mi spec';
    const md = C.generateMarkdown(s);
    ok(md.startsWith('# Mi spec\n'), md);
    eq(md.match(/^## .*$/gm), ['## 1. Requisitos (EARS)', '## 2. Matriz de trazabilidad']);
  });

  test('AC-011: matriz marca ⚠️ requisitos sin cobertura', () => {
    const s = stateWith({
      requirements: [req('a', 'ubiquitous', { response: 'A' }), req('b', 'ubiquitous', { response: 'B' })],
      acceptance: [{ ...C.NEW.acceptance(), given: 'g', reqRefs: ['a'] }],
      verification: [{ ...C.NEW.verification(), method: 'unit', description: 'd', reqRefs: ['a'] }]
    });
    const md = C.generateMarkdown(s);
    ok(md.includes('| REQ-001 | AC-001 | Unitaria |'), md);
    ok(md.includes('| REQ-002 ⚠️ | — | — |'), md);
  });

  test('AC-013: escapeCell conserva columnas', () => {
    eq(C.escapeCell('a | b\nc'), 'a \\| b<br>c');
  });

  test('Borde: título vacío → "Sin título" / "Untitled"', () => {
    ok(C.generateMarkdown(C.defaultState()).startsWith('# Sin título\n'));
    ok(C.generateMarkdown({ ...C.defaultState(), lang: 'en' }).startsWith('# Untitled\n'));
  });

  test('Borde: requisito vacío se omite del Markdown', () => {
    const s = stateWith({ requirements: [req('a', 'event', { system: 'x' })] });
    ok(!C.generateMarkdown(s).includes('REQ-001'));
  });

  test('AC-021: encabezados en inglés sin traducir contenido', () => {
    const s = stateWith({ lang: 'en', requirements: [req('a', 'event', { trigger: 'el usuario guarda', response: 'guardar' })] });
    s.problem.statement = 'Texto del usuario';
    const md = C.generateMarkdown(s);
    ok(md.includes('## 1. Problem') && md.includes('### Statement') && md.includes('Texto del usuario'), md);
    ok(md.includes('_(Event-driven)_: When el usuario guarda, <system> shall guardar'), md);
  });

  test('ADR con tabla de alternativas', () => {
    const s = stateWith({
      adrs: [{ ...C.NEW.adrs(), title: 'Usar X', status: 'Accepted', decision: 'X',
        alternatives: [{ ...C.NEW.alternatives(), option: 'Y', pros: 'p', cons: 'c | d' }] }]
    });
    const md = C.generateMarkdown(s);
    ok(md.includes('### ADR-001: Usar X') && md.includes('**Estado:** Aceptado') && md.includes('| Y | p | c \\| d |'), md);
  });

  test('AC-020: el ejemplo genera todas las secciones en ES y EN', () => {
    const es = C.generateMarkdown(C.exampleState('es'));
    ok(es.startsWith('# Recuperación de contraseña\n'), es.slice(0, 60));
    ['Problema', 'Requisitos (EARS)', 'Criterios de aceptación', 'Casos borde', 'No-objetivos', 'Verificación', 'Matriz de trazabilidad', 'ADRs']
      .forEach((h, i) => ok(es.includes(`## ${i + 1}. ${h}`), `falta ${h}`));
    const en = C.generateMarkdown(C.exampleState('en'));
    ok(en.startsWith('# Password recovery\n'), en.slice(0, 60));
    ['Problem', 'Requirements (EARS)', 'Acceptance criteria', 'Edge cases', 'Non-goals', 'Verification', 'Traceability matrix', 'ADRs']
      .forEach((h, i) => ok(en.includes(`## ${i + 1}. ${h}`), `missing ${h}`));
  });

  test('AC-027: el ejemplo usa los 6 tipos EARS y no tiene ⚠️', () => {
    ['es', 'en'].forEach(lang => {
      const s = C.exampleState(lang);
      eq([...new Set(s.requirements.map(r => r.type))].sort(), [...C.TYPES].sort());
      ok(!C.generateMarkdown(s).includes('⚠️'), `${lang}: hay requisitos sin cobertura`);
      ok(s.requirements.every(r => !C.detectVague(r.response).length), `${lang}: el ejemplo usa términos vagos`);
    });
  });

  test('AC-027: los ejemplos ES y EN tienen la misma estructura', () => {
    const shape = s => ({
      types: s.requirements.map(r => r.type),
      acRefs: s.acceptance.map(a => a.reqRefs.map(u => s.requirements.findIndex(r => r.uid === u))),
      verif: s.verification.map(v => [v.method, v.reqRefs.length]),
      counts: ['edgeCases', 'nonGoals', 'adrs'].map(k => s[k].length),
      adrs: s.adrs.map(a => [a.status, a.alternatives.length])
    });
    eq(shape(C.exampleState('es')), shape(C.exampleState('en')));
  });

  // --- Guía (REQ-029, REQ-030) ---
  test('AC-025: ayuda para cada tipo EARS en ES y EN', () => {
    ['es', 'en'].forEach(lang => C.TYPES.forEach(t => ok(C.I18N[lang].typeHelp[t], `${lang}.typeHelp.${t}`)));
    ok(C.I18N.es.typeHelp.state.includes('"Mientras'));
    ok(C.I18N.en.typeHelp.state.includes('"While'));
  });

  test('AC-026: placeholder de ejemplo para cada campo de requisito', () => {
    ['es', 'en'].forEach(lang => ['trigger', 'state', 'feature', 'response'].forEach(f => ok(C.I18N[lang].ex[f], `${lang}.ex.${f}`)));
  });

  // --- Archivo (REQ-019) ---
  test('AC-016: slugify y nombre de archivo', () => {
    eq(C.slugify('Login con SSO'), 'login-con-sso');
    eq(C.slugify('Diseño: Pagos & Reembolsos'), 'diseno-pagos-reembolsos');
    eq(C.fileName(''), 'spec.md');
    eq(C.fileName('Login con SSO'), 'login-con-sso.md');
  });

  // --- Renderer (REQ-011, REQ-015) ---
  test('AC-012: el preview renderizado no interpreta HTML del usuario', () => {
    const html = C.renderMarkdown('Hola <img src=x onerror=alert(1)> **ok**');
    ok(!html.includes('<img'), html);
    ok(html.includes('&lt;img') && html.includes('<strong>ok</strong>'), html);
  });

  test('Renderer: enlaces javascript: no se convierten', () => {
    const html = C.renderMarkdown('[x](javascript:alert(1))');
    ok(!html.includes('<a '), html);
  });

  test('Renderer: tabla con pipe escapado tiene 3 columnas', () => {
    const html = C.renderMarkdown('| A | B | C |\n|---|---|---|\n| 1 \\| 2 | x<br>y | z |');
    ok((html.match(/<td>/g) || []).length === 3, html);
    ok(html.includes('<td>1 | 2</td>') && html.includes('<td>x<br>y</td>'), html);
  });

  test('Renderer: encabezados, listas y cita', () => {
    const html = C.renderMarkdown('# T\n\n> a · b\n\n- **REQ-001** _(Evento)_: x\n- y');
    ok(html.includes('<h1>T</h1>') && html.includes('<blockquote>') && html.includes('<em>(Evento)</em>') && html.includes('<li>y</li>'), html);
  });

  // --- Persistencia (REQ-022) ---
  test('AC-018: mergeState tolera datos inválidos y esquemas viejos', () => {
    eq(C.mergeState(null).requirements, []);
    eq(C.mergeState('basura').requirements, []);
    const s = C.mergeState({ lang: 'en', nonGoals: ['Sin backend'], requirements: [{ type: 'nope', response: 'R' }], verification: [{ method: '??' }] });
    eq(s.lang, 'en');
    eq(s.nonGoals[0].text, 'Sin backend');
    eq(s.requirements[0].type, 'ubiquitous');
    eq(s.requirements[0].id, 'REQ-001');
    eq(s.verification[0].method, 'manual');
    eq(s.problem.statement, '');
  });

  // --- Salida ---
  const failed = results.filter(r => !r.ok);
  if (isNode) {
    results.forEach(r => console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : '\n    ' + r.msg}`));
    console.log(`\n${results.length - failed.length}/${results.length} OK`);
    process.exitCode = failed.length ? 1 : 0;
  } else {
    const out = document.getElementById('results');
    out.innerHTML = `<p class="summary ${failed.length ? 'fail' : 'pass'}">${results.length - failed.length}/${results.length} OK</p>` +
      '<ul>' + results.map(r => `<li class="${r.ok ? 'pass' : 'fail'}">${r.ok ? '✓' : '✗'} ${C.escapeHtml(r.name)}` +
        (r.ok ? '' : `<pre>${C.escapeHtml(r.msg)}</pre>`) + '</li>').join('') + '</ul>';
  }
})();
