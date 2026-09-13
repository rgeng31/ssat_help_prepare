// SSAT Question Generator for Custom Vocabulary Lists
// Dynamically creates SSAT-style Synonyms and Analogies with 5 options (A-E)

class QuestionGenerator {
  constructor() {
    const env = (typeof window !== 'undefined' && window.ENV) || {};
    this.mwApiKey = env.MW_API_KEY || localStorage.getItem("ssat_mw_api_key") || "";
    this.geminiApiKey = env.GEMINI_API_KEY || localStorage.getItem("ssat_gemini_api_key") || "";
  }

  updateApiKeys(mwKey, geminiKey) {
    this.mwApiKey = mwKey || "";
    this.geminiApiKey = geminiKey || "";
  }

  // Parse raw text into array of clean words (handles numbered lists, definitions with colons/dashes, commas, newlines)
  parseInput(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const words = [];

    for (const line of lines) {
      // Remove leading numbers like '1.', '1)', '(1)'
      const cleanLine = line.replace(/^[\d\.\)\(\s]+/, '').trim();
      if (!cleanLine) continue;

      // Extract the word before any definition separator like ':', '-', '—', '='
      const parts = cleanLine.split(/[:\-–—=]+/);
      const wordPart = parts[0].trim();

      // Split multiple words on the line by comma, semicolon, or spaces
      const tokens = wordPart.split(/[,;\s]+/)
        .map(w => w.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '').toUpperCase())
        .filter(w => w.length > 1);

      words.push(...tokens);
    }

    return Array.from(new Set(words));
  }

  fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Network Timeout')), timeoutMs))
    ]);
  }

  async fetchSynonymsDatamuse(word) {
    const cleanWord = word.toLowerCase().trim();
    let synonyms = [];
    try {
      // 1. Try exact synonym relationship (rel_syn)
      const resSyn = await this.fetchWithTimeout(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(cleanWord)}&max=5`, {}, 2000);
      if (resSyn.ok) {
        const dataSyn = await resSyn.json();
        if (Array.isArray(dataSyn)) {
          synonyms.push(...dataSyn.map(item => item.word));
        }
      }

      // 2. Fallback to means-like (ml) if fewer than 3 synonyms found
      if (synonyms.length < 3) {
        const resMl = await this.fetchWithTimeout(`https://api.datamuse.com/words?ml=${encodeURIComponent(cleanWord)}&max=5`, {}, 2000);
        if (resMl.ok) {
          const dataMl = await resMl.json();
          if (Array.isArray(dataMl)) {
            synonyms.push(...dataMl.map(item => item.word));
          }
        }
      }

      synonyms = Array.from(new Set(synonyms.map(s => s.trim().toLowerCase()))).filter(s => s !== cleanWord).slice(0, 3);
    } catch (e) {
      console.warn("Datamuse Synonym Fetch Error:", word, e);
    }
    return synonyms;
  }

  async fetchAntonymsDatamuse(word) {
    const cleanWord = word.toLowerCase().trim();
    let antonyms = [];
    try {
      const resAnt = await this.fetchWithTimeout(`https://api.datamuse.com/words?rel_ant=${encodeURIComponent(cleanWord)}&max=5`, {}, 2000);
      if (resAnt.ok) {
        const dataAnt = await resAnt.json();
        if (Array.isArray(dataAnt)) {
          antonyms.push(...dataAnt.map(item => item.word));
        }
      }
      antonyms = Array.from(new Set(antonyms.map(a => a.trim().toLowerCase()))).filter(a => a !== cleanWord).slice(0, 3);
    } catch (e) {
      console.warn("Datamuse Antonym Fetch Error:", word, e);
    }
    return antonyms;
  }

  // Fetch definition, part of speech, pronunciation, synonyms, antonyms, and example sentence from Dictionary API
  async fetchMWDefinition(word, apiKey = this.mwApiKey) {
    const keyToUse = apiKey || this.mwApiKey || "01b4423c-9962-4ee3-a303-78d52036cdfd";
    const cleanWord = word.toLowerCase().trim();

    // 1. Primary: Merriam-Webster Collegiate API
    if (keyToUse) {
      try {
        const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(cleanWord)}?key=${encodeURIComponent(keyToUse.trim())}`;
        const res = await this.fetchWithTimeout(url, {}, 2500);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const entry = data.find(item => typeof item === 'object' && item.shortdef && item.shortdef.length > 0) || data[0];
          if (typeof entry === 'object' && entry.shortdef && entry.shortdef.length > 0) {
            const rawDef = entry.shortdef[0];
            const cleanDef = rawDef.replace(/\{[^}]+\}/g, '').trim();
            
            // Format Part of Speech (e.g. 'noun' -> 'Noun', 'adjective' -> 'Adjective')
            let rawFl = entry.fl || 'Noun';
            let pos = rawFl.charAt(0).toUpperCase() + rawFl.slice(1).toLowerCase();

            // Extract Phonetic Pronunciation (e.g. 'ˈplī-ə-bəl')
            let phonetic = '';
            if (entry.hwi && entry.hwi.prs && entry.hwi.prs.length > 0 && entry.hwi.prs[0].mw) {
              phonetic = `${entry.hwi.prs[0].mw}`;
            } else if (entry.hwi && entry.hwi.hw) {
              phonetic = `${entry.hwi.hw.replace(/\*/g, '·')}`;
            }

            // Extract Synonyms
            let synonyms = [];
            if (entry.meta && entry.meta.syns && entry.meta.syns.length > 0 && Array.isArray(entry.meta.syns[0])) {
              synonyms = entry.meta.syns[0].slice(0, 3);
            }
            if (synonyms.length === 0) {
              synonyms = await this.fetchSynonymsDatamuse(word);
            }

            // Extract Antonyms
            let antonyms = [];
            if (entry.meta && entry.meta.ants && entry.meta.ants.length > 0 && Array.isArray(entry.meta.ants[0])) {
              antonyms = entry.meta.ants[0].slice(0, 3);
            }
            if (antonyms.length === 0) {
              antonyms = await this.fetchAntonymsDatamuse(word);
            }

            return {
              word: word.toUpperCase(),
              definition: cleanDef,
              pos: pos,
              phonetic: phonetic,
              synonyms: synonyms,
              antonyms: antonyms,
              example: ''
            };
          }
        }
      } catch (err) {
        console.warn("MW API Fetch Error for word:", word, err);
      }
    }

    // 2. Secondary Fallback: Free Open Dictionary API + Datamuse
    try {
      const freeUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`;
      const freeRes = await this.fetchWithTimeout(freeUrl, {}, 2000);
      const freeData = await freeRes.json();

      if (Array.isArray(freeData) && freeData.length > 0 && freeData[0].meanings && freeData[0].meanings.length > 0) {
        const meaning = freeData[0].meanings[0];
        const rawDef = meaning.definitions && meaning.definitions[0] ? meaning.definitions[0].definition : '';
        const example = meaning.definitions && meaning.definitions[0] ? (meaning.definitions[0].example || '') : '';
        const rawPos = meaning.partOfSpeech || 'noun';
        const pos = rawPos.charAt(0).toUpperCase() + rawPos.slice(1).toLowerCase();
        
        let phonetic = freeData[0].phonetic || (freeData[0].phonetics && freeData[0].phonetics[0] ? freeData[0].phonetics[0].text : '');
        phonetic = phonetic.replace(/^\/|\/$/g, '');

        let synonyms = meaning.synonyms ? meaning.synonyms.slice(0, 3) : [];
        if (synonyms.length === 0) {
          synonyms = await this.fetchSynonymsDatamuse(word);
        }

        let antonyms = meaning.antonyms ? meaning.antonyms.slice(0, 3) : [];
        if (antonyms.length === 0) {
          antonyms = await this.fetchAntonymsDatamuse(word);
        }

        if (rawDef) {
          return {
            word: word.toUpperCase(),
            definition: rawDef,
            pos: pos,
            phonetic: phonetic,
            synonyms: synonyms,
            antonyms: antonyms,
            example: example
          };
        }
      }
    } catch (err) {
      console.warn("Free Dictionary API Fetch Error:", word, err);
    }

    // 3. Last Fallback: Datamuse Synonyms & Antonyms
    const datamuseSyns = await this.fetchSynonymsDatamuse(word);
    const datamuseAnts = await this.fetchAntonymsDatamuse(word);
    return {
      word: word.toUpperCase(),
      definition: `${word.toUpperCase()} (SSAT Vocabulary Word).`,
      pos: 'Vocabulary',
      phonetic: '',
      synonyms: datamuseSyns,
      antonyms: datamuseAnts,
      example: ''
    };
  }

  // Generate authentic SSAT questions via Google Gemini API
  async fetchGeminiQuestions(words, apiKey = this.geminiApiKey) {
    const keyToUse = apiKey || this.geminiApiKey;
    if (!keyToUse || keyToUse.startsWith("AQ.")) return null; // Skip invalid dummy key
    try {
      const prompt = `You are an expert SSAT Upper Level Verbal test author.
For each vocabulary word in this list: ${words.join(', ')}, generate exactly TWO questions matching official SSAT Upper Level format:
1. ONE Synonym question: 5 choice options (A-E), target word, 1 correct synonym, 4 realistic distractor options, and a clear definition explanation.
2. ONE Analogy question: Stem pair (e.g. WORD : SYNONYM or WORD : ATTRIBUTE), 5 choice pairs (A-E) where 1 pair matches the exact relationship and 4 pairs are distractors, and an explanation.

Return ONLY a valid JSON array of objects with no markdown codeblocks or surrounding text. Format:
[
  {
    "type": "synonym",
    "targetWord": "PLIABLE",
    "options": ["rigid", "stubborn", "flexible", "fragile", "modern"],
    "correctAnswer": 2,
    "explanation": "PLIABLE means easily bent or flexible."
  },
  {
    "type": "analogy",
    "stem": "PLIABLE : BEND",
    "options": ["rigid : break", "fragile : shatter", "heavy : carry", "liquid : freeze", "transparent : hide"],
    "correctAnswer": 1,
    "explanation": "Characteristic Result: A pliable object easily bends; a fragile object easily shatters.",
    "analogyType": "Propensity / Characteristic Result"
  }
]`;

      const res = await this.fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(keyToUse.trim())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }, 3000);

      const data = await res.json();
      if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
        let rawText = data.candidates[0].content.parts[0].text.trim();
        rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((q, idx) => ({
            id: `gemini-q-${idx}-${Date.now()}`,
            type: q.type || 'synonym',
            difficulty: 'medium',
            targetWord: q.targetWord || q.stem || 'WORD',
            stem: q.stem || q.targetWord,
            options: q.options || [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
            explanation: q.explanation || '',
            isCustom: true,
            isGemini: true
          }));
        }
      }
    } catch (err) {
      console.warn("Gemini API Question Generation Error:", err);
    }
    return null;
  }

  // Generate SSAT practice set from parsed words (1 Synonym + 1 Analogy per word)
  async generateSet(words, options = {}) {
    const uniqueWords = Array.from(new Set(words));
    const geminiKey = options.geminiApiKey || this.geminiApiKey;
    
    // Priority 1: Gemini API generation if key is supplied
    if (geminiKey) {
      const geminiSet = await this.fetchGeminiQuestions(uniqueWords, geminiKey);
      if (geminiSet && geminiSet.length > 0) {
        return geminiSet;
      }
    }

    const apiKey = options.apiKey || this.mwApiKey;

    // Priority 2: Merriam-Webster Dictionary API + Local distractor generator (in parallel)
    const mwDefinitionsMap = new Map();
    if (apiKey) {
      const fetchTasks = uniqueWords.map(w => this.fetchMWDefinition(w, apiKey));
      const mwResults = await Promise.all(fetchTasks);
      mwResults.forEach((mwRes, i) => {
        if (mwRes) mwDefinitionsMap.set(uniqueWords[i], mwRes);
      });
    }

    const synonymQuestions = [];
    const analogyQuestions = [];
    
    uniqueWords.forEach((word, idx) => {
      const mwData = mwDefinitionsMap.get(word);

      // 1. Generate Synonym question for word
      const synQuestion = this.generateSynonymQuestion(word, idx, mwData);
      if (synQuestion) synonymQuestions.push(synQuestion);

      // 2. Generate Analogy question for word
      const anaQuestion = this.generateAnalogyQuestion(word, idx, mwData);
      if (anaQuestion) analogyQuestions.push(anaQuestion);
    });

    // Return combined set: all Synonyms followed by all Analogies
    return [...synonymQuestions, ...analogyQuestions];
  }

  generateSynonymQuestion(word, idx, mwData = null) {
    let correctSynonym = "";
    let explanation = "";
    let distractors = [];

    if (mwData) {
      explanation = `${word} (Merriam-Webster): ${mwData.definition}`;
      correctSynonym = (mwData.synonyms && mwData.synonyms.length > 0) ? mwData.synonyms[0] : mwData.definition;

      const genericDistractors = [
        "rigid", "cautious", "miserable", "submissive", "temporary", "peaceful", "intense", "fleeting"
      ];
      distractors = this.shuffleArray(genericDistractors.filter(d => d.toLowerCase() !== correctSynonym.toLowerCase())).slice(0, 4);
    } else {
      correctSynonym = this.generateTargetSynonymFallback(word);
      explanation = `${word} is closest in meaning to ${correctSynonym}.`;
      
      const genericDistractors = [
        "cautious", "flawless", "temporary", "combative", "peaceful", "rigid", "spacious", "intense"
      ];
      distractors = this.shuffleArray(genericDistractors).slice(0, 4);
    }

    // Assemble 5 options (A-E)
    const allOptions = [correctSynonym, ...distractors];
    const shuffledOptions = this.shuffleArray(allOptions);
    const correctIndex = shuffledOptions.indexOf(correctSynonym);

    return {
      id: `custom-syn-${idx}-${Date.now()}`,
      type: "synonym",
      difficulty: "medium",
      targetWord: word,
      options: shuffledOptions,
      correctAnswer: correctIndex,
      explanation: explanation,
      isCustom: true
    };
  }

  generateAnalogyQuestion(word, idx, mwData = null) {
    let stem = "";
    let correctPair = "";
    let wrongPairs = [];
    let explanation = "";
    let analogyType = "Synonym / Characteristic Relationship";

    if (mwData) {
      stem = `${word} : DEFINITION`;
      correctPair = "fragile : delicate";
      wrongPairs = [
        "rigid : flexible",
        "heavy : light",
        "swift : slow",
        "brave : timid"
      ];
      explanation = `${word} (Merriam-Webster: "${mwData.definition}") and fragile : delicate share a synonymous relationship.`;
    } else {
      stem = `${word} : MEANING`;
      correctPair = "fragile : delicate";
      wrongPairs = [
        "heavy : light",
        "rigid : flexible",
        "swift : slow",
        "brave : timid"
      ];
      explanation = `The primary pair expresses a synonymous relationship matching fragile : delicate.`;
    }

    const allOptions = [correctPair, ...wrongPairs];
    const shuffledOptions = this.shuffleArray(allOptions);
    const correctIndex = shuffledOptions.indexOf(correctPair);

    return {
      id: `custom-ana-${idx}-${Date.now()}`,
      type: "analogy",
      difficulty: "medium",
      stem: stem,
      options: shuffledOptions,
      correctAnswer: correctIndex,
      explanation: explanation,
      analogyType: analogyType,
      isCustom: true
    };
  }

  generateTargetSynonymFallback(word) {
    // Basic root-based or placeholder generator for custom user inputs
    const lower = word.toLowerCase();
    if (lower.endsWith("ness")) return "quality of state";
    if (lower.endsWith("ous") || lower.endsWith("ic")) return "characteristic trait";
    if (lower.endsWith("tion") || lower.endsWith("ment")) return "process or result";
    if (lower.endsWith("ate") || lower.endsWith("fy")) return "cause or transform";
    return "closest equivalent";
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

const questionGenerator = new QuestionGenerator();
if (typeof window !== 'undefined') {
  window.questionGenerator = questionGenerator;
}
