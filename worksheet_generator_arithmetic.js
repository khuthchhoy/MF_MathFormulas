
const arithmetic = {
        easy: [
            (a, b) => {
                let cleanB = b === 0 ? 5 : b;
                return {
                    expr: `${a} ${cleanB > 0 ? '+' : '-'} ${Math.abs(cleanB)}`,
                    ans: `= ${a + cleanB}`,
                    sol: `\\text{Combine terms: } ${a} ${cleanB > 0 ? '+' : '-'} ${Math.abs(cleanB)} = ${a + cleanB}`
                };
            }
        ],
        med: [
            (a, b) => ({
                expr: `${a} \\times ${b}`,
                ans: `= ${a * b}`,
                sol: `\\text{Multiply: } ${a} \\times ${b} = ${a * b}`
            })
        ],
        hard: [
            (a, b, c, d) => {
                let cleanB = Math.abs(b) === 0 ? 2 : Math.abs(b);
                let cleanD = Math.abs(d) === 0 ? 3 : Math.abs(d);
                let cleanA = Math.abs(a);
                
                let num = cleanA * cleanD + c * cleanB;
                let den = cleanB * cleanD;
                
                const finalAns = Utils.formatFraction(num, den);
                const standardFraction = `\\frac{${num}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${cleanA}}{${cleanB}} + \\frac{${c}}{${cleanD}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Common denom: } ${cleanB} \\times ${cleanD} = ${den} \\\\ &= \\frac{${cleanA * cleanD}}{${den}} + \\frac{${c * cleanB}}{${den}} = \\frac{${num}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanC = c === 0 ? 2 : c;
                let valD = Math.abs(d) + 1;
                let cleanA = Math.abs(a);
                let term = cleanC * Math.pow(valD, 2);
                let finalAns = term - cleanA;
                
                return {
                    expr: `${cleanC} \\times (${valD})^2 - ${cleanA}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanC} \\times ${valD * valD} - ${cleanA} \\\\ &= ${term} - ${cleanA} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanB = b === 0 ? 3 : b;
                let num = (a * cleanB) + (c * d);
                
                const finalAns = Utils.formatFraction(num, cleanB);
                const standardFraction = `\\frac{${num}}{${cleanB}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${a * cleanB} + ${c * d}}{${cleanB}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= \\frac{${a * cleanB} + ${c * d}}{${cleanB}} = \\frac{${num}}{${cleanB}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanC = c === 0 ? 2 : c;
                let sum = a + b;
                let val = (sum / cleanC) * d;
                let finalAns = Math.floor(val);
                return {
                    expr: `(${a} ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) \\div ${cleanC} \\times ${d}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= (${sum}) \\div ${cleanC} \\times ${d} \\approx ${finalAns} \\end{aligned}`
                };
            },
                        (a, b, c, d) => {
                let cleanB = Math.abs(b);
                let cleanC = Math.abs(c);
                let inner = cleanB * cleanB + cleanC * cleanC;
                
                // Handle 0 edge case safely
                if (inner === 0) {
                    return {
                        expr: `\\sqrt{0^2 + 0^2} \\times ${a}`,
                        ans: `= 0`,
                        sol: `\\begin{aligned} &= \\sqrt{0} \\times ${a} = 0 \\end{aligned}`
                    };
                }

                //# Pull out the largest perfect square factor: sqrt(inner) = k * sqrt(m)
                let k = 1;
                let m = inner;
                for (let i = Math.floor(Math.sqrt(inner)); i >= 2; i--) {
                    if (inner % (i * i) === 0) {
                        k = i;
                        m = inner / (i * i);
                        break;
                    }
                }

                let coeff = a * k;
                let ansStr = "";
                let solStr = "";

                if (m === 1) {
                    // Case 1: Perfect square (e.g. sqrt(25) * 2 = 5 * 2 = 10)
                    ansStr = `= ${coeff}`;
                    solStr = `\\begin{aligned} &= \\sqrt{${inner}} \\times ${a} \\\\ &= ${k} \\times ${a} = ${coeff} \\end{aligned}`;
                } else {
                    // Case 2: Exact radical form (e.g. sqrt(20) * -1 = 2sqrt(5) * -1 = -2sqrt(5))
                    let radicalPart = `\\sqrt{${m}}`;
                    let coeffStr = coeff === 1 ? "" : coeff === -1 ? "-" : coeff === 0 ? "0" : `${coeff}`;
                    
                    if (coeff === 0) {
                        ansStr = `= 0`;
                        solStr = `\\begin{aligned} &= \\sqrt{${inner}} \\times 0 = 0 \\end{aligned}`;
                    } else {
                        ansStr = `= ${coeffStr}${radicalPart}`;
                        let intermediateStep = k > 1 ? `${k}\\sqrt{${m}} \\times ${a}` : `\\sqrt{${inner}} \\times ${a}`;
                        
                        solStr = `\\begin{aligned} &= \\sqrt{${inner}} \\times ${a} ${k > 1 ? `\\\\ &= ${intermediateStep}` : ""} \\\\ &= ${coeffStr}${radicalPart} \\end{aligned}`;
                    }
                }

                return {
                    expr: `\\sqrt{${cleanB}^2 + ${cleanC}^2} \\times ${a}`,
                    ans: ansStr,
                    sol: solStr
                };
            },
            //# New problem type: Fraction division with cancellation
            (a, b, c, d) => {
                let pct = Math.abs(a) === 0 ? 25 : Math.abs(a) * 5; 
                let cleanB = Math.abs(b) === 0 ? 80 : Math.abs(b) * 10; 
                let result = Math.round((pct / 100) * cleanB) + c;
                let pctDecimal = (pct / 100).toFixed(2);
                
                return {
                    expr: `${pct}\\% \\text{ of } ${cleanB} + ${c}`,
                    ans: `= ${result}`,
                    sol: `\\begin{aligned} &= ${pctDecimal} \\times ${cleanB} + ${c} = ${result} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let diff = a - b;
                let absDiff = Math.abs(diff);
                let finalAns = absDiff * c;
                return {
                    expr: `\\left| ${a} - ${b} \\right| \\times ${c}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= |${diff}| \\times ${c} = ${absDiff} \\times ${c} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanA = a === 0 ? 1 : a;
                let cleanB = b === 0 ? 2 : b;
                let cleanC = c === 0 ? 3 : c;
                let cleanD = d === 0 ? 4 : d;
                
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
            (a, b, c, d) => {
                let cleanD = d === 0 ? 2 : d;
                let prod = a * b;
                let quot = c / cleanD;
                let finalAns = prod + Math.floor(quot);
                return {
                    expr: `(${a} \\times ${b}) + (${c} \\div ${cleanD})`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= (${prod}) + (${quot.toFixed(2)}) \\approx ${prod} + ${Math.floor(quot)} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let index = (Math.abs(d) % 2) + 2; // 2 (square root) or 3 (cube root)
                let base = Math.abs(b) === 0 ? 4 : Math.abs(b); 
                let pwr = (Math.abs(c) % 3) + 1; 
                let inner = Math.pow(base, pwr);
                
                // Pull out the largest perfect n-th power factor safely
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
                
                let coeff = a * k;
                let ansStr = "";
                let solStr = "";
                let radStr = `\\sqrt[${index}]{${m}}`;
                
                if (m === 1) {
                    // Case 1: Perfect square/cube (e.g., \sqrt[3]{64} * 2 = 4 * 2 = 8)
                    ansStr = `= ${coeff}`;
                    solStr = `\\begin{aligned} &= \\sqrt[${index}]{${inner}} \\times ${a} \\\\ &= ${k} \\times ${a} = ${coeff} \\end{aligned}`;
                } else {
                    // Case 2: Multi-step radical remaining (e.g., \sqrt[3]{16} * 3 = 2\sqrt[3]{2} * 3 = 6\sqrt[3]{2})
                    if (coeff === 0) {
                        ansStr = `= 0`;
                        solStr = `\\begin{aligned} &= \\sqrt[${index}]{${inner}} \\times 0 = 0 \\end{aligned}`;
                    } else {
                        let coeffStr = coeff === 1 ? "" : coeff === -1 ? "-" : `${coeff}`;
                        ansStr = `= ${coeffStr}${radStr}`;
                        
                        let intermediateStep = k > 1 ? `${k}\\sqrt[${index}]{${m}} \\times ${a}` : `\\sqrt[${index}]{${inner}} \\times ${a}`;
                        solStr = `\\begin{aligned} &= \\sqrt[${index}]{${inner}} \\times ${a} ${k > 1 ? `\\\\ &= ${intermediateStep}` : ""} \\\\ &= ${coeffStr}${radStr} \\end{aligned}`;
                    }
                }
                
                return {
                    expr: `\\sqrt[${index}]{${base}^{${pwr}}} \\times ${a}`,
                    ans: ansStr,
                    sol: solStr
                };
            },
            (a, b, c, d) => {
                let cleanD = d === 0 ? 3 : d;
                let sum = a + b + c;
                
                const finalAns = Utils.formatFraction(sum, cleanD);
                const standardFraction = `\\frac{${sum}}{${cleanD}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{${a} + ${b} + ${c}}{${cleanD}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= \\frac{${sum}}{${cleanD}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            // 
            (a, b, c, d) => {
                let digit = (Math.abs(a) % 9) + 1; 
                let top = digit * b;
                
                // Leverage your existing formatFraction utility for exact reduction
                let exactAns = Utils.formatFraction(top, 9);
                
                let solLines = [`&= \\frac{${digit}}{9} \\times ${b}`];
                
                // Show the unreduced numerator multiplication if b isn't 1
                if (b !== 1) {
                    let directFrac = top < 0 ? `-\\frac{${Math.abs(top)}}{9}` : `\\frac{${top}}{9}`;
                    solLines.push(`&= ${directFrac}`);
                }
                
                // Append final step if it reduces down any further
                let lastLine = `&= ${exactAns}`;
                if (solLines[solLines.length - 1] !== lastLine) {
                    solLines.push(lastLine);
                }

                return {
                    expr: `0.\\overline{${digit}} \\times ${b}`,
                    ans: `= ${exactAns}`,
                    sol: `\\begin{aligned} ${solLines.join(" \\\\ ")} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanA = a === 0 ? 2 : Math.abs(a);
                let cleanB = b === 0 ? 3 : Math.abs(b);
                let cleanC = c === 0 ? 4 : Math.abs(c);
                
                if (cleanB === cleanA) cleanB += 1;
                if (cleanC === cleanB || cleanC === cleanA) cleanC += 2;
                
                let num = cleanB * cleanC + cleanA * cleanC + cleanA * cleanB;
                let den = cleanA * cleanB * cleanC;
                
                const finalAns = Utils.formatFraction(num, den);
                const standardFraction = `\\frac{${num}}{${den}}`;
                const needsCancellation = standardFraction !== finalAns;
                
                return {
                    expr: `\\frac{1}{${cleanA}} + \\frac{1}{${cleanB}} + \\frac{1}{${cleanC}}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &\\text{Find LCD } (${den}) \\implies \\frac{${cleanB * cleanC}}{${den}} + \\frac{${cleanA * cleanC}}{${den}} + \\frac{${cleanA * cleanB}}{${den}} = \\frac{${num}}{${den}} ${needsCancellation ? `= ${finalAns}` : ''} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanA = a === 0 ? 2 : (Math.abs(a) % 4) + 2; 
                let cleanB = (Math.abs(b) % 3) + 1; 
                let cleanC = (Math.abs(c) % 2) + 1; 
                let cleanD = d === 0 ? 2 : d;
                
                let pwr = cleanB * cleanC;
                let baseVal = Math.pow(cleanA, pwr);
                let finalAns = (baseVal / cleanD).toFixed(2);
                
                return {
                    expr: `(${cleanA}^{${cleanB}})^{${cleanC}} \\div ${cleanD}`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanA}^{${pwr}} \\div ${cleanD} \\\\ &= ${baseVal} \\div ${cleanD} = ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanB = Math.abs(b) === 0 ? 100 : Math.abs(b) * 10 + 2;
                let logVal = Math.log10(cleanB);
                let finalAns = Math.round(a * logVal);
                return {
                    expr: `\\log_{10}(${cleanB}) \\times ${a}`,
                    ans: `\\approx ${finalAns}`,
                    sol: `\\begin{aligned} &\\approx ${logVal.toFixed(2)} \\times ${a} \\approx ${finalAns} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanA = a === 0 ? 1 : Math.abs(a);
                let cleanB = b === 0 ? 2 : Math.abs(b);
                let cleanC = c === 0 ? 3 : Math.abs(c);
                let cleanD = d === 0 ? 4 : Math.abs(d);
                
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
            (a, b, c, d) => {
                let cleanA = a === 0 ? 3 : Math.abs(a);
                let cleanB = b === 0 ? 2 : b;
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
            (a, b, c, d) => {
                let factA = (Math.abs(a) % 6) + 3; 
                let ansVal = factA * (factA - 1);
                return {
                    expr: `\\frac{${factA}!}{(${factA}-2)!}`,
                    ans: `= ${ansVal}`,
                    sol: `\\begin{aligned} &= \\frac{${factA} \\times ${factA - 1} \\times (${factA}-2)!}{(${factA}-2)!} = ${ansVal} \\end{aligned}`
                };
            },
            (a, b, c, d) => {
                let cleanB = (Math.abs(b) % 4) + 2; 
                let cleanC = (Math.abs(c) % 5) + 1;  
                let finalAns = cleanC + d;
                return {
                    expr: `\\log_{${cleanB}}(${cleanB}^{${cleanC}}) + \\ln(e^{${d < 0 ? `(${d})` : d}})`,
                    ans: `= ${finalAns}`,
                    sol: `\\begin{aligned} &= ${cleanC}\\log_{${cleanB}}(${cleanB}) + ${d}\\ln(e) \\\\ &= ${cleanC}(1) + ${d}(1) = ${finalAns} \\end{aligned}`
                };
            }
        ]
    };