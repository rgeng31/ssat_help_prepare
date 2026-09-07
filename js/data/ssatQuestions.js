// SSAT Upper Level Verbal Practice Questions Database
// Contains Synonyms and Analogies with 5 options (A-E) and detailed explanations.

const SSAT_QUESTIONS = [
  // --- SYNONYMS ---
  {
    id: "syn-1",
    type: "synonym",
    difficulty: "medium",
    targetWord: "PLIABLE",
    options: ["rigid", "stubborn", "flexible", "fragile", "modern"],
    correctAnswer: 2, // Index of 'flexible'
    explanation: "PLIABLE means easily bent, flexible, or supple."
  },
  {
    id: "syn-2",
    type: "synonym",
    difficulty: "hard",
    targetWord: "ENERVATE",
    options: ["energize", "exhaust", "confuse", "escape", "decorate"],
    correctAnswer: 1, // Index of 'exhaust'
    explanation: "ENERVATE means to drain of energy, weaken, or exhaust."
  },
  {
    id: "syn-3",
    type: "synonym",
    difficulty: "medium",
    targetWord: "FLUMMOX",
    options: ["clarify", "comfort", "baffle", "capture", "float"],
    correctAnswer: 2, // Index of 'baffle'
    explanation: "FLUMMOX means to perplex, confuse, or baffle completely."
  },
  {
    id: "syn-4",
    type: "synonym",
    difficulty: "medium",
    targetWord: "EXTRICATE",
    options: ["entangle", "capture", "disentangle", "accuse", "extend"],
    correctAnswer: 2, // Index of 'disentangle'
    explanation: "EXTRICATE means to free or disentangle from a difficult situation or constraint."
  },
  {
    id: "syn-5",
    type: "synonym",
    difficulty: "easy",
    targetWord: "MULTITUDE",
    options: ["scarcity", "crowd", "quiet", "sequence", "solitude"],
    correctAnswer: 1, // Index of 'crowd'
    explanation: "MULTITUDE refers to a large number of people or items; a crowd."
  },
  {
    id: "syn-6",
    type: "synonym",
    difficulty: "easy",
    targetWord: "PLUNDERING",
    options: ["giving", "looting", "planting", "repairing", "searching"],
    correctAnswer: 1, // Index of 'looting'
    explanation: "PLUNDERING is the act of stealing, looting, or ransacking goods, especially during war."
  },
  {
    id: "syn-7",
    type: "synonym",
    difficulty: "medium",
    targetWord: "PRECIPITOUS",
    options: ["flat", "steep", "gradual", "wet", "cautious"],
    correctAnswer: 1, // Index of 'steep'
    explanation: "PRECIPITOUS means dangerously high, sharp, or steep."
  },
  {
    id: "syn-8",
    type: "synonym",
    difficulty: "medium",
    targetWord: "SUMPTUOUSNESS",
    options: ["poverty", "luxuriousness", "simplicity", "sadness", "safety"],
    correctAnswer: 1, // Index of 'luxuriousness'
    explanation: "SUMPTUOUSNESS means magnificent, splendid, or extremely luxurious."
  },
  {
    id: "syn-9",
    type: "synonym",
    difficulty: "hard",
    targetWord: "QUALM",
    options: ["confidence", "misgiving", "peace", "anger", "error"],
    correctAnswer: 1, // Index of 'misgiving'
    explanation: "QUALM is an uneasy feeling of doubt, worry, fear, or misgiving."
  },
  {
    id: "syn-10",
    type: "synonym",
    difficulty: "medium",
    targetWord: "INFAMY",
    options: ["honor", "notoriety", "secrecy", "wisdom", "modesty"],
    correctAnswer: 1, // Index of 'notoriety'
    explanation: "INFAMY is the state of being well-known for some bad quality or evil deed; notoriety."
  },
  {
    id: "syn-11",
    type: "synonym",
    difficulty: "medium",
    targetWord: "FATUOUS",
    options: ["intelligent", "foolish", "serious", "obese", "loyal"],
    correctAnswer: 1, // Index of 'foolish'
    explanation: "FATUOUS means silly, pointlessly foolish, or brainless."
  },
  {
    id: "syn-12",
    type: "synonym",
    difficulty: "hard",
    targetWord: "CONVALESCENCE",
    options: ["sickness", "recuperation", "operation", "examination", "medicine"],
    correctAnswer: 1, // Index of 'recuperation'
    explanation: "CONVALESCENCE is the gradual recovery of health and strength after illness; recuperation."
  },
  {
    id: "syn-13",
    type: "synonym",
    difficulty: "medium",
    targetWord: "REPROACH",
    options: ["praise", "scold", "approach", "ignore", "duplicate"],
    correctAnswer: 1, // Index of 'scold'
    explanation: "REPROACH means to express disapproval, criticize, or scold."
  },
  {
    id: "syn-14",
    type: "synonym",
    difficulty: "hard",
    targetWord: "PUGNACIOUS",
    options: ["peaceful", "combative", "shy", "friendly", "clumsy"],
    correctAnswer: 1, // Index of 'combative'
    explanation: "PUGNACIOUS means eager or quick to argue, quarrel, or fight; combative."
  },
  {
    id: "syn-15",
    type: "synonym",
    difficulty: "hard",
    targetWord: "TEMPORAL",
    options: ["eternal", "earthly", "temporary", "angry", "ancient"],
    correctAnswer: 1, // Index of 'earthly'
    explanation: "TEMPORAL means relating to worldly or earthly affairs as opposed to spiritual matters."
  },
  {
    id: "syn-16",
    type: "synonym",
    difficulty: "medium",
    targetWord: "CIRCUMSPECT",
    options: ["reckless", "cautious", "circular", "respectful", "direct"],
    correctAnswer: 1, // Index of 'cautious'
    explanation: "CIRCUMSPECT means wary, prudent, and unwilling to take unnecessary risks; cautious."
  },
  {
    id: "syn-17",
    type: "synonym",
    difficulty: "easy",
    targetWord: "LADEN",
    options: ["empty", "burdened", "light", "lazy", "decorated"],
    correctAnswer: 1, // Index of 'burdened'
    explanation: "LADEN means heavily loaded or weighed down; burdened."
  },
  {
    id: "syn-18",
    type: "synonym",
    difficulty: "medium",
    targetWord: "PRETENTIOUS",
    options: ["modest", "ostentatious", "genuine", "intelligent", "wealthy"],
    correctAnswer: 1, // Index of 'ostentatious'
    explanation: "PRETENTIOUS means attempting to impress by pretending to have greater importance or talent; ostentatious."
  },
  {
    id: "syn-19",
    type: "synonym",
    difficulty: "hard",
    targetWord: "CONFLUENCE",
    options: ["division", "convergence", "distance", "stream", "peak"],
    correctAnswer: 1, // Index of 'convergence'
    explanation: "CONFLUENCE is the junction of two rivers, paths, or ideas coming together; convergence."
  },
  {
    id: "syn-20",
    type: "synonym",
    difficulty: "easy",
    targetWord: "ANTHOLOGY",
    options: ["single book", "compilation", "novel", "library", "scientific study"],
    correctAnswer: 1, // Index of 'compilation'
    explanation: "ANTHOLOGY is a published collection or compilation of poems, stories, or writings."
  },
  {
    id: "syn-21",
    type: "synonym",
    difficulty: "easy",
    targetWord: "HEARTH",
    options: ["chimney", "fireside", "heart", "kitchen", "floor"],
    correctAnswer: 1, // Index of 'fireside'
    explanation: "HEARTH refers to the floor of a fireplace or the fireside, traditionally representing home."
  },
  {
    id: "syn-22",
    type: "synonym",
    difficulty: "medium",
    targetWord: "IMPLICATE",
    options: ["exonerate", "incriminate", "suggest", "hide", "capture"],
    correctAnswer: 1, // Index of 'incriminate'
    explanation: "IMPLICATE means to show or suggest that someone is involved in a crime; incriminate."
  },
  {
    id: "syn-23",
    type: "synonym",
    difficulty: "easy",
    targetWord: "HILARITY",
    options: ["sorrow", "merriment", "quietness", "joke", "relief"],
    correctAnswer: 1, // Index of 'merriment'
    explanation: "HILARITY means extreme amusement, laughter, or merriment."
  },
  {
    id: "syn-24",
    type: "synonym",
    difficulty: "easy",
    targetWord: "DOCILE",
    options: ["stubborn", "submissive", "wild", "intelligent", "gentle"],
    correctAnswer: 1, // Index of 'submissive'
    explanation: "DOCILE means ready to accept control or instruction; submissive and manageable."
  },
  {
    id: "syn-25",
    type: "synonym",
    difficulty: "medium",
    targetWord: "BOURGEOIS",
    options: ["aristocratic", "middle-class", "impoverished", "rebellious", "traditional"],
    correctAnswer: 1, // Index of 'middle-class'
    explanation: "BOURGEOIS refers to the middle class, often associated with conventional standards."
  },
  {
    id: "syn-26",
    type: "synonym",
    difficulty: "easy",
    targetWord: "WRETCHED",
    options: ["joyful", "miserable", "wealthy", "sickly", "angry"],
    correctAnswer: 1, // Index of 'miserable'
    explanation: "WRETCHED means in a very unhappy or unfortunate state; miserable."
  },
  {
    id: "syn-27",
    type: "synonym",
    difficulty: "easy",
    targetWord: "SERF",
    options: ["lord", "peasant", "soldier", "merchant", "priest"],
    correctAnswer: 1, // Index of 'peasant'
    explanation: "SERF is an agricultural laborer or medieval peasant bound under the feudal system."
  },
  {
    id: "syn-28",
    type: "synonym",
    difficulty: "hard",
    targetWord: "LOQUACIOUS",
    options: ["silent", "garrulous", "mysterious", "hostile", "intelligent"],
    correctAnswer: 1, // garrulous
    explanation: "LOQUACIOUS means tending to talk a great deal; talkative or garrulous."
  },
  {
    id: "syn-29",
    type: "synonym",
    difficulty: "hard",
    targetWord: "EPHEMERAL",
    options: ["eternal", "transient", "substantial", "glowing", "ancient"],
    correctAnswer: 1, // transient
    explanation: "EPHEMERAL means lasting for a very short time; transient or fleeting."
  },
  {
    id: "syn-30",
    type: "synonym",
    difficulty: "hard",
    targetWord: "UBIQUITOUS",
    options: ["rare", "omnipresent", "hidden", "ancient", "dangerous"],
    correctAnswer: 1, // omnipresent
    explanation: "UBIQUITOUS means present, appearing, or found everywhere; omnipresent."
  },

  // --- ANALOGIES ---
  {
    id: "ana-1",
    type: "analogy",
    difficulty: "medium",
    stem: "PLIABLE : BEND",
    options: [
      "rigid : break",
      "fragile : shatter",
      "heavy : carry",
      "liquid : freeze",
      "transparent : hide"
    ],
    correctAnswer: 1, // fragile : shatter
    explanation: "Characteristic Quality / Result relationship: A PLIABLE object easily BENDS; a fragile object easily SHATTERS.",
    analogyType: "Characteristic Result / Propensity"
  },
  {
    id: "ana-2",
    type: "analogy",
    difficulty: "hard",
    stem: "ENERVATE : ENERGY",
    options: [
      "hydrate : water",
      "pacify : anger",
      "dehydrate : moisture",
      "educate : knowledge",
      "reinforce : strength"
    ],
    correctAnswer: 2, // dehydrate : moisture
    explanation: "Action / Deprivation relationship: To ENERVATE is to deprive of ENERGY; to dehydrate is to deprive of moisture.",
    analogyType: "Deprivation / Lack of"
  },
  {
    id: "ana-3",
    type: "analogy",
    difficulty: "hard",
    stem: "CONVALESCENCE : ILLNESS",
    options: [
      "study : test",
      "practice : game",
      "rehabilitation : injury",
      "vacation : work",
      "dinner : hunger"
    ],
    correctAnswer: 2, // rehabilitation : injury
    explanation: "Recovery process relationship: CONVALESCENCE is the period of recovery following an ILLNESS; rehabilitation is the period of recovery following an injury.",
    analogyType: "Process of Recovery"
  },
  {
    id: "ana-4",
    type: "analogy",
    difficulty: "hard",
    stem: "PUGNACIOUS : PEACE",
    options: [
      "friendly : warmth",
      "stubborn : flexibility",
      "generous : wealth",
      "cowardly : fear",
      "honest : truth"
    ],
    correctAnswer: 1, // stubborn : flexibility
    explanation: "Antonymic Quality relationship: A PUGNACIOUS person lacks PEACE; a stubborn person lacks flexibility.",
    analogyType: "Lack of Characteristic"
  },
  {
    id: "ana-5",
    type: "analogy",
    difficulty: "medium",
    stem: "CIRCUMSPECT : RISK",
    options: [
      "brave : danger",
      "frugal : spending",
      "active : movement",
      "gullible : belief",
      "meticulous : detail"
    ],
    correctAnswer: 1, // frugal : spending
    explanation: "Avoidance relationship: A CIRCUMSPECT (cautious) person avoids RISK; a frugal person avoids lavish spending.",
    analogyType: "Behavioral Avoidance"
  },
  {
    id: "ana-6",
    type: "analogy",
    difficulty: "medium",
    stem: "LADEN : CARGO",
    options: [
      "empty : void",
      "soaked : water",
      "heavy : scale",
      "clean : soap",
      "expensive : price"
    ],
    correctAnswer: 1, // soaked : water
    explanation: "State of Fullness / Saturation: Something LADEN is weighed down/filled with CARGO; something soaked is filled/saturated with water.",
    analogyType: "Saturation / Filled With"
  },
  {
    id: "ana-7",
    type: "analogy",
    difficulty: "easy",
    stem: "ANTHOLOGY : STORIES",
    options: [
      "galaxy : stars",
      "actor : play",
      "recipe : ingredients",
      "orchard : trees",
      "atlas : maps"
    ],
    correctAnswer: 4, // atlas : maps
    explanation: "Bound Collection relationship: An ANTHOLOGY is a bound collection of STORIES; an atlas is a bound collection of maps.",
    analogyType: "Collection / Grouping"
  },
  {
    id: "ana-8",
    type: "analogy",
    difficulty: "medium",
    stem: "HEARTH : HOME",
    options: [
      "throne : monarchy",
      "office : business",
      "stage : theater",
      "classroom : school",
      "street : city"
    ],
    correctAnswer: 0, // throne : monarchy
    explanation: "Symbolic Representation relationship: A HEARTH is a traditional symbol of HOME; a throne is the symbol of a monarchy.",
    analogyType: "Symbol to Concept"
  },
  {
    id: "ana-9",
    type: "analogy",
    difficulty: "easy",
    stem: "SERF : LORD",
    options: [
      "captain : crew",
      "teacher : student",
      "subject : king",
      "doctor : patient",
      "writer : editor"
    ],
    correctAnswer: 2, // subject : king
    explanation: "Subordinate / Ruler relationship: A SERF is a feudal subordinate ruled by a LORD; a subject is a citizen ruled by a king.",
    analogyType: "Hierarchy / Subordination"
  },
  {
    id: "ana-10",
    type: "analogy",
    difficulty: "medium",
    stem: "FLUMMOX : CONFUSION",
    options: [
      "soothe : anger",
      "terrify : fear",
      "educate : ignorance",
      "fatigue : sleep",
      "console : grief"
    ],
    correctAnswer: 1, // terrify : fear
    explanation: "Cause and Effect relationship: To FLUMMOX someone is to induce CONFUSION in them; to terrify someone is to induce fear in them.",
    analogyType: "Action to Resulting Emotion"
  },
  {
    id: "ana-11",
    type: "analogy",
    difficulty: "medium",
    stem: "DOCILE : LEAD",
    options: [
      "stubborn : persuade",
      "gullible : deceive",
      "volatile : stabilize",
      "intelligent : teach",
      "fragile : break"
    ],
    correctAnswer: 1, // gullible : deceive
    explanation: "Susceptibility relationship: A DOCILE person is easy to LEAD; a gullible person is easy to deceive.",
    analogyType: "Trait to Susceptibility"
  },
  {
    id: "ana-12",
    type: "analogy",
    difficulty: "medium",
    stem: "CONFLUENCE : STREAMS",
    options: [
      "intersection : roads",
      "division : paths",
      "bridge : rivers",
      "detour : highways",
      "tunnel : mountains"
    ],
    correctAnswer: 0, // intersection : roads
    explanation: "Meeting point relationship: A CONFLUENCE is the meeting junction of STREAMS; an intersection is the meeting junction of roads.",
    analogyType: "Junction / Convergence"
  },
  {
    id: "ana-13",
    type: "analogy",
    difficulty: "hard",
    stem: "IMPLICATE : EXONERATE",
    options: [
      "indict : accuse",
      "blame : forgive",
      "convict : sentence",
      "arrest : escape",
      "trust : doubt"
    ],
    correctAnswer: 1, // blame : forgive
    explanation: "Antonyms / Legal opposites: IMPLICATE (incriminate) and EXONERATE (clear of fault) are opposites; blame and forgive are opposites.",
    analogyType: "Antonyms"
  },
  {
    id: "ana-14",
    type: "analogy",
    difficulty: "hard",
    stem: "PRETENTIOUS : MODESTY",
    options: [
      "courageous : fearlessness",
      "mendacious : honesty",
      "stingy : wealth",
      "naive : innocence",
      "polite : manners"
    ],
    correctAnswer: 1, // mendacious : honesty
    explanation: "Lack of Trait relationship: A PRETENTIOUS person lacks MODESTY; a mendacious (lying) person lacks honesty.",
    analogyType: "Lack of Trait"
  },
  {
    id: "ana-15",
    type: "analogy",
    difficulty: "easy",
    stem: "PLUNDERING : THIEF",
    options: [
      "teaching : instructor",
      "prosecuting : defendant",
      "navigating : passenger",
      "farming : crop",
      "singing : song"
    ],
    correctAnswer: 0, // teaching : instructor
    explanation: "Primary Action to Agent: PLUNDERING is the primary action performed by a THIEF; teaching is the primary action performed by an instructor.",
    analogyType: "Action to Agent"
  },
  {
    id: "ana-16",
    type: "analogy",
    difficulty: "hard",
    stem: "SCALPEL : SURGEON",
    options: [
      "gavel : judge",
      "canvas : painter",
      "car : driver",
      "microscope : biologist",
      "pen : reader"
    ],
    correctAnswer: 0, // gavel : judge
    explanation: "Symbolic / Professional Tool to Agent: A SCALPEL is the defining surgical tool of a SURGEON; a gavel is the defining tool of a judge.",
    analogyType: "Tool to User"
  },
  {
    id: "ana-17",
    type: "analogy",
    difficulty: "medium",
    stem: "SPARK : BLAZE",
    options: [
      "drizzle : downpour",
      "smoke : fire",
      "ice : snow",
      "breeze : mountain",
      "wave : ocean"
    ],
    correctAnswer: 0, // drizzle : downpour
    explanation: "Degree of Intensity / Initial Stage: A SPARK is a minor precursor that can grow into a BLAZE; a drizzle is a light rainfall precursor to a downpour.",
    analogyType: "Degree of Intensity"
  }
];
