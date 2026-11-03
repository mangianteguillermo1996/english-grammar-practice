// Progreso guardado en localStorage, repetición espaciada y estadísticas.

const STORAGE_KEY = "grammar-practice-v1";
const DAY = 24 * 60 * 60 * 1000;
const INTERVALS = [1, 3, 7, 16, 35]; // días hasta la próxima repetición según aciertos seguidos
const RECENT = 20;     // intentos que cuentan para el dominio de un tema
const MASTERED = 0.8;  // precisión necesaria
const MIN_FOR_MASTERY = 15;
const MAX_MISTAKES = 300;

function emptyProgress() {
  return { attempts: {}, daily: {}, topics: {}, review: {}, mistakes: [], settings: { dailyGoal: 20 }, placement: null };
}

let progress = loadProgress();

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return withDefaults(JSON.parse(raw));
  } catch (e) { /* almacenamiento no disponible: se empieza de cero */ }
  return emptyProgress();
}

// Completa los campos que faltan en progresos guardados con versiones anteriores.
function withDefaults(data) {
  const base = emptyProgress();
  return { ...base, ...data, settings: { ...base.settings, ...(data.settings || {}) } };
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (e) { /* ignorar */ }
}

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// hinted: acertó usando la pista → cuenta como acierto, pero el repaso no se espacia.
function recordAnswer(ex, correct, { hinted = false, given } = {}) {
  const now = Date.now();
  const a = progress.attempts[ex.id] || { c: 0, w: 0, streak: 0 };
  if (correct && !hinted) {
    a.c++; a.streak++;
    a.due = now + INTERVALS[Math.min(a.streak - 1, INTERVALS.length - 1)] * DAY;
  } else if (correct) {
    a.c++;
    a.due = now + DAY;
  } else {
    a.w++; a.streak = 0;
    a.due = now; // vuelve en la próxima sesión
  }
  a.last = now;
  progress.attempts[ex.id] = a;

  // Los ejercicios generados no se pueden reconstruir por id: se guardan si hay que repasarlos.
  if (ex.generated) {
    if (!correct) progress.review[ex.id] = ex;
    else if (a.streak >= 2) delete progress.review[ex.id];
  }

  if (!correct) {
    progress.mistakes = progress.mistakes.filter((m) => m.id !== ex.id);
    progress.mistakes.unshift({ id: ex.id, ex, given, at: now });
    progress.mistakes.length = Math.min(progress.mistakes.length, MAX_MISTAKES);
  }

  const t = progress.topics[ex.topic] || { recent: [], total: 0, correct: 0 };
  t.recent.push(correct ? 1 : 0);
  if (t.recent.length > RECENT) t.recent.shift();
  t.total++; if (correct) t.correct++;
  progress.topics[ex.topic] = t;

  const k = todayKey();
  const d = progress.daily[k] || { done: 0, correct: 0 };
  d.done++; if (correct) d.correct++;
  progress.daily[k] = d;

  saveProgress();
}

// Un error queda "superado" con dos aciertos seguidos sin pista después de fallarlo.
const isOvercome = (id) => (progress.attempts[id]?.streak || 0) >= 2;

function topicStats(topicId) {
  const t = progress.topics[topicId] || { recent: [], total: 0, correct: 0 };
  const n = t.recent.length;
  const acc = n ? t.recent.reduce((s, x) => s + x, 0) / n : 0;
  // El dominio crece con la precisión reciente, pero no llega a 100% con pocos intentos.
  const mastery = Math.round(acc * Math.min(1, n / MIN_FOR_MASTERY) * 100);
  return { total: t.total, correct: t.correct, recentN: n, acc, mastery, mastered: n >= MIN_FOR_MASTERY && acc >= MASTERED };
}

// Ejercicios ya vistos que tocan repasar (fallados o con intervalo vencido).
function dueExercises(topicId) {
  const now = Date.now();
  const out = [];
  for (const [id, a] of Object.entries(progress.attempts)) {
    if (a.due > now) continue;
    const ex = EXERCISE_BY_ID[id] || progress.review[id];
    if (ex && (!topicId || ex.topic === topicId)) out.push({ ex, failed: a.streak === 0 });
  }
  return out;
}

function isNotDue(id) {
  const a = progress.attempts[id];
  return a && a.due > Date.now();
}

function streakDays() {
  let n = 0;
  const d = new Date();
  if (!progress.daily[todayKey(d)]) d.setDate(d.getDate() - 1); // la racha sigue viva si hoy todavía no practicaste
  while (progress.daily[todayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function lastDays(n) {
  const out = [];
  const d = new Date();
  d.setDate(d.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    const k = todayKey(d);
    out.push({ key: k, date: new Date(d), ...(progress.daily[k] || { done: 0, correct: 0 }) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function totals() {
  let done = 0, correct = 0;
  for (const d of Object.values(progress.daily)) { done += d.done; correct += d.correct; }
  return { done, correct };
}

function estimatedLevel() {
  const byLevel = (lvl) => {
    const ts = TOPICS.filter((t) => t.level === lvl);
    return ts.filter((t) => topicStats(t.id).mastered).length / ts.length;
  };
  const a2 = byLevel("A2"), b1 = byLevel("B1");
  if (a2 >= 0.85 && b1 >= 0.85) return { label: "B1 consolidado", detail: "Dominás casi todos los temas. Momento de ir por B2." };
  if (a2 >= 0.85 && b1 >= 0.4) return { label: "B1 en curso", detail: "A2 firme y avanzando bien en B1." };
  if (a2 >= 0.85) return { label: "A2 completo", detail: "Base sólida. Enfocate en los temas de A2+ / B1." };
  if (a2 >= 0.4) return { label: "A2+", detail: "Varios temas de A2 dominados; completá los que faltan." };
  return { label: "A2 en curso", detail: "Practicá cada tema hasta dominarlo (≥80% en los últimos 20)." };
}

// ---------- Test de nivel ----------

function savePlacement(results) {
  progress.placement = { at: Date.now(), results };
  saveProgress();
}

// Puntaje del test por nivel (0 a 1) y nivel sugerido.
function placementSummary(results) {
  const score = (lvl) => {
    const ts = TOPICS.filter((t) => t.level === lvl);
    return ts.reduce((s, t) => s + (results[t.id] || 0), 0) / (ts.length * 2);
  };
  const a2 = score("A2"), b1 = score("B1");
  let label;
  if (a2 >= 0.85 && b1 >= 0.75) label = "B1";
  else if (a2 >= 0.75 && b1 >= 0.5) label = "A2+ / B1 en curso";
  else if (a2 >= 0.75) label = "A2 completo";
  else if (a2 >= 0.5) label = "A2 en curso";
  else label = "A1+ / A2 inicial";
  return { a2, b1, label };
}

// Un tema "probablemente lo sabés" si sacaste 2/2 en el test y todavía no lo practicaste.
function likelyKnown(topicId) {
  return progress.placement?.results?.[topicId] === 2;
}

// Estado de cada tema para la hoja de ruta y el próximo recomendado.
function topicStatus(topicId) {
  const s = topicStats(topicId);
  if (s.mastered) return "mastered";
  if (s.total === 0 && likelyKnown(topicId)) return "known";
  if (s.total > 0) return "progress";
  return "pending";
}

function nextRecommended() {
  return TOPICS.find((t) => ["progress", "pending"].includes(topicStatus(t.id)))
    || TOPICS.find((t) => topicStatus(t.id) !== "mastered")
    || null;
}

// ---------- Respaldo ----------

function exportProgress() {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `progreso-ingles-${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  return file.text().then((txt) => {
    const data = JSON.parse(txt);
    if (!data || typeof data.attempts !== "object" || typeof data.daily !== "object") throw new Error("Archivo inválido");
    progress = withDefaults(data);
    saveProgress();
  });
}

function resetProgress() {
  progress = emptyProgress();
  saveProgress();
}
