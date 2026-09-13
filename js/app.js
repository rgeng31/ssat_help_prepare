// IndexedDB persistence helpers for local FileSystemFileHandle
const IDB_NAME = 'ssat_vocab_db';
const IDB_STORE = 'handles';

function getStoredFileHandle() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const getReq = store.get('csv_handle');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

function storeFileHandle(handle) {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(handle, 'csv_handle');
        tx.oncomplete = () => resolve(true);
      };
      req.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
}
const SSAT_QUESTIONS = [
  {
    id: "ssat-syn-1",
    type: "synonym",
    difficulty: "easy",
    targetWord: "PLIABLE",
    options: ["rigid", "stubborn", "flexible", "fragile", "modern"],
    correctAnswer: 2,
    explanation: "PLIABLE means easily bent or flexible."
  },
  {
    id: "ssat-syn-2",
    type: "synonym",
    difficulty: "medium",
    targetWord: "ENERVATE",
    options: ["energize", "weaken", "excite", "clarify", "insult"],
    correctAnswer: 1,
    explanation: "ENERVATE means to cause someone to feel drained of energy or vitality; to weaken."
  },
  {
    id: "ssat-syn-3",
    type: "synonym",
    difficulty: "hard",
    targetWord: "PRECIPITOUS",
    options: ["gradual", "steep", "cautious", "spacious", "harmful"],
    correctAnswer: 1,
    explanation: "PRECIPITOUS means dangerously high or steep."
  },
  {
    id: "ssat-syn-4",
    type: "synonym",
    difficulty: "medium",
    targetWord: "CIRCUMSPECT",
    options: ["careless", "cautious", "round", "transparent", "hasty"],
    correctAnswer: 1,
    explanation: "CIRCUMSPECT means wary and unwilling to take risks; cautious."
  },
  {
    id: "ssat-syn-5",
    type: "synonym",
    difficulty: "hard",
    targetWord: "FLUMMOX",
    options: ["perplex", "enlighten", "flatter", "construct", "pacify"],
    correctAnswer: 0,
    explanation: "FLUMMOX means to confuse or perplex someone greatly."
  },
  {
    id: "ssat-syn-6",
    type: "synonym",
    difficulty: "easy",
    targetWord: "MULTITUDE",
    options: ["scarcity", "horde", "loneliness", "segment", "poverty"],
    correctAnswer: 1,
    explanation: "MULTITUDE means a large number or host of people or things."
  },
  {
    id: "ssat-syn-7",
    type: "synonym",
    difficulty: "medium",
    targetWord: "PUGNACIOUS",
    options: ["combative", "friendly", "fearful", "slothful", "generous"],
    correctAnswer: 0,
    explanation: "PUGNACIOUS means eager or quick to argue, quarrel, or fight; combative."
  },
  {
    id: "ssat-syn-8",
    type: "synonym",
    difficulty: "hard",
    targetWord: "SUMPTUOUSNESS",
    options: ["poverty", "luxuriousness", "simplicity", "stinginess", "darkness"],
    correctAnswer: 1,
    explanation: "SUMPTUOUSNESS means splendid and expensive-looking state; luxuriousness."
  },
  {
    id: "ssat-syn-9",
    type: "synonym",
    difficulty: "medium",
    targetWord: "EXTRICATE",
    options: ["entangle", "free", "complicate", "accuse", "observe"],
    correctAnswer: 1,
    explanation: "EXTRICATE means to free someone or something from a constraint or difficulty."
  },
  {
    id: "ssat-syn-10",
    type: "synonym",
    difficulty: "easy",
    targetWord: "DOCILE",
    options: ["submissive", "rebellious", "wild", "clever", "harsh"],
    correctAnswer: 0,
    explanation: "DOCILE means ready to accept control or instruction; submissive."
  },
  {
    id: "ssat-ana-1",
    type: "analogy",
    difficulty: "easy",
    stem: "PLIABLE : BEND",
    options: ["rigid : break", "fragile : shatter", "heavy : carry", "liquid : freeze", "transparent : hide"],
    correctAnswer: 1,
    explanation: "Characteristic Result: A pliable item easily bends; a fragile item easily shatters.",
    analogyType: "Propensity / Characteristic Result"
  },
  {
    id: "ssat-ana-2",
    type: "analogy",
    difficulty: "medium",
    stem: "ENERVATE : STRENGTH",
    options: ["pacify : anger", "dampen : water", "illuminate : light", "enrich : wealth", "flatten : height"],
    correctAnswer: 0,
    explanation: "Antonymic Action: To enervate is to deprive of strength; to pacify is to deprive of anger.",
    analogyType: "Deprivation / Antonymic Action"
  },
  {
    id: "ssat-ana-3",
    type: "analogy",
    difficulty: "hard",
    stem: "PRECIPITOUS : SLOPE",
    options: ["torrid : temperature", "shallow : depth", "narrow : width", "quiet : volume", "vast : area"],
    correctAnswer: 0,
    explanation: "Degree / Extreme Quality: Precipitous describes an extreme slope; torrid describes an extreme temperature.",
    analogyType: "Degree of Intensity"
  },
  {
    id: "ssat-ana-4",
    type: "analogy",
    difficulty: "medium",
    stem: "CIRCUMSPECT : CAUTION",
    options: ["audacious : fear", "pugnacious : hostility", "docile : rebellion", "thrifty : waste", "frugal : luxury"],
    correctAnswer: 1,
    explanation: "Defining Characteristic: A circumspect person displays caution; a pugnacious person displays hostility.",
    analogyType: "Characteristic Trait"
  },
  {
    id: "ssat-ana-5",
    type: "analogy",
    difficulty: "hard",
    stem: "FLUMMOX : BEWILDER",
    options: ["mollify : irritate", "extricate : entangle", "elucidate : clarify", "subdue : empower", "enervate : energize"],
    correctAnswer: 2,
    explanation: "Synonyms: Flummox and bewilder are synonyms; elucidate and clarify are synonyms.",
    analogyType: "Synonym Relationship"
  },
  {
    id: "ssat-ana-6",
    type: "analogy",
    difficulty: "easy",
    stem: "ANTHOLOGY : POEMS",
    options: ["archipelago : islands", "team : coach", "library : building", "constellation : telescope", "forest : woodcutter"],
    correctAnswer: 0,
    explanation: "Part to Whole / Grouping: An anthology is a collection of poems; an archipelago is a collection of islands.",
    analogyType: "Item to Category / Collection"
  },
  {
    id: "ssat-ana-7",
    type: "analogy",
    difficulty: "medium",
    stem: "QUALM : DOUBT",
    options: ["solace : comfort", "hazard : safety", "praise : blame", "malice : kindness", "guile : honesty"],
    correctAnswer: 0,
    explanation: "Synonyms: A qualm is a feeling of doubt; solace is a feeling of comfort.",
    analogyType: "Synonym Relationship"
  },
  {
    id: "ssat-ana-8",
    type: "analogy",
    difficulty: "hard",
    stem: "FATUOUS : WISDOM",
    options: ["despicable : honor", "generous : charity", "cautious : care", "honest : truth", "meticulous : detail"],
    correctAnswer: 0,
    explanation: "Lack of Trait: Fatuous means lacking wisdom; despicable means lacking honor.",
    analogyType: "Absence / Deprivation of Quality"
  },
  {
    id: "ssat-ana-9",
    type: "analogy",
    difficulty: "easy",
    stem: "SCALPEL : SURGEON",
    options: ["gavel : judge", "book : reader", "canvas : gallery", "syringe : patient", "car : mechanic"],
    correctAnswer: 0,
    explanation: "Tool to Worker: A scalpel is a primary tool used by a surgeon; a gavel is used by a judge.",
    analogyType: "Tool to User"
  },
  {
    id: "ssat-ana-10",
    type: "analogy",
    difficulty: "medium",
    stem: "CONVALESCENCE : RECOVERY",
    options: ["incubation : development", "stagnation : progress", "recreation : fatigue", "vacation : work", "dormancy : activity"],
    correctAnswer: 0,
    explanation: "Process to Outcome: Convalescence is a period of recovery; incubation is a period of development.",
    analogyType: "Process and Purpose"
  }
];

class SSATApp {
  constructor() {
    // Application State
    this.currentQuestions = [];
    this.currentIndex = 0;
    this.userAnswers = new Map(); // questionId -> selectedIndex
    this.timerInterval = null;
    this.secondsRemaining = 30;
    this.quizMode = "instant"; // "instant" | "exam"
    
    // User Analytics & Vocab Bank State stored in localStorage
    this.stats = this.loadStats();
    this.customVocabCards = this.loadCustomVocabCards();
    this.lastGeneratedCustomSet = [];
    this.fileHandle = null;

    // Daily Vocab Deck Single-Card Navigation & Filter State
    this.dailyDeck = [];
    this.dailyIndex = 0;
    this.activeStatusFilter = "all";
    this.cardsAutoRefreshInterval = null;

    this.init();
  }

  async init() {
    this.bindEvents();

    // Restore saved CSV file handle from IndexedDB if available
    try {
      const savedHandle = await getStoredFileHandle();
      if (savedHandle) {
        const state = await savedHandle.queryPermission({ mode: 'readwrite' });
        if (state === 'granted' || (await savedHandle.requestPermission({ mode: 'readwrite' })) === 'granted') {
          this.fileHandle = savedHandle;
        }
      }
    } catch (e) {}

    await this.loadCSVOnStart();

    this.renderVocabCards();
    this.renderDailyVocabCards();
    this.renderAnalogyGuide();
    this.renderAnalytics();

    // Start 30s auto-refresh for Vocabulary Cards tab
    this.startCardsAutoRefresh();

    this.enrichMissingSynonyms();
  }

  async enrichMissingSynonyms() {
    let updatedCount = 0;
    const qGen = window.questionGenerator || (typeof questionGenerator !== 'undefined' ? questionGenerator : new QuestionGenerator());

    for (const card of this.customVocabCards) {
      if (!card.synonyms || card.synonyms.length === 0) {
        try {
          const syns = await qGen.fetchSynonymsDatamuse(card.word);
          if (syns && syns.length > 0) {
            card.synonyms = syns;
            updatedCount++;
          }
        } catch (e) {}
      }
    }

    if (updatedCount > 0) {
      this.saveCustomVocabCards();
      this.renderVocabCards();
    }
  }

  loadCustomVocabCards() {
    const saved = localStorage.getItem("ssat_custom_vocab_cards");
    if (saved) {
      try {
        let list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return list.filter(v => v && v.definition && !v.definition.startsWith("Definition unavailable") && !v.definition.includes("is a key SSAT vocabulary word"));
        }
      } catch (e) {}
    }
    return [];
  }

  async saveCustomVocabCards() {
    localStorage.setItem("ssat_custom_vocab_cards", JSON.stringify(this.customVocabCards));
    try {
      await this.syncCSVFile(false);
    } catch (err) {
      console.warn("CSV auto-sync failed:", err);
    }
  }

  async loadCSVOnStart() {
    try {
      const resp = await fetch('./vocabulary_bank.csv?t=' + Date.now());
      if (resp.ok) {
        const text = await resp.text();
        const parsed = this.parseCSVText(text);
        if (parsed.length > 0) {
          if (this.customVocabCards.length === 0) {
            this.customVocabCards = parsed;
          } else {
            parsed.forEach(c => {
              const existing = this.customVocabCards.find(v => v.word.toUpperCase() === c.word.toUpperCase());
              if (!existing) {
                this.customVocabCards.push(c);
              } else if (c.synonyms && c.synonyms.length > 0 && (!existing.synonyms || existing.synonyms.length === 0)) {
                existing.synonyms = c.synonyms;
              }
            });
          }
          localStorage.setItem("ssat_custom_vocab_cards", JSON.stringify(this.customVocabCards));
          this.renderVocabCards();
          this.renderDailyVocabCards();
        }
      }
    } catch (e) {}
  }

  startCardsAutoRefresh() {
    // 30-second periodic timer disabled: saving occurs instantly on every card update/modification.
    this.stopCardsAutoRefresh();
  }

  stopCardsAutoRefresh() {
    if (this.cardsAutoRefreshInterval) {
      clearInterval(this.cardsAutoRefreshInterval);
      this.cardsAutoRefreshInterval = null;
    }
  }

  async checkAndReloadCSV() {
    try {
      const resp = await fetch('./vocabulary_bank.csv?t=' + Date.now());
      if (resp.ok) {
        const text = await resp.text();
        const parsed = this.parseCSVText(text);
        if (parsed.length > 0) {
          let hasChanges = false;
          
          if (this.customVocabCards.length === 0) {
            this.customVocabCards = parsed;
            hasChanges = true;
          } else {
            parsed.forEach(c => {
              const existingIndex = this.customVocabCards.findIndex(v => v.word.toUpperCase() === c.word.toUpperCase());
              if (existingIndex === -1) {
                this.customVocabCards.push(c);
                hasChanges = true;
              } else {
                const existing = this.customVocabCards[existingIndex];
                if (c.definition && c.definition !== existing.definition && !c.definition.includes("(SSAT Vocabulary Word)")) {
                  existing.definition = c.definition;
                  hasChanges = true;
                }
                if (c.pos && c.pos !== existing.pos && c.pos !== 'Word') {
                  existing.pos = c.pos;
                  hasChanges = true;
                }
                if (c.phonetic && c.phonetic !== existing.phonetic) {
                  existing.phonetic = c.phonetic;
                  hasChanges = true;
                }
                if (c.synonyms && c.synonyms.length > 0 && JSON.stringify(c.synonyms) !== JSON.stringify(existing.synonyms)) {
                  existing.synonyms = c.synonyms;
                  hasChanges = true;
                }
                if (c.status && c.status !== existing.status) {
                  existing.status = c.status;
                  hasChanges = true;
                }
              }
            });
          }

          if (hasChanges) {
            localStorage.setItem("ssat_custom_vocab_cards", JSON.stringify(this.customVocabCards));
            
            // Only re-render if user is not actively editing a card
            const isEditing = document.querySelector(".edit-flashcard-form");
            if (!isEditing) {
              const currentSearch = document.getElementById("vocab-search-input") ? document.getElementById("vocab-search-input").value : "";
              this.renderVocabCards(currentSearch);
              this.renderDailyVocabCards();
            }
          }
        }
      }
    } catch (e) {
      console.warn("Auto CSV refresh error:", e);
    }
  }

  parseCSVText(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];
    
    const cards = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      const cleanCols = cols ? cols.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"')) : line.split(',');
      if (cleanCols && cleanCols.length >= 4) {
        const word = cleanCols[0].trim().toUpperCase();
        if (word && word !== "WORD") {
          const pos = cleanCols[1] ? cleanCols[1].trim() : 'Word';
          const phonetic = cleanCols[2] ? cleanCols[2].trim() : '';
          const definition = cleanCols[3] ? cleanCols[3].trim() : '';
          const synonyms = cleanCols[4] ? cleanCols[4].split(';').map(s => s.trim()).filter(Boolean) : [];
          
          let antonyms = [];
          let example = '';
          let dateAdded = '';
          let rawMarking = '';
          let rawStatus = '';

          if (cleanCols.length >= 10) {
            antonyms = cleanCols[5] ? cleanCols[5].split(';').map(s => s.trim()).filter(Boolean) : [];
            example = cleanCols[6] ? cleanCols[6].trim() : '';
            dateAdded = cleanCols[7] ? cleanCols[7].trim() : '';
            rawMarking = cleanCols[8] ? cleanCols[8].trim() : '';
            rawStatus = cleanCols[9] ? cleanCols[9].trim().toLowerCase() : '';
          } else {
            dateAdded = cleanCols[5] ? cleanCols[5].trim() : '';
            rawStatus = cleanCols[6] ? cleanCols[6].trim().toLowerCase() : '';
          }

          if (!dateAdded) {
            dateAdded = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          }

          let status = 'uncategorized';
          if (rawStatus === 'learning' || rawMarking === "Don't know" || rawMarking === "learning") {
            status = 'learning';
          } else if (rawStatus === 'mastered' || rawMarking === "Know" || rawMarking === "mastered") {
            status = 'mastered';
          } else {
            status = 'uncategorized';
          }

          cards.push({
            word: word,
            pos: pos,
            phonetic: phonetic,
            definition: definition,
            synonyms: synonyms,
            antonyms: antonyms,
            example: example,
            dateAdded: dateAdded,
            status: status
          });
        }
      }
    }
    return cards;
  }

  // Load / Save Stats
  loadStats() {
    const saved = localStorage.getItem("ssat_verbal_stats");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      totalSolved: 0,
      totalCorrect: 0,
      streak: 0,
      missedQuestions: []
    };
  }

  saveStats() {
    localStorage.setItem("ssat_verbal_stats", JSON.stringify(this.stats));
  }

  // Event Listener Bindings
  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll(".nav-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        const targetId = tab.dataset.target;
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
        
        tab.classList.add("active");
        document.getElementById(targetId).classList.add("active");

        if (targetId === "pane-cards") {
          this.startCardsAutoRefresh();
          this.checkAndReloadCSV();
        } else {
          this.stopCardsAutoRefresh();
        }
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById("theme-toggle-btn");
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      themeBtn.innerHTML = newTheme === "light" 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
    });

    // Print Button
    document.getElementById("print-btn").addEventListener("click", () => {
      const set = (this.lastGeneratedCustomSet && this.lastGeneratedCustomSet.length > 0)
        ? this.lastGeneratedCustomSet
        : (this.currentQuestions && this.currentQuestions.length > 0)
          ? this.currentQuestions
          : SSAT_QUESTIONS;
      this.printCustomWorksheetPDF(set);
    });

    // Start Quiz Button
    document.getElementById("start-quiz-btn").addEventListener("click", () => {
      this.startQuiz();
    });

    // Quiz Controls
    document.getElementById("next-q-btn").addEventListener("click", () => {
      this.nextQuestion();
    });

    document.getElementById("prev-q-btn").addEventListener("click", () => {
      this.prevQuestion();
    });

    // Audio Speech Pronunciation
    document.getElementById("speak-word-btn").addEventListener("click", () => {
      const q = this.currentQuestions[this.currentIndex];
      if (q) {
        const wordToSpeak = q.targetWord || q.stem.split(":")[0].trim();
        this.speakWord(wordToSpeak);
      }
    });

    // Retry Quiz
    document.getElementById("retry-quiz-btn").addEventListener("click", () => {
      this.startQuiz();
    });

    // Custom Generator Controls
    document.getElementById("generate-custom-btn").addEventListener("click", () => {
      this.handleCustomGeneration();
    });

    const pickRandomBtn = document.getElementById("pick-random-bank-words-btn");
    if (pickRandomBtn) {
      pickRandomBtn.addEventListener("click", () => {
        this.handlePickRandomBankWords();
      });
    }

    document.getElementById("load-sample-words-btn").addEventListener("click", () => {
      const sampleText = "PLIABLE, ENERVATE, FLUMMOX, EXTRICATE, MULTITUDE, PLUNDERING, PRECIPITOUS, SUMPTUOUSNESS, QUALM, INFAMY, FATUOUS, CONVALESCENCE, REPROACH, PUGNACIOUS, TEMPORAL, CIRCUMSPECT, LADEN, PRETENTIOUS, CONFLUENCE, ANTHOLOGY, HEARTH, IMPLICATE, HILARITY, DOCILE, BOURGEOIS, WRETCHED, SERF";
      document.getElementById("custom-words-input").value = sampleText;
    });

    document.getElementById("clear-custom-btn").addEventListener("click", () => {
      document.getElementById("custom-words-input").value = "";
      document.getElementById("custom-questions-output").style.display = "none";
      const pickFeedback = document.getElementById("random-pick-feedback");
      if (pickFeedback) pickFeedback.style.display = "none";
    });

    // Vocab Bank Add & Clear Controls
    const addVocabPanel = document.getElementById("add-vocab-panel");
    document.getElementById("open-add-vocab-btn").addEventListener("click", () => {
      addVocabPanel.style.display = "block";
      document.getElementById("vocab-words-input").focus();
    });

    document.getElementById("close-add-vocab-btn").addEventListener("click", () => {
      addVocabPanel.style.display = "none";
    });

    document.getElementById("cancel-add-vocab-btn").addEventListener("click", () => {
      addVocabPanel.style.display = "none";
    });

    document.getElementById("save-vocab-cards-btn").addEventListener("click", () => {
      this.handleDirectVocabAdd();
    });

    const syncCsvBtn = document.getElementById("sync-csv-btn");
    if (syncCsvBtn) {
      syncCsvBtn.addEventListener("click", () => {
        this.syncCSVFile();
      });
    }

    document.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.activeStatusFilter = chip.dataset.statusFilter;
        this.renderVocabCards(document.getElementById("vocab-search-input") ? document.getElementById("vocab-search-input").value : "");
      });
    });

    const prevDailyBtn = document.getElementById("prev-daily-card-btn");
    if (prevDailyBtn) {
      prevDailyBtn.addEventListener("click", () => {
        this.prevDailyCard();
      });
    }

    const nextDailyBtn = document.getElementById("next-daily-card-btn");
    if (nextDailyBtn) {
      nextDailyBtn.addEventListener("click", () => {
        this.nextDailyCard();
      });
    }

    const reviewMissedBtn = document.getElementById("review-missed-btn");
    if (reviewMissedBtn) {
      reviewMissedBtn.addEventListener("click", () => {
        if (this.stats.missedQuestions && this.stats.missedQuestions.length > 0) {
          this.startQuiz(this.stats.missedQuestions);
        } else {
          alert("No missed questions in queue to review!");
        }
      });
    }

    document.getElementById("clear-vocab-bank-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all cards from your Vocab Bank?")) {
        this.customVocabCards = [];
        this.saveCustomVocabCards();
        this.renderVocabCards();
      }
    });

    // Vocab Search Filter
    document.getElementById("vocab-search-input").addEventListener("input", (e) => {
      this.renderVocabCards(e.target.value);
    });

    // Keyboard Navigation Shortcuts
    document.addEventListener("keydown", (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      
      const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "a": 0, "b": 1, "c": 2, "d": 3, "e": 4 };
      const lowerKey = e.key.toLowerCase();

      if (lowerKey in keyMap) {
        this.selectOption(keyMap[lowerKey]);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        this.nextQuestion();
      } else if (e.key === "ArrowLeft") {
        this.prevQuestion();
      }
    });
  }

  // Speech Synthesis Helper
  speakWord(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Start / Reset Quiz
  startQuiz(customSet = null) {
    document.getElementById("quiz-card-wrapper").style.display = "block";
    document.getElementById("quiz-results-wrapper").style.display = "none";

    const typeFilter = document.getElementById("select-type").value;
    const diffFilter = document.getElementById("select-difficulty").value;
    const count = parseInt(document.getElementById("select-count").value, 10);
    this.quizMode = document.getElementById("select-mode").value;

    let pool = customSet ? customSet : (this.lastGeneratedCustomSet && this.lastGeneratedCustomSet.length > 0 ? this.lastGeneratedCustomSet : SSAT_QUESTIONS);

    if (pool.length === 0) {
      alert("No practice questions loaded. Please generate custom questions in the Custom Generator tab.");
      document.querySelector('[data-target="pane-custom"]').click();
      return;
    }

    // Apply type filter
    if (typeFilter !== "mixed") {
      pool = pool.filter(q => q.type === typeFilter);
    }

    // Apply difficulty filter
    if (diffFilter !== "all") {
      pool = pool.filter(q => q.difficulty === diffFilter);
    }

    // Shuffle pool
    pool = this.shuffleArray(pool);

    // Limit count
    this.currentQuestions = pool.slice(0, count);
    this.currentIndex = 0;
    this.userAnswers.clear();

    if (this.currentQuestions.length === 0) {
      alert("No questions found matching your selected filters.");
      return;
    }

    this.renderCurrentQuestion();
  }

  // Render Question
  renderCurrentQuestion() {
    const q = this.currentQuestions[this.currentIndex];
    if (!q) return;

    // Reset Timer
    this.startTimer(30);

    // Update Progress
    const total = this.currentQuestions.length;
    const progressPercent = ((this.currentIndex + 1) / total) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;
    document.getElementById("question-progress-text").textContent = `Question ${this.currentIndex + 1} of ${total}`;

    // Update Badges
    const badgeType = document.getElementById("badge-type");
    badgeType.textContent = q.type.toUpperCase();
    badgeType.className = `badge badge-${q.type}`;

    const badgeDiff = document.getElementById("badge-diff");
    badgeDiff.textContent = q.difficulty ? q.difficulty.toUpperCase() : "MEDIUM";
    badgeDiff.className = `badge badge-${q.difficulty || "medium"}`;

    // Question Instruction & Stem
    const instructionEl = document.getElementById("question-instruction");
    const stemEl = document.getElementById("question-stem");

    if (q.type === "synonym") {
      instructionEl.textContent = "Choose the word or phrase closest in meaning to the word in capital letters.";
      stemEl.textContent = q.targetWord;
    } else {
      instructionEl.textContent = "Choose the pair that best expresses a relationship similar to the original pair.";
      stemEl.textContent = q.stem;
    }

    // Render 5 Choice Buttons (A, B, C, D, E)
    const optionsGrid = document.getElementById("options-grid");
    optionsGrid.innerHTML = "";
    const letters = ["A", "B", "C", "D", "E"];

    const hasAnswered = this.userAnswers.has(q.id);
    const selectedIdx = this.userAnswers.get(q.id);

    q.options.forEach((optText, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      
      let btnContent = `<div class="option-key">${letters[i]}</div><span>${optText}</span>`;
      btn.innerHTML = btnContent;

      if (hasAnswered) {
        btn.classList.add("disabled");
        if (this.quizMode === "instant") {
          if (i === q.correctAnswer) {
            btn.classList.add("correct");
          } else if (i === selectedIdx) {
            btn.classList.add("incorrect");
          }
        } else if (i === selectedIdx) {
          btn.classList.add("selected");
        }
      } else {
        btn.addEventListener("click", () => this.selectOption(i));
      }

      optionsGrid.appendChild(btn);
    });

    // Explanation Box
    const expBox = document.getElementById("explanation-box");
    if (hasAnswered && this.quizMode === "instant") {
      expBox.style.display = "block";
      document.getElementById("exp-text").textContent = q.explanation;
    } else {
      expBox.style.display = "none";
    }

    // Prev / Next Controls State
    document.getElementById("prev-q-btn").disabled = (this.currentIndex === 0);
    const nextBtn = document.getElementById("next-q-btn");
    if (this.currentIndex === total - 1) {
      nextBtn.innerHTML = 'Finish Quiz <i class="fa-solid fa-check"></i>';
    } else {
      nextBtn.innerHTML = 'Next Question <i class="fa-solid fa-arrow-right"></i>';
    }
  }

  // Select Option
  selectOption(index) {
    const q = this.currentQuestions[this.currentIndex];
    if (!q || this.userAnswers.has(q.id)) return;

    this.userAnswers.set(q.id, index);
    this.stopTimer();

    // Re-render to show feedback
    this.renderCurrentQuestion();
  }

  // Next Question / Finish Test
  nextQuestion() {
    if (this.currentIndex < this.currentQuestions.length - 1) {
      this.currentIndex++;
      this.renderCurrentQuestion();
    } else {
      this.finishQuiz();
    }
  }

  // Previous Question
  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.renderCurrentQuestion();
    }
  }

  // Timer Control
  startTimer(seconds) {
    this.stopTimer();
    this.secondsRemaining = seconds;
    const timerDisplay = document.getElementById("timer-count");
    timerDisplay.textContent = `00:${this.secondsRemaining < 10 ? '0' : ''}${this.secondsRemaining}`;

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      timerDisplay.textContent = `00:${this.secondsRemaining < 10 ? '0' : ''}${this.secondsRemaining}`;
      
      if (this.secondsRemaining <= 0) {
        this.stopTimer();
        // Auto select no answer if timer runs out
        const q = this.currentQuestions[this.currentIndex];
        if (q && !this.userAnswers.has(q.id)) {
          this.userAnswers.set(q.id, -1);
          this.renderCurrentQuestion();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Finish Quiz Results
  finishQuiz() {
    this.stopTimer();
    document.getElementById("quiz-card-wrapper").style.display = "none";
    document.getElementById("quiz-results-wrapper").style.display = "block";

    let correctCount = 0;
    const total = this.currentQuestions.length;

    this.currentQuestions.forEach(q => {
      const chosen = this.userAnswers.get(q.id);
      if (chosen === q.correctAnswer) {
        correctCount++;
      } else {
        // Track missed questions
        if (!this.stats.missedQuestions.some(mq => mq.id === q.id)) {
          this.stats.missedQuestions.push(q);
        }
      }
    });

    const percent = Math.round((correctCount / total) * 100);

    // Update Stats
    this.stats.totalSolved += total;
    this.stats.totalCorrect += correctCount;
    if (percent >= 80) {
      this.stats.streak++;
    } else {
      this.stats.streak = 0;
    }
    this.saveStats();
    this.renderAnalytics();

    // Render Score UI
    document.getElementById("result-score-num").textContent = `${percent}%`;
    document.getElementById("result-correct-count").textContent = correctCount;
    document.getElementById("result-total-count").textContent = total;

    const headline = document.getElementById("result-headline");
    if (percent >= 90) {
      headline.textContent = "Master Level! Outstanding!";
      if (typeof confetti === "function") confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (percent >= 70) {
      headline.textContent = "Great Job! Solid SSAT Performance!";
    } else {
      headline.textContent = "Keep Practicing!";
    }
  }

  // Pick random n words from Vocabulary Bank for Custom Generator
  handlePickRandomBankWords() {
    const feedbackEl = document.getElementById("random-pick-feedback");
    const countInput = document.getElementById("random-word-count-input");
    const filterSelect = document.getElementById("random-bank-status-filter");
    
    let requestedCount = parseInt(countInput ? countInput.value : 10, 10);
    if (isNaN(requestedCount) || requestedCount <= 0) requestedCount = 10;

    const filterStatus = filterSelect ? filterSelect.value : 'all';

    let availableCards = [...this.customVocabCards];
    if (filterStatus === 'learning') {
      availableCards = availableCards.filter(v => v.status === 'learning');
    } else if (filterStatus === 'uncategorized') {
      availableCards = availableCards.filter(v => !v.status || v.status === 'uncategorized');
    } else if (filterStatus === 'mastered') {
      availableCards = availableCards.filter(v => v.status === 'mastered');
    }

    if (availableCards.length === 0) {
      if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.color = "#ef4444";
        const labelText = filterSelect ? filterSelect.options[filterSelect.selectedIndex].text : filterStatus;
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> No saved words found in your Vocabulary Bank matching "${labelText}". Add words in the Vocabulary Cards tab first!`;
      }
      return;
    }

    // Shuffle array (Fisher-Yates)
    const shuffled = [...availableCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedCards = shuffled.slice(0, Math.min(requestedCount, shuffled.length));
    const wordListStr = selectedCards.map(c => c.word).join(", ");

    const inputArea = document.getElementById("custom-words-input");
    if (inputArea) {
      inputArea.value = wordListStr;
    }

    if (feedbackEl) {
      feedbackEl.style.display = "block";
      feedbackEl.style.color = "#22c55e";
      feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Randomly selected ${selectedCards.length} word(s) from your Vocabulary Bank! Click <strong>Generate SSAT Questions</strong> below to build your practice test.`;
    }
  }

  // Custom Generator Handler
  async handleCustomGeneration() {
    const rawText = document.getElementById("custom-words-input").value;
    const qGen = window.questionGenerator || (typeof questionGenerator !== 'undefined' ? questionGenerator : new QuestionGenerator());
    const parsedWords = qGen.parseInput(rawText);

    if (parsedWords.length === 0) {
      alert("Please enter or paste at least one vocabulary word.");
      return;
    }

    const generateBtn = document.getElementById("generate-custom-btn");
    const originalBtnHTML = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Questions...';

    try {
      const generatedSet = await qGen.generateSet(parsedWords);
      this.lastGeneratedCustomSet = generatedSet;

      // Save generated words into customVocabCards
      const currentDateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      generatedSet.forEach(q => {
        const word = (q.targetWord || q.stem || '').split(':')[0].trim().toUpperCase();
        if (word && !this.customVocabCards.some(v => v.word.toUpperCase() === word)) {
          this.customVocabCards.push({
            word: word,
            definition: q.explanation || 'Custom Vocabulary Word',
            pos: q.type === 'synonym' ? 'Synonym' : 'Analogy',
            synonyms: q.options ? q.options.slice(0, 3) : [],
            dateAdded: currentDateStr
          });
        }
      });
      this.saveCustomVocabCards();
      this.renderVocabCards();
      
      // Display preview container
      const outputContainer = document.getElementById("custom-questions-output");
      outputContainer.style.display = "block";

      document.getElementById("custom-q-count").textContent = generatedSet.length;

      const listEl = document.getElementById("custom-questions-list");
      listEl.innerHTML = "";

      // Render interactive question cards (NO answer key spoiled upfront)
      generatedSet.forEach((q, idx) => {
        const card = document.createElement("div");
        card.className = "quiz-container";
        card.style.marginBottom = "1.5rem";
        card.style.padding = "1.75rem";
        
        const choiceLetters = ["A", "B", "C", "D", "E"];
        
        let optionsHTML = "";
        q.options.forEach((optText, i) => {
          optionsHTML += `
            <button class="option-btn custom-opt-btn" data-qidx="${idx}" data-oidx="${i}">
              <div class="option-key">${choiceLetters[i]}</div>
              <span>${optText}</span>
            </button>
          `;
        });

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span style="font-weight:700; color:var(--text-secondary);">Question ${idx + 1} of ${generatedSet.length}</span>
            <span class="badge badge-${q.type}">${q.type.toUpperCase()}</span>
          </div>
          <div class="question-prompt-box" style="margin-bottom:1.25rem; padding:1rem;">
            <div class="question-instruction" style="font-size:0.8rem;">
              ${q.type === 'synonym' ? 'Choose the word closest in meaning to the word in capital letters.' : 'Choose the pair that best expresses a relationship similar to the original pair.'}
            </div>
            <div class="question-stem" style="font-size:1.6rem;">${q.targetWord || q.stem}</div>
          </div>
          <div class="options-grid" style="gap:0.75rem; margin-bottom:1rem;">
            ${optionsHTML}
          </div>
          <div id="custom-exp-${idx}" class="explanation-box" style="display:none; margin-bottom:0;">
            <div class="exp-title"><i class="fa-solid fa-circle-info"></i> Answer Explanation</div>
            <div class="exp-text">${q.explanation}</div>
          </div>
        `;

        // Attach choice click handlers
        card.querySelectorAll(".custom-opt-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const optIdx = parseInt(btn.dataset.oidx, 10);
            const allOptBtns = card.querySelectorAll(".custom-opt-btn");
            
            allOptBtns.forEach((b, i) => {
              b.classList.add("disabled");
              if (i === q.correctAnswer) {
                b.classList.add("correct");
              } else if (i === optIdx) {
                b.classList.add("incorrect");
              }
            });

            // Reveal explanation for this question
            const expEl = card.querySelector(`#custom-exp-${idx}`);
            if (expEl) expEl.style.display = "block";
          });
        });

        listEl.appendChild(card);
      });

      // Attach PDF print export handler
      const printPdfBtn = document.getElementById("print-custom-pdf-btn");
      printPdfBtn.onclick = () => this.printCustomWorksheetPDF(generatedSet);
    } catch (e) {
      console.error("Error generating set:", e);
      alert("An error occurred while generating questions. Please try again.");
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = originalBtnHTML;
    }
  }

  deleteSingleVocabCard(wordToDelete) {
    this.customVocabCards = this.customVocabCards.filter(v => v.word.toUpperCase() !== wordToDelete.toUpperCase());
    this.saveCustomVocabCards();
    this.renderVocabCards();
  }

  setCardStatus(word, status, keepFlipped = false) {
    const card = this.customVocabCards.find(v => v.word.toUpperCase() === word.toUpperCase());
    if (card) {
      card.status = status;
      this.saveCustomVocabCards();
      
      const inDaily = this.dailyDeck.find(v => v.word.toUpperCase() === word.toUpperCase());
      if (inDaily) inDaily.status = status;
      
      this.renderVocabCards(document.getElementById("vocab-search-input") ? document.getElementById("vocab-search-input").value : "");
      this.displayCurrentDailyCard(keepFlipped);
    }
  }

  updateVocabCard(originalWord, updatedFields) {
    const card = this.customVocabCards.find(v => v.word.toUpperCase() === originalWord.toUpperCase());
    if (card) {
      Object.assign(card, updatedFields);
      this.saveCustomVocabCards();
      
      const inDaily = this.dailyDeck.find(v => v.word.toUpperCase() === originalWord.toUpperCase());
      if (inDaily) Object.assign(inDaily, updatedFields);

      this.renderVocabCards(document.getElementById("vocab-search-input") ? document.getElementById("vocab-search-input").value : "");
      this.displayCurrentDailyCard();
    }
  }

  generateCSVContent() {
    const headers = [
      "Word",
      "Part of Speech",
      "Pronunciation",
      "Definition",
      "Synonyms",
      "Antonyms",
      "Example Sentence",
      "Date Added",
      "Marking",
      "Mastery Status"
    ];
    
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const getMarkingLabel = (status) => {
      if (status === 'learning') return "Don't know";
      if (status === 'mastered') return "Know";
      return "Uncategorized";
    };

    const rows = this.customVocabCards.map(v => [
      escapeCSV(v.word),
      escapeCSV(v.pos || 'Word'),
      escapeCSV(v.phonetic || ''),
      escapeCSV(v.definition || ''),
      escapeCSV(Array.isArray(v.synonyms) ? v.synonyms.join("; ") : (v.synonyms || '')),
      escapeCSV(Array.isArray(v.antonyms) ? v.antonyms.join("; ") : (v.antonyms || '')),
      escapeCSV(v.example || ''),
      escapeCSV(v.dateAdded || ''),
      escapeCSV(getMarkingLabel(v.status)),
      escapeCSV(v.status || 'uncategorized')
    ]);

    return [headers.map(h => `"${h}"`).join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  async syncCSVFile(promptIfUnlinked = true) {
    const csvContent = this.generateCSVContent();

    // 1. Try sending directly to local Python server endpoint to overwrite vocabulary_bank.csv on disk
    try {
      let resp = await fetch('/api/save-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'text/csv;charset=utf-8' },
        body: csvContent
      });
      if (!resp.ok) {
        resp = await fetch('http://127.0.0.1:8080/api/save-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'text/csv;charset=utf-8' },
          body: csvContent
        });
      }
      if (resp.ok) {
        const resData = await resp.json();
        if (resData.success) {
          console.log("[CSV Sync] Successfully saved vocabulary_bank.csv directly to disk.");
          return true;
        }
      }
    } catch (apiErr) {
      try {
        const resp = await fetch('http://127.0.0.1:8080/api/save-csv', {
          method: 'POST',
          headers: { 'Content-Type': 'text/csv;charset=utf-8' },
          body: csvContent
        });
        if (resp.ok) {
          const resData = await resp.json();
          if (resData.success) {
            console.log("[CSV Sync] Successfully saved vocabulary_bank.csv directly to disk.");
            return true;
          }
        }
      } catch (err2) {
        console.warn("[CSV Sync] Server save-csv API endpoint unreachable or failed, falling back:", err2);
      }
    }

    if ('showSaveFilePicker' in window) {
      try {
        if (!this.fileHandle) {
          if (!promptIfUnlinked) return false;
          this.fileHandle = await window.showSaveFilePicker({
            suggestedName: 'vocabulary_bank.csv',
            types: [{
              description: 'CSV File',
              accept: { 'text/csv': ['.csv'] }
            }]
          });
          if (this.fileHandle) {
            await storeFileHandle(this.fileHandle);
          }
        }

        if (this.fileHandle) {
          const perm = await this.fileHandle.queryPermission({ mode: 'readwrite' });
          if (perm !== 'granted') {
            const req = await this.fileHandle.requestPermission({ mode: 'readwrite' });
            if (req !== 'granted') {
              throw new Error('Permission not granted');
            }
          }
          const writable = await this.fileHandle.createWritable();
          await writable.write(csvContent);
          await writable.close();
          return true;
        }
      } catch (err) {
        if (err.name === 'AbortError') return false;
        console.warn("Direct file save error, falling back to download:", err);
        if (promptIfUnlinked) {
          this.triggerCSVDownload(csvContent);
          return true;
        }
      }
    } else {
      if (promptIfUnlinked) {
        this.triggerCSVDownload(csvContent);
        return true;
      }
    }
    return false;
  }

  triggerCSVDownload(csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vocabulary_bank.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Handle direct vocabulary input in Vocab Bank tab
  async handleDirectVocabAdd() {
    const rawInput = document.getElementById("vocab-words-input") ? document.getElementById("vocab-words-input").value : "";
    const qGen = window.questionGenerator || (typeof questionGenerator !== 'undefined' ? questionGenerator : new QuestionGenerator());
    let parsedWords = qGen.parseInput(rawInput);

    if (parsedWords.length === 0 && rawInput.trim().length > 0) {
      parsedWords = rawInput.split(/[\n,;:]+/).map(w => w.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '').toUpperCase()).filter(w => w.length > 1);
    }

    const feedbackEl = document.getElementById("add-vocab-feedback");

    if (parsedWords.length === 0) {
      if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.background = "rgba(239, 68, 68, 0.15)";
        feedbackEl.style.color = "#ef4444";
        feedbackEl.style.border = "1px solid rgba(239, 68, 68, 0.3)";
        feedbackEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter or paste at least one valid vocabulary word.';
      } else {
        alert("Please enter at least one valid vocabulary word.");
      }
      return;
    }

    const saveBtn = document.getElementById("save-vocab-cards-btn");
    const origHTML = saveBtn ? saveBtn.innerHTML : 'Generate & Save Flashcards';
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching Definitions...';
    }

    if (feedbackEl) {
      feedbackEl.style.display = "block";
      feedbackEl.style.background = "rgba(99, 102, 241, 0.15)";
      feedbackEl.style.color = "var(--accent-primary)";
      feedbackEl.style.border = "1px solid rgba(99, 102, 241, 0.3)";
      feedbackEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing ${parsedWords.length} word(s)...`;
    }

    let addedCount = 0;
    let updatedCount = 0;

    try {
      const currentDateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      
      const fetchTasks = parsedWords.map(async (word) => {
        const upperWord = word.toUpperCase();
        let mwRes = null;
        try {
          mwRes = await qGen.fetchMWDefinition(word);
        } catch (err) {
          console.warn("MW fetch error for word:", word, err);
        }

        if (!mwRes || !mwRes.definition) {
          mwRes = {
            word: upperWord,
            definition: `${upperWord} (SSAT Vocabulary Word).`,
            pos: 'Vocabulary',
            phonetic: '',
            synonyms: []
          };
        }

        return {
          word: upperWord,
          definition: mwRes.definition,
          pos: mwRes.pos || 'Vocabulary',
          phonetic: mwRes.phonetic || '',
          synonyms: mwRes.synonyms || []
        };
      });

      const fetchedCards = await Promise.all(fetchTasks);
      for (const resCard of fetchedCards) {
        const existingIndex = this.customVocabCards.findIndex(v => v.word.toUpperCase() === resCard.word);
        if (existingIndex !== -1) {
          const existing = this.customVocabCards[existingIndex];
          if (resCard.definition && !resCard.definition.includes("(SSAT Vocabulary Word)")) {
            existing.definition = resCard.definition;
          }
          if (resCard.pos && resCard.pos !== 'Vocabulary') existing.pos = resCard.pos;
          if (resCard.phonetic) existing.phonetic = resCard.phonetic;
          if (resCard.synonyms && resCard.synonyms.length > 0) existing.synonyms = resCard.synonyms;
          updatedCount++;
        } else {
          this.customVocabCards.push({
            word: resCard.word,
            definition: resCard.definition,
            pos: resCard.pos,
            phonetic: resCard.phonetic,
            synonyms: resCard.synonyms,
            dateAdded: currentDateStr,
            status: 'uncategorized'
          });
          addedCount++;
        }
      }

      await this.saveCustomVocabCards();
      const csvSaved = await this.syncCSVFile(true);
      
      // Reset search filter input if populated so new cards are immediately visible
      const searchInput = document.getElementById("vocab-search-input");
      if (searchInput) searchInput.value = "";
      this.activeStatusFilter = "all";
      document.querySelectorAll(".filter-chip").forEach(c => {
        if (c.dataset.statusFilter === "all") c.classList.add("active");
        else c.classList.remove("active");
      });

      this.renderVocabCards();
      this.renderDailyVocabCards();

      const inputArea = document.getElementById("vocab-words-input");
      if (inputArea) inputArea.value = "";

      let successMsg = "";
      if (addedCount > 0) successMsg += `Successfully added ${addedCount} new card(s)! `;
      if (updatedCount > 0) successMsg += `Updated ${updatedCount} existing card(s). `;
      if (csvSaved) successMsg += `Updated CSV file saved!`;

      if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.background = "rgba(34, 197, 94, 0.15)";
        feedbackEl.style.color = "#22c55e";
        feedbackEl.style.border = "1px solid rgba(34, 197, 94, 0.3)";
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${successMsg.trim()}`;
      }

      setTimeout(() => {
        const panel = document.getElementById("add-vocab-panel");
        if (panel) panel.style.display = "none";
        if (feedbackEl) feedbackEl.style.display = "none";
      }, 1200);

    } catch (e) {
      console.error("Error adding vocabulary words:", e);
      if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.background = "rgba(239, 68, 68, 0.15)";
        feedbackEl.style.color = "#ef4444";
        feedbackEl.style.border = "1px solid rgba(239, 68, 68, 0.3)";
        feedbackEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Error adding words: ${e.message || 'Please try again.'}`;
      } else {
        alert("An error occurred while adding vocabulary: " + (e.message || 'Please try again.'));
      }
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = origHTML;
      }
    }
  }

  // Generate Printable PDF Worksheet (Fixed 20 questions per page, Header on Page 1 only, Answer Key on separate page)
  printCustomWorksheetPDF(questionSet) {
    const printableContainer = document.getElementById("custom-printable-worksheet");
    const choiceLetters = ["A", "B", "C", "D", "E"];
    const targetSet = (questionSet && questionSet.length > 0) ? questionSet : (this.lastGeneratedCustomSet || []);
    const pageSize = 20;
    
    // Chunk array into pages of 20 questions
    const pages = [];
    for (let i = 0; i < targetSet.length; i += pageSize) {
      pages.push(targetSet.slice(i, i + pageSize));
    }

    let fullHTML = "";

    // Render Question Pages
    pages.forEach((pageQuestions, pageIdx) => {
      let questionsHTML = "";
      pageQuestions.forEach((q, qInPageIdx) => {
        const globalIdx = pageIdx * pageSize + qInPageIdx;
        let optsHTML = q.options.map((optText, i) => 
          `<span class="print-opt-item"><strong>(${choiceLetters[i]})</strong> ${optText}</span>`
        ).join(" ");

        const stemText = q.type === 'synonym' ? q.targetWord : q.stem;
        const typeLabel = q.type === 'synonym' ? 'SYNONYM' : 'ANALOGY';

        questionsHTML += `
          <div class="print-q-item">
            <div class="print-q-stem">
              <strong>${globalIdx + 1}. ${stemText}</strong>
              <span class="print-q-type">[${typeLabel}]</span>
            </div>
            <div class="print-q-opts">
              ${optsHTML}
            </div>
          </div>
        `;
      });

      // Page 1 gets full header; subsequent question pages omit header
      const headerHTML = (pageIdx === 0) ? `
        <div class="print-header">
          <div class="print-title">SSAT Upper Level Verbal Practice Worksheet</div>
          <div class="print-subtitle">
            Name: ___________________________ &nbsp;&nbsp;&nbsp;&nbsp; Date: ______________ &nbsp;&nbsp;&nbsp;&nbsp; Score: ______ / ${targetSet.length}
          </div>
        </div>
      ` : `<div style="height: 15px;"></div>`;

      const pageBreakClass = (pageIdx > 0) ? ' print-page-break' : '';

      fullHTML += `
        <div class="print-page${pageBreakClass}">
          ${headerHTML}
          <div class="print-questions-grid">
            ${questionsHTML}
          </div>
        </div>
      `;
    });

    // Render Answer Key only on separate page
    let answerKeyHTML = "";

    targetSet.forEach((q, idx) => {
      const correctLetter = choiceLetters[q.correctAnswer];
      const correctText = q.options[q.correctAnswer];

      answerKeyHTML += `
        <div class="print-answer-item">
          <strong>${idx + 1}. (${correctLetter})</strong> ${correctText}
        </div>
      `;
    });

    fullHTML += `
      <div class="print-page print-page-break print-answer-key-page">
        <div class="print-header">
          <div class="print-title">SSAT Upper Level Verbal Practice Worksheet</div>
          <div class="print-subtitle">ANSWER KEY</div>
        </div>

        <div class="print-key-section-title">Answer Key</div>
        <div class="print-answer-key-list">
          ${answerKeyHTML}
        </div>
      </div>
    `;

    printableContainer.innerHTML = fullHTML;

    // Trigger browser print dialog (Save as PDF)
    window.print();
  }

  // Render Vocabulary Cards
  renderVocabCards(filterQuery = "") {
    const grid = document.getElementById("vocab-cards-grid");
    if (!grid) return;
    grid.innerHTML = "";

    // Update breakdown bar counts and percentage bars
    const countAllEl = document.getElementById("count-filter-all");
    const countAllChipEl = document.getElementById("count-filter-all-chip");
    const countLearningEl = document.getElementById("count-filter-learning");
    const countUncatEl = document.getElementById("count-filter-uncategorized");
    const countMasteredEl = document.getElementById("count-filter-mastered");

    const barUncatEl = document.getElementById("bar-uncategorized");
    const barLearningEl = document.getElementById("bar-learning");
    const barMasteredEl = document.getElementById("bar-mastered");

    const totalAll = this.customVocabCards.length;
    const totalLearning = this.customVocabCards.filter(v => v.status === 'learning').length;
    const totalUncat = this.customVocabCards.filter(v => !v.status || v.status === 'uncategorized').length;
    const totalMastered = this.customVocabCards.filter(v => v.status === 'mastered').length;

    if (countAllEl) countAllEl.textContent = totalAll;
    if (countAllChipEl) countAllChipEl.textContent = totalAll;
    if (countLearningEl) countLearningEl.textContent = totalLearning;
    if (countUncatEl) countUncatEl.textContent = totalUncat;
    if (countMasteredEl) countMasteredEl.textContent = totalMastered;

    if (totalAll > 0) {
      if (barUncatEl) barUncatEl.style.width = `${(totalUncat / totalAll) * 100}%`;
      if (barLearningEl) barLearningEl.style.width = `${(totalLearning / totalAll) * 100}%`;
      if (barMasteredEl) barMasteredEl.style.width = `${(totalMastered / totalAll) * 100}%`;
    } else {
      if (barUncatEl) barUncatEl.style.width = '0%';
      if (barLearningEl) barLearningEl.style.width = '0%';
      if (barMasteredEl) barMasteredEl.style.width = '0%';
    }

    const query = filterQuery.toLowerCase().trim();
    const list = this.customVocabCards.filter(v => {
      const matchesQuery = v.word.toLowerCase().includes(query) || (v.definition && v.definition.toLowerCase().includes(query));
      if (!matchesQuery) return false;

      if (this.activeStatusFilter === "learning") return v.status === "learning";
      if (this.activeStatusFilter === "mastered") return v.status === "mastered";
      if (this.activeStatusFilter === "uncategorized") return !v.status || v.status === "uncategorized";
      return true;
    });

    // Sort cards: 1. Don't Know (learning), 2. Uncategorized, 3. Know (mastered)
    const getStatusRank = (status) => {
      if (status === 'learning') return 1;
      if (!status || status === 'uncategorized') return 2;
      if (status === 'mastered') return 3;
      return 2;
    };

    list.sort((a, b) => {
      const rankA = getStatusRank(a.status);
      const rankB = getStatusRank(b.status);
      if (rankA !== rankB) return rankA - rankB;
      return a.word.localeCompare(b.word);
    });

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-cards-blank" style="font-size: 2.5rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
          <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">No vocabulary cards match this filter</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Try selecting a different filter or adding new vocabulary.</p>
        </div>
      `;
      return;
    }

    list.forEach(v => {
      const card = document.createElement("div");
      card.className = "flashcard";
      
      let synTagsHTML = '';
      if (v.synonyms && v.synonyms.length > 0) {
        synTagsHTML = v.synonyms.map(s => `<span class="syn-tag">${s}</span>`).join(" ");
      } else {
        synTagsHTML = `<span class="syn-tag placeholder-syn" style="opacity: 0.6; font-style: italic; background: transparent; border: 1px dashed var(--border-color); color: var(--text-secondary); cursor: pointer;"><i class="fa-solid fa-plus"></i> Add Synonyms</span>`;
      }

      let antTagsHTML = '';
      if (v.antonyms && v.antonyms.length > 0) {
        antTagsHTML = `<div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.3rem;"><strong>Antonyms:</strong> ${v.antonyms.map(a => `<span class="syn-tag" style="background: rgba(239, 68, 68, 0.12); color: #f87171; border-color: rgba(239, 68, 68, 0.3);">${a}</span>`).join(" ")}</div>`;
      }

      let exampleHTML = '';
      if (v.example) {
        exampleHTML = `<div style="font-size: 0.82rem; font-style: italic; color: var(--text-secondary); margin-top: 0.35rem; padding-left: 0.5rem; border-left: 2px solid var(--accent-primary);">"${v.example}"</div>`;
      }

      const phoneticText = v.phonetic ? `<div class="card-phonetic" title="Double click or click pen icon to edit">${v.phonetic}</div>` : "";
      const dateText = v.dateAdded || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const currentStatus = v.status || 'uncategorized';

      const renderNormalMode = () => {
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <span class="card-pos" style="margin-bottom: 0;" title="Double click or click pen icon to edit">${v.pos || 'Word'}</span>
              <select class="status-select-dropdown badge-${currentStatus === 'mastered' ? 'mastered' : (currentStatus === 'learning' ? 'learning' : 'uncategorized')}" title="Change status group">
                <option value="learning" ${currentStatus === 'learning' ? 'selected' : ''}>❌ Don't Know</option>
                <option value="uncategorized" ${currentStatus === 'uncategorized' ? 'selected' : ''}>❓ Uncategorized</option>
                <option value="mastered" ${currentStatus === 'mastered' ? 'selected' : ''}>✅ Know</option>
              </select>
            </div>
            <div style="display:flex; gap:0.25rem;">
              <button class="edit-card-btn" title="Edit Card Details"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="delete-card-btn" title="Delete Card"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
          <div class="card-word" title="Double click or click pen icon to edit">
            <span>${v.word}</span>
            <button class="audio-btn" title="Listen Pronunciation"><i class="fa-solid fa-volume-high"></i></button>
          </div>
          ${phoneticText}
          <div class="card-def" title="Double click or click pen icon to edit">${v.definition}</div>
          <div class="card-syns" title="Double click or click pen icon to edit">${synTagsHTML}</div>
          ${antTagsHTML}
          ${exampleHTML}

          <div class="card-footer-date"><i class="fa-regular fa-calendar-days"></i> Added: ${dateText}</div>
        `;

        const statusSelectEl = card.querySelector(".status-select-dropdown");
        if (statusSelectEl) {
          statusSelectEl.addEventListener("change", (e) => {
            e.stopPropagation();
            this.setCardStatus(v.word, e.target.value);
          });
          statusSelectEl.addEventListener("click", (e) => {
            e.stopPropagation();
          });
        }

        const editBtn = card.querySelector(".edit-card-btn");
        if (editBtn) {
          editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            renderEditMode();
          });
        }

        const audioBtn = card.querySelector(".audio-btn");
        if (audioBtn) {
          audioBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.speakWord(v.word);
          });
        }

        const deleteBtn = card.querySelector(".delete-card-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.deleteSingleVocabCard(v.word);
          });
        }
      };

      const renderEditMode = () => {
        card.innerHTML = `
          <div class="edit-flashcard-form" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
              <strong style="font-size: 0.85rem; color: var(--accent-primary);"><i class="fa-solid fa-pen-to-square"></i> Edit Vocabulary Card</strong>
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Word</label>
              <input type="text" class="edit-word-input form-input" value="${v.word}" style="font-weight: 700; font-size: 0.95rem; padding: 0.25rem 0.5rem; width: 100%;" />
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <div style="flex: 1;">
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Part of Speech</label>
                <input type="text" class="edit-pos-input form-input" value="${v.pos || ''}" placeholder="e.g. Noun, Adjective" style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;" />
              </div>
              <div style="flex: 1;">
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Pronunciation</label>
                <input type="text" class="edit-phonetic-input form-input" value="${v.phonetic || ''}" placeholder="e.g. ˈplī-ə-bəl" style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;" />
              </div>
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Status Group</label>
              <select class="edit-status-input form-select" style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;">
                <option value="learning" ${currentStatus === 'learning' ? 'selected' : ''}>❌ Don't Know</option>
                <option value="uncategorized" ${currentStatus === 'uncategorized' ? 'selected' : ''}>❓ Uncategorized</option>
                <option value="mastered" ${currentStatus === 'mastered' ? 'selected' : ''}>✅ Know</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Definition</label>
              <textarea class="edit-def-input form-textarea" rows="2" style="font-size: 0.82rem; padding: 0.35rem 0.5rem; width: 100%; resize: vertical;">${v.definition}</textarea>
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Synonyms (separated by semicolons)</label>
              <input type="text" class="edit-syns-input form-input" value="${(v.synonyms || []).join('; ')}" placeholder="e.g. flexible; supple; adaptable" style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;" />
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Antonyms (separated by semicolons)</label>
              <input type="text" class="edit-ants-input form-input" value="${(v.antonyms || []).join('; ')}" placeholder="e.g. rigid; stubborn" style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;" />
            </div>

            <div>
              <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); display: block; margin-bottom: 0.1rem;">Example Sentence</label>
              <input type="text" class="edit-example-input form-input" value="${v.example || ''}" placeholder="e.g. The pliable material was easily shaped." style="padding: 0.25rem 0.5rem; font-size: 0.82rem; width: 100%;" />
            </div>

            <div style="display: flex; gap: 0.5rem; margin-top: 0.3rem;">
              <button class="save-edit-btn btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; width: auto;"><i class="fa-solid fa-check"></i> Save</button>
              <button class="cancel-edit-btn btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; width: auto;">Cancel</button>
            </div>
          </div>
        `;

        card.querySelector(".save-edit-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          const newWord = card.querySelector(".edit-word-input").value.trim().toUpperCase();
          const newPos = card.querySelector(".edit-pos-input").value.trim();
          const newPhonetic = card.querySelector(".edit-phonetic-input").value.trim();
          const newDef = card.querySelector(".edit-def-input").value.trim();
          const rawSyns = card.querySelector(".edit-syns-input").value;
          const newSyns = rawSyns.split(/[;,]/).map(s => s.trim()).filter(Boolean);
          const rawAnts = card.querySelector(".edit-ants-input").value;
          const newAnts = rawAnts.split(/[;,]/).map(s => s.trim()).filter(Boolean);
          const newExample = card.querySelector(".edit-example-input").value.trim();
          const newStatus = card.querySelector(".edit-status-input").value;

          if (!newWord || !newDef) {
            alert("Word and Definition cannot be empty.");
            return;
          }

          this.updateVocabCard(v.word, {
            word: newWord,
            pos: newPos || 'Word',
            phonetic: newPhonetic,
            definition: newDef,
            synonyms: newSyns,
            antonyms: newAnts,
            example: newExample,
            status: newStatus
          });
        });

        card.querySelector(".cancel-edit-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          renderNormalMode();
        });
      };

      card.addEventListener("dblclick", (e) => {
        if (e.target.closest(".status-select-dropdown") || e.target.closest(".status-badge") || e.target.closest(".audio-btn") || e.target.closest(".delete-card-btn") || e.target.closest(".edit-card-btn") || e.target.closest("input") || e.target.closest("textarea") || e.target.closest("select")) return;
        renderEditMode();
      });

      renderNormalMode();
      grid.appendChild(card);
    });
  }

  getTodayDateString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Date-seeded pseudorandom shuffle (Mulberry32 PRNG)
  seededShuffle(array, seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed << 5) - seed + seedStr.charCodeAt(i);
      seed |= 0;
    }
    
    const random = () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 85), t | 73);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  loadDailyState() {
    const saved = localStorage.getItem("ssat_daily_vocab_state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state && state.date === this.getTodayDateString() && Array.isArray(state.cards) && state.cards.length > 0) {
          return state;
        }
      } catch (e) {}
    }
    return null;
  }

  saveDailyState() {
    if (!this.dailyDeck || this.dailyDeck.length === 0) return;
    const state = {
      date: this.getTodayDateString(),
      cards: this.dailyDeck,
      currentIndex: this.dailyIndex
    };
    localStorage.setItem("ssat_daily_vocab_state", JSON.stringify(state));
  }

  // Render Daily Vocab Words (Date-seeded persistence up to 100 cards)
  renderDailyVocabCards() {
    const container = document.getElementById("daily-single-card-container");
    const progressText = document.getElementById("daily-card-progress-text");
    const progressFill = document.getElementById("daily-card-progress-fill");
    if (!container) return;

    const sourcePool = [...this.customVocabCards];

    if (sourcePool.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-cards-blank" style="font-size: 2.2rem; color: var(--text-secondary); margin-bottom: 0.75rem; display: block;"></i>
          <h3 style="margin-bottom: 0.4rem; color: var(--text-primary);">No vocabulary cards in your bank yet</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0;">Add vocabulary in the <strong>Vocabulary Cards</strong> tab to generate your daily deck!</p>
        </div>
      `;
      if (progressText) progressText.textContent = "Card 0 of 0";
      if (progressFill) progressFill.style.width = "0%";
      const prevBtn = document.getElementById("prev-daily-card-btn");
      const nextBtn = document.getElementById("next-daily-card-btn");
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    const todayStr = this.getTodayDateString();
    const savedState = this.loadDailyState();
    let validSavedDeck = [];
    if (savedState && Array.isArray(savedState.cards)) {
      savedState.cards.forEach(savedCard => {
        const liveCard = sourcePool.find(v => v.word.toUpperCase() === savedCard.word.toUpperCase());
        if (liveCard) {
          validSavedDeck.push(liveCard);
        }
      });
    }

    if (validSavedDeck.length > 0) {
      this.dailyDeck = validSavedDeck;
      this.dailyIndex = Math.min(savedState.currentIndex || 0, this.dailyDeck.length - 1);
    } else {
      // 1. Filter pools: Don't Know (learning), Uncategorized, and Know (mastered)
      const dontKnowPool = sourcePool.filter(v => v.status === 'learning');
      const uncategorizedPool = sourcePool.filter(v => !v.status || v.status === 'uncategorized');
      const knowPool = sourcePool.filter(v => v.status === 'mastered');

      // Shuffle each pool deterministically for today's date
      const shuffledDontKnow = this.seededShuffle(dontKnowPool, todayStr + "-dontknow");
      const shuffledUncategorized = this.seededShuffle(uncategorizedPool, todayStr + "-uncat");
      const shuffledKnow = this.seededShuffle(knowPool, todayStr + "-know");

      const targetTotal = Math.min(100, sourcePool.length);
      
      // Target 2/3 (~67%) Don't Know and 1/3 (~33%) Uncategorized
      let quotaDontKnow = Math.round(targetTotal * (2 / 3));
      let quotaUncat = targetTotal - quotaDontKnow;

      // Available counts up to target quotas
      let countDontKnow = Math.min(quotaDontKnow, shuffledDontKnow.length);
      let countUncat = Math.min(quotaUncat, shuffledUncategorized.length);

      // Spillover balancing between Don't Know and Uncategorized
      const uncatNeed = quotaUncat - countUncat;
      if (uncatNeed > 0) {
        const extraDontKnow = Math.min(uncatNeed, shuffledDontKnow.length - countDontKnow);
        countDontKnow += extraDontKnow;
      }

      const dontKnowNeed = quotaDontKnow - countDontKnow;
      if (dontKnowNeed > 0) {
        const extraUncat = Math.min(dontKnowNeed, shuffledUncategorized.length - countUncat);
        countUncat += extraUncat;
      }

      const selectedPrimary = [
        ...shuffledDontKnow.slice(0, countDontKnow),
        ...shuffledUncategorized.slice(0, countUncat)
      ];

      // Fill remaining shortfall with Know (mastered) cards
      const shortfall = targetTotal - selectedPrimary.length;
      const selectedKnow = shuffledKnow.slice(0, shortfall);

      const combinedSelection = [...selectedPrimary, ...selectedKnow];

      // Final shuffle of today's deck so cards are smoothly mixed
      this.dailyDeck = this.seededShuffle(combinedSelection, todayStr + "-mix");
      this.dailyIndex = 0;
      this.saveDailyState();
    }

    this.displayCurrentDailyCard();
  }

  displayCurrentDailyCard(startFlipped = false) {
    const container = document.getElementById("daily-single-card-container");
    const progressText = document.getElementById("daily-card-progress-text");
    const progressFill = document.getElementById("daily-card-progress-fill");
    const prevBtn = document.getElementById("prev-daily-card-btn");
    const nextBtn = document.getElementById("next-daily-card-btn");

    if (!container || this.dailyDeck.length === 0) return;

    const total = this.dailyDeck.length;
    const current = this.dailyIndex + 1;
    const v = this.dailyDeck[this.dailyIndex];

    if (progressText) progressText.textContent = `Card ${current} of ${total}`;
    if (progressFill) progressFill.style.width = `${(current / total) * 100}%`;

    if (prevBtn) prevBtn.disabled = (this.dailyIndex === 0);
    if (nextBtn) nextBtn.disabled = (this.dailyIndex === total - 1);

    const synTags = (v.synonyms || []).map(s => `<span class="syn-tag">${s}</span>`).join("");
    const phoneticText = v.phonetic ? `<div class="card-phonetic" style="margin-bottom:0;">${v.phonetic}</div>` : "";
    const dateText = v.dateAdded || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    container.innerHTML = `
      <div class="flip-card ${startFlipped ? 'flipped' : ''}" style="height: 270px;">
        <div class="flip-card-inner">
          <!-- FRONT SIDE (Word only + Audio + Flip Hint) -->
          <div class="flip-card-front">
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
              <span class="card-pos" style="margin-bottom: 0;">${v.pos || 'Word'}</span>
              <span class="flip-hint"><i class="fa-solid fa-rotate"></i> Tap to flip</span>
            </div>
            
            <div style="margin: 1.5rem 0; text-align: center;">
              <div class="card-word" style="justify-content: center; gap: 0.6rem; font-size: 2rem;">
                <span>${v.word}</span>
                <button class="audio-btn" title="Listen Pronunciation"><i class="fa-solid fa-volume-high"></i></button>
              </div>
              ${phoneticText}
            </div>

            <div style="font-size: 0.8rem; color: var(--text-secondary); opacity: 0.85;">
              <i class="fa-solid fa-hand-pointer"></i> Tap card to reveal definition
            </div>
          </div>

          <!-- BACK SIDE (Definition + Synonyms + Mastery Actions) -->
          <div class="flip-card-back">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <strong style="font-size: 1.2rem; color: var(--text-primary);">${v.word}</strong>
                <span class="card-pos" style="margin-bottom: 0;">${v.pos || 'Word'}</span>
              </div>
              <div class="card-def" style="margin-bottom: 0.6rem; line-height: 1.4; font-size: 0.95rem;">${v.definition}</div>
              ${synTags ? `<div class="card-syns" style="margin-bottom:0.5rem;">${synTags}</div>` : ''}
            </div>

            <div>
              <div class="card-status-actions">
                <button class="status-btn btn-dont-know ${v.status === 'learning' ? 'active' : ''}" data-word="${v.word}" data-status="learning">
                  <i class="fa-solid fa-circle-xmark"></i> Don't Know
                </button>
                <button class="status-btn btn-know ${v.status === 'mastered' ? 'active' : ''}" data-word="${v.word}" data-status="mastered">
                  <i class="fa-solid fa-circle-check"></i> Know
                </button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 0.4rem; margin-top: 0.4rem; font-size: 0.75rem; color: var(--text-secondary);">
                <span><i class="fa-regular fa-calendar-days"></i> Added: ${dateText}</span>
                <span class="flip-hint"><i class="fa-solid fa-rotate"></i> Flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const card = container.querySelector(".flip-card");
    if (card) {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
      });

      card.querySelectorAll(".audio-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.speakWord(v.word);
        });
      });

      card.querySelectorAll(".status-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetStatus = btn.dataset.status;

          // Immediate visual feedback on back of current card
          card.querySelectorAll(".status-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");

          // Save card status & keep card flipped
          this.setCardStatus(v.word, targetStatus, true);

          // Smoothly advance to next card after short delay
          if (this.dailyIndex < this.dailyDeck.length - 1) {
            setTimeout(() => {
              this.nextDailyCard();
            }, 400);
          }
        });
      });
    }

    this.saveDailyState();
  }

  prevDailyCard() {
    if (this.dailyIndex > 0) {
      this.dailyIndex--;
      this.displayCurrentDailyCard();
    }
  }

  nextDailyCard() {
    if (this.dailyIndex < this.dailyDeck.length - 1) {
      this.dailyIndex++;
      this.displayCurrentDailyCard();
    }
  }

  // Render Analogy Guide
  renderAnalogyGuide() {
    const grid = document.getElementById("analogy-types-grid");
    grid.innerHTML = "";

    SSAT_ANALOGY_TYPES.forEach(t => {
      const card = document.createElement("div");
      card.className = "strategy-card";
      card.innerHTML = `
        <div class="strat-name">${t.name}</div>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:0.75rem;">${t.description}</p>
        <div style="background:var(--bg-secondary); padding:0.6rem 0.8rem; border-radius:var(--radius-sm); font-family:monospace; font-size:0.85rem; color:#818cf8; margin-bottom:0.75rem;">
          ${t.example}
        </div>
        <div style="font-size:0.85rem; color:var(--warning);">
          <strong>Solving Strategy:</strong> ${t.strategy}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Render Analytics & Missed Queue
  renderAnalytics() {
    document.getElementById("stat-total-solved").textContent = this.stats.totalSolved;
    
    const accuracy = this.stats.totalSolved > 0 
      ? Math.round((this.stats.totalCorrect / this.stats.totalSolved) * 100) 
      : 0;
    document.getElementById("stat-accuracy").textContent = `${accuracy}%`;
    document.getElementById("stat-streak").textContent = this.stats.streak;

    // Render Missed Queue
    const container = document.getElementById("missed-queue-container");
    if (this.stats.missedQuestions.length === 0) {
      container.innerHTML = `<p style="color: var(--text-secondary);">No missed questions yet! Great job practicing.</p>`;
    } else {
      container.innerHTML = "";
      this.stats.missedQuestions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.className = "strategy-card";
        div.style.marginBottom = "1rem";
        div.innerHTML = `
          <strong style="color:var(--danger);">Q${idx + 1}. ${q.targetWord || q.stem}</strong>
          <p style="font-size:0.9rem; margin-top:0.4rem;">${q.explanation}</p>
        `;
        container.appendChild(div);
      });

      const retryMissedBtn = document.createElement("button");
      retryMissedBtn.className = "btn-primary";
      retryMissedBtn.style.marginTop = "1rem";
      retryMissedBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Practice Missed Questions Now';
      retryMissedBtn.addEventListener("click", () => {
        document.querySelector('[data-target="pane-quiz"]').click();
        this.startQuiz(this.stats.missedQuestions);
      });
      container.appendChild(retryMissedBtn);
    }
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

// Initialize Application on DOM Ready or Immediately if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.app) window.app = new SSATApp();
  });
} else {
  if (!window.app) window.app = new SSATApp();
}
