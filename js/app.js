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

    // Daily Vocab Deck Single-Card Navigation State
    this.dailyDeck = [];
    this.dailyIndex = 0;

    this.init();
  }

  async init() {
    this.bindEvents();
    this.renderVocabCards();
    this.renderDailyVocabCards();
    this.renderAnalogyGuide();
    this.renderAnalytics();

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

    this.loadCSVOnStart();
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
    // If user has linked a local CSV file handle, write directly to disk automatically!
    if (this.fileHandle) {
      try {
        const csvContent = this.generateCSVContent();
        const writable = await this.fileHandle.createWritable();
        await writable.write(csvContent);
        await writable.close();
      } catch (err) {
        console.warn("Auto-write to linked CSV file failed:", err);
      }
    }
  }

  async loadCSVOnStart() {
    try {
      const resp = await fetch('./vocabulary_bank.csv');
      if (resp.ok) {
        const text = await resp.text();
        const parsed = this.parseCSVText(text);
        if (parsed.length > 0) {
          if (this.customVocabCards.length === 0) {
            this.customVocabCards = parsed;
          } else {
            parsed.forEach(c => {
              if (!this.customVocabCards.some(v => v.word.toUpperCase() === c.word.toUpperCase())) {
                this.customVocabCards.push(c);
              }
            });
          }
          localStorage.setItem("ssat_custom_vocab_cards", JSON.stringify(this.customVocabCards));
          this.renderVocabCards();
        }
      }
    } catch (e) {}
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
          cards.push({
            word: word,
            pos: cleanCols[1] ? cleanCols[1].trim() : 'Word',
            phonetic: cleanCols[2] ? cleanCols[2].trim() : '',
            definition: cleanCols[3] ? cleanCols[3].trim() : '',
            synonyms: cleanCols[4] ? cleanCols[4].split(';').map(s => s.trim()).filter(Boolean) : [],
            dateAdded: cleanCols[5] ? cleanCols[5].trim() : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
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

    document.getElementById("load-sample-words-btn").addEventListener("click", () => {
      const sampleText = "PLIABLE, ENERVATE, FLUMMOX, EXTRICATE, MULTITUDE, PLUNDERING, PRECIPITOUS, SUMPTUOUSNESS, QUALM, INFAMY, FATUOUS, CONVALESCENCE, REPROACH, PUGNACIOUS, TEMPORAL, CIRCUMSPECT, LADEN, PRETENTIOUS, CONFLUENCE, ANTHOLOGY, HEARTH, IMPLICATE, HILARITY, DOCILE, BOURGEOIS, WRETCHED, SERF";
      document.getElementById("custom-words-input").value = sampleText;
    });

    document.getElementById("clear-custom-btn").addEventListener("click", () => {
      document.getElementById("custom-words-input").value = "";
      document.getElementById("custom-questions-output").style.display = "none";
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

    const shuffleDailyBtn = document.getElementById("shuffle-daily-btn");
    if (shuffleDailyBtn) {
      shuffleDailyBtn.addEventListener("click", () => {
        this.renderDailyVocabCards(true);
      });
    }

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

    let pool = customSet ? customSet : (this.lastGeneratedCustomSet && this.lastGeneratedCustomSet.length > 0 ? this.lastGeneratedCustomSet : []);

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

  // Custom Generator Handler
  async handleCustomGeneration() {
    const rawText = document.getElementById("custom-words-input").value;
    const parsedWords = questionGenerator.parseInput(rawText);

    if (parsedWords.length === 0) {
      alert("Please enter or paste at least one vocabulary word.");
      return;
    }

    const generateBtn = document.getElementById("generate-custom-btn");
    const originalBtnHTML = generateBtn.innerHTML;
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Questions...';

    try {
      const generatedSet = await questionGenerator.generateSet(parsedWords);
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

  generateCSVContent() {
    const headers = ["Word", "Part of Speech", "Pronunciation", "Definition", "Synonyms", "Date Added"];
    
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return '""';
      const str = String(field).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = this.customVocabCards.map(v => [
      escapeCSV(v.word),
      escapeCSV(v.pos || 'Word'),
      escapeCSV(v.phonetic || ''),
      escapeCSV(v.definition || ''),
      escapeCSV((v.synonyms || []).join("; ")),
      escapeCSV(v.dateAdded || '')
    ]);

    return [headers.map(h => `"${h}"`).join(","), ...rows.map(r => r.join(","))].join("\n");
  }

  async syncCSVFile(promptIfUnlinked = true) {
    if (this.customVocabCards.length === 0) return;

    const csvContent = this.generateCSVContent();

    if ('showSaveFilePicker' in window) {
      try {
        if (!this.fileHandle) {
          if (!promptIfUnlinked) return;
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
        const writable = await this.fileHandle.createWritable();
        await writable.write(csvContent);
        await writable.close();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Direct file save error:", err);
          this.triggerCSVDownload(csvContent);
        }
      }
    } else {
      this.triggerCSVDownload(csvContent);
    }
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
    const rawText = document.getElementById("vocab-words-input").value;
    const parsedWords = questionGenerator.parseInput(rawText);

    if (parsedWords.length === 0) {
      alert("Please enter or paste at least one vocabulary word.");
      return;
    }

    const saveBtn = document.getElementById("save-vocab-cards-btn");
    const origHTML = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching Definitions...';

    let addedCount = 0;
    let skippedCount = 0;

    try {
      const currentDateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      for (const word of parsedWords) {
        const upperWord = word.toUpperCase();
        // Check deduplication
        if (this.customVocabCards.some(v => v.word.toUpperCase() === upperWord)) {
          skippedCount++;
          continue;
        }

        const mwRes = await questionGenerator.fetchMWDefinition(word);
        if (mwRes) {
          this.customVocabCards.push({
            word: upperWord,
            definition: mwRes.definition,
            pos: mwRes.pos || 'Noun',
            phonetic: mwRes.phonetic || '',
            synonyms: mwRes.synonyms || [],
            dateAdded: currentDateStr
          });
          addedCount++;
        }
      }
      this.saveCustomVocabCards();
      this.renderVocabCards();

      if (!this.fileHandle && 'showSaveFilePicker' in window && addedCount > 0) {
        await this.syncCSVFile(true);
      }
      
      document.getElementById("vocab-words-input").value = "";
      document.getElementById("add-vocab-panel").style.display = "none";

      if (skippedCount > 0 && addedCount > 0) {
        alert(`Added ${addedCount} new card(s). Skipped ${skippedCount} duplicate word(s).`);
      } else if (skippedCount > 0 && addedCount === 0) {
        alert(`All ${skippedCount} word(s) already exist in your Vocab Bank.`);
      }
    } catch (e) {
      console.error("Error adding vocabulary words:", e);
      alert("An error occurred while adding vocabulary. Please try again.");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = origHTML;
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
    grid.innerHTML = "";

    const query = filterQuery.toLowerCase().trim();
    const list = this.customVocabCards.filter(v => 
      v.word.toLowerCase().includes(query) ||
      (v.definition && v.definition.toLowerCase().includes(query))
    );

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <i class="fa-solid fa-cards-blank" style="font-size: 2.5rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
          <h3 style="margin-bottom: 0.5rem; color: var(--text-primary);">Your vocab bank is empty</h3>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Add vocabulary using the button above</p>
        </div>
      `;
      return;
    }

    list.forEach(v => {
      const card = document.createElement("div");
      card.className = "flashcard";
      
      const synTags = (v.synonyms || []).map(s => `<span class="syn-tag">${s}</span>`).join("");
      const phoneticText = v.phonetic ? `<div class="card-phonetic">${v.phonetic}</div>` : "";

      const dateText = v.dateAdded || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span class="card-pos" style="margin-bottom: 0;">${v.pos || 'Word'}</span>
          <button class="delete-card-btn" title="Delete Card"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        <div class="card-word">
          <span>${v.word}</span>
          <button class="audio-btn" title="Listen Pronunciation"><i class="fa-solid fa-volume-high"></i></button>
        </div>
        ${phoneticText}
        <div class="card-def">${v.definition}</div>
        ${synTags ? `<div class="card-syns">${synTags}</div>` : ''}
        <div class="card-footer-date"><i class="fa-regular fa-calendar-days"></i> Added: ${dateText}</div>
      `;

      card.querySelector(".audio-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.speakWord(v.word);
      });

      card.querySelector(".delete-card-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteSingleVocabCard(v.word);
      });

      grid.appendChild(card);
    });

    this.renderDailyVocabCards();
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
  renderDailyVocabCards(forceReshuffle = false) {
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
    const savedState = !forceReshuffle ? this.loadDailyState() : null;

    if (savedState) {
      this.dailyDeck = savedState.cards;
      this.dailyIndex = Math.min(savedState.currentIndex || 0, this.dailyDeck.length - 1);
    } else {
      const seedKey = forceReshuffle ? `${todayStr}-${Date.now()}` : todayStr;
      const shuffled = this.seededShuffle(sourcePool, seedKey);
      this.dailyDeck = shuffled.slice(0, 100);
      this.dailyIndex = 0;
      this.saveDailyState();
    }

    this.displayCurrentDailyCard();
  }

  displayCurrentDailyCard() {
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
      <div class="flip-card" style="height: 250px;">
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

          <!-- BACK SIDE (Definition + Synonyms + Metadata) -->
          <div class="flip-card-back">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
                <strong style="font-size: 1.2rem; color: var(--text-primary);">${v.word}</strong>
                <span class="card-pos" style="margin-bottom: 0;">${v.pos || 'Word'}</span>
              </div>
              <div class="card-def" style="margin-bottom: 0.75rem; line-height: 1.45; font-size: 1rem;">${v.definition}</div>
              ${synTags ? `<div class="card-syns">${synTags}</div>` : ''}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">
              <span><i class="fa-regular fa-calendar-days"></i> Added: ${dateText}</span>
              <span class="flip-hint"><i class="fa-solid fa-rotate"></i> Flip back</span>
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

// Initialize Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new SSATApp();
});
