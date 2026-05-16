
// ==========================================
// WORKSHEET GENERATOR - MINIMAL ALGEBRA VERSION
// ==========================================
window.triggerHaptic = window.triggerHaptic || function () {};

class WorksheetEngine {
    constructor(registry) {
        this.registry = registry;
        this.currentData = [];
    }

    generateProblems(subjects, difficulty, numProblems) {
        let problems = [];
        const seen = new Set();

        subjects.forEach(topic => {
            const pool = this.registry[topic]?.[difficulty] || [];
            if (!pool.length) return;

            const gen = pool[Utils.getRnd(0, pool.length - 1)];
            for (let attempt = 0; attempt < 25; attempt++) {
                const args = Array(4).fill(0).map(() => Utils.getRnd(-10, 10));
                try {
                    const result = gen(...args);
                    if (result?.expr) {
                        // Sanitize math expressions dynamically
                        const cleanExpr = Utils.clean(result.expr);
                        if (!seen.has(cleanExpr)) {
                            seen.add(cleanExpr);
                            problems.push({
                                expr: cleanExpr,
                                ans: Utils.clean(result.ans),
                                sol: Utils.formatSolution(Utils.clean(result.sol))
                            });
                            return;
                        }
                    }
                } catch (e) { console.log(e); }
            }
        });

        // Fill remaining
        let allGens = [];
        subjects.forEach(t => {
            if (this.registry[t]?.[difficulty]) allGens.push(...this.registry[t][difficulty]);
        });

        while (problems.length < numProblems && allGens.length) {
            const gen = allGens[Utils.getRnd(0, allGens.length - 1)];
            for (let attempt = 0; attempt < 25; attempt++) {
                const args = Array(4).fill(0).map(() => Utils.getRnd(-10, 10));
                try {
                    const result = gen(...args);
                    if (result?.expr) {
                        // Sanitize math expressions dynamically
                        const cleanExpr = Utils.clean(result.expr);
                        if (!seen.has(cleanExpr)) {
                            seen.add(cleanExpr);
                            problems.push({
                                expr: cleanExpr,
                                ans: Utils.clean(result.ans),
                                sol: Utils.formatSolution(Utils.clean(result.sol))
                            });
                            break;
                        }
                    }
                } catch (e) {}
            }
        }

        this.currentData = Utils.shuffle(problems).slice(0, numProblems);
    }
}

const Engine = new WorksheetEngine(ProblemRegistry);

const App = {
    init() {
        this.populateSubjects();
        this.loadSettings();
        this.generateNewData();
    },

    populateSubjects() {
        const container = document.getElementById('subject-list');
        if (!container) return;
        container.innerHTML = Object.keys(ProblemRegistry).map(key => `
            <div class="row">
                <label>${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <label class="switch">
                    <input type="checkbox" name="subject" value="${key}" checked onchange="App.generateNewData()">
                    <span class="slider"></span>
                </label>
            </div>
        `).join('');
    },

    getSelectedSubjects() {
        return Array.from(document.querySelectorAll('#subject-list input:checked'))
                    .map(el => el.value);
    },

    toggleSettings() {
        document.getElementById('settings-panel').classList.toggle('hidden');
    },

    setDifficulty(level) {
        document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
        const el = document.getElementById(`seg-${level}`);
        if (el) el.classList.add('active');
        this.generateNewData();
    },

    generateNewData() {
        const subjects = this.getSelectedSubjects();
        const difficulty = document.querySelector('.segment.active')?.dataset.diff || 'med';
        const count = parseInt(document.getElementById('num-problems')?.value) || 10;

        if (subjects.length === 0) {
            document.getElementById('worksheet-grid').innerHTML = 
                '<p style="text-align:center;padding:40px;color:#888;">Please select at least one subject.</p>';
            return;
        }

        Engine.generateProblems(subjects, difficulty, count);
        this.renderWorksheet();
        this.saveSettings();
    },

    renderWorksheet() {
        const grid = document.getElementById('worksheet-grid');
        if (!grid) return;

        const showAns = document.getElementById('show-answers').checked;
        const showSol = document.getElementById('show-solutions').checked;
        let html = '';

        Engine.currentData.forEach((item, i) => {
            try {
                const exprHtml = katex.renderToString(item.expr, {displayMode: true, throwOnError: false});
                const ansHtml = showAns && item.ans ? katex.renderToString(item.ans, {displayMode: true, throwOnError: false}) : '';
                const solHtml = showSol && item.sol ? katex.renderToString(item.sol, {displayMode: true, throwOnError: false}) : '';

                html += `
                    <div class="math-problem">
                        <div class="prob-header">Problem ${i+1}</div>
                        <div class="expression">${exprHtml}</div>
                        ${showAns ? `<div class="answer">${ansHtml}</div>` : ''}
                        ${showSol ? `<div class="solution"><div class="step">Solution:</div>${solHtml}</div>` : ''}
                    </div>`;
            } catch(e) {}
        });

        grid.innerHTML = html || '<p style="padding:40px;text-align:center;color:#888;">No problems generated yet.</p>';
    },

    saveSettings() {
        const settings = {
            subjects: this.getSelectedSubjects(),
            difficulty: document.querySelector('.segment.active')?.dataset.diff || 'med',
            numProblems: document.getElementById('num-problems').value,
            columns: document.getElementById('num-columns').value,
            showAnswers: document.getElementById('show-answers').checked,
            showSolutions: document.getElementById('show-solutions').checked
        };
        localStorage.setItem('calculusWorksheetSettings', JSON.stringify(settings));
    },

    loadSettings() {
        const saved = localStorage.getItem('calculusWorksheetSettings');
        if (!saved) return;
        const s = JSON.parse(saved);

        document.querySelectorAll('#subject-list input').forEach(cb => {
            cb.checked = s.subjects ? s.subjects.includes(cb.value) : true;
        });

        if (s.numProblems) document.getElementById('num-problems').value = s.numProblems;
        if (s.columns) {
            document.getElementById('num-columns').value = s.columns;
            document.documentElement.style.setProperty('--grid-cols', s.columns);
        }
        document.getElementById('show-answers').checked = !!s.showAnswers;
        document.getElementById('show-solutions').checked = !!s.showSolutions;

        if (s.difficulty) {
            document.querySelectorAll('.segment').forEach(el => el.classList.remove('active'));
            const active = document.querySelector(`[data-diff="${s.difficulty}"]`);
            if (active) active.classList.add('active');
        }
    }
};
window.App = App;
window.addEventListener('DOMContentLoaded', () => App.init());