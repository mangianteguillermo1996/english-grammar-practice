// Navegación, armado de sesiones, corrección y vistas.

const SESSION_SIZE = 10;
const PLACEMENT_PER_TOPIC = 2;
const B2_NEXT = ["Third conditional", "Past perfect", "Present perfect continuous", "Modales en pasado (must have, might have)", "Wish / if only", "Pasiva con modales y perfect"];
const $ = (sel) => document.querySelector(sel);
const view = $("#view");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- Corrección ----------

function normalize(s) {
  return s.toLowerCase().replace(/[’‘`´]/g, "'").replace(/[.!?,;:]+$/g, "").replace(/\s+/g, " ").trim();
}
// Todas las formas equivalentes de una respuesta (contracciones expandidas).
function variants(s) {
  let out = [normalize(s)
    .replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "cannot").replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not").replace(/'m\b/g, " am").replace(/'re\b/g, " are").replace(/'ve\b/g, " have")
    .replace(/'ll\b/g, " will").replace(/\bcan not\b/g, "cannot")];
  for (const [c, opts] of [["'d", ["would", "had"]], ["'s", ["is", "has"]]]) {
    out = out.flatMap((v) => (v.includes(c) ? opts.map((o) => v.replaceAll(c, " " + o)) : [v]));
  }
  return out.map((v) => v.replace(/,/g, "").replace(/\s+/g, " ").trim());
}
// En "reescribir" se acepta que la persona vuelva a escribir el comienzo dado.
function typed(ex, given) {
  if (ex.type !== "rw") return given;
  const g = normalize(given), start = normalize(ex.start);
  return g.startsWith(start + " ") ? g.slice(start.length + 1) : given;
}
const matches = (a, b) => { const set = new Set(variants(a)); return variants(b).some((v) => set.has(v)); };
function isCorrect(ex, given) {
  if (ex.type === "err" || ex.type === "mc") return given === ex.answers[0];
  return ex.answers.some((a) => matches(typed(ex, given), a));
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      // Dos letras invertidas (biult → built) cuentan como un solo error.
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
    }
  }
  return dp[a.length][b.length];
}
// El "por qué está mal" de una respuesta incorrecta conocida (opción elegida o error típico escrito).
function knownWrongWhy(ex, given) {
  if (!ex.wrongWhy || given == null) return null;
  if (ex.type === "mc") return ex.wrongWhy[given] || null;
  const key = Object.keys(ex.wrongWhy).find((w) => matches(typed(ex, given), w));
  return key ? ex.wrongWhy[key] : null;
}
// "Casi correcto": una sola palabra distinta, con una diferencia de ortografía chica.
// No cuenta si una palabra es el comienzo de la otra (play/plays, use/used): eso es gramática.
function isNearMiss(ex, given) {
  if (!["gap", "rw"].includes(ex.type) || knownWrongWhy(ex, given)) return false;
  const gw = variants(typed(ex, given))[0].split(" ");
  return ex.answers.some((a) => variants(a).some((v) => {
    const aw = v.split(" ");
    if (aw.length !== gw.length) return false;
    const diff = aw.map((w, i) => [w, gw[i]]).filter(([x, y]) => x !== y);
    if (diff.length !== 1) return false;
    const [x, y] = diff[0];
    if (x.startsWith(y) || y.startsWith(x)) return false;
    return levenshtein(x, y) <= (Math.max(x.length, y.length) > 7 ? 2 : 1);
  }));
}

// ---------- Armado de sesiones ----------

function freshFor(topicId, count) {
  const unseen = shuffle(EXERCISES.filter((e) => e.topic === topicId && !progress.attempts[e.id]));
  const gen = generateFor(topicId, count * 2).filter((e) => !isNotDue(e.id));
  // Alterna escritos a mano y generados para variar.
  const out = [];
  while (out.length < count && (unseen.length || gen.length)) {
    if (unseen.length) out.push(unseen.pop());
    if (gen.length && out.length < count) out.push(gen.pop());
  }
  if (out.length < count) {
    const rest = shuffle(EXERCISES.filter((e) => e.topic === topicId && !isNotDue(e.id) && !out.includes(e)));
    out.push(...rest.slice(0, count - out.length));
  }
  if (out.length < count) {
    const any = shuffle(EXERCISES.filter((e) => e.topic === topicId && !out.includes(e)));
    out.push(...any.slice(0, count - out.length));
  }
  return out;
}

const pendingMistakes = () => progress.mistakes.filter((m) => !isOvercome(m.id));

function buildSession(mode, topicId) {
  if (mode === "review") return shuffle(dueExercises().map((d) => d.ex)).slice(0, SESSION_SIZE);
  if (mode === "mistakes") {
    return shuffle(pendingMistakes().filter((m) => !topicId || m.ex.topic === topicId))
      .slice(0, SESSION_SIZE).map((m) => EXERCISE_BY_ID[m.id] || m.ex);
  }
  if (mode === "placement") {
    return TOPICS.flatMap((t) => shuffle(EXERCISES.filter((e) => e.topic === t.id && e.type !== "rw")).slice(0, PLACEMENT_PER_TOPIC));
  }

  const due = shuffle(dueExercises(topicId)).sort((a, b) => b.failed - a.failed).slice(0, 4).map((d) => d.ex);
  const items = [...due];
  const used = new Set(items.map((e) => e.id));
  const add = (list) => { for (const e of list) if (!used.has(e.id) && items.length < SESSION_SIZE) { items.push(e); used.add(e.id); } };

  if (mode === "topic") {
    add(freshFor(topicId, SESSION_SIZE));
  } else {
    // Mixta: más peso a los temas con menos dominio; menos a los que salieron bien en el test.
    const weights = TOPICS.map((t) => ({ t, w: (1.15 - topicStats(t.id).mastery / 100) * (likelyKnown(t.id) ? 0.4 : 1) }));
    const total = weights.reduce((s, x) => s + x.w, 0);
    for (let tries = 0; items.length < SESSION_SIZE && tries < 60; tries++) {
      let r = Math.random() * total, chosen = weights[0].t;
      for (const x of weights) { r -= x.w; if (r <= 0) { chosen = x.t; break; } }
      add(freshFor(chosen.id, 1));
    }
  }
  return shuffle(items);
}

// ---------- Piezas de interfaz ----------

let session = null;
let mistakesFilter = { topic: "", showOvercome: false };

function setNav(name) {
  document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.nav === name));
}

function renderRule(t) {
  return `
    <p class="rule-intro">${t.intro}</p>
    <h4>Estructura</h4>
    <div class="table-wrap"><table class="rule-table">${t.structure.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table></div>
    <h4>Cuándo se usa</h4>
    ${Object.entries(t.concepts || {}).map(([k, c]) => conceptBlock(t.id, k, c)).join("")}
    <h4>Palabras señal</h4>
    <p>${t.signals}</p>
    <h4>Errores típicos</h4>
    <ul class="typical">${t.mistakes.map(([bad, good, why]) => `<li><span class="bad">✗ ${esc(bad)}</span> → <span class="good">✓ ${esc(good)}</span> <span class="muted small">${esc(why)}</span></li>`).join("")}</ul>`;
}

const conceptBlock = (topicId, key, c) => `
  <div class="concept-block">
    <strong>${c.title}</strong>
    <p>${c.text}</p>
    ${exampleList(topicId, key, c.examples)}
  </div>`;

// ---------- Traducción y audio ----------

const stripTags = (html) => html.replace(/<[^>]+>/g, "");
// Lo que lee la voz: sin etiquetas ni aclaraciones entre paréntesis.
const sayable = (html) => stripTags(html).replace(/\s*\([^)]*\)/g, "").replace(/[«»"]/g, "").trim();
const sayBtn = (text) => (canSpeak ? `<button class="say" data-say="${esc(sayable(text))}" title="Escuchar" aria-label="Escuchar">🔊</button>` : "");

// Ejemplos en inglés con su traducción debajo.
function exampleList(topicId, key, examples) {
  const es = ES[topicId]?.c[key] || [];
  return `<ul class="examples">${examples.map((e, i) => `<li>${e} ${sayBtn(e)}${es[i] ? `<span class="es">${esc(es[i])}</span>` : ""}</li>`).join("")}</ul>`;
}

// La oración completa y correcta de un ejercicio.
function fullSentence(ex) {
  if (ex.type === "err") return ex.fixed || ex.parts.map((p, i) => (i === ex.answers[0] ? ex.correction : p)).join(" ");
  if (ex.type === "rw") return `${ex.start} ${ex.answers[0]}`;
  return ex.prompt.replace(/ \([^)]*\)/, "").replace("___", ex.answers[0]);
}

// Solo los ejercicios escritos a mano tienen traducción (los generados se arman al azar).
function translationOf(ex) {
  if (!EXERCISE_BY_ID[ex.id]) return null;
  const [topic, i] = ex.id.split(":");
  return ES[topic]?.ex[+i] || null;
}

const conceptOf = (ex) => TOPIC_BY_ID[ex.topic].concepts?.[ex.concept];
const blank = (html) => html.replace("___", `<span class="blank">&nbsp;</span>`);

function goalBar() {
  const goal = progress.settings.dailyGoal;
  const done = (progress.daily[todayKey()] || { done: 0 }).done;
  const pct = Math.min(100, Math.round((done / goal) * 100));
  return `
    <div class="goal ${done >= goal ? "reached" : ""}">
      <div class="goal-text"><span>Meta de hoy</span><strong>${done} / ${goal}${done >= goal ? " ✓" : ""}</strong></div>
      <div class="meter"><div class="meter-fill" style="width:${pct}%"></div></div>
    </div>`;
}

const STATUS = {
  mastered: ["✓", "Dominado"], progress: ["◐", "En curso"], known: ["★", "Probablemente lo sabés"], pending: ["○", "Pendiente"],
};

function roadmap() {
  const next = nextRecommended();
  const allDone = TOPICS.every((t) => topicStatus(t.id) === "mastered");
  return `
    <section class="card roadmap">
      <h2>Hoja de ruta</h2>
      ${allDone ? `<p>🎉 Dominaste todos los temas de A2 y B1. Para seguir hacia B2, los próximos temas serían: ${B2_NEXT.join(", ")}.</p>`
        : next ? `<div class="next">
            <div><span class="muted small">Próximo tema recomendado</span><h3>${esc(next.name)}</h3></div>
            <button class="btn primary" data-start="topic" data-topic="${next.id}">Practicar</button>
          </div>` : ""}
      <div class="chips">
        ${TOPICS.map((t) => { const st = topicStatus(t.id); return `<button class="chip ${st}" data-start="topic" data-topic="${t.id}" title="${STATUS[st][1]}"><span aria-hidden="true">${STATUS[st][0]}</span> ${esc(t.name)}</button>`; }).join("")}
      </div>
      <p class="muted small legend">${Object.values(STATUS).map(([i, l]) => `${i} ${l}`).join(" · ")}</p>
    </section>`;
}

// ---------- Inicio ----------

function renderHome() {
  setNav("home");
  session = null;
  const dueCount = dueExercises().length;
  const mistakesCount = pendingMistakes().length;
  const lvl = estimatedLevel();
  const firstTime = totals().done === 0 && !progress.placement;
  view.innerHTML = `
    ${firstTime ? `<section class="card banner">
      <div><h2>¿Primera vez?</h2><p class="muted">Hacé el test de nivel: 34 preguntas (2 por tema), unos 10 minutos. Sirve para ordenar la hoja de ruta según lo que ya sabés.</p></div>
      <button class="btn primary" data-start="placement">Hacer el test de nivel</button>
    </section>` : ""}
    <section class="hero">
      <div class="hero-stats">
        <div class="stat"><span class="stat-num">${streakDays()}</span><span class="stat-label">días de racha</span></div>
        <div class="stat"><span class="stat-num">${esc(lvl.label)}</span><span class="stat-label">nivel estimado</span></div>
      </div>
      ${goalBar()}
      <div class="hero-actions">
        <button class="btn primary" data-start="mixed">Práctica mixta</button>
        ${dueCount ? `<button class="btn" data-start="review">Repasar pendientes (${dueCount})</button>` : ""}
        ${mistakesCount ? `<button class="btn" data-start="mistakes">Practicar errores (${mistakesCount})</button>` : ""}
      </div>
    </section>
    ${roadmap()}
    ${LEVELS.map((l) => `
      <section class="level">
        <h2>${esc(l.name)} <span class="muted">· ${esc(l.desc)}</span></h2>
        <div class="topics">${TOPICS.filter((t) => t.level === l.id).map(topicCard).join("")}</div>
      </section>`).join("")}
  `;
}

function topicCard(t) {
  const s = topicStats(t.id);
  return `
    <article class="topic ${s.mastered ? "mastered" : ""}">
      <div class="topic-head">
        <h3>${esc(t.name)}</h3>
        ${s.mastered ? `<span class="badge">✓ Dominado</span>` : likelyKnown(t.id) && !s.total ? `<span class="badge known">★ Test 2/2</span>` : ""}
      </div>
      <div class="meter" role="meter" aria-valuenow="${s.mastery}" aria-valuemin="0" aria-valuemax="100" aria-label="Dominio">
        <div class="meter-fill" style="width:${s.mastery}%"></div>
      </div>
      <p class="muted small">${s.total ? `Dominio ${s.mastery}% · ${Math.round(s.acc * 100)}% en los últimos ${s.recentN}` : "Sin practicar todavía"}</p>
      <div class="topic-actions">
        <button class="btn primary small" data-start="topic" data-topic="${t.id}">Practicar</button>
        <button class="btn ghost small" data-read="${t.id}">Ver regla</button>
      </div>
    </article>`;
}

// ---------- Regla (pantalla de lectura) ----------

function renderRulePage(topicId) {
  const t = TOPIC_BY_ID[topicId];
  if (!t) { location.replace("#inicio"); return; }
  setNav("");
  session = null;
  const i = TOPICS.indexOf(t), prev = TOPICS[i - 1], nxt = TOPICS[i + 1];
  const s = topicStats(t.id);
  const level = LEVELS.find((l) => l.id === t.level);
  view.innerHTML = `
    <article class="card rule-page">
      <button class="btn ghost small back" data-nav="home">← Temas</button>
      <p class="muted small">${esc(level.name)} · ${s.total ? `Dominio ${s.mastery}%` : "Sin practicar todavía"}</p>
      <h1>${esc(t.name)}</h1>
      <div class="rule-body">${renderRule(t)}</div>
      <div class="hero-actions">
        <button class="btn primary" data-start="topic" data-topic="${t.id}">Practicar este tema</button>
        ${VERB_TOPICS.includes(t.id) ? `<button class="btn" data-nav="verbs">Ver lista de verbos</button>` : ""}
      </div>
    </article>
    <div class="rule-pager">
      ${prev ? `<button class="btn" data-read="${prev.id}">← ${esc(prev.name)}</button>` : "<span></span>"}
      ${nxt ? `<button class="btn" data-read="${nxt.id}">${esc(nxt.name)} →</button>` : ""}
    </div>`;
  window.scrollTo(0, 0);
}

// ---------- Sesión ----------

function startSession(mode, topicId) {
  const items = buildSession(mode, topicId);
  if (!items.length) { go("home"); return; }
  session = { mode, topicId, items, i: 0, results: [] };
  if (location.hash === "#practica") renderQuestion();
  else location.hash = "practica"; // hashchange muestra la primera pregunta
}

function renderQuestion() {
  setNav("");
  const ex = session.items[session.i];
  const topic = TOPIC_BY_ID[ex.topic];
  const test = session.mode === "placement";
  Object.assign(session, { answered: false, hinted: false, retried: false });
  let body = "";
  if (ex.type === "mc") {
    session.shuffled = shuffle(ex.options);
    body = `<p class="prompt">${blank(esc(ex.prompt))}</p>
      <div class="options">${session.shuffled.map((o, i) => `<button class="option" data-opt="${i}"><kbd>${i + 1}</kbd>${esc(o)}</button>`).join("")}</div>`;
  } else if (ex.type === "gap") {
    const hint = ex.options ? `<p class="muted small">Opciones: ${ex.options.map(esc).join(" / ")}</p>` : "";
    const parts = esc(ex.prompt).split("___");
    body = `<p class="prompt">${parts[0]}<input id="gap" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Respuesta">${parts.slice(1).join("___")}</p>
      ${hint}<button class="btn primary" id="check">Comprobar</button>`;
  } else if (ex.type === "rw") {
    body = `<p class="muted">Reescribí la oración empezando como se indica, sin cambiar el significado.</p>
      <p class="source">${esc(ex.source)}</p>
      <p class="prompt rw-line"><span class="rw-start">${esc(ex.start)}</span><input id="gap" class="wide" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Continuación"></p>
      <button class="btn primary" id="check">Comprobar</button>`;
  } else {
    body = `<p class="muted">Tocá la parte de la oración que tiene el error.</p>
      <p class="prompt err-parts">${ex.parts.map((p, i) => `<button class="part" data-part="${i}">${esc(p)}</button>`).join(" ")}</p>`;
  }
  view.innerHTML = `
    <section class="card question">
      <div class="q-head">
        <span class="muted small">${session.i + 1} / ${session.items.length} · ${test ? "Test de nivel · " : ""}${esc(topic.name)}</span>
        <span>
          ${test ? `<button class="btn ghost small" id="skip">No sé</button>` : `
          <button class="btn ghost small" id="hint-btn">💡 Pista</button>
          <button class="btn ghost small" id="show-rule">Regla</button>`}
        </span>
      </div>
      <div class="progress-bar"><div style="width:${(session.i / session.items.length) * 100}%"></div></div>
      <div class="rule" id="q-rule" hidden>${renderRule(topic)}</div>
      ${body}
      <div id="hint"></div>
      <div id="feedback"></div>
    </section>`;
  const gap = $("#gap");
  if (gap) gap.focus();
}

function showHint() {
  const ex = session.items[session.i];
  if (session.answered || session.hinted) return;
  session.hinted = true;
  $("#hint-btn").disabled = true;
  const c = conceptOf(ex);
  let specific = "";
  if (ex.type === "gap" || ex.type === "rw") {
    const words = ex.answers[0].split(" ");
    specific = ex.type === "rw"
      ? `Empieza con «${esc(words[0])}» · ${words.length} palabra${words.length > 1 ? "s" : ""}.`
      : `Empieza con «${esc(ex.answers[0][0])}» · ${words.length} palabra${words.length > 1 ? "s" : ""}.`;
  } else if (ex.type === "mc") {
    const wrong = [...document.querySelectorAll(".option")].filter((b) => session.shuffled[+b.dataset.opt] !== ex.answers[0]);
    const strike = wrong[Math.floor(Math.random() * wrong.length)];
    strike.disabled = true;
    strike.classList.add("struck");
    specific = "Tachamos una opción incorrecta.";
  } else {
    $("#q-rule").hidden = false;
    specific = "Abrimos la regla del tema.";
  }
  $("#hint").innerHTML = `<div class="hint">💡 ${c ? `Fijate en: <b>${c.title}</b>. ` : ""}${specific}</div>`;
}

function answer(given) {
  if (session.answered) return;
  const ex = session.items[session.i];
  const ok = given !== null && isCorrect(ex, given); // null = "No sé" en el test

  if (session.mode === "placement") {
    session.answered = true;
    session.results.push({ ex, ok });
    next();
    return;
  }

  if (!ok && !session.retried && isNearMiss(ex, given)) {
    session.retried = true;
    $("#feedback").innerHTML = `<div class="feedback near"><strong>Casi…</strong><p>Revisá la ortografía: estás muy cerca. Tenés un intento más.</p></div>`;
    $("#gap").select();
    return;
  }

  session.answered = true;
  session.results.push({ ex, ok, given });
  recordAnswer(ex, ok, { hinted: session.hinted, given });

  let right;
  if (ex.type === "mc") {
    document.querySelectorAll(".option").forEach((b) => {
      const val = session.shuffled[+b.dataset.opt];
      b.disabled = true;
      if (val === ex.answers[0]) b.classList.add("correct");
      else if (val === given) b.classList.add("wrong");
    });
    right = ex.answers[0];
  } else if (ex.type === "gap" || ex.type === "rw") {
    const input = $("#gap");
    input.disabled = true;
    input.classList.add(ok ? "correct" : "wrong");
    $("#check").remove();
    right = ex.type === "rw" ? `${ex.start} ${ex.answers[0]}` : ex.answers.join(" / ");
  } else {
    document.querySelectorAll(".part").forEach((b) => {
      const i = +b.dataset.part;
      b.disabled = true;
      if (i === ex.answers[0]) b.classList.add("correct");
      else if (i === given) b.classList.add("wrong");
    });
    right = `«${ex.parts[ex.answers[0]]}» → ${ex.correction}`;
  }

  let whyWrong = "";
  if (!ok) {
    if (ex.type === "err") {
      whyWrong = `«${esc(ex.parts[given])}» está bien; el error está en «${esc(ex.parts[ex.answers[0]])}».`;
    } else {
      const w = knownWrongWhy(ex, given);
      whyWrong = w ? `<b>«${esc(ex.type === "mc" ? given : typed(ex, given))}»:</b> ${w}` : "";
    }
  }
  const c = conceptOf(ex);
  const es = translationOf(ex), listen = sayBtn(fullSentence(ex));
  const last = session.i === session.items.length - 1;
  $("#hint").innerHTML = "";
  $("#feedback").innerHTML = `
    <div class="feedback ${ok ? "ok" : "ko"}">
      <strong>${ok ? `✓ ¡Correcto!${session.hinted ? " <span class='muted small'>(con pista: va a volver mañana)</span>" : ""}` : "✗ Incorrecto"}</strong>
      ${ok && ex.type === "mc" ? "" : `<p>Respuesta${ex.answers.length > 1 && ex.type === "gap" ? "s aceptadas" : ""}: <b>${esc(right)}</b></p>`}
      <p class="why"><span class="label">Por qué</span>${ex.explanation}</p>
      ${whyWrong ? `<p class="why"><span class="label">Tu respuesta</span>${whyWrong}</p>` : ""}
      ${es || listen ? `<p class="why"><span class="label">${es ? "En español" : "Escuchar"}</span>${es ? esc(es) + " " : ""}${listen}</p>` : ""}
    </div>
    ${c ? `<details class="concept" ${ok ? "" : "open"}>
      <summary>Más ejemplos: ${c.title}</summary>
      <p>${c.text}</p>
      ${exampleList(ex.topic, ex.concept, c.examples)}
    </details>` : ""}
    <button class="btn primary" id="next">${last ? "Ver resultado" : "Siguiente"} <kbd>Enter</kbd></button>`;
  $("#next").focus();
}

function next() {
  session.i++;
  session.done = session.i >= session.items.length; // en el resumen el teclado ya no responde
  if (session.i >= session.items.length) session.mode === "placement" ? renderPlacementResult() : renderSummary();
  else renderQuestion();
}

function renderSummary() {
  const okCount = session.results.filter((r) => r.ok).length;
  const wrong = session.results.filter((r) => !r.ok);
  const pct = Math.round((okCount / session.results.length) * 100);
  const msg = pct >= 90 ? "¡Excelente!" : pct >= 70 ? "¡Muy bien!" : pct >= 50 ? "Vas bien, seguí practicando." : "Repasá la regla y probá otra vez.";
  view.innerHTML = `
    <section class="card summary">
      <p class="big-score">${okCount} / ${session.results.length}</p>
      <p>${msg}</p>
      ${goalBar()}
      ${wrong.length ? `<h3>Para repasar</h3><ul class="mistakes">${wrong.map(({ ex }) => `<li>${mistakeLine(ex)}</li>`).join("")}</ul>
        <p class="muted small">Quedan guardados en la pestaña Errores y van a volver en tus próximas sesiones.</p>` : ""}
      <div class="hero-actions">
        <button class="btn primary" data-start="${session.mode}" ${session.topicId ? `data-topic="${session.topicId}"` : ""}>Otra ronda</button>
        <button class="btn" data-nav="home">Inicio</button>
      </div>
    </section>`;
}

function renderPlacementResult() {
  const results = {};
  for (const { ex, ok } of session.results) results[ex.topic] = (results[ex.topic] || 0) + (ok ? 1 : 0);
  savePlacement(results);
  const sum = placementSummary(results);
  const next = nextRecommended();
  const total = session.results.filter((r) => r.ok).length;
  view.innerHTML = `
    <section class="card summary">
      <p class="muted">Resultado del test de nivel</p>
      <p class="big-score">${esc(sum.label)}</p>
      <p>${total} / ${session.results.length} correctas · A2: ${Math.round(sum.a2 * 100)}% · A2+/B1: ${Math.round(sum.b1 * 100)}%</p>
      ${next ? `<p>Te recomendamos empezar por <b>${esc(next.name)}</b>.</p>` : ""}
      <div class="table-wrap"><table class="placement">
        <thead><tr><th>Tema</th><th>Resultado</th></tr></thead>
        <tbody>${TOPICS.map((t) => { const r = results[t.id] || 0; return `<tr><td>${esc(t.name)}</td><td>${r === 2 ? "★ 2/2" : r === 1 ? "◐ 1/2" : "○ 0/2"}</td></tr>`; }).join("")}</tbody>
      </table></div>
      <p class="muted small">El test no marca temas como dominados: eso se gana practicando. Los temas con 2/2 quedan como "probablemente lo sabés" y aparecen menos en la práctica mixta.</p>
      <div class="hero-actions">
        ${next ? `<button class="btn primary" data-start="topic" data-topic="${next.id}">Empezar con ${esc(next.name)}</button>` : ""}
        <button class="btn" data-nav="home">Inicio</button>
      </div>
    </section>`;
}

function mistakeLine(ex) {
  if (ex.type === "err") return ex.fixed || ex.parts.map((p, i) => (i === ex.answers[0] ? `<b>${esc(ex.correction)}</b>` : esc(p))).join(" ");
  if (ex.type === "rw") return `${esc(ex.source)} → ${esc(ex.start)} <b>${esc(ex.answers[0])}</b>`;
  return esc(ex.prompt).replace(/ \([^)]*\)/, "").replace("___", `<b>${esc(ex.answers[0])}</b>`);
}

// ---------- Verbos ----------

const VERB_TOPICS = ["past-simple", "past-cont", "present-perfect", "pp-vs-past", "passive"];
let verbsFilter = { q: "", kind: "all", open: null };

// Un verbo en los tiempos que se practican, con la 1.ª y la 3.ª persona (la que cambia).
function conjugation(v) {
  const [base, s, ing] = v;
  const [past, pp] = [v[3], v[4]].map((f) => f.split(" / ")[0]);
  if (base === "be") return [
    ["Present simple", "I <b>am</b> · she <b>is</b> · they <b>are</b>", "I'm <b>not</b> · she <b>isn't</b>", "<b>Are</b> you…? · <b>Is</b> she…?"],
    ["Past simple", "I <b>was</b> · they <b>were</b>", "I <b>wasn't</b> · they <b>weren't</b>", "<b>Was</b> she…? · <b>Were</b> you…?"],
    ["Present perfect", "I've <b>been</b> · she's <b>been</b>", "I <b>haven't been</b> · she <b>hasn't been</b>", "<b>Have</b> you <b>been</b>…?"],
    ["Future (will)", "I'll <b>be</b>", "I <b>won't be</b>", "<b>Will</b> you <b>be</b>…?"],
    ["Going to", "I'm <b>going to be</b>", "I'm <b>not going to be</b>", "<b>Are</b> you <b>going to be</b>…?"],
  ];
  return [
    ["Present simple", `I <b>${base}</b> · she <b>${s}</b>`, `I <b>don't ${base}</b> · she <b>doesn't ${base}</b>`, `<b>Do</b> you <b>${base}</b>? · <b>Does</b> she <b>${base}</b>?`],
    ["Present continuous", `I'm <b>${ing}</b> · she's <b>${ing}</b>`, `I'm <b>not ${ing}</b> · she <b>isn't ${ing}</b>`, `<b>Are</b> you <b>${ing}</b>?`],
    ["Past simple", `I <b>${past}</b> · she <b>${past}</b>`, `I <b>didn't ${base}</b>`, `<b>Did</b> you <b>${base}</b>?`],
    ["Past continuous", `I <b>was ${ing}</b> · they <b>were ${ing}</b>`, `I <b>wasn't ${ing}</b>`, `<b>Were</b> you <b>${ing}</b>?`],
    ["Present perfect", `I've <b>${pp}</b> · she's <b>${pp}</b>`, `I <b>haven't ${pp}</b> · she <b>hasn't ${pp}</b>`, `<b>Have</b> you <b>${pp}</b>? · <b>Has</b> she <b>${pp}</b>?`],
    ["Future (will)", `I'll <b>${base}</b>`, `I <b>won't ${base}</b>`, `<b>Will</b> you <b>${base}</b>?`],
    ["Going to", `I'm <b>going to ${base}</b>`, `I'm <b>not going to ${base}</b>`, `<b>Are</b> you <b>going to ${base}</b>?`],
  ];
}

// Pronunciación escrita de la forma i (0 base, 1 pasado, 2 participio). En los regulares, el participio suena como el pasado.
function sounds(v, i) {
  const p = (VERB_PRON[v[0]] || "").split(" · ");
  const s = p[Math.min(i, p.length - 1)];
  return s ? `<span class="sound">${esc(s)}</span>` : "";
}

const canSpeak = "speechSynthesis" in window;
function speak(text) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.85;
  speechSynthesis.speak(u);
}

function renderVerbs() {
  setNav("verbs");
  session = null;
  const kinds = [["all", "Todos"], ["irregular", "Irregulares"], ["regular", "Regulares"]];
  view.innerHTML = `
    <section class="card">
      <h2>Verbos</h2>
      <p class="muted small">Base, pasado y participio de ${IRREGULAR_VERBS.length} verbos irregulares y ${REGULAR_VERBS.length} regulares frecuentes. Tocá un verbo para ver cómo se conjuga${canSpeak ? " y escucharlo" : ""}.</p>
      <p class="muted small">Debajo de cada forma está cómo suena, escrito a la española. Es aproximado: la tilde marca la sílaba fuerte, <b>z</b> es con la lengua entre los dientes (<i>think</i>), <b>sh</b> como en «shampoo» y <b>j</b> es una h suave, como un suspiro (<i>have</i>).</p>
      <div class="filters">
        <input type="search" id="verbs-q" placeholder="Buscar en inglés o español" value="${esc(verbsFilter.q)}" autocomplete="off" aria-label="Buscar verbo">
        <div class="seg">${kinds.map(([k, l]) => `<button class="btn small ${verbsFilter.kind === k ? "primary" : ""}" data-verbs-kind="${k}">${l}</button>`).join("")}</div>
      </div>
      <details class="concept">
        <summary>Cómo se forma el pasado de los regulares</summary>
        <div class="table-wrap"><table class="rule-table">${REGULAR_RULES.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table></div>
      </details>
    </section>
    <section class="card"><div id="verbs-list"></div></section>`;
  renderVerbList();
}

function renderVerbList() {
  const q = normalize(verbsFilter.q);
  const { kind, open } = verbsFilter;
  const rows = [
    ...(kind !== "regular" ? IRREGULAR_VERBS.map((v) => [v, true]) : []),
    ...(kind !== "irregular" ? REGULAR_VERBS.map((v) => [v, false]) : []),
  ].filter(([v]) => !q || v.some((f) => f.toLowerCase().includes(q)))
    .sort(([a], [b]) => a[0].localeCompare(b[0]));
  $("#verbs-list").innerHTML = rows.length ? `
    <div class="table-wrap"><table class="verbs">
      <thead><tr><th>Base</th><th>Pasado</th><th>Participio</th><th>Significado</th></tr></thead>
      <tbody>${rows.map(([v, irr]) => `
        <tr class="verb-row ${open === v[0] ? "open" : ""}" data-verb="${v[0]}" tabindex="0" aria-expanded="${open === v[0]}">
          <td><b>${v[0]}</b>${irr ? "" : ` <span class="muted small">reg.</span>`}${sounds(v, 0)}</td>
          <td class="${irr ? "irr" : ""}">${v[3]}${sounds(v, 1)}</td><td class="${irr ? "irr" : ""}">${v[4]}${sounds(v, 2)}</td><td>${esc(v[5])}</td>
        </tr>
        ${open === v[0] ? `<tr class="conj-row"><td colspan="4">
          <p class="small muted">${esc(v[0])} · ${v[1]} · ${v[2]} · ${v[3]} · ${v[4]}
            ${canSpeak ? `<button class="btn small" data-say="${esc([v[0], v[3], v[4]].join(". "))}">🔊 Escuchar</button>` : ""}</p>
          <div class="table-wrap"><table class="rule-table conj">
            <thead><tr><th></th><th>Afirmativa</th><th>Negativa</th><th>Pregunta</th></tr></thead>
            <tbody>${conjugation(v).map(([t, ...cells]) => `<tr><th>${t}</th>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
          </table></div>
        </td></tr>` : ""}`).join("")}
      </tbody>
    </table></div>` : `<p class="muted">No hay verbos que coincidan con «${esc(verbsFilter.q)}».</p>`;
}

function toggleVerb(base) {
  verbsFilter.open = verbsFilter.open === base ? null : base;
  renderVerbList();
  document.querySelector(`tr[data-verb="${base}"]`)?.focus();
}

// ---------- Libreta de errores ----------

function renderMistakes() {
  setNav("mistakes");
  session = null;
  const topicsWith = TOPICS.filter((t) => progress.mistakes.some((m) => m.ex.topic === t.id));
  const list = progress.mistakes.filter((m) =>
    (!mistakesFilter.topic || m.ex.topic === mistakesFilter.topic) && (mistakesFilter.showOvercome || !isOvercome(m.id)));
  const pending = list.filter((m) => !isOvercome(m.id)).length;
  const fmt = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" });
  view.innerHTML = `
    <section class="card">
      <h2>Libreta de errores</h2>
      <p class="muted small">Todo lo que fallaste, con la respuesta correcta y la explicación. Un error queda <b>superado</b> cuando lo acertás dos veces seguidas.</p>
      <div class="filters">
        <select id="mistakes-topic" aria-label="Filtrar por tema">
          <option value="">Todos los temas</option>
          ${topicsWith.map((t) => `<option value="${t.id}" ${mistakesFilter.topic === t.id ? "selected" : ""}>${esc(t.name)}</option>`).join("")}
        </select>
        <label class="check"><input type="checkbox" id="mistakes-overcome" ${mistakesFilter.showOvercome ? "checked" : ""}> Mostrar superados</label>
        ${pending ? `<button class="btn primary" data-start="mistakes" ${mistakesFilter.topic ? `data-topic="${mistakesFilter.topic}"` : ""}>Practicar estos errores (${pending})</button>` : ""}
      </div>
    </section>
    ${list.length ? list.map((m) => {
      const ex = EXERCISE_BY_ID[m.id] || m.ex;
      const done = isOvercome(m.id);
      const yours = m.given === undefined ? "" : ex.type === "err" ? ex.parts[m.given] : typed(ex, String(m.given));
      return `
        <article class="card mistake ${done ? "overcome" : ""}">
          <div class="mistake-head">
            <span class="muted small">${esc(TOPIC_BY_ID[ex.topic].name)} · ${fmt.format(new Date(m.at))}</span>
            ${done ? `<span class="badge">✓ Superado</span>` : ""}
          </div>
          <p class="mistake-line">${mistakeLine(ex)} ${sayBtn(fullSentence(ex))}</p>
          ${translationOf(ex) ? `<p class="small es">${esc(translationOf(ex))}</p>` : ""}
          ${yours ? `<p class="small">Tu respuesta: <span class="bad">${esc(yours)}</span></p>` : ""}
          <p class="small">${ex.explanation}</p>
          ${knownWrongWhy(ex, m.given) ? `<p class="small muted">${knownWrongWhy(ex, m.given)}</p>` : ""}
        </article>`;
    }).join("") : `<section class="card"><p class="muted">${progress.mistakes.length ? "No hay errores pendientes con este filtro. 🎉" : "Todavía no hay errores guardados. Cuando falles un ejercicio, va a aparecer acá."}</p></section>`}
  `;
}

// ---------- Progreso ----------

function renderProgress() {
  setNav("progress");
  session = null;
  const t = totals();
  const lvl = estimatedLevel();
  const days = lastDays(14);
  const goal = progress.settings.dailyGoal;
  const max = Math.max(goal * 1.2, ...days.map((d) => d.done));
  const H = 140;
  const fmt = new Intl.DateTimeFormat("es", { weekday: "short", day: "numeric" });
  const pl = progress.placement;
  view.innerHTML = `
    <section class="tiles">
      <div class="tile"><span class="stat-num">${streakDays()}</span><span class="stat-label">días de racha</span></div>
      <div class="tile"><span class="stat-num">${t.done}</span><span class="stat-label">ejercicios en total</span></div>
      <div class="tile"><span class="stat-num">${t.done ? Math.round((t.correct / t.done) * 100) : 0}%</span><span class="stat-label">precisión global</span></div>
      <div class="tile"><span class="stat-num">${TOPICS.filter((x) => topicStats(x.id).mastered).length}/${TOPICS.length}</span><span class="stat-label">temas dominados</span></div>
    </section>
    <section class="card">
      <h2>Nivel estimado: ${esc(lvl.label)}</h2>
      <p class="muted">${esc(lvl.detail)}</p>
      <p class="small">${pl ? `Último test de nivel: <b>${esc(placementSummary(pl.results).label)}</b> (${new Date(pl.at).toLocaleDateString("es")}).` : "Todavía no hiciste el test de nivel."}</p>
      <button class="btn" data-start="placement">${pl ? "Repetir el test de nivel" : "Hacer el test de nivel"}</button>
    </section>
    <section class="card">
      <h2>Ejercicios por día <span class="muted small">· últimos 14 días · línea = meta (${goal})</span></h2>
      <div class="chart" role="img" aria-label="Ejercicios por día en los últimos 14 días, con la meta diaria de ${goal}">
        <div class="bars" style="height:${H + 16}px">
          <div class="goal-line" style="bottom:${(goal / max) * H}px"><span>meta</span></div>
          ${days.map((d) => `
            <div class="bar-col" title="${esc(fmt.format(d.date))}: ${d.done} ejercicios${d.done ? `, ${d.correct} correctos` : ""}">
              <span class="bar-val">${d.done || ""}</span>
              <div class="bar ${d.done >= goal ? "met" : ""}" style="height:${(d.done / max) * H}px"></div>
            </div>`).join("")}
        </div>
        <div class="bar-labels">${days.map((d) => `<span>${esc(fmt.format(d.date).replace(/\./g, ""))}</span>`).join("")}</div>
      </div>
    </section>
    <section class="card">
      <h2>Meta diaria</h2>
      <div class="filters">
        <label class="check">Ejercicios por día <input type="number" id="goal-input" min="5" max="200" step="5" value="${goal}"></label>
        <button class="btn" id="goal-save">Guardar</button>
      </div>
    </section>
    <section class="card">
      <h2>Por tema</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Tema</th><th>Nivel</th><th>Intentos</th><th>Precisión total</th><th>Dominio</th></tr></thead>
        <tbody>${TOPICS.map((x) => {
          const s = topicStats(x.id);
          return `<tr><td>${esc(x.name)}</td><td>${x.level === "A2" ? "A2" : "A2+/B1"}</td><td>${s.total}</td>
            <td>${s.total ? Math.round((s.correct / s.total) * 100) + "%" : "—"}</td>
            <td>${s.mastered ? "✓ " : ""}${s.mastery}%</td></tr>`;
        }).join("")}</tbody>
      </table></div>
    </section>
    <section class="card">
      <h2>Respaldo</h2>
      <p class="muted small">El progreso se guarda en este navegador. Exportalo de vez en cuando para no perderlo.</p>
      <div class="hero-actions">
        <button class="btn" id="export">Exportar progreso</button>
        <label class="btn">Importar progreso<input type="file" id="import" accept="application/json,.json" hidden></label>
        <button class="btn danger" id="reset">Borrar todo</button>
      </div>
    </section>`;
}

// ---------- Rutas ----------
// Cada pantalla tiene su #ruta para que los botones atrás/adelante del navegador funcionen.

const ROUTES = { home: "inicio", verbs: "verbos", mistakes: "errores", progress: "progreso" };
const RENDER = { inicio: renderHome, verbos: renderVerbs, errores: renderMistakes, progreso: renderProgress };

function go(name) {
  const hash = "#" + ROUTES[name];
  if (location.hash === hash) RENDER[ROUTES[name]]();
  else location.hash = hash;
}

function route() {
  const r = location.hash.slice(1);
  if (r === "practica") {
    // Sin sesión activa (por ejemplo, al volver con "adelante") no hay nada que mostrar.
    if (session) renderQuestion();
    else location.replace("#inicio");
  } else if (r.startsWith("regla/")) {
    renderRulePage(r.slice("regla/".length));
  } else {
    (RENDER[r] || renderHome)();
  }
}

window.addEventListener("hashchange", route);

// ---------- Eventos ----------

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, label, tr[data-verb]");
  if (!t) return;
  if (t.dataset.nav) go(t.dataset.nav);
  else if (t.dataset.say) speak(t.dataset.say);
  else if (t.dataset.verb) toggleVerb(t.dataset.verb);
  else if (t.dataset.verbsKind) { verbsFilter.kind = t.dataset.verbsKind; renderVerbs(); }
  else if (t.dataset.start) startSession(t.dataset.start, t.dataset.topic);
  else if (t.dataset.read) location.hash = "regla/" + t.dataset.read;
  else if (t.id === "show-rule") { const r = $("#q-rule"); r.hidden = !r.hidden; }
  else if (t.id === "hint-btn") showHint();
  else if (t.id === "skip") answer(null);
  else if (t.dataset.opt !== undefined) answer(session.shuffled[+t.dataset.opt]);
  else if (t.dataset.part !== undefined) answer(+t.dataset.part);
  else if (t.id === "check") { const v = $("#gap").value; if (v.trim()) answer(v); }
  else if (t.id === "next") next();
  else if (t.id === "export") exportProgress();
  else if (t.id === "goal-save") {
    const v = Math.round(+$("#goal-input").value);
    if (v >= 1) { progress.settings.dailyGoal = v; saveProgress(); renderProgress(); }
  }
  else if (t.id === "reset") {
    if (confirm("¿Borrar todo el progreso? Esta acción no se puede deshacer.")) { resetProgress(); renderProgress(); }
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "mistakes-topic") { mistakesFilter.topic = e.target.value; renderMistakes(); return; }
  if (e.target.id === "mistakes-overcome") { mistakesFilter.showOvercome = e.target.checked; renderMistakes(); return; }
  if (e.target.id !== "import" || !e.target.files[0]) return;
  importProgress(e.target.files[0])
    .then(() => { alert("Progreso importado."); renderProgress(); })
    .catch(() => alert("No se pudo leer el archivo."));
});

document.addEventListener("input", (e) => {
  if (e.target.id === "verbs-q") { verbsFilter.q = e.target.value; verbsFilter.open = null; renderVerbList(); }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.dataset?.verb) { toggleVerb(e.target.dataset.verb); return; }
  if (!session || session.done) return;
  if (e.key === "Enter") {
    if (session.answered && session.mode !== "placement") { e.preventDefault(); next(); }
    else if (e.target.id === "gap" && e.target.value.trim()) { e.preventDefault(); answer(e.target.value); }
  } else if (!session.answered && /^[1-4]$/.test(e.key) && session.items[session.i].type === "mc") {
    const btn = document.querySelector(`.option[data-opt="${+e.key - 1}"]`);
    if (btn && !btn.disabled) answer(session.shuffled[+e.key - 1]);
  }
});

route();
