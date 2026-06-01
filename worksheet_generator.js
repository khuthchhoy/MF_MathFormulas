class WorksheetEngine {
    constructor(registry) {
        this.registry = registry;
        this.currentData = [];
    }
    
    // Helper to extract generators based on difficulty level
    getGenerators(topic, difficulty) {
        if (!this.registry[topic]) return [];
        if (difficulty === 'all') {
            return [
                ...(this.registry[topic].easy || []),
                ...(this.registry[topic].med || []),
                ...(this.registry[topic].hard || [])
            ];
        }
        return this.registry[topic][difficulty] || [];
    }

    // Now accepts an Array of subjects
    generateProblems(subjects, difficulty, numProblems) {
        const problems = [];
        const seenExprs = new Set();
        
        if (!subjects || subjects.length === 0) return problems;

        // Smart difficulty tuning for parameter bounds
        let minA=2, maxA=9, minB=2, maxB=9, minC=1, maxC=5, minD=2, maxD=5;
        if (difficulty === 'easy') {
            minA = 1; maxA = 5; minB = 1; maxB = 5;
            minC = 1; maxC = 3; minD = 2; maxD = 3;
        } else if (difficulty === 'hard') {
            minA = -5; maxA = 12; minB = -5; maxB = 12;
            minC = -3; maxC = 8; minD = -3; maxD = 8;
        } else if (difficulty === 'all') {
            minA = -3; maxA = 10; minB = -3; maxB = 10;
            minC = 1; maxC = 6; minD = 2; maxD = 6;
        }
        
        // Smart distribution: Allocate problems evenly across selected subjects
        let baseCount = Math.floor(numProblems / subjects.length);
        let remainder = numProblems % subjects.length;
        
        let shuffledSubjects = Utils.shuffle([...subjects]);
        let subjectCounts = {};
        shuffledSubjects.forEach((topic, index) => {
            subjectCounts[topic] = baseCount + (index < remainder ? 1 : 0);
        });

        for (const topic of subjects) {
            const needed = subjectCounts[topic];
            if (needed === 0) continue;
            
            const generators = this.getGenerators(topic, difficulty);
            if (generators.length === 0) continue;
            
            let generatedForTopic = 0;
            let consecutiveFailures = 0;
            
            // Generate until we meet the quota OR until we detect we've exhausted all unique combinations
            while (generatedForTopic < needed) {
                // Pick a random generator from the topic
                const generator = generators[Utils.getRnd(0, generators.length - 1)];
                let attempts = 0;
                let found = false;
                
                while (attempts < 30) {
                    const a = Utils.getRnd(minA, maxA), 
                          b = Utils.getRnd(minB, maxB), 
                          c = Utils.getRnd(minC, maxC), 
                          d = Utils.getRnd(minD, maxD);
                    
                    try {
                        const result = generator(a, b, c, d);
                        
                        if (result && result.expr && !seenExprs.has(result.expr)) {
                            seenExprs.add(result.expr);
                            if (result.sol) result.sol = Utils.formatSolution(result.sol);
                            problems.push(result);
                            generatedForTopic++;
                            found = true;
                            break;
                        }
                    } catch(e) {
                        console.warn("Generator error:", e);
                    }
                    attempts++;
                }
                
                if (!found) {
                    consecutiveFailures++;
                    // If we fail 50 consecutive times to find ANY unique problem, the topic is likely exhausted
                    if (consecutiveFailures > 50) {
                        console.warn(`Exhausted unique problems for topic: ${topic}`);
                        break; 
                    }
                } else {
                    consecutiveFailures = 0; // Reset failure counter on success
                }
            }
        }
        
        // Fill Remaining Slots if any topic fell short (e.g., ran out of unique problems)
        const remainingNeeded = numProblems - problems.length;
        if (remainingNeeded > 0) {
            let availableGenerators = [];
            subjects.forEach(topic => {
                availableGenerators.push(...this.getGenerators(topic, difficulty));
            });
            
            if (availableGenerators.length > 0) {
                let consecutiveFailures = 0;
                while (problems.length < numProblems) {
                    const generator = availableGenerators[Utils.getRnd(0, availableGenerators.length - 1)];
                    let attempts = 0;
                    let found = false;
                    while (attempts < 30) {
                        const a = Utils.getRnd(minA, maxA), 
                              b = Utils.getRnd(minB, maxB), 
                              c = Utils.getRnd(minC, maxC), 
                              d = Utils.getRnd(minD, maxD);
                        try {
                            const result = generator(a, b, c, d);
                            if (result && result.expr && !seenExprs.has(result.expr)) {
                                seenExprs.add(result.expr);
                                if (result.sol) result.sol = Utils.formatSolution(result.sol);
                                problems.push(result);
                                found = true;
                                break;
                            }
                        } catch(e) {
                            console.warn("Generator error:", e);
                        }
                        attempts++;
                    }
                    
                    if (!found) {
                        consecutiveFailures++;
                        // Global exhaustion check
                        if (consecutiveFailures > 100) {
                            console.warn("Global generator pool exhausted of unique combinations.");
                            break;
                        }
                    } else {
                        consecutiveFailures = 0;
                    }
                }
            }
        }
        
        // Shuffle the final list so topics are mixed throughout the worksheet
        this.currentData = Utils.shuffle(problems);
        return this.currentData;
    }
}

// =========================================
// Save setting and loadSetting
// =========================================
function loadSettings(jsonString) {
    const saved = jsonString || localStorage.getItem('worksheetSettingsForCalculus');
    
    if (saved) {
        try {
            const s = JSON.parse(saved);
            
            // 1. Handle UI Elements
            if (s.subjects && Array.isArray(s.subjects)) {
                document.querySelectorAll('#subject-list input[type="checkbox"]').forEach(cb => {
                    cb.checked = s.subjects.includes(cb.value);
                });
            }
            if (s.numProblems && document.getElementById('num-problems')) {
                document.getElementById('num-problems').value = s.numProblems;
            }
            if (s.columns && document.getElementById('num-columns')) {
                document.getElementById('num-columns').value = s.columns;
                document.documentElement.style.setProperty('--grid-cols', s.columns);
            }
            if (s.showAnswers !== undefined && document.getElementById('show-answers')) {
                document.getElementById('show-answers').checked = s.showAnswers;
            }
            if (s.showSolutions !== undefined && document.getElementById('show-solutions')) {
                document.getElementById('show-solutions').checked = s.showSolutions;
            }
            
            if (s.difficulty) {
                document.querySelectorAll('.segment').forEach(btn => btn.classList.remove('active'));
                const activeBtn = document.getElementById('seg-' + s.difficulty);
                if (activeBtn) activeBtn.classList.add('active');
            }

            // 2. Safely Load Problems
            if (s.savedData && s.savedData.length > 0) {
                Engine.currentData = s.savedData;
                App.renderWorksheet();
                return; // CRITICAL: Stop here so it doesn't generate new problems
            }
        } catch (e) {
            console.error("Parse error:", e);
        }
    }
    
    // Fallback if no valid problems exist
    App.generateNewData();
}

function saveSettingsForCalculus() {
    const activeSegment = document.querySelector('.segment.active');
    const settings = {
        subjects: App.getSelectedSubjects(), // Saving as an array
        difficulty: activeSegment ? activeSegment.dataset.diff : 'easy',
        numProblems: document.getElementById('num-problems')?.value || 10,
        columns: document.getElementById('num-columns')?.value || 1,
        showAnswers: document.getElementById('show-answers')?.checked || false,
        showSolutions: document.getElementById('show-solutions')?.checked || false,
        savedData: (typeof Engine !== 'undefined' && Engine?.currentData?.length > 0) ? Engine.currentData : []
    };
    localStorage.setItem('worksheetSettingsForCalculus', JSON.stringify(settings));
    if (window.webkit && window.webkit.messageHandlers.saveSettingsForCalculus) {
        window.webkit.messageHandlers.saveSettingsForCalculus.postMessage(JSON.stringify(settings));
    }
}

// ==========================================
// UI & STATE CONTROLLER
// ==========================================
const Engine = new WorksheetEngine(ProblemRegistry);

const App = {
    init: () => {
        App.populateSubjects();
        
        if (window.webkit && window.webkit.messageHandlers.saveSettingsForCalculus) {
            console.log("Waiting for iOS to inject settings...");
        } else {
            // Running in a normal browser, safe to load immediately
            loadSettings(); 
        }
    },
    
    populateSubjects: () => {
        const container = document.getElementById('subject-list');
        container.innerHTML = '';
        
        Object.keys(ProblemRegistry).forEach(key => {
            const row = document.createElement('div');
            row.className = 'row'; // Utilize your existing iOS row styling
            
            const displayName = key.charAt(0).toUpperCase() + key.slice(1);
            
            row.innerHTML = `
                <label>${displayName}</label>
                <label class="switch">
                    <input type="checkbox" value="${key}" checked onchange="App.generateNewData()">
                    <span class="slider"></span>
                </label>
            `;
            container.appendChild(row);
        });
    },
    
    getSelectedSubjects: () => {
        const checked = document.querySelectorAll('#subject-list input:checked');
        return Array.from(checked).map(cb => cb.value);
    },
    
    toggleSettings: () => {
        document.getElementById('settings-panel').classList.toggle('hidden');
        triggerHaptic();
    },
    
    setDifficulty: (level) => {
        document.querySelectorAll('.segment').forEach(seg => seg.classList.remove('active'));
        document.getElementById('seg-' + level).classList.add('active');
        App.generateNewData();
    },
    
    updateColumns: () => {
        const cols = document.getElementById('num-columns').value || 1;
        document.documentElement.style.setProperty('--grid-cols', cols);
        saveSettingsForCalculus();
    },
    
    generateNewData: () => {
        const subjects = App.getSelectedSubjects();
        const activeSegment = document.querySelector('.segment.active');
        const difficulty = activeSegment ? activeSegment.dataset.diff : 'easy';
        
        // Allow up to 5000 problems, dynamically guarded by exhaustion logic
        let numProblems = parseInt(document.getElementById('num-problems')?.value) || 10;
        const MAX_PROBLEMS = 5000;
        
        if (numProblems > MAX_PROBLEMS) {
            numProblems = MAX_PROBLEMS;
            if (document.getElementById('num-problems')) {
                document.getElementById('num-problems').value = MAX_PROBLEMS; // Update UI to reflect cap
            }
        } else if (numProblems < 1) {
            numProblems = 1;
            if (document.getElementById('num-problems')) {
                document.getElementById('num-problems').value = 1;
            }
        }
        
        if (subjects.length === 0) {
            document.getElementById('worksheet-grid').innerHTML = '<p style="text-align:center; padding: 20px; width:100%; color: var(--text-muted);">Please select at least one subject.</p>';
            return;
        }
        
        App.updateColumns();
        Engine.generateProblems(subjects, difficulty, numProblems);
        
        App.renderWorksheet();
        saveSettingsForCalculus();
    },
    
    renderWorksheet: () => {
        const grid = document.getElementById('worksheet-grid');
        const showAns = document.getElementById('show-answers').checked;
        const showSol = document.getElementById('show-solutions').checked;
        let html = '';
        
        Engine.currentData.forEach((item, index) => {
            // Ensure katex is available before rendering
            if (typeof katex !== 'undefined') {
                let e = katex.renderToString(item.expr, { displayMode: true, throwOnError: false });
                let a = showAns ? katex.renderToString(item.ans, { displayMode: true, throwOnError: false }) : '';
                let s = showSol ? katex.renderToString(item.sol || '', { displayMode: true, throwOnError: false }) : '';
                
                html += `
                        <div class="math-problem">
                        <div class="prob-header">Problem ${index + 1}</div>
                        <div class="expression">${e}</div>
                        ${showAns ? `<div class="answer">${a}</div>` : ''}
                        ${showSol ? `<div class="solution"><div class="step">Solution:</div>${s}</div>` : ''}
                    </div>`;
            } else {
                html += `<div class="math-problem"><p>KaTeX not loaded.</p></div>`;
            }
        });
        
        grid.innerHTML = html;
        triggerHaptic();
        saveSettingsForCalculus();
    }
};
// Initialize application on load
window.addEventListener('DOMContentLoaded', App.init);
