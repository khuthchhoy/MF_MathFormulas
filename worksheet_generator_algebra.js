
const algebra = {
    easy: [
        //# Family: Expanding (ax + b)(cx + d)
        (a, b, c, d) => {
            // 1. Ensure none of the core coefficients pull a 0 back into an empty/trivial expression
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : -3;
            let valC = c !== 0 ? c : 1;
            let valD = d !== 0 ? d : 5;

            // 2. Compute exact algebraic expansions: (ax + b)(cx + d) = ac(x^2) + (ad + bc)x + bd
            let termX2 = valA * valC;
            let termX_1 = valA * valD;
            let termX_2 = valB * valC;
            let mid = termX_1 + termX_2;
            let last = valB * valD;

            // Helper to format clean linear factor syntax for input parts: e.g. "2x + 3" or "-x - 4"
            const formatLinearFactor = (coeff, constant) => {
                let lead = coeff === 1 ? "x" : coeff === -1 ? "-x" : `${coeff}x`;
                let tail = constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
                return `${lead}${tail}`;
            };

            let exprStr = `(${formatLinearFactor(valA, valB)})(${formatLinearFactor(valC, valD)})`;

            // Helper to format general polynomials cleanly without string fragments breaking signs
            const formatTerm = (val, literal, isFirst) => {
                if (val === 0) return "";
                let sign = val > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                let absVal = Math.abs(val);
                let numStr = (absVal === 1 && literal !== "") ? "" : `${absVal}`;
                return `${sign}${numStr}${literal}`;
            };

            // 3. Form final clean dynamic answers string
            let ansStr = formatTerm(termX2, "x^2", true) + 
                        formatTerm(mid, "x", termX2 === 0) + 
                        formatTerm(last, "", termX2 === 0 && mid === 0);

            // Helper to wrap expression components safely in parentheses if they are negative
            const parenthesizeIfNegative = (str) => {
                return str.startsWith("-") ? `(${str})` : str;
            };

            // 4. Construct intermediate calculation arrays to guarantee matching parenthetical notation
            let term1Str = valA === 1 ? "x" : valA === -1 ? "-x" : `${valA}x`;
            let term2Str = valC === 1 ? "x" : valC === -1 ? "-x" : `${valC}x`;

            // Combines consecutive items cleanly without breaking mathematical symbol flows
            let pX2 = `${term1Str} \\cdot ${parenthesizeIfNegative(term2Str)}`;
            let pOuter = `${term1Str} \\cdot (${valD})`;
            let pInner = `${valB} \\cdot ${parenthesizeIfNegative(term2Str)}`;
            let pLast = `${valB} \\cdot (${valD})`;

            let rawX2 = termX2 === 1 ? "x^2" : termX2 === -1 ? "-x^2" : `${termX2}x^2`;
            let rawOuter = termX_1 > 0 ? `+ ${termX_1}x` : `- ${Math.abs(termX_1)}x`;
            let rawInner = termX_2 > 0 ? `+ ${termX_2}x` : `- ${Math.abs(termX_2)}x`;
            let rawLast = last > 0 ? `+ ${last}` : `- ${Math.abs(last)}`;

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand via the FOIL method:} \\\\
                    &= ${pX2} + ${pOuter} + ${pInner} + ${pLast} \\\\
                    &= ${rawX2} \\ ${rawOuter} \\ ${rawInner} \\ ${rawLast} \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Expanding (ax + b)(ax - b)
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero and absolute
            // In difference of squares, U and V are treated as strictly positive magnitudes
            const valA = Math.abs(a !== 0 ? a : 2);
            const valB = Math.abs(b !== 0 ? b : 3);

            // 2. Determine Problem Type: 0 = Pure Integers, 1 = Fractional Coefficient, 2 = Fractional Constant
            const variant = Math.abs(d) % 3; 

            // Initialize fractional component tracking
            let numA = valA, denA = 1;
            let numB = valB, denB = 1;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                denA = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            }

            // 3. String formatting helpers
            const getRawTerm = (num, den, literal) => {
                const g = Math.abs(gcd(num, den));
                const n = num / g;
                const d = den / g;
                let valStr = "";
                
                if (d === 1) {
                    valStr = (n === 1 && literal !== "") ? "" : `${n}`;
                } else {
                    valStr = `\\frac{${n}}{${d}}`;
                }
                return `${valStr}${literal}`;
            };

            // Construct U and V components visually
            const uStr = getRawTerm(numA, denA, "x");
            const vStr = getRawTerm(numB, denB, "");

            // Randomly decide if it generates (u+v)(u-v) or (u-v)(u+v) based on 'c'
            const isPlusFirst = Math.abs(c) % 2 === 0;
            const exprStr = isPlusFirst 
                ? `\\left(${uStr} + ${vStr}\\right)\\left(${uStr} - ${vStr}\\right)`
                : `\\left(${uStr} - ${vStr}\\right)\\left(${uStr} + ${vStr}\\right)`;

            // 4. Calculate Final Answer: u^2 - v^2
            const numX2 = numA * numA;
            const denX2 = denA * denA;
            const numLast = numB * numB;
            const denLast = denB * denB;

            const ansUStr = getRawTerm(numX2, denX2, "x^2");
            const ansVStr = getRawTerm(numLast, denLast, "");
            const ansStr = `${ansUStr} - ${ansVStr}`;

            // 5. Construct solution substitution gracefully
            // Wrap fractions and coefficients safely for the intermediate (u)^2 - (v)^2 step
            const uWrapped = (numA === 1 && denA === 1) ? "x" : `\\left(${uStr}\\right)`;
            const vWrapped = denB === 1 ? `${vStr}` : `\\left(${vStr}\\right)`;

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand using difference of squares } (u - v)(u + v) = u^2 - v^2: \\\\
                    &= ${uWrapped}^2 - ${vWrapped}^2 \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Expanding (ax + b)^2
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : 3;

            // Use absolute parity of (c + d) to split strictly between addition and subtraction forms
            const isSubtraction = (Math.abs(c + d) % 2) === 1;
            valB = isSubtraction ? -Math.abs(valB) : Math.abs(valB);

            // 2. Determine Problem Type: 0 = Pure Integers, 1 = Fractional Coefficient, 2 = Fractional Constant
            const variant = Math.abs(d) % 3; 

            // Initialize fractional component tracking (defaulting to whole number denominators of 1)
            let numA = valA, denA = 1;
            let numB = valB, denB = 1;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                // Case: ( (numA/denA)x + numB )^2
                denA = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numA, denA));
                numA /= g; 
                denA /= g;
            } else if (variant === 2) {
                // Case: ( numA*x + (numB/denB) )^2
                denB = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numB, denB));
                numB /= g; 
                denB /= g;
            }

            // 3. Calculate Expanded Terms
            const numX2 = numA * numA;
            const denX2 = denA * denA;

            const numMid = 2 * numA * numB;
            const denMid = denA * denB;

            const numLast = numB * numB;
            const denLast = denB * denB;

            // Local algebraic fraction and term formatter to prevent double signs or visible 1s
            const formatFracTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                const g = Math.abs(gcd(num, den));
                let n = num / g;
                const d = den / g;

                // Automatically assign space-padded operator notation if it isn't the first element
                const sign = n > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                n = Math.abs(n);

                let valueStr = "";
                if (d === 1) {
                    // Keep numerical 1 if literal string is empty (i.e., standalone constant)
                    valueStr = (n === 1 && literal !== "") ? "" : `${n}`;
                } else {
                    valueStr = `\\frac{${n}}{${d}}`;
                }
                return `${sign}${valueStr}${literal}`;
            };

            // 4. Construct initial expression string cleanly
            const termAStr = formatFracTerm(numA, denA, "x", true);
            const termBStr = formatFracTerm(numB, denB, "", false);
            const exprStr = `\\left(${termAStr}${termBStr}\\right)^2`;

            // 5. Construct solution parts and final answer polynomial
            const ansStr = formatFracTerm(numX2, denX2, "x^2", true) + 
                        formatFracTerm(numMid, denMid, "x", false) + 
                        formatFracTerm(numLast, denLast, "", false);

            // --- FIX: Completely isolated absolute calculation for the intermediate 2uv step ---
            const absNumA = Math.abs(numA);
            const absNumB = Math.abs(numB);

            const step1X2 = denA === 1 ? (absNumA === 1 ? "x^2" : `(${absNumA}x)^2`) : `\\left(\\frac{${absNumA}}{${denA}}x\\right)^2`;
            const step1MidSign = numMid > 0 ? "+" : "-";
            
            // Evaluate strict absolute layouts for u & v to guarantee structural signs never contaminate strings
            const uComponent = denA === 1 ? (absNumA === 1 ? "x" : `${absNumA}x`) : `\\left(\\frac{${absNumA}}{${denA}}x\\right)`;
            const vComponent = denB === 1 ? `${absNumB}` : `\\left(\\frac{${absNumB}}{${denB}}\\right)`;
            
            let step1Mid = "";
            if (denA === 1 && absNumA === 1) {
                step1Mid = `2 \\cdot x \\cdot ${vComponent}`;
            } else if (denA === 1) {
                step1Mid = `2 \\cdot ${absNumA}x \\cdot ${vComponent}`;
            } else {
                step1Mid = `2 \\cdot ${uComponent} \\cdot ${vComponent}`;
            }

            const step1Last = denB === 1 ? `(${absNumB})^2` : `\\left(\\frac{${absNumB}}{${denB}}\\right)^2`;
            const intermediateStep = `${step1X2} ${step1MidSign} ${step1Mid} + ${step1Last}`;

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand using the perfect square formula } (u \\pm v)^2 = u^2 \\pm 2uv + v^2: \\\\
                    &= ${intermediateStep} \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Expanding (ax + b)^3
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : 3;

            // Use absolute parity of (c + d) to split strictly between addition and subtraction forms
            const isSubtraction = (Math.abs(c + d) % 2) === 1;
            valB = isSubtraction ? -Math.abs(valB) : Math.abs(valB);

            // 2. Determine Problem Type: 0 = Pure Integers, 1 = Fractional Coefficient, 2 = Fractional Constant
            const variant = Math.abs(d) % 3; 

            // Initialize fractional component tracking
            let numA = valA, denA = 1;
            let numB = valB, denB = 1;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                denA = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            }

            // 3. Final calculated numerators and denominators for the standard algebraic result
            const numX3 = numA * numA * numA;
            const denX3 = denA * denA * denA;

            const numX2 = 3 * numA * numA * numB;
            const denX2 = denA * denA * denB;

            const numX1 = 3 * numA * numB * numB;
            const denX1 = denA * denB * denB;

            const numLast = numB * numB * numB;
            const denLast = denB * denB * denB;

            // Formatter for standard polynomials (used for the expression and final answer)
            const formatFracTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                const g = Math.abs(gcd(num, den));
                let n = num / g;
                const d = den / g;

                const sign = n > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                n = Math.abs(n);

                let valueStr = "";
                if (d === 1) {
                    valueStr = (n === 1 && literal !== "") ? "" : `${n}`;
                } else {
                    valueStr = `\\frac{${n}}{${d}}`;
                }
                return `${sign}${valueStr}${literal}`;
            };

            const termAStr = formatFracTerm(numA, denA, "x", true);
            const termBStr = formatFracTerm(numB, denB, "", false);
            const exprStr = `\\left(${termAStr}${termBStr}\\right)^3`;

            const ansStr = formatFracTerm(numX3, denX3, "x^3", true) + 
                        formatFracTerm(numX2, denX2, "x^2", false) + 
                        formatFracTerm(numX1, denX1, "x", false) + 
                        formatFracTerm(numLast, denLast, "", false);

            // --- 4. Pedagogical Substitution Logic (The Fix) ---
            // Generates raw terms without visual operator padding for clean substitution
            const getRawTerm = (num, den, literal) => {
                const g = Math.abs(gcd(num, den));
                const n = num / g;
                const d = den / g;
                const sign = n < 0 ? "-" : "";
                const absN = Math.abs(n);
                let valStr = "";
                if (d === 1) {
                    valStr = (absN === 1 && literal !== "") ? "" : `${absN}`;
                } else {
                    valStr = `\\frac{${absN}}{${d}}`;
                }
                return `${sign}${valStr}${literal}`;
            };

            // For U, we retain the exact original sign/fraction to directly plug into (u)^3
            const rawU = getRawTerm(numA, denA, "x");
            // Only drop parentheses if it is exactly a positive standalone 'x'
            const u = (numA === 1 && denA === 1) ? { wrapped: "x" } : { wrapped: `\\left(${rawU}\\right)` };

            // For V, formula logic dictates we use the absolute magnitude for the standard (u ± v)^3 expansion
            const absNumB = Math.abs(numB);
            const rawV = getRawTerm(absNumB, denB, "");
            const dV = denB / Math.abs(gcd(numB, denB));
            const v = dV === 1 ? { wrapped: `(${rawV})` } : { wrapped: `\\left(${rawV}\\right)` };

            // 5. Construct the intermediate substitution line mapping directly to the formula
            const term1 = `${u.wrapped}^3`;
            const term2 = `3 \\cdot ${u.wrapped}^2 \\cdot ${v.wrapped}`;
            const term3 = `3 \\cdot ${u.wrapped} \\cdot ${v.wrapped}^2`;
            const term4 = `${v.wrapped}^3`;

            // Map operators based purely on whether the original expression is an addition or subtraction
            const op1 = numB > 0 ? " + " : " - ";
            const op2 = " + ";
            const op3 = numB > 0 ? " + " : " - ";

            const intermediateStep = `${term1}${op1}${term2}${op2}${term3}${op3}${term4}`;

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand using } (u \\pm v)^3 = u^3 \\pm 3u^2v + 3uv^2 \\pm v^3: \\\\
                    &= ${intermediateStep} \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Expanding (a - b)(a^2 + ab + b^2) or (a + b)(a^2 - ab + b^2)
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero. 
            // We treat U and V as absolute magnitudes to fit into the standard formulas perfectly.
            const valA = Math.abs(a !== 0 ? a : 2);
            let valB = b !== 0 ? b : 3;

            // Use absolute parity of (c + d) to split strictly between addition and subtraction forms
            const isSubtraction = (Math.abs(c + d) % 2) === 1;
            valB = isSubtraction ? -Math.abs(valB) : Math.abs(valB);

            // 2. Determine Problem Type: 0 = Pure Integers, 1 = Fractional Coefficient, 2 = Fractional Constant
            const variant = Math.abs(d) % 3; 

            // Initialize fractional component tracking
            let numA = valA, denA = 1;
            let numB = Math.abs(valB), denB = 1;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                denA = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(c) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            }

            // 3. String formatting helper for raw components
            const getRawTerm = (num, den, literal) => {
                const g = Math.abs(gcd(num, den));
                const n = num / g;
                const d = den / g;
                let valStr = "";
                
                if (d === 1) {
                    valStr = (n === 1 && literal !== "") ? "" : `${n}`;
                } else {
                    valStr = `\\frac{${n}}{${d}}`;
                }
                return `${valStr}${literal}`;
            };

            // Extract visual base components
            const uStr = getRawTerm(numA, denA, "x");
            const vStr = getRawTerm(numB, denB, "");

            // Calculate internal trinomial pieces: u^2, uv, v^2
            const numU2 = numA * numA, denU2 = denA * denA;
            const numUV = numA * numB, denUV = denA * denB;
            const numV2 = numB * numB, denV2 = denB * denB;

            const u2Str = getRawTerm(numU2, denU2, "x^2");
            const uvStr = getRawTerm(numUV, denUV, "x");
            const v2Str = getRawTerm(numV2, denV2, "");

            // Structure signs based on whether it is Sum or Difference of Cubes
            const isSum = valB > 0;
            
            const binoOp = isSum ? "+" : "-";
            const trinoOp1 = isSum ? "-" : "+"; // The middle sign of the trinomial is always the opposite of the binomial
            const trinoOp2 = "+"; // The last sign is always positive

            const exprStr = `\\left(${uStr} ${binoOp} ${vStr}\\right)\\left(${u2Str} ${trinoOp1} ${uvStr} ${trinoOp2} ${v2Str}\\right)`;

            // 4. Calculate Final Answer: u^3 ± v^3
            const numX3 = numA * numA * numA;
            const denX3 = denA * denA * denA;
            const numLast = numB * numB * numB;
            const denLast = denB * denB * denB;

            const ansUStr = getRawTerm(numX3, denX3, "x^3");
            const ansVStr = getRawTerm(numLast, denLast, "");
            
            const ansOp = isSum ? "+" : "-";
            const ansStr = `${ansUStr} ${ansOp} ${ansVStr}`;

            // 5. Construct pedagogical solution text and structural substitution
            const uWrapped = (numA === 1 && denA === 1) ? "x" : `\\left(${uStr}\\right)`;
            const vWrapped = denB === 1 ? `${vStr}` : `\\left(${vStr}\\right)`;
            
            const formulaName = isSum ? "sum of cubes" : "difference of cubes";
            const formula = isSum 
                ? "(u + v)(u^2 - uv + v^2) = u^3 + v^3" 
                : "(u - v)(u^2 + uv + v^2) = u^3 - v^3";

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand using ${formulaName} } ${formula}: \\\\
                    &= ${uWrapped}^3 ${ansOp} ${vWrapped}^3 \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Expanding (ax + by + c)^2
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : 3;
            let valC = c !== 0 ? c : -4;

            // 2. Determine Problem Type: 0 = Pure Integers, 1 = Term A Fraction, 2 = Term B Fraction, 3 = Constant Fraction
            let variant = Math.abs(d) % 4; 

            // Initialize fractional component tracking
            let numA = valA, denA = 1;
            let numB = valB, denB = 1;
            let numC = valC, denC = 1;

            let gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                denA = (Math.abs(valB) % 3) + 2; // Denominator between 2 and 4
                let g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(valC) % 3) + 2; // Denominator between 2 and 4
                let g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            } else if (variant === 3) {
                denC = (Math.abs(valA) % 3) + 2; // Denominator between 2 and 4
                let g = Math.abs(gcd(numC, denC));
                numC /= g; denC /= g;
            }

            // 3. Formatter for final polynomial output (handles double signs and visible 1s)
            const formatFracTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                let g = Math.abs(gcd(num, den));
                let n = num / g;
                let d = den / g;

                let sign = n > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                n = Math.abs(n);

                let valueStr = "";
                if (d === 1) {
                    valueStr = (n === 1 && literal !== "") ? "" : `${n}`;
                } else {
                    valueStr = `\\frac{${n}}{${d}}`;
                }
                return `${sign}${valueStr}${literal}`;
            };

            // 4. Construct initial expression string cleanly
            let termAStr = formatFracTerm(numA, denA, "x", true);
            let termBStr = formatFracTerm(numB, denB, "y", false);
            let termCStr = formatFracTerm(numC, denC, "", false);
            let exprStr = `\\left(${termAStr}${termBStr}${termCStr}\\right)^2`;

            // 5. Construct final expanded answer string ordered standardly: x^2, xy, y^2, x, y, constant
            let ansStr = formatFracTerm(numA * numA, denA * denA, "x^2", true) + 
                        formatFracTerm(2 * numA * numB, denA * denB, "xy", false) + 
                        formatFracTerm(numB * numB, denB * denB, "y^2", false) + 
                        formatFracTerm(2 * numA * numC, denA * denC, "x", false) + 
                        formatFracTerm(2 * numB * numC, denB * denC, "y", false) + 
                        formatFracTerm(numC * numC, denC * denC, "", false);

            // 6. Pedagogical Substitution Logic (Isolated components preserving true signs)
            const getRawTerm = (num, den, literal) => {
                let g = Math.abs(gcd(num, den));
                let n = num / g;
                let d = den / g;
                let sign = n < 0 ? "-" : "";
                let absN = Math.abs(n);
                let valStr = "";
                if (d === 1) {
                    valStr = (absN === 1 && literal !== "") ? "" : `${absN}`;
                } else {
                    valStr = `\\frac{${absN}}{${d}}`;
                }
                return `${sign}${valStr}${literal}`;
            };

            let rawU = getRawTerm(numA, denA, "x");
            let rawV = getRawTerm(numB, denB, "y");
            let rawW = getRawTerm(numC, denC, "");

            // Dynamically wrap elements cleanly to bypass over-parenthesizing simple items
            let uWrapped = (numA === 1 && denA === 1) ? "x" : `\\left(${rawU}\\right)`;
            let vWrapped = (numB === 1 && denB === 1) ? "y" : `\\left(${rawV}\\right)`;
            let wWrapped = (denC === 1 && numC > 0) ? `${rawW}` : `\\left(${rawW}\\right)`;

            let term1 = `${uWrapped}^2`;
            let term2 = `${vWrapped}^2`;
            let term3 = `${wWrapped}^2`;
            let term4 = `2 \\cdot ${uWrapped} \\cdot ${vWrapped}`;
            let term5 = `2 \\cdot ${uWrapped} \\cdot ${wWrapped}`;
            let term6 = `2 \\cdot ${vWrapped} \\cdot ${wWrapped}`;

            let intermediateStep = `${term1} + ${term2} + ${term3} + ${term4} + ${term5} + ${term6}`;

            return {
                expr: `\\begin{aligned}&\\text{Expand and Simplify: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand using the trinomial square formula } (u + v + w)^2 = u^2 + v^2 + w^2 + 2uv + 2uw + 2vw: \\\\
                    &= ${intermediateStep} \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Factorize u^2 ± 2uv + v^2=(u±v)^2, u^2 - v^2=(u+v)(u-v), u^3 ± v^3=(u±v)(u^2∓uv+v^2)
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero absolute magnitudes
            const valA = Math.abs(a !== 0 ? a : 2);
            const valB = Math.abs(b !== 0 ? b : 3);

            // Formula Router: 0 = Perfect Sq (+), 1 = Perfect Sq (-), 2 = Diff of Sq, 3 = Sum of Cubes, 4 = Diff of Cubes
            const formulaType = Math.abs(c) % 5;
            
            // Problem Variation Tracker: 0 = Pure Integers, 1 = Fractional Coefficient, 2 = Fractional Constant
            const variant = Math.abs(d) % 3;

            let numA = valA, denA = 1;
            let numB = valB, denB = 1;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            if (variant === 1) {
                denA = (Math.abs(b) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(a) % 3) + 2; // Denominator between 2 and 4
                const g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            }

            // 2. Clear visual string formatting helper
            const getRawTerm = (num, den, literal) => {
                const g = Math.abs(gcd(num, den));
                const n = num / g;
                const d = den / g;
                if (d === 1) {
                    return (n === 1 && literal !== "") ? `${literal}` : `${n}${literal}`;
                } else {
                    return `\\frac{${n}}{${d}}${literal}`;
                }
            };

            // Form absolute visual base strings for components u and v
            const uStr = getRawTerm(numA, denA, "x");
            const vStr = getRawTerm(numB, denB, "");

            // Prepare structural math wrappers for pedagogical step isolation
            const uWrapped = (numA === 1 && denA === 1) ? "x" : `\\left(${uStr}\\right)`;
            const vWrapped = denB === 1 ? `${vStr}` : `\\left(${vStr}\\right)`;

            let exprStr = "";
            let ansStr = "";
            let solStr = "";

            // 3. Evaluate identity structures
            if (formulaType === 0 || formulaType === 1) {
                // Perfect Square Trinomials
                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const uv2Str = getRawTerm(2 * numA * numB, denA * denB, "x");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                const op = formulaType === 0 ? "+" : "-";
                exprStr = `${u2Str} ${op} ${uv2Str} + ${v2Str}`;
                ansStr = `\\left(${uStr} ${op} ${vStr}\\right)^2`;
                
                solStr = `\\begin{aligned}
                    &\\text{Recognize the perfect square trinomial pattern } u^2 ${op} 2uv + v^2 = (u ${op} v)^2: \\\\
                    &\\text{Identify the core parameters: } u = ${uStr} \\text{ and } v = ${vStr} \\\\
                    &= ${uWrapped}^2 ${op} 2 \\cdot ${uWrapped} \\cdot ${vWrapped} + ${vWrapped}^2 \\\\
                    &= ${ansStr}
                \\end{aligned}`;

            } else if (formulaType === 2) {
                // Difference of Squares
                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                exprStr = `${u2Str} - ${v2Str}`;
                ansStr = `\\left(${uStr} - ${vStr}\\right)\\left(${uStr} + ${vStr}\\right)`;

                solStr = `\\begin{aligned}
                    &\\text{Recognize the difference of squares pattern } u^2 - v^2 = (u - v)(u + v): \\\\
                    &\\text{Identify the core parameters: } u = ${uStr} \\text{ and } v = ${vStr} \\\\
                    &= ${uWrapped}^2 - ${vWrapped}^2 \\\\
                    &= ${ansStr}
                \\end{aligned}`;

            } else {
                // Sum or Difference of Cubes
                const u3Str = getRawTerm(numA * Math.pow(numA, 2), denA * Math.pow(denA, 2), "x^3");
                const v3Str = getRawTerm(numB * Math.pow(numB, 2), denB * Math.pow(denB, 2), "");

                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const uvStr = getRawTerm(numA * numB, denA * denB, "x");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                const isSum = formulaType === 3;
                const opExpr = isSum ? "+" : "-";
                const opBino = isSum ? "+" : "-";
                const opTrino1 = isSum ? "-" : "+";

                exprStr = `${u3Str} ${opExpr} ${v3Str}`;
                ansStr = `\\left(${uStr} ${opBino} ${vStr}\\right)\\left(${u2Str} ${opTrino1} ${uvStr} + ${v2Str}\\right)`;

                const formulaPattern = isSum 
                    ? "u^3 + v^3 = (u + v)(u^2 - uv + v^2)" 
                    : "u^3 - v^3 = (u - v)(u^2 + uv + v^2)";

                solStr = `\\begin{aligned}
                    &\\text{Recognize the algebraic pattern } ${formulaPattern}: \\\\
                    &\\text{Identify the core parameters: } u = ${uStr} \\text{ and } v = ${vStr} \\\\
                    &= ${uWrapped}^3 ${opExpr} ${vWrapped}^3 \\\\
                    &= ${ansStr}
                \\end{aligned}`;
            }

            return {
                expr: `\\begin{aligned}&\\text{Factorize expression: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: solStr
            };
        },
        //# Family: Factoring by Grouping (AC Method) for ax^2 + bx + c
        (a, b, c, d) => {
            // 1. Ensure core raw integer variables are non-zero
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : 3;
            let valC = c !== 0 ? c : 1;
            let valD = d !== 0 ? d : -5;

            // 2. Determine Problem Type variant: 0 = monic (a=1), 1 = simple non-monic, 2 = general non-monic
            let variant = Math.abs(valD) % 3;

            let p = Math.abs(valA);
            let q = valB;
            let r = Math.abs(valC);
            let s = valD;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            // Simplify binomial components to ensure primitive factors
            let gPQ = Math.abs(gcd(p, q));
            p /= gPQ; q /= gPQ;

            let gRS = Math.abs(gcd(r, s));
            r /= gRS; s /= gRS;

            // Enforce variant structure
            if (variant === 0) {
                p = 1;
                r = 1;
            } else if (variant === 1) {
                if (p === 1) p = 2;
                r = 1;
            } else {
                if (p === 1) p = 2;
                if (r === 1) r = 3;
            }

            // Sanitize to prevent zero coefficients or constants
            if (q === 0) q = 3;
            if (s === 0) s = -5;

            // Prevent the middle term (b) from being 0 (which turns it into a difference of squares)
            if (p * s + q * r === 0) {
                s += (s > 0 ? 1 : -1);
            }

            // 3. Formatter for polynomial terms to manage signs and visible 1s beautifully
            const formatTerm = (coeff, literal, isFirst) => {
                if (coeff === 0) return "";
                let sign = coeff > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                let absC = Math.abs(coeff);
                let valStr = (absC === 1 && literal !== "") ? "" : `${absC}`;
                return `${sign}${valStr}${literal}`;
            };

            // Construct the initial problem expression string: ax^2 + bx + c
            let exprStr = formatTerm(p * r, "x^2", true) + 
                        formatTerm(p * s + q * r, "x", false) + 
                        formatTerm(q * s, "", false);

            // Construct the final answer string: (px + q)(rx + s)
            const formatBinomial = (coeffX, constVal) => {
                let termX = formatTerm(coeffX, "x", true);
                let termConst = formatTerm(constVal, "", false);
                return `\\left(${termX}${termConst}\\right)`;
            };
            let ansStr = formatBinomial(p, q) + formatBinomial(r, s);

            // 4. Pedagogical Splitting & Grouping Logic (AC Method)
            // First group: (p*r)x^2 + (p*s)x
            let g1 = Math.abs(gcd(p * r, p * s));
            let remP = (p * r) / g1;
            let remQ = (p * s) / g1;

            // Second group: (q*r)x + (q*s)
            let g2 = (q * r) / remP; 
            let g2Sign = g2 > 0 ? " + " : " - ";
            let g2Val = Math.abs(g2) === 1 ? "" : `${Math.abs(g2)}`;

            // Generate intermediate strings
            let splitStr = formatTerm(p * r, "x^2", true) + 
                        formatTerm(p * s, "x", false) + 
                        formatTerm(q * r, "x", false) + 
                        formatTerm(q * s, "", false);

            let g1Str = g1 === 1 ? "x" : `${g1}x`;
            let insideParentheses = `${formatTerm(remP, "x", true)}${formatTerm(remQ, "", false)}`;

            return {
                expr: `\\begin{aligned}&\\text{Factorize expression: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Factor by splitting the middle term (AC method):} \\\\
                    &= ${splitStr} \\\\
                    &= ${g1Str}\\left(${insideParentheses}\\right)${g2Sign}${g2Val}\\left(${insideParentheses}\\right) \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        },
        //# Family: Linear Equation Solver (ax + b = c)
        (a, b, c, d) => {
            let coA = a !== 0 ? a : 2;
            if (coA === 1) coA = 2;
            if (coA === -1) coA = -2;
            let valX = c !== 0 ? c : 3;
            let constB = b !== 0 ? b : -4;
            let rhs = coA * valX + constB;
            
            let termA = coA === 1 ? "x" : coA === -1 ? "-x" : `${coA}x`;
            let signB = constB > 0 ? `+ ${constB}` : `- ${Math.abs(constB)}`;
            let oppSignB = constB > 0 ? `- ${constB}` : `+ ${Math.abs(constB)}`;
            
            return {
                expr: `\\begin{aligned}&\\text{Solve for x: } \\\\ & \\quad ${termA} ${signB} = ${rhs} \\end{aligned}`,
                ans: `x = ${valX}`,
                sol: `\\begin{aligned}
                    &${termA} ${signB} = ${rhs} \\\\
                    &${termA} = ${rhs} ${oppSignB} \\\\
                    &${termA} = ${coA * valX} \\\\
                    &x = \\frac{${coA * valX}}{${coA}} = ${valX}
                \\end{aligned}`
            };
        },
        //# Family: Solving Quadratic Equations by Factoring (ax^2 + bx + c = 0, AC method, a^2 - b^2 = 0, (u ± v)^2 = 0)
        (a, b, c, d) => {
            // 1. Core raw parameters setup
            const valA = Math.abs(a !== 0 ? a : 2);
            const valB = Math.abs(b !== 0 ? b : 3);
            
            // Equation Type Router: 
            // 0 = ax^2+bx+c=0 (AC method), 1 = (u+v)^2=0, 2 = (u-v)^2=0, 3 = u^2-v^2=0, 4 = u^3+v^3=0, 5 = u^3-v^3=0
            const equationType = Math.abs(c) % 6;
            const variant = Math.abs(d) % 3;

            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);

            // Form fraction tracking parameters for standard patterns (Types 1-5)
            let numA = valA, denA = 1;
            let numB = valB, denB = 1;

            if (variant === 1) {
                denA = (Math.abs(b) % 3) + 2;
                const g = Math.abs(gcd(numA, denA));
                numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(a) % 3) + 2;
                const g = Math.abs(gcd(numB, denB));
                numB /= g; denB /= g;
            }

            // Fraction rendering helper for solutions and roots
            const formatFraction = (num, den) => {
                if (num === 0) return "0";
                const isNegative = (num < 0 && den > 0) || (num > 0 && den < 0);
                const absNum = Math.abs(num);
                const absDen = Math.abs(den);
                const g = Math.abs(gcd(absNum, absDen));
                const n = absNum / g;
                const d = absDen / g;
                if (d === 1) return isNegative ? `-${n}` : `${n}`;
                return isNegative ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
            };

            const getRawTerm = (num, den, literal) => {
                const g = Math.abs(gcd(num, den));
                const n = num / g;
                const d = den / g;
                if (d === 1) {
                    return (n === 1 && literal !== "") ? `${literal}` : `${n}${literal}`;
                } else {
                    return `\\frac{${n}}{${d}}${literal}`;
                }
            };

            // Shared visual base variables
            const uStr = getRawTerm(numA, denA, "x");
            const vStr = getRawTerm(numB, denB, "");
            const uWrapped = (numA === 1 && denA === 1) ? "x" : `\\left(${uStr}\\right)`;
            const vWrapped = denB === 1 ? `${vStr}` : `\\left(${vStr}\\right)`;

            let exprStr = "";
            let ansStr = "";
            let solStr = "";

            // 2. Execute structured equation logic routing
            if (equationType === 0) {
                // General Quadratic: ax^2 + bx + c = 0 using AC factoring by grouping
                let p = Math.abs(a !== 0 ? a : 2);
                let q = b !== 0 ? b : 3;
                let r = Math.abs(d !== 0 ? d : 1);
                let s = (a + b + c) !== 0 ? (a + b + c) : -2;

                let gPQ = Math.abs(gcd(p, q)); p /= gPQ; q /= gPQ;
                let gRS = Math.abs(gcd(r, s)); r /= gRS; s /= gRS;
                if (p * s + q * r === 0) s += 1; // Prevent middle linear term from dropping out

                const formatTerm = (coeff, literal, isFirst) => {
                    if (coeff === 0) return "";
                    let sign = coeff > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                    let absC = Math.abs(coeff);
                    let valStr = (absC === 1 && literal !== "") ? "" : `${absC}`;
                    return `${sign}${valStr}${literal}`;
                };

                exprStr = formatTerm(p * r, "x^2", true) + formatTerm(p * s + q * r, "x", false) + formatTerm(q * s, "", false) + " = 0";
                
                let root1 = formatFraction(-q, p);
                let root2 = formatFraction(-s, r);
                ansStr = `x = ${root1}, \\quad x = ${root2}`;

                let splitStr = formatTerm(p * r, "x^2", true) + formatTerm(p * s, "x", false) + formatTerm(q * r, "x", false) + formatTerm(q * s, "", false);
                let g1 = Math.abs(gcd(p * r, p * s));
                let remP = (p * r) / g1;
                let remQ = (p * s) / g1;
                let g2 = (q * r) / remP;
                let g2Sign = g2 > 0 ? " + " : " - ";
                let g2Val = Math.abs(g2) === 1 ? "" : `${Math.abs(g2)}`;
                let g1String = g1 === 1 ? "x" : `${g1}x`;
                let insideParentheses = `${formatTerm(remP, "x", true)}${formatTerm(remQ, "", false)}`;

                solStr = `\\begin{aligned}
                    &\\text{Factor the trinomial equation using the AC grouping method:} \\\\
                    &${splitStr} = 0 \\\\
                    &${g1String}\\left(${insideParentheses}\\right)${g2Sign}${g2Val}\\left(${insideParentheses}\\right) = 0 \\\\
                    &\\left(${formatTerm(p, "x", true)}${formatTerm(q, "", false)}\\right)\\left(${formatTerm(r, "x", true)}${formatTerm(s, "", false)}\\right) = 0 \\\\
                    &\\text{Set each factor to zero to solve for } x: \\\\
                    &${formatTerm(p, "x", true)}${formatTerm(q, "", false)} = 0 \\implies x = ${root1} \\\\
                    &${formatTerm(r, "x", true)}${formatTerm(s, "", false)} = 0 \\implies x = ${root2} \\\\
                    &\\text{Final Solutions: } ${ansStr}
                \\end{aligned}`;

            } else if (equationType === 1 || equationType === 2) {
                // Perfect Square Trinomial Equations: (u ± v)^2 = 0
                const isSum = equationType === 1;
                const op = isSum ? "+" : "-";
                
                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const uv2Str = getRawTerm(2 * numA * numB, denA * denB, "x");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                exprStr = `${u2Str} ${op} ${uv2Str} + ${v2Str} = 0`;
                
                // Root calculation: u ± v = 0 -> x = ∓ (numB * denA) / (numA * denB)
                let finalNum = isSum ? -numB * denA : numB * denA;
                let rootVal = formatFraction(finalNum, numA * denB);
                ansStr = `x = ${rootVal} \\text{ (repeated root)}`;

                solStr = `\\begin{aligned}
                    &\\text{Recognize the perfect square identity } u^2 ${op} 2uv + v^2 = (u ${op} v)^2: \\\\
                    &${uWrapped}^2 ${op} 2${uWrapped}${vWrapped} + ${vWrapped}^2 = 0 \\\\
                    &\\left(${uStr} ${op} ${vStr}\\right)^2 = 0 \\\\
                    &\\text{Set the base factor to zero:} \\\\
                    &${uStr} ${op} ${vStr} = 0 \\implies x = ${rootVal}
                \\end{aligned}`;

            } else if (equationType === 3) {
                // Difference of Squares Equations: u^2 - v^2 = 0
                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                exprStr = `${u2Str} - ${v2Str} = 0`;
                
                let r1 = formatFraction(numB * denA, numA * denB);
                let r2 = formatFraction(-numB * denA, numA * denB);
                ansStr = `x = ${r1}, \\quad x = ${r2}`;

                solStr = `\\begin{aligned}
                    &\\text{Factor using the difference of squares identity } u^2 - v^2 = (u - v)(u + v): \\\\
                    &${uWrapped}^2 - ${vWrapped}^2 = 0 \\\\
                    &\\left(${uStr} - ${vStr}\\right)\\left(${uStr} + ${vStr}\\right) = 0 \\\\
                    &\\text{Set each distinct linear factor to zero:} \\\\
                    &${uStr} - ${vStr} = 0 \\implies x = ${r1} \\\\
                    &${uStr} + ${vStr} = 0 \\implies x = ${r2} \\\\
                    &\\text{Final Solutions: } ${ansStr}
                \\end{aligned}`;

            } else {
                // Sum and Difference of Cubes Equations: u^3 ± v^3 = 0
                const isSum = equationType === 4;
                const opExpr = isSum ? "+" : "-";
                const opBino = isSum ? "+" : "-";
                const opTrino = isSum ? "-" : "+";

                const u3Str = getRawTerm(Math.pow(numA, 3), Math.pow(denA, 3), "x^3");
                const v3Str = getRawTerm(Math.pow(numB, 3), Math.pow(denB, 3), "");

                const u2Str = getRawTerm(numA * numA, denA * denA, "x^2");
                const uvStr = getRawTerm(numA * numB, denA * denB, "x");
                const v2Str = getRawTerm(numB * numB, denB * denB, "");

                exprStr = `${u3Str} ${opExpr} ${v3Str} = 0`;
                
                let finalNum = isSum ? -numB * denA : numB * denA;
                let realRoot = formatFraction(finalNum, numA * denB);
                ansStr = `x = ${realRoot}`;

                solStr = `\\begin{aligned}
                    &\\text{Factor using the sum/difference of cubes pattern } u^3 ${opExpr} v^3 = (u ${opBino} v)(u^2 ${opTrino} uv + v^2): \\\\
                    &${uWrapped}^3 ${opExpr} ${vWrapped}^3 = 0 \\\\
                    &\\left(${uStr} ${opBino} ${vStr}\\right)\\left(${u2Str} ${opTrino} ${uvStr} + ${v2Str}\\right) = 0 \\\\
                    &\\text{Set the real linear factor to zero (the trinomial factor yields no real roots):} \\\\
                    &${uStr} ${opBino} ${vStr} = 0 \\implies x = ${realRoot}
                \\end{aligned}`;
            }

            return {
                expr: `\\begin{aligned}&\\text{Solve equation: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: solStr
            };
        },
        //# Family: Solving Quadratic Equations by Factoring (ax^2 + bx + c = 0, AC method) 
        (a, b, c, d) => {
            let p = Math.abs(a !== 0 ? a : 2) % 3 + 1;
            let q = (b !== 0 ? b : 3) % 3 + 1; if (c < 0) q = -q;
            let r = Math.abs(d !== 0 ? d : 1) % 3 + 1;
            let s = (a + b + c !== 0 ? a + b + c : -2) % 3 + 1; if (a < 0) s = -s;

            const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
            let gPQ = gcd(p, q); p /= gPQ; q /= gPQ;
            let gRS = gcd(r, s); r /= gRS; s /= gRS;
            if (p * s + q * r === 0) s += 1;

            let coeffA = p * r;
            let coeffB = p * s + q * r;
            let coeffC = q * s;

            let variant = Math.abs(c) % 2; // 0 = Integer Trinomial, 1 = Fractional Trinomial
            let denEqu = variant === 1 ? (Math.abs(b) % 3) + 2 : 1;

            const formatFrac = (num, den) => {
                if (num === 0) return "0";
                let isNeg = (num < 0) ^ (den < 0);
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                if (d === 1) return isNeg ? `-${n}` : `${n}`;
                return isNeg ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
            };

            const formatTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                let isNeg = (num < 0) ^ (den < 0);
                let sign = isNeg ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                let valStr = d === 1 ? ((n === 1 && literal !== "") ? "" : `${n}`) : `\\frac{${n}}{${d}}`;
                return `${sign}${valStr}${literal}`;
            };

            let exprStr = formatTerm(coeffA, denEqu, "x^2", true) + formatTerm(coeffB, denEqu, "x", false) + formatTerm(coeffC, denEqu, "", false) + " = 0";
            let solLines = [`\\text{Given equation: } ${exprStr}`];

            if (denEqu > 1) {
                solLines.push(`\\text{Multiply all terms by the denominator } ${denEqu} \\text{ to clear fractions:}`);
                let clearedStr = formatTerm(coeffA, 1, "x^2", true) + formatTerm(coeffB, 1, "x", false) + formatTerm(coeffC, 1, "", false) + " = 0";
                solLines.push(`${clearedStr}`);
            }

            let splitStr = formatTerm(coeffA, 1, "x^2", true) + formatTerm(p * s, 1, "x", false) + formatTerm(q * r, 1, "x", false) + formatTerm(coeffC, 1, "", false);
            solLines.push(`\\text{Factor by splitting the middle term (AC grouping method):}`);
            solLines.push(`${splitStr} = 0`);

            let g1 = Math.abs(gcd(coeffA, p * s));
            let remP = coeffA / g1; let remQ = (p * s) / g1;
            let g2 = (q * r) / remP;
            let g1Str = g1 === 1 ? "x" : `${g1}x`;
            let g2Sign = g2 > 0 ? " + " : " - ";
            let g2Val = Math.abs(g2) === 1 ? "" : `${Math.abs(g2)}`;
            let insidePar = `${formatTerm(remP, 1, "x", true)}${formatTerm(remQ, 1, "", false)}`;

            solLines.push(`${g1Str}\\left(${insidePar}\\right)${g2Sign}${g2Val}\\left(${insidePar}\\right) = 0`);
            solLines.push(`\\left(${formatTerm(p, 1, "x", true)}${formatTerm(q, 1, "", false)}\\right)\\left(${formatTerm(r, 1, "x", true)}${formatTerm(s, 1, "", false)}\\right) = 0`);

            let root1 = formatFrac(-q, p);
            let root2 = formatFrac(-s, r);
            solLines.push(`\\text{Set each linear factor to zero to obtain the final roots:}`);
            solLines.push(`x = ${root1}, \\quad x = ${root2}`);

            return {
                expr: `\\begin{aligned}&\\text{Solve equation: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= x = ${root1}, \\quad x = ${root2}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Linear Inequalities (ax + b > c, ax + b < c, ax + b ≥ c, ax + b ≤ c)
        (a, b, c, d) => {
            let valA = a !== 0 ? a : 2;
            let valB = b;
            let valC = c;
            
            // If valA is positive, make it negative roughly 50% of the time based on b
            if (valA > 0 && Math.abs(b) % 2 === 0) {
                valA = -valA;
            }

            let variant = Math.abs(d) % 3; // 0 = Integers, 1 = Fractional Coefficient, 2 = Fractional Constant

            let numA = valA, denA = 1;
            let numB = valB, denB = 1;
            let numC = valC, denC = 1;

            const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
            const lcm = (x, y) => (x * y) / gcd(x, y);

            if (variant === 1) {
                denA = (Math.abs(c) % 3) + 2;
                let g = gcd(numA, denA); numA /= g; denA /= g;
            } else if (variant === 2) {
                denB = (Math.abs(a) % 2) + 2;
                let gB = gcd(numB, denB); numB /= gB; denB /= gB;
                denC = (Math.abs(b) % 2) + 2;
                let gC = gcd(numC, denC); numC /= gC; denC /= gC;
            }

            const ops = [">", "<", "\\ge", "\\le"];
            const flippedOps = ["<", ">", "\\le", "\\ge"];
            const opIdx = Math.abs(d) % 4;
            const op = ops[opIdx];

            const formatFrac = (num, den) => {
                if (num === 0) return "0";
                let isNeg = (num < 0) ^ (den < 0);
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                if (d === 1) return isNeg ? `-${n}` : `${n}`;
                return isNeg ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
            };

            const formatTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                let isNeg = (num < 0) ^ (den < 0);
                let sign = isNeg ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                let valStr = d === 1 ? ((n === 1 && literal !== "") ? "" : `${n}`) : `\\frac{${n}}{${d}}`;
                return `${sign}${valStr}${literal}`;
            };

            let exprStr = formatTerm(numA, denA, "x", true) + formatTerm(numB, denB, "", false) + ` ${op} ` + formatFrac(numC, denC);
            let solLines = [`\\text{Given inequality: } ${exprStr}`];

            let lcd = lcm(lcm(denA, denB), denC);
            let intA = (numA * lcd) / denA;
            let intB = (numB * lcd) / denB;
            let intC = (numC * lcd) / denC;

            if (lcd > 1) {
                solLines.push(`\\text{Multiply all terms by the LCD, which is } ${lcd}, \\text{ to clear fractions:}`);
                let clearedStr = formatTerm(intA, 1, "x", true) + formatTerm(intB, 1, "", false) + ` ${op} ` + formatFrac(intC, 1);
                solLines.push(`${clearedStr}`);
            }

            let currentRHS = intC;
            let currentLHSStr = formatTerm(intA, 1, "x", true);

            if (intB !== 0) {
                let opWord = intB > 0 ? "\\text{Subtract }" : "\\text{Add }";
                let absB = Math.abs(intB);
                solLines.push(`${opWord} ${absB} \\text{ from both sides to isolate the } x \\text{ term:}`);
                solLines.push(`${currentLHSStr} ${op} ${intC} ${intB > 0 ? "-" : "+"} ${absB}`);
                currentRHS = intC - intB;
                solLines.push(`${currentLHSStr} ${op} ${currentRHS}`);
            }

            const finalOp = intA < 0 ? flippedOps[opIdx] : op;
            if (intA !== 1) {
                if (intA === -1) {
                    solLines.push(`\\text{Multiply or divide both sides by }-1\\text{ and reverse the inequality sign:}`);
                } else {
                    solLines.push(intA < 0 ? `\\text{Divide both sides by } ${intA} \\text{ and reverse the inequality sign:}` : `\\text{Divide both sides by } ${intA}:`);
                    solLines.push(`x ${finalOp} \\frac{${currentRHS}}{${intA}}`);
                }
            }

            let finalAns = formatFrac(currentRHS, intA);
            solLines.push(`\\text{Final Solution: } x ${finalOp} ${finalAns}`);

            return {
                expr: `\\begin{aligned}&\\text{Solve inequality: } \\\\ & \\quad ${exprStr} \\end{aligned}`,
                ans: `= x ${finalOp} ${finalAns}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        }
    ],
    med: [
        //# Family: Solving Quadratic Equations by the Quadratic Formula (ax^2 + bx + c = 0)
        (a, b, c, d) => {
            // Generate base value for A
            let A = (Math.abs(a) % 5) + 2;
            
            // FIX: Forces A to be negative roughly 50% of the time if your 
            // parameter generator only passes positive numbers (whenever 'a' is even)
            if (a < 0 || Math.abs(a) % 2 === 0) {
                A = -A;
            }

            // Give each denominator a distinct range and offset so they are highly varied
            let denA = (Math.abs(a) % 4) + 2;       // Range: 2 to 5
            let denB = (Math.abs(b + 2) % 4) + 2;   // Range: 2 to 5 (shifted)
            let denC = (Math.abs(c + 1) % 5) + 2;   // Range: 2 to 6

            // Generate numerator B (can naturally be negative if parameter b is negative)
            let B = b % 7; if (B === 0) B = -3;     // Range: -6 to 6 (excluding 0)

            let discVariant = Math.abs(d) % 2; // 0 = Real Roots, 1 = Complex Roots
            let C;

            // Dynamically balance C based on the SIGN of A to guarantee real/complex choices
            if (discVariant === 0) {
                // Real roots: force A and C to have opposite signs so -4ac is always positive
                let absC = (Math.abs(c) % 6) + 1;
                C = A > 0 ? -absC : absC;
            } else {
                // Complex roots: force the discriminant to be negative based on A's sign direction
                let boundC = (B * B * denA * denC) / (4 * A * denB * denB);
                if (A > 0) {
                    C = Math.floor(boundC) + (Math.abs(c) % 4) + 1;
                } else {
                    C = Math.ceil(boundC) - (Math.abs(c) % 4) - 1;
                }
            }

            const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
            const lcm = (x, y) => (x * y) / gcd(x, y);

            // Reduce all fractions immediately to clean up terms like 4/2 or 3/3
            let gA = gcd(Math.abs(A), denA); A /= gA; denA /= gA;
            let gB = gcd(Math.abs(B), denB); B /= gB; denB /= gB;
            let gC = gcd(Math.abs(C), denC); C /= gC; denC /= gC;

            const formatFrac = (num, den) => {
                if (num === 0) return "0";
                let isNeg = (num < 0) ^ (den < 0);
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                if (d === 1) return isNeg ? `-${n}` : `${n}`;
                return isNeg ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
            };

            const formatTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                let isNeg = (num < 0) ^ (den < 0);
                let sign = isNeg ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                let valStr = d === 1 ? ((n === 1 && literal !== "") ? "" : `${n}`) : `\\frac{${n}}{${d}}`;
                return `${sign}${valStr}${literal}`;
            };

            let exprStr = formatTerm(A, denA, "x^2", true) + formatTerm(B, denB, "x", false) + formatTerm(C, denC, "", false) + " = 0";
            let solLines = [`\\text{Given equation: } ${exprStr}`];

            let lcd = lcm(lcm(denA, denB), denC);
            let intA = (A * lcd) / denA;
            let intB = (B * lcd) / denB;
            let intC = (C * lcd) / denC;

            if (lcd > 1) {
                solLines.push(`\\text{Multiply across by the LCD, } ${lcd}, \\text{ to clear fractional coefficients:}`);
                let clearedStr = formatTerm(intA, 1, "x^2", true) + formatTerm(intB, 1, "x", false) + formatTerm(intC, 1, "", false) + " = 0";
                solLines.push(`${clearedStr}`);
            }

            solLines.push(`\\text{Identify coefficients: } a = ${intA}, \\, b = ${intB}, \\, c = ${intC}`);
            let disc = intB * intB - 4 * intA * intC;
            let absDisc = Math.abs(disc);
            let isComplex = disc < 0;
            solLines.push(`\\text{Calculate discriminant } \\Delta = b^2 - 4ac = (${intB})^2 - 4(${intA})(${intC}) = ${disc}`);

            const insulateConstant = (val) => Math.abs(val) === 1 ? `{${val}}` : `${val}`;
            let initialBStr = insulateConstant(-intB);
            let sqrtVal = Math.sqrt(absDisc);
            let isSquare = Number.isInteger(sqrtVal);
            let ansStr = "";

            if (isSquare && !isComplex) {
                let num1 = -intB + sqrtVal, num2 = -intB - sqrtVal, den = 2 * intA;
                let r1 = formatFrac(num1, den), r2 = formatFrac(num2, den);
                ansStr = r1 === r2 ? `x = ${r1}` : `x = ${r1}, \\quad x = ${r2}`;
                solLines.push(`x = \\frac{-(${intB}) \\pm \\sqrt{${disc}}}{2(${intA})} = \\frac{${initialBStr} \\pm ${sqrtVal}}{${den}}`);
            } else if (isSquare && isComplex) {
                let pureDen = 2 * intA;
                let g = gcd(gcd(Math.abs(intB), sqrtVal), Math.abs(pureDen));
                let finalB = -intB / g, finalI = sqrtVal / g, finalDen = pureDen / g;
                if (finalDen < 0) { finalB = -finalB; finalDen = -finalDen; }
                
                let iTerm = finalI === 1 ? "i" : `${finalI}i`;
                let bStr = finalB === 0 ? "" : insulateConstant(finalB);
                ansStr = `x = ` + (finalDen === 1 ? (finalB === 0 ? `\\pm ${iTerm}` : `${bStr} \\pm ${iTerm}`) : (finalB === 0 ? `\\frac{\\pm ${iTerm}}{${finalDen}}` : `\\frac{${bStr} \\pm ${iTerm}}{${finalDen}}`));
                solLines.push(`x = \\frac{-(${intB}) \\pm \\sqrt{${absDisc}}i}{2(${intA})} = \\frac{${initialBStr} \\pm ${sqrtVal}i}{${2 * intA}}`);
            } else {
                let outside = 1, inside = absDisc;
                for (let i = Math.floor(Math.sqrt(absDisc)); i >= 2; i--) {
                    if (absDisc % (i * i) === 0) { outside = i; inside = absDisc / (i * i); break; }
                }
                let pureDen = 2 * intA;
                let g = gcd(gcd(Math.abs(intB), outside), Math.abs(pureDen));
                let finalB = -intB / g, finalOutside = outside / g, finalDen = pureDen / g;
                if (finalDen < 0) { finalB = -finalB; finalDen = -finalDen; }
                
                let radPart = finalOutside === 1 ? `\\sqrt{${inside}}` : `${finalOutside}\\sqrt{${inside}}`;
                let suffix = isComplex ? `${radPart}i` : radPart;
                let bStr = finalB === 0 ? "" : insulateConstant(finalB);
                ansStr = `x = ` + (finalDen === 1 ? (finalB === 0 ? `\\pm ${suffix}` : `${bStr} \\pm ${suffix}`) : (finalB === 0 ? `\\frac{\\pm ${suffix}}{${finalDen}}` : `\\frac{${bStr} \\pm ${suffix}}{${finalDen}}`));
                
                solLines.push(`x = \\frac{-(${intB}) \\pm ${isComplex ? `\\sqrt{${absDisc}}i` : `\\sqrt{${disc}}`}}{2(${intA})}`);
                if (outside > 1) solLines.push(`\\text{Simplify radical: } x = \\frac{${initialBStr} \\pm ${outside}\\sqrt{${inside}}${isComplex ? 'i' : ''}}{${2 * intA}}`);
            }

            solLines.push(`\\text{Final Roots: } ${ansStr}`);

            return {
                expr: `\\begin{aligned}&\\text{Solve equation: }\\\\ & ${  exprStr}\\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Quadratic Inequalities (ax^2 + bx + c > 0, ax^2 + bx + c < 0, ax^2 + bx + c ≥ 0, ax^2 + bx + c ≤ 0)
        (a, b, c, d) => {
            // Generate base value for A (can be negative roughly 50% of the time)
            let A = (Math.abs(a) % 5) + 2;
            if (a < 0 || Math.abs(a) % 2 === 0) {
                A = -A;
            }

            // Select initial inequality operator: 0: '>', 1: '<', 2: '>=', 3: '<='
            let opIdx = Math.abs(d) % 4;
            let ops = [">", "<", "\\ge", "\\le"];
            let op = ops[opIdx];

            // Give each denominator a distinct starting range
            let denA = (Math.abs(a) % 4) + 2;       
            let denB = (Math.abs(b + 2) % 4) + 2;   
            let denC;

            // Generate numerator B
            let B = b % 7; if (B === 0) B = -3;     

            // 0 = Two Real Roots (Δ > 0)
            // 1 = One Repeated Root (Δ = 0, general interval solutions)
            // 2 = One Repeated Root (Δ = 0, FORCED to have exactly one real number solution)
            // 3 = Complex Roots (Δ < 0)
            let discVariant = Math.abs(d) % 4; 
            let C;

            if (discVariant === 0) {
                // Real distinct roots: force A and C to have opposite signs
                denC = (Math.abs(c + 1) % 5) + 2;
                let absC = (Math.abs(c) % 6) + 1;
                C = A > 0 ? -absC : absC;
            } else if (discVariant === 1 || discVariant === 2) {
                // Repeated root: exact backward calculation to lock Δ completely to 0
                let numC_raw = B * B * denA;
                let denC_raw = 4 * A * denB * denB;
                
                const internalGcd = (x, y) => y === 0 ? Math.abs(x) : internalGcd(y, x % y);
                let gC_raw = internalGcd(Math.abs(numC_raw), Math.abs(denC_raw));
                C = numC_raw / gC_raw;
                denC = denC_raw / gC_raw;
                if (denC < 0) { C = -C; denC = -denC; }

                // Force the matching operator to guarantee exactly ONE real number solution
                if (discVariant === 2) {
                    if (A > 0) {
                        opIdx = 3; // Forces '<=' so the solution is just the vertex point
                        op = "\\le";
                    } else {
                        opIdx = 2; // Forces '>=' so the solution is just the vertex point
                        op = "\\ge";
                    }
                }
            } else {
                // Complex roots: calculate minimum boundaries required to push Δ under 0
                denC = (Math.abs(c + 1) % 5) + 2;
                let minC = (B * B * denA * denC) / (4 * A * denB * denB);
                if (A > 0) {
                    C = Math.floor(minC) + (Math.abs(c) % 3) + 2;
                } else {
                    C = Math.ceil(minC) - (Math.abs(c) % 3) - 2;
                }
            }

            const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);
            const lcm = (x, y) => (x * y) / gcd(x, y);

            // Reduce all fraction layouts immediately
            let gA = gcd(Math.abs(A), denA); A /= gA; denA /= gA;
            let gB = gcd(Math.abs(B), denB); B /= gB; denB /= gB;
            let gC = gcd(Math.abs(C), denC); C /= gC; denC /= gC;

            const formatFrac = (num, den) => {
                if (num === 0) return "0";
                let isNeg = (num < 0) ^ (den < 0);
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                if (d === 1) return isNeg ? `-${n}` : `${n}`;
                return isNeg ? `-\\frac{${n}}{${d}}` : `\\frac{${n}}{${d}}`;
            };

            const formatTerm = (num, den, literal, isFirst) => {
                if (num === 0) return "";
                let isNeg = (num < 0) ^ (den < 0);
                let sign = isNeg ? (isFirst ? "-" : " - ") : (isFirst ? "" : " + ");
                let n = Math.abs(num), d = Math.abs(den);
                let g = gcd(n, d); n /= g; d /= g;
                let valStr = d === 1 ? ((n === 1 && literal !== "") ? "" : `${n}`) : `\\frac{${n}}{${d}}`;
                return `${sign}${valStr}${literal}`;
            };

            let exprStr = formatTerm(A, denA, "x^2", true) + formatTerm(B, denB, "x", false) + formatTerm(C, denC, "", false) + ` ${op} 0`;
            let solLines = [`\\text{Given inequality: } ${exprStr}`];

            // Handle LCD clearing calculations
            let lcd = lcm(lcm(denA, denB), denC);
            let intA = (A * lcd) / denA;
            let intB = (B * lcd) / denB;
            let intC = (C * lcd) / denC;

            if (lcd > 1) {
                solLines.push(`\\text{Multiply across by the LCD, } ${lcd}, \\text{ to clear fractions:}`);
                let clearedStr = formatTerm(intA, 1, "x^2", true) + formatTerm(intB, 1, "x", false) + formatTerm(intC, 1, "", false) + ` ${op} 0`;
                solLines.push(`${clearedStr}`);
            }

            solLines.push(`\\text{Find critical values from: } ${formatTerm(intA, 1, "x^2", true) + formatTerm(intB, 1, "x", false) + formatTerm(intC, 1, "", false)} = 0`);
            
            let disc = intB * intB - 4 * intA * intC;
            let absDisc = Math.abs(disc);
            solLines.push(`\\text{Calculate discriminant: } \\Delta = b^2 - 4ac = (${intB})^2 - 4(${intA})(${intC}) = ${disc}`);

            let x1Str = "", x2Str = "";
            let tableStr = "";
            let ansStr = "";

            // Custom table layout style rules
            const macroSetup = "\\newcommand{\\vr}[1]{\\rule{0.4pt}{#1ex}} \\def\\arraystretch{0.6} ";

            if (disc > 0) {
                // Two distinct real roots branch
                let outside = 1, inside = absDisc;
                for (let i = Math.floor(Math.sqrt(absDisc)); i >= 2; i--) {
                    if (absDisc % (i * i) === 0) { outside = i; inside = absDisc / (i * i); break; }
                }

                let pureDen = 2 * intA;
                let g = gcd(gcd(Math.abs(intB), outside), Math.abs(pureDen));
                let finalB = -intB / g, finalOutside = outside / g, finalDen = pureDen / g;
                if (finalDen < 0) { finalB = -finalB; finalDen = -finalDen; }

                const formatSingleRoot = (fb, sign, fo, ins, fd) => {
                    if (ins === 1) return formatFrac(fb + sign * fo, fd);
                    let radStr = fo === 1 ? `\\sqrt{${ins}}` : `${fo}\\sqrt{${ins}}`;
                    let numStr = fb === 0 ? (sign === 1 ? radStr : `-${radStr}`) : (sign === 1 ? `${fb} + ${radStr}` : `${fb} - ${radStr}`);
                    if (fd === 1) return numStr;
                    return `\\frac{${numStr}}{${fd}}`;
                };

                let valMinus = (finalB - finalOutside * Math.sqrt(inside)) / finalDen;
                let valPlus = (finalB + finalOutside * Math.sqrt(inside)) / finalDen;

                if (valMinus < valPlus) {
                    x1Str = formatSingleRoot(finalB, -1, finalOutside, inside, finalDen);
                    x2Str = formatSingleRoot(finalB, 1, finalOutside, inside, finalDen);
                } else {
                    x1Str = formatSingleRoot(finalB, 1, finalOutside, inside, finalDen);
                    x2Str = formatSingleRoot(finalB, -1, finalOutside, inside, finalDen);
                }

                solLines.push(`\\text{Critical Roots: } x_1 = ${x1Str}, \\quad x_2 = ${x2Str}`);
                solLines.push(`\\text{Construct sign table:}`);

                let signLeft = intA > 0 ? "+" : "-";
                let signMid = intA > 0 ? "-" : "+";
                let signRight = intA > 0 ? "+" : "-";

                tableStr = macroSetup + 
                    `\\begin{array}{c|lcccccr}` +
                    `x & -\\infty & & ${x1Str} & & ${x2Str} & & +\\infty \\\\` +
                    `\\hline` +
                    ` & & & \\vr{1.6} & & \\vr{1.6} & & \\\\` +
                    `f(x) & & ${signLeft} & 0 & ${signMid} & 0 & ${signRight} & \\\\` +
                    ` & & & \\vr{1.6} & & \\vr{1.6} & & \\\\` +
                    `\\end{array}`;

                if (opIdx === 0) ansStr = intA > 0 ? `x \\in (-\\infty, ${x1Str}) \\cup (${x2Str}, \\infty)` : `x \\in (${x1Str}, ${x2Str})`;
                if (opIdx === 1) ansStr = intA > 0 ? `x \\in (${x1Str}, ${x2Str})` : `x \\in (-\\infty, ${x1Str}) \\cup (${x2Str}, \\infty)`;
                if (opIdx === 2) ansStr = intA > 0 ? `x \\in (-\\infty, ${x1Str}] \\cup [${x2Str}, \\infty)` : `x \\in [${x1Str}, ${x2Str}]`;
                if (opIdx === 3) ansStr = intA > 0 ? `x \\in [${x1Str}, ${x2Str}]` : `x \\in (-\\infty, ${x1Str}] \\cup [${x2Str}, \\infty)`;

            } else if (disc === 0) {
                // One repeated root branch
                let pureDen = 2 * intA;
                let g = gcd(Math.abs(intB), Math.abs(pureDen));
                let finalB = -intB / g, finalDen = pureDen / g;
                if (finalDen < 0) { finalB = -finalB; finalDen = -finalDen; }
                x1Str = formatFrac(finalB, finalDen);

                solLines.push(`\\text{Critical Root (repeated): } x_1 = ${x1Str}`);
                solLines.push(`\\text{Construct sign table:}`);

                let signSide = intA > 0 ? "+" : "-";
                
                tableStr = macroSetup + 
                    `\\begin{array}{c|lcccr}` +
                    `x & -\\infty & & ${x1Str} & & +\\infty \\\\` +
                    `\\hline` +
                    ` & & & \\vr{1.6} & & \\\\` +
                    `f(x) & & ${signSide} & 0 & ${signSide} & \\\\` +
                    ` & & & \\vr{1.6} & & \\\\` +
                    `\\end{array}`;

                if (opIdx === 0) ansStr = intA > 0 ? `x \\in (-\\infty, ${x1Str}) \\cup (${x1Str}, \\infty)` : `\\emptyset`;
                if (opIdx === 1) ansStr = intA > 0 ? `\\emptyset` : `x \\in (-\\infty, ${x1Str}) \\cup (${x1Str}, \\infty)`;
                if (opIdx === 2) ansStr = intA > 0 ? `\\mathbb{R}` : `x \\in \\{${x1Str}\\}`;
                if (opIdx === 3) ansStr = intA > 0 ? `x \\in \\{${x1Str}\\}` : `\\mathbb{R}`;

            } else {
                // No real roots branch
                solLines.push(`\\text{Since } \\Delta < 0, \\text{ there are no real critical values. } f(x) \\text{ holds a constant sign.}`);
                solLines.push(`\\text{Construct sign table:}`);

                let signAll = intA > 0 ? "+" : "-";
                
                tableStr = macroSetup + 
                    `\\begin{array}{c|lcr}` +
                    `x & -\\infty & & +\\infty \\\\` +
                    `\\hline` +
                    ` & & & \\\\` +
                    `f(x) & & ${signAll} & \\\\` +
                    ` & & & \\\\` +
                    `\\end{array}`;

                if (opIdx === 0) ansStr = intA > 0 ? `\\mathbb{R}` : `\\emptyset`;
                if (opIdx === 1) ansStr = intA > 0 ? `\\emptyset` : `\\mathbb{R}`;
                if (opIdx === 2) ansStr = intA > 0 ? `\\mathbb{R}` : `\\emptyset`;
                if (opIdx === 3) ansStr = intA > 0 ? `\\emptyset` : `\\mathbb{R}`;
            }
            
            solLines.push(tableStr);
            solLines.push(`\\text{Final Solution Set: } ${ansStr}`);

            return {
                expr: `\\begin{aligned} &\\text{Solve inequality: } \\\\ &\\quad ${exprStr}\\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Rational Inequalities (f(x)/g(x) > 0, f(x)/g(x) < 0, f(x)/g(x) ≥ 0, f(x)/g(x) ≤ 0)
        (a, b, c, d) => {
            // 1. Generate strictly distinct root ranges to guarantee clean intervals
            let r1 = (Math.abs(a) % 3) - 4; // Ranges from -4 to -2
            let r2 = (Math.abs(b) % 2) - 1; // Ranges from -1 to 0
            let r3 = (Math.abs(c) % 2) + 1; // Ranges from 1 to 2
            let r4 = (Math.abs(d) % 3) + 3; // Ranges from 3 to 5

            // 2. Select inequality layout mode based on seed
            let mode = Math.abs(a + b + c + d) % 3;
            
            let numRoots, denRoots;
            if (mode === 0) {
                // Quadratic over Linear (3 roots)
                numRoots = [r1, r3];
                denRoots = [r2];
            } else if (mode === 1) {
                // Quadratic over Quadratic (4 roots)
                numRoots = [r1, r4];
                denRoots = [r2, r3];
            } else {
                // Linear over Quadratic (3 roots)
                numRoots = [r2];
                denRoots = [r1, r3];
            }

            // 3. Establish leading coefficients (allow negative possibilities for both)
            let A = (Math.abs(a) % 3) + 1;
            if (a < 0 || Math.abs(c) % 2 === 0) A = -A;
            
            let P = (Math.abs(b) % 3) + 1;
            if (b < 0 || Math.abs(d) % 2 === 0) P = -P;

            // 4. Helper to expand roots into standard form polynomial coefficients [x^2, x, const]
            const getCoeffs = (roots, lead) => {
                if (roots.length === 1) {
                    return [0, lead, -lead * roots[0]];
                }
                if (roots.length === 2) {
                    return [lead, -lead * (roots[0] + roots[1]), lead * roots[0] * roots[1]];
                }
            };

            let numCoeffs = getCoeffs(numRoots, A);
            let denCoeffs = getCoeffs(denRoots, P);

            const formatPoly = (coeffs) => {
                let [c2, c1, c0] = coeffs;
                let terms = [];
                if (c2 !== 0) {
                    if (c2 === 1) terms.push("x^2");
                    else if (c2 === -1) terms.push("-x^2");
                    else terms.push(`${c2}x^2`);
                }
                if (c1 !== 0) {
                    let absC1 = Math.abs(c1);
                    let val = absC1 === 1 ? "x" : `${absC1}x`;
                    if (c1 > 0) terms.push(terms.length > 0 ? `+ ${val}` : val);
                    else terms.push(terms.length > 0 ? `- ${val}` : `-${val}`);
                }
                if (c0 !== 0) {
                    let absC0 = Math.abs(c0);
                    if (c0 > 0) terms.push(terms.length > 0 ? `+ ${absC0}` : `${absC0}`);
                    else terms.push(terms.length > 0 ? `- ${absC0}` : `-${absC0}`);
                }
                return terms.join(" ") || "0";
            };

            let numStr = formatPoly(numCoeffs);
            let denStr = formatPoly(denCoeffs);

            // Select operator
            let opIdx = Math.abs(c) % 4;
            let ops = [">", "<", "\\ge", "\\le"];
            let op = ops[opIdx];

            let exprStr = `\\frac{${numStr}}{${denStr}} ${op} 0`;
            let solLines = [`\\text{Given inequality: } ${exprStr}`];

            // 5. Track down and sort all critical points
            let crits = [];
            numRoots.forEach(r => crits.push({ val: r, type: 'num' }));
            denRoots.forEach(r => crits.push({ val: r, type: 'den' }));
            crits.sort((m, n) => m.val - n.val);

            solLines.push(`\\text{Find critical values by setting the numerator and denominator to 0:}`);
            solLines.push(`\\text{From Numerator: } ${numRoots.map(r => `x = ${r}`).join(", \\quad ")}`);
            solLines.push(`\\text{From Denominator (Undefined Restrictions): } ${denRoots.map(r => `x = ${r}`).join(", \\quad ")}`);

            // 6. Calculate precise signs across all intervals
            const evalP = (x, c) => c[0] * x * x + c[1] * x + c[2];
            const signF = (x) => evalP(x, numCoeffs) > 0 ? "+" : "-";
            const signG = (x) => evalP(x, denCoeffs) > 0 ? "+" : "-";
            const signT = (x) => (evalP(x, numCoeffs) / evalP(x, denCoeffs)) > 0 ? "+" : "-";

            let N = crits.length;
            let mids = [crits[0].val - 1];
            for (let i = 0; i < N - 1; i++) {
                mids.push((crits[i].val + crits[i + 1].val) / 2);
            }
            mids.push(crits[N - 1].val + 1);

            let fSigns = mids.map(signF);
            let gSigns = mids.map(signG);
            let tSigns = mids.map(signT);

            // 7. Dynamic layout array builder for the LaTeX table
            let colsX = ["x", "-\\infty"];
            let colsTicks = ["", ""];
            let colsF = ["f(x)", ""];
            let colsG = ["g(x)", ""];
            let colsTtop = ["", ""];
            let colsTmid = ["\\dfrac{f(x)}{g(x)}", ""];
            let colsTbot = ["", ""];

            for (let i = 0; i < N; i++) {
                // Spacing interval for signs BEFORE the critical point
                colsX.push(""); colsTicks.push("");
                colsF.push(fSigns[i]); colsG.push(gSigns[i]);
                colsTtop.push(""); colsTmid.push(tSigns[i]); colsTbot.push("");

                // Data mapping perfectly on top of the critical point barrier
                colsX.push(crits[i].val.toString());
                colsTicks.push("\\vr{1.6}");
                colsF.push(crits[i].type === 'num' ? "0" : "\\vr{1.6}");
                colsG.push(crits[i].type === 'den' ? "0" : "\\vr{1.6}");
                colsTtop.push(crits[i].type === 'den' ? "\\vr{1.6}\\,\\vr{1.6}" : "\\vr{1.6}");
                colsTmid.push(crits[i].type === 'den' ? "\\smash{\\vr{4}\\,\\vr{4}}" : "0");
                colsTbot.push(crits[i].type === 'den' ? "\\smash{\\vr{4}\\,\\vr{4}}" : "\\vr{1.6}");
            }

            // Spacing interval for final signs AFTER the last critical point
            colsX.push(""); colsTicks.push("");
            colsF.push(fSigns[N]); colsG.push(gSigns[N]);
            colsTtop.push(""); colsTmid.push(tSigns[N]); colsTbot.push("");

            // Infinity column mapping
            colsX.push("+\\infty"); colsTicks.push("");
            colsF.push(""); colsG.push("");
            colsTtop.push(""); colsTmid.push(""); colsTbot.push("");

            let alignStr = "c|l" + "c".repeat(2 * N + 1) + "r";
            const macroSetup = "\\newcommand{\\vr}[1]{\\rule{0.4pt}{#1ex}} \\def\\arraystretch{0.6} ";

            let tableStr = macroSetup + 
                `\\begin{array}{${alignStr}}\n` +
                `${colsX.join(" & ")} \\\\\n\\hline\n` +
                `${colsTicks.join(" & ")} \\\\\n` +
                `${colsF.join(" & ")} \\\\\n` +
                `${colsTicks.join(" & ")} \\\\\n\\hline\n` +
                `${colsTicks.join(" & ")} \\\\\n` +
                `${colsG.join(" & ")} \\\\\n` +
                `${colsTicks.join(" & ")} \\\\\n\\hline\n` +
                `${colsTtop.join(" & ")} \\\\\n` +
                `${colsTmid.join(" & ")} \\\\\n` +
                `${colsTbot.join(" & ")} \\\\\n` +
                `\\end{array}`;

            solLines.push(`\\text{Construct the rational sign table:}`);
            solLines.push(tableStr);

            // 8. Extract the valid mathematical intervals based on operator and component limits
            let matchingIntervals = [];
            const getBracket = (critIdx, side) => {
                if (opIdx === 0 || opIdx === 1) return side === 'left' ? '(' : ')';
                if (crits[critIdx].type === 'den') return side === 'left' ? '(' : ')';
                return side === 'left' ? '[' : ']';
            };

            let target = (opIdx === 0 || opIdx === 2) ? "+" : "-";

            for (let i = 0; i <= N; i++) {
                if (tSigns[i] === target) {
                    if (i === 0) {
                        matchingIntervals.push(`(-\\infty, ${crits[0].val}${getBracket(0, 'right')}`);
                    } else if (i === N) {
                        matchingIntervals.push(`${getBracket(N - 1, 'left')}${crits[N - 1].val}, +\\infty)`);
                    } else {
                        matchingIntervals.push(`${getBracket(i - 1, 'left')}${crits[i - 1].val}, ${crits[i].val}${getBracket(i, 'right')}`);
                    }
                }
            }

            let ansStr = matchingIntervals.length > 0 ? `x \\in ${matchingIntervals.join(" \\cup ")}` : `\\emptyset`;
            solLines.push(`\\text{Final Solution Set: } ${ansStr}`);

            return {
                expr: `\\begin{aligned}&\\text{Solve inequality: }\\\\ & \\quad ${exprStr}\\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        // # Family: Systems of Quadratic Inequalities (f(x) > 0, g(x) < 0, f(x) ≥ 0, g(x) ≤ 0)
        (a, b, c, d) => {
            // 1. Generate strictly distinct root ranges to guarantee clean intervals and no overlaps
            let roots = [
                (Math.abs(a) % 3) - 4, // Ranges from -4 to -2
                (Math.abs(b) % 2) - 1, // Ranges from -1 to 0
                (Math.abs(c) % 2) + 1, // Ranges from 1 to 2
                (Math.abs(d) % 3) + 3  // Ranges from 3 to 5
            ];
            
            // Assign alternating roots to f(x) and g(x) to intertwine their critical points
            let fRoots = [roots[0], roots[2]];
            let gRoots = [roots[1], roots[3]];

            // 2. Establish leading coefficients (allow negative possibilities)
            let A = (Math.abs(a) % 3) + 1;
            if (a < 0 || Math.abs(c) % 2 === 0) A = -A;
            
            let P = (Math.abs(b) % 3) + 1;
            if (b < 0 || Math.abs(d) % 2 === 0) P = -P;

            // 3. Helper to expand roots into standard form polynomial coefficients [x^2, x, const]
            const getCoeffs = (rs, lead) => [lead, -lead * (rs[0] + rs[1]), lead * rs[0] * rs[1]];

            let fCoeffs = getCoeffs(fRoots, A);
            let gCoeffs = getCoeffs(gRoots, P);

            const formatPoly = (coeffs) => {
                let [c2, c1, c0] = coeffs;
                let terms = [];
                if (c2 !== 0) {
                    if (c2 === 1) terms.push("x^2");
                    else if (c2 === -1) terms.push("-x^2");
                    else terms.push(`${c2}x^2`);
                }
                if (c1 !== 0) {
                    let absC1 = Math.abs(c1);
                    let val = absC1 === 1 ? "x" : `${absC1}x`;
                    if (c1 > 0) terms.push(terms.length > 0 ? `+ ${val}` : val);
                    else terms.push(terms.length > 0 ? `- ${val}` : `-${val}`);
                }
                if (c0 !== 0) {
                    let absC0 = Math.abs(c0);
                    if (c0 > 0) terms.push(terms.length > 0 ? `+ ${absC0}` : `${absC0}`);
                    else terms.push(terms.length > 0 ? `- ${absC0}` : `-${absC0}`);
                }
                return terms.join(" ") || "0";
            };

            let fStr = formatPoly(fCoeffs);
            let gStr = formatPoly(gCoeffs);

            // 4. Select inequality operators for the system
            let ops = [">", "<", "\\ge", "\\le"];
            let op1Idx = Math.abs(a + b) % 4;
            let op2Idx = Math.abs(c + d) % 4;
            
            let op1Str = ops[op1Idx];
            let op2Str = ops[op2Idx];

            let exprStr = `\\begin{cases} ${fStr} ${op1Str} 0 \\\\[4pt] ${gStr} ${op2Str} 0 \\end{cases}`;
            let solLines = [`\\text{Given the system of inequalities: } \\quad ${exprStr}`];

            solLines.push(`\\text{Let } f(x) = ${fStr} \\text{ and } g(x) = ${gStr}.`);
            solLines.push(`\\text{Set both polynomials to 0 to find critical values:}`);
            solLines.push(`f(x) = 0 \\implies x = ${fRoots[0]}, \\quad x = ${fRoots[1]}`);
            solLines.push(`g(x) = 0 \\implies x = ${gRoots[0]}, \\quad x = ${gRoots[1]}`);

            // 5. Sort critical points for table mapping
            let crits = [
                { val: fRoots[0], type: 'f' },
                { val: fRoots[1], type: 'f' },
                { val: gRoots[0], type: 'g' },
                { val: gRoots[1], type: 'g' }
            ].sort((m, n) => m.val - n.val);

            // 6. Calculate precise signs across all intervals
            const evalP = (x, cfs) => cfs[0] * x * x + cfs[1] * x + cfs[2];
            const signF = (x) => evalP(x, fCoeffs) > 0 ? "+" : "-";
            const signG = (x) => evalP(x, gCoeffs) > 0 ? "+" : "-";

            let N = crits.length;
            let mids = [crits[0].val - 1];
            for (let i = 0; i < N - 1; i++) {
                mids.push((crits[i].val + crits[i + 1].val) / 2);
            }
            mids.push(crits[N - 1].val + 1);

            let fSigns = mids.map(signF);
            let gSigns = mids.map(signG);

            // 7. Dynamic LaTeX table builder strictly respecting the visual layout
            let colsX = ["x", "-\\infty"];
            let colsTicks = ["", ""];
            let colsF = ["f(x)", ""];
            let colsG = ["g(x)", ""];

            for (let i = 0; i < N; i++) {
                // Spacing interval for signs BEFORE the critical point
                colsX.push(""); colsTicks.push("");
                colsF.push(fSigns[i]); colsG.push(gSigns[i]);

                // Data mapped exactly on top of the critical point barrier
                colsX.push(crits[i].val.toString());
                colsTicks.push("\\vr{1.6}");
                colsF.push(crits[i].type === 'f' ? "0" : "\\vr{1.6}");
                colsG.push(crits[i].type === 'g' ? "0" : "\\vr{1.6}");
            }

            // Spacing interval for final signs AFTER the last critical point
            colsX.push(""); colsTicks.push("");
            colsF.push(fSigns[N]); colsG.push(gSigns[N]);

            // Infinity column mapping
            colsX.push("+\\infty"); colsTicks.push("");
            colsF.push(""); colsG.push("");

            let alignStr = "c|l" + "c".repeat(2 * N + 1) + "r";
            const macroSetup = "\\newcommand{\\vr}[1]{\\rule{0.4pt}{#1ex}} \\def\\arraystretch{0.6} ";

            let tableStr = macroSetup + 
                `\\begin{array}{${alignStr}}\n` +
                `${colsX.join(" & ")} \\\\\n\\hline\n` +
                `${colsTicks.join(" & ")} \\\\\n` +
                `${colsF.join(" & ")} \\\\\n` +
                `${colsTicks.join(" & ")} \\\\\n\\hline\n` +
                `${colsTicks.join(" & ")} \\\\\n` +
                `${colsG.join(" & ")} \\\\\n` +
                `${colsTicks.join(" & ")} \\\\\n` +
                `\\end{array}`;

            solLines.push(`\\text{Construct a combined sign table for both functions:}`);
            solLines.push(tableStr);

            // 8. Analyze conditions systematically to find intersection sets
            const checkOp = (val, opIdx) => {
                if (opIdx === 0) return val > 0;
                if (opIdx === 1) return val < 0;
                if (opIdx === 2) return val >= 0;
                if (opIdx === 3) return val <= 0;
            };

            // Evaluate truth on the 9 discrete table segments (5 intervals, 4 points)
            let valid = [];
            for (let k = 0; k < 9; k++) {
                let x = (k % 2 === 0) ? mids[k / 2] : crits[Math.floor(k / 2)].val;
                
                let vF = evalP(x, fCoeffs);
                let vG = evalP(x, gCoeffs);
                
                // Force absolute zeroes at critical points to avoid JS float precision errors
                if (k % 2 !== 0) {
                    if (crits[Math.floor(k / 2)].type === 'f') vF = 0;
                    if (crits[Math.floor(k / 2)].type === 'g') vG = 0;
                }
                
                valid[k] = checkOp(vF, op1Idx) && checkOp(vG, op2Idx);
            }

            // 9. Extract and unify valid contiguous regions
            let intervals = [];
            let k = 0;
            while (k < 9) {
                if (valid[k]) {
                    let startIdx = k;
                    while (k < 9 && valid[k]) k++;
                    let endIdx = k - 1;
                    
                    let startBracket = "", endBracket = "";
                    let startVal = "", endVal = "";
                    
                    if (startIdx % 2 === 0) { 
                        startBracket = "(";
                        startVal = startIdx === 0 ? "-\\infty" : crits[startIdx / 2 - 1].val;
                    } else { 
                        startBracket = "[";
                        startVal = crits[Math.floor(startIdx / 2)].val;
                    }
                    
                    if (endIdx % 2 === 0) { 
                        endBracket = ")";
                        endVal = endIdx === 8 ? "+\\infty" : crits[endIdx / 2].val;
                    } else { 
                        endBracket = "]";
                        endVal = crits[Math.floor(endIdx / 2)].val;
                    }
                    
                    if (startIdx === endIdx && startIdx % 2 !== 0) {
                        intervals.push(`\\{${startVal}\\}`); // Single isolated point
                    } else {
                        intervals.push(`${startBracket}${startVal}, ${endVal}${endBracket}`);
                    }
                } else {
                    k++;
                }
            }

            let ansStr = intervals.length > 0 ? `x \\in ${intervals.join(" \\cup ")}` : `\\emptyset`;
            solLines.push(`\\text{Extract the intervals where BOTH inequalities are satisfied:}`);
            solLines.push(`\\text{Final Intersection Set: } ${ansStr}`);

            return {
                expr: `\\begin{aligned} &\\text{Solve the system of inequalities: } \\\\ &\\quad ${exprStr}\\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        // 
        (a, b, c, d) => {
            let valA = a !== 0 ? a : 2;
            let valB = b !== 0 ? b : -3;
            let mid = valA + valB;
            let last = valA * valB;
            
            let signA = valA > 0 ? `+ ${valA}` : `- ${Math.abs(valA)}`;
            let signB = valB > 0 ? `+ ${valB}` : `- ${Math.abs(valB)}`;
            
            let midStr = mid === 0 ? "" : mid === 1 ? " + x" : mid === -1 ? " - x" : mid > 0 ? ` + ${mid}x` : ` - ${Math.abs(mid)}x`;
            let lastStr = last > 0 ? ` + ${last}` : ` - ${Math.abs(last)}`;
            let ansStr = `x^2${midStr}${lastStr}`;
            
            return {
                expr: `\\begin{aligned}&\\text{Solve equation: } \\\\ & \\quad (x ${signA})(x ${signB}) \\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Expand via the FOIL method:} \\\\
                    &= x \\cdot x + x \\cdot (${valB}) + (${valA}) \\cdot x + (${valA}) \\cdot (${valB}) \\\\
                    &= x^2 ${valB > 0 ? '+ ' : '- '}${Math.abs(valB)}x ${valA > 0 ? '+ ' : '- '}${Math.abs(valA)}x ${last > 0 ? '+ ' : '- '}${Math.abs(last)} \\\\
                    &= ${ansStr}
                \\end{aligned}`
            };
        }
    ],
    hard: [
        
    ]
};
window.algebra = algebra;