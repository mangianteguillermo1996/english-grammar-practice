// Generadores por plantilla: combinan sujetos, verbos y contextos para crear
// ejercicios nuevos cada vez. El id codifica los parámetros, así que un mismo
// ejercicio generado se reconoce si vuelve a aparecer.
// Cada distractor viene con su "por qué está mal" ([texto, explicación]).

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const idx = (arr, item) => arr.indexOf(item);

// p: "1" = I, "2" = you, "3" = he/she/it, "pl" = we/they
const SUBJECTS = [
  { s: "I", p: "1" }, { s: "you", p: "2" }, { s: "he", p: "3" }, { s: "she", p: "3" },
  { s: "we", p: "pl" }, { s: "they", p: "pl" }, { s: "my sister", p: "3" },
  { s: "Pablo", p: "3" }, { s: "our neighbours", p: "pl" }, { s: "my parents", p: "pl" },
];
const is3 = (subj) => subj.p === "3";
const beNow = (subj) => (subj.p === "1" ? "am" : is3(subj) ? "is" : "are");
const bePast = (subj) => (subj.p === "1" || is3(subj) ? "was" : "were");
const have = (subj) => (is3(subj) ? "has" : "have");
const pron = (subj) => ({ "my sister": "she", Pablo: "he" }[subj.s] || subj.s);
const subjOf = (s) => SUBJECTS.find((x) => x.s === s);

// Forma -ing de un verbo (o del primer verbo de un phrasal: get up → getting up).
function ingForm(v) {
  const [w, ...rest] = v.split(" ");
  let ing;
  if (w === "be") ing = "being";
  else if (/[^e]e$/.test(w)) ing = w.slice(0, -1) + "ing";
  else if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(w)) ing = w + w.slice(-1) + "ing";
  else ing = w + "ing";
  return [ing, ...rest].join(" ");
}

// [base, 3rd person, -ing, past, participle, complement, sirve para hábitos]
const VERBS = [
  ["go", "goes", "going", "went", "gone", "to the gym", true],
  ["eat", "eats", "eating", "ate", "eaten", "a sandwich for lunch", true],
  ["drink", "drinks", "drinking", "drank", "drunk", "green tea", true],
  ["buy", "buys", "buying", "bought", "bought", "fresh bread", true],
  ["write", "writes", "writing", "wrote", "written", "emails to clients", true],
  ["read", "reads", "reading", "read", "read", "the newspaper", true],
  ["make", "makes", "making", "made", "made", "a cake", true],
  ["take", "takes", "taking", "took", "taken", "the bus to work", true],
  ["meet", "meets", "meeting", "met", "met", "friends in the city centre", true],
  ["play", "plays", "playing", "played", "played", "tennis", true],
  ["watch", "watches", "watching", "watched", "watched", "a documentary", true],
  ["cook", "cooks", "cooking", "cooked", "cooked", "pasta", true],
  ["visit", "visits", "visiting", "visited", "visited", "the museum", true],
  ["study", "studies", "studying", "studied", "studied", "in the library", true],
  ["work", "works", "working", "worked", "worked", "late", true],
  ["clean", "cleans", "cleaning", "cleaned", "cleaned", "the kitchen", true],
  ["walk", "walks", "walking", "walked", "walked", "in the park", true],
  ["travel", "travels", "travelling", "travelled", "travelled", "by train", true],
  ["drive", "drives", "driving", "drove", "driven", "to the coast", true],
  ["swim", "swims", "swimming", "swam", "swum", "in the lake", true],
  ["speak", "speaks", "speaking", "spoke", "spoken", "to the manager", true],
  ["teach", "teaches", "teaching", "taught", "taught", "English to children", true],
  ["wear", "wears", "wearing", "wore", "worn", "a suit", true],
  ["ride", "rides", "riding", "rode", "ridden", "a bike", true],
  ["sing", "sings", "singing", "sang", "sung", "in a choir", true],
  ["run", "runs", "running", "ran", "run", "along the river", true],
  ["forget", "forgets", "forgetting", "forgot", "forgotten", "the keys", false],
  ["lose", "loses", "losing", "lost", "lost", "a glove", false],
  ["find", "finds", "finding", "found", "found", "a nice café", false],
  ["leave", "leaves", "leaving", "left", "left", "the office early", true],
  ["send", "sends", "sending", "sent", "sent", "a postcard", false],
  ["break", "breaks", "breaking", "broke", "broken", "a glass", false],
  ["win", "wins", "winning", "won", "won", "a prize", false],
  ["stop", "stops", "stopping", "stopped", "stopped", "at the petrol station", false],
  ["plan", "plans", "planning", "planned", "planned", "a trip", false],
  ["catch", "catches", "catching", "caught", "caught", "the last train", false],
  ["sell", "sells", "selling", "sold", "sold", "the old car", false],
  ["tell", "tells", "telling", "told", "told", "a funny story", false],
  ["sleep", "sleeps", "sleeping", "slept", "slept", "very badly", false],
  ["build", "builds", "building", "built", "built", "a sandcastle", false],
];

function mk(topic, key, type, data) {
  return { id: `g:${topic}:${key}`, topic, type, generated: true, ...data };
}
// Elige entre hueco y opción múltiple. wrongs = [[texto, por qué está mal], ...].
// En los huecos, wrongWhy también sirve si escribís justo uno de esos errores.
function gapOrMc(topic, key, prompt, answers, wrongs, explanation, concept, mcRatio = 0.4) {
  const seen = new Set(answers);
  const clean = wrongs.filter(([w]) => w && !seen.has(w) && seen.add(w));
  const wrongWhy = Object.fromEntries(clean);
  const opts = [answers[0], ...clean.map(([w]) => w)].slice(0, 4);
  if (opts.length >= 2 && Math.random() < mcRatio) {
    return mk(topic, key + ":mc", "mc", { prompt, options: opts, answers: [answers[0]], explanation, concept, wrongWhy });
  }
  return mk(topic, key + ":gap", "gap", { prompt, answers, explanation, concept, wrongWhy });
}

const GENERATORS = {
  "past-simple"() {
    const TIMES = ["Yesterday", "Last weekend", "Two days ago", "Last night", "On Saturday", "In 2019", "Last summer"];
    const v = pick(VERBS), sub = pick(SUBJECTS), t = pick(TIMES);
    const [base, s3, , past, pp, comp] = v;
    const key = `${idx(VERBS, v)}:${idx(SUBJECTS, sub)}:${idx(TIMES, t)}`;
    const regular = past.endsWith("ed");
    const mode = pick(["aff", "aff", "neg", "q"]);
    if (mode === "aff") {
      return gapOrMc("past-simple", key + ":a", `${t}, ${sub.s} ___ (${base}) ${comp}.`, [past], [
        [pp, `"${pp}" es el participio: va con have (I have ${pp}), no solo.`],
        [base, `Es la forma base (presente). <i>${t}</i> pide pasado.`],
        [base + (base.endsWith("e") ? "d" : "ed"), regular ? `Ortografía: se escribe <b>${past}</b>.` : `<i>${base}</i> es irregular: no lleva -ed.`],
        [s3, `"${s3}" es present simple (he/she/it), no pasado.`],
      ], `<i>${t}</i> marca un momento terminado → past simple. ${regular ? "Regular" : "Irregular"}: ${base} → <b>${past}</b>.`, regular ? "regular" : "irregular");
    }
    if (mode === "neg") {
      return gapOrMc("past-simple", key + ":n", `${t}, ${sub.s} ___ (not / ${base}) ${comp}.`,
        [`didn't ${base}`, `did not ${base}`], [
          [`didn't ${past}`, "Didn't ya marca el pasado: el verbo vuelve a la base."],
          [`${bePast(sub)}n't ${base}`, "Wasn't/weren't es el pasado de be; con otro verbo la negativa se hace con didn't."],
          [`${is3(sub) ? "doesn't" : "don't"} ${base}`, "Es presente; la oración habla del pasado."],
        ], `Negativa en pasado: <b>didn't + ${base}</b> (verbo en base, sin cambiar a ${past}).`, "did");
    }
    return gapOrMc("past-simple", key + ":q", `___ (${sub.s} / ${base}) ${comp} ${t.replace(/^\w/, (c) => c.toLowerCase())}?`,
      [`did ${sub.s} ${base}`], [
        [`did ${sub.s} ${past}`, "Después de did va la base: el pasado ya lo marca did."],
        [`${bePast(sub)} ${sub.s} ${base}`, "Was/were no forma preguntas con otros verbos: va did."],
        [`${sub.s} ${past}`, "Falta el auxiliar: las preguntas en pasado necesitan did."],
      ], `Pregunta en pasado: <b>Did + sujeto + ${base}</b>.`, "did");
  },

  "pres-simple-cont"() {
    const HABIT = ["every day", "on Sundays", "twice a week", "every morning", "most weekends"];
    const NOW = ["Right now,", "At the moment,", "Look!", "This week", "These days"];
    const TEMP = ["This week", "These days"];
    const v = pick(VERBS.filter((x) => x[6])), sub = pick(SUBJECTS);
    const [base, s3, ing, past, , comp] = v;
    const key = `${idx(VERBS, v)}:${idx(SUBJECTS, sub)}`;
    const simple = is3(sub) ? s3 : base;
    const cont = `${beNow(sub)} ${ing}`;
    if (Math.random() < 0.5) {
      const h = pick(HABIT);
      return gapOrMc("pres-simple-cont", `${key}:s${idx(HABIT, h)}`, `${cap(sub.s)} ___ (${base}) ${comp} ${h}.`, [simple], [
        [cont, `Continuous es para lo que pasa ahora o en un período temporal. <i>${h}</i> marca una rutina.`],
        [is3(sub) ? base : s3, is3(sub) ? `Con ${sub.s} (he/she/it) el verbo lleva -s: <b>${s3}</b>.` : `La -s es solo para he/she/it; con ${sub.s} va <b>${base}</b>.`],
        [past, "Es pasado; la oración habla de una rutina actual."],
      ], `<i>${h}</i> indica una rutina → present simple: <b>${simple}</b>.`, "habit");
    }
    const n = pick(NOW);
    const temp = TEMP.includes(n);
    const start = n === "Look!" ? `Look! ${cap(sub.s)}` : `${n} ${sub.s}`;
    return gapOrMc("pres-simple-cont", `${key}:c${idx(NOW, n)}`, `${start} ___ (${base}) ${comp}.`, [cont], [
      [simple, temp
        ? `Present simple diría que es una rutina permanente (<i>${cap(sub.s)} ${simple} ${comp} every day</i>). <i>${n}</i> indica algo temporal, solo de este período.`
        : `Present simple es para hábitos; <i>${n.replace(/[,!]/, "")}</i> indica que está pasando en este momento.`],
      [ing, `Falta el verbo be: <b>${cont}</b>.`],
      [past, "Es pasado; la oración habla del presente."],
    ], temp
      ? `<i>${n}</i> marca una situación temporal (no un hábito) → present continuous: <b>${cont}</b>.`
      : `<i>${n.replace(/[,!]/, "")}</i> → algo que está pasando ahora: <b>${cont}</b>.`, temp ? "temporary" : "now");
  },

  "past-cont"() {
    const INT = [["the phone", "ring", "rang", ""], ["it", "start", "started", " to rain"], ["the lights", "go", "went", " out"],
      ["somebody", "knock", "knocked", " at the door"], ["the fire alarm", "go", "went", " off"], ["my boss", "come", "came", " in"]];
    const v = pick(VERBS.filter((x) => x[6])), sub = pick(SUBJECTS), it = pick(INT);
    const [base, , ing, past, , comp] = v;
    const key = `${idx(VERBS, v)}:${idx(SUBJECTS, sub)}:${idx(INT, it)}`;
    const cont = `${bePast(sub)} ${ing}`;
    if (Math.random() < 0.65) {
      return gapOrMc("past-cont", key + ":bg", `${cap(sub.s)} ___ (${base}) ${comp} when ${it[0]} ${it[2]}${it[3]}.`, [cont], [
        [past, `Past simple contaría una acción completa (primero pasó una cosa y después la otra). Acá ${pron(sub)} estaba en medio de la acción cuando la interrumpieron.`],
        [`${bePast(sub) === "was" ? "were" : "was"} ${ing}`, `Concordancia: con ${sub.s} va <b>${bePast(sub)}</b>.`],
        [`${beNow(sub)} ${ing}`, "Es presente continuo; la historia está en pasado."],
      ], `Acción larga en progreso, interrumpida por otra corta → past continuous: <b>${cont}</b>.`, "interrupted");
    }
    return gapOrMc("past-cont", key + ":int", `${cap(sub.s)} ${cont} ${comp} when ${it[0]} ___ (${it[1]})${it[3]}.`, [it[2]], [
      [`was ${ingForm(it[1])}`, "La interrupción es una acción corta y completa: va en past simple."],
      [it[1], "Es la forma base; hace falta pasado."],
      [`${it[1]}ed`, `<i>${it[1]}</i> es irregular: <b>${it[2]}</b>.`],
    ], `La acción corta que interrumpe va en past simple: <b>${it[2]}</b>.`, "interrupted");
  },

  comparatives() {
    // [adj, comparativo, superlativo, A, B, sustantivo, lugar]
    const ADJ = [
      ["cheap", "cheaper", "cheapest", "This phone", "that one", "hotel", "in the city"],
      ["big", "bigger", "biggest", "My room", "yours", "house", "in our street"],
      ["easy", "easier", "easiest", "The second exercise", "the first one", "question", "in the test"],
      ["expensive", "more expensive", "most expensive", "This restaurant", "the one next door", "watch", "in the shop"],
      ["good", "better", "best", "Her new song", "her old ones", "pizza", "in Buenos Aires"],
      ["bad", "worse", "worst", "The traffic today", "yesterday", "film", "of the year"],
      ["hot", "hotter", "hottest", "January", "June here", "day", "of the summer"],
      ["interesting", "more interesting", "most interesting", "This book", "the film", "museum", "in the country"],
      ["happy", "happier", "happiest", "Lucas", "his brother", "day", "of my life"],
      ["fast", "faster", "fastest", "The train", "the bus", "car", "in the race"],
      ["comfortable", "more comfortable", "most comfortable", "This sofa", "that chair", "bed", "in the house"],
      ["thin", "thinner", "thinnest", "This laptop", "my old one", "phone", "on the market"],
      ["far", "further", "furthest", "Mendoza", "Rosario", "city", "on our trip"],
      ["busy", "busier", "busiest", "The city centre", "the suburbs", "street", "in town"],
      ["dangerous", "more dangerous", "most dangerous", "Motorbikes", "cars", "animal", "in the jungle"],
      ["young", "younger", "youngest", "My cousin", "me", "country", "in South America"],
      ["tall", "taller", "tallest", "Your brother", "you", "building", "in the world"],
      ["modern", "more modern", "most modern", "The new airport", "the old one", "stadium", "in the region"],
      ["wet", "wetter", "wettest", "April", "March", "month", "of the year"],
      ["beautiful", "more beautiful", "most beautiful", "The north coast", "the south", "beach", "I've ever seen"],
    ];
    const a = pick(ADJ), i = idx(ADJ, a);
    const [adj, comp, sup, A, B, noun, place] = a;
    const long = comp.startsWith("more");
    const irr = ["good", "bad", "far"].includes(adj);
    if (Math.random() < 0.5) {
      const verb = A === "Motorbikes" ? "are" : "is";
      const wrongs = long
        ? [[adj + "er", `<i>${adj}</i> es largo (2+ sílabas): no lleva -er, va <b>${comp}</b>.`], ["most " + adj, "Most es superlativo; para comparar dos cosas con than va more."]]
        : [["more " + adj, irr ? `<i>${adj}</i> es irregular: <b>${comp}</b>.` : `<i>${adj}</i> es corto: se agrega -er (<b>${comp}</b>), no more.`],
           [sup, `<i>${sup}</i> es superlativo (uno entre muchos). Con than se comparan dos cosas → <b>${comp}</b>.`],
           [adj + "est", "Superlativo mal formado; además con than va el comparativo."]];
      return gapOrMc("comparatives", `${i}:c`, `${A} ${verb} ___ (${adj}) than ${B}.`, [comp, ...(adj === "far" ? ["farther"] : [])], wrongs,
        `Comparamos dos cosas con <i>than</i> → comparativo de <i>${adj}</i>: <b>${comp}</b>.`, irr ? "irregular" : long ? "long" : "short");
    }
    const wrongs = long
      ? [[comp, `<i>${comp}</i> es comparativo (entre dos). Con <i>the ... ${place}</i> va superlativo.`], [adj + "est", `<i>${adj}</i> es largo: va <b>most ${adj}</b>.`]]
      : [["most " + adj, irr ? `<i>${adj}</i> es irregular: <b>${sup}</b>.` : `<i>${adj}</i> es corto: va -est (<b>${sup}</b>).`],
         [comp, `<i>${comp}</i> es comparativo (entre dos). Para destacar uno del grupo va el superlativo.`]];
    return gapOrMc("comparatives", `${i}:s`, `It's the ___ (${adj}) ${noun} ${place}.`, [sup, "the " + sup], wrongs,
      `<i>the ... ${place}</i> destaca uno entre todos → superlativo: <b>the ${sup}</b>.`, irr ? "irregular" : "superlative");
  },

  quantifiers() {
    const COUNT = ["eggs", "apples", "chairs", "friends", "books", "tourists", "photos", "students", "mistakes", "tomatoes"];
    const UNC = ["milk", "money", "time", "bread", "cheese", "water", "traffic", "homework", "information", "furniture", "rice", "luggage"];
    const countable = Math.random() < 0.5;
    const n = countable ? pick(COUNT) : pick(UNC);
    const label = countable ? "contable (plural)" : "incontable";
    const mm = { many: `<i>${n}</i> es incontable: many va con contables en plural.`, much: `<i>${n}</i> es contable: much va con incontables.` };
    const mode = pick(["how", "neg", "few", "any"]);
    if (mode === "how" || mode === "neg") {
      const ans = countable ? "many" : "much";
      const opts = mode === "how" ? ["many", "much", "a few"] : ["many", "much"];
      const why = { ...mm, "a few": "How a few no existe: para preguntar cantidad va How many / How much." };
      delete why[ans];
      return mk("quantifiers", `${n}:${mode}`, "mc", {
        prompt: mode === "how" ? `How ___ ${n} ${countable ? "are" : "is"} there?` : `We don't have ___ ${n}.`,
        options: opts, answers: [ans], concept: "muchmany", wrongWhy: why,
        explanation: `<i>${n}</i> es ${label} → <b>${ans}</b>.` });
    }
    if (mode === "few") {
      const ans = countable ? "a few" : "a little";
      return mk("quantifiers", `${n}:few`, "mc", { prompt: `There's no problem, we still have ___ ${n}.`,
        options: ["a few", "a little"], answers: [ans], concept: "few",
        wrongWhy: countable ? { "a little": `<i>${n}</i> es contable: a little va con incontables.` } : { "a few": `<i>${n}</i> es incontable: a few va con contables.` },
        explanation: `<i>${n}</i> es ${label} → <b>${ans}</b>.` });
    }
    const q = Math.random() < 0.5;
    const prompt = q ? `${countable ? "Are there" : "Is there"} ___ ${n} left?` : `There ${countable ? "aren't" : "isn't"} ___ ${n} left.`;
    return mk("quantifiers", `${n}:any${q ? "q" : "n"}`, "mc", { prompt, options: ["some", "any", "a"], answers: ["any"], concept: "someany",
      wrongWhy: {
        some: q ? "En preguntas normales va any. Some solo en ofrecimientos o pedidos (Would you like some...?)." : "Some es para afirmativas; en negativas va any.",
        a: countable ? "A va con un sustantivo singular, no con plurales." : `<i>${n}</i> es incontable: nunca lleva a/an.` },
      explanation: `En ${q ? "preguntas" : "negativas"} se usa <b>any</b>.` });
  },

  "present-perfect"() {
    const e = pick(EXPERIENCES), sub = pick(SUBJECTS), i = idx(EXPERIENCES, e);
    const [base, pp, comp, past] = e;
    const regular = pp.endsWith("ed");
    const mode = pick(["ever", "never", "everQ"]);
    if (mode === "ever") {
      return gapOrMc("present-perfect", `${i}:ever`, `Have you ever ___ (${base}) ${comp}?`, [pp], [
        [past, `<i>${past}</i> es past simple. Después de have va el participio: <b>${pp}</b>.`],
        [base, "Es la forma base; después de have va el participio."],
        [base === "be" ? "being" : base + (base.endsWith("e") ? "d" : "ed"), regular ? `Ortografía: <b>${pp}</b>.` : `<i>${base}</i> es irregular: el participio es <b>${pp}</b>.`],
      ], `Experiencia de vida con <i>ever</i> → have + participio. Participio de <i>${base}</i>: <b>${pp}</b>.`, "experience", 0.5);
    }
    if (mode === "never") {
      const ans = `${have(sub)} never ${pp}`;
      return gapOrMc("present-perfect", `${i}:${idx(SUBJECTS, sub)}:never`, `${cap(sub.s)} ___ (never / ${base}) ${comp}.`, [ans], [
        [`${have(sub) === "has" ? "have" : "has"} never ${pp}`, `Concordancia: con ${sub.s} va <b>${have(sub)}</b>.`],
        [`never ${past}`, "Sin have sería past simple. Para experiencias de toda la vida (never) va present perfect."],
        [`${have(sub)} never ${past}`, `<i>${past}</i> es pasado; después de ${have(sub)} va el participio <b>${pp}</b>.`],
      ], `Experiencia de vida (nunca hasta ahora) → <b>${ans}</b>: ${have(sub)} con ${sub.s} + participio.`, "experience");
    }
    const ans = `${have(sub)} ${sub.s} ever ${pp}`;
    return gapOrMc("present-perfect", `${i}:${idx(SUBJECTS, sub)}:q`, `___ (${sub.s} / ever / ${base}) ${comp}?`, [ans], [
      [`did ${sub.s} ever ${base}`, "Para preguntar por experiencias de vida con ever se usa present perfect."],
      [`${have(sub)} ${sub.s} ever ${past}`, `Después de ${have(sub)} va el participio (<b>${pp}</b>), no el pasado.`],
      [`${have(sub) === "has" ? "have" : "has"} ${sub.s} ever ${pp}`, `Concordancia: con ${sub.s} va <b>${have(sub)}</b>.`],
    ], `Pregunta de experiencia: <b>${cap(ans)}?</b>`, "experience");
  },

  "pp-vs-past"() {
    const EXP = EXPERIENCES.filter((x) => x[0] !== "be");
    const PAST_T = ["last year", "in 2019", "two weeks ago", "as a child", "last summer", "on my last holiday"];
    const PP_T = ["several times", "twice", "many times", "before", "three times this year"];
    const e = pick(EXP), sub = pick(SUBJECTS), i = idx(EXP, e);
    const [base, pp, comp, past] = e;
    if (Math.random() < 0.5) {
      const t = pick(PAST_T);
      return gapOrMc("pp-vs-past", `${i}:${idx(SUBJECTS, sub)}:p${idx(PAST_T, t)}`, `${cap(sub.s)} ___ (${base}) ${comp} ${t}.`, [past], [
        [`${have(sub)} ${pp}`, `<i>${t}</i> es un momento terminado: no se combina con present perfect.`],
        [base, "Forma base: hace falta pasado."],
      ], `<i>${t}</i> marca un momento terminado → past simple: <b>${past}</b>.`, "finished");
    }
    const t = pick(PP_T);
    const ans = `${have(sub)} ${pp}`;
    return gapOrMc("pp-vs-past", `${i}:${idx(SUBJECTS, sub)}:pp${idx(PP_T, t)}`, `${cap(sub.s)} ___ (${base}) ${comp} ${t}.`, [ans], [
      [past, `Past simple necesitaría un momento concreto (yesterday, in 2019). <i>${t}</i> habla de experiencia, sin fecha.`],
      [`${have(sub) === "has" ? "have" : "has"} ${pp}`, `Concordancia: con ${sub.s} va <b>${have(sub)}</b>.`],
    ], `<i>${t}</i> = experiencia sin momento concreto → present perfect: <b>${ans}</b>.`, "experience");
  },

  "for-since"() {
    const FRAMES = ["I've lived here", "She has worked at this company", "We've known each other", "They haven't spoken",
      "He has been ill", "I've had this car", "It has been raining", "My parents have been married", "I haven't eaten anything"];
    const FOR = ["two hours", "three years", "a long time", "ages", "a week", "ten minutes", "six months", "a couple of days"];
    const SINCE = ["2019", "Monday", "last summer", "I was a child", "9 o'clock", "Christmas", "this morning", "we moved"];
    const f = pick(FRAMES), useFor = Math.random() < 0.5;
    const t = useFor ? pick(FOR) : pick(SINCE);
    const ans = useFor ? "for" : "since";
    return mk("for-since", `${idx(FRAMES, f)}:${ans}:${t}`, Math.random() < 0.5 ? "mc" : "gap", {
      prompt: `${f} ___ ${t}.`, options: ["for", "since"], answers: [ans], concept: ans,
      wrongWhy: useFor ? { since: `<i>${t}</i> es una duración, no un punto de inicio. Since va con el momento en que empezó (since 2019).` }
        : { for: `<i>${t}</i> es el momento en que empezó, no una duración. For va con cantidades de tiempo (for two years).` },
      explanation: useFor ? `<i>${t}</i> es una duración → <b>for</b>.` : `<i>${t}</i> es el punto de inicio → <b>since</b>.` });
  },

  "first-cond"() { return condGen("first-cond"); },
  "second-cond"() { return condGen("second-cond"); },

  "going-to-will"() {
    // [contexto, sujeto, verbo, resto, caso]
    const S = [
      ["Look at those black clouds!", "it", "rain", "", "evidence"],
      ["Watch out! That glass is on the edge of the table.", "it", "fall", "", "evidence"],
      ["It's 8:55, the film starts at 9 and we're still at home.", "we", "be", "late", "evidence"],
      ["She's running towards the bus, but it's already leaving.", "she", "miss", "it", "evidence"],
      ["He's driving much too fast on an icy road.", "he", "have", "an accident", "evidence"],
      ["We've already booked the hotel.", "we", "spend", "a week in Bariloche", "plan"],
      ["I've made up my mind.", "I", "look", "for a new job", "plan"],
      ["She bought a guitar last week.", "she", "learn", "to play it", "plan"],
      ["They've saved enough money.", "they", "buy", "a new car", "plan"],
      ["My brother has sent his CV to five companies.", "he", "change", "jobs", "plan"],
      ["A: The phone's ringing. B: Don't worry,", "I", "answer", "it", "decision"],
      ["A: There's no milk. B: OK,", "I", "get", "some from the shop", "decision"],
      ["A: I can't open this jar. B: Give it to me.", "I", "help", "you", "decision"],
      ["A: What would you like to drink? B: Hmm...", "I", "have", "an orange juice", "decision"],
      ["A: It's really hot in here. B: Wait,", "I", "open", "the window", "decision"],
      ["Thanks for the money. I promise", "I", "pay", "you back tomorrow", "promise"],
      ["Don't worry about your plants.", "I", "water", "them every day", "promise"],
      ["Have a good trip!", "I", "miss", "you", "promise"],
      ["I think", "she", "love", "the present", "opinion"],
      ["I'm sure", "you", "pass", "the exam", "opinion"],
      ["Maybe", "it", "be", "sunny tomorrow", "opinion"],
      ["In 50 years, I think", "people", "live", "longer", "opinion"],
    ];
    const s = pick(S), i = idx(S, s);
    const [ctx, subj, verb, rest, cat] = s;
    const sub = subjOf(subj) || { s: subj, p: subj === "it" ? "3" : "pl" };
    const going = cat === "evidence" || cat === "plan";
    const goingAns = `${beNow(sub)} going to ${verb}`;
    const willAns = `will ${verb}`;
    const subjText = /[.!?]$/.test(ctx) ? cap(subj) : subj;
    const prompt = `${ctx} ${subjText} ___ (${verb})${rest ? " " + rest : ""}.`;
    const why = {
      evidence: "Hay una evidencia en el presente que muestra lo que va a pasar → <b>going to</b>.",
      plan: "Es un plan decidido antes de hablar (ya hizo algo al respecto) → <b>going to</b>.",
      decision: "Es una decisión tomada en el momento, como reacción → <b>will</b>.",
      promise: "Es una promesa u ofrecimiento → <b>will</b>.",
      opinion: "Es una predicción basada en tu opinión, sin evidencia → <b>will</b>.",
    }[cat];
    const wrongs = going
      ? [[willAns, cat === "evidence" ? "Will es para opiniones sin evidencia; acá hay algo visible que lo muestra." : "Will es para decisiones del momento; esto ya estaba decidido antes."],
         [`going to ${verb}`, `Falta el verbo be: <b>${goingAns}</b>.`],
         [`will to ${verb}`, "Will va sin to, y además acá corresponde going to."]]
      : [[goingAns, cat === "decision" ? "Going to es para planes previos; acá decidís en el momento." : cat === "promise" ? "Las promesas y ofrecimientos se hacen con will." : "Going to necesita evidencia visible; acá es una opinión."],
         [`will to ${verb}`, "Will va sin to."],
         [is3(sub) ? verb + "s" : verb, "Presente simple: no expresa futuro."]];
    return gapOrMc("going-to-will", `${i}`, prompt, going ? [goingAns] : [willAns], wrongs, why, cat, 0.5);
  },

  modals() {
    // [oración, respuesta, caso, opciones que también serían válidas (no se usan como distractores)]
    const S = [
      ["You ___ use your phone during the exam. It's against the rules.", "mustn't", "prohibition", ["can't"]],
      ["Passengers ___ smoke on the plane.", "mustn't", "prohibition", ["can't"]],
      ["You ___ tell anyone. It's a secret!", "mustn't", "prohibition", ["can't"]],
      ["Children ___ swim here without an adult.", "mustn't", "prohibition", ["can't"]],
      ["It's a free concert, so we ___ buy tickets.", "don't have to", "prohibition"],
      ["You ___ wear a suit. The party is informal.", "don't have to", "prohibition"],
      ["I ___ get up early tomorrow; it's a holiday.", "don't have to", "prohibition"],
      ["You ___ cook tonight. I've ordered pizza.", "don't have to", "prohibition"],
      ["I ___ remember to call my mum. It's her birthday.", "must", "obligation", ["should"]],
      ["You ___ show your passport at the border.", "must", "obligation", ["should"]],
      ["Drivers ___ stop at a red light.", "must", "obligation", ["should"]],
      ["You look tired. You ___ go to bed early.", "should", "advice", ["must", "might"]],
      ["That tooth looks bad. You ___ see a dentist.", "should", "advice", ["must"]],
      ["It's a great film. You ___ watch it.", "should", "advice", ["must"]],
      ["You ___ drink more water when it's hot.", "should", "advice", ["must"]],
      ["Take a jacket. It ___ get cold later.", "might", "possibility"],
      ["I'm not sure, but I ___ go to the party.", "might", "possibility"],
      ["Don't throw that away. We ___ need it.", "might", "possibility"],
      ["Ask Carla; she ___ know the answer.", "might", "possibility", ["must", "should"]],
      ["That ___ be Laura's car. She sold it last year.", "can't", "deduction"],
      ["He ___ be hungry. He's just eaten a huge pizza.", "can't", "deduction"],
      ["You ___ be serious! That's crazy.", "can't", "deduction"],
      ["She's been travelling for 20 hours. She ___ be exhausted.", "must", "deduction", ["might"]],
      ["All the lights are on. They ___ be at home.", "must", "deduction", ["might"]],
    ];
    const MEANING = {
      must: "<b>must</b> = obligación o deducción segura (estoy seguro de que sí).",
      "mustn't": "<b>mustn't</b> = está prohibido.",
      "don't have to": "<b>don't have to</b> = no es necesario (podés elegir).",
      should: "<b>should</b> = consejo.",
      might: "<b>might</b> = posibilidad (quizá).",
      "can't": "<b>can't</b> = imposibilidad, o deducción de que algo no es cierto.",
    };
    const s = pick(S), i = idx(S, s);
    const [prompt, ans, concept, alsoOk = []] = s;
    const pool = Object.keys(MEANING).filter((m) => m !== ans && !alsoOk.includes(m));
    const distractors = [];
    while (distractors.length < 3) { const d = pick(pool); if (!distractors.includes(d)) distractors.push(d); }
    const wrongWhy = Object.fromEntries(distractors.map((d) => [d, `${MEANING[d]} No encaja con el sentido de la oración.`]));
    return mk("modals", `${i}`, "mc", { prompt, options: [ans, ...distractors], answers: [ans], concept, wrongWhy,
      explanation: MEANING[ans] });
  },

  "used-to"() {
    const HAB = [["play", "football in the street"], ["watch", "cartoons every morning"], ["live", "in a small town"],
      ["have", "long hair"], ["go", "to the beach every summer"], ["eat", "a lot of sweets"], ["walk", "to school"],
      ["collect", "stamps"], ["be", "very shy"], ["get up", "at six"], ["read", "comics"], ["like", "vegetables"],
      ["spend", "hours playing video games"], ["visit", "relatives on Sundays"]];
    const STATES = ["live", "have", "be", "like"];
    const h = pick(HAB), sub = pick(SUBJECTS.filter((s) => s.s !== "my parents" && s.s !== "our neighbours")), i = idx(HAB, h);
    const [v, comp] = h;
    const p = pron(sub);
    const when = `When ${sub.s} ${bePast(sub)} young`;
    const mode = pick(["aff", "aff", "neg", "q"]);
    if (mode === "aff") {
      return gapOrMc("used-to", `${i}:${idx(SUBJECTS, sub)}:a`, `${when}, ${p} ___ (${v}) ${comp}.`, [`used to ${v}`], [
        [`use to ${v}`, "En afirmativa va <b>used</b> (con d)."],
        [`was used to ${v}`, "Be used to significa 'estar acostumbrado' y va seguido de -ing. Para hábitos pasados va used to."],
        [`used to ${ingForm(v)}`, "Después de used to va el verbo en base."],
      ], `${STATES.includes(v) ? "Estado" : "Hábito"} del pasado que ya no es así → <b>used to + ${v}</b>.`, STATES.includes(v) ? "state" : "habit");
    }
    if (mode === "neg") {
      return gapOrMc("used-to", `${i}:${idx(SUBJECTS, sub)}:n`, `${when}, ${p} ___ (not / ${v}) ${comp}.`,
        [`didn't use to ${v}`, `did not use to ${v}`, `never used to ${v}`], [
          [`didn't used to ${v}`, "Con did la d desaparece: <b>didn't use to</b>."],
          [`wasn't use to ${v}`, "La negativa se forma con didn't, no con wasn't."],
        ], `Negativa: <b>didn't use to</b> (sin d después de did).`, "negq");
    }
    return gapOrMc("used-to", `${i}:${idx(SUBJECTS, sub)}:q`, `___ (${sub.s} / use to / ${v}) ${comp} when ${p} ${bePast(sub)} young?`,
      [`did ${sub.s} use to ${v}`], [
        [`did ${sub.s} used to ${v}`, "Con did la d desaparece: <b>use to</b>."],
        [`${bePast(sub)} ${sub.s} used to ${v}`, "La pregunta se forma con did, no con was/were."],
      ], `Pregunta: <b>Did + sujeto + use to + verbo</b>.`, "negq");
  },

  relatives() {
    const PEOPLE = [["The man", "lives next door is a pilot"], ["The woman", "helped me yesterday was very kind"],
      ["The girl", "won the race is only twelve"], ["The doctor", "saw me was very young"], ["The students", "passed the exam got a certificate"],
      ["The waiter", "served us was from Italy"], ["People", "work at night often feel tired"]];
    const THINGS = [["The phone", "I bought last month has stopped working"], ["The book", "you recommended was fantastic"],
      ["The jacket", "my brother gave me is too small"], ["The film", "we saw on Friday was boring"],
      ["The bus", "goes to the airport leaves every hour"], ["The cake", "you made was delicious"]];
    const PLACES = [["That's the hotel", "we stayed in Rome"], ["This is the town", "I was born"], ["That's the restaurant", "we had dinner on Friday"],
      ["This is the park", "we played as kids"], ["That's the café", "I met my best friend"], ["This is the school", "my mother teaches"]];
    const WHOSE = [["That's the man", "car was stolen"], ["I know a girl", "father is a pilot"], ["She's the writer", "books are very popular"],
      ["He's the neighbour", "dog barks all night"], ["That's the student", "phone rang in class"]];
    const WHY = { who: "Who es para personas.", which: "Which es para cosas y animales.", where: "Where es para lugares donde pasa algo.", whose: "Whose expresa posesión (cuyo/a)." };
    const opts = ["who", "which", "where", "whose"];
    const cat = pick(["p", "t", "pl", "w"]);
    const [list, ans, what] = { p: [PEOPLE, "who", "una persona"], t: [THINGS, "which", "una cosa"], pl: [PLACES, "where", "un lugar donde pasa algo"], w: [WHOSE, "whose", "alguien de quien se dice qué tiene (posesión)"] }[cat];
    const e = pick(list);
    const answers = cat === "p" || cat === "t" ? [ans, "that"] : [ans];
    const wrongWhy = Object.fromEntries(opts.filter((o) => o !== ans).map((o) => [o, WHY[o]]));
    return mk("relatives", `${cat}:${idx(list, e)}`, Math.random() < 0.6 ? "mc" : "gap", {
      prompt: `${e[0]} ___ ${e[1]}.`, options: opts, answers, concept: ans, wrongWhy,
      explanation: `<i>${e[0].replace(/^(That's|This is|I know|She's|He's) /, "")}</i> es ${what} → <b>${ans}</b>${answers.length > 1 ? " (o <i>that</i>)" : ""}.` });
  },

  passive() {
    // [sujeto, plural, base, participio, resto, tiempo]
    const P = [["Coffee", 0, "grow", "grown", "in Colombia", "pres"], ["These phones", 1, "make", "made", "in China", "pres"],
      ["The bridge", 0, "build", "built", "in 1990", "past"], ["Hamlet", 0, "write", "written", "by Shakespeare", "past"],
      ["The windows", 1, "clean", "cleaned", "every Friday", "pres"], ["Spanish", 0, "speak", "spoken", "in many countries", "pres"],
      ["The thieves", 1, "arrest", "arrested", "last night", "past"], ["The invitations", 1, "send", "sent", "yesterday", "past"],
      ["Cheese", 0, "make", "made", "from milk", "pres"], ["The telephone", 0, "invent", "invented", "by Bell in 1876", "past"],
      ["Our house", 0, "paint", "painted", "last summer", "past"], ["Millions of emails", 1, "send", "sent", "every day", "pres"],
      ["The meeting", 0, "cancel", "cancelled", "yesterday", "past"], ["Breakfast", 0, "serve", "served", "from 7 to 10", "pres"],
      ["The pyramids", 1, "build", "built", "thousands of years ago", "past"], ["The museum", 0, "visit", "visited", "by thousands of tourists every year", "pres"],
      ["My car", 0, "steal", "stolen", "last week", "past"], ["These cars", 1, "sell", "sold", "all over the world", "pres"],
      ["The match", 0, "watch", "watched", "by millions of people last night", "past"], ["Rice", 0, "eat", "eaten", "every day in Asia", "pres"]];
    const p = pick(P), i = idx(P, p);
    const [subj, pl, base, pp, rest, tense] = p;
    const be = tense === "pres" ? (pl ? "are" : "is") : (pl ? "were" : "was");
    const wrongBe = tense === "pres" ? (pl ? "is" : "are") : (pl ? "was" : "were");
    const otherTense = tense === "pres" ? (pl ? "were" : "was") : (pl ? "are" : "is");
    return gapOrMc("passive", `${i}`, `${subj} ___ (${base}) ${rest}.`, [`${be} ${pp}`], [
      [`${wrongBe} ${pp}`, `Concordancia: <i>${subj}</i> es ${pl ? "plural" : "singular"} → <b>${be}</b>.`],
      [`${otherTense} ${pp}`, tense === "pres" ? `Es pasado, pero <i>${rest}</i> describe algo general o habitual → presente.` : `Es presente, pero <i>${rest}</i> indica pasado.`],
      [`${be} ${base}`, `Después de ${be} va el participio: <b>${pp}</b>.`],
    ], `<i>${subj}</i> no hace la acción, la recibe → pasiva ${tense === "pres" ? "presente" : "pasado"}: <b>${be} + ${pp}</b>.`,
    tense === "pres" ? "present" : "past", 0.5);
  },

  "gerund-inf"() {
    const ING = ["enjoyed", "finished", "avoided", "kept", "suggested", "gave up", "didn't mind", "practised"];
    const TO = ["decided", "wanted", "hoped", "planned", "needed", "promised", "refused", "agreed", "learned"];
    const ACT = [["swim", "swimming", "in the lake"], ["cook", "cooking", "dinner"], ["learn", "learning", "Japanese"],
      ["paint", "painting", "the kitchen"], ["travel", "travelling", "abroad"], ["play", "playing", "chess online"],
      ["study", "studying", "at night"], ["drive", "driving", "at night"], ["read", "reading", "the whole report"],
      ["clean", "cleaning", "the garage"], ["sing", "singing", "in English"], ["run", "running", "in the mornings"]];
    const useIng = Math.random() < 0.5;
    const m = useIng ? pick(ING) : pick(TO), a = pick(ACT), sub = pick(SUBJECTS);
    const ans = useIng ? a[1] : `to ${a[0]}`;
    return gapOrMc("gerund-inf", `${m}:${idx(ACT, a)}:${idx(SUBJECTS, sub)}`, `${cap(sub.s)} ${m} ___ (${a[0]}) ${a[2]}.`, [ans], [
      [useIng ? `to ${a[0]}` : a[1], useIng ? `<i>${m}</i> va con -ing, no con to.` : `<i>${m}</i> va con to + verbo, no con -ing.`],
      [a[0], `Después de <i>${m}</i> no va la forma base sola: ${useIng ? "-ing" : "to + verbo"}.`],
    ], useIng ? `<i>${m}</i> es de los verbos que van seguidos de <b>-ing</b>: <b>${ans}</b>.` : `<i>${m}</i> es de los verbos que van seguidos de <b>to + verbo</b>: <b>${ans}</b>.`,
    useIng ? "ing" : "to", 0.5);
  },

  reported() {
    const SPEAKERS = [["Ana", "she"], ["Tom", "he"], ["My boss", "he"], ["Lucía", "she"], ["Our teacher", "she"]];
    const sp = pick(SPEAKERS);
    const [who, p] = sp;
    const v = pick(VERBS.filter((x) => x[6]));
    const [base, s3, ing, past, pp, comp] = v;
    const key = `${idx(VERBS, v)}:${idx(SPEAKERS, sp)}`;
    const mode = pick(["ps", "pc", "will", "can", "past", "pp", "saytell"]);
    if (mode === "saytell") {
      const withMe = Math.random() < 0.5;
      return mk("reported", `${idx(SPEAKERS, sp)}:st${withMe ? "m" : ""}`, "mc", {
        prompt: `"I'm busy." → ${who} ___ ${withMe ? "me " : ""}${p} was busy.`, options: ["said", "told"], answers: [withMe ? "told" : "said"],
        concept: "saytell", wrongWhy: withMe ? { said: "Say no lleva a la persona directamente (said me es incorrecto)." } : { told: "Tell necesita a la persona (told me, told us)." },
        explanation: withMe ? "Con la persona después (me) → <b>told</b>." : "Sin persona después → <b>said</b>." });
    }
    const C = {
      ps: [`I ${base} ${comp}.`, past, [[s3, "Con <i>said</i>, el presente retrocede a pasado."], [`had ${pp}`, "Past perfect es el retroceso de un pasado; la frase original está en presente."]], "present simple → past simple"],
      pc: [`I'm ${ing} ${comp}.`, `was ${ing}`, [[`is ${ing}`, "Con <i>said</i>, am/is retrocede a was."], [`were ${ing}`, `Concordancia: con ${p} va was.`]], "am + -ing → was + -ing"],
      will: [`I'll ${base} ${comp}.`, `would ${base}`, [[`will ${base}`, "Con <i>said</i>, will retrocede a would."], [`would ${past}`, "Después de would va la forma base."]], "will → would"],
      can: [`I can ${base} ${comp}.`, `could ${base}`, [[`can ${base}`, "Con <i>said</i>, can retrocede a could."], [`could ${past}`, "Después de could va la forma base."]], "can → could"],
      past: [`I ${past} ${comp}.`, `had ${pp}`, [[`has ${pp}`, "Present perfect no es un tiempo retrocedido: el pasado pasa a past perfect (had + participio)."], [past === pp ? base : `had ${past}`, past === pp ? "Forma base: no corresponde." : `Después de had va el participio <b>${pp}</b>.`]], "past simple → past perfect"],
      pp: [`I've ${pp} ${comp}.`, `had ${pp}`, [[`has ${pp}`, "Con <i>said</i>, has/have retrocede a had."], [`have ${pp}`, "Con <i>said</i>, has/have retrocede a had."]], "present perfect → past perfect"],
    };
    const [quote, ans, wrongs, rule] = C[mode];
    return gapOrMc("reported", `${key}:${mode}`, `"${quote}" → ${who} said ${p} ___ ${comp}.`, [ans], wrongs,
      `Al reportar con <i>said</i> el tiempo verbal retrocede (${rule}): <b>${ans}</b>.`, "backshift", 0.5);
  },
};

// Experiencias compartidas por present perfect y pp-vs-past: [base, participio, complemento, pasado]
const EXPERIENCES = [
  ["be", "been", "to Japan", "was"], ["eat", "eaten", "sushi", "ate"], ["see", "seen", "a whale", "saw"],
  ["ride", "ridden", "a horse", "rode"], ["drive", "driven", "a truck", "drove"], ["climb", "climbed", "a mountain", "climbed"],
  ["win", "won", "a competition", "won"], ["meet", "met", "a famous person", "met"], ["fly", "flown", "in a helicopter", "flew"],
  ["write", "written", "a poem", "wrote"], ["break", "broken", "a bone", "broke"], ["sing", "sung", "in public", "sang"],
  ["swim", "swum", "in the ocean", "swam"], ["run", "run", "a marathon", "ran"], ["try", "tried", "skydiving", "tried"],
  ["speak", "spoken", "on the radio", "spoke"], ["take", "taken", "a cooking class", "took"], ["do", "done", "yoga", "did"],
  ["lose", "lost", "a passport", "lost"], ["sleep", "slept", "in a tent", "slept"],
];

// Pares condición/resultado compartidos por 1.º y 2.º condicional.
// [sujeto, pista, presente, pasado, resto | sujeto, verbo, resto]
const COND = [
  ["it", "rain", "rains", "rained", "tomorrow", "we", "stay", "at home"],
  ["you", "study", "study", "studied", "harder", "you", "pass", "the exam"],
  ["I", "have", "have", "had", "more time", "I", "learn", "to play the guitar"],
  ["she", "miss", "misses", "missed", "the bus", "she", "be", "late for work"],
  ["we", "leave", "leave", "left", "now", "we", "arrive", "on time"],
  ["he", "eat", "eats", "ate", "all that cake", "he", "feel", "sick"],
  ["they", "win", "win", "won", "the lottery", "they", "buy", "a big house"],
  ["I", "see", "see", "saw", "Laura", "I", "give", "her your message"],
  ["you", "go", "go", "went", "to bed late", "you", "be", "tired tomorrow"],
  ["the weather", "be", "is", "were", "nice", "we", "have", "a picnic"],
  ["my parents", "visit", "visit", "visited", "us", "we", "cook", "something special"],
  ["you", "not / hurry", "don't hurry", "didn't hurry", "", "you", "miss", "the train"],
  ["I", "find", "find", "found", "a better job", "I", "move", "to the city"],
  ["she", "call", "calls", "called", "me", "I", "tell", "her the news"],
  ["we", "take", "take", "took", "a taxi", "we", "get", "there faster"],
  ["he", "not / wear", "doesn't wear", "didn't wear", "a coat", "he", "get", "cold"],
  ["the shop", "be", "is", "were", "open", "I", "buy", "some milk"],
  ["you", "ask", "ask", "asked", "him nicely", "he", "help", "you"],
];
function condGen(topic) {
  const c = pick(COND), i = idx(COND, c);
  const [cs, hint, pres, past, crest, rs, rv, rrest] = c;
  const first = topic === "first-cond";
  const ifVerb = first ? pres : past;
  const modal = first ? "will" : "would";
  const cr = crest ? " " + crest : "";
  const hintVerb = hint.replace("not / ", "not ");
  if (Math.random() < 0.5) {
    const answers = [ifVerb];
    if (ifVerb.includes("n't")) answers.push(ifVerb.replace("n't", " not"));
    const wrongs = first
      ? [[`will ${hintVerb}`, "Después de if no va will, aunque hable del futuro: va present simple."],
         [past, "Pasado en el if es 2.º condicional (situación imaginaria) y la consecuencia iría con would, no con will."]]
      : [[pres, "Presente en el if es 1.º condicional (situación real) y la consecuencia iría con will. Con would, el if va en pasado."],
         [`would ${hintVerb}`, "Would no va en la parte del if, solo en la consecuencia."]];
    return gapOrMc(topic, `${i}:if`, `If ${cs} ___ (${hint})${cr}, ${rs} ${modal} ${rv} ${rrest}.`, answers, wrongs,
      first ? `1.º condicional (situación real): <b>If + present simple</b>, will + verbo → <b>${ifVerb}</b>.`
        : `2.º condicional (situación imaginaria): <b>If + past simple</b>, would + verbo → <b>${ifVerb}</b>${hint === "be" ? " (were con todas las personas)" : ""}.`,
      first ? "ifpresent" : hint === "be" ? "were" : "imaginary");
  }
  const wrongs = first
    ? [[`would ${rv}`, "Would es para situaciones imaginarias (2.º condicional). Con presente en el if va will."], [rv, "Falta will para expresar la consecuencia futura."]]
    : [[`will ${rv}`, "Con pasado en el if (situación imaginaria), la consecuencia va con would, no will."], [rv, "Falta would."]];
  return gapOrMc(topic, `${i}:res`, `If ${cs} ${ifVerb}${cr}, ${rs} ___ (${rv}) ${rrest}.`, [`${modal} ${rv}`], wrongs,
    first ? `1.º condicional: la consecuencia va con <b>will + verbo</b>: <b>will ${rv}</b>.` : `2.º condicional: la consecuencia va con <b>would + verbo</b>: <b>would ${rv}</b>.`,
    first ? "real" : "would");
}

// Genera hasta n ejercicios distintos para un tema.
function generateFor(topic, n) {
  const gen = GENERATORS[topic];
  if (!gen) return [];
  const out = new Map();
  for (let tries = 0; out.size < n && tries < n * 6; tries++) {
    const ex = gen();
    out.set(ex.id, ex);
  }
  return [...out.values()];
}
