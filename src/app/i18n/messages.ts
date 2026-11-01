type Messages = {
  skip: string;
  home: string;
  edition: string;
  tagline: string;
  title: string;
  subtitle: string;
  intro: string;
  footer: string;
  fan: string;
  language: string;
  theme: string;
  lightTheme: string;
  darkTheme: string;
  mode: string;
  battleMode: string;
  rollMode: string;
  balance: string;
  fullBattle: string;
  attackArmies: string;
  defendArmies: string;
  removeAttack: string;
  addAttack: string;
  removeDefend: string;
  addDefend: string;
  attackHint: string;
  defendHint: string;
  invalid: (max: number) => string;
  forecast: string;
  conquer: string;
  hold: string;
  attackLoss: string;
  defendLoss: string;
  assumptionsTitle: string;
  assumptions: string;
  forecastScope: string;
  roundingNotice: string;
  opening: string;
  strategy: string;
  attack: string;
  defend: string;
  rollDice: (n: number) => string;
  attackAdvice: string;
  defendAdvice: string;
  strategyNote: string;
  strategyDetails: string;
  comparisonLabel: string;
  comparison: string;
  dicePair: string;
  conquerShort: string;
  holdShort: string;
  rollLoss: string;
  battleLoss: string;
  sides: string;
  recommended: string;
  alreadyConquered: string;
  cannotAttack: string;
  individual: string;
  hypothetical: string;
  chooseFirst: string;
  notice: string;
  attackDice: string;
  defendDice: string;
  dice: (n: number) => string;
  requiresAttack: (n: number) => string;
  requiresDefense: (n: number) => string;
  known: string;
  entryMode: string;
  entryModeHint: string;
  descending: string;
  freeEntry: string;
  faceValue: (n: number) => string;
  descendingHint: string;
  incompleteDice: string;
  die: (n: number) => string;
  sortHint: string;
  conditional: string;
  rollResultsTitle: string;
  rollDetailTitle: string;
  showBreakdown: string;
  preRollOutcomes: string;
  rollWinExplanation: string;
  outcomeDescription: (a: number, d: number) => string;
  outcomeShort: (a: number, d: number) => string;
  outcomeLosses: (a: number, d: number) => string;
  favorableCases: (count: number, total: number) => string;
  partitionRounding: string;
  mostLikely: string;
  expectedExplanation: string;
  rollDetails: string;
  marginalCaption: string;
  jointCaption: string;
  outcomeCount: string;
  probability: string;
  caption: (values: string, total: number) => string;
  armiesLost: string;
  attacker: string;
  defender: string;
  lossNote: (n: number) => string;
  beforeRoll: string;
  preRoll: (a: number, d: number, al: string, dl: string) => string;
  method: string;
  methodTitle: string;
  methodOne: string;
  methodTwo: string;
  methodThree: (max: number) => string;
  pageTitle: string;
  description: string;
};

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
  invalid: (max) =>
    `Enter whole numbers: 1–${max} attacking armies and 0–${max} defending armies.`,
  forecast: 'CHANCES OF CONQUEST OR RESISTANCE',
  conquer: 'Attacker conquers',
  hold: 'Defender holds',
  attackLoss: 'Expected attacker losses',
  defendLoss: 'Expected defender losses',
  assumptionsTitle: 'Forecast assumptions:',
  assumptions:
    'Both sides always roll the maximum legal dice. The attacker continues until conquest or only one army remains. Expected losses are averaged across all wins and losses.',
  forecastScope: 'The forecast does not necessarily use the recommended opening below.',
  roundingNotice: 'Percentages are rounded: 0.0% and 100.0% do not necessarily mean impossibility or certainty.',
  opening: 'Your opening move',
  strategy: 'STRATEGY NOTES',
  attack: 'ATTACK',
  defend: 'DEFEND',
  rollDice: (n) => `Roll ${n} ${n === 1 ? 'die' : 'dice'}.`,
  attackAdvice: 'Choose the strongest chance of conquest even against the defender’s most unfavorable opening.',
  defendAdvice: 'Choose the strongest chance of holding even against the attacker’s most unfavorable opening.',
  strategyNote:
    'Each recommendation is chosen independently before rolling. Only the opening roll varies; later rolls use the maximum dice.',
  strategyDetails: 'This does not optimize every future turn. Equal success odds favor more dice.',
  comparisonLabel: 'Opening dice comparison, horizontally scrollable',
  comparison:
    'Compare every legal opening — fewer immediate casualties do not necessarily mean better battle odds.',
  dicePair: 'Attack / defend dice',
  conquerShort: 'Conquer',
  holdShort: 'Hold',
  rollLoss: 'Roll losses',
  battleLoss: 'Battle losses',
  sides: 'Attacker / defender',
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
  dice: (n) => `${n} ${n === 1 ? 'die' : 'dice'}`,
  requiresAttack: (n) => `Requires at least ${n} armies in the origin territory.`,
  requiresDefense: (n) =>
    `Requires at least ${n} defending ${n === 1 ? 'army' : 'armies'}.`,
  known: 'Known attacker results',
  entryMode: 'Dice entry order',
  entryModeHint: 'Each entry mode remembers its own dice values; switching modes restores its previous values.',
  descending: 'Descending',
  freeEntry: 'Any order',
  faceValue: (n) => `Value ${n}`,
  descendingHint:
    'Each die must be no higher than the previous one. Later dice default to the highest allowed value.',
  incompleteDice: 'Choose a value for each attacking die to see conditional probabilities.',
  die: (n) => `Die ${n}`,
  sortHint: 'Enter in any order. Dice are sorted highest first; the defender wins ties.',
  conditional: 'CONDITIONAL ROLL PROBABILITIES',
  rollResultsTitle: 'Chances of winning the roll',
  rollDetailTitle: 'Outcome breakdown',
  showBreakdown: 'Show outcome breakdown',
  preRollOutcomes: 'Possible outcomes before either side rolls',
  rollWinExplanation:
    'A side wins the roll if it inflicts more losses than it takes. Shared losses do not decide the roll. A die tie favors the defender.',
  outcomeDescription: (a, d) =>
    a && d ? 'Shared losses' : a ? 'The defender wins the roll' : 'The attacker wins the roll',
  outcomeShort: (a, d) =>
    a && d ? 'Shared losses' : a ? 'Defender wins' : 'Attacker wins',
  outcomeLosses: (a, d) => `Attacker: ${a} lost · Defender: ${d} lost`,
  favorableCases: (count, total) => `${count} of ${total} possible defender rolls`,
  partitionRounding: 'Percentages are adjusted to total 100%; equally likely outcomes can differ by 0.1 percentage points. The case counts show their exact probabilities.',
  mostLikely: 'Most likely outcome',
  expectedExplanation: 'Expected losses are averages, not a prediction of the losses in one roll.',
  rollDetails: 'Mathematical details',
  marginalCaption: 'Loss distribution for each side',
  jointCaption: 'Joint outcomes: armies lost by each side',
  outcomeCount: 'Defender rolls',
  probability: 'Probability',
  caption: (values, total) =>
    `Given attacker values ${values}, over ${total} equally likely defender rolls.`,
  armiesLost: 'Armies lost',
  attacker: 'Attacker',
  defender: 'Defender',
  lossNote: (n) =>
    `Each column is a distribution over losses for that side, not independent events. Every roll eliminates exactly ${n} ${n === 1 ? 'army' : 'armies'} in total.`,
  beforeRoll: 'Before either side rolls',
  preRoll: (a, d, al, dl) =>
    `For ${a} vs ${d} dice, unconditional expected losses are ${al} attacker and ${dl} defender armies. Use Territory battle to compare legal opening choices by conquest and resistance chances.`,
  method: 'Behind the numbers',
  methodTitle: 'All outcomes. No simulations.',
  methodOne:
    'Each die has six equally likely faces. We enumerate all 6^(A + D) ordered outcomes for an unknown roll, or 6^D defender outcomes when attacker dice are known. Sorted dice are compared in pairs, and ties go to the defender.',
  methodTwo:
    'For a battle, each possible loss leads to a smaller battle. Dynamic programming memoizes these states and combines their probabilities until the defender has no armies or the attacker has only one. The origin’s final army is never risked or counted as a casualty.',
  methodThree: (max) =>
    `These are exact combinatorial models evaluated with floating-point arithmetic, not arbitrary-precision fractions. Percentages are rounded to one decimal; complete distributions are rounded together to total 100%. A displayed 0.0% or 100.0% may be a rounded value. Army inputs are limited to ${max} per side to keep calculations responsive.`,
  pageTitle: 'Risk Odds Calculator — Know your odds',
  description:
    'Exact dice and territorial battle probabilities for classic Risk. Compare legal dice choices, conquest odds, and expected casualties.',
} satisfies Messages;

export const es = {
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
  forecast: 'PROBABILIDADES DE CONQUISTAR O RESISTIR',
  conquer: 'El atacante conquista',
  hold: 'El defensor resiste',
  attackLoss: 'Bajas esperadas del atacante',
  defendLoss: 'Bajas esperadas del defensor',
  assumptionsTitle: 'Supuestos del pronóstico:',
  assumptions:
    'Ambos bandos siempre tiran el máximo de dados permitido. El atacante continúa hasta conquistar o quedarse con un ejército. Las bajas esperadas promedian victorias y derrotas.',
  forecastScope: 'El pronóstico no utiliza necesariamente la primera jugada recomendada a continuación.',
  roundingNotice: 'Los porcentajes están redondeados: 0,0 % y 100,0 % no implican necesariamente imposibilidad o certeza.',
  opening: 'Tu primera jugada',
  strategy: 'NOTAS ESTRATÉGICAS',
  attack: 'ATAQUE',
  defend: 'DEFENSA',
  rollDice: (n) => `Tira ${n} ${n === 1 ? 'dado' : 'dados'}.`,
  attackAdvice:
    'Elige la mejor probabilidad de conquista incluso ante la primera jugada más desfavorable del defensor.',
  defendAdvice:
    'Elige la mejor probabilidad de resistir incluso ante la primera jugada más desfavorable del atacante.',
  strategyNote:
    'Cada recomendación se elige por separado antes de tirar. Solo cambia la primera tirada; en las siguientes se usa el máximo de dados.',
  strategyDetails: 'No se optimizan todos los turnos futuros. Si la probabilidad es igual, se prefieren más dados.',
  comparisonLabel: 'Comparación de dados iniciales, desplazable horizontalmente',
  comparison:
    'Compara cada primera tirada legal: menos bajas inmediatas no implica necesariamente mejores probabilidades de batalla.',
  dicePair: 'Dados ataque / defensa',
  conquerShort: 'Conquistar',
  holdShort: 'Resistir',
  rollLoss: 'Bajas en la tirada',
  battleLoss: 'Bajas en la batalla',
  sides: 'Atacante / defensor',
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
  entryModeHint: 'Cada modo recuerda sus propios valores; al cambiar se recuperan los valores anteriores de ese modo.',
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
  conditional: 'PROBABILIDADES CONDICIONALES DE LA TIRADA',
  rollResultsTitle: 'Probabilidades de ganar la tirada',
  rollDetailTitle: 'Desglose de resultados',
  showBreakdown: 'Ver desglose de resultados',
  preRollOutcomes: 'Resultados posibles antes de tirar',
  rollWinExplanation:
    'Un bando gana la tirada si causa más bajas de las que recibe. Las bajas repartidas no deciden la tirada. En cada comparación, los empates favorecen al defensor.',
  outcomeDescription: (a, d) =>
    a && d ? 'Bajas repartidas' : a ? 'El defensor gana la tirada' : 'El atacante gana la tirada',
  outcomeShort: (a, d) => (a && d ? 'Bajas repartidas' : a ? 'Gana defensor' : 'Gana atacante'),
  outcomeLosses: (a, d) => `Atacante: ${a} bajas · Defensor: ${d} bajas`,
  favorableCases: (count, total) => `${count} de ${total} tiradas defensoras posibles`,
  partitionRounding: 'Los porcentajes se ajustan para sumar 100 %; resultados igual de probables pueden diferir en 0,1 puntos porcentuales. Los casos muestran sus probabilidades exactas.',
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
} satisfies Messages;
