export const en = {
  skip: 'Skip to calculator',
  home: 'Risk Odds Calculator home',
  edition: 'FIELD GUIDE — CLASSIC RULES',
  tagline: 'LESS GUESSWORK. BETTER BATTLES.',
  title: 'Know your odds.',
  subtitle: 'Choose your move.',
  intro:
    'Exact probabilities for the next roll or the whole territory. A little intelligence before you commit your armies.',
  footer: 'Probability is intelligence, not a promise.',
  fan: 'Independent fan tool · Classic Risk rules',
  language: 'Language',
  theme: 'Color theme',
  lightTheme: 'Light',
  darkTheme: 'Dark',
  mode: 'Calculator mode',
  battleMode: '01 / Territory battle',
  rollMode: '02 / Individual roll',
  balance: 'The balance of forces',
  fullBattle: 'FULL BATTLE',
  attackArmies: 'Attacking armies',
  defendArmies: 'Defending armies',
  removeAttack: 'Remove attacking army',
  addAttack: 'Add attacking army',
  removeDefend: 'Remove defending army',
  addDefend: 'Add defending army',
  attackHint: 'Total in the origin territory. One must stay behind.',
  defendHint: 'Total in the territory you want to conquer.',
  invalid: (max: number) =>
    `Enter whole numbers: 1–${max} attacking armies and 0–${max} defending armies.`,
  forecast: 'TERRITORY FORECAST',
  conquer: 'Attacker conquers',
  hold: 'Defender holds',
  attackLoss: 'Expected attacker losses',
  defendLoss: 'Expected defender losses',
  assumptionsTitle: 'Forecast assumptions:',
  assumptions:
    'Both sides always roll the maximum legal dice. The attacker continues until conquest or only one army remains. Expected losses are averaged across all wins and losses.',
  opening: 'Your opening move',
  strategy: 'STRATEGY NOTES',
  attack: 'ATTACK',
  defend: 'DEFEND',
  rollDice: (n: number) => `Roll ${n} ${n === 1 ? 'die' : 'dice'}.`,
  attackAdvice: 'Best worst-case chance of conquest across the defender’s legal opening choices.',
  defendAdvice: 'Best worst-case chance of holding across the attacker’s legal opening choices.',
  strategyNote:
    'These are independent, pre-roll choices. Only the opening roll varies below; every later roll uses maximum dice. This is not an optimized policy for every future turn. Equal success odds favor more dice.',
  comparisonLabel: 'Opening dice comparison, horizontally scrollable',
  comparison:
    'Compare every legal opening — fewer immediate casualties do not necessarily mean better battle odds.',
  dicePair: 'Attack / defend dice',
  conquerShort: 'Conquer',
  holdShort: 'Hold',
  rollLoss: 'Roll losses',
  battleLoss: 'Battle losses',
  sides: 'A / D',
  recommended: 'Recommended opening',
  alreadyConquered: 'No defenders remain: the territory is already conquered.',
  cannotAttack: 'No attack is possible: the last army must remain in the origin territory.',
  individual: 'Read an individual roll',
  hypothetical: 'HYPOTHETICAL ANALYSIS',
  chooseFirst: 'Choose before rolling.',
  notice:
    'In a real game, the defender chooses their dice before seeing the attacker’s results. Known attacker values below are for hypothetical analysis, not a legal opportunity to change defense.',
  attackDice: 'Attacking dice',
  defendDice: 'Defending dice',
  dice: (n: number) => `${n} ${n === 1 ? 'die' : 'dice'}`,
  requiresAttack: (n: number) => `Requires at least ${n} armies in the origin territory.`,
  requiresDefense: (n: number) =>
    `Requires at least ${n} defending ${n === 1 ? 'army' : 'armies'}.`,
  known: 'Known attacker results',
  entryMode: 'Dice entry order',
  descending: 'Descending',
  freeEntry: 'Any order',
  faceValue: (n: number) => `Value ${n}`,
  descendingHint:
    'Each die must be no higher than the previous one. Later dice default to the highest allowed value.',
  incompleteDice: 'Choose a value for each attacking die to see conditional probabilities.',
  die: (n: number) => `Die ${n}`,
  sortHint: 'Enter in any order. Dice are sorted highest first; the defender wins ties.',
  conditional: 'CONDITIONAL CASUALTY PROBABILITIES',
  rollResultsTitle: 'Possible losses',
  outcomeDescription: (a: number, d: number) =>
    a && d
      ? 'Both sides lose armies'
      : a
        ? `The attacker loses ${a} ${a === 1 ? 'army' : 'armies'}`
        : `The defender loses ${d} ${d === 1 ? 'army' : 'armies'}`,
  outcomeLosses: (a: number, d: number) => `Attacker: ${a} lost · Defender: ${d} lost`,
  favorableCases: (count: number, total: number) => `${count} of ${total} possible defender rolls`,
  mostLikely: 'Most likely outcome',
  expectedExplanation: 'Expected losses are averages, not a prediction of the losses in one roll.',
  rollDetails: 'Mathematical details',
  marginalCaption: 'Loss distribution for each side',
  jointCaption: 'Joint outcomes: armies lost by each side',
  outcomeCount: 'Defender rolls',
  probability: 'Probability',
  caption: (values: string, total: number) =>
    `Given attacker values ${values}, over ${total} equally likely defender rolls.`,
  armiesLost: 'Armies lost',
  attacker: 'Attacker',
  defender: 'Defender',
  lossNote: (n: number) =>
    `Each column is a distribution over losses for that side, not independent events. Every roll eliminates exactly ${n} ${n === 1 ? 'army' : 'armies'} in total.`,
  beforeRoll: 'Before either side rolls',
  preRoll: (a: number, d: number, al: string, dl: string) =>
    `For ${a} vs ${d} dice, unconditional expected losses are ${al} attacker and ${dl} defender armies. Use Territory battle to compare legal opening choices by conquest and resistance chances.`,
  method: 'Behind the numbers',
  methodTitle: 'All outcomes. No simulations.',
  methodOne:
    'Each die has six equally likely faces. We enumerate all 6^(A + D) ordered outcomes for an unknown roll, or 6^D defender outcomes when attacker dice are known. Sorted dice are compared in pairs, and ties go to the defender.',
  methodTwo:
    'For a battle, each possible loss leads to a smaller battle. Dynamic programming memoizes these states and combines their probabilities until the defender has no armies or the attacker has only one. The origin’s final army is never risked or counted as a casualty.',
  methodThree: (max: number) =>
    `These are exact combinatorial models evaluated with floating-point arithmetic, not arbitrary-precision fractions. Percentages are rounded to one decimal; complete distributions are rounded together to total 100%. A displayed 0.0% or 100.0% may be a rounded value. Army inputs are limited to ${max} per side to keep calculations responsive.`,
  pageTitle: 'Risk Odds Calculator — Know your odds',
  description:
    'Exact dice and territorial battle probabilities for classic Risk. Compare legal dice choices, conquest odds, and expected casualties.',
};

export const es: {
  [K in keyof typeof en]: (typeof en)[K] extends (...args: infer P) => string
    ? (...args: P) => string
    : string;
} = {
  skip: 'Ir a la calculadora',
  home: 'Inicio de la calculadora de probabilidades Risk',
  edition: 'GUÍA DE CAMPO — REGLAS CLÁSICAS',
  tagline: 'MENOS AZAR. MEJORES BATALLAS.',
  title: 'Conoce tus probabilidades.',
  subtitle: 'Elige tu movimiento.',
  intro:
    'Probabilidades exactas para la próxima tirada o toda la batalla. Analiza tus opciones antes de comprometer tus ejércitos.',
  footer: 'La probabilidad informa, no garantiza.',
  fan: 'Herramienta independiente de aficionados · Reglas clásicas de Risk',
  language: 'Idioma',
  theme: 'Tema de color',
  lightTheme: 'Claro',
  darkTheme: 'Oscuro',
  mode: 'Modo de calculadora',
  battleMode: '01 / Batalla territorial',
  rollMode: '02 / Tirada individual',
  balance: 'El balance de fuerzas',
  fullBattle: 'BATALLA COMPLETA',
  attackArmies: 'Ejércitos atacantes',
  defendArmies: 'Ejércitos defensores',
  removeAttack: 'Quitar un ejército atacante',
  addAttack: 'Añadir un ejército atacante',
  removeDefend: 'Quitar un ejército defensor',
  addDefend: 'Añadir un ejército defensor',
  attackHint: 'Total en el territorio de origen. Uno debe quedarse.',
  defendHint: 'Total en el territorio que deseas conquistar.',
  invalid: (max) =>
    `Introduce números enteros: 1–${max} ejércitos atacantes y 0–${max} defensores.`,
  forecast: 'PRONÓSTICO TERRITORIAL',
  conquer: 'El atacante conquista',
  hold: 'El defensor resiste',
  attackLoss: 'Bajas esperadas del atacante',
  defendLoss: 'Bajas esperadas del defensor',
  assumptionsTitle: 'Supuestos del pronóstico:',
  assumptions:
    'Ambos bandos siempre tiran el máximo de dados permitido. El atacante continúa hasta conquistar o quedarse con un ejército. Las bajas esperadas promedian victorias y derrotas.',
  opening: 'Tu primera jugada',
  strategy: 'NOTAS ESTRATÉGICAS',
  attack: 'ATAQUE',
  defend: 'DEFENSA',
  rollDice: (n) => `Tira ${n} ${n === 1 ? 'dado' : 'dados'}.`,
  attackAdvice:
    'Mejor probabilidad de conquista en el peor caso frente a las opciones legales iniciales del defensor.',
  defendAdvice:
    'Mejor probabilidad de resistir en el peor caso frente a las opciones legales iniciales del atacante.',
  strategyNote:
    'Son decisiones independientes tomadas antes de tirar. Solo cambia la primera tirada; en las siguientes se usa el máximo de dados. No es una estrategia optimizada para cada turno futuro. Si la probabilidad es igual, se prefieren más dados.',
  comparisonLabel: 'Comparación de dados iniciales, desplazable horizontalmente',
  comparison:
    'Compara cada primera tirada legal: menos bajas inmediatas no implica necesariamente mejores probabilidades de batalla.',
  dicePair: 'Dados ataque / defensa',
  conquerShort: 'Conquistar',
  holdShort: 'Resistir',
  rollLoss: 'Bajas en la tirada',
  battleLoss: 'Bajas en la batalla',
  sides: 'A / D',
  recommended: 'Primera jugada recomendada',
  alreadyConquered: 'No quedan defensores: el territorio ya está conquistado.',
  cannotAttack:
    'No es posible atacar: el último ejército debe permanecer en el territorio de origen.',
  individual: 'Analiza una tirada individual',
  hypothetical: 'ANÁLISIS HIPOTÉTICO',
  chooseFirst: 'Elige antes de tirar.',
  notice:
    'En una partida real, el defensor elige sus dados antes de ver los resultados del atacante. Los valores conocidos se usan para análisis hipotético, no permiten cambiar legalmente la defensa.',
  attackDice: 'Dados atacantes',
  defendDice: 'Dados defensores',
  dice: (n) => `${n} ${n === 1 ? 'dado' : 'dados'}`,
  requiresAttack: (n) => `Requiere al menos ${n} ejércitos en el territorio de origen.`,
  requiresDefense: (n) =>
    `Requiere al menos ${n} ${n === 1 ? 'ejército defensor' : 'ejércitos defensores'}.`,
  known: 'Resultados conocidos del atacante',
  entryMode: 'Orden de entrada de dados',
  descending: 'Descendente',
  freeEntry: 'Orden libre',
  faceValue: (n) => `Valor ${n}`,
  descendingHint:
    'Cada dado debe ser menor o igual al anterior. Los dados siguientes toman el valor máximo permitido por defecto.',
  incompleteDice:
    'Elige un valor para cada dado atacante para ver las probabilidades condicionales.',
  die: (n) => `Dado ${n}`,
  sortHint:
    'Introduce los valores en cualquier orden. Los dados se ordenan de mayor a menor; el defensor gana los empates.',
  conditional: 'PROBABILIDADES CONDICIONALES DE BAJAS',
  rollResultsTitle: 'Posibles bajas',
  outcomeDescription: (a, d) =>
    a && d
      ? 'Ambos bandos pierden ejércitos'
      : a
        ? `El atacante pierde ${a} ${a === 1 ? 'ejército' : 'ejércitos'}`
        : `El defensor pierde ${d} ${d === 1 ? 'ejército' : 'ejércitos'}`,
  outcomeLosses: (a, d) => `Atacante: ${a} bajas · Defensor: ${d} bajas`,
  favorableCases: (count, total) => `${count} de ${total} tiradas defensoras posibles`,
  mostLikely: 'Resultado más probable',
  expectedExplanation:
    'Las bajas esperadas son promedios, no una predicción de las bajas en una tirada.',
  rollDetails: 'Detalles matemáticos',
  marginalCaption: 'Distribución de bajas de cada bando',
  jointCaption: 'Resultados conjuntos: ejércitos perdidos por cada bando',
  outcomeCount: 'Tiradas defensoras',
  probability: 'Probabilidad',
  caption: (values, total) =>
    `Con los valores atacantes ${values}, entre ${total} tiradas defensoras equiprobables.`,
  armiesLost: 'Ejércitos perdidos',
  attacker: 'Atacante',
  defender: 'Defensor',
  lossNote: (n) =>
    `Cada columna es una distribución de bajas de ese bando, no son eventos independientes. Cada tirada elimina exactamente ${n} ${n === 1 ? 'ejército' : 'ejércitos'} en total.`,
  beforeRoll: 'Antes de que cualquiera tire',
  preRoll: (a, d, al, dl) =>
    `Para ${a} contra ${d} dados, las bajas esperadas sin condiciones son ${al} del atacante y ${dl} del defensor. Usa Batalla territorial para comparar opciones iniciales por sus probabilidades de conquista y resistencia.`,
  method: 'Cómo se calculan',
  methodTitle: 'Todos los resultados. Sin simulaciones.',
  methodOne:
    'Cada dado tiene seis caras equiprobables. Enumeramos los 6^(A + D) resultados ordenados de una tirada desconocida, o los 6^D resultados defensores si se conocen los dados atacantes. Los dados ordenados se comparan por pares y el defensor gana los empates.',
  methodTwo:
    'En una batalla, cada resultado conduce a una batalla más pequeña. La programación dinámica memoriza estos estados y combina sus probabilidades hasta que no quedan defensores o queda un solo atacante. El último ejército de origen nunca se arriesga ni se cuenta como baja.',
  methodThree: (max) =>
    `Son modelos combinatorios exactos evaluados con aritmética de punto flotante, no fracciones de precisión arbitraria. Los porcentajes se redondean a un decimal; las distribuciones completas se redondean conjuntamente para sumar 100 %. Un valor mostrado de 0,0 % o 100,0 % puede ser redondeado. El límite es de ${max} ejércitos por bando para mantener la agilidad del cálculo.`,
  pageTitle: 'Calculadora de probabilidades Risk — Conoce tus probabilidades',
  description:
    'Probabilidades exactas de dados y batallas territoriales en el Risk clásico. Compara dados, probabilidades de conquista y bajas esperadas.',
};
