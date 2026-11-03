// Temas, reglas, conceptos y registro de ejercicios escritos a mano.
//
// Cada tema tiene:
//   intro      – en una línea, para qué sirve
//   structure  – filas [forma, ejemplo] de la tabla de estructura
//   signals    – palabras señal
//   mistakes   – errores típicos de hispanohablantes [incorrecto, correcto, por qué]
//   concepts   – casos de uso; cada ejercicio apunta a uno con su `concept`

const LEVELS = [
  { id: "A2", name: "A2", desc: "Base pre-intermedia" },
  { id: "B1", name: "A2+ / B1", desc: "Camino a intermedio" },
];

const TOPICS = [
  {
    id: "pres-simple-cont", level: "A2", name: "Present simple vs continuous",
    intro: "El simple habla de lo que pasa en general; el continuous, de lo que está pasando ahora o por un tiempo.",
    structure: [
      ["Simple +", "I/you/we/they <b>work</b> · he/she/it <b>works</b>"],
      ["Simple −", "I <b>don't work</b> · she <b>doesn't work</b>"],
      ["Simple ?", "<b>Do</b> you work? · <b>Does</b> she work?"],
      ["Continuous +", "I <b>am working</b> · she <b>is working</b> · they <b>are working</b>"],
      ["Continuous −", "I<b>'m not working</b> · she <b>isn't working</b>"],
      ["Continuous ?", "<b>Are</b> you working? · <b>Is</b> she working?"],
    ],
    signals: "Simple: always, usually, often, never, every day, on Mondays, twice a week. Continuous: now, right now, at the moment, Look!, Listen!, today, this week, these days.",
    mistakes: [
      ["She work in a bank.", "She works in a bank.", "Con he/she/it el verbo lleva -s."],
      ["I am liking this song.", "I like this song.", "Like es un verbo de estado."],
      ["Do she speak French?", "Does she speak French?", "Con he/she/it la pregunta va con does."],
      ["Where you live?", "Where do you live?", "En inglés la pregunta necesita el auxiliar do/does."],
    ],
    concepts: {
      habit: { title: "Hábitos y rutinas → simple", text: "Si la acción se repite (todos los días, los lunes, siempre), usamos present simple aunque no esté pasando en este momento.",
        examples: ["I <b>go</b> to the gym three times a week.", "She <b>doesn't eat</b> meat.", "<b>Do</b> you usually <b>walk</b> to work?"] },
      fact: { title: "Verdades generales → simple", text: "Hechos que son siempre ciertos o situaciones permanentes.",
        examples: ["The sun <b>rises</b> in the east.", "My brother <b>lives</b> in Córdoba.", "Cats <b>don't like</b> water."] },
      now: { title: "Ahora mismo → continuous", text: "La acción está ocurriendo en el momento en que hablamos. Señales: now, at the moment, Look!, Listen!",
        examples: ["Look! It<b>'s snowing</b>.", "I can't talk, I<b>'m driving</b>.", "Listen! Someone <b>is playing</b> the piano."] },
      temporary: { title: "Situaciones temporales → continuous", text: "No está pasando justo ahora, pero es algo transitorio, de este período (this week, these days, this month). Compará: <i>Pablo travels by train</i> (siempre) vs <i>This week Pablo is travelling by train</i> (solo esta semana, por algo puntual).",
        examples: ["This week I<b>'m working</b> from home.", "She<b>'s staying</b> with her aunt until she finds a flat.", "These days we<b>'re eating</b> less meat."] },
      state: { title: "Verbos de estado → simple", text: "Verbos que describen estados, no acciones: like, love, hate, want, need, know, understand, believe, remember, have (poseer), belong, seem. No se usan en continuous aunque hablemos de ahora.",
        examples: ["I <b>know</b> the answer. (no: I'm knowing)", "She <b>has</b> two cats. (no: is having)", "Do you <b>understand</b> me now?"] },
      form: { title: "Forma: do/does y la -s", text: "En simple, he/she/it lleva -s (o -es: watches, goes; consonante + y → -ies: studies). Negativas y preguntas usan do/does + verbo sin -s.",
        examples: ["He <b>watches</b> TV. → He <b>doesn't watch</b> TV.", "<b>Does</b> it <b>cost</b> much?", "My sister <b>studies</b> law."] },
    },
  },
  {
    id: "past-simple", level: "A2", name: "Past simple",
    intro: "Acciones terminadas en un momento concreto del pasado.",
    structure: [
      ["Afirmativa", "I <b>worked</b> · she <b>went</b> (igual para todas las personas)"],
      ["Negativa", "I <b>didn't work</b> · she <b>didn't go</b>"],
      ["Pregunta", "<b>Did</b> you <b>work</b>? · Where <b>did</b> she <b>go</b>?"],
      ["Be", "I/he/she <b>was</b> · you/we/they <b>were</b> · wasn't / weren't"],
    ],
    signals: "yesterday, last night/week/year, ago, in 2015, when I was a child, on Saturday.",
    mistakes: [
      ["Did you went?", "Did you go?", "Después de did va el verbo en base."],
      ["I didn't saw it.", "I didn't see it.", "Didn't + base."],
      ["I buyed a car.", "I bought a car.", "Buy es irregular."],
      ["They was late.", "They were late.", "Plural → were."],
    ],
    concepts: {
      regular: { title: "Verbos regulares: -ed", text: "Se agrega -ed. Ortografía: si termina en -e solo -d (lived); consonante + y → -ied (studied); consonante-vocal-consonante corta se duplica (stopped, planned).",
        examples: ["We <b>watched</b> a film.", "He <b>studied</b> all night.", "The bus <b>stopped</b> suddenly."] },
      irregular: { title: "Verbos irregulares", text: "No siguen la regla -ed y hay que memorizarlos. Los más comunes: go-went, have-had, see-saw, buy-bought, make-made, take-took, get-got, come-came, think-thought, eat-ate.",
        examples: ["I <b>went</b> to Mendoza last year.", "She <b>bought</b> a new phone.", "We <b>had</b> pizza for dinner."] },
      did: { title: "Negativas y preguntas con did", text: "Did ya marca el pasado, así que el verbo principal vuelve a la forma base. Es el error más común: no se pone el pasado dos veces.",
        examples: ["I <b>didn't go</b> out. (no: didn't went)", "<b>Did</b> you <b>see</b> the match?", "What <b>did</b> she <b>say</b>?"] },
      be: { title: "Was / were", text: "Be no usa did: was para I/he/she/it, were para you/we/they. Negativa y pregunta directamente con was/were.",
        examples: ["It <b>was</b> cold.", "<b>Were</b> you at home?", "They <b>weren't</b> happy."] },
      finished: { title: "Momento terminado → past simple", text: "Si se dice cuándo pasó (yesterday, ago, in 2010), va past simple, no present perfect.",
        examples: ["I <b>saw</b> him yesterday. (no: have seen)", "She <b>moved</b> here two years ago.", "We <b>met</b> in 2018."] },
    },
  },
  {
    id: "past-cont", level: "A2", name: "Past continuous",
    intro: "Una acción en progreso en un momento del pasado, muchas veces interrumpida por otra.",
    structure: [
      ["Afirmativa", "I/he/she <b>was working</b> · you/we/they <b>were working</b>"],
      ["Negativa", "I <b>wasn't working</b> · they <b>weren't working</b>"],
      ["Pregunta", "<b>Were</b> you <b>working</b>? · What <b>was</b> she <b>doing</b>?"],
      ["Con interrupción", "I <b>was cooking</b> when the phone <b>rang</b>."],
    ],
    signals: "when, while, at 8 pm yesterday, all morning, at that moment.",
    mistakes: [
      ["They was playing.", "They were playing.", "Plural → were."],
      ["I was knowing her.", "I knew her.", "Know es de estado."],
      ["While I cooked, I burnt my hand.", "While I was cooking, I burnt my hand.", "While + acción larga en continuous."],
    ],
    concepts: {
      progress: { title: "En progreso en un momento del pasado", text: "Describe qué estaba pasando en un momento concreto. No importa cuándo empezó ni terminó.",
        examples: ["At 10 pm I <b>was watching</b> a film.", "What <b>were</b> you <b>doing</b> at midnight?", "It <b>was raining</b> all afternoon."] },
      interrupted: { title: "Acción larga + interrupción", text: "La acción larga (el fondo) va en past continuous; la corta que la interrumpe, en past simple. When suele ir con la corta, while con la larga.",
        examples: ["I <b>was having</b> a shower when the doorbell <b>rang</b>.", "While we <b>were walking</b>, it <b>started</b> to rain.", "She <b>fell</b> while she <b>was skiing</b>."] },
      background: { title: "Describir la escena", text: "Al contar una historia, el past continuous pinta el escenario y el past simple cuenta los hechos.",
        examples: ["The sun <b>was shining</b> and people <b>were sitting</b> outside.", "Everyone <b>was dancing</b> when the lights <b>went</b> out."] },
      form: { title: "Was / were + -ing", text: "Was con I/he/she/it, were con you/we/they. Ortografía del -ing: make → making, run → running, lie → lying.",
        examples: ["They <b>were waiting</b>.", "He <b>wasn't listening</b>.", "<b>Were</b> you <b>running</b>?"] },
      state: { title: "Verbos de estado → past simple", text: "Igual que en presente, know, want, like, need, believe no van en continuous.",
        examples: ["I <b>knew</b> the answer. (no: was knowing)", "She <b>wanted</b> to leave."] },
    },
  },
  {
    id: "comparatives", level: "A2", name: "Comparativos y superlativos",
    intro: "Comparar dos cosas (comparativo) o destacar una entre un grupo (superlativo).",
    structure: [
      ["1 sílaba", "cheap → cheap<b>er</b> → the cheap<b>est</b>"],
      ["Doble consonante", "big → bi<b>gg</b>er → the bi<b>gg</b>est"],
      ["Termina en -y", "easy → eas<b>ier</b> → the eas<b>iest</b>"],
      ["2+ sílabas", "expensive → <b>more</b> expensive → the <b>most</b> expensive"],
      ["Irregulares", "good → better → best · bad → worse → worst · far → further → furthest"],
      ["Igualdad", "<b>as</b> tall <b>as</b> · <b>not as</b> tall <b>as</b>"],
    ],
    signals: "than, the ... in/of, as ... as, much (much bigger), a bit (a bit cheaper).",
    mistakes: [
      ["She is more tall than me.", "She is taller than me.", "Adjetivos cortos usan -er."],
      ["He is taller that me.", "He is taller than me.", "Comparativo + than."],
      ["It's the most cheap.", "It's the cheapest.", "Corto → -est."],
      ["more better", "better", "No se combinan more y -er."],
    ],
    concepts: {
      short: { title: "Adjetivos cortos: -er / -est", text: "Una sílaba (y los de dos que terminan en -y) agregan -er/-est. Ojo a la ortografía: hot → hotter, nice → nicer, happy → happier.",
        examples: ["Today is <b>hotter</b> than yesterday.", "She's the <b>youngest</b> in the family.", "This is <b>easier</b> than I thought."] },
      long: { title: "Adjetivos largos: more / most", text: "Dos o más sílabas (sin -y final): more + adjetivo, the most + adjetivo.",
        examples: ["Rome is <b>more expensive</b> than Lisbon.", "It's the <b>most beautiful</b> beach I know.", "This film is <b>more interesting</b>."] },
      irregular: { title: "Irregulares", text: "good → better → the best; bad → worse → the worst; far → further (farther) → the furthest.",
        examples: ["My English is <b>better</b> now.", "It was the <b>worst</b> day of my life.", "The station is <b>further</b> than I expected."] },
      than: { title: "Comparativo + than", text: "El comparativo se usa para dos cosas y va seguido de than (no that).",
        examples: ["He's older <b>than</b> his wife.", "The train is faster <b>than</b> the bus.", "Which is <b>cheaper</b>, the red one or the blue one?"] },
      superlative: { title: "Superlativo: the ... in/of", text: "Para destacar uno entre un grupo: the + -est / the most. Suele seguir in (lugares, grupos) u of (períodos, cantidades).",
        examples: ["It's <b>the tallest</b> building <b>in</b> the city.", "the <b>best</b> day <b>of</b> the year", "the <b>most popular</b> student in the class"] },
      equal: { title: "as ... as", text: "Igualdad con as + adjetivo base + as; desigualdad con not as ... as.",
        examples: ["She's <b>as tall as</b> her brother.", "This phone isn't <b>as good as</b> the old one."] },
    },
  },
  {
    id: "quantifiers", level: "A2", name: "Some / any / much / many",
    intro: "Palabras para hablar de cantidades, que cambian según el sustantivo sea contable o incontable.",
    structure: [
      ["Contables (plural)", "many books · a few books · How many books?"],
      ["Incontables", "much money · a little money · How much money?"],
      ["Ambos", "some · any · a lot of · lots of · no"],
      ["some", "afirmativas, ofrecimientos y pedidos: Would you like some tea?"],
      ["any", "negativas y preguntas: Have you got any questions?"],
    ],
    signals: "How much / How many, There is / There are, I don't have...",
    mistakes: [
      ["How much people?", "How many people?", "People es plural contable."],
      ["an advice / informations", "some advice / some information", "Son incontables en inglés."],
      ["I don't have some money.", "I don't have any money.", "Negativa → any."],
      ["There is many cars.", "There are a lot of cars.", "Plural → there are; many suena formal en afirmativas."],
    ],
    concepts: {
      countable: { title: "Contable vs incontable", text: "Contables: se pueden contar y tienen plural (an apple, two apples). Incontables: no tienen plural ni llevan a/an (water, money, time, bread, advice, information, furniture, luggage, homework, news).",
        examples: ["I need <b>some information</b>. (no: informations)", "Can you give me <b>some advice</b>?", "My <b>luggage is</b> heavy."] },
      muchmany: { title: "much / many", text: "many con contables plurales; much con incontables. Se usan sobre todo en negativas y preguntas; en afirmativas es más natural a lot of.",
        examples: ["How <b>many</b> brothers have you got?", "We don't have <b>much</b> time.", "There are <b>a lot of</b> tourists. (más natural que many)"] },
      someany: { title: "some / any", text: "some en afirmativas y en ofrecimientos o pedidos (aunque sean preguntas). any en negativas y preguntas normales.",
        examples: ["There are <b>some</b> eggs in the fridge.", "Are there <b>any</b> eggs?", "Would you like <b>some</b> coffee?"] },
      few: { title: "a few / a little", text: "a few (algunos) con contables; a little (un poco) con incontables. Sin 'a' (few, little) tienen sentido negativo: casi nada.",
        examples: ["I've got <b>a few</b> friends in Madrid.", "Add <b>a little</b> salt.", "<b>Few</b> people came. (casi nadie)"] },
    },
  },
  {
    id: "going-to-will", level: "A2", name: "Going to vs will",
    intro: "Dos formas de futuro: going to para planes y evidencias, will para decisiones del momento, promesas y opiniones.",
    structure: [
      ["Going to +", "I'<b>m going to</b> study · she'<b>s going to</b> study"],
      ["Going to −", "I'<b>m not going to</b> study · they <b>aren't going to</b> study"],
      ["Going to ?", "<b>Are</b> you <b>going to</b> study?"],
      ["Will +", "I'<b>ll</b> help · she <b>will</b> help (sin to, sin -s)"],
      ["Will −", "I <b>won't</b> tell anyone."],
      ["Will ?", "<b>Will</b> you help me?"],
    ],
    signals: "Going to: already decided, Look!, evidencia visible. Will: I think, probably, maybe, I promise, OK / Wait (decisión del momento).",
    mistakes: [
      ["I will to call you.", "I will call you.", "Will + verbo sin to."],
      ["She going to travel.", "She's going to travel.", "Falta el verbo be."],
      ["I'm going to answer. (cuando suena el teléfono)", "I'll answer.", "Decisión en el momento → will."],
    ],
    concepts: {
      plan: { title: "Plan ya decidido → going to", text: "Ya lo decidiste antes de hablar (y quizá ya hiciste algo: compraste, reservaste).",
        examples: ["I<b>'m going to</b> visit my parents this weekend.", "We<b>'re going to</b> paint the kitchen. We bought the paint yesterday.", "What <b>are</b> you <b>going to</b> do after university?"] },
      evidence: { title: "Predicción con evidencia → going to", text: "Ves algo ahora que te hace saber lo que va a pasar.",
        examples: ["Look at those clouds! It<b>'s going to</b> rain.", "Careful! You<b>'re going to</b> fall.", "She's pale. I think she<b>'s going to</b> faint."] },
      decision: { title: "Decisión en el momento → will", text: "Decidís mientras hablás, como reacción a algo. Muy común con 'OK', 'Wait', 'I know!'.",
        examples: ["The phone's ringing. — I<b>'ll</b> get it.", "It's cold. I<b>'ll</b> close the window.", "I<b>'ll</b> have the chicken, please."] },
      promise: { title: "Promesas, ofrecimientos y pedidos → will", text: "Prometer (I'll / I won't), ofrecer ayuda (I'll carry that) y pedir (Will you...?).",
        examples: ["I promise I <b>won't</b> be late.", "Don't worry, I<b>'ll</b> help you.", "<b>Will</b> you open the door, please?"] },
      opinion: { title: "Opinión sobre el futuro → will", text: "Predicción sin evidencia, basada en lo que pensás: I think, I'm sure, probably, maybe.",
        examples: ["I think Argentina <b>will</b> win.", "She'll <b>probably</b> be late.", "Maybe it<b>'ll</b> be sunny tomorrow."] },
      arrangement: { title: "Cita arreglada → present continuous", text: "Para encuentros con día, hora y otra persona ya acordados, lo más natural es el present continuous.",
        examples: ["I<b>'m meeting</b> Tom at six.", "We<b>'re flying</b> to Rome on Friday."] },
    },
  },
  {
    id: "present-perfect", level: "A2", name: "Present perfect",
    intro: "Une el pasado con el presente: experiencias, resultados que importan ahora y acciones recientes.",
    structure: [
      ["Afirmativa", "I/you/we/they <b>have (’ve) worked</b> · he/she/it <b>has (’s) worked</b>"],
      ["Negativa", "I <b>haven't seen</b> · she <b>hasn't seen</b>"],
      ["Pregunta", "<b>Have</b> you <b>seen</b>? · <b>Has</b> she <b>seen</b>?"],
      ["Participio", "regulares = -ed · irregulares: be-been, go-gone/been, see-seen, eat-eaten, write-written, do-done"],
    ],
    signals: "ever, never, just, already, yet, so far, recently, this week (sin terminar).",
    mistakes: [
      ["I have saw it.", "I have seen it.", "Se usa el participio, no el pasado."],
      ["Did you ever go to Peru?", "Have you ever been to Peru?", "Experiencias → present perfect."],
      ["I have finished it yesterday.", "I finished it yesterday.", "Con momento terminado → past simple."],
      ["She have arrived.", "She has arrived.", "He/she/it → has."],
    ],
    concepts: {
      experience: { title: "Experiencias de vida: ever / never", text: "Cosas que hiciste (o no) alguna vez en tu vida, sin decir cuándo. Ever en preguntas, never en negativas. Been to = haber ido y vuelto.",
        examples: ["<b>Have</b> you <b>ever been</b> to Brazil?", "I<b>'ve never eaten</b> sushi.", "She<b>'s</b> <b>visited</b> ten countries."] },
      just: { title: "Recién: just", text: "Just va entre have y el participio: algo que pasó hace muy poco.",
        examples: ["I<b>'ve just finished</b> my homework.", "She<b>'s just left</b>.", "We<b>'ve just arrived</b>."] },
      alreadyyet: { title: "already / yet", text: "already (ya, antes de lo esperado) va en el medio, en afirmativas. yet (todavía, ya) va al final, en negativas y preguntas.",
        examples: ["I<b>'ve already</b> bought the tickets.", "He <b>hasn't</b> called <b>yet</b>.", "<b>Have</b> you finished <b>yet</b>?"] },
      result: { title: "Resultado que importa ahora", text: "Una acción pasada cuyo efecto se ve en el presente.",
        examples: ["I<b>'ve lost</b> my keys. (no las tengo ahora)", "He<b>'s broken</b> his arm, so he can't play.", "Someone <b>has eaten</b> my cake!"] },
      form: { title: "Forma: have/has + participio", text: "Has con he/she/it; have con el resto. El participio de irregulares es la 3.ª columna: go-went-gone, see-saw-seen, write-wrote-written.",
        examples: ["She <b>has written</b> a book.", "They <b>have gone</b> home.", "<b>Has</b> he <b>done</b> it?"] },
      finished: { title: "Con momento terminado no va", text: "Si aparece yesterday, ago, last..., in 2015, se usa past simple.",
        examples: ["I <b>saw</b> it yesterday. (no: have seen)", "She <b>arrived</b> an hour ago."] },
    },
  },
  {
    id: "pp-vs-past", level: "B1", name: "Present perfect vs past simple",
    intro: "La clave es el tiempo: ¿está terminado (past simple) o sigue abierto / no importa cuándo (present perfect)?",
    structure: [
      ["Present perfect", "I<b>'ve been</b> to Japan. (alguna vez, no digo cuándo)"],
      ["Past simple", "I <b>went</b> to Japan <b>in 2019</b>. (momento concreto)"],
      ["Típico en una charla", "Have you ever been...? — Yes, I have. I went last year."],
    ],
    signals: "Past simple: yesterday, ago, last, in + año, when..., What time/When...? Present perfect: ever, never, just, already, yet, so far, this week/today (sin terminar), in my life.",
    mistakes: [
      ["I have seen him yesterday.", "I saw him yesterday.", "Momento terminado."],
      ["When have you arrived?", "When did you arrive?", "When pregunta por un momento."],
      ["I live here since 2010.", "I've lived here since 2010.", "Sigue siendo verdad → present perfect."],
    ],
    concepts: {
      finished: { title: "Tiempo terminado → past simple", text: "Cuando se dice o se sobreentiende cuándo pasó, el período está cerrado.",
        examples: ["I <b>lost</b> my phone last week.", "She <b>went</b> to Paris in 2018.", "We <b>lived</b> in Rosario for five years (ya no vivimos ahí)."] },
      unfinished: { title: "Tiempo no terminado → present perfect", text: "today, this week, this year, so far: el período todavía no terminó.",
        examples: ["I<b>'ve had</b> three coffees today.", "We <b>haven't seen</b> Ana this week.", "It<b>'s rained</b> a lot this month."] },
      experience: { title: "Experiencia sin fecha → present perfect", text: "Sin fecha y con relevancia ahora: ever, never, twice, several times, before.",
        examples: ["<b>Have</b> you ever <b>met</b> a famous person?", "I<b>'ve read</b> that book twice.", "This is the best pizza I<b>'ve ever eaten</b>."] },
      details: { title: "Primero perfect, después detalles en past", text: "En una conversación se introduce el tema con present perfect y los detalles (cuándo, dónde, cómo) se cuentan en past simple.",
        examples: ["I<b>'ve been</b> to Mexico. I <b>went</b> last year and I <b>loved</b> it.", "—Have you seen the film? —Yes, I <b>saw</b> it on Friday."] },
      when: { title: "When / What time → past simple", text: "Las preguntas que piden un momento van en past simple.",
        examples: ["<b>When did</b> you <b>start</b> learning English?", "<b>What time did</b> you <b>get</b> home?"] },
      closed: { title: "Personas o épocas que ya no están → past simple", text: "Si la persona murió o el período cerró, se usa past simple.",
        examples: ["Shakespeare <b>wrote</b> many plays.", "My grandfather <b>travelled</b> a lot."] },
    },
  },
  {
    id: "for-since", level: "B1", name: "For / since",
    intro: "Para decir desde cuándo o durante cuánto tiempo pasa algo que todavía continúa.",
    structure: [
      ["for + período", "for two years · for ten minutes · for ages · for a long time"],
      ["since + inicio", "since 2019 · since Monday · since I was a child · since 9 o'clock"],
      ["Pregunta", "<b>How long have</b> you <b>lived</b> here?"],
      ["ago (otra cosa)", "I moved here two years <b>ago</b>. → past simple"],
    ],
    signals: "How long...?, for, since, ago.",
    mistakes: [
      ["I live here since 2010.", "I've lived here since 2010.", "Con since/for para algo que sigue → present perfect."],
      ["since five years", "for five years", "Cinco años es un período."],
      ["How long are you here?", "How long have you been here?", "How long + present perfect."],
    ],
    concepts: {
      for: { title: "for + duración", text: "for va con una cantidad de tiempo: cuánto duró hasta ahora.",
        examples: ["I've had this car <b>for</b> three years.", "We've been waiting <b>for</b> ages.", "She's worked here <b>for</b> six months."] },
      since: { title: "since + punto de inicio", text: "since va con el momento en que empezó: una fecha, un día, una hora o una oración en pasado.",
        examples: ["I've known her <b>since</b> 2015.", "He's been ill <b>since</b> Friday.", "They've lived here <b>since</b> they got married."] },
      form: { title: "Con present perfect", text: "Si la situación sigue en el presente, el verbo va en present perfect (no en presente como en español: 'vivo acá desde...').",
        examples: ["I <b>have lived</b> here since 2010. (no: I live)", "<b>How long have</b> you <b>had</b> this phone?", "She<b>'s been</b> a teacher for ten years."] },
      ago: { title: "ago → past simple", text: "ago va después del período y con past simple: cuándo pasó algo terminado.",
        examples: ["I moved here ten years <b>ago</b>.", "She called an hour <b>ago</b>."] },
    },
  },
  {
    id: "first-cond", level: "B1", name: "First conditional",
    intro: "Situaciones reales o probables en el futuro y sus consecuencias.",
    structure: [
      ["Estructura", "If + <b>present simple</b>, <b>will</b> + verbo"],
      ["Ejemplo", "If it <b>rains</b>, we<b>'ll stay</b> at home."],
      ["Orden invertido", "We'll stay at home if it rains. (sin coma)"],
      ["Otras conjunciones", "unless (= if not) · when · as soon as · before · until"],
    ],
    signals: "if, unless, when, as soon as, before, until, in case.",
    mistakes: [
      ["If it will rain...", "If it rains...", "Nunca will en la parte del if."],
      ["When I will arrive, I'll call you.", "When I arrive, I'll call you.", "Lo mismo con when, as soon as."],
      ["Unless you don't study...", "Unless you study...", "Unless ya es negativo."],
    ],
    concepts: {
      real: { title: "Situación real o probable", text: "Algo que puede pasar de verdad, y su consecuencia. La condición va en presente aunque hable del futuro.",
        examples: ["If you <b>study</b>, you<b>'ll pass</b>.", "If she <b>calls</b>, I<b>'ll tell</b> her.", "We <b>won't go</b> out if it <b>rains</b>."] },
      ifpresent: { title: "Después de if: presente, nunca will", text: "En la parte del if se usa present simple. El will va solo en la consecuencia.",
        examples: ["If it <b>rains</b> tomorrow... (no: will rain)", "If you <b>don't hurry</b>, you'll miss the bus.", "If he <b>misses</b> the train, he'll take a taxi."] },
      unless: { title: "unless = if not", text: "unless ya incluye la negación, así que el verbo va en afirmativa.",
        examples: ["I won't go <b>unless</b> you come. (= if you don't come)", "<b>Unless</b> we leave now, we'll be late."] },
      time: { title: "when / as soon as / before + presente", text: "Las oraciones de tiempo sobre el futuro siguen la misma regla: presente, no will.",
        examples: ["I'll call you <b>when</b> I <b>arrive</b>.", "<b>As soon as</b> she <b>gets</b> home, she'll text you.", "Finish this <b>before</b> you <b>go</b>."] },
      zero: { title: "Zero conditional (hechos)", text: "Para cosas que siempre pasan: If + presente, presente.",
        examples: ["If you <b>heat</b> ice, it <b>melts</b>.", "If I <b>drink</b> coffee late, I <b>can't</b> sleep."] },
    },
  },
  {
    id: "second-cond", level: "B1", name: "Second conditional",
    intro: "Situaciones imaginarias, imposibles o poco probables en el presente o el futuro.",
    structure: [
      ["Estructura", "If + <b>past simple</b>, <b>would</b> + verbo"],
      ["Ejemplo", "If I <b>had</b> more time, I<b>'d learn</b> Japanese."],
      ["Be", "If I/he/she <b>were</b>... (were para todos)"],
      ["Consejo", "If I <b>were</b> you, I<b>'d</b> accept."],
    ],
    signals: "if, would ('d), could, might, If I were you.",
    mistakes: [
      ["If I would have money...", "If I had money...", "No va would en la parte del if."],
      ["If I was you...", "If I were you...", "Expresión fija con were."],
      ["If he studied, he will pass.", "If he studied, he would pass.", "Past en el if → would en el resultado."],
    ],
    concepts: {
      imaginary: { title: "Situación imaginaria → past + would", text: "El pasado acá no habla de pasado: marca que es hipotético. Compará: If I have time (es posible) vs If I had time (no tengo).",
        examples: ["If I <b>had</b> a car, I <b>would drive</b> to work.", "If she <b>lived</b> by the sea, she<b>'d swim</b> every day.", "What <b>would</b> you <b>do</b> if you <b>won</b> the lottery?"] },
      were: { title: "were con todas las personas", text: "En el 2.º condicional se prefiere were también con I/he/she/it. If I were you es la forma fija para dar consejos.",
        examples: ["If I <b>were</b> you, I'd apologise.", "If she <b>were</b> taller, she could be a model.", "If it <b>weren't</b> so expensive, I'd buy it."] },
      would: { title: "would en la consecuencia, no en el if", text: "Would ('d) va solo en la parte del resultado. Negativa: wouldn't.",
        examples: ["I <b>would help</b> you if I knew how.", "She<b>'d be</b> happier if she changed jobs.", "I <b>wouldn't say</b> anything."] },
      firstvssecond: { title: "1.º o 2.º condicional", text: "Depende de qué tan real lo ves: probable → 1.º (present + will); imaginario o improbable → 2.º (past + would).",
        examples: ["If it <b>rains</b> tomorrow, we<b>'ll</b> stay in. (puede pasar)", "If I <b>were</b> a bird, I<b>'d</b> fly. (imposible)"] },
    },
  },
  {
    id: "modals", level: "B1", name: "Modales: must, have to, should, might",
    intro: "Verbos que expresan obligación, prohibición, consejo, posibilidad y deducción.",
    structure: [
      ["Forma", "modal + verbo base: She <b>must go</b> (sin to, sin -s)"],
      ["Obligación", "must · have to (pasado: had to)"],
      ["Prohibición / no necesario", "mustn't (prohibido) · don't have to (no hace falta)"],
      ["Consejo", "should · shouldn't · ought to"],
      ["Posibilidad", "might · may · could"],
      ["Deducción", "must (seguro que sí) · can't (seguro que no)"],
    ],
    signals: "rules, it's forbidden, it's not necessary, I advise you, maybe, I'm sure.",
    mistakes: [
      ["You must to go.", "You must go.", "Los modales van sin to."],
      ["He cans swim.", "He can swim.", "Los modales no llevan -s."],
      ["You mustn't come. (= no hace falta)", "You don't have to come.", "Mustn't = prohibido."],
      ["I must work yesterday.", "I had to work yesterday.", "Must no tiene pasado."],
    ],
    concepts: {
      obligation: { title: "Obligación: must / have to", text: "must: obligación que siente el hablante o reglas escritas. have to: obligación externa (trabajo, ley). En pasado y futuro solo have to: had to, will have to.",
        examples: ["I <b>must</b> call my mum. (lo siento yo)", "In my job I <b>have to</b> wear a uniform.", "Yesterday I <b>had to</b> work late."] },
      prohibition: { title: "mustn't vs don't have to", text: "¡Significan cosas distintas! mustn't = está prohibido. don't have to = no es necesario, podés elegir.",
        examples: ["You <b>mustn't</b> smoke here. (prohibido)", "You <b>don't have to</b> come. (no hace falta)", "We <b>didn't have to</b> pay; it was free."] },
      advice: { title: "Consejo: should / ought to", text: "Para recomendar u opinar qué es lo correcto. Negativa: shouldn't.",
        examples: ["You <b>should</b> see a doctor.", "You <b>shouldn't</b> eat so much sugar.", "We <b>ought to</b> leave now."] },
      possibility: { title: "Posibilidad: might / may / could", text: "Algo que quizá pase o sea cierto (como 'puede que').",
        examples: ["Take an umbrella. It <b>might</b> rain.", "She <b>may</b> be at home.", "That <b>could</b> be the answer."] },
      deduction: { title: "Deducción: must / can't", text: "Conclusión lógica: must = estoy seguro de que sí; can't = estoy seguro de que no. (No se usa mustn't para esto.)",
        examples: ["You've worked all day. You <b>must</b> be tired.", "That <b>can't</b> be Juan; he's in London.", "It <b>must</b> be expensive."] },
      form: { title: "Forma de los modales", text: "Sin to, sin -s, sin do en negativas/preguntas: can't, mustn't, should I...? Para ofrecer: Shall I...? Habilidad pasada: could. Futuro de can: will be able to.",
        examples: ["She <b>can</b> speak three languages.", "<b>Shall</b> I open the window?", "I <b>could</b> swim when I was five.", "We<b>'ll be able to</b> meet next week."] },
    },
  },
  {
    id: "used-to", level: "B1", name: "Used to",
    intro: "Hábitos y estados del pasado que ya no son así.",
    structure: [
      ["Afirmativa", "I <b>used to</b> play tennis."],
      ["Negativa", "I <b>didn't use to</b> like fish. (sin d)"],
      ["Pregunta", "<b>Did</b> you <b>use to</b> live here?"],
      ["No confundir", "I'm <b>used to</b> getting up early. = estoy acostumbrado"],
    ],
    signals: "when I was a child, years ago, before, but now..., any more.",
    mistakes: [
      ["I use to play.", "I used to play.", "Afirmativa → used."],
      ["I didn't used to...", "I didn't use to...", "Con did → use."],
      ["I'm used to get up early.", "I'm used to getting up early.", "Be used to + -ing."],
    ],
    concepts: {
      habit: { title: "Hábitos pasados", text: "Cosas que hacías repetidamente y ya no hacés.",
        examples: ["I <b>used to</b> walk to school.", "We <b>used to</b> go to the beach every summer.", "My dad <b>used to</b> smoke, but he stopped."] },
      state: { title: "Estados pasados", text: "Situaciones que eran así y cambiaron (tener, ser, vivir, gustar).",
        examples: ["She <b>used to</b> have long hair.", "There <b>used to</b> be a cinema here.", "I <b>used to</b> be very shy."] },
      negq: { title: "Negativa y pregunta: use to", text: "Con did la d desaparece: didn't use to, Did you use to...?",
        examples: ["I <b>didn't use to</b> like vegetables.", "<b>Did</b> you <b>use to</b> play with dolls?", "Where <b>did</b> you <b>use to</b> live?"] },
      beused: { title: "be used to + -ing = estar acostumbrado", text: "Otra estructura: be/get used to + -ing o sustantivo. Habla del presente (o cualquier tiempo), no de hábitos pasados.",
        examples: ["I<b>'m used to working</b> at night.", "She <b>isn't used to</b> the cold.", "You'll <b>get used to</b> it."] },
    },
  },
  {
    id: "relatives", level: "B1", name: "Relative clauses",
    intro: "Para dar información sobre un sustantivo dentro de la misma oración.",
    structure: [
      ["who", "personas: the woman <b>who</b> lives next door"],
      ["which", "cosas y animales: the phone <b>which</b> I bought"],
      ["that", "personas o cosas (cláusulas que definen)"],
      ["where", "lugares: the town <b>where</b> I grew up"],
      ["whose", "posesión: the man <b>whose</b> car was stolen"],
    ],
    signals: "Después del sustantivo que querés explicar.",
    mistakes: [
      ["The film who we saw", "The film which/that we saw", "Cosa → which/that."],
      ["The woman who she lives here", "The woman who lives here", "No se repite el sujeto."],
      ["The man who his car...", "The man whose car...", "Posesión → whose."],
    ],
    concepts: {
      who: { title: "who → personas", text: "Para personas (también that).",
        examples: ["The man <b>who</b> lives next door is a pilot.", "She's the girl <b>who</b> won the race.", "People <b>who</b> work at night often feel tired."] },
      which: { title: "which / that → cosas", text: "Para cosas y animales. En cláusulas que definen también that, que es más común en inglés hablado.",
        examples: ["The phone <b>which</b> I bought has stopped working.", "Is this the book <b>that</b> you recommended?", "I don't like films <b>which</b> have sad endings."] },
      where: { title: "where → lugares", text: "Para lugares, cuando algo pasa ahí (= in which).",
        examples: ["That's the restaurant <b>where</b> we had our first date.", "the town <b>where</b> I was born", "the hotel <b>where</b> we stayed"] },
      whose: { title: "whose → posesión", text: "Reemplaza a his/her/their: la persona cuyo...",
        examples: ["I have a friend <b>whose</b> father is a singer.", "That's the man <b>whose</b> car was stolen.", "the neighbour <b>whose</b> dog barks all night"] },
      norepeat: { title: "No repetir el sujeto ni el objeto", text: "El relativo ya reemplaza a he/she/it; no se agrega otro pronombre.",
        examples: ["The woman who <b>lives</b> here... (no: who she lives)", "The book that I read <b>(it)</b>... → The book that I read was great."] },
      omit: { title: "Omitir el relativo", text: "Si el relativo es objeto (después viene otro sujeto), se puede omitir.",
        examples: ["The book <b>(that)</b> I read was great.", "The people <b>(who)</b> we met were friendly."] },
    },
  },
  {
    id: "passive", level: "B1", name: "Voz pasiva",
    intro: "Cuando importa más la acción o el objeto que quién la hace.",
    structure: [
      ["Presente", "is/are + participio: Coffee <b>is grown</b> in Colombia."],
      ["Pasado", "was/were + participio: The bridge <b>was built</b> in 1990."],
      ["Negativa", "It <b>isn't made</b> here. · They <b>weren't invited</b>."],
      ["Pregunta", "<b>Is</b> it <b>made</b> here? · When <b>was</b> it <b>built</b>?"],
      ["Agente", "... <b>by</b> + quién lo hizo"],
    ],
    signals: "by, made in, built in, invented, written by.",
    mistakes: [
      ["The book was wrote by...", "The book was written by...", "Va el participio."],
      ["The house built in 1920.", "The house was built in 1920.", "Falta be."],
      ["arrested from the police", "arrested by the police", "El agente va con by."],
      ["These shoes is made...", "These shoes are made...", "Plural → are."],
    ],
    concepts: {
      present: { title: "Pasiva presente: is/are + participio", text: "Hechos generales, procesos y rutinas en los que no importa quién lo hace.",
        examples: ["English <b>is spoken</b> all over the world.", "These cars <b>are made</b> in Japan.", "The windows <b>are cleaned</b> every week."] },
      past: { title: "Pasiva pasado: was/were + participio", text: "Hechos terminados: inventos, construcciones, robos, decisiones.",
        examples: ["The Mona Lisa <b>was painted</b> by Leonardo.", "My bike <b>was stolen</b> last night.", "We <b>weren't invited</b> to the wedding."] },
      by: { title: "by + agente", text: "Si queremos decir quién lo hizo, va con by. Solo se menciona si aporta información.",
        examples: ["Hamlet was written <b>by</b> Shakespeare.", "The thief was arrested <b>by</b> the police.", "The museum is visited <b>by</b> thousands of people."] },
      form: { title: "Concordancia y participio", text: "El verbo be concuerda con el sujeto (is/are, was/were) y el verbo principal va siempre en participio.",
        examples: ["The letter <b>was sent</b>. → The letters <b>were sent</b>.", "Rice <b>is grown</b> (no: is grow)."] },
      transform: { title: "De activa a pasiva", text: "El objeto de la activa pasa a ser sujeto; el verbo se pone en be (mismo tiempo) + participio.",
        examples: ["They built the bridge in 1990. → The bridge <b>was built</b> in 1990.", "People speak Spanish here. → Spanish <b>is spoken</b> here."] },
    },
  },
  {
    id: "gerund-inf", level: "B1", name: "Gerundio vs infinitivo",
    intro: "Algunos verbos van seguidos de -ing y otros de to + verbo.",
    structure: [
      ["Verbo + -ing", "enjoy, finish, mind, avoid, suggest, keep, give up, can't stand, practise"],
      ["Verbo + to", "want, decide, hope, plan, need, promise, refuse, agree, learn, would like"],
      ["Preposición + -ing", "good at swimming · before leaving · interested in learning"],
      ["Propósito", "to: I went out <b>to buy</b> bread."],
      ["Sujeto", "-ing: <b>Swimming</b> is good for you."],
    ],
    signals: "El verbo que va antes decide.",
    mistakes: [
      ["I enjoy to read.", "I enjoy reading.", "Enjoy + -ing."],
      ["I want going.", "I want to go.", "Want + to."],
      ["I went for buy bread.", "I went to buy bread.", "Propósito → to."],
      ["I'm looking forward to see you.", "I'm looking forward to seeing you.", "Ahí to es preposición."],
    ],
    concepts: {
      ing: { title: "Verbos + -ing", text: "enjoy, finish, mind, avoid, suggest, keep, give up, practise, can't stand, don't mind.",
        examples: ["I enjoy <b>listening</b> to music.", "He gave up <b>smoking</b>.", "Would you mind <b>closing</b> the door?"] },
      to: { title: "Verbos + to", text: "want, decide, hope, plan, need, promise, refuse, agree, learn, would like, try (intentar).",
        examples: ["She decided <b>to buy</b> a car.", "They agreed <b>to meet</b> us.", "I'd like <b>to travel</b> to Asia."] },
      prep: { title: "Después de preposición → -ing", text: "Después de at, in, of, about, before, after, without... siempre -ing. Cuidado con look forward to y be used to: ahí to es preposición.",
        examples: ["She's good at <b>telling</b> jokes.", "Before <b>leaving</b>, turn off the lights.", "I'm looking forward to <b>seeing</b> you."] },
      purpose: { title: "Para qué → to", text: "Para expresar propósito se usa to + verbo (no for + verbo).",
        examples: ["I went to the bank <b>to get</b> money.", "She's saving <b>to buy</b> a flat."] },
      subject: { title: "-ing como sujeto", text: "Cuando una actividad es el sujeto de la oración, va en -ing.",
        examples: ["<b>Swimming</b> is good for your health.", "<b>Learning</b> a language takes time."] },
      remember: { title: "remember / forget + to", text: "remember to / forget to = acordarse / olvidarse de hacer algo (todavía no hecho).",
        examples: ["Remember <b>to lock</b> the door.", "I forgot <b>to call</b> her."] },
    },
  },
  {
    id: "reported", level: "B1", name: "Reported speech",
    intro: "Contar lo que otra persona dijo, sin citarla textualmente.",
    structure: [
      ["present → past", "\"I'm tired.\" → She said she <b>was</b> tired."],
      ["will → would", "\"I'll call.\" → He said he <b>would</b> call."],
      ["can → could", "\"I can swim.\" → He said he <b>could</b> swim."],
      ["past / perfect → past perfect", "\"I saw it.\" → She said she <b>had seen</b> it."],
      ["Preguntas", "\"Where do you live?\" → She asked where I <b>lived</b>."],
      ["Órdenes", "\"Sit down.\" → He told me <b>to sit</b> down."],
    ],
    signals: "said (that), told me (that), asked (if/where...), told me to.",
    mistakes: [
      ["She said me...", "She told me... / She said...", "Say no lleva persona."],
      ["He asked where did I work.", "He asked where I worked.", "Sin inversión."],
      ["She told me don't touch it.", "She told me not to touch it.", "Orden negativa: not to."],
    ],
    concepts: {
      backshift: { title: "El tiempo verbal retrocede", text: "Si el verbo que introduce está en pasado (said, told), lo que se reporta 'retrocede' un tiempo: present → past, will → would, can → could, past/present perfect → past perfect. También cambian los pronombres (I → she).",
        examples: ["\"I like pizza.\" → He said he <b>liked</b> pizza.", "\"We're going to move.\" → They said they <b>were</b> going to move.", "\"I've finished.\" → She said she <b>had</b> finished."] },
      saytell: { title: "say vs tell", text: "say + (that) + lo dicho, sin persona. tell + persona + (that). Con persona después de say se usa 'say to someone', poco común.",
        examples: ["She <b>said</b> (that) she was busy.", "She <b>told me</b> (that) she was busy.", "He <b>told us</b> a story."] },
      questions: { title: "Preguntas reportadas", text: "Sin inversión ni do/did: el orden vuelve a ser sujeto + verbo. Preguntas sí/no con if o whether.",
        examples: ["\"Where do you live?\" → She asked me where I <b>lived</b>.", "\"Are you OK?\" → He asked <b>if</b> I was OK.", "\"What time is it?\" → I asked what time it <b>was</b>."] },
      commands: { title: "Órdenes y pedidos: tell/ask + to", text: "tell/ask + persona + to + verbo; negativa con not to.",
        examples: ["\"Close the door.\" → He told me <b>to close</b> the door.", "\"Don't be late.\" → She told me <b>not to be</b> late.", "\"Please help me.\" → She asked me <b>to help</b> her."] },
    },
  },
];

const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));
const EXERCISES = [];
const EXERCISE_BY_ID = {};

// Formatos compactos (concept y wrongWhy son opcionales):
//   ["mc",  prompt, options, correctIndex, explanation, concept, { opciónIncorrecta: "por qué está mal" }]
//   ["gap", prompt, [answers...], explanation, concept]
//   ["err", [parts...], wrongIndex, correction, explanation, concept]
//   ["rw",  oraciónOriginal, comienzo, [continuaciones aceptadas], explanation, concept]
function addExercises(topic, items) {
  items.forEach((it, i) => {
    const id = `${topic}:${i}`;
    let ex;
    if (it[0] === "mc") {
      ex = { id, topic, type: "mc", prompt: it[1], options: it[2], answers: [it[2][it[3]]], explanation: it[4], concept: it[5], wrongWhy: it[6] };
    } else if (it[0] === "gap") {
      ex = { id, topic, type: "gap", prompt: it[1], answers: it[2], explanation: it[3], concept: it[4] };
    } else if (it[0] === "rw") {
      ex = { id, topic, type: "rw", source: it[1], start: it[2], answers: it[3], explanation: it[4], concept: it[5] };
    } else {
      ex = { id, topic, type: "err", parts: it[1], answers: [it[2]], correction: it[3], explanation: it[4], concept: it[5] };
    }
    EXERCISES.push(ex);
    EXERCISE_BY_ID[id] = ex;
  });
}
