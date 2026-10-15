/* EARS Spec — formulario de specs (EARS + ADRs) → Markdown.
 * Fuente de verdad: specs/001-ears-form/spec.md
 * Script clásico sin dependencias (ADR-001). El núcleo puro se expone en EarsCore para tests.js.
 */
(function (root) {
  'use strict';

  // ---------------------------------------------------------------------------
  // i18n (ADR-003, REQ-025)
  // ---------------------------------------------------------------------------
  const I18N = {
    es: {
      ui: {
        appTitle: 'EARS Spec',
        tagline: 'Specs claras: EARS + ADRs → Markdown',
        loadExample: 'Cargar ejemplo',
        clear: 'Limpiar',
        download: 'Descargar .md',
        copy: 'Copy Markdown',
        copied: 'Markdown copiado',
        copyManual: 'No se pudo copiar automáticamente. El texto quedó seleccionado: copia con Ctrl/Cmd+C.',
        confirmClear: '¿Borrar toda la spec? Esta acción no se puede deshacer.',
        confirmExample: 'Esto reemplaza tu spec actual por el ejemplo. ¿Continuar?',
        storageError: 'No se puede usar el almacenamiento del navegador. Tus cambios solo viven en esta pestaña: exporta el Markdown antes de cerrar.',
        language: 'Idioma',
        tabForm: 'Formulario',
        tabPreview: 'Preview',
        viewRaw: 'Markdown',
        viewRendered: 'Renderizado',
        secMeta: 'Metadatos',
        secProblem: 'Problema',
        secReq: 'Requisitos (EARS)',
        secAc: 'Criterios de aceptación',
        secEdge: 'Casos borde',
        secNonGoals: 'No-objetivos',
        secVerif: 'Cómo se verifica',
        secAdr: 'ADRs',
        hintReq: 'Un comportamiento por requisito usando una plantilla EARS. Evita términos vagos: usa valores medibles.',
        hintAc: 'Escenarios Dado / Cuando / Entonces verificables, vinculados a los requisitos que prueban.',
        hintEdge: 'Situaciones límite y el comportamiento esperado en cada una.',
        hintNonGoals: 'Lo que explícitamente queda fuera del alcance.',
        hintVerif: 'Cómo se comprobará cada requisito.',
        hintAdr: 'Decisiones de arquitectura: contexto, decisión, alternativas y consecuencias.',
        title: 'Título',
        author: 'Autor',
        date: 'Fecha',
        status: 'Estado',
        defaultSystem: 'Sistema por defecto',
        defaultSystemPh: 'p. ej. el sistema de pagos',
        statement: 'Enunciado del problema',
        users: 'Usuarios afectados',
        whyNow: '¿Por qué ahora?',
        context: 'Contexto',
        phStatement: '¿Qué está mal hoy y cuál es su impacto?',
        phUsers: '¿Quién sufre el problema?',
        phWhyNow: '¿Qué lo vuelve prioritario ahora?',
        phContext: 'Restricciones, sistemas involucrados, antecedentes…',
        type: 'Tipo',
        system: 'Sistema',
        systemPh: '(usa el sistema por defecto)',
        trigger: 'Disparador',
        state: 'Estado',
        feature: 'Funcionalidad',
        response: 'Respuesta',
        vague: 'Término vago: {terms}. Reemplázalo por algo medible.',
        given: 'Dado',
        when: 'Cuando',
        then: 'Entonces',
        refs: 'Requisitos que cubre',
        noReqs: 'Agrega requisitos para poder vincularlos.',
        edgeCase: 'Caso',
        expected: 'Comportamiento esperado',
        nonGoal: 'No-objetivo',
        method: 'Método',
        description: 'Descripción',
        adrTitle: 'Título de la decisión',
        adrStatus: 'Estado',
        adrContext: 'Contexto',
        adrDecision: 'Decisión',
        alternatives: 'Alternativas consideradas',
        option: 'Opción',
        pros: 'Pros',
        cons: 'Contras',
        consequences: 'Consecuencias',
        addReq: 'Agregar requisito',
        addAc: 'Agregar criterio',
        addEdge: 'Agregar caso borde',
        addNonGoal: 'Agregar no-objetivo',
        addVerif: 'Agregar verificación',
        addAdr: 'Agregar ADR',
        addAlt: 'Agregar alternativa',
        remove: 'Eliminar',
        up: 'Subir',
        down: 'Bajar',
        emptyList: 'Sin elementos todavía.'
      },
      types: { ubiquitous: 'Ubicuo', event: 'Evento', state: 'Estado', optional: 'Opcional', unwanted: 'No deseado', complex: 'Complejo' },
      methods: { unit: 'Unitaria', integration: 'Integración', e2e: 'E2E', manual: 'Manual', metric: 'Métrica' },
      specStatus: { Draft: 'Borrador', Review: 'En revisión', Approved: 'Aprobado' },
      adrStatus: { Proposed: 'Propuesto', Accepted: 'Aceptado', Deprecated: 'Obsoleto', Superseded: 'Reemplazado' },
      ph: { system: '<sistema>', trigger: '<disparador>', state: '<estado>', feature: '<funcionalidad>', response: '<respuesta>' },
      // Cuándo usar cada tipo EARS (REQ-029)
      typeHelp: {
        ubiquitous: 'Se cumple siempre, sin condición. Ej.: "El sistema deberá registrar cada inicio de sesión."',
        event: 'Reacción a algo que ocurre en un momento puntual. Ej.: "Cuando el usuario pulsa Pagar, el sistema deberá…"',
        state: 'Se mantiene mientras dure una condición. Ej.: "Mientras la cuenta esté bloqueada, el sistema deberá…"',
        optional: 'Aplica solo si existe una funcionalidad o configuración. Ej.: "Donde el usuario tenga 2FA activo, el sistema deberá…"',
        unwanted: 'Respuesta ante errores, fallos o entradas inválidas. Ej.: "Si el enlace expiró, entonces el sistema deberá…"',
        complex: 'Combina un estado y un evento. Ej.: "Mientras haya 5 intentos en 1 hora, cuando llegue otro, el sistema deberá…"'
      },
      // Placeholders de ejemplo (REQ-030)
      ex: {
        trigger: 'p. ej. el usuario pulsa "Pagar"',
        state: 'p. ej. el pago esté pendiente',
        feature: 'p. ej. la tienda tenga envío internacional',
        response: 'p. ej. mostrar el recibo en menos de 2 segundos',
        given: 'p. ej. un usuario con una cuenta activa',
        when: 'p. ej. solicita recuperar su contraseña',
        then: 'p. ej. recibe un email con un enlace válido por 30 minutos',
        edgeCase: 'p. ej. el email no está registrado',
        expected: 'p. ej. mismo mensaje que si existiera (no revelar cuentas)',
        nonGoal: 'p. ej. Login con redes sociales',
        verifDescription: 'p. ej. Test de integración: el token vence a los 30 minutos',
        adrTitle: 'p. ej. Tokens de recuperación guardados como hash',
        adrContext: '¿Qué problema o restricción obliga a decidir?',
        adrDecision: '¿Qué se decidió, en una o dos frases?',
        option: 'p. ej. JWT firmado',
        pros: 'Ventajas',
        cons: 'Desventajas',
        consequences: '¿Qué se gana, qué se pierde y qué hay que vigilar?'
      },
      md: {
        untitled: 'Sin título', problem: 'Problema', statement: 'Enunciado', users: 'Usuarios', whyNow: '¿Por qué ahora?', context: 'Contexto',
        requirements: 'Requisitos (EARS)', acceptance: 'Criterios de aceptación', given: 'Dado', when: 'cuando', then: 'entonces',
        edgeCases: 'Casos borde', case: 'Caso', expected: 'Esperado', nonGoals: 'No-objetivos',
        verification: 'Verificación', method: 'Método', description: 'Descripción', covers: 'Cubre',
        traceability: 'Matriz de trazabilidad', requirement: 'Requisito', criteria: 'Criterios',
        adrs: 'ADRs', status: 'Estado', decision: 'Decisión', alternatives: 'Alternativas consideradas',
        option: 'Opción', pros: 'Pros', cons: 'Contras', consequences: 'Consecuencias'
      }
    },
    en: {
      ui: {
        appTitle: 'EARS Spec',
        tagline: 'Clear specs: EARS + ADRs → Markdown',
        loadExample: 'Load example',
        clear: 'Clear',
        download: 'Download .md',
        copy: 'Copy Markdown',
        copied: 'Markdown copied',
        copyManual: 'Automatic copy failed. The text is selected: copy it with Ctrl/Cmd+C.',
        confirmClear: 'Delete the whole spec? This cannot be undone.',
        confirmExample: 'This replaces your current spec with the example. Continue?',
        storageError: 'Browser storage is unavailable. Your changes only live in this tab: export the Markdown before closing.',
        language: 'Language',
        tabForm: 'Form',
        tabPreview: 'Preview',
        viewRaw: 'Markdown',
        viewRendered: 'Rendered',
        secMeta: 'Metadata',
        secProblem: 'Problem',
        secReq: 'Requirements (EARS)',
        secAc: 'Acceptance criteria',
        secEdge: 'Edge cases',
        secNonGoals: 'Non-goals',
        secVerif: 'How it is verified',
        secAdr: 'ADRs',
        hintReq: 'One behavior per requirement using an EARS template. Avoid vague terms: use measurable values.',
        hintAc: 'Verifiable Given / When / Then scenarios, linked to the requirements they prove.',
        hintEdge: 'Boundary situations and the expected behavior for each.',
        hintNonGoals: 'What is explicitly out of scope.',
        hintVerif: 'How each requirement will be checked.',
        hintAdr: 'Architecture decisions: context, decision, alternatives and consequences.',
        title: 'Title',
        author: 'Author',
        date: 'Date',
        status: 'Status',
        defaultSystem: 'Default system',
        defaultSystemPh: 'e.g. the payment service',
        statement: 'Problem statement',
        users: 'Affected users',
        whyNow: 'Why now?',
        context: 'Context',
        phStatement: 'What is wrong today and what is its impact?',
        phUsers: 'Who suffers the problem?',
        phWhyNow: 'What makes it a priority now?',
        phContext: 'Constraints, systems involved, background…',
        type: 'Type',
        system: 'System',
        systemPh: '(uses the default system)',
        trigger: 'Trigger',
        state: 'State',
        feature: 'Feature',
        response: 'Response',
        vague: 'Vague term: {terms}. Replace it with something measurable.',
        given: 'Given',
        when: 'When',
        then: 'Then',
        refs: 'Requirements covered',
        noReqs: 'Add requirements to link them.',
        edgeCase: 'Case',
        expected: 'Expected behavior',
        nonGoal: 'Non-goal',
        method: 'Method',
        description: 'Description',
        adrTitle: 'Decision title',
        adrStatus: 'Status',
        adrContext: 'Context',
        adrDecision: 'Decision',
        alternatives: 'Alternatives considered',
        option: 'Option',
        pros: 'Pros',
        cons: 'Cons',
        consequences: 'Consequences',
        addReq: 'Add requirement',
        addAc: 'Add criterion',
        addEdge: 'Add edge case',
        addNonGoal: 'Add non-goal',
        addVerif: 'Add verification',
        addAdr: 'Add ADR',
        addAlt: 'Add alternative',
        remove: 'Remove',
        up: 'Move up',
        down: 'Move down',
        emptyList: 'No items yet.'
      },
      types: { ubiquitous: 'Ubiquitous', event: 'Event-driven', state: 'State-driven', optional: 'Optional feature', unwanted: 'Unwanted behavior', complex: 'Complex' },
      methods: { unit: 'Unit', integration: 'Integration', e2e: 'E2E', manual: 'Manual', metric: 'Metric' },
      specStatus: { Draft: 'Draft', Review: 'In review', Approved: 'Approved' },
      adrStatus: { Proposed: 'Proposed', Accepted: 'Accepted', Deprecated: 'Deprecated', Superseded: 'Superseded' },
      ph: { system: '<system>', trigger: '<trigger>', state: '<state>', feature: '<feature>', response: '<response>' },
      typeHelp: {
        ubiquitous: 'Always holds, with no condition. E.g. "The system shall log every sign-in."',
        event: 'Reaction to something that happens at a specific moment. E.g. "When the user clicks Pay, the system shall…"',
        state: 'Holds for as long as a condition lasts. E.g. "While the account is locked, the system shall…"',
        optional: 'Applies only if a feature or setting exists. E.g. "Where the user has 2FA enabled, the system shall…"',
        unwanted: 'Response to errors, failures or invalid input. E.g. "If the link has expired, then the system shall…"',
        complex: 'Combines a state and an event. E.g. "While there are 5 attempts within 1 hour, when another arrives, the system shall…"'
      },
      ex: {
        trigger: 'e.g. the user clicks "Pay"',
        state: 'e.g. the payment is pending',
        feature: 'e.g. the store offers international shipping',
        response: 'e.g. show the receipt in under 2 seconds',
        given: 'e.g. a user with an active account',
        when: 'e.g. they request a password reset',
        then: 'e.g. they receive an email with a link valid for 30 minutes',
        edgeCase: 'e.g. the email is not registered',
        expected: 'e.g. same message as if it existed (do not reveal accounts)',
        nonGoal: 'e.g. Social login',
        verifDescription: 'e.g. Integration test: the token expires after 30 minutes',
        adrTitle: 'e.g. Store reset tokens as hashes',
        adrContext: 'What problem or constraint forces a decision?',
        adrDecision: 'What was decided, in one or two sentences?',
        option: 'e.g. Signed JWT',
        pros: 'Advantages',
        cons: 'Disadvantages',
        consequences: 'What do we gain, what do we lose, what must we watch?'
      },
      md: {
        untitled: 'Untitled', problem: 'Problem', statement: 'Statement', users: 'Users', whyNow: 'Why now?', context: 'Context',
        requirements: 'Requirements (EARS)', acceptance: 'Acceptance criteria', given: 'Given', when: 'when', then: 'then',
        edgeCases: 'Edge cases', case: 'Case', expected: 'Expected', nonGoals: 'Non-goals',
        verification: 'Verification', method: 'Method', description: 'Description', covers: 'Covers',
        traceability: 'Traceability matrix', requirement: 'Requirement', criteria: 'Criteria',
        adrs: 'ADRs', status: 'Status', decision: 'Decision', alternatives: 'Alternatives considered',
        option: 'Option', pros: 'Pros', cons: 'Cons', consequences: 'Consequences'
      }
    }
  };

  // ---------------------------------------------------------------------------
  // EARS (REQ-006, REQ-007, REQ-008)
  // Plantillas como funciones: el orden de palabras difiere entre idiomas (ADR-003).
  // ---------------------------------------------------------------------------
  const TYPES = ['ubiquitous', 'event', 'state', 'optional', 'unwanted', 'complex'];
  const TYPE_FIELDS = {
    ubiquitous: ['system', 'response'],
    event: ['trigger', 'system', 'response'],
    state: ['state', 'system', 'response'],
    optional: ['feature', 'system', 'response'],
    unwanted: ['trigger', 'system', 'response'],
    complex: ['state', 'trigger', 'system', 'response']
  };
  const EARS = {
    es: {
      ubiquitous: p => `${p.system} deberá ${p.response}`,
      event: p => `Cuando ${p.trigger}, ${p.system} deberá ${p.response}`,
      state: p => `Mientras ${p.state}, ${p.system} deberá ${p.response}`,
      optional: p => `Donde ${p.feature}, ${p.system} deberá ${p.response}`,
      unwanted: p => `Si ${p.trigger}, entonces ${p.system} deberá ${p.response}`,
      complex: p => `Mientras ${p.state}, cuando ${p.trigger}, ${p.system} deberá ${p.response}`
    },
    en: {
      ubiquitous: p => `${p.system} shall ${p.response}`,
      event: p => `When ${p.trigger}, ${p.system} shall ${p.response}`,
      state: p => `While ${p.state}, ${p.system} shall ${p.response}`,
      optional: p => `Where ${p.feature}, ${p.system} shall ${p.response}`,
      unwanted: p => `If ${p.trigger}, then ${p.system} shall ${p.response}`,
      complex: p => `While ${p.state}, when ${p.trigger}, ${p.system} shall ${p.response}`
    }
  };
  const METHODS = ['unit', 'integration', 'e2e', 'manual', 'metric'];
  const SPEC_STATUSES = ['Draft', 'Review', 'Approved'];
  const ADR_STATUSES = ['Proposed', 'Accepted', 'Deprecated', 'Superseded'];

  const str = v => (typeof v === 'string' ? v : '');
  const filled = v => str(v).trim() !== '';
  const langOf = s => (s && s.lang === 'en' ? 'en' : 'es');

  function earsSentence(req, lang, defaultSystem) {
    const l = lang === 'en' ? 'en' : 'es';
    const ph = I18N[l].ph;
    const type = TYPE_FIELDS[req.type] ? req.type : 'ubiquitous';
    const val = f => {
      const v = f === 'system' ? (str(req.system).trim() || str(defaultSystem).trim()) : str(req[f]).trim();
      return v || ph[f];
    };
    const s = EARS[l][type]({
      system: val('system'), trigger: val('trigger'), state: val('state'), feature: val('feature'), response: val('response')
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Un requisito está vacío si no tiene ningún campo propio de su tipo (el sistema puede venir por defecto).
  function isReqEmpty(req) {
    const fields = TYPE_FIELDS[req.type] || TYPE_FIELDS.ubiquitous;
    return fields.filter(f => f !== 'system').every(f => !filled(req[f]));
  }

  // ---------------------------------------------------------------------------
  // Términos vagos (REQ-009). Se revisan ambos idiomas: el contenido puede ser mixto.
  // ---------------------------------------------------------------------------
  const VAGUE_TERMS = [
    'rápido', 'rápida', 'rápidamente', 'lento', 'lenta', 'fácil', 'fácilmente', 'intuitivo', 'intuitiva', 'amigable',
    'adecuado', 'adecuada', 'adecuadamente', 'apropiado', 'apropiada', 'eficiente', 'eficientemente', 'óptimo', 'óptima',
    'robusto', 'robusta', 'flexible', 'sencillo', 'sencilla', 'escalable', 'aproximadamente', 'varios', 'varias',
    'lo antes posible', 'según sea necesario', 'si es posible', 'cuando sea posible', 'normalmente', 'generalmente',
    'user-friendly', 'fast', 'quick', 'quickly', 'slow', 'easy', 'easily', 'intuitive', 'appropriate', 'appropriately',
    'adequate', 'adequately', 'efficient', 'efficiently', 'optimal', 'robust', 'simple', 'scalable', 'seamless',
    'seamlessly', 'approximately', 'several', 'as soon as possible', 'asap', 'as needed', 'if possible',
    'where possible', 'normally', 'usually', 'generally', 'etc'
  ];
  const VAGUE_RE = VAGUE_TERMS.map(term => ({
    term,
    re: new RegExp('(?:^|[^\\p{L}\\p{N}])' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^\\p{L}\\p{N}])', 'iu')
  }));

  function detectVague(text) {
    const t = str(text);
    if (!t.trim()) return [];
    return VAGUE_RE.filter(v => v.re.test(t)).map(v => v.term);
  }

  // ---------------------------------------------------------------------------
  // Estado, IDs y referencias (REQ-003, REQ-004, REQ-005)
  // Las referencias guardan el uid interno; los IDs visibles se derivan de la posición.
  // ---------------------------------------------------------------------------
  let uidCounter = 0;
  const uid = () => 'u' + Date.now().toString(36) + (uidCounter++).toString(36) + Math.random().toString(36).slice(2, 6);

  const NEW = {
    requirements: () => ({ uid: uid(), id: '', type: 'event', system: '', trigger: '', state: '', feature: '', response: '' }),
    acceptance: () => ({ uid: uid(), id: '', given: '', when: '', then: '', reqRefs: [] }),
    edgeCases: () => ({ uid: uid(), description: '', expected: '' }),
    nonGoals: () => ({ uid: uid(), text: '' }),
    verification: () => ({ uid: uid(), method: 'manual', description: '', reqRefs: [] }),
    adrs: () => ({ uid: uid(), id: '', title: '', status: 'Proposed', context: '', decision: '', alternatives: [], consequences: '' }),
    alternatives: () => ({ uid: uid(), option: '', pros: '', cons: '' })
  };
  const LISTS = ['requirements', 'acceptance', 'edgeCases', 'nonGoals', 'verification', 'adrs'];

  function today() {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      version: 1,
      lang: 'es',
      view: 'raw',
      meta: { title: '', author: '', date: today(), status: 'Draft', defaultSystem: '' },
      problem: { statement: '', users: '', whyNow: '', context: '' },
      requirements: [], acceptance: [], edgeCases: [], nonGoals: [], verification: [], adrs: []
    };
  }

  const pad = n => String(n).padStart(3, '0');

  function renumber(state) {
    const requirements = state.requirements.map((r, i) => ({ ...r, id: `REQ-${pad(i + 1)}` }));
    const uids = new Set(requirements.map(r => r.uid));
    const keep = refs => (refs || []).filter(u => uids.has(u));
    return {
      ...state,
      requirements,
      acceptance: state.acceptance.map((a, i) => ({ ...a, id: `AC-${pad(i + 1)}`, reqRefs: keep(a.reqRefs) })),
      verification: state.verification.map(v => ({ ...v, reqRefs: keep(v.reqRefs) })),
      adrs: state.adrs.map((a, i) => ({ ...a, id: `ADR-${pad(i + 1)}` }))
    };
  }

  // Combina datos guardados con el estado por defecto; tolera esquemas viejos o corruptos (REQ-022).
  function mergeState(saved) {
    const d = defaultState();
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return d;
    const obj = (def, src) => {
      const o = { ...def };
      if (src && typeof src === 'object') for (const k in def) if (typeof src[k] === 'string') o[k] = src[k];
      return o;
    };
    const list = (src, kind) => (Array.isArray(src) ? src : []).map(x => {
      if (typeof x === 'string') x = { text: x };
      const it = NEW[kind]();
      if (!x || typeof x !== 'object') return it;
      for (const k in it) {
        if (k === 'reqRefs') it[k] = Array.isArray(x[k]) ? x[k].filter(u => typeof u === 'string') : [];
        else if (k === 'alternatives') it[k] = list(x[k], 'alternatives');
        else if (typeof x[k] === 'string' && x[k] !== '') it[k] = x[k];
      }
      return it;
    });
    const s = {
      ...d,
      lang: saved.lang === 'en' ? 'en' : 'es',
      view: saved.view === 'rendered' ? 'rendered' : 'raw',
      meta: obj(d.meta, saved.meta),
      problem: obj(d.problem, saved.problem)
    };
    LISTS.forEach(k => { s[k] = list(saved[k], k); });
    if (!SPEC_STATUSES.includes(s.meta.status)) s.meta.status = 'Draft';
    s.requirements.forEach(r => { if (!TYPE_FIELDS[r.type]) r.type = 'ubiquitous'; });
    s.verification.forEach(v => { if (!METHODS.includes(v.method)) v.method = 'manual'; });
    s.adrs.forEach(a => { if (!ADR_STATUSES.includes(a.status)) a.status = 'Proposed'; });
    return renumber(s);
  }

  // ---------------------------------------------------------------------------
  // Markdown (REQ-012, REQ-013, REQ-014, REQ-016)
  // ---------------------------------------------------------------------------
  const escapeCell = s => str(s).trim().replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
  const indent = s => str(s).trim().replace(/\r?\n/g, '\n  ');
  const oneLine = s => str(s).trim().replace(/\s*\r?\n\s*/g, ' ');

  function slugify(title) {
    return str(title)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  const fileName = title => (slugify(title) || 'spec') + '.md';

  function generateMarkdown(input) {
    const lang = langOf(input);
    const L = I18N[lang];
    const t = L.md;
    const s = renumber(input);
    const out = [];
    let n = 0;
    const section = title => out.push('', `## ${++n}. ${title}`);

    const reqIndex = new Map(s.requirements.map((r, i) => [r.uid, i]));
    const refIds = refs => (refs || [])
      .filter(u => reqIndex.has(u))
      .sort((a, b) => reqIndex.get(a) - reqIndex.get(b))
      .map(u => s.requirements[reqIndex.get(u)].id);

    out.push(`# ${oneLine(s.meta.title) || t.untitled}`);
    const metaParts = [s.meta.author, s.meta.date, L.specStatus[s.meta.status]].map(oneLine).filter(Boolean);
    if (metaParts.length) out.push('', `> ${metaParts.join(' · ')}`);

    // Problema
    const pKeys = ['statement', 'users', 'whyNow', 'context'].filter(k => filled(s.problem[k]));
    if (pKeys.length) {
      section(t.problem);
      pKeys.forEach(k => out.push('', `### ${t[k]}`, '', s.problem[k].trim()));
    }

    // Requisitos
    const reqs = s.requirements.filter(r => !isReqEmpty(r));
    if (reqs.length) {
      section(t.requirements);
      out.push('');
      reqs.forEach(r => out.push(`- **${r.id}** _(${L.types[r.type]})_: ${indent(earsSentence(r, lang, s.meta.defaultSystem))}`));
    }

    // Criterios de aceptación
    const acs = s.acceptance.filter(a => filled(a.given) || filled(a.when) || filled(a.then));
    if (acs.length) {
      section(t.acceptance);
      out.push('');
      acs.forEach(a => {
        const parts = [];
        if (filled(a.given)) parts.push(`**${t.given}** ${oneLine(a.given)}`);
        if (filled(a.when)) parts.push(`**${t.when}** ${oneLine(a.when)}`);
        if (filled(a.then)) parts.push(`**${t.then}** ${oneLine(a.then)}`);
        parts[0] = parts[0].replace(/^\*\*(.)/, (m, c) => '**' + c.toUpperCase());
        const refs = refIds(a.reqRefs);
        out.push(`- **${a.id}**${refs.length ? ` (${refs.join(', ')})` : ''} — ${parts.join(', ')}`);
      });
    }

    // Casos borde
    const edges = s.edgeCases.filter(e => filled(e.description) || filled(e.expected));
    if (edges.length) {
      section(t.edgeCases);
      out.push('');
      edges.forEach(e => {
        const exp = filled(e.expected) ? ` → **${t.expected}:** ${oneLine(e.expected)}` : '';
        out.push(`- **${t.case}:** ${oneLine(e.description) || '—'}${exp}`);
      });
    }

    // No-objetivos
    const nonGoals = s.nonGoals.filter(g => filled(g.text));
    if (nonGoals.length) {
      section(t.nonGoals);
      out.push('');
      nonGoals.forEach(g => out.push(`- ${indent(g.text)}`));
    }

    // Verificación
    const verifs = s.verification.filter(v => filled(v.description) || v.reqRefs.length);
    if (verifs.length) {
      section(t.verification);
      out.push('', `| ${t.method} | ${t.description} | ${t.covers} |`, '|---|---|---|');
      verifs.forEach(v => out.push(`| ${L.methods[v.method]} | ${escapeCell(v.description) || '—'} | ${refIds(v.reqRefs).join(', ') || '—'} |`));
    }

    // Matriz de trazabilidad: ⚠️ si falta criterio o verificación
    if (reqs.length) {
      section(t.traceability);
      out.push('', `| ${t.requirement} | ${t.criteria} | ${t.verification} |`, '|---|---|---|');
      reqs.forEach(r => {
        const acIds = acs.filter(a => a.reqRefs.includes(r.uid)).map(a => a.id);
        const methods = [...new Set(verifs.filter(v => v.reqRefs.includes(r.uid)).map(v => L.methods[v.method]))];
        const warn = !acIds.length || !methods.length ? ' ⚠️' : '';
        out.push(`| ${r.id}${warn} | ${acIds.join(', ') || '—'} | ${methods.join(', ') || '—'} |`);
      });
    }

    // ADRs
    const adrs = s.adrs.filter(a =>
      filled(a.title) || filled(a.context) || filled(a.decision) || filled(a.consequences) ||
      a.alternatives.some(x => filled(x.option) || filled(x.pros) || filled(x.cons)));
    if (adrs.length) {
      section(t.adrs);
      adrs.forEach(a => {
        out.push('', `### ${a.id}: ${oneLine(a.title) || t.untitled}`, '', `**${t.status}:** ${L.adrStatus[a.status]}`);
        if (filled(a.context)) out.push('', `#### ${t.context}`, '', a.context.trim());
        if (filled(a.decision)) out.push('', `#### ${t.decision}`, '', a.decision.trim());
        const alts = a.alternatives.filter(x => filled(x.option) || filled(x.pros) || filled(x.cons));
        if (alts.length) {
          out.push('', `#### ${t.alternatives}`, '', `| ${t.option} | ${t.pros} | ${t.cons} |`, '|---|---|---|');
          alts.forEach(x => out.push(`| ${escapeCell(x.option) || '—'} | ${escapeCell(x.pros) || '—'} | ${escapeCell(x.cons) || '—'} |`));
        }
        if (filled(a.consequences)) out.push('', `#### ${t.consequences}`, '', a.consequences.trim());
      });
    }

    return out.join('\n') + '\n';
  }

  // ---------------------------------------------------------------------------
  // Renderer mínimo de Markdown: escapa primero, transforma después (ADR-004, REQ-011, REQ-015)
  // ---------------------------------------------------------------------------
  const HTML_ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHtml = s => str(s).replace(/[&<>"']/g, c => HTML_ESC[c]);
  const safeUrl = u => /^(https?:\/\/|#|\.{0,2}\/)/i.test(u) || /^[\w.\-/]+$/.test(u);

  function inlineMd(s) {
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (m, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^\p{L}\p{N}_])_(?!\s)(.+?)_(?![\p{L}\p{N}_])/gu, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) =>
      safeUrl(url) ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>` : m);
    s = s.replace(/&lt;br&gt;/g, '<br>');
    return s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[+i]}</code>`);
  }

  function renderMarkdown(md) {
    const lines = escapeHtml(md).split('\n');
    const html = [];
    const isList = l => /^[-*]\s+/.test(l);
    const isBlockStart = l => /^(#{1,6}\s|&gt;|[-*]\s|\|)/.test(l.trim());
    const splitRow = r => r.replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/)
      .map(c => inlineMd(c.trim().replace(/\\\|/g, '|')));
    const isSep = r => /^\|?(\s*:?-{3,}:?\s*\|)*\s*:?-{3,}:?\s*\|?$/.test(r);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) { i++; continue; }
      let m;
      if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
        html.push(`<h${m[1].length}>${inlineMd(m[2])}</h${m[1].length}>`);
        i++;
      } else if (line.startsWith('&gt;')) {
        const buf = [];
        while (i < lines.length && lines[i].startsWith('&gt;')) buf.push(lines[i++].replace(/^&gt;\s?/, ''));
        html.push(`<blockquote>${inlineMd(buf.join('<br>'))}</blockquote>`);
      } else if (line.trim().startsWith('|')) {
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(lines[i++].trim());
        let head = null;
        let body = rows;
        if (rows.length > 1 && isSep(rows[1])) { head = splitRow(rows[0]); body = rows.slice(2); }
        html.push('<div class="table-wrap"><table>' +
          (head ? `<thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead>` : '') +
          `<tbody>${body.map(r => `<tr>${splitRow(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      } else if (isList(line)) {
        const items = [];
        while (i < lines.length && (isList(lines[i]) || (items.length && /^\s{2,}\S/.test(lines[i])))) {
          if (isList(lines[i])) items.push(lines[i].replace(/^[-*]\s+/, ''));
          else items[items.length - 1] += '<br>' + lines[i].trim();
          i++;
        }
        html.push(`<ul>${items.map(x => `<li>${inlineMd(x)}</li>`).join('')}</ul>`);
      } else {
        const buf = [];
        do { buf.push(lines[i++]); } while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i]));
        html.push(`<p>${inlineMd(buf.join('<br>'))}</p>`);
      }
    }
    return html.join('\n');
  }

  // ---------------------------------------------------------------------------
  // Ejemplo (REQ-024, REQ-031): caso de negocio con los 6 tipos EARS y cobertura completa.
  // Las referencias usan claves locales (r1…) que se convierten en uids.
  // ---------------------------------------------------------------------------
  const EXAMPLES = {
    es: {
      meta: { title: 'Recuperación de contraseña', author: 'Equipo de Identidad', status: 'Review', defaultSystem: 'el servicio de autenticación' },
      problem: {
        statement: 'Hoy, quien olvida su contraseña tiene que escribir a soporte. Son unos 400 tickets al mes, con una espera media de 26 horas, y el 18 % de esos usuarios no vuelve a entrar.',
        users: 'Usuarios de la app web y móvil que olvidaron su contraseña; equipo de soporte, que hoy hace el reseteo a mano.',
        whyNow: 'El costo de soporte se duplicó en el último trimestre y la auditoría de seguridad pidió eliminar el reseteo manual antes de fin de año.',
        context: 'Autenticación propia con email y contraseña; 2FA opcional por app (TOTP). Los emails se envían con el servicio de notificaciones existente.'
      },
      requirements: [
        ['r1', 'ubiquitous', { response: 'almacenar los tokens de recuperación solo como hash SHA-256, nunca en texto plano' }],
        ['r2', 'event', { trigger: 'el usuario solicita recuperar su contraseña con un email registrado', response: 'enviar en menos de 60 segundos un email con un enlace de un solo uso válido por 30 minutos' }],
        ['r3', 'state', { state: 'la cuenta esté bloqueada por un administrador', response: 'rechazar las solicitudes de recuperación y mostrar "Contacta a soporte"' }],
        ['r4', 'optional', { feature: 'el usuario tenga 2FA activo', response: 'pedir el código del segundo factor antes de permitir el cambio de contraseña' }],
        ['r5', 'unwanted', { trigger: 'el enlace expiró o ya fue usado', response: 'mostrar "Enlace inválido o vencido" y ofrecer solicitar uno nuevo' }],
        ['r6', 'complex', { state: 'existan 5 solicitudes para el mismo email en la última hora', trigger: 'llegue una nueva solicitud', response: 'rechazarla con HTTP 429 sin enviar ningún email' }],
        ['r7', 'event', { trigger: 'el usuario cambia su contraseña con éxito', response: 'cerrar todas sus sesiones activas y enviarle un email de aviso' }]
      ],
      acceptance: [
        [['r1'], 'un token de recuperación recién emitido', 'se consulta la tabla password_reset_tokens', 'solo existe su hash SHA-256; el token en claro no aparece en la base ni en los logs'],
        [['r2'], 'un usuario registrado con el email ana@ejemplo.com', 'solicita recuperar su contraseña', 'recibe en menos de 60 s un email con un enlace que funciona una sola vez y vence a los 30 minutos'],
        [['r3'], 'una cuenta bloqueada por un administrador', 'se solicita la recuperación para ese email', 'no se envía ningún email y la pantalla muestra "Contacta a soporte"'],
        [['r4'], 'un usuario con 2FA activo y un enlace válido', 'abre el enlace', 'se le pide el código 2FA antes de mostrarle el campo de nueva contraseña'],
        [['r5'], 'un enlace que ya se usó hace 5 minutos', 'el usuario lo abre de nuevo', 've "Enlace inválido o vencido" y un botón "Solicitar otro enlace"'],
        [['r6'], '5 solicitudes para el mismo email en los últimos 40 minutos', 'llega la sexta', 'la API responde 429 y no se envía ningún email'],
        [['r7'], 'un usuario con sesiones abiertas en 2 dispositivos', 'cambia su contraseña', 'ambas sesiones se cierran y recibe un email avisando del cambio']
      ],
      edgeCases: [
        ['El email no está registrado', 'se muestra el mismo mensaje de éxito que con un email registrado, para no revelar qué cuentas existen'],
        ['El usuario pide dos enlaces seguidos', 'solo el último enlace es válido; el anterior queda invalidado'],
        ['El enlace se abre en otro dispositivo o navegador', 'funciona igual: el enlace no depende de la sesión'],
        ['Email con mayúsculas o espacios ("Ana@Ejemplo.com ")', 'se normaliza (minúsculas, sin espacios) antes de buscar la cuenta']
      ],
      nonGoals: [
        'Recuperación por SMS o preguntas de seguridad.',
        'Login con redes sociales.',
        'Cambiar las reglas de complejidad de la contraseña (spec aparte).'
      ],
      verification: [
        ['unit', 'Generación del token, hash SHA-256 y expiración a los 30 minutos', ['r1', 'r5']],
        ['integration', 'API de recuperación contra una base real: límite de 5 por hora, cuenta bloqueada y cierre de sesiones', ['r3', 'r6', 'r7']],
        ['e2e', 'Flujo completo con una bandeja de email de pruebas, con y sin 2FA', ['r2', 'r4', 'r5']],
        ['metric', 'p95 del tiempo de envío del email < 60 s en el dashboard de notificaciones', ['r2']]
      ],
      adrs: [
        {
          title: 'Tokens aleatorios guardados como hash en la base de datos', status: 'Accepted',
          context: 'Los enlaces deben ser de un solo uso, revocables y vencer a los 30 minutos. Una fuga de la base de datos no debe exponer enlaces válidos.',
          decision: 'Generar un token aleatorio de 32 bytes, enviarlo en el enlace y guardar solo su hash SHA-256 junto con la fecha de vencimiento y si ya fue usado.',
          alternatives: [
            ['JWT firmado', 'No requiere guardar estado en el servidor', 'No se puede revocar ni marcar como usado sin una lista negra'],
            ['Token en texto plano en la base', 'Más simple', 'Una fuga de la base expone enlaces válidos']
          ],
          consequences: 'Cada uso del enlace hace una consulta a la base. Hace falta un job diario que borre los tokens vencidos.'
        },
        {
          title: 'Límite de solicitudes con Redis', status: 'Proposed',
          context: 'Hay que evitar el abuso del envío de emails y que se puedan adivinar cuentas probando emails.',
          decision: 'Contador por email y por IP en Redis, con una ventana deslizante de 1 hora.',
          alternatives: [
            ['Contador en la base principal', 'No suma infraestructura', 'Carga extra en la base en picos de tráfico'],
            ['Límite solo en el API gateway', 'Centralizado', 'No puede limitar por email, solo por IP']
          ],
          consequences: 'Nueva dependencia de Redis. Si Redis no responde, se permite la solicitud y se registra una alerta (fail-open).'
        }
      ]
    },
    en: {
      meta: { title: 'Password recovery', author: 'Identity Team', status: 'Review', defaultSystem: 'the authentication service' },
      problem: {
        statement: 'Today, users who forget their password must contact support. That is about 400 tickets a month with an average wait of 26 hours, and 18% of those users never sign in again.',
        users: 'Web and mobile app users who forgot their password; the support team, who currently resets passwords by hand.',
        whyNow: 'Support costs doubled last quarter and the security audit requires removing manual resets before year end.',
        context: 'In-house email and password authentication; optional app-based 2FA (TOTP). Emails are sent through the existing notification service.'
      },
      requirements: [
        ['r1', 'ubiquitous', { response: 'store reset tokens only as SHA-256 hashes, never in plain text' }],
        ['r2', 'event', { trigger: 'the user requests a password reset with a registered email', response: 'send within 60 seconds an email with a single-use link valid for 30 minutes' }],
        ['r3', 'state', { state: 'the account is locked by an administrator', response: 'reject reset requests and show "Contact support"' }],
        ['r4', 'optional', { feature: 'the user has 2FA enabled', response: 'require the second-factor code before allowing the password change' }],
        ['r5', 'unwanted', { trigger: 'the link has expired or was already used', response: 'show "Invalid or expired link" and offer to request a new one' }],
        ['r6', 'complex', { state: 'there are 5 requests for the same email within the last hour', trigger: 'a new request arrives', response: 'reject it with HTTP 429 without sending any email' }],
        ['r7', 'event', { trigger: 'the user successfully changes their password', response: 'sign out all of their active sessions and send them a notification email' }]
      ],
      acceptance: [
        [['r1'], 'a newly issued reset token', 'the password_reset_tokens table is queried', 'only its SHA-256 hash exists; the plain token appears neither in the database nor in the logs'],
        [['r2'], 'a registered user with the email ana@example.com', 'they request a password reset', 'they receive within 60 s an email with a link that works only once and expires after 30 minutes'],
        [['r3'], 'an account locked by an administrator', 'a reset is requested for that email', 'no email is sent and the screen shows "Contact support"'],
        [['r4'], 'a user with 2FA enabled and a valid link', 'they open the link', 'they are asked for the 2FA code before seeing the new password field'],
        [['r5'], 'a link that was used 5 minutes ago', 'the user opens it again', 'they see "Invalid or expired link" and a "Request another link" button'],
        [['r6'], '5 requests for the same email within the last 40 minutes', 'the sixth one arrives', 'the API responds 429 and no email is sent'],
        [['r7'], 'a user with sessions open on 2 devices', 'they change their password', 'both sessions are signed out and they receive an email about the change']
      ],
      edgeCases: [
        ['The email is not registered', 'show the same success message as for a registered email, so accounts are not revealed'],
        ['The user requests two links in a row', 'only the latest link is valid; the previous one is invalidated'],
        ['The link is opened on another device or browser', 'it works the same: the link does not depend on the session'],
        ['Email with capitals or spaces ("Ana@Example.com ")', 'it is normalized (lowercase, trimmed) before looking up the account']
      ],
      nonGoals: [
        'Recovery via SMS or security questions.',
        'Social login.',
        'Changing password complexity rules (separate spec).'
      ],
      verification: [
        ['unit', 'Token generation, SHA-256 hashing and 30-minute expiry', ['r1', 'r5']],
        ['integration', 'Recovery API against a real database: 5-per-hour limit, locked account and session sign-out', ['r3', 'r6', 'r7']],
        ['e2e', 'Full flow with a test email inbox, with and without 2FA', ['r2', 'r4', 'r5']],
        ['metric', 'p95 email delivery time < 60 s on the notifications dashboard', ['r2']]
      ],
      adrs: [
        {
          title: 'Random tokens stored as hashes in the database', status: 'Accepted',
          context: 'Links must be single-use, revocable and expire after 30 minutes. A database leak must not expose valid links.',
          decision: 'Generate a random 32-byte token, send it in the link and store only its SHA-256 hash together with the expiry date and whether it was used.',
          alternatives: [
            ['Signed JWT', 'No server-side state', 'Cannot be revoked or marked as used without a denylist'],
            ['Plain-text token in the database', 'Simpler', 'A database leak exposes valid links']
          ],
          consequences: 'Each link use queries the database. A daily job is needed to delete expired tokens.'
        },
        {
          title: 'Rate limiting with Redis', status: 'Proposed',
          context: 'We must prevent email-sending abuse and account guessing by trying emails.',
          decision: 'Per-email and per-IP counter in Redis with a 1-hour sliding window.',
          alternatives: [
            ['Counter in the main database', 'No new infrastructure', 'Extra database load during traffic spikes'],
            ['Limit only at the API gateway', 'Centralized', 'Can only limit by IP, not by email']
          ],
          consequences: 'New dependency on Redis. If Redis does not respond, the request is allowed and an alert is logged (fail-open).'
        }
      ]
    }
  };

  function exampleState(lang) {
    const l = lang === 'en' ? 'en' : 'es';
    const ex = EXAMPLES[l];
    const s = defaultState();
    s.lang = l;
    s.meta = { ...s.meta, ...ex.meta };
    s.problem = { ...ex.problem };
    const uids = {};
    s.requirements = ex.requirements.map(([key, type, f]) => {
      const r = { ...NEW.requirements(), type, ...f };
      uids[key] = r.uid;
      return r;
    });
    const refs = keys => keys.map(k => uids[k]);
    s.acceptance = ex.acceptance.map(([keys, given, when, then]) => ({ ...NEW.acceptance(), given, when, then, reqRefs: refs(keys) }));
    s.edgeCases = ex.edgeCases.map(([description, expected]) => ({ ...NEW.edgeCases(), description, expected }));
    s.nonGoals = ex.nonGoals.map(text => ({ ...NEW.nonGoals(), text }));
    s.verification = ex.verification.map(([method, description, keys]) => ({ ...NEW.verification(), method, description, reqRefs: refs(keys) }));
    s.adrs = ex.adrs.map(a => ({
      ...NEW.adrs(), ...a,
      alternatives: a.alternatives.map(([option, pros, cons]) => ({ ...NEW.alternatives(), option, pros, cons }))
    }));
    return renumber(s);
  }

  root.EarsCore = {
    I18N, EARS, TYPES, TYPE_FIELDS, METHODS, SPEC_STATUSES, ADR_STATUSES, NEW,
    earsSentence, isReqEmpty, detectVague, renumber, mergeState, defaultState, exampleState,
    generateMarkdown, escapeCell, slugify, fileName, escapeHtml, renderMarkdown
  };

  // ===========================================================================
  // UI (solo si la página tiene #app; tests.js carga este archivo sin UI)
  // ===========================================================================
  if (typeof document === 'undefined' || !document.getElementById('app')) return;

  const STORAGE_KEY = 'ears-spec-v1';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = escapeHtml;

  let state = defaultState();
  const L = () => I18N[langOf(state)];

  // --- Persistencia (REQ-020, REQ-021, REQ-022) ---
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw == null) return { state: defaultState(), ok: true };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') throw new Error('invalid');
      return { state: mergeState(parsed), ok: true };
    } catch (e) {
      return { state: defaultState(), ok: false };
    }
  }

  let saveTimer = null;
  function save() {
    saveTimer = null;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (e) { showNotice(L().ui.storageError); }
  }
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 300);
  }
  // Guarda lo pendiente si la página se cierra o recarga antes del debounce.
  window.addEventListener('pagehide', () => { if (saveTimer) { clearTimeout(saveTimer); save(); } });

  function showNotice(msg) {
    const n = $('#notice');
    n.textContent = msg;
    n.hidden = false;
  }

  let toastTimer = null;
  function toast(msg, ms = 2000) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, ms);
  }

  // --- Render de listas (REQ-002) ---
  function actionsHtml(list, i, len, sub, si) {
    const ui = L().ui;
    const extra = sub != null ? ` data-sub="${sub}" data-subindex="${si}"` : '';
    const idx = sub != null ? si : i;
    const btn = (action, label, glyph, disabled) =>
      `<button type="button" class="icon-btn" data-action="${action}" data-list="${list}" data-index="${i}"${extra}` +
      ` title="${esc(label)}" aria-label="${esc(label)}"${disabled ? ' disabled' : ''}>${glyph}</button>`;
    return `<div class="item-actions">${btn('up', ui.up, '↑', idx === 0)}${btn('down', ui.down, '↓', idx === len - 1)}${btn('remove', ui.remove, '✕', false)}</div>`;
  }

  function fieldHtml(list, i, field, label, value, opts = {}) {
    const sub = opts.sub != null ? ` data-sub="${opts.sub}" data-subindex="${opts.si}"` : '';
    const data = `data-list="${list}" data-index="${i}" data-field="${field}"${sub}`;
    const ph = opts.ph ? ` placeholder="${esc(opts.ph)}"` : '';
    const control = opts.area
      ? `<textarea ${data} rows="${opts.rows || 2}"${ph}>${esc(value)}</textarea>`
      : `<input type="text" ${data} value="${esc(value)}"${ph}>`;
    return `<label class="field${opts.cls ? ' ' + opts.cls : ''}"><span>${esc(label)}</span>${control}</label>`;
  }

  function selectHtml(list, i, field, label, dict, keys, value) {
    return `<label class="field"><span>${esc(label)}</span><select data-list="${list}" data-index="${i}" data-field="${field}">` +
      keys.map(k => `<option value="${k}"${k === value ? ' selected' : ''}>${esc(dict[k])}</option>`).join('') + '</select></label>';
  }

  function refsHtml(list, i, refs) {
    const ui = L().ui;
    if (!state.requirements.length) return `<p class="muted small">${esc(ui.noReqs)}</p>`;
    return `<fieldset class="refs"><legend>${esc(ui.refs)}</legend><div class="chips">` +
      state.requirements.map(r =>
        `<label class="chip" title="${esc(earsSentence(r, langOf(state), state.meta.defaultSystem))}"><input type="checkbox" data-list="${list}" data-index="${i}" data-field="reqRefs" value="${r.uid}"` +
        `${refs.includes(r.uid) ? ' checked' : ''}><span>${r.id}</span></label>`).join('') +
      '</div></fieldset>';
  }

  const itemOpen = (list, i, badge) =>
    `<article class="item" data-list="${list}" data-index="${i}"><header class="item-head">` +
    (badge ? `<span class="badge">${esc(badge)}</span>` : '');

  const RENDER = {
    requirements(i) {
      const r = state.requirements[i];
      const { ui, types, typeHelp, ex } = L();
      const sysPh = state.meta.defaultSystem.trim() || ui.systemPh;
      return itemOpen('requirements', i, r.id) +
        `<select class="type-select" data-list="requirements" data-index="${i}" data-field="type" aria-label="${esc(ui.type)}">` +
        TYPES.map(t => `<option value="${t}"${t === r.type ? ' selected' : ''}>${esc(types[t])}</option>`).join('') + '</select>' +
        actionsHtml('requirements', i, state.requirements.length) + '</header>' +
        `<p class="type-help" data-role="type-help">${esc(typeHelp[r.type])}</p><div class="fields">` +
        TYPE_FIELDS[r.type].map(f => fieldHtml('requirements', i, f, ui[f], r[f], {
          area: f !== 'system', cls: f !== 'system' ? 'span-2' : '', ph: f === 'system' ? sysPh : ex[f]
        })).join('') +
        '</div><p class="sentence" data-role="sentence"></p><p class="warn" data-role="vague" hidden></p></article>';
    },
    acceptance(i) {
      const a = state.acceptance[i];
      const { ui, ex } = L();
      return itemOpen('acceptance', i, a.id) + actionsHtml('acceptance', i, state.acceptance.length) + '</header><div class="fields one">' +
        fieldHtml('acceptance', i, 'given', ui.given, a.given, { area: true, ph: ex.given }) +
        fieldHtml('acceptance', i, 'when', ui.when, a.when, { area: true, ph: ex.when }) +
        fieldHtml('acceptance', i, 'then', ui.then, a.then, { area: true, ph: ex.then }) +
        '</div>' + refsHtml('acceptance', i, a.reqRefs) + '</article>';
    },
    edgeCases(i) {
      const e = state.edgeCases[i];
      const { ui, ex } = L();
      return itemOpen('edgeCases', i, '') + '<div class="fields grow">' +
        fieldHtml('edgeCases', i, 'description', ui.edgeCase, e.description, { ph: ex.edgeCase }) +
        fieldHtml('edgeCases', i, 'expected', ui.expected, e.expected, { ph: ex.expected }) +
        '</div>' + actionsHtml('edgeCases', i, state.edgeCases.length) + '</header></article>';
    },
    nonGoals(i) {
      const g = state.nonGoals[i];
      return itemOpen('nonGoals', i, '') + '<div class="fields grow one">' +
        fieldHtml('nonGoals', i, 'text', L().ui.nonGoal, g.text, { ph: L().ex.nonGoal }) +
        '</div>' + actionsHtml('nonGoals', i, state.nonGoals.length) + '</header></article>';
    },
    verification(i) {
      const v = state.verification[i];
      const { ui, methods, ex } = L();
      return itemOpen('verification', i, '') +
        `<select class="type-select" data-list="verification" data-index="${i}" data-field="method" aria-label="${esc(ui.method)}">` +
        METHODS.map(m => `<option value="${m}"${m === v.method ? ' selected' : ''}>${esc(methods[m])}</option>`).join('') + '</select>' +
        actionsHtml('verification', i, state.verification.length) + '</header><div class="fields one">' +
        fieldHtml('verification', i, 'description', ui.description, v.description, { area: true, ph: ex.verifDescription }) +
        '</div>' + refsHtml('verification', i, v.reqRefs) + '</article>';
    },
    adrs(i) {
      const a = state.adrs[i];
      const { ui, adrStatus, ex } = L();
      const alts = a.alternatives.map((x, j) =>
        '<div class="alt">' +
        fieldHtml('adrs', i, 'option', ui.option, x.option, { sub: 'alternatives', si: j, ph: ex.option }) +
        fieldHtml('adrs', i, 'pros', ui.pros, x.pros, { sub: 'alternatives', si: j, ph: ex.pros }) +
        fieldHtml('adrs', i, 'cons', ui.cons, x.cons, { sub: 'alternatives', si: j, ph: ex.cons }) +
        actionsHtml('adrs', i, a.alternatives.length, 'alternatives', j) + '</div>').join('');
      return itemOpen('adrs', i, a.id) + '<div class="fields grow one">' +
        fieldHtml('adrs', i, 'title', ui.adrTitle, a.title, { ph: ex.adrTitle }) + '</div>' +
        actionsHtml('adrs', i, state.adrs.length) + '</header><div class="fields">' +
        selectHtml('adrs', i, 'status', ui.adrStatus, adrStatus, ADR_STATUSES, a.status) +
        '<span></span>' +
        fieldHtml('adrs', i, 'context', ui.adrContext, a.context, { area: true, rows: 3, cls: 'span-2', ph: ex.adrContext }) +
        fieldHtml('adrs', i, 'decision', ui.adrDecision, a.decision, { area: true, rows: 3, cls: 'span-2', ph: ex.adrDecision }) +
        '</div>' +
        `<fieldset class="alts"><legend>${esc(ui.alternatives)}</legend>${alts}` +
        `<button type="button" class="btn small ghost" data-action="add" data-list="adrs" data-index="${i}" data-sub="alternatives">+ ${esc(ui.addAlt)}</button></fieldset>` +
        '<div class="fields one">' + fieldHtml('adrs', i, 'consequences', ui.consequences, a.consequences, { area: true, rows: 3, ph: ex.consequences }) + '</div></article>';
    }
  };

  function renderList(name) {
    const c = $(`[data-container="${name}"]`);
    const items = state[name];
    c.innerHTML = items.length ? items.map((_, i) => RENDER[name](i)).join('') : `<p class="empty">${esc(L().ui.emptyList)}</p>`;
    if (name === 'requirements') items.forEach((_, i) => updateReqDerived(i));
  }
  const renderAllLists = () => LISTS.forEach(renderList);

  // Frase EARS en vivo + aviso de términos vagos (REQ-007, REQ-009)
  function updateReqDerived(i) {
    const el = $(`[data-container="requirements"] .item[data-index="${i}"]`);
    const r = state.requirements[i];
    if (!el || !r) return;
    $('[data-role="sentence"]', el).textContent = earsSentence(r, langOf(state), state.meta.defaultSystem);
    const terms = detectVague(r.response);
    const w = $('[data-role="vague"]', el);
    w.hidden = !terms.length;
    w.textContent = terms.length ? L().ui.vague.replace('{terms}', terms.map(t => `«${t}»`).join(', ')) : '';
  }

  // --- Preview (REQ-010, REQ-011) ---
  function updatePreview() {
    const md = generateMarkdown(state);
    $('#md-raw').textContent = md;
    if (state.view === 'rendered') $('#md-rendered').innerHTML = renderMarkdown(md);
  }

  function updateCounts() {
    const count = (o, keys) => `${keys.filter(k => filled(o[k])).length}/${keys.length}`;
    const set = (k, v) => { const el = $(`[data-count="${k}"]`); if (el) el.textContent = v; };
    set('meta', count(state.meta, ['title', 'author', 'date', 'defaultSystem']));
    set('problem', count(state.problem, ['statement', 'users', 'whyNow', 'context']));
    LISTS.forEach(k => set(k, String(state[k].length)));
  }

  function changed() {
    updatePreview();
    updateCounts();
    scheduleSave();
  }

  function structural() {
    state = renumber(state);
    renderAllLists();
    changed();
  }

  function setView(v) {
    state.view = v === 'rendered' ? 'rendered' : 'raw';
    $('#md-raw').hidden = state.view !== 'raw';
    $('#md-rendered').hidden = state.view !== 'rendered';
    $$('[data-action="view"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === state.view)));
    updatePreview();
  }

  function setTab(t) {
    document.body.dataset.tab = t;
    $$('[data-action="tab"]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  }

  // --- Idioma (REQ-025) ---
  function applyLang() {
    const { ui } = L();
    document.documentElement.lang = langOf(state);
    $$('[data-i18n]').forEach(el => { el.textContent = ui[el.dataset.i18n]; });
    $$('[data-i18n-ph]').forEach(el => { el.placeholder = ui[el.dataset.i18nPh]; });
    $$('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', ui[el.dataset.i18nAria]); });
    $$('select[data-options]').forEach(sel => {
      const dict = L()[sel.dataset.options];
      const cur = getPath(sel.dataset.bind);
      sel.innerHTML = Object.keys(dict).map(k => `<option value="${k}"${k === cur ? ' selected' : ''}>${esc(dict[k])}</option>`).join('');
    });
    $$('[data-action="lang"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === langOf(state))));
    renderAllLists();
    changed();
  }

  const getPath = path => path.split('.').reduce((o, k) => (o ? o[k] : undefined), state);
  function setPath(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    keys.reduce((o, k) => o[k], state)[last] = value;
  }

  function fillBound() {
    $$('[data-bind]').forEach(el => { el.value = str(getPath(el.dataset.bind)); });
  }

  function target(el) {
    const item = state[el.dataset.list][+el.dataset.index];
    return el.dataset.sub ? item[el.dataset.sub][+el.dataset.subindex] : item;
  }

  function focusItem(list, index, sub, si) {
    const sel = sub
      ? `[data-list="${list}"][data-index="${index}"][data-sub="${sub}"][data-subindex="${si}"]:is(input,textarea)`
      : `.item[data-list="${list}"][data-index="${index}"] :is(input[type=text],textarea)`;
    const el = $(sel);
    if (el) el.focus();
  }

  // --- Exportar (REQ-017, REQ-018, REQ-019) ---
  async function copyMarkdown() {
    const md = generateMarkdown(state);
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('no clipboard');
      await navigator.clipboard.writeText(md);
      return toast(L().ui.copied);
    } catch (e) { /* fallback */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = md;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (ok) return toast(L().ui.copied);
    } catch (e) { /* manual */ }
    setView('raw');
    setTab('preview');
    const range = document.createRange();
    range.selectNodeContents($('#md-raw'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    toast(L().ui.copyManual, 6000);
  }

  function downloadMarkdown() {
    const blob = new Blob([generateMarkdown(state)], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName(state.meta.title);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function hasData() {
    return ['title', 'author', 'defaultSystem'].some(k => filled(state.meta[k])) ||
      Object.values(state.problem).some(filled) || LISTS.some(k => state[k].length);
  }

  // Reemplaza el estado completo conservando idioma y vista.
  function replaceState(next) {
    next.lang = state.lang;
    next.view = state.view;
    state = renumber(next);
    fillBound();
    applyLang();
    setView(state.view);
  }

  // --- Eventos ---
  const formPane = $('#form-pane');

  formPane.addEventListener('input', e => {
    const el = e.target;
    if (el.tagName === 'SELECT' || el.type === 'checkbox') return;
    if (el.dataset.bind) {
      setPath(el.dataset.bind, el.value);
      if (el.dataset.bind === 'meta.defaultSystem') renderList('requirements');
      return changed();
    }
    if (!el.dataset.list) return;
    target(el)[el.dataset.field] = el.value;
    if (el.dataset.list === 'requirements') updateReqDerived(+el.dataset.index);
    changed();
  });

  formPane.addEventListener('change', e => {
    const el = e.target;
    if (el.tagName === 'SELECT' && el.dataset.bind) {
      setPath(el.dataset.bind, el.value);
      return changed();
    }
    if (!el.dataset.list) return;
    if (el.dataset.field === 'reqRefs') {
      const item = target(el);
      item.reqRefs = el.checked ? [...new Set([...item.reqRefs, el.value])] : item.reqRefs.filter(u => u !== el.value);
      return changed();
    }
    if (el.tagName === 'SELECT') {
      target(el)[el.dataset.field] = el.value;
      if (el.dataset.field === 'type') {
        renderList('requirements');
        const sel = $(`[data-container="requirements"] select[data-index="${el.dataset.index}"]`);
        if (sel) sel.focus();
      }
      changed();
    }
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const { action, list, sub } = btn.dataset;
    const index = +btn.dataset.index;
    const si = +btn.dataset.subindex;
    const arr = list ? (sub ? state[list][index][sub] : state[list]) : null;
    const pos = sub ? si : index;

    switch (action) {
      case 'add': {
        if (sub) { arr.push(NEW[sub]()); structural(); focusItem(list, index, sub, arr.length - 1); }
        else { arr.push(NEW[list]()); structural(); focusItem(list, arr.length - 1); }
        break;
      }
      case 'remove':
        arr.splice(pos, 1);
        structural();
        break;
      case 'up':
      case 'down': {
        const to = action === 'up' ? pos - 1 : pos + 1;
        if (to < 0 || to >= arr.length) break;
        [arr[pos], arr[to]] = [arr[to], arr[pos]];
        structural();
        const moved = $(sub
          ? `[data-action="${action}"][data-list="${list}"][data-index="${index}"][data-subindex="${to}"]`
          : `[data-action="${action}"][data-list="${list}"][data-index="${to}"]:not([data-sub])`);
        if (moved && !moved.disabled) moved.focus();
        break;
      }
      case 'lang':
        state.lang = btn.dataset.lang === 'en' ? 'en' : 'es';
        applyLang();
        break;
      case 'view':
        setView(btn.dataset.view);
        scheduleSave();
        break;
      case 'tab':
        setTab(btn.dataset.tab);
        break;
      case 'copy':
        copyMarkdown();
        break;
      case 'download':
        downloadMarkdown();
        break;
      case 'clear':
        if (!confirm(L().ui.confirmClear)) break;
        clearTimeout(saveTimer);
        try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* sin almacenamiento */ }
        replaceState(defaultState());
        clearTimeout(saveTimer);
        saveTimer = null;
        break;
      case 'example':
        if (hasData() && !confirm(L().ui.confirmExample)) break;
        replaceState(exampleState(state.lang));
        break;
    }
  });

  // --- Inicio ---
  const loaded = load();
  state = loaded.state;
  fillBound();
  applyLang();
  setView(state.view);
  setTab('form');
  if (!loaded.ok) showNotice(L().ui.storageError);
})(typeof window !== 'undefined' ? window : globalThis);
