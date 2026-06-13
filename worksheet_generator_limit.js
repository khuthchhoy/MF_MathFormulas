
const limit = {
        easy: [
            //# Family: Linear Direct Substitution ax+b
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
            //# Family: (ax^2 + bx) / cx of 0/0
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
            //# Family: Rational Function at Infinity (ax^2 + bx + c) / (px^2 + qx + r)
            (a, b, c, d, difficulty) => {
                // 1. Helper to transform the engine's positive parameters into negative, positive, or zero
                const randomizeCoeff = (val, canBeZero = true) => {
                    const rand = Math.random();
                    if (canBeZero && rand < 0.2) return 0; // 20% chance to be exactly 0
                    if (rand < 0.6) return -val;           // 40% chance to be negative
                    return val;                            // 40% chance to be positive
                };

                // 2. Generate/Transform all 6 coefficients for a true ax^2 + bx + c / px^2 + qx + r
                // We pass true/false to control whether the leading coefficients can be zero (to avoid an empty denominator or altered degree)
                let num_a = randomizeCoeff(a, true);  // Numerator x^2 can be zero (allows linear forms)
                let num_b = randomizeCoeff(b, true);
                let num_c = randomizeCoeff(c, true);

                let den_p = randomizeCoeff(d, false); // Denominator x^2 shouldn't be zero to maintain px^2 form
                let den_q = randomizeCoeff(Utils.getRnd(1, 6), true); // internally generated to complete the form
                let den_r = randomizeCoeff(Utils.getRnd(1, 6), true);

                // Safeguard: Make sure the numerator isn't completely empty
                if (num_a === 0 && num_b === 0 && num_c === 0) {
                    num_c = Utils.getRnd(1, 5);
                }

                // Determine limit direction dynamically
                const isPosInf = Utils.getRnd(0, 1) === 1;
                const limitTarget = isPosInf ? "\\infty" : "-\\infty";

                // 3. Custom Bulletproof Polynomial Formatter
                const buildPoly = (c2, c1, c0) => {
                    let terms = [];
                    
                    // Handle x^2 Term
                    if (c2 !== 0) {
                        if (c2 === 1) terms.push("x^2");
                        else if (c2 === -1) terms.push("-x^2");
                        else terms.push(`${c2}x^2`);
                    }
                    
                    // Handle x Term
                    if (c1 !== 0) {
                        let sign = c1 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        let absVal = Math.abs(c1);
                        let co = absVal === 1 ? "" : absVal;
                        terms.push(`${sign}${co}x`);
                    }
                    
                    // Handle Constant Term
                    if (c0 !== 0) {
                        let sign = c0 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        let absVal = Math.abs(c0);
                        terms.push(`${sign}${absVal}`);
                    }
                    
                    return terms.length > 0 ? terms.join(" ") : "0";
                };

                // 4. Highest Power Division Formatter (Divides every term cleanly by x^2)
                const formatFactored = (c2, c1, c0) => {
                    let terms = [];
                    
                    // Division of c2*x^2 / x^2
                    if (c2 !== 0) {
                        let sign = c2 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        terms.push(`${sign}${Math.abs(c2)}`);
                    }
                    // Division of c1*x / x^2 -> c1 / x
                    if (c1 !== 0) {
                        let sign = c1 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        terms.push(`${sign}\\dfrac{${Math.abs(c1)}}{x}`);
                    }
                    // Division of c0 / x^2
                    if (c0 !== 0) {
                        let sign = c0 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        terms.push(`${sign}\\dfrac{${Math.abs(c0)}}{x^2}`);
                    }
                    
                    return terms.length > 0 ? terms.join(" ") : "0";
                };

                // Generate strings
                const exprNum = buildPoly(num_a, num_b, num_c);
                const exprDen = buildPoly(den_p, den_q, den_r);
                
                const numPart = formatFactored(num_a, num_b, num_c);
                const denPart = formatFactored(den_p, den_q, den_r);

                // 5. Direct Mathematical Evaluation
                // Since everything is divided by x^2, evaluating limit x -> inf reduces to: num_a / den_p
                let finalAns = "0";
                if (num_a !== 0) {
                    finalAns = Utils.formatFraction(num_a, den_p);
                }

                // 6. Structure Step-by-Step LaTeX Solutions without running into Utils.clean bugs
                let solText = `\\begin{aligned}\n` +
                            `L &= \\lim_{x \\to ${limitTarget}} \\dfrac{${exprNum}}{${exprDen}} \\\\[8pt]\n` +
                            `&= \\lim_{x \\to ${limitTarget}} \\dfrac{${numPart}}{${denPart}} \\\\[8pt]\n` +
                            `&= ${finalAns}\n` +
                            `\\end{aligned}`;

                return {
                    expr: `\\lim_{x \\to ${limitTarget}} \\dfrac{${exprNum}}{${exprDen}}`,
                    ans: `= ${finalAns}`,
                    sol: solText
                };
            },
            //# Family: Quadratic Rational Cancellation (x^2 - c^2) / (x - c) -> 0/0
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
            //# Family: Quadratic Rational Cancellation (x^2+bx+c)/(x^2+px+q) -> 0/0
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
            //# Family: Quadratic-Linear Rational Cancellation (mx^2 + nx + p)/(ax+b) -> (0/0)
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
            //# Family: Basic Trigonometric Evaluation sin/cos at special angles
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
            //# Family: Standard Trig Limit sin(ax)/bx as x -> 0
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
            //# Family: Standard Trig Limit tan(ax)/bx as x -> 0
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
            //# Family: Standard Trig Limit (1 - cos(ax)) / bx as x -> 0
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
            //# Family: Logarithmic Growth vs. Linear Growth (ln(ax+b)/(cx+d)) as x -> inf)
            (a, b, c, d, difficulty) => {
                // Mock Utils if not present globally (safeguard for testing)
                const Utils = {
                    getRnd: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
                };

                // 1. Transform parameters (keeping log arguments positive for domain safety as x -> inf)
                const randomizeCoeff = (val, canBeNegative = false) => {
                    if (!canBeNegative) return val; 
                    const rand = Math.random();
                    return rand < 0.5 ? -val : val;
                };

                // 2. Generate coefficients for: \ln(num_a * x + num_b) / (den_c * x + den_d)
                let num_a = a === 0 ? Utils.getRnd(1, 5) : a; 
                let num_b = b === 0 ? Utils.getRnd(1, 9) : b; 
                
                let den_c = randomizeCoeff(c === 0 ? Utils.getRnd(1, 6) : c, true); 
                let den_d = randomizeCoeff(d === 0 ? Utils.getRnd(1, 9) : d, true);

                const limitTarget = "\\infty"; 

                // 3. Polynomial/Linear String Formatter
                const buildLinear = (c1, c0) => {
                    let terms = [];
                    if (c1 !== 0) {
                        if (c1 === 1) terms.push("x");
                        else if (c1 === -1) terms.push("-x");
                        else terms.push(`${c1}x`);
                    }
                    if (c0 !== 0) {
                        let sign = c0 > 0 ? (terms.length > 0 ? "+ " : "") : (terms.length > 0 ? "- " : "-");
                        let absVal = Math.abs(c0);
                        terms.push(`${sign}${absVal}`);
                    }
                    return terms.length > 0 ? terms.join(" ") : "0";
                };

                // Generate inner strings
                const logArg = buildLinear(num_a, num_b);
                const denominatorExpr = buildLinear(den_c, den_d);

                // 4. Mathematical Evaluation
                const finalAns = "0";

                // 5. Structure Step-by-Step Formulaic LaTeX Solution
                let solText = `\\begin{aligned}\n` +
                            `L &= \\lim_{x \\to ${limitTarget}} \\dfrac{\\ln(${logArg})}{${denominatorExpr}} \\\\[8pt]\n` +
                            `&\\text{Factor out } x \\text{ inside the natural logarithm and in the denominator:} \\\\[8pt]\n` +
                            `&= \\lim_{x \\to ${limitTarget}} \\dfrac{\\ln \\left[ x \\left( ${num_a} + \\dfrac{${num_b}}{x} \\right) \\right]}{x \\left( ${den_c} + \\dfrac{${den_d}}{x} \\right)} \\\\[8pt]\n` +
                            `&\\text{Apply the logarithmic identity } \\ln(u \\cdot v) = \\ln(u) + \\ln(v): \\\\[8pt]\n` +
                            `&= \\lim_{x \\to ${limitTarget}} \\dfrac{\\ln(x) + \\ln \\left( ${num_a} + \\dfrac{${num_b}}{x} \\right)}{x \\left( ${den_c} + \\dfrac{${den_d}}{x} \\right)} \\\\[8pt]\n` +
                            `&\\text{Split the fraction into two components:} \\\\[8pt]\n` +
                            `&= \\lim_{x \\to ${limitTarget}} \\left[ \\dfrac{\\ln(x)}{x} \\cdot \\dfrac{1}{${den_c} + \\dfrac{${den_d}}{x}} + \\dfrac{\\ln \\left( ${num_a} + \\dfrac{${num_b}}{x} \\right)}{x \\left( ${den_c} + \\dfrac{${den_d}}{x} \\right)} \\right] \\\\[8pt]\n` +
                            `&\\text{Using the standard formula } \\lim_{x \\to \\infty} \\dfrac{\\ln(x)}{x} = 0 \\text{ and evaluating } \\dfrac{\\text{constant}}{\\infty} = 0: \\\\[8pt]\n` +
                            `&= \\left[ 0 \\cdot \\dfrac{1}{${den_c} + 0} \\right] + \\dfrac{\\ln(${num_a} + 0)}{\\infty} \\\\[8pt]\n` +
                            `& = 0 + 0 \\\\\n` + 
                            `&= 0\n` +
                            `\\end{aligned}`;

                return {
                    expr: `\\lim_{x \\to ${limitTarget}} \\dfrac{\\ln(${logArg})}{${denominatorExpr}}`,
                    ans: `= ${finalAns}`,
                    sol: solText
                };
            },
            
            //# Family: Rational Function at Infinity (Equal Degrees) 
            (a, b, c) => {
                // 1. Setup parameters
                const n = Utils.getRnd(2, 4); // Highest power (x^2, x^3, or x^4)
                const d = Utils.getRnd(1, 5); // Denominator leading coefficient
                
                // 2. Formatting the Polynomials
                const pow2 = n === 2 ? "x" : `x^{${n-1}}`;
                const bAbs = Math.abs(b);
                const bTerm = bAbs === 1 ? pow2 : `${bAbs}${pow2}`;
                
                // Construct numerator: ax^n + bx^(n-1)
                const polyTop = `${a === 1 ? "" : a === -1 ? "-" : a}x^{${n}} ${b > 0 ? "+" : "-"} ${bTerm}`;
                
                // Construct denominator: dx^n + c
                const polyBottom = `${d === 1 ? "" : d}x^{${n}} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`;

                // 3. Logic for Clean Formatting & Simplification
                const common = Utils.gcd(Math.abs(a), Math.abs(d));
                const finalNum = a / common;
                const finalDen = d / common;

                // Build the dynamic final sequence block based on whether simplification occurs
                let finalStepStr = "";
                if (common === 1) {
                    // Cannot be simplified (e.g., L = 1/3)
                    if (finalDen === 1) {
                        finalStepStr = `L &= ${finalNum}`;
                    } else {
                        finalStepStr = `L &= \\frac{${a}}{${d}}`;
                    }
                } else {
                    // Can be simplified (e.g., L = 4/6 = 2/3 or L = 2/1 = 2)
                    const simplifiedPart = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;
                    finalStepStr = `L &= \\frac{${a}}{${d}} = ${simplifiedPart}`;
                }

                // Format final answer string
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                return {
                    expr: `\\lim_{x \\to \\infty} \\frac{${polyTop}}{${polyBottom}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{To evaluate the limit at infinity, factor out the highest power } x^{${n}} \\text{ from both terms:} \\\\[1.2em]
                        L &= \\lim_{x \\to \\infty} \\frac{x^{${n}} \\left( ${a} ${b > 0 ? "+" : "-"} \\frac{${bAbs}}{x} \\right)}{x^{${n}} \\left( ${d} ${c > 0 ? "+" : "-"} \\frac{${Math.abs(c)}}{x^{${n}}} \\right)} \\\\[1.2em]
                        &\\text{Cancel out the common } x^{${n}} \\text{ term:} \\\\[1.2em]
                        &= \\lim_{x \\to \\infty} \\frac{${a} ${b > 0 ? "+" : "-"} \\frac{${bAbs}}{x}}{${d} ${c > 0 ? "+" : "-"} \\frac{${Math.abs(c)}}{x^{${n}}}} \\\\[1.2em]
                        &\\text{Since } \\lim_{x \\to \\infty} \\frac{k}{x^m} = 0 \\text{ for any constants } k \\text{ and } m > 0: \\\\[1.2em]
                        &= \\frac{${a} ${b > 0 ? "+" : "-"} 0}{${d} ${c > 0 ? "+" : "-"} 0} \\\\[1.2em]
                        ${finalStepStr}
                        \\end{aligned}`
                };
            },
            //# Family: Exponential vs. Polynomial Growth (Growth Rate Comparison) e^x vs x^n as x -> inf, ln(x^n) vs x as x -> inf, etc.
            () => {
                // 1. Setup Parameters
                const caseType = Utils.getRnd(1, 4); // Randomizes between 4 distinct limit types
                const n = Utils.getRnd(2, 6);        // Randomize polynomial powers
                const a = Utils.getRnd(2, 5);        // Random positive coefficient
                const b = Utils.getRnd(1, 9);        // Random constant or linear coefficient

                switch (caseType) {
                    case 1:
                        // TYPE 1: Exponential over Polynomial (Original Case)
                        return {
                            expr: `\\lim_{x \\to \\infty} \\frac{e^x}{x^{${n}}}`,
                            ans: `= \\infty`,
                            sol: `\\begin{aligned} 
                                &\\text{Compare the growth rates of the functions as } x \\to \\infty: \\\\[1.2em]
                                &\\bullet \\text{ Numerator: } e^x \\text{ exhibits exponential growth.} \\\\ 
                                &\\bullet \\text{ Denominator: } x^{${n}} \\text{ exhibits polynomial growth.} \\\\[1.2em]
                                &\\text{As } x \\text{ increases without bound, exponential growth always} \\\\ 
                                &\\text{outpaces polynomial growth of any fixed degree } (e^x \\gg x^{${n}}). \\\\[1.2em]
                                L &= \\infty 
                                \\end{aligned}`
                        };

                    case 2:
                        // TYPE 2: Polynomial over Exponential (Reciprocal Case -> Hits 0)
                        return {
                            expr: `\\lim_{x \\to \\infty} \\frac{x^{${n}}}{e^{${a === 1 ? "" : a}x}}`,
                            ans: `= 0`,
                            sol: `\\begin{aligned} 
                                &\\text{Compare the growth rates of the functions as } x \\to \\infty: \\\\[1.2em]
                                &\\bullet \\text{ Numerator: } x^{${n}} \\text{ grows polynomially.} \\\\ 
                                &\\bullet \\text{ Denominator: } e^{${a === 1 ? "" : a}x} \\text{ grows exponentially.} \\\\[1.2em]
                                &\\text{Because an exponential function grows significantly faster than any} \\\\ 
                                &\\text{polynomial function in the long run } (e^{${a === 1 ? "" : a}x} \\gg x^{${n}}): \\\\[1.2em]
                                L &= 0 
                                \\end{aligned}`
                        };

                    case 3:
                        // TYPE 3: Natural Logarithm vs Polynomial (Slow Growth -> Hits 0)
                        return {
                            expr: `\\lim_{x \\to \\infty} \\frac{\\ln(x^{${n}})}{x}`,
                            ans: `= 0`,
                            sol: `\\begin{aligned} 
                                &\\text{First, simplify the numerator using logarithm properties:} \\\\[1.2em]
                                L &= \\lim_{x \\to \\infty} \\frac{${n} \\ln(x)}{x} \\\\[1.2em]
                                &\\text{Evaluate the growth rates. Logarithmic functions grow much slower} \\\\ 
                                &\\text{than linear or polynomial functions as } x \\to \\infty \\text{ }(\\ln(x) \\ll x): \\\\[1.2em]
                                L &= 0
                                \\end{aligned}`
                        };

                    case 4:
                        // TYPE 4: L'Hôpital's Rule Case with Exponential Functions
                        return {
                            expr: `\\lim_{x \\to \\infty} \\frac{e^{x} + ${b}}{${a}e^{x} - 1}`,
                            ans: `= \\frac{1}{${a}}`,
                            sol: `\\begin{aligned} 
                                &\\text{Direct evaluation yields the indeterminate form } \\frac{\\infty}{\\infty}. \\\\[1.2em]
                                &\\text{Factor out the dominant exponential term } e^x \\text{ from the numerator and denominator:} \\\\[1.2em]
                                L &= \\lim_{x \\to \\infty} \\frac{e^x \\left( 1 + \\frac{${b}}{e^x} \\right)}{e^x \\left( ${a} - \\frac{1}{e^x} \\right)} \\\\[1.2em]
                                &\\text{Cancel the common } e^x \\text{ factor:} \\\\[1.2em]
                                &= \\lim_{x \\to \\infty} \\frac{1 + \\frac{${b}}{e^x}}{${a} - \\frac{1}{e^x}} \\\\[1.2em]
                                &\\text{Since } \\lim_{x \\to \\infty} \\frac{k}{e^x} = 0 \\text{ for any constant } k: \\\\[1.2em]
                                &= \\frac{1 + 0}{${a} - 0} \\\\[1.2em]
                                L &= \\frac{1}{${a}}
                                \\end{aligned}`
                        };

                    default:
                        return { expr: "", ans: "", sol: "" };
                }
            },
            //# Family: Limit Definition of Derivative (Radical) sqrt(c^2 + h) - c / h as h -> 0
            (a, b, c, d) => {
                let valC = Math.abs(a) > 0 ? Math.abs(a) : 4;
                let sqC = valC * valC; 
                let ansDen = 2 * valC;
                
                return {
                    expr: `\\lim_{h \\to 0} \\frac{\\sqrt{${sqC} + h} - ${valC}}{h}`,
                    ans: `= \\frac{1}{${ansDen}}`,
                    sol: `\\begin{aligned}
                        &\\text{This is the limit definition of the derivative for } f(x) = \\sqrt{x} \\text{ at } x = ${sqC}. \\\\
                        &\\text{Multiply numerator and denominator by the conjugate:} \\\\
                        &L = \\lim_{h \\to 0} \\frac{\\sqrt{${sqC} + h} - ${valC}}{h} \\cdot \\frac{\\sqrt{${sqC} + h} + ${valC}}{\\sqrt{${sqC} + h} + ${valC}} \\\\
                        &= \\lim_{h \\to 0} \\frac{(${sqC} + h) - ${valC*valC}}{h(\\sqrt{${sqC} + h} + ${valC})} \\\\
                        &= \\lim_{h \\to 0} \\frac{h}{h(\\sqrt{${sqC} + h} + ${valC})} \\\\
                        &= \\lim_{h \\to 0} \\frac{1}{\\sqrt{${sqC} + h} + ${valC}} \\\\
                        &= \\frac{1}{\\sqrt{${sqC} + 0} + ${valC}} = \\frac{1}{${valC} + ${valC}} = \\frac{1}{${ansDen}}
                    \\end{aligned}`
                };
            }
        ],
        med: [
            //# Family: Cubic-Radical Conjugate x^3 + c / sqrt(x+k) - m as x -> targetVal
            () => {
                // 1. Randomize standard test configurations (Now including negative targets)
                const options = [
                    { targetVal: 1, k: 1, shift: 0, radicalStr: "x" },          
                    { targetVal: 4, k: 2, shift: 0, radicalStr: "x" },          
                    { targetVal: 2, k: 2, shift: 2, radicalStr: "x + 2" },      
                    { targetVal: 3, k: 1, shift: -2, radicalStr: "x - 2" },     
                    // --- NEW NEGATIVE CASES ---
                    { targetVal: -1, k: 1, shift: 2, radicalStr: "x + 2" },     // lim_{x->-1} (x^3 + 1) / (sqrt(x+2) - 1)
                    { targetVal: -1, k: 2, shift: 5, radicalStr: "x + 5" },     // lim_{x->-1} (x^3 + 1) / (sqrt(x+5) - 2)
                    { targetVal: -2, k: 1, shift: 3, radicalStr: "x + 3" },     // lim_{x->-2} (x^3 + 8) / (sqrt(x+3) - 1)
                    { targetVal: -3, k: 2, shift: 7, radicalStr: "x + 7" }      // lim_{x->-3} (x^3 + 27) / (sqrt(x+7) - 2)
                ];

                const config = options[Utils.getRnd(0, options.length - 1)];
                const { targetVal, k, radicalStr } = config;

                // 2. Compute expressions and factors based on targetVal
                const cubicNum = Math.pow(targetVal, 3);
                const targetValSquared = targetVal * targetVal;

                // Smart string formatting for polynomial signs
                const polyTop = `x^3 ${cubicNum < 0 ? "+" : "-"} ${Math.abs(cubicNum)}`;
                const polyBottom = `\\sqrt{${radicalStr}} - ${k}`;
                
                // Formatting the linear factor (e.g., "x - -1" becomes "x + 1")
                const linearFactor = targetVal < 0 ? `(x + ${Math.abs(targetVal)})` : `(x - ${targetVal})`; 
                
                // Formatting the quadratic part: x^2 + cx + c^2
                const midSign = targetVal < 0 ? "-" : "+";
                const midCoeff = Math.abs(targetVal) === 1 ? "x" : `${Math.abs(targetVal)}x`;
                const quadraticPart = `x^2 ${midSign} ${midCoeff} + ${targetValSquared}`; 
                
                const conjugate = `\\left(\\sqrt{${radicalStr}} + ${k}\\right)`;

                // 3. Compute limits numerically
                const numEval = targetValSquared * 3; 
                const denEval = k * 2;                
                const finalAnswerVal = numEval * denEval;
                const evaluatedRadical = targetVal + config.shift;

                return {
                    expr: `\\lim_{x \\to ${targetVal}} \\frac{${polyTop}}{${polyBottom}}`,
                    ans: `= ${finalAnswerVal}`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution yields the indeterminate form } \\frac{0}{0}. \\\\[1.2em]
                        &\\text{Factor the sum/difference of cubes in the numerator and multiply} \\\\ 
                        &\\text{by the conjugate } ${conjugate}: \\\\[1.2em]
                        L &= \\lim_{x \\to ${targetVal}} \\frac{${linearFactor}\\left(${quadraticPart}\\right)}{${polyBottom}} \\cdot \\frac{${conjugate}}{${conjugate}} \\\\[1.2em]
                        &= \\lim_{x \\to ${targetVal}} \\frac{${linearFactor}\\left(${quadraticPart}\\right)${conjugate}}{${linearFactor}} \\\\[1.2em]
                        &\\text{Cancel out the common linear factor } ${linearFactor}: \\\\[1.2em]
                        &= \\lim_{x \\to ${targetVal}} \\left(${quadraticPart}\\right)${conjugate} \\\\[1.2em]
                        &\\text{Evaluate the limit by direct substitution:} \\\\[1.2em]
                        &= \\left((${targetVal})^2 ${midSign} ${midCoeff.replace('x', `(${targetVal})`)} + ${targetValSquared}\\right)\\left(\\sqrt{${evaluatedRadical}} + ${k}\\right) \\\\[1.2em]
                        &= (${numEval})(${denEval}) \\\\[1.2em]
                        L &= ${finalAnswerVal}
                        \\end{aligned}`
                };
            },
            //# Family: (ax^2+bx+c)/(px^2+qx+r)
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

                // Dynamic final step to prevent redundant equals signs
                let finalStepStr = "";
                if (val_num === redNum && val_den === redDen) {
                    finalStepStr = `&= ${finalAns}`;
                } else {
                    finalStepStr = `&= \\frac{${val_num}}{${val_den}} \\\\[1.2em]\n                        &= ${finalAns}`;
                }

                return {
                    expr: `\\lim_{x \\to ${a}} \\frac{${Utils.poly2(num_A, num_B, num_C)}}{${Utils.poly2(den_A, den_B, den_C)}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned}
                        L &= \\lim_{x \\to ${a}} \\frac{${k1 === 1 ? '' : k1}(${Utils.linear(m, p)})${Utils.minusA(a)}}{${k2 === 1 ? '' : k2}(${Utils.linear(n, q)})${Utils.minusA(a)}} \\\\[1.2em]
                        &= \\lim_{x \\to ${a}} \\frac{${k1 === 1 ? '' : k1}(${Utils.linear(m, p)})}{${k2 === 1 ? '' : k2}(${Utils.linear(n, q)})} \\\\[1.2em]
                        ${finalStepStr}
                        \\end{aligned}`
                };
            },
            //# Form: lim_{x -> a} (x^3 - a^3) / (\sqrt{x} - \sqrt{a})
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
            //# Family: Advanced Trigonometric Substitution sin(x - c) / (x^2 - c^2) as x -> c
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
            //# Family: Quadratic Trigonometric Limits ( (1 - cos ax) / bx^2 )
            () => {
                const a = Utils.getRnd(2, 8); 
                const b = Utils.getRnd(2, 5);

                // Math Logic: (a^2) / (2 * b)
                const numeratorVal = a * a;
                const denominatorVal = 2 * b;
                const common = Utils.gcd(numeratorVal, denominatorVal);
                
                const finalNum = numeratorVal / common;
                const finalDen = denominatorVal / common;
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                // Formatting coefficients nicely
                const denomStr = Utils.poly2(b, 0, 0);       
                const innerTrig = Utils.linear(a, 0);       
                const aSquared = a * a;

                // Check if the unreduced substitution fraction matches the final answer string
                const initialFrac = `\\frac{${aSquared}}{${2 * b}}`;
                const finalStepStr = (initialFrac === finalAns) 
                    ? `&= ${finalAns}` 
                    : `&= \\frac{${aSquared}}{${2 * b}} = ${finalAns}`;

                return {
                    expr: `\\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${denomStr}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Use the special limit } \\lim_{u \\to 0} \\frac{1 - \\cos u}{u^2} = \\frac{1}{2}. \\\\[1.2em]
                        &\\text{We multiply to get } (${innerTrig})^2 = ${aSquared}x^2 \\text{ in the denominator:} \\\\[1.2em]
                        L &= \\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${denomStr}} \\cdot \\frac{${aSquared}}{${aSquared}} \\\\[1.2em]
                        &= \\frac{${aSquared}}{${b}} \\cdot \\lim_{x \\to 0} \\frac{1 - \\cos(${innerTrig})}{${aSquared}x^2} \\\\[1.2em]
                        &\\text{Since } \\lim_{u \\to 0} \\frac{1 - \\cos u}{u^2} = \\frac{1}{2}: \\\\[1.2em]
                        &= \\frac{${aSquared}}{${b}} \\cdot \\left( \\frac{1}{2} \\right) \\\\[1.2em]
                        ${finalStepStr}
                        \\end{aligned}`
                };
            }, 
            //# Family: Ratio of Sines (sin ax / sin bx)
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
            //# (e^(bx)-1)/x
            (a, b) => {
                const bVal = Math.abs(b) > 1 ? Math.abs(b) : 2;
                const pwr = bVal === 1 ? "x" : `${bVal}x`;
                return {
                    expr: `\\lim_{x \\to 0} \\frac{e^{${pwr}} - 1}{x}`,
                    ans: `= ${bVal}`,
                    sol: `\\begin{aligned} 
                        &\\text{Use the standard limit } \\lim_{u \\to 0} \\frac{e^u - 1}{u} = 1. \\\\ 
                        &\\text{Multiply and divide by } ${bVal}: \\\\ 
                        L &= ${bVal} \\cdot \\lim_{x \\to 0} \\frac{e^{${pwr}} - 1}{${bVal}x} \\\\ 
                        &\\text{Let } u = ${pwr}. \\text{ As } x \\to 0, u \\to 0: \\\\ 
                        L &= ${bVal} \\cdot \\lim_{u \\to 0} \\frac{e^u - 1}{u} \\\\ 
                        &= ${bVal} \\cdot (1) = ${bVal} 
                        \\end{aligned}`
                };
            },
            //# (1 + bx)^{1/x}
            () => {
                // Generate coefficients
                let a = Utils.getSignedRnd(2, 6); // Inner coefficient
                let b = Utils.getSignedRnd(2, 5); // Exponent numerator

                // Smart string formatting
                const signA = a < 0 ? "-" : "+";
                const absA = Math.abs(a);
                const inner = `1 ${signA} ${absA}x`;
                const exponent = `${b}/x`;
                const finalPower = a * b;

                return {
                    expr: `\\lim_{x \\to 0} \\left( ${inner} \\right)^{${exponent}}`,
                    ans: `= e^{${finalPower}}`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution yields the indeterminate form } 1^{\\infty}. \\\\[1.2em]
                        &\\text{Let } y = (${inner})^{${exponent}}. \\text{ Take the natural logarithm of both sides:} \\\\[1.2em] 
                        \\ln y &= \\frac{${b}}{x} \\ln(${inner}) \\\\[1.2em] 
                        \\lim_{x \\to 0} \\ln y &= \\lim_{x \\to 0} \\frac{${b} \\ln(1 ${signA} ${absA}x)}{x} \\\\[1.2em] 
                        &\\text{To use the special limit } \\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} = 1, \\text{ multiply by } \\frac{${a}}{${a}}: \\\\[1.2em] 
                        &= \\lim_{x \\to 0} ${b} \\cdot ${a} \\cdot \\frac{\\ln(1 ${signA} ${absA}x)}{${a}x} \\\\[1.2em] 
                        &\\text{Let } u = ${a}x. \\text{ As } x \\to 0, u \\to 0: \\\\[1.2em] 
                        &= ${finalPower} \\cdot \\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} \\\\[1.2em] 
                        &= ${finalPower} \\cdot (1) = ${finalPower} \\\\[1.2em] 
                        &\\text{Since } \\lim_{x \\to 0} \\ln y = ${finalPower}, \\text{ exponentiate to find } L: \\\\[1.2em]
                        L &= e^{${finalPower}}
                        \\end{aligned}`
                };
            },
            //# Family: (1 + a/x)^(bx) as x -> Infinity
            () => {
                // Generate coefficients
                let a = Utils.getSignedRnd(2, 6); // Inner fraction numerator
                let b = Utils.getSignedRnd(1, 4); // Exponent coefficient

                // Smart string formatting
                const signA = a < 0 ? "-" : "+";
                const absA = Math.abs(a);
                const innerFrac = `\\frac{${absA}}{x}`;
                const inner = `1 ${signA} ${innerFrac}`;
                const exponent = b === 1 ? `x` : (b === -1 ? `-x` : `${b}x`);
                const finalPower = a * b;

                return {
                    expr: `\\lim_{x \\to \\infty} \\left( ${inner} \\right)^{${exponent}}`,
                    ans: `= e^{${finalPower}}`,
                    sol: `\\begin{aligned} 
                        &\\text{Direct substitution yields the indeterminate form } 1^{\\infty}. \\\\[1.2em]
                        &\\text{Let } y = \\left(${inner}\\right)^{${exponent}}. \\text{ Take the natural logarithm:} \\\\[1.2em] 
                        \\ln y &= ${exponent} \\ln\\left(${inner}\\right) \\\\[1.2em] 
                        &\\text{Let } u = \\frac{${a}}{x}. \\text{ Then } x = \\frac{${a}}{u}. \\text{ As } x \\to \\infty, u \\to 0: \\\\[1.2em] 
                        \\lim_{x \\to \\infty} \\ln y &= \\lim_{u \\to 0} ${b === 1 ? "" : b}\\left(\\frac{${a}}{u}\\right) \\ln(1 + u) \\\\[1.2em] 
                        &= \\lim_{u \\to 0} ${finalPower} \\cdot \\frac{\\ln(1 + u)}{u} \\\\[1.2em] 
                        &\\text{Using the special limit } \\lim_{u \\to 0} \\frac{\\ln(1+u)}{u} = 1: \\\\[1.2em] 
                        &= ${finalPower} \\cdot (1) = ${finalPower} \\\\[1.2em] 
                        &\\text{Since } \\lim_{x \\to \\infty} \\ln y = ${finalPower}, \\text{ exponentiate to find } L: \\\\[1.2em]
                        L &= e^{${finalPower}}
                        \\end{aligned}`
                };
            },

            //# Family: The Logarithmic Identity ln(1 + bx) / x
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
            //# Family: Radical Conjugates at Infinity and Negative Infinity sqrt(x^2 + kx) -/+ x as x -> +/- Infinity
            (a, b) => {
                // 1. Setup parameters
                const k = 2 * b; // k is the coefficient of x
                const direction = Utils.getRnd(0, 1); // 0: Infinity, 1: Negative Infinity
                const isPosInf = direction === 0;
                
                const limitTarget = isPosInf ? "\\infty" : "-\\infty";
                const oppositeSign = isPosInf ? "+" : "-"; // Sign used for the conjugate
                
                // 2. Build the inner trinomial and correctly handle the sign of k
                const absK = Math.abs(k);
                let innerTrinomial = "x^2";
                if (k !== 0) {
                    const sign = k > 0 ? "+" : "-";
                    const coeffStr = absK === 1 ? "x" : `${absK}x`;
                    innerTrinomial = `x^2 ${sign} ${coeffStr}`;
                }

                // The expression: sqrt(x^2 + kx) - x (for pos) or sqrt(x^2 + kx) + x (for neg)
                const fullExpr = `\\sqrt{${innerTrinomial}} ${isPosInf ? "-" : "+"} x`;

                // The limit evaluates to k/2 for pos inf, and -k/2 for neg inf
                const finalAns = isPosInf ? b : -b;

                return {
                    expr: `\\lim_{x \\to ${limitTarget}} \\left( ${fullExpr} \\right)`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} 
                        &\\text{Multiply by the conjugate: } \\frac{\\sqrt{${innerTrinomial}} ${oppositeSign} x}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} \\\\ 
                        L & = \\lim_{x \\to ${limitTarget}} \\frac{(${innerTrinomial}) - x^2}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} = \\lim_{x \\to ${limitTarget}} \\frac{${k}x}{\\sqrt{${innerTrinomial}} ${oppositeSign} x} \\\\ 
                        &\\text{Divide the numerator and denominator by } x. \\\\ 
                        &\\text{Crucially, for } x ${isPosInf ? ">" : "<"} 0, \\sqrt{x^2} = |x| = ${isPosInf ? "x" : "-x"}. \\text{ Therefore } \\frac{\\sqrt{${innerTrinomial}}}{x} = ${isPosInf ? "" : "-"} \\sqrt{1 + \\frac{${k}}{x}}. \\\\ 
                        L & = \\lim_{x \\to ${limitTarget}} \\frac{${k}}{${isPosInf ? "" : "-"} \\sqrt{1 + \\frac{${k}}{x}} ${oppositeSign} 1} \\\\ 
                        &\\text{Evaluate as } x \\to ${limitTarget}: \\\\ 
                        L & = \\frac{${k}}{${isPosInf ? "1 + 1" : "-1 - 1"}} = \\frac{${k}}{${isPosInf ? "2" : "-2"}} = ${finalAns}
                        \\end{aligned}`
                };
            },
            //# Family: General Quadratic Radical Limits at Infinity/Negative Infinity sqrt(ax^2 + bx + c) +/- dx as x -> +/- Infinity
            (a, b) => {
                // Helper function to find the greatest common divisor
                const getGCD = (x, y) => {
                    x = Math.abs(x);
                    y = Math.abs(y);
                    while (y) {
                        const t = y;
                        y = x % y;
                        x = t;
                    }
                    return x;
                };

                // Helper function to format a fraction cleanly in LaTeX
                const formatFraction = (num, den) => {
                    if (num === 0) return "0";
                    
                    // Move negative sign to the front if denominator is negative
                    if (den < 0) {
                        num = -num;
                        den = -den;
                    }
                    
                    const gcd = getGCD(num, den);
                    num /= gcd;
                    den /= gcd;
                    
                    if (den === 1) return `${num}`;
                    if (num < 0) return `-\\frac{${Math.abs(num)}}{${den}}`;
                    return `\\frac{${num}}{${den}}`;
                };

                // 1. Setup common parameters
                const innerC = Utils.getRnd(-5, 5); // constant term
                const direction = Utils.getRnd(0, 1); // 0: Infinity, 1: Negative Infinity
                const isPosInf = direction === 0;
                const limitTarget = isPosInf ? "\\infty" : "-\\infty";
                
                // Randomly decide which family of problem to generate
                const isConjugateFamily = Utils.getRnd(0, 1) === 0; 
                
                if (isConjugateFamily) {
                    // ==========================================
                    // FAMILY 1: FINITE LIMITS (Conjugate Method)
                    // ==========================================
                    const outerCoeff = Math.abs(a) > 1 ? Math.abs(a) : 2; 
                    const innerA = outerCoeff * outerCoeff; 
                    const innerB = Math.sign(b) * (Math.abs(b) > 1 ? Math.abs(b) : 1); 

                    const aTerm = innerA === 1 ? "x^2" : `${innerA}x^2`;
                    const bAbs = Math.abs(innerB);
                    const bTerm = bAbs === 1 ? "x" : `${bAbs}x`;
                    const bSign = innerB >= 0 ? " + " : " - ";
                    const cTerm = innerC === 0 ? "" : (innerC > 0 ? ` + ${innerC}` : ` - ${Math.abs(innerC)}`);
                    const innerExpr = `${aTerm}${bSign}${bTerm}${cTerm}`;

                    const origSign = isPosInf ? "-" : "+";
                    const conjSign = isPosInf ? "+" : "-";
                    const fullExpr = `\\sqrt{${innerExpr}} ${origSign} ${outerCoeff}x`;

                    // Fraction calculations
                    const rawNum = isPosInf ? innerB : -innerB;
                    const rawDen = 2 * outerCoeff;
                    const finalAnsStr = formatFraction(rawNum, rawDen);

                    const sqrtDivText = isPosInf ? `\\sqrt{${innerA}} = ${outerCoeff}` : `-\\sqrt{${innerA}} = -${outerCoeff}`;
                    const denomResultText = isPosInf ? `${outerCoeff} + ${outerCoeff}` : `-${outerCoeff} - ${outerCoeff}`;
                    const rawFractionStr = `\\frac{${rawNum}}{${isPosInf ? rawDen : -rawDen}}`;

                    return {
                        expr: `\\lim_{x \\to ${limitTarget}} \\left( ${fullExpr} \\right)`,
                        ans: `= ${finalAnsStr}`,
                        sol: `\\begin{aligned}
                        &\\text{Coefficients match, multiply by the conjugate: } \\frac{\\sqrt{${innerExpr}} ${conjSign} ${outerCoeff}x}{\\sqrt{${innerExpr}} ${conjSign} ${outerCoeff}x} \\\\
                        L &= \\lim_{x \\to ${limitTarget}} \\frac{(${innerExpr}) - (${outerCoeff}x)^2}{\\sqrt{${innerExpr}} ${conjSign} ${outerCoeff}x}
                            = \\lim_{x \\to ${limitTarget}} \\frac{${innerB}x + ${innerC}}{\\sqrt{${innerExpr}} ${conjSign} ${outerCoeff}x} \\\\
                        &\\text{Divide numerator and denominator by } x. \\\\
                        &\\text{As } x \\to ${limitTarget}, \\frac{\\sqrt{${innerA}x^2 + ${innerB}x + ${innerC}}}{x} \\to ${sqrtDivText}. \\\\
                        L &= \\frac{${innerB}}{${denomResultText}} = ${finalAnsStr}
                    \\end{aligned}`
                    };

                } else {
                    // ==========================================
                    // FAMILY 2: INFINITE LIMITS (Factoring Method)
                    // ==========================================
                    let innerA = Utils.getRnd(2, 7);
                    let outerD = Utils.getRnd(-7, 7);
                    if (outerD === 0) outerD = 2; // Prevent 0x
                    
                    // Ensure the coefficients DO NOT perfectly match to force the infinite case
                    if (innerA === outerD * outerD) {
                        innerA += 1; 
                    }

                    const innerB = Math.sign(b) * (Math.abs(b) > 1 ? Math.abs(b) : 1);
                    
                    const aTerm = `${innerA}x^2`;
                    const bAbs = Math.abs(innerB);
                    const bTerm = bAbs === 1 ? "x" : `${bAbs}x`;
                    const bSign = innerB >= 0 ? " + " : " - ";
                    const cTerm = innerC === 0 ? "" : (innerC > 0 ? ` + ${innerC}` : ` - ${Math.abs(innerC)}`);
                    const innerExpr = `${aTerm}${bSign}${bTerm}${cTerm}`;

                    const dSign = outerD > 0 ? "+" : "-";
                    const dAbs = Math.abs(outerD);
                    const fullExpr = `\\sqrt{${innerExpr}} ${dSign} ${dAbs}x`;

                    // Mathematical evaluation
                    const innerRootVal = isPosInf ? Math.sqrt(innerA) : -Math.sqrt(innerA);
                    const limitFactor = innerRootVal + outerD; 
                    
                    let finalAnsStr;
                    if (isPosInf) {
                        finalAnsStr = limitFactor > 0 ? "\\infty" : "-\\infty";
                    } else {
                        finalAnsStr = limitFactor > 0 ? "-\\infty" : "\\infty"; 
                    }
                    
                    const innerFactored = `${innerA}${bSign}\\frac{${bAbs}}{x}${cTerm === "" ? "" : (innerC > 0 ? ` + \\frac{${innerC}}{x^2}` : ` - \\frac{${Math.abs(innerC)}}{x^2}`)}`;
                    const rootEvalStr = isPosInf ? `\\sqrt{${innerA}}` : `-\\sqrt{${innerA}}`;

                    return {
                        expr: `\\lim_{x \\to ${limitTarget}} \\left( ${fullExpr} \\right)`,
                        ans: `= ${finalAnsStr}`,
                        sol: `\\begin{aligned}
                        &\\text{Because the coefficients do not cancel perfectly, we factor out } x: \\\\
                        L &= \\lim_{x \\to ${limitTarget}} x \\left( \\frac{\\sqrt{${innerExpr}}}{x} ${dSign} ${dAbs} \\right) \\\\
                        L &= \\lim_{x \\to ${limitTarget}} x \\left( ${isPosInf ? "" : "-"}\\sqrt{${innerFactored}} ${dSign} ${dAbs} \\right) \\\\
                        &\\text{As } x \\to ${limitTarget}\\text{, the terms with } x \\text{ in the denominator approach } 0: \\\\
                        L &= ${limitTarget} \\cdot \\left( ${rootEvalStr} ${dSign} ${dAbs} \\right) \\\\
                        L &= ${finalAnsStr}
                    \\end{aligned}`
                    };
                }
            },
            //# Family: Limit Definition of Derivative form (f(x+h)-f(x))/h as h -> 0
            (a, b, c) => {
                let val = Math.abs(c) > 1 ? Math.abs(c) : 3;
                let valSq = val * val;
                let twoVal = 2 * val;
                
                return {
                    expr: `\\lim_{h \\to 0} \\frac{(${val} + h)^2 - ${valSq}}{h}`,
                    ans: `= ${twoVal}`,
                    sol: `\\begin{aligned}
                        &\\text{Expand } (${val} + h)^2 = ${valSq} + ${twoVal}h + h^2: \\\\
                        L &= \\lim_{h \\to 0} \\frac{${valSq} + ${twoVal}h + h^2 - ${valSq}}{h} \\\\
                        &= \\lim_{h \\to 0} \\frac{${twoVal}h + h^2}{h} \\\\
                        &= \\lim_{h \\to 0} (${twoVal} + h) = ${twoVal}
                    \\end{aligned}`
                };
            },
            //# Family: Tangent Substitution at Shifted Point (tan(k(x - c)) / (x - c) as x -> c
            (a, b) => {
                let k = Math.abs(b) > 1 ? Math.abs(b) : 2;
                if (k < 2) k = 2;
                
                // Define an array of angle objects to handle both the limit target and the expression term
                const angles = [
                    { val: '\\frac{\\pi}{6}', term: 'x - \\frac{\\pi}{6}' },
                    { val: '-\\frac{\\pi}{6}', term: 'x + \\frac{\\pi}{6}' },
                    { val: '\\frac{\\pi}{4}', term: 'x - \\frac{\\pi}{4}' },
                    { val: '-\\frac{\\pi}{4}', term: 'x + \\frac{\\pi}{4}' },
                    { val: '\\frac{\\pi}{3}', term: 'x - \\frac{\\pi}{3}' },
                    { val: '-\\frac{\\pi}{3}', term: 'x + \\frac{\\pi}{3}' },
                    { val: '\\frac{\\pi}{2}', term: 'x - \\frac{\\pi}{2}' },
                    { val: '-\\frac{\\pi}{2}', term: 'x + \\frac{\\pi}{2}' },
                    { val: '\\pi', term: 'x - \\pi' },
                    { val: '-\\pi', term: 'x + \\pi' }
                ];
                
                // Select an angle. This uses 'a' to pick an index if 'a' is a random number.
                // If 'a' is not a number, it will fallback to picking completely randomly.
                let index = (typeof a === 'number' && !isNaN(a)) 
                    ? Math.floor(Math.abs(a)) % angles.length 
                    : Math.floor(Math.random() * angles.length);
                    
                let selected = angles[index];
                let target = selected.val;
                let term = selected.term;
                
                return {
                    expr: `\\lim_{x \\to ${target}} \\frac{\\tan\\left[${k}\\left(${term}\\right)\\right]}{${term}}`,
                    ans: `= ${k}`,
                    sol: `\\begin{aligned}
                        &\\text{Let } u = ${term}. \\text{ As } x \\to ${target},\\, u \\to 0. \\\\
                        L &= \\lim_{u \\to 0} \\frac{\\tan(${k}u)}{u} \\\\
                        &= ${k} \\cdot \\lim_{u \\to 0} \\frac{\\tan(${k}u)}{${k}u} \\\\
                        &\\text{Using } \\lim_{\\theta \\to 0} \\frac{\\tan \\theta}{\\theta} = 1: \\\\
                        &= ${k} \\cdot 1 = ${k}
                    \\end{aligned}`
                };
            },
            //# Family: Sine over Tangent at Shifted Point (sin(k(x - c)) / tan(m(x - c)) as x -> c
            (a, b, c, d) => {
                let k = Math.abs(a) > 1 ? Math.abs(a) : 2;
                let m = Math.abs(b) > 1 ? Math.abs(b) : 3;
                if (k === m) m = k + 1;
                let common = Utils.gcd(k, m);
                let sNum = k / common;
                let sDen = m / common;
                let finalAns = sDen === 1 ? `${sNum}` : `\\frac{${sNum}}{${sDen}}`;
                
                // Define an array of angle objects to handle both the limit target and the expression term
                const angles = [
                    { val: '\\frac{\\pi}{6}', term: 'x - \\frac{\\pi}{6}' },
                    { val: '-\\frac{\\pi}{6}', term: 'x + \\frac{\\pi}{6}' },
                    { val: '\\frac{\\pi}{4}', term: 'x - \\frac{\\pi}{4}' },
                    { val: '-\\frac{\\pi}{4}', term: 'x + \\frac{\\pi}{4}' },
                    { val: '\\frac{\\pi}{3}', term: 'x - \\frac{\\pi}{3}' },
                    { val: '-\\frac{\\pi}{3}', term: 'x + \\frac{\\pi}{3}' },
                    { val: '\\frac{\\pi}{2}', term: 'x - \\frac{\\pi}{2}' },
                    { val: '-\\frac{\\pi}{2}', term: 'x + \\frac{\\pi}{2}' },
                    { val: '\\pi', term: 'x - \\pi' },
                    { val: '-\\pi', term: 'x + \\pi' }
                ];
                
                // Select an angle using 'c' as the seed, or fallback to random if 'c' isn't numeric
                let index = (typeof c === 'number' && !isNaN(c)) 
                    ? Math.floor(Math.abs(c)) % angles.length 
                    : Math.floor(Math.random() * angles.length);
                    
                let selected = angles[index];
                let target = selected.val;
                let term = selected.term;
                
                return {
                    expr: `\\lim_{x \\to ${target}} \\frac{\\sin\\left[${k}\\left(${term}\\right)\\right]}{\\tan\\left[${m}\\left(${term}\\right)\\right]}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned}
                        &\\text{Let } u = ${term}. \\text{ As } x \\to ${target},\\, u \\to 0. \\\\
                        L &= \\lim_{u \\to 0} \\frac{\\sin(${k}u)}{\\tan(${m}u)} \\\\
                        &\\text{Divide numerator and denominator by } u: \\\\
                        &= \\frac{\\lim_{u \\to 0} \\frac{\\sin(${k}u)}{u}}{\\lim_{u \\to 0} \\frac{\\tan(${m}u)}{u}} \\\\
                        &\\text{Using } \\lim_{\\theta \\to 0} \\frac{\\sin(k\\theta)}{\\theta} = k \\text{ and } \\lim_{\\theta \\to 0} \\frac{\\tan(k\\theta)}{\\theta} = k: \\\\
                        &= \\frac{${k}}{${m}} ${common > 1 ? `= ${finalAns}` : ''}
                    \\end{aligned}`
                };
            },
            //# Family: Piecewise Absolute Value Limit (|x - c| / (x - c) as x -> c from the right and left
            () => {
                // Generate a random target, e.g., between -5 and 5
                const c = Utils.getRnd(-5, 5);
                
                // Randomly pick the direction: right (+) or left (-)
                const isRight = Math.random() > 0.5;
                const dir = isRight ? '+' : '-';
                
                // The answer depends entirely on the direction of the approach
                const ans = isRight ? '1' : '-1';
                
                // Format the internal expression cleanly (e.g. "x + 2" instead of "x - -2", or just "x" if c is 0)
                const term = c > 0 ? `x - ${c}` : (c < 0 ? `x + ${Math.abs(c)}` : `x`);
                
                // Condition for the piecewise absolute value function
                const condition = isRight ? `x > ${c}` : `x < ${c}`;
                
                // The numerator after applying the definition of absolute value
                let evaluatedAbs;
                if (isRight) {
                    evaluatedAbs = term; // e.g., x + 2
                } else {
                    evaluatedAbs = c === 0 ? '-x' : `-(${term})`; // e.g., -(x + 2)
                }
                
                return {
                    expr: `\\lim_{x \\to ${c}^{${dir}}} \\frac{|${term}|}{${term}}`,
                    ans: `= ${ans}`,
                    sol: `\\text{For } ${condition}, \\, |${term}| = ${evaluatedAbs} \\implies \\frac{${evaluatedAbs}}{${term}} = ${ans}`
                };
            },
            //# Family: Pythagorean Boundary Limits (k = 1 or 2)
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
        ],
        hard: [
            //# Family: Advanced Trig Limit with Radicals ( sin^2(ax) / (1 - \sqrt{\cos bx}) )
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
                        &= \\frac{${numVal}}{${denVal}} ${(common > 1 || denVal === 1) ? `= ${finalAns}` : ''}
                        \\end{aligned}`
                };
            },
            //# Family: Cubic Sine Limit (sin(ax) - ax) / x^3
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
                        L &= ${a3} \\left( -\\frac{1}{6} \\right) = -\\frac{${a3}}{6} ${common > 1 ? `= ${finalAns}` : ''}
                        \\end{aligned}`
                };
            },
            //# Family: Squeeze Theorem with Oscillating Function (x^2 * sin(1/x) as x -> 0
            () => ({
                expr: `\\lim_{x \\to 0} x^2 \\sin\\left(\\frac{1}{x}\\right)`,
                ans: `= 0`,
                sol: `\\text{Squeeze Theorem: } -x^2 \\le x^2\\sin(1/x) \\le x^2. \\text{ Both sides } \\to 0`
            }),
            //# Family: Limit Requiring Substitution with Shifted Point (1 - cos(k(x - c))) / (x - c)^2 as x -> c
            () => {
                const b = Utils.getRnd(1, 6);
                
                // Define an array of angle objects to properly format limit targets and substitution terms
                const angles = [
                    { val: '\\frac{\\pi}{6}', term: 'x - \\frac{\\pi}{6}' },
                    { val: '-\\frac{\\pi}{6}', term: 'x + \\frac{\\pi}{6}' },
                    { val: '\\frac{\\pi}{4}', term: 'x - \\frac{\\pi}{4}' },
                    { val: '-\\frac{\\pi}{4}', term: 'x + \\frac{\\pi}{4}' },
                    { val: '\\frac{\\pi}{3}', term: 'x - \\frac{\\pi}{3}' },
                    { val: '-\\frac{\\pi}{3}', term: 'x + \\frac{\\pi}{3}' },
                    { val: '\\frac{\\pi}{2}', term: 'x - \\frac{\\pi}{2}' },
                    { val: '-\\frac{\\pi}{2}', term: 'x + \\frac{\\pi}{2}' },
                    { val: '\\pi', term: 'x - \\pi' },
                    { val: '-\\pi', term: 'x + \\pi' }
                ];
                
                // Select an angle randomly
                const selected = angles[Math.floor(Math.random() * angles.length)];
                const target = selected.val;
                const term = selected.term;
                
                // Result logic: (b^2)/2
                const num = b * b;
                const den = 2;
                const common = Utils.gcd(num, den);
                
                const finalNum = num / common;
                const finalDen = den / common;
                const finalAns = finalDen === 1 ? `${finalNum}` : `\\frac{${finalNum}}{${finalDen}}`;

                // Swap x - ang for our cleanly formatted term variable
                const inner = b === 1 ? term : `${b}(${term})`;
                const innerU = b === 1 ? `u` : `${b}u`;
                
                return {
                    expr: `\\lim_{x \\to ${target}} \\frac{1 - \\cos(${inner})}{(${term})^2}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned}
                        &\\text{Let } u = ${term}. \\text{ As } x \\to ${target}, u \\to 0: \\\\
                        L &= \\lim_{u \\to 0} \\frac{1 - \\cos(${innerU})}{u^2} \\\\
                        &\\text{To use the standard limit } \\lim_{\\theta \\to 0} \\frac{1 - \\cos \\theta}{\\theta^2} = \\frac{1}{2}, \\text{ we need } (${innerU})^2 \\text{ in the denominator:} \\\\
                        L &= \\lim_{u \\to 0} \\left[ \\frac{1 - \\cos(${innerU})}{(${innerU})^2} \\cdot ${b}^2 \\right] \\\\
                        &= ${b}^2 \\cdot \\lim_{u \\to 0} \\frac{1 - \\cos(${innerU})}{(${innerU})^2} \\\\
                        &= ${b * b} \\cdot \\frac{1}{2} = ${finalAns}
                    \\end{aligned}`
                };
            },
            //# Family: Sine over Linear with Shifted Point and Parity Twist (sin(k(x - c)) / (x - c) as x -> c, where k is an integer that creates a parity effect
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

            //# The "x * sin(ax) / sin^2(bx)" family
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

            //# Family: tan(ax) / sin(bx)
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

            //# Family: sin^2(ax) / (x * tan(bx))
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

            //# Family: x^2 * sin(ax) / sin^3(bx)
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
                        &= (${a}) \\cdot \\left(\\frac{1}{${b}}\\right)^3 = \\frac{${a}}{${b3}} ${(common > 1 || b3 === 1) ? `= ${finalAns}` : ''}
                        \\end{aligned}`
                };
            },

            //# Family: (sin ax * sin bx) / (x * tan cx)
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
                        &= (${a}) \\cdot (${b}) \\cdot \\frac{1}{${c}} = \\frac{${num}}{${c}} ${(common > 1 || c === 1) ? `= ${finalAns}` : ''}
                        \\end{aligned}`
                };
            },

            //# Family: (cos ax - cos bx) / x^2
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

            //# Family: (sin ax - sin bx) / (tan cx - tan dx)
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

            //# Family: (1 - cos ax)(b + cos x) / (x * tan cx)
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

            //# Family: sin(k * pi * cos^2(ax)) / x^2
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

            //# Family: Shifted Cubic Trig Limits
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

            //# Family: Pi/4 Tangent-Sine Ratio
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
            }
        ]
    };
    window.limit = limit;
