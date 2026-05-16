
const limit = {
        easy: [
            // Family: Linear Direct Substitution ax+b
            (a, b, c) => {
                // 1. Format the expression: ax + b
                const exprStr = Utils.linear(a, b);
                const result = a * c + b;
                // 2. Format the substitution step
                // Handle the 'ax' part of the substitution
                let termA = "";
                if (a === 1) termA = `${c}`;
                else if (a === -1) termA = `-(${c})`;
                else termA = `${a}(${c})`;
                // Handle the 'b' part of the substitution
                const termB = b > 0 ? ` + ${b}` : b < 0 ? ` - ${Math.abs(b)}` : "";
                return {
                    expr: `\\lim_{x \\to ${c}} (${exprStr})`,
                    ans: `= ${result}`,
                    sol: `\\begin{aligned} 
                        &\\text{By direct substitution:} \\\\ 
                        L &= ${termA}${termB} \\\\ 
                        &= ${result}
                        \\end{aligned}`
                };
            },
            // Family: (ax^2 + bx) / cx of 0/0
            (a, b, c) => {
                // 1. Format the main expressions
                // Numerator: ax^2 + bx + 0
                const exprNum = Utils.poly2(a, b, 0);
                // Denominator: cx + 0
                const exprDen = Utils.linear(c, 0);
                // The factor left after pulling out x: ax + b
                const factorRemaining = Utils.linear(a, b);

                // 2. Simplify the final fraction (b / c)
                const common = Utils.gcd(b, c);
                let simB = b / common;
                let simC = c / common;

                // Normalize signs (e.g., 2/-3 -> -2/3)
                if (simC < 0) {
                    simB = -simB;
                    simC = -simC;
                }

                const rawAns = `\\frac{${b}}{${c}}`;
                const finalAns = simC === 1 ? `${simB}` : `\\frac{${simB}}{${simC}}`;
                const needsSimplification = finalAns !== rawAns;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{${exprNum}}{${exprDen}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\frac{x(${factorRemaining})}{${exprDen}} \\\\ 
                        &= \\lim_{x \\to 0} \\frac{${factorRemaining}}{${c}} \\\\ 
                        &= \\frac{${a}(0) + ${b}}{${c}} = ${rawAns}${needsSimplification ? ` = ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },
            // Family: Rational Function at Infinity
            (a, b, c, d) => {
                // 1. Format the polynomials cleanly
                // Numerator: bx^2 + cx + 0
                const exprNum = Utils.poly2(b, c, 0);
                // Denominator: dx^2 + 0x - 1
                const exprDen = Utils.poly2(d, 0, -1);

                // 2. Simplify the final fraction
                const common = Utils.gcd(b, d);
                let simNum = b / common;
                let simDen = d / common;

                // Fix negative signs (move to numerator)
                if (simDen < 0) {
                    simNum = -simNum;
                    simDen = -simDen;
                }

                const finalAns = simDen === 1 ? `${simNum}` : `\\frac{${simNum}}{${simDen}}`;
                const rawAns = `\\frac{${b}}{${d}}`;

                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{${exprNum}}{${exprDen}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to \\infty} \\frac{\\frac{${exprNum}}{x^2}}{\\frac{${exprDen}}{x^2}} \\\\ 
                        &= \\lim_{x \\to \\infty} \\frac{${b} + \\frac{${c}}{x}}{${d} - \\frac{1}{x^2}} \\\\ 
                        &= \\frac{${b} + 0}{${d} - 0} = ${rawAns}${finalAns !== rawAns ? ` = ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },
            // Family: Simplified x^2 - c^2 (Difference of Squares)
            (c) => {
                // 1. Format the expressions
                // Numerator: 1x^2 + 0x - c^2
                const exprNum = Utils.poly2(1, 0, -(c * c));
                // Denominator: x - c
                const exprDen = Utils.linear(1, -c);

                // 2. Format the factored forms using minusA
                // (x - c) and (x + c)
                const factor1 = Utils.minusA(c); 
                const factor2 = Utils.minusA(-c); 

                // 3. Format the linear result after cancellation: x + c
                const remainingLin = Utils.linear(1, c);

                // 4. Substitution formatting (e.g., "3 + 3" or "-3 - 3")
                const subStr = c < 0 ? `${c} - ${Math.abs(c)}` : `${c} + ${c}`;
                const finalAns = 2 * c;

                return {
                    expr: `\\lim_{x \\to ${c}} \\frac{${exprNum}}{${exprDen}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to ${c}} \\frac{${factor1}${factor2}}{${exprDen}} \\\\ 
                        &= \\lim_{x \\to ${c}} (${remainingLin}) \\\\ 
                        &= ${subStr} = ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Quadratic Rational Cancellation (x^2+bx+c)/(x^2+px+q) -> 0/0
            (a, m, n) => {
                // 1. Generate beautifully formatted polynomials using Utils.poly2
                // Expanded form of (x - a)(x + m) is x^2 + (m - a)x - am
                const exprNum = Utils.poly2(1, m - a, -a * m);
                const exprDen = Utils.poly2(1, n - a, -a * n);

                // 2. Format the factored forms elegantly using Utils.minusA
                // Passing -m and -n flips the sign inside the helper to output (x + m) / (x + n) properly
                const factorA = Utils.minusA(a);
                const factorM = Utils.minusA(-m); 
                const factorN = Utils.minusA(-n); 

                // 3. Format the linear expressions after cancellation
                const linM = Utils.linear(1, m);
                const linN = Utils.linear(1, n);

                // 4. Format substitution safely (e.g., "3 - 2" instead of "3 + -2")
                const subNum = m < 0 ? `${a} - ${Math.abs(m)}` : `${a} + ${m}`;
                const subDen = n < 0 ? `${a} - ${Math.abs(n)}` : `${a} + ${n}`;

                // 5. Calculate and simplify the final answer using Utils.gcd
                let numResult = a + m;
                let denResult = a + n;
                let finalAns = "";
                let simplifiedStep = "";
                
                const div = Utils.gcd(numResult, denResult);
                let simNum = numResult / div;
                let simDen = denResult / div;
                
                // Normalize negative fractions (e.g., 2/-3 becomes -2/3)
                if (simDen < 0) {
                    simNum = -simNum;
                    simDen = -simDen;
                }
                
                if (simDen === 1) {
                    finalAns = `${simNum}`; // Resolves to an integer
                } else if (simNum === 0) {
                    finalAns = `0`;         // Resolves to zero
                } else {
                    finalAns = `\\frac{${simNum}}{${simDen}}`;
                }
                
                // Only show the equals sign for the simplified fraction if it actually changed
                const unsimplifiedAns = `\\frac{${numResult}}{${denResult}}`;
                if (finalAns !== unsimplifiedAns && finalAns !== '0') {
                    simplifiedStep = ` = ${finalAns}`;
                }

                return {
                    expr: `\\lim_{x \\to ${a}} \\frac{${exprNum}}{${exprDen}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to ${a}} \\frac{${factorA}${factorM}}{${factorA}${factorN}} \\\\ 
                        &= \\lim_{x \\to ${a}} \\frac{${linM}}{${linN}} \\\\ 
                        &= \\frac{${subNum}}{${subDen}} = ${unsimplifiedAns}${simplifiedStep}
                        \\end{aligned}`
                };
            },
            // Family: Quadratic-Linear Rational Cancellation (mx^2 + nx + p)/(ax+b) -> (0/0)
            (a, m, k) => {
                // Coefficients for mx^2 + nx + p
                const n = m * (k - a);
                const p = -m * a * k;

                // 1. Format the main polynomials
                const exprNum = Utils.poly2(m, n, p);
                // Utils.linear(1, -a) outputs "x - 2", no parentheses, perfect for the initial denominator
                const exprDenStr = Utils.linear(1, -a); 

                // 2. Format the factored forms
                // Utils.minusA(a) outputs "(x - 2)", with parentheses, perfect for the cancellation step
                const factorA = Utils.minusA(a); 
                
                // The remaining factor is (mx + mk)
                const constTerm = m * k;
                const factor2 = Utils.linear(m, constTerm); 

                // 3. Format the substitution calculation safely
                const term1 = m * a;
                const subStr = constTerm < 0 
                    ? `${term1} - ${Math.abs(constTerm)}` 
                    : `${term1} + ${constTerm}`;
                    
                const finalAns = m * (a + k);

                return {
                    expr: `\\lim_{x \\to ${a}} \\frac{${exprNum}}{${exprDenStr}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution } x = ${a} \\text{ yields } \\frac{0}{0}. \\\\ 
                        &L = \\lim_{x \\to ${a}} \\frac{${factorA}(${factor2})}{${exprDenStr}} \\\\ 
                        &= \\lim_{x \\to ${a}} (${factor2}) \\\\ 
                        &= ${subStr} = ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Basic Trigonometric Evaluation
            () => {
                // 1. Define "Nice" Unit Circle Points (Fixed the 0 point)
                const points = [
                    { display: '0', val: 0, sin: '0', cos: '1' }, // Added sin and cos here
                    { display: '\\frac{\\pi}{6}', val: Math.PI / 6, sin: '\\frac{1}{2}', cos: '\\frac{\\sqrt{3}}{2}' },
                    { display: '\\frac{\\pi}{4}', val: Math.PI / 4, sin: '\\frac{\\sqrt{2}}{2}', cos: '\\frac{\\sqrt{2}}{2}' },
                    { display: '\\frac{\\pi}{3}', val: Math.PI / 3, sin: '\\frac{\\sqrt{3}}{2}', cos: '\\frac{1}{2}' },
                    { display: '\\frac{\\pi}{2}', val: Math.PI / 2, sin: '1', cos: '0' },
                    { display: '\\pi', val: Math.PI, sin: '0', cos: '-1' }
                ];

                // 2. Select random point and function
                const p = points[Utils.getRnd(0, points.length - 1)];
                const type = Utils.getRnd(0, 1); // 0 for sin, 1 for cos
                
                const funcName = type === 0 ? '\\sin' : '\\cos';
                const finalAns = type === 0 ? p.sin : p.cos;

                return {
                    expr: `\\lim_{x \\to ${p.display}} ${funcName}(x)`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{By direct substitution:} \\\\ 
                        L &= ${funcName}\\left(${p.display}\\right) \\\\ 
                        &= ${finalAns}
                        \\end{aligned}`
                };
            },
            () => {
                const a = Utils.getRnd(1, 9);
                const b = Utils.getRnd(1, 9);
                const common = Utils.gcd(a, b);
                const finalAns = (b / common) === 1 ? `${a / common}` : `\\frac{${a / common}}{${b / common}}`;
                const factor = b === 1 ? `${a}` : `\\frac{${a}}{${b}}`;

                const arg = Utils.linear(a, 0); // "x" or "2x"
                const denom = Utils.linear(b, 0); // "x" or "3x"

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${arg})}{${denom}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Using the fundamental limit } \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1: \\\\ 
                        L &= \\frac{${a}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{\\sin(${arg})}{${arg}} \\\\ 
                        &= ${factor} \\cdot (1) = ${finalAns}
                        \\end{aligned}`
                };
            },
            () => {
                const a = Utils.getRnd(1, 9);
                const b = Utils.getRnd(1, 9);
                const common = Utils.gcd(a, b);
                const finalAns = (b / common) === 1 ? `${a / common}` : `\\frac{${a / common}}{${b / common}}`;

                const arg = Utils.linear(a, 0);
                const denom = Utils.linear(b, 0);

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\tan(${arg})}{${denom}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Rewrite using } \\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}: \\\\ 
                        L &= \\lim_{x \\to 0} \\left( \\frac{\\sin(${arg})}{${denom}} \\cdot \\frac{1}{\\cos(${arg})} \\right) \\\\ 
                        &= \\left( \\frac{${a}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{\\sin(${arg})}{${arg}} \\right) \\cdot \\lim_{x \\to 0} \\frac{1}{\\cos(${arg})} \\\\ 
                        &= \\frac{${a}}{${b}} \\cdot (1) \\cdot \\frac{1}{\\cos(0)} = ${finalAns}
                        \\end{aligned}`
                };
            },
            () => {
                const a = Utils.getRnd(1, 9);
                const b = Utils.getRnd(1, 9);

                const arg = Utils.linear(a, 0);
                const denom = Utils.linear(b, 0);

                return {
                    expr: `\\lim_{x \\to 0} \\frac{1 - \\cos(${arg})}{${denom}}`,
                    ans: `= 0`,
                    sol: `\\begin{aligned} 
                        &\\text{Using the special limit } \\lim_{u \\to 0} \\frac{1 - \\cos u}{u} = 0: \\\\ 
                        L &= \\frac{${a}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{1 - \\cos(${arg})}{${arg}} \\\\ 
                        &= \\frac{${a}}{${b}} \\cdot (0) = 0
                        \\end{aligned}`
                };
            },
            // Family: Standard Trig Limit
            (a, b) => {
                const valA = Math.abs(a);
                // Use Utils.linear to ensure if b=1, we get "x" instead of "1x"
                const denStr = Utils.linear(b, 0);

                // 1. Simplify the fraction (a / b)
                const common = Utils.gcd(valA, b);
                let simA = valA / common;
                let simB = b / common;

                // Normalize signs (move negative to numerator)
                if (simB < 0) {
                    simA = -simA;
                    simB = -simB;
                }

                const rawAns = `\\frac{${valA}}{${b}}`;
                const finalAns = simB === 1 ? `${simA}` : `\\frac{${simA}}{${simB}}`;
                const needsSimp = finalAns !== rawAns;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${valA}x)}{${denStr}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\frac{\\sin(${valA}x)}{${b}x} \\\\ 
                        &= \\frac{${valA}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{\\sin(${valA}x)}{${valA}x} \\\\ 
                        &\\text{Using the identity } \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1: \\\\ 
                        &= \\frac{${valA}}{${b}} \\cdot (1) = ${rawAns}${needsSimp ? ` = ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },
            //
            (a, b, c) => {
                const inner = Utils.linear(1, c); // Formats as "x + c" or "x - c"
                
                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{\\ln(${inner})}{x}`,
                    ans: `= 0`,
                    sol: `\\begin{aligned} 
                        &\\text{Recall the property that for large } x,\\\\
                        &\\ln(x) \\text{ grows slower than any power } x^p. \\\\ 
                        &\\text{Specifically, for } x+${c} > 1,\\\\
                        &\\text{ we have the inequality: } 0 < \\ln(${inner}) < 2\\sqrt{${inner}}. \\\\ 
                        &\\text{Divide the entire inequality by } x: \\\\ 
                        &0 < \\frac{\\ln(${inner})}{x} < \\frac{2\\sqrt{x + ${c}}}{x} \\\\ 
                        &\\text{Simplify the upper bound:} \\\\ 
                        &\\frac{2\\sqrt{x + ${c}}}{x} = \\frac{2\\sqrt{x(1 + \\frac{${c}}{x})}}{x} = \\frac{2\\sqrt{1 + \\frac{${c}}{x}}}{\\sqrt{x}} \\\\ 
                        &\\text{Taking the limit as } x \\to \\infty: \\\\ 
                        &\\lim_{x \\to \\infty} 0 = 0 \\\\ 
                        &\\lim_{x \\to \\infty} \\frac{2\\sqrt{1 + \\frac{${c}}{x}}}{\\sqrt{x}} = \\frac{2\\sqrt{1 + 0}}{\\infty} = 0 \\\\ 
                        &\\text{By the Squeeze Theorem, since both bounds approach 0:} \\\\ 
                        L &= 0
                        \\end{aligned}`
                };
            },
            // Family: Rational Function at Infinity (Equal Degrees)
            (a, b, c) => {
                // 1. Setup parameters
                const n = Utils.getRnd(2, 4); // Randomize the highest power (x^2, x^3, or x^4)
                const d = Utils.getRnd(1, 5); // Denominator leading coefficient
                
                // 2. Formatting the Polynomials
                // Handle the x^(n-1) term cleanly so "x^1" becomes "x"
                const pow2 = n === 2 ? "x" : `x^{${n-1}}`;
                const bAbs = Math.abs(b);
                const bTerm = bAbs === 1 ? pow2 : `${bAbs}${pow2}`;
                
                // Construct numerator: ax^n + bx^(n-1)
                const polyTop = `${a === 1 ? "" : a === -1 ? "-" : a}x^{${n}} ${b > 0 ? "+" : "-"} ${bTerm}`;
                
                // Construct denominator: dx^n + c
                const polyBottom = `${d === 1 ? "" : d}x^{${n}} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`;

                // 3. Calculate Final Answer
                const common = Utils.gcd(Math.abs(a), Math.abs(d));
                const finalNum = a / common;
                const finalDen = d / common;
                
                // Format answer as integer or fraction
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{${polyTop}}{${polyBottom}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{To find the limit at infinity, divide every term by the highest power in the denominator, } x^{${n}}: \\\\ 
                        L &= \\lim_{x \\to \\infty} \\frac{\\frac{${a}x^{${n}}}{x^{${n}}} ${b > 0 ? "+" : "-"} \\frac{${bAbs}x^{${n-1}}}{x^{${n}}}}{\\frac{${d}x^{${n}}}{x^{${n}}} ${c > 0 ? "+" : "-"} \\frac{${Math.abs(c)}}{x^{${n}}}} \\\\ 
                        &= \\lim_{x \\to \\infty} \\frac{${a} ${b > 0 ? "+" : "-"} \\frac{${bAbs}}{x}}{${d} ${c > 0 ? "+" : "-"} \\frac{${Math.abs(c)}}{x^{${n}}}} \\\\ 
                        &\\text{Since } \\lim_{x \\to \\infty} \\frac{k}{x^m} = 0 \\text{ for any constant } k \\text{ and } m > 0: \\\\ 
                        L &= \\frac{${a} ${b > 0 ? "+" : "-"} 0}{${d} ${c > 0 ? "+" : "-"} 0} = \\frac{${a}}{${d}} \\\\ 
                        &= ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Exponential vs. Polynomial Growth (Growth Rate Comparison)
            () => {
                // Randomize the power (n) between 2 and 6
                const n = Utils.getRnd(2, 6);

                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{e^x}{x^{${n}}}`,
                    ans: `= \\infty`,
                    sol: `\\begin{aligned} 
                        &\\text{Compare the growth rates as } x \\to \\infty: \\\\ 
                        &\\text{ Numerator: } e^x \\text{ (Exponential growth)} \\\\ 
                        &\\text{ Denominator: } x^{${n}} \\text{ (Polynomial growth)} \\\\ 
                        &\\text{As } x \\text{ increases without bound, exponential growth} \\\\ 
                        &\\text{eventually outpaces polynomial growth of any degree.} \\\\ 
                        &\\text{Since } e^x \\gg x^{${n}} \\text{ for large } x: \\\\ 
                        L &= \\infty 
                        \\end{aligned}`
                };
            },
            // Family: Polynomial vs. Exponential Growth (Flipped)
            (a, b) => {
                // Randomize the numerator power (n) between 2 and 5
                const n = Utils.getRnd(2, 5);
                
                // Format the exponent: "e^{2x}" or just "e^x"
                const exponent = b === 1 ? "x" : `${b}x`;

                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{x^{${n}}}{e^{${exponent}}}`,
                    ans: `= 0`,
                    sol: `\\begin{aligned} 
                        &\\text{Analyze the growth rates as } x \\to \\infty: \\\\ 
                        &\\text{ Numerator: } x^{${n}} \\text{ (Polynomial growth)} \\\\ 
                        &\\text{ Denominator: } e^{${exponent}} \\text{ (Exponential growth)} \\\\ 
                        &\\text{Exponential functions grow significantly faster than polynomial} \\\\ 
                        &\\text{functions as } x \\text{ approaches infinity.} \\\\ 
                        &\\text{Since the denominator dominates ( } e^{${exponent}} \\gg x^{${n}} \\text{ ):} \\\\ 
                        L &= 0 
                        \\end{aligned}`
                };
            },
            // Logarithmic vs Power growth: ln(x) / x^c
            (c) => ({
                expr: `\\lim_{x \\to \\infty} \\frac{\\ln x}{x^{${c}}}`,
                ans: `= 0`,
                sol: `\\begin{aligned} 
                    &\\text{Let } x^c = e^u \\implies c \\ln x = u \\implies \\ln x = \\frac{u}{c}. \\\\ 
                    &\\text{As } x \\to \\infty, u \\to \\infty. \\\\ 
                    L &= \\lim_{u \\to \\infty} \\frac{u/c}{e^u} \\\\ 
                    &= \\frac{1}{c} \\lim_{u \\to \\infty} \\frac{u}{e^u} \\\\ 
                    &\\text{Since } e^u > \\frac{u^2}{2} \\text{ for large } u, \\\\ 
                    L &= 0 \\quad (\\text{Exponential growth dominates polynomial growth})
                    \\end{aligned}`
            })
        ],
        med: [
            // Family: Cubic-Radical Conjugate
            () => {
                const a = 1; // Centered at 1 for clean integers
                // 1. Numerator parts
                // x^3 - 1 factors into (x - 1)(x^2 + x + 1)
                const quadraticPart = Utils.poly2(1, 1, 1); // "x^2 + x + 1"
                const linearFactor = Utils.minusA(a);       // "(x - 1)"
                // 2. Denominator parts
                const conjugate = `(\\sqrt{x} + 1)`;
                return {
                    expr: `\\lim_{x \\to ${a}} \\frac{x^3 - 1}{\\sqrt{x} - 1}`,
                    ans: `= 6`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution yields } \\frac{0}{0}. \\\\ 
                        L &= \\lim_{x \\to ${a}} \\frac{${linearFactor}(${quadraticPart})}{\\sqrt{x} - 1} \\cdot \\frac{${conjugate}}{${conjugate}} \\\\ 
                        &= \\lim_{x \\to ${a}} \\frac{${linearFactor}(${quadraticPart})${conjugate}}{x - 1} \\\\ 
                        &= \\lim_{x \\to ${a}} (${quadraticPart})${conjugate} \\\\ 
                        &= (1^2 + 1 + 1)(\\sqrt{1} + 1) \\\\ 
                        &= (3)(2) = 6
                        \\end{aligned}`
                };
            },
            // Family: (ax^2+bx+c)/(px^2+qx+r)
            () => {
                const { a, k1, k2, m, n, p, q } = Utils.generateNiceParams();

                const num_A = k1 * m;
                const num_B = k1 * (p - m * a);
                const num_C = -k1 * a * p;

                const den_A = k2 * n;
                const den_B = k2 * (q - n * a);
                const den_C = -k2 * a * q;

                const val_num = k1 * (m * a + p);
                const val_den = k2 * (n * a + q);

                const g = Utils.gcd(val_num, val_den) || 1;
                let redNum = val_num / g;
                let redDen = val_den / g;

                // Fix negative denominators: Move sign to numerator
                if (redDen < 0) {
                    redNum = -redNum;
                    redDen = -redDen;
                }

                const finalAns = redDen === 1 ? `${redNum}` : `\\frac{${redNum}}{${redDen}}`;

                return {
                    // Use the new poly2 helper here
                    expr: `\\lim_{x \\to ${a}} \\frac{${Utils.poly2(num_A, num_B, num_C)}}{${Utils.poly2(den_A, den_B, den_C)}}`,

                    ans: `= ${finalAns}`,

                    sol: `\\begin{aligned}
                        L &= \\lim_{x \\to ${a}} \\frac{${k1 === 1 ? '' : k1}(${Utils.linear(m, p)})${Utils.minusA(a)}}{${k2 === 1 ? '' : k2}(${Utils.linear(n, q)})${Utils.minusA(a)}} \\\\
                        &= \\lim_{x \\to ${a}} \\frac{${k1 === 1 ? '' : k1}(${Utils.linear(m, p)})}{${k2 === 1 ? '' : k2}(${Utils.linear(n, q)})} \\\\
                        &= \\frac{${val_num}}{${val_den}} = ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Algebraic Limit (Difference of Cubes & Conjugates)
            // Form: lim_{x -> a} (x^3 - a^3) / (\sqrt{x} - \sqrt{a})
            () => {
                // Pick k so that a = k^2 is a perfect square (avoids ugly square roots)
                // Using k between 1 and 4 keeps the final answers reasonable (max 24,576)
                const k = Utils.getRnd(1, 4); 
                const a = k * k;
                const aSquared = a * a;
                const aCubed = aSquared * a;
                
                // The generalized limit evaluates to 6 * a^2 * sqrt(a) -> 6 * a^2 * k
                const finalAns = 6 * aSquared * k;
                
                // Use your utility to elegantly format the (x^2 + ax + a^2) part
                const quadraticStr = Utils.poly2(1, a, aSquared); 

                return {
                    expr: `\\lim_{x \\to ${a}} \\frac{x^3 - ${aCubed}}{\\sqrt{x} - ${k}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution yields } \\frac{0}{0}. \\text{ Multiply by the conjugate of the denominator:} \\\\ 
                        L &= \\lim_{x \\to ${a}} \\frac{x^3 - ${aCubed}}{\\sqrt{x} - ${k}} \\cdot \\frac{\\sqrt{x} + ${k}}{\\sqrt{x} + ${k}} \\\\ 
                        &= \\lim_{x \\to ${a}} \\frac{(x^3 - ${aCubed})(\\sqrt{x} + ${k})}{x - ${a}} \\\\ 
                        &\\text{Factor the difference of cubes: } x^3 - ${aCubed} = (x - ${a})(${quadraticStr}) \\\\ 
                        &= \\lim_{x \\to ${a}} \\frac{(x - ${a})(${quadraticStr})(\\sqrt{x} + ${k})}{x - ${a}} \\\\ 
                        &\\text{Cancel the common factor } (x - ${a}): \\\\ 
                        &= \\lim_{x \\to ${a}} (${quadraticStr})(\\sqrt{x} + ${k}) \\\\ 
                        &\\text{Evaluate the limit by direct substitution:} \\\\ 
                        &= (${a}^2 + ${a}(${a}) + ${aSquared})(\\sqrt{${a}} + ${k}) \\\\ 
                        &= (${aSquared} + ${aSquared} + ${aSquared})(${k} + ${k}) \\\\ 
                        &= (${3 * aSquared})(${2 * k}) \\\\
                        &= ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Advanced Trigonometric Substitution
            () => {
                // Generate a limit like: \lim_{x \to c} \frac{\sin(x - c)}{x^2 - c^2}
                let c = Utils.getRnd(1, 5); 
                // Randomize sign
                if (Utils.getRnd(0, 1) === 0) c = -c;

                let cSquared = c * c;
                
                // Utilize your existing Utils for beautiful math formatting
                let denominator = Utils.poly2(1, 0, -cSquared); // Generates "x^2 - 9" etc.
                let numerator = `\\sin${Utils.minusA(c)}`;      // Generates "\sin(x - 3)" etc.

                let twoC = 2 * c;
                let twoCFormatted = twoC > 0 ? `+ ${twoC}` : `- ${Math.abs(twoC)}`;
                
                // Format the final fraction beautifully
                let ansStr = c > 0 ? `\\frac{1}{${twoC}}` : `-\\frac{1}{${Math.abs(twoC)}}`;

                return {
                    expr: `\\lim_{x \\to ${c}} \\frac{${numerator}}{${denominator}}`,
                    ans: `= ${ansStr}`,
                    sol: `\\begin{aligned} 
                        &\\text{Let } u = x - ${c < 0 ? `(${c})` : c}. \\text{ As } x \\to ${c}, u \\to 0. \\\\
                        &\\text{Substitute } x = u ${c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`}: \\\\
                        L &= \\lim_{u \\to 0} \\frac{\\sin(u)}{(u ${c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`})^2 - ${cSquared}} \\\\
                        &= \\lim_{u \\to 0} \\frac{\\sin(u)}{u^2 ${twoCFormatted}u + ${cSquared} - ${cSquared}} \\\\
                        &= \\lim_{u \\to 0} \\frac{\\sin(u)}{u(u ${twoCFormatted})} \\\\
                        &= \\lim_{u \\to 0} \\left( \\frac{\\sin(u)}{u} \\cdot \\frac{1}{u ${twoCFormatted}} \\right) \\\\
                        &= 1 \\cdot \\frac{1}{0 ${twoCFormatted}} \\\\
                        &= ${ansStr}
                        \\end{aligned}`
                };
            },
            // Family: Quadratic Trigonometric Limits ( (1 - cos ax) / bx^2 )
            () => {
                const a = Utils.getRnd(2, 8); // Now allowing 1 to test formatting
                const b = Utils.getRnd(2, 5);

                // Math Logic: (a^2) / (2 * b)
                const numeratorVal = a * a;
                const denominatorVal = 2 * b;
                const common = Utils.gcd(numeratorVal, denominatorVal);
                
                const finalNum = numeratorVal / common;
                const finalDen = denominatorVal / common;
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                // Formatting coefficients nicely
                const denomStr = Utils.poly2(b, 0, 0);       // Fixes the "1x^2" issue
                const innerTrig = Utils.linear(a, 0);       // Fixes "cos(1x)" to "cos(x)"
                const aSquared = a * a;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${denomStr}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Use the special limit } \\lim_{u \\to 0} \\frac{1 - \\cos u}{u^2} = \\frac{1}{2}. \\\\ 
                        &\\text{We multiply to get } (${innerTrig})^2 = ${aSquared}x^2 \\text{ in the denominator:} \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${denomStr}} \\cdot \\frac{${aSquared}}{${aSquared}} \\\\ 
                        &= \\frac{${aSquared}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${aSquared}x^2} \\\\ 
                        &\\text{Since } \\lim_{u \\to 0} \\frac{1 - \\cos u}{u^2} = \\frac{1}{2}: \\\\ 
                        &= \\frac{${aSquared}}{${b}} \\cdot \\left( \\frac{1}{2} \\right) \\\\ 
                        &= \\frac{${aSquared}}{${2 * b}} = ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: Ratio of Sines (sin ax / sin bx)
            () => {
                let a, b;
                // Ensure a and b are different
                do {
                    a = Utils.getRnd(1, 9);
                    b = Utils.getRnd(1, 9);
                } while (a === b);

                const common = Utils.gcd(a, b);
                const num = a / common;
                const den = b / common;
                const finalAns = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;

                const argA = Utils.linear(a, 0);
                const argB = Utils.linear(b, 0);

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${argA})}{\\sin(${argB})}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Divide the numerator and denominator by } x: \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{\\frac{\\sin(${argA})}{x}}{\\frac{\\sin(${argB})}{x}} \\\\ 
                        &\\text{Multiply top and bottom to create } \\frac{\\sin u}{u} \\text{ forms:} \\\\ 
                        &= \\frac{${a} \\cdot \\lim_{x \\to 0} \\frac{\\sin(${argA})}{${argA}}}{${b} \\cdot \\lim_{x \\to 0} \\frac{\\sin(${argB})}{${argB}}} \\\\ 
                        &\\text{Using } \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1: \\\\ 
                        &= \\frac{${a} \\cdot (1)}{${b} \\cdot (1)} \\\\ 
                        &= ${finalAns}
                        \\end{aligned}`
                };
            },
            // (e^(bx)-1)/x
            (a, b) => {
                const pwr = b === 1 ? "x" : `${b}x`;
                return {
                    expr: `\\lim_{x \\to 0} \\frac{e^{${pwr}} - 1}{x}`,
                    ans: `= ${b}`,
                    sol: `\\begin{aligned} 
                        &\\text{Use the standard limit } \\lim_{u \\to 0} \\frac{e^u - 1}{u} = 1. \\\\ 
                        &\\text{Multiply and divide by } ${b}: \\\\ 
                        L &= ${b} \\cdot \\lim_{x \\to 0} \\frac{e^{${pwr}} - 1}{${b}x} \\\\ 
                        &\\text{Let } u = ${pwr}. \\text{ As } x \\to 0, u \\to 0: \\\\ 
                        L &= ${b} \\cdot \\lim_{u \\to 0} \\frac{e^u - 1}{u} \\\\ 
                        &= ${b} \\cdot (1) = ${b} 
                        \\end{aligned}`
                };
            },
            (a, b) => {
                const inner = Utils.linear(b, 1); // "1 + bx"
                return {
                    expr: `\\lim_{x \\to 0^+} \\left( ${inner} \\right)^{1/x}`,
                    ans: `= e^{${b === 1 ? "" : b}}`,
                    sol: `\\begin{aligned} 
                        &\\text{Let } y = (${inner})^{1/x}. \\text{ Take the natural log of both sides:} \\\\ 
                        \\ln y &= \\frac{1}{x} \\ln(${inner}) \\\\ 
                        \\lim_{x \\to 0^+} \\ln y &= \\lim_{x \\to 0^+} \\frac{\\ln(1 + ${b}x)}{x} \\\\ 
                        &\\text{Using } \\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} = 1, \\text{ let } u = ${b}x: \\\\ 
                        &= ${b} \\cdot \\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} = ${b} \\\\ 
                        &\\text{Since } \\lim \\ln y = ${b}, \\text{ then } L = e^{${b}}.
                        \\end{aligned}`
                };
            },
            // Family: Radical Conjugates at Infinity and Negative Infinity
            (a, b) => {
                // 1. Setup parameters
                const k = 2 * b; // k is the coefficient of x, final answer involves k/2
                const direction = Utils.getRnd(0, 1); // 0: Infinity, 1: Negative Infinity
                const isPosInf = direction === 0;
                
                const limitTarget = isPosInf ? "\\infty" : "-\\infty";
                const conjugateSign = isPosInf ? "-" : "+";
                const oppositeSign = isPosInf ? "+" : "-";
                
                // The expression: sqrt(x^2 + kx) - x (for pos) or sqrt(x^2 + kx) + x (for neg)
                const innerTrinomial = `x^2 ${k > 0 ? "+" : ""} ${k}x`;
                const fullExpr = `\\sqrt{${innerTrinomial}} ${isPosInf ? "-" : "+"} x`;

                // The limit evaluates to k/2 for pos inf, and -k/2 for neg inf
                // Given our setup, the result magnitude is always b
                const finalAns = isPosInf ? b : -b;

                return {
                    expr: `\\lim_{x \\to ${limitTarget}} \\left( ${fullExpr} \\right)`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Multiply by the conjugate: } \\frac{\\sqrt{${innerTrinomial}} ${oppositeSign} x}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} \\\\ 
                        L &= \\lim_{x \\to ${limitTarget}} \\frac{(${innerTrinomial}) - x^2}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} = \\lim_{x \\to ${limitTarget}} \\frac{${k}x}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} \\\\ 
                        &\\text{Divide the numerator and denominator by } x. \\\\ 
                        &\\text{Crucially, for } x < 0, \\sqrt{x^2} = |x| = -x. \\text{ Therefore } \\frac{\\sqrt{x^2+kx}}{x} = ${isPosInf ? "" : "-"} \\sqrt{1 + \\frac{${k}}{x}}. \\\\ 
                        L &= \\lim_{x \\to ${limitTarget}} \\frac{${k}}{${isPosInf ? "" : "-"} \\sqrt{1 + \\frac{${k}}{x}} ${oppositeSign} 1} \\\\ 
                        &\\text{Evaluate as } x \\to ${limitTarget}: \\\\ 
                        L &= \\frac{${k}}{${isPosInf ? "1 + 1" : "-1 - 1"}} = \\frac{${k}}{${isPosInf ? "2" : "-2"}} = ${finalAns}
                        \\end{aligned}`
                };
            },
            // Family: The General Exponential Limit (1 + b/x)^{ax}
            (a, b) => {
                // b is the numerator inside, a is the multiplier for the exponent
                const exponent = a === 1 ? "x" : `${a}x`;
                const resultPower = a * b;
                
                // Formatting e^{result}
                const finalAns = resultPower === 1 ? "e" : `e^{${resultPower}}`;

                return {
                    expr: `\\lim_{x \\to \\infty} \\left( 1 + \\frac{${b}}{x} \\right)^{${exponent}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{This is a } 1^\\infty \\text{ indeterminate form. Let } y = \\left( 1 + \\frac{${b}}{x} \\right)^{${exponent}}. \\\\ 
                        &\\text{Take the natural logarithm of both sides:} \\\\ 
                        \\ln y &= ${exponent} \\cdot \\ln\\left( 1 + \\frac{${b}}{x} \\right) \\\\ 
                        &\\text{As } x \\to \\infty, \\text{ let } u = \\frac{1}{x}. \\text{ Then } u \\to 0: \\\\ 
                        \\lim_{x \\to \\infty} \\ln y &= \\lim_{u \\to 0} \\frac{${a} \\ln(1 + ${b}u)}{u} \\\\ 
                        &\\text{Using the fundamental limit } \\lim_{u \\to 0} \\frac{\\ln(1 + ku)}{u} = k: \\\\ 
                        \\lim \\ln y &= ${a} \\cdot ${b} = ${resultPower} \\\\ 
                        &\\text{Since } \\lim \\ln y = ${resultPower}, \\text{ we exponentiate to find } L: \\\\ 
                        L &= e^{${resultPower}} ${resultPower === 1 ? "= e" : ""}
                        \\end{aligned}`
                };
            },
            (a, b, c) => ({
                expr: `\\lim_{h \\to 0} \\frac{(${c}+h)^2 - ${c * c}}{h}`,
                ans: `= ${2 * c}`,
                sol: `\\begin{aligned} &= \\lim_{h\\to 0} \\frac{${c * c}+${2 * c}h+h^2-${c * c}}{h} = ${2 * c} \\end{aligned}`
            }),
            (a, b) => {
                let ang = '\\frac{\\pi}{4}';
                return {
                    expr: `\\lim_{x \\to ${ang}} \\frac{\\tan(${b}(x - ${ang}))}{x - ${ang}}`,
                    ans: `= ${b}`,
                    sol: `\\text{Let } u = x - ${ang}. \\implies \\lim_{u \\to 0} \\frac{\\tan(${b}u)}{u} = ${b}`
                };
            }
        ],
        hard: [
            // Family: Advanced Trig Limit with Radicals ( sin^2(ax) / (1 - \sqrt{\cos bx}) )
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);

                const argA = Utils.linear(a, 0);
                const argB = Utils.linear(b, 0);

                const numVal = 4 * a * a;
                const denVal = b * b;
                const common = Utils.gcd(numVal, denVal);

                const finalNum = numVal / common;
                const finalDen = denVal / common;
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin^2(${argA})}{1 - \\sqrt{\\cos(${argB})}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Multiply the numerator and denominator by the conjugate } 1 + \\sqrt{\\cos(${argB})}: \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{\\sin^2(${argA}) \\left( 1 + \\sqrt{\\cos(${argB})} \\right)}{\\left(1 - \\sqrt{\\cos(${argB})}\\right)\\left(1 + \\sqrt{\\cos(${argB})}\\right)} \\\\ 
                        &= \\lim_{x \\to 0} \\frac{\\sin^2(${argA}) \\left( 1 + \\sqrt{\\cos(${argB})} \\right)}{1 - \\cos(${argB})} \\\\ 
                        &\\text{Evaluate the non-zero radical part as } x \\to 0: \\left( 1 + \\sqrt{1} \\right) = 2. \\text{ Pull it out:} \\\\ 
                        &= 2 \\cdot \\lim_{x \\to 0} \\frac{\\sin^2(${argA})}{1 - \\cos(${argB})} \\\\ 
                        &\\text{Divide the numerator and denominator by } x^2 \\text{ to utilize our special limits:} \\\\ 
                        &= 2 \\cdot \\frac{\\lim_{x \\to 0} \\left( \\frac{\\sin(${argA})}{x} \\right)^2}{\\lim_{x \\to 0} \\frac{1 - \\cos(${argB})}{x^2}} \\\\ 
                        &\\text{Recall that } \\lim_{x \\to 0} \\frac{\\sin ax}{x} = a \\text{ and } \\lim_{x \\to 0} \\frac{1 - \\cos bx}{x^2} = \\frac{b^2}{2}: \\\\ 
                        &= 2 \\cdot \\frac{(${a})^2}{\\frac{${b * b}}{2}} = 2 \\cdot \\left( ${a * a} \\cdot \\frac{2}{${b * b}} \\right) \\\\
                        &= \\frac{${numVal}}{${denVal}} = ${finalAns}
                        \\end{aligned}`
                };
            },

            // The $x^x$ Power Limit
            /*
            () => ({
                expr: `\\lim_{x \\to 0^+} x^x`,
                ans: `= 1`,
                sol: `\\begin{aligned} 
                    L &= \\lim_{x \\to 0^+} e^{\\ln(x^x)} = e^{\\lim_{x \\to 0^+} (x \\ln x)} \\\\ 
                    &\\text{Using the standard limit } \\lim_{x \\to 0^+} x \\ln x = 0: \\\\ 
                    &= e^0 = 1 
                    \\end{aligned}`
            }),
            */
            // Family: The Logarithmic Identity ln(1 + bx) / x
            () => {
                const b = Utils.getRnd(2, 6);
                const inner = Utils.linear(b, 1);
                const b_val = b === 1 ? "" : b;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\ln(${inner})}{x}`,
                    ans: `= ${b}`,
                    sol: `\\begin{aligned} 
                        &\\text{Use the power property of logarithms, } n \\ln A = \\ln A^n: \\\\ 
                        L &= \\lim_{x \\to 0} \\left[ \\frac{1}{x} \\ln(${inner}) \\right] = \\lim_{x \\to 0} \\ln\\left( (${inner})^{\\frac{1}{x}} \\right) \\\\ 
                        &\\text{Since the natural logarithm is a continuous function, we can move} \\\\ 
                        &\\text{the limit inside the logarithm:} \\\\ 
                        L &= \\ln\\left( \\lim_{x \\to 0} (${inner})^{\\frac{1}{x}} \\right) \\\\ 
                        &\\text{Using the definition of } e, \\lim_{u \\to 0} (1 + ku)^{1/u} = e^k: \\\\ 
                        &\\text{Here, } k = ${b}, \\text{ so } \\lim_{x \\to 0} (${inner})^{\\frac{1}{x}} = e^{${b_val}} \\\\ 
                        L &= \\ln(e^{${b}}) = ${b} 
                        \\end{aligned}`
                };
            },

            // Family: Cubic Sine Limit (sin(ax) - ax) / x^3
            () => {
                const a = Utils.getRnd(1, 4);
                const a3 = a ** 3;
                const common = Utils.gcd(Math.abs(a3), 6);

                const finalNum = a3 / common;
                const finalDen = 6 / common;
                const finalAns = finalDen === 1 ? `-${finalNum}` : `-\\frac{${finalNum}}{${finalDen}}`;

                const arg = Utils.linear(a, 0);

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${arg}) - ${arg}}{x^3}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\frac{\\sin(${arg}) - ${arg}}{x^3} \\\\ 
                        &\\text{To use the standard cubic limit, let } u = ${arg}: \\\\ 
                        &\\text{Then } x = \\frac{u}{${a}}, \\text{ so } x^3 = \\frac{u^3}{${a3}}. \\\\ 
                        L &= \\lim_{u \\to 0} \\frac{\\sin u - u}{u^3 / ${a3}} = ${a3} \\cdot \\lim_{u \\to 0} \\frac{\\sin u - u}{u^3} \\\\ 
                        &\\text{Recall the fundamental result: } \\lim_{u \\to 0} \\frac{u - \\sin u}{u^3} = \\frac{1}{6}. \\\\ 
                        &\\text{Therefore, } \\lim_{u \\to 0} \\frac{\\sin u - u}{u^3} = -\\frac{1}{6}. \\\\ 
                        L &= ${a3} \\left( -\\frac{1}{6} \\right) = -\\frac{${a3}}{6} = ${finalAns}
                        \\end{aligned}`
                };
            },

            () => {
                const c = Utils.getRnd(1, 5);
                return {
                    expr: `\\lim_{x \\to ${c}^-} \\frac{|x - ${c}|}{x - ${c}}`,
                    ans: `= -1`,
                    sol: `\\text{For } x < ${c}, |x-${c}| = -(x-${c}) \\implies \\frac{-(x-${c})}{x-${c}} = -1`
                };
            },

            () => ({
                expr: `\\lim_{x \\to 0} x^2 \\sin\\left(\\frac{1}{x}\\right)`,
                ans: `= 0`,
                sol: `\\text{Squeeze Theorem: } -x^2 \\le x^2\\sin(1/x) \\le x^2. \\text{ Both sides } \\to 0`
            }),

            () => {
                const b = Utils.getRnd(1, 6);
                const ang = '\\frac{\\pi}{2}';
                
                // Result logic: (b^2)/2
                const num = b * b;
                const den = 2;
                const common = Utils.gcd(num, den);
                
                const finalNum = num / common;
                const finalDen = den / common;
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                return {
                    expr: `\\lim_{x \\to ${ang}} \\frac{1 - \\cos(${b === 1 ? "" : b}(x - ${ang}))}{(x - ${ang})^2}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Let } u = x - ${ang}. \\text{ As } x \\to ${ang}, u \\to 0: \\\\ 
                        L &= \\lim_{u \\to 0} \\frac{1 - \\cos(${b === 1 ? "" : b}u)}{u^2} \\\\ 
                        &\\text{To use the standard limit } \\lim_{\\theta \\to 0} \\frac{1 - \\cos \\theta}{\\theta^2} = \\frac{1}{2}, \\text{ we need } (${b}u)^2 \\text{ in the denominator:} \\\\ 
                        L &= \\lim_{u \\to 0} \\left[ \\frac{1 - \\cos(${b}u)}{(${b}u)^2} \\cdot ${b}^2 \\right] \\\\ 
                        &= ${b}^2 \\cdot \\lim_{u \\to 0} \\frac{1 - \\cos(${b}u)}{(${b}u)^2} \\\\ 
                        &= ${b * b} \\cdot \\frac{1}{2} = ${finalAns}
                        \\end{aligned}`
                };
            },

            () => {
                const b = Utils.getRnd(1, 6);
                // Parity logic: sin(bu + bπ) = (-1)^b * sin(bu)
                const sign = (b % 2 === 0) ? '' : '-';
                const bStr = b === 1 ? "" : b;

                return {
                    expr: `\\lim_{x \\to \\pi} \\frac{\\sin(${bStr}x)}{x - \\pi}`,
                    ans: `= ${sign}${b}`,
                    sol: `\\begin{aligned} 
                        &\\text{Let } u = x - \\pi. \\text{ As } x \\to \\pi, u \\to 0. \\\\ 
                        &\\text{Substitute } x = u + \\pi \\text{ into the expression:} \\\\ 
                        L &= \\lim_{u \\to 0} \\frac{\\sin(${bStr}(u + \\pi))}{u} = \\lim_{u \\to 0} \\frac{\\sin(${bStr}u + ${b}\\pi)}{u} \\\\ 
                        &\\text{Using the identity } \\sin(\\theta + k\\pi) = (-1)^k \\sin \\theta: \\\\ 
                        &\\text{Since } k = ${b} \\text{ is } ${b % 2 === 0 ? "even" : "odd"}, \\sin(${bStr}u + ${b}\\pi) = ${sign}\\sin(${bStr}u). \\\\ 
                        L &= \\lim_{u \\to 0} \\frac{${sign}\\sin(${bStr}u)}{u} \\\\ 
                        &= ${sign}${b} \\cdot \\lim_{u \\to 0} \\frac{\\sin(${bStr}u)}{${bStr}u} \\\\ 
                        &= ${sign}${b}(1) = ${sign}${b}
                        \\end{aligned}`
                };
            },

            // The "x * sin(ax) / sin^2(bx)" family
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);
                const b2 = b * b;

                // Simplify the final fraction (a / b^2)
                const common = Utils.gcd(a, b2);
                const fNum = a / common;
                const fDen = b2 / common;
                
                const finalAns = fDen === 1 ? `${fNum}` : `\\frac{${fNum}}{${fDen}}`;
                
                // Formatting for "1x" vs "x"
                const argA = a === 1 ? 'x' : `${a}x`;
                const argB = b === 1 ? 'x' : `${b}x`;

                // Logic to show simplification only if the fraction actually changes
                const needsStep = (a !== fNum || b2 !== fDen);
                const simplification = needsStep ? `= ${finalAns}` : "";

                return {
                    expr: `\\lim_{x \\to 0} \\frac{x \\sin ${argA}}{\\sin^2 ${argB}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Divide the numerator and denominator by } x^2: \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{\\frac{x \\sin ${argA}}{x^2}}{\\frac{\\sin^2 ${argB}}{x^2}} = \\lim_{x \\to 0} \\frac{\\frac{\\sin ${argA}}{x}}{\\left(\\frac{\\sin ${argB}}{x}\\right)^2} \\\\ 
                        &\\text{Using the standard limit } \\lim_{x \\to 0} \\frac{\\sin kx}{x} = k: \\\\ 
                        L &= \\frac{${a}}{${b}^2} = \\frac{${a}}{${b2}} ${simplification}
                        \\end{aligned}`
                };
            },

            // Family: tan(ax) / sin(bx)
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);
                const common = Utils.gcd(a, b);
                const finalAns = b / common === 1 ? `${a / common}` : `\\frac{${a / common}}{${b / common}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\tan(${a === 1 ? '' : a}x)}{\\sin(${b === 1 ? '' : b}x)}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Divide numerator and denominator by } x: \\\\
                        L &= \\lim_{x \\to 0} \\frac{\\frac{\\tan(${a === 1 ? '' : a}x)}{x}}{\\frac{\\sin(${b === 1 ? '' : b}x)}{x}} \\\\
                        &\\text{Apply standard limits } \\frac{\\tan(ax)}{x} \\to a \\text{ and } \\frac{\\sin(bx)}{x} \\to b: \\\\
                        L &= \\frac{${a}}{${b}} = ${finalAns}
                        \\end{aligned}`
                };
            },

            // Family: sin^2(ax) / (x * tan(bx))
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);
                const num = a * a;
                const common = Utils.gcd(num, b);
                const finalAns = b / common === 1 ? `${num / common}` : `\\frac{${num / common}}{${b / common}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin^2(${a === 1 ? '' : a}x)}{x \\tan(${b === 1 ? '' : b}x)}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\left[ \\frac{\\sin^2(${a === 1 ? '' : a}x)}{x^2} \\cdot \\frac{x}{\\tan(${b === 1 ? '' : b}x)} \\right] \\\\ 
                        &= \\left( \\lim_{x \\to 0} \\frac{\\sin(${a === 1 ? '' : a}x)}{x} \\right)^2 \\cdot \\lim_{x \\to 0} \\frac{x}{\\tan(${b === 1 ? '' : b}x)} \\\\ 
                        &= (${a})^2 \\cdot \\frac{1}{${b}} = \\frac{${num}}{${b}} = ${finalAns}
                        \\end{aligned}`
                };
            },

            // Family: x^2 * sin(ax) / sin^3(bx)
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);
                const b3 = b ** 3;
                const common = Utils.gcd(a, b3);
                const finalAns = b3 / common === 1 ? `${a / common}` : `\\frac{${a / common}}{${b3 / common}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{x^2 \\sin(${a === 1 ? '' : a}x)}{\\sin^3(${b === 1 ? '' : b}x)}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\left[ \\frac{\\sin(${a === 1 ? '' : a}x)}{x} \\cdot \\left(\\frac{x}{\\sin(${b === 1 ? '' : b}x)}\\right)^3 \\right] \\\\ 
                        &= (${a}) \\cdot \\left(\\frac{1}{${b}}\\right)^3 = \\frac{${a}}{${b3}} = ${finalAns}
                        \\end{aligned}`
                };
            },

            // Family: (sin ax * sin bx) / (x * tan cx)
            () => {
                const a = Utils.getRnd(1, 5);
                const b = Utils.getRnd(1, 5);
                const c = Utils.getRnd(1, 5);
                const num = a * b;
                const common = Utils.gcd(num, c);
                const finalAns = c / common === 1 ? `${num / common}` : `\\frac{${num / common}}{${c / common}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${a === 1 ? '' : a}x) \\sin(${b === 1 ? '' : b}x)}{x \\tan(${c === 1 ? '' : c}x)}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        L &= \\lim_{x \\to 0} \\left[ \\frac{\\sin(${a === 1 ? '' : a}x)}{x} \\cdot \\frac{\\sin(${b === 1 ? '' : b}x)}{x} \\cdot \\frac{x}{\\tan(${c === 1 ? '' : c}x)} \\right] \\\\ 
                        &= (${a}) \\cdot (${b}) \\cdot \\frac{1}{${c}} = \\frac{${num}}{${c}} = ${finalAns}
                        \\end{aligned}`
                };
            },

            // Family: sin(n1*x)-sin(n2*x) / (cos x - 1) -> Divergence
            () => {
                const n1 = Utils.getRnd(2, 4);
                let n2; do { n2 = Utils.getRnd(2, 5); } while (n1 === n2);
                const diff = n1 - n2;
                
                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin ${n1}x - \\sin ${n2}x}{\\cos x - 1}`,
                    ans: `\\text{DNE}`,
                    sol: `\\begin{aligned} 
                        &\\text{Using Taylor expansions or small-angle approx:} \\\\
                        &\\sin(kx) \\approx kx, \\quad \\cos x - 1 \\approx -\\frac{x^2}{2} \\\\
                        L &= \\lim_{x \\to 0} \\frac{${n1}x - ${n2}x}{-x^2/2} = \\lim_{x \\to 0} \\frac{${diff}x}{-x^2/2} = \\lim_{x \\to 0} \\frac{${-2 * diff}}{x} \\\\
                        &\\text{As } x \\to 0, \\text{ the expression } \\frac{C}{x} \\text{ approaches } \\pm\\infty, \\text{ so the limit Does Not Exist.}
                        \\end{aligned}`
                };
            },

            // Family: (cos ax - cos bx) / x^2
            () => {
                const a = Utils.getRnd(1, 4);
                let b; do { b = Utils.getRnd(1, 5); } while (a === b);
                
                const fmt = (val) => val === 1 ? "" : val;

                const num = b * b - a * a;
                const den = 2;
                const common = Utils.gcd(Math.abs(num), den);
                
                // Simplified fraction components
                const sNum = num / common;
                const sDen = den / common;
                
                let finalAns = "";
                if (sDen === 1) {
                    finalAns = `${sNum}`;
                } else {
                    // Handle negative signs for fractions
                    const sign = sNum < 0 ? "-" : "";
                    finalAns = `${sign}\\frac{${Math.abs(sNum)}}{${sDen}}`;
                }

                // Show simplification only if necessary
                const rawFrac = `\\frac{${num}}{2}`;
                const needsSimplification = rawFrac !== finalAns;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\cos ${fmt(a)}x - \\cos ${fmt(b)}x}{x^2}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Step 1: Use the "add and subtract 1" trick to create standard forms:} \\\\
                        L &= \\lim_{x \\to 0} \\frac{(1 - \\cos ${fmt(b)}x) - (1 - \\cos ${fmt(a)}x)}{x^2} \\\\ \\\\
                        &\\text{Step 2: Separate into two limits:} \\\\
                        L &= \\lim_{x \\to 0} \\frac{1 - \\cos ${fmt(b)}x}{x^2} - \\lim_{x \\to 0} \\frac{1 - \\cos ${fmt(a)}x}{x^2} \\\\ \\\\
                        &\\text{Step 3: Apply the standard limit } \\lim_{x \\to 0} \\frac{1 - \\cos kx}{x^2} = \\frac{k^2}{2}: \\\\
                        L &= \\frac{${b}^2}{2} - \\frac{${a}^2}{2} = \\frac{${b * b} - ${a * a}}{2} \\\\ \\\\
                        &= \\frac{${num}}{2} ${needsSimplification ? `= ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },

            // Family: (sin ax - sin bx) / (tan cx - tan dx)
            () => {
                const a = Utils.getRnd(1, 5);
                let b; do { b = Utils.getRnd(1, 5); } while (a === b);
                const c = Utils.getRnd(1, 5);
                let d; do { d = Utils.getRnd(1, 5); } while (c === d);
                
                // Helper to format coefficients (e.g., 1x -> x)
                const fmt = (val) => val === 1 ? "" : val;

                const num = a - b;
                const den = c - d;
                
                // Simplify the fraction
                const common = Utils.gcd(Math.abs(num), Math.abs(den));
                const sNum = num / common;
                const sDen = den / common;
                
                let finalAns = "";
                // If the denominator simplifies to 1 or -1, output an integer
                if (Math.abs(sDen) === 1) {
                    finalAns = `${sNum / sDen}`; 
                } else {
                    // Move the negative sign to the numerator for standard form
                    const sign = (sNum * sDen < 0) ? "-" : "";
                    finalAns = `${sign}\\frac{${Math.abs(sNum)}}{${Math.abs(sDen)}}`;
                }

                // Determine if we need to show the simplification step in the solution
                // We show it if the raw (num/den) doesn't match the final simplified integer or fraction
                const rawFrac = `\\frac{${num}}{${den}}`;
                const needsSimplification = rawFrac !== finalAns;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin ${fmt(a)}x - \\sin ${fmt(b)}x}{\\tan ${fmt(c)}x - \\tan ${fmt(d)}x}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Divide the numerator and denominator by } x: \\\\
                        L &= \\frac{\\lim_{x \\to 0} \\frac{\\sin ${fmt(a)}x}{x} - \\lim_{x \\to 0} \\frac{\\sin ${fmt(b)}x}{x}}{\\lim_{x \\to 0} \\frac{\\tan ${fmt(c)}x}{x} - \\lim_{x \\to 0} \\frac{\\tan ${fmt(d)}x}{x}} \\\\ \\\\
                        &\\text{Using } \\lim_{x \\to 0} \\frac{\\sin kx}{x} = k \\text{ and } \\lim_{x \\to 0} \\frac{\\tan kx}{x} = k: \\\\
                        L &= \\frac{${a} - ${b}}{${c} - ${d}} = \\frac{${num}}{${den}} ${needsSimplification ? `= ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },

            // Family: (1 - cos ax)(b + cos x) / (x * tan cx)
            () => {
                const a = Utils.getRnd(1, 4);
                const b = Utils.getRnd(1, 5);
                const c = Utils.getRnd(1, 5);
                
                // Helper to hide coefficient 1
                const fmt = (val) => val === 1 ? "" : val;

                const num = (a * a) * (b + 1);
                const den = 2 * c;
                const common = Utils.gcd(num, den);
                
                const sNum = num / common;
                const sDen = den / common;
                const finalAns = (sDen === 1) ? `${sNum}` : `\\frac{${sNum}}{${sDen}}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{(1 - \\cos ${fmt(a)}x)(${b} + \\cos x)}{x \\tan ${fmt(c)}x}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Step 1: Decompose the expression into standard limit forms:} \\\\ 
                        L &= \\lim_{x \\to 0} \\left[ \\frac{1 - \\cos ${fmt(a)}x}{x^2} \\cdot \\frac{x}{\\tan ${fmt(c)}x} \\cdot (${b} + \\cos x) \\right] \\\\ \\\\
                        &\\text{Step 2: Apply standard limits } \\lim_{x \\to 0} \\frac{1-\\cos ax}{x^2} = \\frac{a^2}{2} \\text{ and } \\lim_{x \\to 0} \\frac{\\tan cx}{x} = c: \\\\ 
                        L &= \\frac{${a}^2}{2} \\cdot \\frac{1}{${c}} \\cdot (${b} + \\cos 0) \\\\ 
                        &= \\frac{${a * a}}{2} \\cdot \\frac{1}{${c}} \\cdot (${b} + 1) \\\\ \\\\
                        &\\text{Step 3: Simplify the result:} \\\\
                        L &= \\frac{${a * a} \\cdot ${b + 1}}{${2 * c}} = \\frac{${num}}{${den}} ${num !== sNum ? `= ${finalAns}` : ""}
                        \\end{aligned}`
                };
            },

            // Family: sin(k * pi * cos^2(ax)) / x^2
            () => {
                const k = Utils.getRnd(1, 4);
                const a = Utils.getRnd(1, 3);
                
                // Formatter to hide coefficients of 1
                const fmt = (val) => val === 1 ? "" : val;
                
                const sign = (k % 2 === 0) ? "-" : "";
                const val = k * a * a;
                
                // Dynamically build the exact trig identity used for clarity
                let identityStr = "";
                if (k % 2 === 0) {
                    identityStr = `\\sin(${k}\\pi - u) = -\\sin u`;
                } else {
                    identityStr = `\\sin(${fmt(k)}\\pi - u) = \\sin u`;
                }

                return {
                    expr: `\\lim_{x \\to 0} \\frac{\\sin(${fmt(k)}\\pi \\cos^2 ${fmt(a)}x)}{x^2}`,
                    ans: `= ${sign}${fmt(val)}\\pi`,
                    sol: `\\begin{aligned} 
                        &\\text{Step 1: Use the Pythagorean identity } \\cos^2 \\theta = 1 - \\sin^2 \\theta: \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{\\sin\\left(${fmt(k)}\\pi (1 - \\sin^2 ${fmt(a)}x)\\right)}{x^2} \\\\ 
                        &= \\lim_{x \\to 0} \\frac{\\sin(${fmt(k)}\\pi - ${fmt(k)}\\pi \\sin^2 ${fmt(a)}x)}{x^2} \\\\ \\\\
                        &\\text{Step 2: Use the reduction formula } ${identityStr}: \\\\ 
                        L &= \\lim_{x \\to 0} \\frac{${sign}\\sin(${fmt(k)}\\pi \\sin^2 ${fmt(a)}x)}{x^2} \\\\ \\\\
                        &\\text{Step 3: Multiply numerator and denominator by } ${fmt(k)}\\pi \\sin^2 ${fmt(a)}x: \\\\ 
                        L &= ${sign} \\lim_{x \\to 0} \\left[ \\frac{\\sin(${fmt(k)}\\pi \\sin^2 ${fmt(a)}x)}{${fmt(k)}\\pi \\sin^2 ${fmt(a)}x} \\cdot \\frac{${fmt(k)}\\pi \\sin^2 ${fmt(a)}x}{x^2} \\right] \\\\ 
                        &\\text{Since } \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1 \\text{ (where } u = ${fmt(k)}\\pi \\sin^2 ${fmt(a)}x), \\text{ we get:} \\\\
                        L &= ${sign}(1) \\cdot ${fmt(k)}\\pi \\cdot \\lim_{x \\to 0} \\left( \\frac{\\sin ${fmt(a)}x}{x} \\right)^2 \\\\
                        &= ${sign}${fmt(k)}\\pi \\cdot (${a})^2 = ${sign}${fmt(val)}\\pi
                        \\end{aligned}`
                };
            },

            // Family: Shifted Cubic Trig Limits
            () => {
                const c = Utils.getRnd(1, 5);
                const den = 2 * c;
                
                // Clean formatting to prevent '1(x - pi/2)^3'
                const cStr = c === 1 ? "" : c;

                return {
                    expr: `\\lim_{x \\to \\frac{\\pi}{2}} \\frac{(1 - \\sin x) \\cot x}{${cStr} \\left(x - \\frac{\\pi}{2}\\right)^3}`,
                    ans: `= -\\frac{1}{${den}}`,
                    sol: `\\begin{aligned} 
                        &\\text{Let } h = x - \\frac{\\pi}{2}, \\text{ so } x = h + \\frac{\\pi}{2}. \\text{ As } x \\to \\frac{\\pi}{2}, h \\to 0. \\\\ 
                        &\\text{Substitute into the expression:} \\\\
                        L &= \\lim_{h \\to 0} \\frac{\\left(1 - \\sin(h + \\frac{\\pi}{2})\\right) \\cot(h + \\frac{\\pi}{2})}{${cStr} h^3} \\\\ 
                        &\\text{Use identities } \\sin(h + \\frac{\\pi}{2}) = \\cos h \\text{ and } \\cot(h + \\frac{\\pi}{2}) = -\\tan h: \\\\
                        L &= \\lim_{h \\to 0} \\frac{(1 - \\cos h)(-\\tan h)}{${cStr} h^3} \\\\ 
                        &\\text{Separate the limit into standard forms:} \\\\
                        &= -\\frac{1}{${c}} \\lim_{h \\to 0} \\left( \\frac{1 - \\cos h}{h^2} \\cdot \\frac{\\tan h}{h} \\right) \\\\ 
                        &\\text{Apply } \\lim_{h \\to 0} \\frac{1-\\cos h}{h^2} = \\frac{1}{2} \\text{ and } \\lim_{h \\to 0} \\frac{\\tan h}{h} = 1: \\\\
                        &= -\\frac{1}{${c}} \\cdot \\left(\\frac{1}{2}\\right) \\cdot (1) = -\\frac{1}{${den}}
                        \\end{aligned}`
                };
            },

            // Family: Pi/4 Tangent-Sine Ratio
            () => {
                const k = Utils.getRnd(2, 5);
                
                // Result logic for (2 * sqrt(2)) / k
                const common = Utils.gcd(2, k);
                const finalNum = 2 / common;
                const finalDen = k / common;
                
                // Helper to format coefficients of sqrt(2)
                const fmtSqrt = (n) => n === 1 ? "" : n;

                // Final answer string
                let finalAns = "";
                if (finalDen === 1) {
                    finalAns = `${fmtSqrt(finalNum)}\\sqrt{2}`;
                } else {
                    finalAns = `\\frac{${fmtSqrt(finalNum)}\\sqrt{2}}{${finalDen}}`;
                }

                // Explicit cancellation step for the solution
                // Only shows if k was 2 or 4 (making it reducible)
                const needsReduction = common > 1;
                const finalStep = needsReduction ? `= ${finalAns}` : "";

                return {
                    expr: `\\lim_{x \\to \\frac{\\pi}{4}} \\frac{\\tan x - 1}{${k}\\sin x - \\frac{${k}}{\\sqrt{2}}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Step 1: Simplify the numerator and factor the denominator:} \\\\ 
                        &\\tan x - 1 = \\frac{\\sin x - \\cos x}{\\cos x}, \\quad ${k}\\sin x - \\frac{${k}}{\\sqrt{2}} = \\frac{${k}(\\sqrt{2}\\sin x - 1)}{\\sqrt{2}} \\\\ \\\\
                        &\\text{Step 2: Rewrite the limit:} \\\\
                        L &= \\frac{\\sqrt{2}}{${k}} \\lim_{x \\to \\frac{\\pi}{4}} \\frac{\\sin x - \\cos x}{\\cos x (\\sqrt{2}\\sin x - 1)} \\\\ \\\\
                        &\\text{Step 3: Use conjugate } (\\sqrt{2}\\sin x + 1) \\text{ to resolve the denominator:} \\\\
                        L &= \\frac{\\sqrt{2}}{${k}} \\lim_{x \\to \\frac{\\pi}{4}} \\frac{(\\sin x - \\cos x)(\\sqrt{2}\\sin x + 1)}{\\cos x (2\\sin^2 x - 1)} \\\\
                        &\\text{Note: } 2\\sin^2 x - 1 = -\\cos(2x) = -(\\cos x - \\sin x)(\\cos x + \\sin x) \\\\ \\\\
                        &\\text{Step 4: Cancel terms and evaluate at } x = \\frac{\\pi}{4}: \\\\
                        L &= \\frac{\\sqrt{2}}{${k}} \\lim_{x \\to \\frac{\\pi}{4}} \\frac{\\sqrt{2}\\sin x + 1}{\\cos x (\\cos x + \\sin x)} \\\\
                        &= \\frac{\\sqrt{2}}{${k}} \\cdot \\frac{1 + 1}{\\frac{1}{\\sqrt{2}}(\\frac{1}{\\sqrt{2}} + \\frac{1}{\\sqrt{2}})} = \\frac{\\sqrt{2}}{${k}} \\cdot 2 \\\\ \\\\
                        &= \\frac{2\\sqrt{2}}{${k}} ${finalStep}
                        \\end{aligned}`
                };
            },

            // Family: Pythagorean Boundary Limits (k = 1 or 2)
            () => {
                const k = Utils.getRnd(1, 2);
                const result = k === 1 ? "0" : "-1";
                
                // Logic to hide the power if it is 1
                const powStr = k === 1 ? "" : `^{${k}}`;

                return {
                    expr: `\\lim_{x \\to \\frac{\\pi}{2}} \\frac{\\sin^2 x - 1}{\\cos${powStr} x}`,
                    ans: `= ${result}`,
                    sol: `\\begin{aligned} 
                        &\\text{Using } \\sin^2 x - 1 = -\\cos^2 x: \\\\ 
                        L &= \\lim_{x \\to \\frac{\\pi}{2}} \\frac{-\\cos^2 x}{\\cos${powStr} x} \\\\ 
                        ${k === 1 
                            ? `&= \\lim_{x \\to \\frac{\\pi}{2}} (-\\cos x) = 0` 
                            : `&= \\lim_{x \\to \\frac{\\pi}{2}} (-1) = -1`
                        }
                        \\end{aligned}`
                };
            }
        ]
    };
    window.limit = limit;