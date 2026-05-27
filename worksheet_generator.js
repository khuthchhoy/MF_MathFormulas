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
        
        // 1. Variety Logic: Try to pick at least one from each selected subject first
        if (subjects.length > 1) {
            for (const topic of subjects) {
                if (problems.length >= numProblems) break;
                
                const generators = this.getGenerators(topic, difficulty);
                if (generators.length === 0) continue;
                
                let foundForTopic = false;
                const shuffledGens = Utils.shuffle([...generators]);
                
                for (const generator of shuffledGens) {
                    let attempts = 0;
                    while (attempts < 30) {
                        const a = Utils.getRnd(2, 9), b = Utils.getRnd(2, 9), c = Utils.getRnd(1, 5), d = Utils.getRnd(2, 5);
                        const result = generator(a, b, c, d);
                        
                        if (!seenExprs.has(result.expr)) {
                            seenExprs.add(result.expr);
                            result.sol = Utils.formatSolution(result.sol);
                            problems.push(result);
                            foundForTopic = true;
                            break;
                        }
                        attempts++;
                    }
                    if (foundForTopic) break;
                }
            }
        }
        
        // 2. Fill Remaining Slots: Pool remaining selected subjects
        let availableGenerators = [];
        subjects.forEach(topic => {
            availableGenerators.push(...this.getGenerators(topic, difficulty));
        });
        
        const remainingNeeded = numProblems - problems.length;
        for (let i = 0; i < remainingNeeded; i++) {
            let foundUnique = false;
            const shuffledGenerators = Utils.shuffle([...availableGenerators]);
            
            for (const generator of shuffledGenerators) {
                let attempts = 0;
                while (attempts < 30) {
                    const a = Utils.getRnd(2, 9), b = Utils.getRnd(2, 9), c = Utils.getRnd(1, 5), d = Utils.getRnd(2, 5);
                    const result = generator(a, b, c, d);
                    
                    if (!seenExprs.has(result.expr)) {
                        seenExprs.add(result.expr);
                        result.sol = Utils.formatSolution(result.sol);
                        problems.push(result);
                        foundUnique = true;
                        break;
                    }
                    attempts++;
                }
                if (foundUnique) break;
            }
        }
        
        this.currentData = problems;
        return problems;
    }
}

// =========================================
// 4. Save setting and loadSetting
// =========================================
function saveSettingsForCalculus() {
    const settings = {
        subjects: App.getSelectedSubjects(),
        difficulty: document.querySelector('.segment.active').dataset.diff,
        numProblems: document.getElementById('num-problems').value,
        columns: document.getElementById('num-columns').value,
        showAnswers: document.getElementById('show-answers').checked,
        showSolutions: document.getElementById('show-solutions').checked,
        savedData: Engine.currentData // <--- Ensure this is included
    };
    
    localStorage.setItem('worksheetSettingsForCalculus', JSON.stringify(settings));
    
    if (window.webkit && window.webkit.messageHandlers.saveSettingsForCalculus) {
        window.webkit.messageHandlers.saveSettingsForCalculus.postMessage(JSON.stringify(settings));
    }
}

function loadSettings(jsonString) {
    const saved = jsonString || localStorage.getItem('worksheetSettingsForCalculus');
    if (saved) {
        const s = JSON.parse(saved);
        
        // 1. Apply UI States
        if (s.subjects && Array.isArray(s.subjects)) {
            document.querySelectorAll('#subject-list input[type="checkbox"]').forEach(cb => {
                cb.checked = s.subjects.includes(cb.value);
            });
        }
        
        if (s.numProblems) document.getElementById('num-problems').value = s.numProblems;
        if (s.columns) {
            document.getElementById('num-columns').value = s.columns;
            document.documentElement.style.setProperty('--grid-cols', s.columns);
        }
        document.getElementById('show-answers').checked = s.showAnswers !== undefined ? s.showAnswers : false;
        document.getElementById('show-solutions').checked = s.showSolutions !== undefined ? s.showSolutions : false;
        
        if (s.difficulty) {
            document.querySelectorAll('.segment').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.segment[data-diff="${s.difficulty}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }

        // 2. Logic Change: Only render saved data if it exists. Otherwise, generate new.
        if (s.savedData && s.savedData.length > 0) {
            Engine.currentData = s.savedData;
            App.renderWorksheet(); 
        } else {
            App.generateNewData();
        }
    } else {
        // No saved settings found, start fresh
        App.generateNewData();
    }
}
/*
function saveSettingsForCalculus() {
    const settings = {
        subjects: App.getSelectedSubjects(), // Saving as an array
        difficulty: document.querySelector('.segment.active').dataset.diff,
        numProblems: document.getElementById('num-problems').value,
        columns: document.getElementById('num-columns').value,
        showAnswers: document.getElementById('show-answers').checked,
        showSolutions: document.getElementById('show-solutions').checked
    };
    localStorage.setItem('worksheetSettingsForCalculus', JSON.stringify(settings));
    if (window.webkit && window.webkit.messageHandlers.saveSettingsForCalculus) {
        window.webkit.messageHandlers.saveSettingsForCalculus.postMessage(JSON.stringify(settings));
    }
}

function loadSettings(jsonString) {
    const saved = jsonString || localStorage.getItem('worksheetSettingsForCalculus');
    if (saved) {
        const s = JSON.parse(saved);
        
        // Handle array of subjects
        if (s.subjects && Array.isArray(s.subjects)) {
            document.querySelectorAll('#subject-list input[type="checkbox"]').forEach(cb => {
                cb.checked = s.subjects.includes(cb.value);
            });
        }
        
        if (s.numProblems) document.getElementById('num-problems').value = s.numProblems;
        if (s.columns) {
            document.getElementById('num-columns').value = s.columns;
            document.documentElement.style.setProperty('--grid-cols', s.columns);
        }
        document.getElementById('show-answers').checked = s.showAnswers || false;
        document.getElementById('show-solutions').checked = s.showSolutions || false;
        
        if (s.difficulty) {
            document.querySelectorAll('.segment').forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.segment[data-diff="${s.difficulty}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }
    }
    App.generateNewData();
}
*/
// ==========================================
// 5. UI & STATE CONTROLLER
// ==========================================
const Engine = new WorksheetEngine(ProblemRegistry);

const App = {
    init: () => {
        App.populateSubjects();
        loadSettings(); 
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
        triggerHaptic();
        App.generateNewData();
    },
    
    updateColumns: () => {
        const cols = document.getElementById('num-columns').value || 1;
        document.documentElement.style.setProperty('--grid-cols', cols);
        saveSettingsForCalculus();
    },
    
    generateNewData: () => {
        const subjects = App.getSelectedSubjects();
        const difficulty = document.querySelector('.segment.active').dataset.diff;
        const numProblems = parseInt(document.getElementById('num-problems').value) || 10;
        
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
