
const arithmetic = {
        easy: [
                (a, b) => { // Fraction of a whole number
                const denoms = [2, 3, 4, 5, 6, 8, 10];
                let den = denoms[Math.abs(a) % denoms.length];
                let num = (Math.abs(b) % (den - 1)) + 1;
                let multiplier = (Math.abs(a + b) % 10) + 2; 
                let whole = den * multiplier;
                let ans = num * multiplier;
                
                return {
                    expr: `\\frac{${num}}{${den}} \\text{ of } ${whole}`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &= \\left(\\frac{${whole}}{${den}}\\right) \\times ${num} \\\\[1.2em] &= ${multiplier} \\times ${num} = ${ans} \\end{aligned}`
                };
            },
            (a, b) => { // Subtracting to a negative result
                let num1 = (Math.abs(a) % 10) + 1;  // 1 to 10
                let num2 = num1 + (Math.abs(b) % 15) + 3; // Ensure num2 is always greater than num1
                let ans = num1 - num2;
                
                return {
                    expr: `${num1} - ${num2}`,
                    ans: `= ${ans}`,
                    sol: `\\text{Subtract a larger number from a smaller number: } ${num1} - ${num2} = ${ans}`
                };
            },
            (a, b) => { // Simple Addition/Subtraction
                let num1 = (Math.abs(a) % 20) + 1;
                let num2 = (Math.abs(b) % 20) + 1;
                let sign = (a + b) % 2 === 0 ? '+' : '-';
                return {
                    expr: `${num1} ${sign} ${num2}`,
                    ans: `= ${sign === '+' ? num1 + num2 : num1 - num2}`,
                    sol: `\\text{Combine terms: } ${num1} ${sign} ${num2} = ${sign === '+' ? num1 + num2 : num1 - num2}`
                };
            },
            (a, b) => { // Simple Division
                let divisor = (Math.abs(b) % 12) + 1;
                let quotient = (Math.abs(a) % 12) + 1;
                let dividend = divisor * quotient;
                return {
                    expr: `${dividend} \\div ${divisor}`,
                    ans: `= ${quotient}`,
                    sol: `\\text{Divide: } ${dividend} \\div ${divisor} = ${quotient}`
                };
            },
            (a, b, c) => { // PEMDAS (No Parentheses)
                let numA = (Math.abs(a) % 10) + 1;
                let numB = (Math.abs(b) % 10) + 1;
                let numC = (Math.abs(c) % 10) + 1;
                let term = numB * numC;
                let sign = a % 2 === 0 ? '+' : '-';
                return {
                    expr: `${numA} ${sign} ${numB} \\times ${numC}`,
                    ans: `= ${sign === '+' ? numA + term : numA - term}`,
                    sol: `\\begin{aligned} &\\text{Multiply first: } ${numB} \\times ${numC} = ${term} \\\\ &= ${numA} ${sign} ${term} = ${sign === '+' ? numA + term : numA - term} \\end{aligned}`
                };
            },
            (a) => { // Squaring/Cubing
                let pwr = Math.abs(a) % 2 === 0 ? 2 : 3;
                let base = pwr === 2 ? (Math.abs(a) % 12) + 1 : (Math.abs(a) % 5) + 1; 
                let ans = Math.pow(base, pwr);
                return {
                    expr: `${base}^${pwr}`,
                    ans: `= ${ans}`,
                    sol: pwr === 2 ? `\\text{Square: } ${base} \\times ${base} = ${ans}` : `\\text{Cube: } ${base} \\times ${base} \\times ${base} = ${ans}`
                };
            },
            (a, b) => { // Basic Decimals
                const decimals = [0.25, 0.5, 0.75, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 0.9];
                let d1 = (Math.abs(a) % 5) + decimals[Math.abs(a) % decimals.length];
                let d2 = (Math.abs(b) % 5) + decimals[Math.abs(b) % decimals.length];
                let ans = (d1 + d2).toFixed(2).replace(/\.?0+$/, ''); // nice output
                return {
                    expr: `${d1} + ${d2}`,
                    ans: `= ${ans}`,
                    sol: `\\text{Align decimal points and add: } ${d1} + ${d2} = ${ans}`
                };
            },
            (a, b) => { // Basic Subtraction of Negatives
                let numA = (Math.abs(a) % 15) - 5; // -5 to 9
                let numB = (Math.abs(b) % 10) + 1; // 1 to 10
                return {
                    expr: `${numA} - (-${numB})`,
                    ans: `= ${numA + numB}`,
                    sol: `\\begin{aligned} &\\text{Subtracting a negative is adding: } \\\\ &= ${numA} + ${numB} = ${numA + numB} \\end{aligned}`
                };
            }
        ],
        med: [
            (a, b) => { // Evaluating and adding perfect square roots
                let r1 = (Math.abs(a) % 9) + 2; // Roots between 2 and 10
                let r2 = (Math.abs(b) % 9) + 2; 
                let sq1 = r1 * r1;
                let sq2 = r2 * r2;
                let ans = r1 + r2;
                
                return {
                    expr: `\\sqrt{${sq1}} + \\sqrt{${sq2}}`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &\\text{Evaluate each perfect square root first:} \\\\[1.2em] &= ${r1} + ${r2} = ${ans} \\end{aligned}`
                };
            },
            (a, b, c) => { // Multiplying variables with exponents
                let base = (Math.abs(c) % 4) + 2; 
                let pwr1 = (Math.abs(a) % 5) + 2; // Exponent 2 to 6
                let pwr2 = (Math.abs(b) % 5) + 2;
                let finalPwr = pwr1 + pwr2;
                let finalAns = Math.pow(base, finalPwr);
                
                return {
                    expr: `${base}^{${pwr1}} \\times ${base}^{${pwr2}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Multiply matching bases by adding the exponents:} \\\\[1.2em] &= ${base}^{${pwr1} + ${pwr2}} \\\\[1.2em] &= ${base}^{${finalPwr}} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b) => { // Multiplication
                let num1 = (Math.abs(a) % 12) + 1;
                let num2 = (Math.abs(b) % 12) + 1;
                let isNeg = (a + b) % 2 === 0;
                if (isNeg) num2 = -num2;
                return {
                    expr: `${num1} \\times ${num2 < 0 ? `(${num2})` : num2}`,
                    ans: `= ${num1 * num2}`,
                    sol: `\\text{Multiply: } ${num1} \\times ${num2 < 0 ? `(${num2})` : num2} = ${num1 * num2}`
                };
            },
            (a, b, c) => { // Fractions (Same Denominator)
                const denoms = [3, 4, 5, 6, 8, 10, 12];
                let den = denoms[Math.abs(c) % denoms.length];
                let num1 = (Math.abs(a) % den) + 1;
                let num2 = (Math.abs(b) % den) + 1;
                let sum = num1 + num2;
                let exactAns = Utils.formatFraction(sum, den);
                return {
                    expr: `\\frac{${num1}}{${den}} + \\frac{${num2}}{${den}}`,
                    ans: `= ${exactAns}`,
                    sol: `\\begin{aligned} &\\text{Add numerators over common denominator: } \\\\ &= \\frac{${num1} + ${num2}}{${den}} = \\frac{${sum}}{${den}} ${exactAns !== `\\frac{${sum}}{${den}}` ? `= ${exactAns}` : ""} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // PEMDAS (With Parentheses)
                let numA = (Math.abs(a) % 10) + 1;
                let numB = (Math.abs(b) % 10) + 1;
                let numC = (Math.abs(c) % 10) + 1;
                let numD = (Math.abs(d) % 10) + 1;
                let sum = numA + numB;
                let diff = numC - numD;
                let ans = sum * diff;
                return {
                    expr: `(${numA} + ${numB}) \\times (${numC} - ${numD})`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &\\text{Evaluate parentheses first:} \\\\ &= (${sum}) \\times (${diff}) = ${ans} \\end{aligned}`
                };
            },
            (a, b, c) => { // Mixed Numbers to Improper Fractions
                const denoms = [2, 3, 4, 5, 8];
                let den = denoms[Math.abs(c) % denoms.length];
                let whole = (Math.abs(a) % 5) + 1;
                let num = (Math.abs(b) % (den - 1)) + 1; // 1 to den-1
                let impNum = whole * den + num;
                return {
                    expr: `${whole}\\frac{${num}}{${den}}`,
                    ans: `= \\frac{${impNum}}{${den}}`,
                    sol: `\\begin{aligned} &\\text{Multiply whole by denominator and add numerator:} \\\\ &= \\frac{${whole} \\times ${den} + ${num}}{${den}} = \\frac{${impNum}}{${den}} \\end{aligned}`
                };
            },
            (a) => { // Exponents (Negative vs Positive Base)
                let base = (Math.abs(a) % 5) + 1;
                let sq = base * base;
                return {
                    expr: `(-${base})^2 - ${base}^2`,
                    ans: `= 0`,
                    sol: `\\begin{aligned} &\\text{Note: } (-${base})^2 = ${sq} \\text{ while } ${base}^2 = ${sq} \\\\ &= ${sq} - ${sq} = 0 \\end{aligned}`
                };
            },
            (a, b) => { // Evaluating Simple Expressions
                let numA = (Math.abs(a) % 5) + 1;
                let numB = (Math.abs(b) % 5) + 1;
                let sqA = numA * numA;
                let sqB = numB * numB;
                let mid = 2 * numA * numB;
                let ans = sqA - mid + sqB;
                return {
                    expr: `(${numA})^2 - 2(${numA})(${numB}) + (${numB})^2`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &= ${sqA} - (${mid}) + ${sqB} \\\\ &= ${sqA - mid} + ${sqB} = ${ans} \\end{aligned}`
                };
            }
        ],
        hard: [
            (a, b) => { // Fractional Exponents
                const perfectPowers = [
                    { base: 2, pwr: 3, val: 8 }, { base: 2, pwr: 4, val: 16 }, { base: 2, pwr: 5, val: 32 },
                    { base: 3, pwr: 2, val: 9 }, { base: 3, pwr: 3, val: 27 },
                    { base: 4, pwr: 2, val: 16 }, { base: 5, pwr: 2, val: 25 }, { base: 10, pwr: 2, val: 100 }
                ];
                let pick = perfectPowers[Math.abs(a) % perfectPowers.length];
                let num = (Math.abs(b) % 3) + 1; // Numerator 1, 2, or 3
                if (num === pick.pwr) num = 1; // Prevent trivial fractions like 2/2
                
                let ans = Math.pow(pick.base, num);
                
                return {
                    expr: `${pick.val}^{\\frac{${num}}{${pick.pwr}}}`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &\\text{Rewrite the rational exponent as a radical: } (\\sqrt[${pick.pwr}]{${pick.val}})^{${num}} \\\\[1.2em] &= (${pick.base})^{${num}} = ${ans} \\end{aligned}`
                };
            },
            (a, b, c) => { // Scientific Notation Addition (Differing Exponents)
                let cleanA = (Math.abs(a) % 5) + 2; // 2 to 6
                let cleanB = (Math.abs(b) % 5) + 2; 
                let basePwr = (Math.abs(c) % 4) + 2; // 2 to 5
                let largePwr = basePwr + 1; // Ensure one power is exactly 1 degree higher
                
                // Mathematical final logic
                let finalCoeff = (cleanA * 10) + cleanB;
                let finalDec = finalCoeff / 10;
                
                return {
                    expr: `(${cleanA} \\times 10^{${largePwr}}) + (${cleanB} \\times 10^{${basePwr}})`,
                    ans: `= ${finalDec} \\times 10^{${largePwr}}`,
                    sol: `\\begin{aligned} &\\text{Match the powers of 10 by rewriting the first term:} \\\\[1.2em] &= (${cleanA * 10} \\times 10^{${basePwr}}) + (${cleanB} \\times 10^{${basePwr}}) \\\\[1.2em] &= (${cleanA * 10} + ${cleanB}) \\times 10^{${basePwr}} \\\\[1.2em] &= ${finalCoeff} \\times 10^{${basePwr}} = ${finalDec} \\times 10^{${largePwr}} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Fractions (Different Denominators)
                const pairs = [[2,3], [3,4], [2,5], [4,5], [3,5], [4,6], [6,8], [5,10]];
                let [den1, den2] = pairs[Math.abs(a) % pairs.length];
                let num1 = (Math.abs(b) % (den1 - 1)) + 1;
                let num2 = (Math.abs(c) % (den2 - 1)) + 1;
                
                let den = den1 * den2; 
                let topNum = num1 * den2 + num2 * den1;
                
                const finalAns = Utils.formatFraction(topNum, den);
                const standardFraction = `\\frac{${topNum}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${num1}}{${den1}} + \\frac{${num2}}{${den2}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Common denom: } ${den1} \\times ${den2} = ${den} \\\\ &= \\frac{${num1 * den2}}{${den}} + \\frac{${num2 * den1}}{${den}} = \\frac{${topNum}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Order of ops with squares
                let cleanC = (Math.abs(c) % 5) + 2; // 2 to 6
                let valD = (Math.abs(d) % 4) + 2; // 2 to 5
                let cleanA = (Math.abs(a) % 15) + 5; // 5 to 19
                let sq = valD * valD;
                let term = cleanC * sq;
                let finalAns = term - cleanA;
                
                return {
                    expr: `${cleanC} \\times (${valD})^2 - ${cleanA}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanC} \\times ${sq} - ${cleanA} \\\\ &= ${term} - ${cleanA} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Fraction evaluation
                let numA = (Math.abs(a) % 10) + 1;
                let numB = (Math.abs(b) % 5) + 2;
                let numC = (Math.abs(c) % 5) + 2;
                let numD = (Math.abs(d) % 4) + 2;
                let topProd = numB * numC;
                let topRes = numA + topProd;
                let exactAns = Utils.formatFraction(topRes, numD);
                
                return {
                    expr: `\\frac{${numA} + ${numB} \\times ${numC}}{${numD}}`,
                    ans: `= ${exactAns}`,
                    sol: `\\begin{aligned} &= \\frac{${numA} + ${topProd}}{${numD}} = \\frac{${topRes}}{${numD}} ${exactAns !== `\\frac{${topRes}}{${numD}}` ? `= ${exactAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Order of ops with division
                let numC = (Math.abs(c) % 4) + 2; // 2 to 5
                let sum = numC * ((Math.abs(a) % 5) + 1); // divisible by numC
                let numA = Math.floor(sum / 2) + 1;
                let numB = sum - numA;
                let numD = (Math.abs(d) % 5) + 2; // 2 to 6
                
                let divRes = sum / numC;
                let finalAns = divRes * numD;
                return {
                    expr: `(${numA} + ${numB}) \\div ${numC} \\times ${numD}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= (${sum}) \\div ${numC} \\times ${numD} \\\\ &= ${divRes} \\times ${numD} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Radical Distance
                const triples = [[3,4], [5,12], [6,8], [8,15]];
                let [leg1, leg2] = triples[Math.abs(b) % triples.length];
                let inner = leg1 * leg1 + leg2 * leg2; 
                let rt = Math.sqrt(inner);
                let coeff = (Math.abs(a) % 4) + 2;
                let ans = rt * coeff;
                
                return {
                    expr: `\\sqrt{${leg1}^2 + ${leg2}^2} \\times ${coeff}`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &= \\sqrt{${leg1 * leg1} + ${leg2 * leg2}} \\times ${coeff} \\\\ &= \\sqrt{${inner}} \\times ${coeff} \\\\ &= ${rt} \\times ${coeff} = ${ans} \\end{aligned}`
                };
            },
            //# New problem type: Fraction division with cancellation
            (a, b, c, d) => { // Percentages
                const pcts = [10, 20, 25, 50, 75];
                let pct = pcts[Math.abs(a) % pcts.length];
                let cleanB = (Math.abs(b) % 10 + 1) * (pct === 25 || pct === 75 ? 40 : 10); 
                let numC = (Math.abs(c) % 15) + 5;
                let result = Math.round((pct / 100) * cleanB) + numC;
                let pctDecimal = (pct / 100).toFixed(2);
                
                return {
                    expr: `${pct}\\% \\text{ of } ${cleanB} + ${numC}`,
                    ans: `= ${result}`,
                    sol: `\\begin{aligned} &= ${pctDecimal} \\times ${cleanB} + ${numC} = ${result} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Absolute values
                let numA = (Math.abs(a) % 15) - 5;
                let numB = (Math.abs(b) % 10) + 1;
                let numC = (Math.abs(c) % 5) + 2;
                let diff = numA - numB;
                let absDiff = Math.abs(diff);
                let finalAns = absDiff * numC;
                return {
                    expr: `\\left| ${numA} - ${numB} \\right| \\times ${numC}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= |${diff}| \\times ${numC} = ${absDiff} \\times ${numC} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Fraction Division
                const denoms = [2, 3, 4, 5];
                let cleanA = (Math.abs(a) % 5) + 1;
                let cleanB = denoms[Math.abs(b) % denoms.length];
                let cleanC = (Math.abs(c) % 5) + 1;
                let cleanD = denoms[Math.abs(d) % denoms.length];
                
                let num = cleanA * cleanD;
                let den = cleanB * cleanC;
                
                const finalAns = Utils.formatFraction(num, den);
                const standardFraction = `\\frac{${num}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${cleanA}}{${cleanB}} \\div \\frac{${cleanC}}{${cleanD}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Multiply by reciprocal: } \\frac{${cleanA}}{${cleanB}} \\times \\frac{${cleanD}}{${cleanC}} = \\frac{${num}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Mixed PEMDAS
                let cleanD = (Math.abs(d) % 4) + 2;
                let quot = (Math.abs(c) % 5) + 1; 
                let cleanC = cleanD * quot;
                let numA = (Math.abs(a) % 5) + 2; 
                let numB = (Math.abs(b) % 5) + 2;
                let prod = numA * numB;
                let finalAns = prod + quot;
                return {
                    expr: `(${numA} \\times ${numB}) + (${cleanC} \\div ${cleanD})`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= (${prod}) + (${quot}) = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Higher Radical Simplification
                let index = (Math.abs(d) % 2) + 2; // 2 (square root) or 3 (cube root)
                let base = (Math.abs(b) % 3) + 2; 
                let pwr = (Math.abs(c) % 2) + 2; 
                let inner = Math.pow(base, pwr);
                let numA = (Math.abs(a) % 4) + 2;
                
                let k = 1;
                let m = inner;
                let loopLimit = index === 2 ? Math.floor(Math.sqrt(inner)) : Math.floor(Math.cbrt(inner));

                for (let i = loopLimit; i >= 2; i--) {
                    let power = Math.pow(i, index);
                    if (inner % power === 0) {
                        k = i;
                        m = inner / power;
                        break;
                    }
                }
                
                let coeff = numA * k;
                let ansStr = "";
                let solStr = "";
                let radPrefix = index === 2 ? '\\sqrt' : `\\sqrt[${index}]`;
                let radStr = `${radPrefix}{${m}}`;
                
                if (m === 1) {
                    ansStr = `= ${coeff}`;
                    solStr = `\\begin{aligned} &= ${radPrefix}{${inner}} \\times ${numA} \\\\ &= ${k} \\times ${numA} = ${coeff} \\end{aligned}`;
                } else {
                    let coeffStr = coeff === 1 ? "" : coeff === -1 ? "-" : `${coeff}`;
                    ansStr = `= ${coeffStr}${radStr}`;
                    let intermediateStep = k > 1 ? `${k}${radPrefix}{${m}} \\times ${numA}` : `${radPrefix}{${inner}} \\times ${numA}`;
                    solStr = `\\begin{aligned} &= ${radPrefix}{${inner}} \\times ${numA} ${k > 1 ? `\\\\ &= ${intermediateStep}` : ""} \\\\ &= ${coeffStr}${radStr} \\end{aligned}`;
                }
                
                return {
                    expr: `${radPrefix}{${base}^{${pwr}}} \\times ${numA}`,
                    ans: ansStr,
                    sol: solStr
                };
            },
            (a, b, c, d) => { // Adding 3 numbers and dividing
                let cleanD = (Math.abs(d) % 4) + 2;
                let numA = (Math.abs(a) % 10) + 1;
                let numB = (Math.abs(b) % 10) + 1;
                let numC = (Math.abs(c) % 10) + 1;
                let sum = numA + numB + numC;
                
                const finalAns = Utils.formatFraction(sum, cleanD);
                const standardFraction = `\\frac{${sum}}{${cleanD}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${numA} + ${numB} + ${numC}}{${cleanD}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= \\frac{${sum}}{${cleanD}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Recurring Decimal
                let digit = (Math.abs(a) % 8) + 1; 
                let numB = (Math.abs(b) % 5) * 9 + 3; // nice multiples like 3, 12, 21, 30
                let top = digit * numB;
                let exactAns = Utils.formatFraction(top, 9);
                
                let solLines = [`&= \\frac{${digit}}{9} \\times ${numB}`];
                if (numB !== 1) {
                    let directFrac = `\\frac{${top}}{9}`;
                    solLines.push(`&= ${directFrac}`);
                }
                
                let lastLine = `&= ${exactAns}`;
                if (solLines[solLines.length - 1] !== lastLine) {
                    solLines.push(lastLine);
                }

                return {
                    expr: `0.\\overline{${digit}} \\times ${numB}`,
                    ans: `= ${exactAns}`,
                    sol: `\\begin{aligned} ${solLines.join(" \\\\ ")} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // 3 Unit Fractions
                const groups = [[2,3,4], [2,4,8], [3,4,6]];
                let [cleanA, cleanB, cleanC] = groups[Math.abs(a) % groups.length];
                
                // Get LCD
                const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
                const lcm = (m, n) => (m * n) / gcd(m, n);
                let den = lcm(cleanA, lcm(cleanB, cleanC));
                
                let num1 = den / cleanA;
                let num2 = den / cleanB;
                let num3 = den / cleanC;
                let num = num1 + num2 + num3;
                
                const finalAns = Utils.formatFraction(num, den);
                const standardFraction = `\\frac{${num}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{1}{${cleanA}} + \\frac{1}{${cleanB}} + \\frac{1}{${cleanC}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Find LCD } (${den}) \\implies \\frac{${num1}}{${den}} + \\frac{${num2}}{${den}} + \\frac{${num3}}{${den}} = \\frac{${num}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Exponent division
                let cleanA = (Math.abs(a) % 3) + 2; // 2, 3, 4
                let cleanB = (Math.abs(b) % 2) + 2; // 2, 3
                let cleanC = (Math.abs(c) % 2) + 2; // 2, 3
                let cleanD = Math.pow(cleanA, 2); 
                
                let pwr = cleanB * cleanC;
                let finalPwr = pwr - 2;
                let finalAns = Math.pow(cleanA, finalPwr);
                
                return {
                    expr: `(${cleanA}^{${cleanB}})^{${cleanC}} \\div ${cleanD}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanA}^{${pwr}} \\div ${cleanA}^2 \\\\ &= ${cleanA}^{${finalPwr}} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Log base 10
                const powers = [10, 100, 1000, 10000];
                let cleanB = powers[Math.abs(b) % powers.length];
                let logVal = Math.log10(cleanB);
                let numA = (Math.abs(a) % 10) + 1;
                let finalAns = numA * logVal;
                return {
                    expr: `\\log_{10}(${cleanB}) \\times ${numA}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${logVal} \\times ${numA} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Complex fraction
                let cleanA = (Math.abs(a) % 5) + 1;
                let cleanB = (Math.abs(b) % 4) + 2;
                let cleanC = (Math.abs(c) % 5) + 1;
                let cleanD = (Math.abs(d) % 4) + 2;
                
                let num = cleanA * cleanD;
                let den = cleanB * cleanC;
                
                const finalAns = Utils.formatFraction(num, den);
                const standardFraction = `\\frac{${num}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{\\frac{${cleanA}}{${cleanB}}}{\\frac{${cleanC}}{${cleanD}}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= \\frac{${cleanA}}{${cleanB}} \\times \\frac{${cleanD}}{${cleanC}} = \\frac{${num}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Scientific Notation Multiplication
                let cleanA = (Math.abs(a) % 5) + 1;
                let cleanB = (Math.abs(b) % 5) + 1;
                let pwrC = Math.abs(c) % 5;
                let pwrD = Math.abs(d) % 5;
                
                let coeff = cleanA * cleanB;
                let newPwr = pwrC + pwrD;
                
                return {
                    expr: `(${cleanA} \\times 10^{${pwrC}}) \\times (${cleanB} \\times 10^{${pwrD}})`,
                    ans: `= ${coeff} \\times 10^{${newPwr}}`,
                    sol: `\\begin{aligned} &= (${cleanA} \\times ${cleanB}) \\times 10^{${pwrC}+${pwrD}} = ${coeff} \\times 10^{${newPwr}} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Factorials
                let factA = (Math.abs(a) % 4) + 4; // 4, 5, 6, 7
                let ansVal = factA * (factA - 1);
                return {
                    expr: `\\frac{${factA}!}{(${factA}-2)!}`,
                    ans: `= ${ansVal}`,
                    sol: `\\begin{aligned} &= \\frac{${factA} \\times ${factA - 1} \\times (${factA}-2)!}{(${factA}-2)!} = ${ansVal} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Log properties
                let cleanB = (Math.abs(b) % 4) + 2; // base 2, 3, 4, 5
                let cleanC = (Math.abs(c) % 4) + 2;  
                let numD = (Math.abs(d) % 5) + 1;
                let finalAns = cleanC + numD;
                return {
                    expr: `\\log_{${cleanB}}(${cleanB}^{${cleanC}}) + \\ln(e^{${numD}})`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanC}\\log_{${cleanB}}(${cleanB}) + ${numD}\\ln(e) \\\\ &= ${cleanC}(1) + ${numD}(1) = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Exponent Rules (Multiplication/Division)
                let base = (Math.abs(a) % 4) + 2; // base 2, 3, 4, 5
                let expA = (Math.abs(b) % 3) + 3; // 3, 4, 5
                let expB = (Math.abs(c) % 3) + 3; // 3, 4, 5
                let expC = (Math.abs(d) % 3) + 2; // 2, 3, 4
                let topExp = expA + expB;
                let finalExp = topExp - expC;
                let finalAns = Math.pow(base, finalExp);
                return {
                    expr: `\\frac{${base}^{${expA}} \\times ${base}^{${expB}}}{${base}^{${expC}}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Multiply (add exponents): } ${base}^{${expA} + ${expB}} = ${base}^{${topExp}} \\\\ &\\text{Divide (subtract exponents): } \\frac{${base}^{${topExp}}}{${base}^{${expC}}} = ${base}^{${topExp} - ${expC}} = ${base}^{${finalExp}} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b) => { // Rationalizing the Denominator
                let num = (Math.abs(a) % 5) + 2;
                const inners = [2, 3, 5, 6, 7, 8, 10, 12];
                let inner = inners[Math.abs(b) % inners.length]; 
                
                const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
                let g = gcd(Math.abs(num), inner);
                let cleanNum = num / g;
                let cleanDen = inner / g;
                
                let numStr = cleanNum === 1 ? `\\sqrt{${inner}}` : cleanNum === -1 ? `-\\sqrt{${inner}}` : `${cleanNum}\\sqrt{${inner}}`;
                let finalAns = cleanDen === 1 ? numStr : `\\frac{${numStr}}{${cleanDen}}`;
                
                return {
                    expr: `\\frac{${num}}{\\sqrt{${inner}}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Rationalize by multiplying by } \\frac{\\sqrt{${inner}}}{\\sqrt{${inner}}}: \\\\ &= \\frac{${num}\\sqrt{${inner}}}{${inner}} ${cleanDen !== inner ? `= ${finalAns}` : ""} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Scientific Notation Division
                let cleanB = (Math.abs(b) % 4) + 2; // 2, 3, 4, 5
                let coeff = (Math.abs(a) % 5) + 2; // 2, 3, 4, 5, 6
                let num = coeff * cleanB; 
                
                let pwrC = Math.abs(c) % 5 + 3; // 3 to 7
                let pwrD = Math.abs(d) % 3 + 1; // 1 to 3
                let newPwr = pwrC - pwrD;
                
                return {
                    expr: `\\frac{${num} \\times 10^{${pwrC}}}{${cleanB} \\times 10^{${pwrD}}}`,
                    ans: `= ${coeff} \\times 10^{${newPwr}}`,
                    sol: `\\begin{aligned} &= \\left(\\frac{${num}}{${cleanB}}\\right) \\times 10^{${pwrC} - ${pwrD}} \\\\ &= ${coeff} \\times 10^{${newPwr}} \\end{aligned}`
                };
            },
            (a, b, c) => { // Nested Absolute Values
                let numC = (Math.abs(c) % 5) + 2; // 2 to 6
                let numB = (Math.abs(b) % 10) + 1; // 1 to 10
                let numA = (Math.abs(a) % 15) + 5; // 5 to 19
                
                let v1 = numB - numC;
                let absV1 = Math.abs(v1);
                let v2 = numA - absV1;
                let finalAns = Math.abs(v2);
                
                return {
                    expr: `\\left| ${numA} - \\left| ${numB} - ${numC} \\right| \\right|`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Evaluate inner absolute value first:} \\\\ &= \\left| ${numA} - \\left| ${v1} \\right| \\right| \\\\ &= \\left| ${numA} - ${absV1} \\right| = \\left| ${v2} \\right| = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => { // Complex PEMDAS
                let base = (Math.abs(c) % 3) + 2;
                let sq = base * base; // 4, 9, 16
                
                let cleanE = (Math.abs(a) % 4) + 2; // 2 to 5
                let coeff = (Math.abs(b) % 3) + 1;
                let prod = coeff * sq; // ensure it's a multiple of cleanE
                // actually let's force the product to be divisible by cleanE
                let actualCoeff = cleanE * coeff;
                let newProd = actualCoeff * sq;
                
                let numA = (Math.abs(d) % 10) + 1;
                let div = newProd / cleanE;
                let finalAns = numA + div;
                
                let numC = (Math.abs(c) % 5) + 5; // 5 to 9
                let numD = numC - base;
                
                return {
                    expr: `${numA} + ${actualCoeff} \\times (${numC} - ${numD})^2 \\div ${cleanE}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Evaluate parentheses and exponent:} \\\\ &= ${numA} + ${actualCoeff} \\times (${base})^2 \\div ${cleanE} \\\\ &= ${numA} + ${actualCoeff} \\times ${sq} \\div ${cleanE} \\\\ &\\text{Multiply and divide left to right:} \\\\ &= ${numA} + ${newProd} \\div ${cleanE} \\\\ &= ${numA} + ${div} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b) => { // Roots of Products
                let pwr1 = ((Math.abs(a) % 3) + 1) * 2; // 2, 4, 6
                let pwr2 = ((Math.abs(b) % 3) + 1) * 2; // 2, 4, 6
                let base1 = (Math.abs(a) % 3) + 2; // 2, 3, 4
                let base2 = (Math.abs(b) % 3) + 3; // 3, 4, 5
                
                let half1 = pwr1 / 2;
                let half2 = pwr2 / 2;
                let ans = Math.pow(base1, half1) * Math.pow(base2, half2);
                
                return {
                    expr: `\\sqrt{${base1}^{${pwr1}} \\times ${base2}^{${pwr2}}}`,
                    ans: `= ${ans}`,
                    sol: `\\begin{aligned} &\\text{Use property } \\sqrt{x \\times y} = \\sqrt{x} \\times \\sqrt{y}: \\\\ &= \\sqrt{${base1}^{${pwr1}}} \\times \\sqrt{${base2}^{${pwr2}}} \\\\ &= ${base1}^{${half1}} \\times ${base2}^{${half2}} = ${Math.pow(base1, half1)} \\times ${Math.pow(base2, half2)} = ${ans} \\end{aligned}`
                };
            },
            (a) => { // Base Conversion (Binary to Decimal)
                // Use numbers 16 to 31 (5 bits)
                let num = (Math.abs(a) % 16) + 16; 
                let binStr = num.toString(2);
                let powers = [];
                for(let i = 0; i < binStr.length; i++) {
                    let bit = parseInt(binStr[i]);
                    let pwr = binStr.length - 1 - i;
                    let val = Math.pow(2, pwr);
                    powers.push(`${bit}(${val})`);
                }
                
                return {
                    expr: `${binStr}_2`,
                    ans: `= ${num}_{10}`,
                    sol: `\\begin{aligned} &\\text{Expand by powers of 2:} \\\\ &= ${powers.join(' + ')} \\\\ &= ${num} \\end{aligned}`
                };
            }
        ]
    };
    window.arithmetic = arithmetic;