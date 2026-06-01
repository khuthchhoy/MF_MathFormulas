const F = {
    c: (coef, isLeading = true) => {
        if (coef === 0) return "";
        let abs = Math.abs(coef);
        let str = abs === 1 ? "" : abs.toString();
        if (coef < 0) return isLeading ? `-${str}` : `- ${str}`;
        return isLeading ? `${str}` : `+ ${str}`;
    },
    num: (n, isLeading = true) => {
        if (n === 0) return "";
        let abs = Math.abs(n);
        if (n < 0) return isLeading ? `-${abs}` : `- ${abs}`;
        return isLeading ? `${abs}` : `+ ${abs}`;
    },
    div: (numStr, den) => {
        if (den === 1) return numStr === "1" ? "" : numStr === "-1" ? "-" : numStr;
        if (den === -1) return numStr === "1" ? "-" : numStr === "-1" ? "" : `-${numStr}`;
        if (numStr === "1" && den < 0) return `-\\frac{1}{${Math.abs(den)}}`;
        if (numStr === "-1" && den < 0) return `\\frac{1}{${Math.abs(den)}}`;
        if (numStr === "1") return `\\frac{1}{${den}}`;
        if (numStr === "-1") return `-\\frac{1}{${den}}`;
        if (den < 0) return `-\\frac{${numStr}}{${Math.abs(den)}}`;
        return `\\frac{${numStr}}{${den}}`;
    },
    mul: (coef, str) => {
        if (coef === 0) return "0";
        if (coef === 1) return str;
        if (coef === -1) return `-${str}`;
        return `${coef}${str}`;
    },
    mulDot: (coef, str) => {
        if (coef === 0) return "0";
        if (coef === 1) return str;
        if (coef === -1) return `-${str}`;
        return `${coef} \\cdot ${str}`;
    },
    gcd: (x, y) => y === 0 ? Math.abs(x) : F.gcd(y, x % y),
    frac: (num, den, isLeading = false) => {
        if (num === 0) return "0";
        let isNeg = (num < 0 && den > 0) || (num > 0 && den < 0);
        let absN = Math.abs(num);
        let absD = Math.abs(den);
        let g = F.gcd(absN, absD);
        let fn = absN / g;
        let fd = absD / g;
        
        let sign = isNeg ? (isLeading ? "-" : "- ") : (isLeading ? "" : "+ ");
        if (fd === 1) {
            let val = fn === 1 ? "" : fn.toString();
            return `${sign}${val}`;
        }
        return `${sign}\\frac{${fn}}{${fd}}`;
    }
};

const integral = {
    easy: [
        // 1. Polynomial Power Rule
        (a, b, c, d) => {
            let pwr = Math.abs(b) >= 1 && Math.abs(b) <= 5 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 2;
            let constC = c !== 0 ? c : 3;
            let coef = coA * (pwr + 1);
            
            return {
                expr: `\\int \\left( ${F.c(coef, true)}x^{${pwr}} ${F.num(constC, false)} \\right) \\, dx`,
                ans: `= ${F.c(coA, true)}x^{${pwr + 1}} ${F.c(constC, false)}x + C`,
                sol: `\\begin{aligned}
                    &\\text{Integrate term-by-term via the Power Rule:} \\\\
                    &= \\int ${F.c(coef, true)}x^{${pwr}} \\, dx + \\int (${constC}) \\, dx \\\\
                    &= ${F.mulDot(coef, `\\frac{x^{${pwr + 1}}}{${pwr + 1}}`)} ${F.c(constC, false)}x + C \\\\
                    &= ${F.c(coA, true)}x^{${pwr + 1}} ${F.c(constC, false)}x + C
                \\end{aligned}`
            };
        },
        // 2. Basic Exponential
        (a, b, c, d) => {
            let k = b !== 0 ? b : 2;
            let coA = a !== 0 ? a : 3;
            let coef = coA * k;
            let kStr = F.c(k, true);
            
            return {
                expr: `\\int ${F.c(coef, true)}e^{${kStr}x} \\, dx`,
                ans: `= ${F.c(coA, true)}e^{${kStr}x} + C`,
                sol: `\\begin{aligned}
                    &\\text{The antiderivative of } e^{kx} \\text{ is } \\frac{1}{k}e^{kx}: \\\\
                    &= ${F.mulDot(coef, `${F.div("1", k)}e^{${kStr}x}`)} + C \\\\
                    &= ${F.c(coA, true)}e^{${kStr}x} + C
                \\end{aligned}`
            };
        },
        // 3. Basic Trigonometric (Sine/Cosine)
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 4;
            let coef = coA * k;
            let isSin = Math.abs(c) % 2 === 0;
            let func = isSin ? '\\sin' : '\\cos';
            let antiFunc = isSin ? '-\\cos' : '\\sin';
            let finalCoA = isSin ? -coA : coA;
            
            return {
                expr: `\\int ${F.c(coef, true)} ${func}(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(finalCoA, true)} ${antiFunc.replace('-', '')}(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use standard trigonometric rules:} \\\\
                    &= ${F.mulDot(coef, `${F.div("1", k)} (${antiFunc}(${F.c(k, true)}x))`)} + C \\\\
                    &= ${F.c(finalCoA, true)} ${antiFunc.replace('-', '')}(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 4. Logarithmic Form
        (a, b, c, d) => {
            let k = Math.abs(a) !== 0 ? Math.abs(a) : 5;
            let kStr = F.c(k, true);
            return {
                expr: `\\int \\frac{${k}}{x} \\, dx`,
                ans: `= ${kStr}\\ln|x| + C`,
                sol: `\\begin{aligned}
                    &\\text{The integral of } \\frac{1}{x} \\text{ is } \\ln|x|: \\\\
                    &= ${k} \\int \\frac{1}{x} \\, dx \\\\
                    &= ${kStr}\\ln|x| + C
                \\end{aligned}`
            };
        },
        // 5. Radicals / Fractional Exponents
        (a, b, c, d) => {
            let coA = a !== 0 ? a : 3;
            let isFractional = Math.abs(c) % 2 === 0;
            if (isFractional) {
                let termExpr = `${F.c(coA, true)}\\sqrt{x}`;
                let termAns = `${F.frac(2*coA, 3, true)}x\\sqrt{x}`;
                let termSol = `\\begin{aligned}
                    &\\text{Rewrite the radical as a fractional exponent:} \\\\
                    &= \\int ${F.c(coA, true)}x^{1/2} \\, dx \\\\
                    &\\text{Apply the Power Rule: } \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} \\text{ for } n \\neq -1: \\\\
                    &= ${F.c(coA, true)} \\cdot \\frac{x^{3/2}}{3/2} + C \\\\
                    &= ${F.c(coA, true)} \\cdot \\frac{2}{3}x^{3/2} + C \\\\
                    &= ${F.frac(2*coA, 3, true)}x\\sqrt{x} + C
                \\end{aligned}`;
                return { expr: `\\int ${termExpr} \\, dx`, ans: `= ${termAns} + C`, sol: termSol };
            } else {
                let termExpr = `\\frac{${Math.abs(coA)}}{\\sqrt{x}}`;
                if (coA < 0) termExpr = `-\\frac{${Math.abs(coA)}}{\\sqrt{x}}`;
                let termAns = `${F.c(2*coA, true)}\\sqrt{x}`;
                let termSol = `\\begin{aligned}
                    &\\text{Rewrite the integrand using a negative exponent:} \\\\
                    &= \\int ${F.c(coA, true)}x^{-1/2} \\, dx \\\\
                    &\\text{Apply the Power Rule: } \\int x^n \\, dx = \\frac{x^{n+1}}{n+1}: \\\\
                    &= ${F.c(coA, true)} \\cdot \\frac{x^{1/2}}{1/2} + C \\\\
                    &= ${F.c(coA, true)} \\cdot 2x^{1/2} + C \\\\
                    &= ${F.c(2*coA, true)}\\sqrt{x} + C
                \\end{aligned}`;
                return { expr: `\\int ${termExpr} \\, dx`, ans: `= ${termAns} + C`, sol: termSol };
            }
        },
        // 6. Secant-Tangent
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 3;
            let coef = coA * k;
            return {
                expr: `\\int ${F.c(coef, true)} \\sec(${F.c(k, true)}x)\\tan(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(coA, true)} \\sec(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{The antiderivative of } \\sec(kx)\\tan(kx) \\text{ is } \\frac{1}{k}\\sec(kx): \\\\
                    &= ${F.mulDot(coef, `${F.div("1", k)} \\sec(${F.c(k, true)}x)`)} + C \\\\
                    &= ${F.c(coA, true)} \\sec(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 7. Cosecant-Squared
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 3;
            let coA = a !== 0 ? a : 2;
            let coef = coA * k;
            let antiCoA = -coA;
            return {
                expr: `\\int ${F.c(coef, true)} \\csc^2(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(antiCoA, true)} \\cot(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{The antiderivative of } \\csc^2(kx) \\text{ is } -\\frac{1}{k}\\cot(kx): \\\\
                    &= ${F.mulDot(coef, `\\left( -${F.div("1", k)} \\cot(${F.c(k, true)}x) \\right)`)} + C \\\\
                    &= ${F.c(antiCoA, true)} \\cot(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 8. General Exponential
        (a, b, c, d) => {
            let base = [2, 3, 5][Math.abs(c) % 3];
            let k = Math.abs(b) > 0 && Math.abs(b) <= 4 ? Math.abs(b) : 2;
            let coC = a !== 0 ? Math.abs(a) : 3;
            let g = F.gcd(coC, k);
            let num = coC / g;
            let den = k / g;
            
            let coeffExpr = coC === 1 ? "" : `${coC} \\cdot `;
            let expr = `\\int ${coeffExpr} ${base}^{${F.c(k, true)}x} \\, dx`;
            
            let ansCoeff = "";
            if (num === 1 && den === 1) {
                ansCoeff = `\\frac{${base}^{${F.c(k, true)}x}}{\\ln(${base})}`;
            } else if (den === 1) {
                ansCoeff = `\\frac{${num} \\cdot ${base}^{${F.c(k, true)}x}}{\\ln(${base})}`;
            } else if (num === 1) {
                ansCoeff = `\\frac{${base}^{${F.c(k, true)}x}}{${den}\\ln(${base})}`;
            } else {
                ansCoeff = `\\frac{${num} \\cdot ${base}^{${F.c(k, true)}x}}{${den}\\ln(${base})}`;
            }
            let ans = `= ${ansCoeff} + C`;
            
            let sol = `\\begin{aligned}
                &\\text{Recall the general exponential rule: } \\int b^x \\, dx = \\frac{b^x}{\\ln(b)} \\\\
                &\\text{Using substitution, let } u = ${F.c(k, true)}x \\implies du = ${k} \\, dx \\implies dx = ${F.div("du", k)}: \\\\
                &= \\int ${coeffExpr} ${base}^u \\cdot ${F.div("du", k)} \\\\
                &= ${F.frac(coC, k, true)} \\int ${base}^u \\, du \\\\
                &= ${F.frac(coC, k, true)} \\cdot \\frac{${base}^u}{\\ln(${base})} + C \\\\
                &= ${ansCoeff} + C
            \\end{aligned}`;
            
            return { expr, ans, sol };
        }
    ],
    med: [
        // 1. Algebraic U-Sub
        (a, b, c, d) => {
            let n = Math.abs(b) >= 1 && Math.abs(b) <= 4 ? Math.abs(b) : 2;
            let nPlus1 = n + 1;
            let coA = a !== 0 ? a : 2;
            let coef = coA * nPlus1;
            return {
                expr: `\\int ${F.c(coef, true)}x^{${n}} e^{x^{${nPlus1}}} \\, dx`,
                ans: `= ${F.c(coA, true)}e^{x^{${nPlus1}}} + C`,
                sol: `\\begin{aligned}
                    &\\text{Let } u = x^{${nPlus1}} \\implies du = ${F.c(nPlus1, true)}x^{${n}} \\, dx \\implies dx = ${F.div("du", `${nPlus1}x^{${n}}`)} \\\\
                    &\\text{Substitute:} \\\\
                    &= \\int ${F.c(coef, true)}x^{${n}} e^u \\cdot ${F.div("du", `${nPlus1}x^{${n}}`)} \\\\
                    &= \\int ${F.c(coA, true)}e^u \\, du = ${F.c(coA, true)}e^u + C \\\\
                    &= ${F.c(coA, true)}e^{x^{${nPlus1}}} + C
                \\end{aligned}`
            };
        },
        // 2. Trigonometric U-Sub
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 3;
            let coA = a !== 0 ? a : 2;
            let coef = coA * 2 * k;
            return {
                expr: `\\int ${F.c(coef, true)}x \\cos(${F.c(k, true)}x^2) \\, dx`,
                ans: `= ${F.c(coA, true)} \\sin(${F.c(k, true)}x^2) + C`,
                sol: `\\begin{aligned}
                    &\\text{Let } u = ${F.c(k, true)}x^2 \\implies du = ${F.c(2*k, true)}x \\, dx \\implies dx = ${F.div("du", `${2*k}x`)} \\\\
                    &= \\int ${F.c(coef, true)}x \\cos(u) \\cdot ${F.div("du", `${2*k}x`)} \\\\
                    &= \\int ${F.c(coA, true)} \\cos(u) \\, du = ${F.c(coA, true)}\\sin(u) + C \\\\
                    &= ${F.c(coA, true)} \\sin(${F.c(k, true)}x^2) + C
                \\end{aligned}`
            };
        },
        // 3. Secant Squared
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 4;
            let coA = a !== 0 ? a : 3;
            let coef = coA * k;
            return {
                expr: `\\int ${F.c(coef, true)} \\sec^2(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(coA, true)} \\tan(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{The antiderivative of } \\sec^2(kx) \\text{ is } \\frac{1}{k}\\tan(kx): \\\\
                    &= ${F.mulDot(coef, `${F.div("1", k)} \\tan(${F.c(k, true)}x)`)} + C \\\\
                    &= ${F.c(coA, true)} \\tan(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 4. Inverse Tangent Form
        (a, b, c, d) => {
            let a_sq = Math.abs(c) !== 0 ? Math.abs(c) : 5;
            let val = a_sq * a_sq;
            let k = a !== 0 ? a : 2;
            let coef = k * a_sq;
            return {
                expr: `\\int \\frac{${coef}}{x^2 + ${val}} \\, dx`,
                ans: `= ${F.c(k, true)} \\arctan\\left(${F.div("x", a_sq)}\\right) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use the inverse tangent form: } \\int \\frac{1}{x^2 + a^2} \\, dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) \\\\
                    &\\text{Here, } a^2 = ${val} \\implies a = ${a_sq}. \\text{ Factor out } ${coef}: \\\\
                    &= ${F.mul(coef, `\\left( ${F.div("1", a_sq)}\\arctan\\left(${F.div("x", a_sq)}\\right) \\right)`)} + C \\\\
                    &= ${F.c(k, true)} \\arctan\\left(${F.div("x", a_sq)}\\right) + C
                \\end{aligned}`
            };
        },
        // 5. Linear Denominator
        (a, b, c, d) => {
            let m = Math.abs(b) > 0 ? Math.abs(b) : 3;
            let constB = c !== 0 ? c : 4;
            let k = a !== 0 ? a : 2;
            let coef = k * m;
            return {
                expr: `\\int \\frac{${coef}}{${F.c(m, true)}x ${F.num(constB, false)}} \\, dx`,
                ans: `= ${F.c(k, true)}\\ln|${F.c(m, true)}x ${F.num(constB, false)}| + C`,
                sol: `\\begin{aligned}
                    &\\text{Let } u = ${F.c(m, true)}x ${F.num(constB, false)} \\implies du = ${m} \\, dx \\implies dx = ${F.div("du", m)} \\\\
                    &= \\int \\frac{${coef}}{u} \\cdot ${F.div("du", m)} \\\\
                    &= \\int ${F.c(k, true)}\\frac{1}{u} \\, du = ${F.c(k, true)}\\ln|u| + C \\\\
                    &= ${F.c(k, true)}\\ln|${F.c(m, true)}x ${F.num(constB, false)}| + C
                \\end{aligned}`
            };
        },
        // 6. Logarithmic U-Sub
        (a, b, c, d) => {
            let coA = a !== 0 ? a : 2;
            let termExpr = "";
            if (coA === 1) termExpr = `\\frac{\\ln(x)}{x}`;
            else if (coA === -1) termExpr = `-\\frac{\\ln(x)}{x}`;
            else if (coA < 0) termExpr = `-\\frac{${Math.abs(coA)}\\ln(x)}{x}`;
            else termExpr = `\\frac{${coA}\\ln(x)}{x}`;
            
            let termAns = `${F.frac(coA, 2, true)}\\ln^2(x)`;
            let termSol = `\\begin{aligned}
                &\\text{Let } u = \\ln(x) \\implies du = \\frac{1}{x} \\, dx \\implies dx = x \\, du \\\\
                &\\text{Substitute into the integral:} \\\\
                &= \\int ${F.c(coA, true)} \\frac{u}{x} \\cdot (x \\, du) \\\\
                &= \\int ${F.c(coA, true)} u \\, du \\\\
                &= ${F.c(coA, true)} \\cdot \\frac{u^2}{2} + C \\\\
                &= ${termAns} + C
            \\end{aligned}`;
            
            return {
                expr: `\\int ${termExpr} \\, dx`,
                ans: `= ${termAns} + C`,
                sol: termSol
            };
        },
        // 7. Exponential U-Sub
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 3;
            let coef = coA * k;
            
            return {
                expr: `\\int ${F.c(coef, true)} \\cos(${F.c(k, true)}x) e^{\\sin(${F.c(k, true)}x)} \\, dx`,
                ans: `= ${F.c(coA, true)} e^{\\sin(${F.c(k, true)}x)} + C`,
                sol: `\\begin{aligned}
                    &\\text{Let } u = \\sin(${F.c(k, true)}x) \\implies du = ${F.c(k, true)} \\cos(${F.c(k, true)}x) \\, dx \\implies dx = ${F.div("du", `${F.c(k, true)}\\cos(${F.c(k, true)}x)`)} \\\\
                    &\\text{Substitute:} \\\\
                    &= \\int ${F.c(coef, true)} \\cos(${F.c(k, true)}x) e^u \\cdot ${F.div("du", `${F.c(k, true)}\\cos(${F.c(k, true)}x)`)} \\\\
                    &= \\int ${F.c(coA, true)} e^u \\, du \\\\
                    &= ${F.c(coA, true)} e^u + C \\\\
                    &= ${F.c(coA, true)} e^{\\sin(${F.c(k, true)}x)} + C
                \\end{aligned}`
            };
        },
        // 8. Polynomial Power U-Sub
        (a, b, c, d) => {
            let n = [3, 4][Math.abs(c) % 2];
            let constB = d !== 0 ? d : 2;
            let coA = a !== 0 ? a : 1;
            let coefExpr = 3 * coA;
            let nPlus1 = n + 1;
            
            return {
                expr: `\\int ${F.c(coefExpr, true)}x^2 (x^3 ${F.num(constB, false)})^{${n}} \\, dx`,
                ans: `= ${F.frac(coA, nPlus1, true)}(x^3 ${F.num(constB, false)})^{${nPlus1}} + C`,
                sol: `\\begin{aligned}
                    &\\text{Let } u = x^3 ${F.num(constB, false)} \\implies du = 3x^2 \\, dx \\implies dx = ${F.div("du", "3x^2")} \\\\
                    &\\text{Substitute into the integral:} \\\\
                    &= \\int ${F.c(coefExpr, true)}x^2 u^{${n}} \\cdot ${F.div("du", "3x^2")} \\\\
                    &= \\int ${F.c(coA, true)}u^{${n}} \\, du \\\\
                    &= ${F.c(coA, true)} \\cdot \\frac{u^{${nPlus1}}}{${nPlus1}} + C \\\\
                    &= ${F.frac(coA, nPlus1, true)}(x^3 ${F.num(constB, false)})^{${nPlus1}} + C
                \\end{aligned}`
            };
        },
        // 9. Tangent / Cotangent Forms
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 3;
            let coef = coA * k;
            let isTan = Math.abs(c) % 2 === 0;
            
            if (isTan) {
                return {
                    expr: `\\int ${F.c(coef, true)} \\tan(${F.c(k, true)}x) \\, dx`,
                    ans: `= ${F.c(coA, true)} \\ln|\\sec(${F.c(k, true)}x)| + C`,
                    sol: `\\begin{aligned}
                        &\\text{Rewrite using sine and cosine:} \\\\
                        &= \\int ${F.c(coef, true)} \\frac{\\sin(${F.c(k, true)}x)}{\\cos(${F.c(k, true)}x)} \\, dx \\\\
                        &\\text{Let } u = \\cos(${F.c(k, true)}x) \\implies du = -${k}\\sin(${F.c(k, true)}x) \\, dx \\implies dx = ${F.div("du", `-${k}\\sin(${F.c(k, true)}x)`)} \\\\
                        &= \\int ${F.c(coef, true)} \\frac{\\sin(${F.c(k, true)}x)}{u} \\cdot ${F.div("du", `-${k}\\sin(${F.c(k, true)}x)`)} \\\\
                        &= \\int ${F.c(-coA, true)} \\frac{1}{u} \\, du \\\\
                        &= ${F.c(-coA, true)} \\ln|u| + C = ${F.c(-coA, true)} \\ln|\\cos(${F.c(k, true)}x)| + C \\\\
                        &\\text{Using logarithm properties } (-\\ln|y| = \\ln|y^{-1}| = \\ln|\\sec y|): \\\\
                        &= ${F.c(coA, true)} \\ln|\\sec(${F.c(k, true)}x)| + C
                    \\end{aligned}`
                };
            } else {
                return {
                    expr: `\\int ${F.c(coef, true)} \\cot(${F.c(k, true)}x) \\, dx`,
                    ans: `= ${F.c(coA, true)} \\ln|\\sin(${F.c(k, true)}x)| + C`,
                    sol: `\\begin{aligned}
                        &\\text{Rewrite using cosine and sine:} \\\\
                        &= \\int ${F.c(coef, true)} \\frac{\\cos(${F.c(k, true)}x)}{\\sin(${F.c(k, true)}x)} \\, dx \\\\
                        &\\text{Let } u = \\sin(${F.c(k, true)}x) \\implies du = ${k}\\cos(${F.c(k, true)}x) \\, dx \\implies dx = ${F.div("du", `${k}\\cos(${F.c(k, true)}x)`)} \\\\
                        &= \\int ${F.c(coef, true)} \\frac{\\cos(${F.c(k, true)}x)}{u} \\cdot ${F.div("du", `${k}\\cos(${F.c(k, true)}x)`)} \\\\
                        &= \\int ${F.c(coA, true)} \\frac{1}{u} \\, du \\\\
                        &= ${F.c(coA, true)} \\ln|u| + C \\\\
                        &= ${F.c(coA, true)} \\ln|\\sin(${F.c(k, true)}x)| + C
                    \\end{aligned}`
                };
            }
        },
        // 10. Inverse Sine Form
        (a, b, c, d) => {
            let valB = Math.abs(c) !== 0 ? Math.abs(c) : 3;
            let bSq = valB * valB;
            let coA = a !== 0 ? a : 2;
            
            let termExpr = `\\frac{${Math.abs(coA)}}{\\sqrt{${bSq} - x^2}}`;
            if (coA < 0) termExpr = `-\\frac{${Math.abs(coA)}}{\\sqrt{${bSq} - x^2}}`;
            
            return {
                expr: `\\int ${termExpr} \\, dx`,
                ans: `= ${F.c(coA, true)} \\arcsin\\left(${F.div("x", valB)}\\right) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use the inverse sine integration formula: } \\int \\frac{1}{\\sqrt{a^2 - x^2}} \\, dx = \\arcsin\\left(\\frac{x}{a}\\right) \\\\
                    &\\text{Here, } a^2 = ${bSq} \\implies a = ${valB}. \\text{ Factor out the coefficient } ${coA}: \\\\
                    &= ${coA === 1 ? "" : coA === -1 ? "-" : `${coA} `} \\int \\frac{1}{\\sqrt{${bSq} - x^2}} \\, dx \\\\
                    &= ${F.c(coA, true)} \\arcsin\\left(${F.div("x", valB)}\\right) + C
                \\end{aligned}`
            };
        }
    ],
    hard: [
        // 1. Integration by Parts (Algebraic * Exponential)
        (a, b, c, d) => {
            let k = b !== 0 ? b : 2;
            let kSq = k * k;
            let coA = a !== 0 ? a : 3;
            let coef = coA * kSq;
            return {
                expr: `\\int ${F.c(coef, true)}x e^{${F.c(k, true)}x} \\, dx`,
                ans: `= ${F.c(coA * k, true)}x e^{${F.c(k, true)}x} ${F.c(-coA, false)} e^{${F.c(k, true)}x} + C`,
                sol: `\\begin{aligned}
                    &\\text{Use Integration by Parts: } \\int u \\, dv = uv - \\int v \\, du \\\\
                    &\\text{Let } u = ${F.c(coef, true)}x \\implies du = ${coef} \\, dx \\\\
                    &\\text{Let } dv = e^{${F.c(k, true)}x} \\, dx \\implies v = ${F.div("1", k)} e^{${F.c(k, true)}x} \\\\
                    &= (${F.c(coef, true)}x)\\left(${F.div("1", k)} e^{${F.c(k, true)}x}\\right) - \\int \\left(${F.div("1", k)} e^{${F.c(k, true)}x}\\right)(${coef}) \\, dx \\\\
                    &= ${F.c(coA * k, true)}x e^{${F.c(k, true)}x} - \\int ${F.c(coA * k, true)} e^{${F.c(k, true)}x} \\, dx \\\\
                    &= ${F.c(coA * k, true)}x e^{${F.c(k, true)}x} ${F.c(-coA, false)} e^{${F.c(k, true)}x} + C
                \\end{aligned}`
            };
        },
        // 2. Integration by Parts (Algebraic * Trigonometric)
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let kSq = k * k;
            let coA = a !== 0 ? a : 3;
            let coef = coA * kSq;
            return {
                expr: `\\int ${F.c(coef, true)}x \\sin(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(-coA * k, true)}x \\cos(${F.c(k, true)}x) ${F.c(coA, false)} \\sin(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use Integration by Parts: } \\int u \\, dv = uv - \\int v \\, du \\\\
                    &\\text{Let } u = ${F.c(coef, true)}x \\implies du = ${coef} \\, dx \\\\
                    &\\text{Let } dv = \\sin(${F.c(k, true)}x) \\, dx \\implies v = ${F.div("-1", k)} \\cos(${F.c(k, true)}x) \\\\
                    &= (${F.c(coef, true)}x)\\left(${F.div("-1", k)} \\cos(${F.c(k, true)}x)\\right) - \\int \\left(${F.div("-1", k)} \\cos(${F.c(k, true)}x)\\right)(${coef}) \\, dx \\\\
                    &= ${F.c(-coA * k, true)}x \\cos(${F.c(k, true)}x) + \\int ${F.c(coA * k, true)} \\cos(${F.c(k, true)}x) \\, dx \\\\
                    &= ${F.c(-coA * k, true)}x \\cos(${F.c(k, true)}x) ${F.c(coA, false)} \\sin(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 3. Integration by Parts (Logarithmic)
        (a, b, c, d) => {
            let n = Math.abs(b) >= 1 && Math.abs(b) <= 5 ? Math.abs(b) : 2;
            let nPlus1 = n + 1;
            let nPlus1Sq = nPlus1 * nPlus1;
            let coA = a !== 0 ? a : 2;
            let coef = coA * nPlus1Sq;
            return {
                expr: `\\int ${F.c(coef, true)}x^{${n}} \\ln(x) \\, dx`,
                ans: `= ${F.c(coA * nPlus1, true)}x^{${nPlus1}} \\ln(x) ${F.c(-coA, false)}x^{${nPlus1}} + C`,
                sol: `\\begin{aligned}
                    &\\text{Use Integration by Parts. Let } u = \\ln(x) \\implies du = \\frac{1}{x} \\, dx \\\\
                    &\\text{Let } dv = ${F.c(coef, true)}x^{${n}} \\, dx \\implies v = ${F.mul(coef, `${F.div("1", nPlus1)}x^{${nPlus1}}`)} = ${F.c(coA * nPlus1, true)}x^{${nPlus1}} \\\\
                    &= (\\ln x)(${F.c(coA * nPlus1, true)}x^{${nPlus1}}) - \\int (${F.c(coA * nPlus1, true)}x^{${nPlus1}}) \\left(\\frac{1}{x}\\right) \\, dx \\\\
                    &= ${F.c(coA * nPlus1, true)}x^{${nPlus1}} \\ln(x) - \\int ${F.c(coA * nPlus1, true)}x^{${n}} \\, dx \\\\
                    &= ${F.c(coA * nPlus1, true)}x^{${nPlus1}} \\ln(x) - ${F.mul(coA * nPlus1, `${F.div("1", nPlus1)}x^{${nPlus1}}`)} + C \\\\
                    &= ${F.c(coA * nPlus1, true)}x^{${nPlus1}} \\ln(x) ${F.c(-coA, false)}x^{${nPlus1}} + C
                \\end{aligned}`
            };
        },
        // 4. Partial Fractions
        (a, b, c, d) => {
            let p1 = Math.abs(c) !== 0 ? Math.abs(c) : 2;
            let p2 = Math.abs(d) !== 0 && Math.abs(d) !== p1 ? Math.abs(d) : p1 + 1;
            let diff = Math.abs(p1 - p2);
            let k = a !== 0 ? a : 3;
            let coef = k * diff;
            let termB = -(p1 + p2);
            let termC = p1 * p2;
            
            return {
                expr: `\\int \\frac{${coef}}{x^2 ${F.c(termB, false)}x ${F.num(termC, false)}} \\, dx`,
                ans: `= ${F.c(k, true)} \\ln\\left| \\frac{x - ${Math.max(p1, p2)}}{x - ${Math.min(p1, p2)}} \\right| + C`,
                sol: `\\begin{aligned}
                    &\\text{Factor the denominator: } x^2 ${F.c(termB, false)}x ${F.num(termC, false)} = (x - ${p1})(x - ${p2}) \\\\
                    &\\text{Partial Fractions Decomposition: } \\\\
                    &\\frac{${coef}}{(x - ${p1})(x - ${p2})} = \\frac{A}{x - ${p1}} + \\frac{B}{x - ${p2}} \\\\
                    &\\text{Solving yields constants } A = ${k}, B = ${-k} \\text{ (depending on order).} \\\\
                    &= \\int \\left( \\frac{${k}}{x - ${Math.max(p1, p2)}} - \\frac{${k}}{x - ${Math.min(p1, p2)}} \\right) \\, dx \\\\
                    &= ${F.c(k, true)}\\ln|x - ${Math.max(p1, p2)}| ${F.c(-k, false)}\\ln|x - ${Math.min(p1, p2)}| + C \\\\
                    &= ${F.c(k, true)} \\ln\\left| \\frac{x - ${Math.max(p1, p2)}}{x - ${Math.min(p1, p2)}} \\right| + C
                \\end{aligned}`
            };
        },
        // 5. Trigonometric Integrals (Half-angle)
        (a, b, c, d) => {
            let k = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let coA = a !== 0 ? a : 4;
            let coef = coA * 2; 
            return {
                expr: `\\int ${F.c(coef, true)} \\sin^2(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(coA, true)}x ${F.frac(-coA, 2*k, false)} \\sin(${F.c(2*k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use the half-angle identity: } \\sin^2(\\theta) = \\frac{1 - \\cos(2\\theta)}{2} \\\\
                    &= \\int ${coef} \\left( \\frac{1 - \\cos(${2*k}x)}{2} \\right) \\, dx \\\\
                    &= \\int ${coA} (1 - \\cos(${2*k}x)) \\, dx \\\\
                    &= ${coA} \\left( x - \\frac{1}{${2*k}}\\sin(${2*k}x) \\right) + C \\\\
                    &= ${F.c(coA, true)}x ${F.frac(-coA, 2*k, false)} \\sin(${F.c(2*k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 6. Repeated Integration by Parts
        (a, b, c, d) => {
            let k = [2, 3][Math.abs(c) % 2];
            let coA = a !== 0 ? a : 1;
            let kSq = k * k;
            let kCub = k * k * k;
            let coef = coA * kCub;
            
            let term1 = coA * kSq;
            let term2 = -(2 * coA * k);
            let term3 = 2 * coA;
            
            return {
                expr: `\\int ${F.c(coef, true)}x^2 e^{${F.c(k, true)}x} \\, dx`,
                ans: `= ${F.c(term1, true)}x^2 e^{${F.c(k, true)}x} ${F.c(term2, false)}x e^{${F.c(k, true)}x} ${F.c(term3, false)} e^{${F.c(k, true)}x} + C`,
                sol: `\\begin{aligned}
                    &\\text{Apply Integration by Parts: } \\int u \\, dv = uv - \\int v \\, du \\\\
                    &\\text{First Parts: Let } u_1 = ${F.c(coef, true)}x^2 \\implies du_1 = ${F.c(2*coef, true)}x \\, dx \\\\
                    &\\text{Let } dv_1 = e^{${F.c(k, true)}x} \\, dx \\implies v_1 = ${F.div("1", k)}e^{${F.c(k, true)}x} \\\\
                    &\\int ${F.c(coef, true)}x^2 e^{${F.c(k, true)}x} \\, dx = \\left(${F.c(coef, true)}x^2\\right)\\left(${F.div("1", k)}e^{${F.c(k, true)}x}\\right) - \\int \\left(${F.div("1", k)}e^{${F.c(k, true)}x}\\right)\\left(${F.c(2*coef, true)}x\\right) \\, dx \\\\
                    &= ${F.c(term1, true)}x^2 e^{${F.c(k, true)}x} - \\int ${F.c(2 * coA * kSq, true)}x e^{${F.c(k, true)}x} \\, dx \\\\
                    \\\\
                    &\\text{Second Parts: Integrate } \\int ${F.c(2 * coA * kSq, true)}x e^{${F.c(k, true)}x} \\, dx. \\\\
                    &\\text{Let } u_2 = ${F.c(2 * coA * kSq, true)}x \\implies du_2 = ${2 * coA * kSq} \\, dx \\\\
                    &\\text{Let } dv_2 = e^{${F.c(k, true)}x} \\, dx \\implies v_2 = ${F.div("1", k)}e^{${F.c(k, true)}x} \\\\
                    &\\int ${F.c(2 * coA * kSq, true)}x e^{${F.c(k, true)}x} \\, dx = \\left(${F.c(2 * coA * kSq, true)}x\\right)\\left(${F.div("1", k)}e^{${F.c(k, true)}x}\\right) - \\int \\left(${F.div("1", k)}e^{${F.c(k, true)}x}\\right)\\left(${2 * coA * kSq}\\right) \\, dx \\\\
                    &= ${F.c(-term2, true)}x e^{${F.c(k, true)}x} - \\int ${F.c(2 * coA * k, true)}e^{${F.c(k, true)}x} \\, dx \\\\
                    &= ${F.c(-term2, true)}x e^{${F.c(k, true)}x} ${F.c(-term3, false)}e^{${F.c(k, true)}x} \\\\
                    \\\\
                    &\\text{Substitute back to get the final solution:} \\\\
                    &= ${F.c(term1, true)}x^2 e^{${F.c(k, true)}x} ${F.c(term2, false)}x e^{${F.c(k, true)}x} ${F.c(term3, false)}e^{${F.c(k, true)}x} + C
                \\end{aligned}`
            };
        },
        // 7. Trigonometric Integrals (Odd Powers)
        (a, b, c, d) => {
            let k = [1, 2][Math.abs(c) % 2];
            let coA = a !== 0 ? a : 1;
            let coef = coA * 15 * k;
            
            let term5 = 3 * coA;
            let term3 = -5 * coA;
            
            return {
                expr: `\\int ${F.c(coef, true)} \\sin^3(${F.c(k, true)}x) \\cos^2(${F.c(k, true)}x) \\, dx`,
                ans: `= ${F.c(term5, true)} \\cos^5(${F.c(k, true)}x) ${F.c(term3, false)} \\cos^3(${F.c(k, true)}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{Since the power of sine is odd, split off one sine factor:} \\\\
                    &= \\int ${F.c(coef, true)} \\sin^2(${F.c(k, true)}x) \\cos^2(${F.c(k, true)}x) \\sin(${F.c(k, true)}x) \\, dx \\\\
                    &\\text{Use the identity } \\sin^2(\\theta) = 1 - \\cos^2(\\theta): \\\\
                    &= \\int ${F.c(coef, true)} (1 - \\cos^2(${F.c(k, true)}x)) \\cos^2(${F.c(k, true)}x) \\sin(${F.c(k, true)}x) \\, dx \\\\
                    &\\text{Let } u = \\cos(${F.c(k, true)}x) \\implies du = -${k}\\sin(${F.c(k, true)}x) \\, dx \\implies \\sin(${F.c(k, true)}x) \\, dx = ${F.div("-du", k)} \\\\
                    &\\text{Substitute:} \\\\
                    &= \\int ${F.c(coef, true)} (1 - u^2) u^2 \\left( ${F.div("-du", k)} \\right) \\\\
                    &= ${F.c(15 * coA, true)} \\int (u^4 - u^2) \\, du \\\\
                    &= ${F.c(15 * coA, true)} \\left( \\frac{u^5}{5} - \\frac{u^3}{3} \\right) + C \\\\
                    &= ${F.c(term5, true)} u^5 ${F.c(term3, false)} u^3 + C \\\\
                    &= ${F.c(term5, true)} \\cos^5(${F.c(k, true)}x) ${F.c(term3, false)} \\cos^3(${F.c(k, true)}x) + C
                \\end{aligned}`
            };
        },
        // 8. Advanced Partial Fractions
        (a, b, c, d) => {
            let p = [2, 3][Math.abs(d) % 2];
            let A = Math.abs(a) > 0 ? Math.abs(a) : 1;
            let B = Math.abs(b) > 0 ? Math.abs(b) : 2;
            let C = Math.abs(c) > 0 ? Math.abs(c) : 3;
            
            let num2 = A + C;
            let num1 = B - A * p;
            let num0 = -B * p;
            
            let numTerms = [];
            if (num2 !== 0) numTerms.push(`${F.c(num2, true)}x^2`);
            if (num1 !== 0) {
                let leading = numTerms.length === 0;
                numTerms.push(`${F.c(num1, leading)}x`);
            }
            if (num0 !== 0) {
                let leading = numTerms.length === 0;
                numTerms.push(`${F.num(num0, leading)}`);
            }
            let numStr = numTerms.join(" ");
            
            let termA = `${F.c(A, true)}\\ln|x|`;
            let termB = `-\\frac{${B}}{x}`;
            let termC = `${F.c(C, false)}\\ln|x - ${p}|`;
            
            return {
                expr: `\\int \\frac{${numStr}}{x^2 (x - ${p})} \\, dx`,
                ans: `= ${termA} ${termB} ${termC} + C`,
                sol: `\\begin{aligned}
                    &\\text{Use Partial Fraction Decomposition:} \\\\
                    &\\frac{${numStr}}{x^2(x - ${p})} = \\frac{A}{x} + \\frac{B}{x^2} + \\frac{C}{x - ${p}} \\\\
                    &\\text{Multiply both sides by } x^2(x - ${p}): \\\\
                    &${numStr} = Ax(x - ${p}) + B(x - ${p}) + Cx^2 \\\\
                    \\\\
                    &\\text{Solve for constants:} \\\\
                    &\\text{Let } x = 0 \\implies ${num0} = -${p}B \\implies B = ${B} \\\\
                    &\\text{Let } x = ${p} \\implies ${num2 * p * p + num1 * p + num0} = ${p * p}C \\implies C = ${C} \\\\
                    &\\text{Equate } x^2 \\text{ coefficients:} \\\\
                    &${num2} = A + C \\implies A = ${A} \\\\
                    \\\\
                    &\\text{Integrate the decomposed terms:} \\\\
                    &= \\int \\left( \\frac{${A}}{x} + \\frac{${B}}{x^2} + \\frac{${C}}{x - ${p}} \\right) \\, dx \\\\
                    &= ${termA} ${termB} ${termC} + C
                \\end{aligned}`
            };
        },
        // 9. Inverse Secant Form
        (a, b, c, d) => {
            let valB = Math.abs(c) !== 0 ? Math.abs(c) : 3;
            let bSq = valB * valB;
            let coA = a !== 0 ? a : 2;
            let coef = coA * valB;
            
            let termExpr = `\\frac{${coef}}{x\\sqrt{x^2 - ${bSq}}}`;
            if (coef < 0) termExpr = `-\\frac{${Math.abs(coef)}}{x\\sqrt{x^2 - ${bSq}}}`;
            
            return {
                expr: `\\int ${termExpr} \\, dx`,
                ans: `= ${F.c(coA, true)} \\text{arcsec}\\left(${F.div("x", valB)}\\right) + C`,
                sol: `\\begin{aligned}
                    &\\text{Use the inverse secant integration formula: } \\int \\frac{1}{x\\sqrt{x^2 - a^2}} \\, dx = \\frac{1}{a}\\text{arcsec}\\left(\\frac{x}{a}\\right) \\\\
                    &\\text{Here, } a^2 = ${bSq} \\implies a = ${valB}. \\text{ Factor out the numerator } ${coef}: \\\\
                    &= ${F.c(coef, true)} \\int \\frac{1}{x\\sqrt{x^2 - ${bSq}}} \\, dx \\\\
                    &= ${F.mul(coef, `\\left( ${F.div("1", valB)}\\text{arcsec}\\left(${F.div("x", valB)}\\right) \\right)`)} + C \\\\
                    &= ${F.c(coA, true)} \\text{arcsec}\\left(${F.div("x", valB)}\\right) + C
                \\end{aligned}`
            };
        }
    ]
};
window.integral = integral;