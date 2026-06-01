
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
        },
        //# Family: Solving Systems of Linear Equations in Two Variables (ax + by = c, dx + ey = f)
        (a, b, c, d) => {
            // 1. Core fraction arithmetic helper functions
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const lcm = (m, n) => (Math.abs(m) * Math.abs(n)) / gcd(m, n);

            const makeFrac = (n, d = 1) => {
                if (d < 0) { n = -n; d = -d; }
                let g = gcd(n, d);
                return { num: n / g, den: d / g };
            };

            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const multFrac = (f1, f2) => makeFrac(f1.num * f2.num, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);

            // 2. Dynamic generation of 6 parameters (A, B, C, D, E, F) from the 4 seeds
            const getParam = (val, offset) => {
                let num = (Math.abs(val + offset) % 13) - 6; // Values range from -6 to 6
                if (num === 0) num = (offset % 2 === 0) ? 2 : -2; // Avoid zero coefficients
                
                // Mix of integers (denoted by 1) and small denominators for fractional variants
                let dens = [1, 1, 1, 2, 3, 4];
                let den = dens[Math.abs(val * offset) % dens.length];
                return makeFrac(num, den);
            };

            let fracA = getParam(a, 1);
            let fracB = getParam(b, 2);
            let fracC = getParam(c, 3);
            let fracD = getParam(d, 4);
            let fracE = getParam(a + b, 5);
            let fracF = getParam(c + d, 6);

            // 3. Validation safeguard: Ensure the lines are not parallel or overlapping (Det != 0)
            let det = subFrac(multFrac(fracA, fracE), multFrac(fracB, fracD));
            if (det.num === 0) {
                fracE = addFrac(fracE, makeFrac(1, 1));
                det = subFrac(multFrac(fracA, fracE), multFrac(fracB, fracD));
            }

            // 4. LaTeX formatting string builders
            const formatFracTerm = (f, variable, isFirst) => {
                if (f.num === 0) return "";
                let isNeg = f.num < 0;
                let absNum = Math.abs(f.num);
                let signStr = isFirst ? (isNeg ? "-" : "") : (isNeg ? "- " : "+ ");
                
                let termStr = "";
                if (f.den === 1) {
                    termStr = absNum === 1 ? variable : `${absNum}${variable}`;
                } else {
                    termStr = `\\frac{${absNum}}{${f.den}}${variable}`;
                }
                return signStr + termStr;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            let eq1 = `${formatFracTerm(fracA, 'x', true)} ${formatFracTerm(fracB, 'y', false)} = ${formatFracPure(fracC)}`;
            let eq2 = `${formatFracTerm(fracD, 'x', true)} ${formatFracTerm(fracE, 'y', false)} = ${formatFracPure(fracF)}`;
            let exprStr = `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`;

            let solLines = [`\\text{Given the system of equations:}`];
            solLines.push(`\\begin{cases} ${eq1} & \\text{(1)} \\\\ ${eq2} & \\text{(2)} \\end{cases}`);

            // 5. Normalization: Clear denominators to transition smoothly to standard integer setups
            let lcm1 = lcm(fracA.den, fracB.den); lcm1 = lcm(lcm1, fracC.den);
            let lcm2 = lcm(fracD.den, fracE.den); lcm2 = lcm(lcm2, fracF.den);

            let A_int = (fracA.num * lcm1) / fracA.den;
            let B_int = (fracB.num * lcm1) / fracB.den;
            let C_int = (fracC.num * lcm1) / fracC.den;

            let D_int = (fracD.num * lcm2) / fracD.den;
            let E_int = (fracE.num * lcm2) / fracE.den;
            let F_int = (fracF.num * lcm2) / fracF.den;

            const formatIntTerm = (coeff, variable, isFirst) => {
                if (coeff === 0) return "";
                let num = Math.abs(coeff);
                let numStr = num === 1 ? "" : num.toString();
                if (isFirst) {
                    return coeff < 0 ? `-${numStr}${variable}` : `${numStr}${variable}`;
                } else {
                    return coeff < 0 ? `- ${numStr}${variable}` : `+ ${numStr}${variable}`;
                }
            };

            let eq3_str = `${formatIntTerm(A_int, 'x', true)} ${formatIntTerm(B_int, 'y', false)} = ${C_int}`;
            let eq4_str = `${formatIntTerm(D_int, 'x', true)} ${formatIntTerm(E_int, 'y', false)} = ${F_int}`;

            if (lcm1 > 1 || lcm2 > 1) {
                solLines.push(`\\text{Clear denominators by multiplying (1) by } ${lcm1} \\text{ and (2) by } ${lcm2}:`);
            } else {
                solLines.push(`\\text{The system has integer coefficients:}`);
            }
            solLines.push(`\\begin{cases} ${eq3_str} & \\text{(3)} \\\\ ${eq4_str} & \\text{(4)} \\end{cases}`);

            // 6. Systematic Algebraic Elimination
            let mult1 = Math.abs(D_int);
            let mult2 = Math.abs(A_int);
            if (A_int * D_int > 0) mult2 = -mult2;

            let g = gcd(mult1, mult2);
            mult1 /= g;
            mult2 /= g;

            let A1 = A_int * mult1, B1 = B_int * mult1, C1 = C_int * mult1;
            let D2 = D_int * mult2, E2 = E_int * mult2, F2 = F_int * mult2;

            solLines.push(`\\text{Multiply equation (3) by } ${mult1} \\text{ and equation (4) by } ${mult2}:`);
            let eq3_mult = `${formatIntTerm(A1, 'x', true)} ${formatIntTerm(B1, 'y', false)} = ${C1}`;
            let eq4_mult = `${formatIntTerm(D2, 'x', true)} ${formatIntTerm(E2, 'y', false)} = ${F2}`;
            solLines.push(`\\begin{cases} ${eq3_mult} \\\\ ${eq4_mult} \\end{cases}`);

            let sumB = B1 + E2;
            let sumC = C1 + F2;

            solLines.push(`\\text{Add the equations together to eliminate } x:`);
            solLines.push(`${formatIntTerm(sumB, 'y', true)} = ${sumC}`);

            let SolY = makeFrac(sumC, sumB);
            // FIX: Only output 'y = ...' if y was not already fully isolated in the line above
            if (sumB !== 1) {
                solLines.push(`y = ${formatFracPure(SolY)}`);
            }

            // 7. Back-Substitution Step
            solLines.push(`\\text{Substitute } y = ${formatFracPure(SolY)} \\text{ into equation (3):}`);
            let B_times_Y = multFrac(makeFrac(B_int, 1), SolY);
            
            let sign = B_times_Y.num < 0 ? "-" : "+";
            let absBY = formatFracPure(makeFrac(Math.abs(B_times_Y.num), B_times_Y.den));
            solLines.push(`${formatIntTerm(A_int, 'x', true)} ${sign} ${absBY} = ${C_int}`);

            let rhsFrac = subFrac(makeFrac(C_int, 1), B_times_Y);
            // FIX: Only output the isolated term step if the coefficient isn't already 1
            if (A_int !== 1) {
                solLines.push(`${formatIntTerm(A_int, 'x', true)} = ${formatFracPure(rhsFrac)}`);
            }

            let SolX = divFrac(rhsFrac, makeFrac(A_int, 1));
            solLines.push(`x = ${formatFracPure(SolX)}`);

            solLines.push(`\\text{Final Solution Set: } (x, y) = \\left(${formatFracPure(SolX)}, ${formatFracPure(SolY)}\\right)`);

            return {
                expr: `\\begin{aligned} &\\text{Solve system of equations:}\\\\ &\\quad ${exprStr}\\end{aligned}`,
                ans: `x = ${formatFracPure(SolX)}, \\quad y = ${formatFracPure(SolY)}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Systems of Linear Inequalities in Two Variables (ax + b > c, dx + e > f)
        (a, b, c, d) => {
            // 1. Core fraction arithmetic helper functions
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const lcm = (m, n) => (Math.abs(m) * Math.abs(n)) / gcd(m, n);

            const makeFrac = (n, d = 1) => {
                if (d < 0) { n = -n; d = -d; }
                let g = gcd(n, d);
                return { num: n / g, den: d / g };
            };

            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);
            const compFrac = (f1, f2) => (f1.num * f2.den) - (f2.num * f1.den); 

            // 2. Dynamic generation of coefficients (A, B, C) and (P, Q, R) from 4 seeds
            const getParam = (val, offset) => {
                let num = (Math.abs(val + offset) % 13) - 6; 
                if (num === 0) num = (offset % 2 === 0) ? 2 : -2; 
                
                let dens = [1, 1, 1, 2, 3, 4]; 
                let den = dens[Math.abs(val * offset) % dens.length];
                return makeFrac(num, den);
            };

            let fracA = getParam(a, 1); 
            let fracB = getParam(b, 2); 
            let fracC = getParam(c, 3); 
            
            let fracP = getParam(d, 4); 
            let fracQ = getParam(a + b, 5); 
            let fracR = getParam(c + d, 6); 

            // Operator selection and direction flipping helper
            const ops = [">", "<", "\\le", "\\ge"];
            const flipOp = (op) => {
                if (op === ">") return "<";
                if (op === "<") return ">";
                if (op === "\\le") return "\\ge";
                if (op === "\\ge") return "\\le";
                return op;
            };

            let op1 = ops[Math.abs(a * c) % 4];
            let op2 = ops[Math.abs(b * d) % 4];

            // 3. LaTeX presentation formatting string builders
            const formatFracTerm = (f, variable, isFirst) => {
                if (f.num === 0) return "";
                let isNeg = f.num < 0;
                let absNum = Math.abs(f.num);
                let signStr = isFirst ? (isNeg ? "-" : "") : (isNeg ? "- " : "+ ");
                
                let termStr = "";
                if (f.den === 1) {
                    termStr = absNum === 1 ? variable : `${absNum}${variable}`;
                } else {
                    termStr = `\\frac{${absNum}}{${f.den}}${variable}`;
                }
                return signStr + termStr;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            const formatInEqualityStr = (fA, fB, op, fC) => {
                let left = formatFracTerm(fA, 'x', true);
                if (fB.num !== 0) {
                    left += ` ${fB.num > 0 ? '+ ' : ''}${formatFracPure(fB)}`;
                }
                return `${left} ${op} ${formatFracPure(fC)}`;
            };

            // 4. Step-by-Step Solving Logic
            let eq1Str = formatInEqualityStr(fracA, fracB, op1, fracC);
            let eq2Str = formatInEqualityStr(fracP, fracQ, op2, fracR);
            let exprStr = `\\begin{cases} ${eq1Str} \\\\ ${eq2Str} \\end{cases}`;

            let solLines = [`\\text{Given the system of inequalities:}`];
            solLines.push(`\\begin{cases} ${eq1Str} & \\text{(1)} \\\\ ${eq2Str} & \\text{(2)} \\end{cases}`);

            // --- Solve Inequality (1) ---
            solLines.push(`\\text{Step 1: Solve inequality (1):}`);
            let rhs1 = subFrac(fracC, fracB);
            solLines.push(`${formatFracTerm(fracA, 'x', true)} ${op1} ${formatFracPure(fracC)} ${fracB.num >= 0 ? '-' : '+'} ${formatFracPure(makeFrac(Math.abs(fracB.num), fracB.den))}`);
            solLines.push(`${formatFracTerm(fracA, 'x', true)} ${op1} ${formatFracPure(rhs1)}`);

            let solVal1 = divFrac(rhs1, fracA);
            let finalOp1 = fracA.num < 0 ? flipOp(op1) : op1;
            
            // Handle fraction vs integer coefficient text cleanly
            if (fracA.den !== 1) {
                let reciprocal = makeFrac(fracA.den, fracA.num);
                if (fracA.num < 0) {
                    solLines.push(`\\text{Multiply both sides by the reciprocal, } ${formatFracPure(reciprocal)}, \\text{ and flip the inequality sign:}`);
                } else {
                    solLines.push(`\\text{Multiply both sides by the reciprocal, } ${formatFracPure(reciprocal)}:`);
                }
            } else {
                if (fracA.num === -1) {
                    solLines.push(`\\text{Multiply both sides by -1 and flip the inequality sign:}`);
                } else if (fracA.num < 0) {
                    solLines.push(`\\text{Divide both sides by } ${Math.abs(fracA.num)} \\text{ and flip the inequality sign:}`);
                } else if (fracA.num !== 1) {
                    solLines.push(`\\text{Divide both sides by } ${fracA.num}:`);
                }
            }
            solLines.push(`x ${finalOp1} ${formatFracPure(solVal1)}`);

            // --- Solve Inequality (2) ---
            solLines.push(`\\text{Step 2: Solve inequality (2):}`);
            let rhs2 = subFrac(fracR, fracQ);
            solLines.push(`${formatFracTerm(fracP, 'x', true)} ${op2} ${formatFracPure(fracR)} ${fracQ.num >= 0 ? '-' : '+'} ${formatFracPure(makeFrac(Math.abs(fracQ.num), fracQ.den))}`);
            solLines.push(`${formatFracTerm(fracP, 'x', true)} ${op2} ${formatFracPure(rhs2)}`);

            let solVal2 = divFrac(rhs2, fracP);
            let finalOp2 = fracP.num < 0 ? flipOp(op2) : op2;

            // Handle fraction vs integer coefficient text cleanly
            if (fracP.den !== 1) {
                let reciprocal = makeFrac(fracP.den, fracP.num);
                if (fracP.num < 0) {
                    solLines.push(`\\text{Multiply both sides by the reciprocal, } ${formatFracPure(reciprocal)}, \\text{ and flip the inequality sign:}`);
                } else {
                    solLines.push(`\\text{Multiply both sides by the reciprocal, } ${formatFracPure(reciprocal)}:`);
                }
            } else {
                if (fracP.num === -1) {
                    solLines.push(`\\text{Multiply both sides by -1 and flip the inequality sign:}`);
                } else if (fracP.num < 0) {
                    solLines.push(`\\text{Divide both sides by } ${Math.abs(fracP.num)} \\text{ and flip the inequality sign:}`);
                } else if (fracP.num !== 1) {
                    solLines.push(`\\text{Divide both sides by } ${fracP.num}:`);
                }
            }
            solLines.push(`x ${finalOp2} ${formatFracPure(solVal2)}`);

            // --- Step 3: Intersection / Final Solution Set Combination ---
            solLines.push(`\\text{Step 3: Combine the solutions to find the intersection:}`);
            solLines.push(`\\text{We seek values of } x \\text{ satisfying both } x ${finalOp1} ${formatFracPure(solVal1)} \\text{ and } x ${finalOp2} ${formatFracPure(solVal2)}.`);

            const getBounds = (op, val) => {
                const isLower = (op === ">" || op === "\\ge");
                const isInclusive = (op === "\\ge" || op === "\\le");
                return { isLower, isInclusive, val, op };
            };

            const b1 = getBounds(finalOp1, solVal1);
            const b2 = getBounds(finalOp2, solVal2);

            let finalAnsStr = "";
            let finalExplanation = "";

            if (b1.isLower === b2.isLower) {
                const isLower = b1.isLower;
                const cmp = compFrac(b1.val, b2.val);
                let stricter;

                if (cmp > 0) {
                    stricter = isLower ? b1 : b2;
                } else if (cmp < 0) {
                    stricter = isLower ? b2 : b1;
                } else {
                    stricter = (!b1.isInclusive) ? b1 : b2;
                }

                finalAnsStr = `x ${stricter.op} ${formatFracPure(stricter.val)}`;
                finalExplanation = `\\text{Since both inequalities restrict } x \\text{ in the same direction, we extract the stricter threshold: } ${finalAnsStr}`;
            } else {
                const lower = b1.isLower ? b1 : b2;
                const upper = b1.isLower ? b2 : b1;
                const cmp = compFrac(lower.val, upper.val);

                if (cmp < 0) {
                    const opL = lower.isInclusive ? "\\le" : "<";
                    const opU = upper.isInclusive ? "\\le" : "<";
                    finalAnsStr = `${formatFracPure(lower.val)} ${opL} x ${opU} ${formatFracPure(upper.val)}`;
                    finalExplanation = `\\text{The solution sets overlap perfectly, forming the compound interval: } ${finalAnsStr}`;
                } else if (cmp === 0) {
                    if (lower.isInclusive && upper.isInclusive) {
                        finalAnsStr = `x = ${formatFracPure(lower.val)}`;
                        finalExplanation = `\\text{The systems converge precisely at an isolated shared point: } ${finalAnsStr}`;
                    } else {
                        finalAnsStr = "\\text{No solution}";
                        finalExplanation = `\\text{The solution domains meet at } ${formatFracPure(lower.val)}, \\text{ but because that element is excluded by at least one condition, no real solution exists.}`;
                    }
                } else {
                    finalAnsStr = "\\text{No solution}";
                    finalExplanation = `\\text{Because } ${formatFracPure(lower.val)} > ${formatFracPure(upper.val)}, \\text{ the restrictions conflict across all domains. Hence, there is no solution.}`;
                }
            }

            solLines.push(finalExplanation);

            // Filter out any consecutive duplicate math rows to keep output streamlined and clean
            const cleanSolLines = solLines.filter((line, index) => index === 0 || line !== solLines[index - 1]);

            return {
                expr: `\\begin{aligned} &\\text{Solve system of inequalities:}\\\\ &\\quad ${exprStr}\\end{aligned}`,
                ans: finalAnsStr,
                sol: `\\begin{aligned}\n&` + cleanSolLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Lines & Slopes
        (param1, param2, param3, typeStr) => {
            // ==========================================
            // 1. Core fraction arithmetic & math helper functions
            // ==========================================
            const gcd = (m, n) => {
                m = Math.abs(m);
                n = Math.abs(n);
                return n === 0 ? m : gcd(n, m % n);
            };

            const lcm = (a, b) => {
                a = Math.abs(a);
                b = Math.abs(b);
                return (a === 0 || b === 0) ? 0 : (a * b) / gcd(a, b);
            };
            
            const makeFrac = (n, d = 1) => {
                if (d === 0) return { num: 0, den: 1 }; 
                if (d < 0) { n = -n; d = -d; }
                const g = gcd(n, d);
                return { num: n / g, den: d / g };
            };
            
            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const mulFrac = (f1, f2) => makeFrac(f1.num * f2.num, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);

            const floatToFrac = (val) => {
                if (Number.isInteger(val)) return makeFrac(val, 1);
                const eps = 1.0e-6;
                let absVal = Math.abs(val);
                for (let d = 1; d <= 2000; d++) {
                    let n = Math.round(absVal * d);
                    if (Math.abs(absVal - n / d) < eps) {
                        return makeFrac(val < 0 ? -n : n, d);
                    }
                }
                return makeFrac(Math.round(val * 10000), 10000);
            };

            const parseInput = (val, defaultNum = 1, defaultDen = 1) => {
                if (!val && val !== 0) return makeFrac(defaultNum, defaultDen);
                if (typeof val === 'object' && 'num' in val) return makeFrac(val.num, val.den || 1);
                if (typeof val === 'string') {
                    val = val.replace(/\s+/g, '');
                    if (val.includes('frac')) {
                        const isNeg = val.startsWith('-');
                        const match = val.match(/\\(?:d|t)?frac\s*\{\s*(-?\d+)\s*\}\s*\{\s*(-?\d+)\s*\}/);
                        if (match) {
                            let n = parseInt(match[1], 10);
                            let d = parseInt(match[2], 10);
                            if (isNeg) n = -n;
                            if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                        }
                    }
                    if (val.includes('/')) {
                        const parts = val.split('/');
                        const n = parseInt(parts[0], 10);
                        const d = parseInt(parts[1], 10);
                        if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                    }
                    const n = Number(val);
                    if (!isNaN(n)) return floatToFrac(n);
                }
                if (typeof val === 'number' && !isNaN(val)) return floatToFrac(val);
                return makeFrac(defaultNum, defaultDen);
            };

            const parsePoint = (str) => {
                if (typeof str !== 'string') return { x: makeFrac(0), y: makeFrac(0) };
                const clean = str.replace(/\\left\(|\\right\)|[()]/g, '');
                const parts = clean.split(',');
                return {
                    x: parseInput(parts[0] ? parts[0].trim() : "0"),
                    y: parseInput(parts[1] ? parts[1].trim() : "0")
                };
            };

            const parseLineCoeffs = (str) => {
                if (typeof str !== 'string') return { a: makeFrac(0), b: makeFrac(0), c: makeFrac(0) };
                let s = str.replace(/\s+/g, '');
                
                if (s.includes('y=')) {
                    let right = s.split('y=')[1];
                    let xIdx = right.indexOf('x');
                    let m = makeFrac(0), b = makeFrac(0);
                    if (xIdx !== -1) {
                        let mStr = right.substring(0, xIdx);
                        if (mStr === "" || mStr === "+") m = makeFrac(1);
                        else if (mStr === "-") m = makeFrac(-1);
                        else m = parseInput(mStr);
                        b = parseInput(right.substring(xIdx + 1) || "0");
                    } else {
                        b = parseInput(right);
                    }
                    return { a: makeFrac(-m.num, m.den), b: makeFrac(1), c: b };
                }

                let xIdx = s.indexOf('x');
                let yIdx = s.indexOf('y');
                let eqIdx = s.indexOf('=');
                
                let a = makeFrac(0), b = makeFrac(0), c = makeFrac(0);
                if (eqIdx !== -1) c = parseInput(s.substring(eqIdx + 1));
                
                if (xIdx !== -1 && xIdx < eqIdx) {
                    let aStr = s.substring(0, xIdx);
                    if (aStr === "" || aStr === "+") a = makeFrac(1);
                    else if (aStr === "-") a = makeFrac(-1);
                    else a = parseInput(aStr);
                }
                if (yIdx !== -1 && yIdx < eqIdx) {
                    let start = xIdx !== -1 ? xIdx + 1 : 0;
                    let bStr = s.substring(start, yIdx);
                    if (bStr === "" || bStr === "+") b = makeFrac(1);
                    else if (bStr === "-") b = makeFrac(-1);
                    else b = parseInput(bStr);
                }
                return { a, b, c };
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            // Creates pristine exam-level equations (Clears denominators to form Ax + By = C)
            const toStandardForm = (mA, mB, mC) => {
                const denLcm = lcm(mA.den, lcm(mB.den, mC.den));
                let a = mA.num * (denLcm / mA.den);
                let b = mB.num * (denLcm / mB.den);
                let c = mC.num * (denLcm / mC.den);
                
                if (a < 0 || (a === 0 && b < 0)) {
                    a = -a; b = -b; c = -c;
                }
                
                const gAll = gcd(a, gcd(b, c));
                if (gAll > 0) {
                    a /= gAll; b /= gAll; c /= gAll;
                }
                
                return { a, b, c };
            };

            const formatStandardEq = (a, b, c) => {
                let str = "";
                if (a !== 0) {
                    if (a === 1) str += "x";
                    else if (a === -1) str += "-x";
                    else str += `${a}x`;
                }
                if (b !== 0) {
                    if (str === "") {
                        if (b === 1) str += "y";
                        else if (b === -1) str += "-y";
                        else str += `${b}y`;
                    } else {
                        let absB = Math.abs(b);
                        let sign = b < 0 ? " - " : " + ";
                        str += sign + (absB === 1 ? "y" : `${absB}y`);
                    }
                }
                if (str === "") str = "0";
                return `${str} = ${c}`;
            };

            const formatLineEqForSetup = (mA, mB, mC) => {
                let str = "";
                if (mA.num !== 0) {
                    let absA = Math.abs(mA.num);
                    let sign = mA.num < 0 ? "-" : "";
                    let coeff = absA === 1 && mA.den === 1 ? "" : (mA.den === 1 ? absA : `\\frac{${absA}}{${mA.den}}`);
                    str += `${sign}${coeff}x`;
                }
                if (mB.num !== 0) {
                    let absB = Math.abs(mB.num);
                    let sign = str === "" ? (mB.num < 0 ? "-" : "") : (mB.num < 0 ? " - " : " + ");
                    let coeff = absB === 1 && mB.den === 1 ? "" : (mB.den === 1 ? absB : `\\frac{${absB}}{${mB.den}}`);
                    str += `${sign}${coeff}y`;
                }
                if (str === "") str = "0";
                return `${str} = ${formatFracPure(mC)}`;
            };

            // ==========================================
            // 2. AUTO-ENGINE INTERCEPTOR (EXAM TUNED)
            // ==========================================
            let taskType = typeof typeStr === 'string' ? typeStr : "";
            if (typeof param1 === 'number' && typeof param2 === 'number' && typeof param3 === 'number') {
                const types = ["slope_point", "two_lines", "point_perpendicular", "point_parallel", "two_points", "perpendicular_bisector"];
                taskType = types[Math.floor(Math.random() * types.length)];

                const randCoord = () => Math.floor(Math.random() * 15) - 7;
                const randCoeff = () => Math.floor(Math.random() * 6) + 1;

                const generateRandomLine = () => {
                    if (Math.random() > 0.5) return `${randCoeff()}x + ${randCoeff()}y = ${randCoord() * 2}`;
                    let mNum = randCoord(), mDen = randCoeff(), bNum = randCoord();
                    return `y = \\frac{${mNum}}{${mDen}}x ${bNum < 0 ? "-" : "+"} ${Math.abs(bNum)}`;
                };

                if (taskType === "slope_point") {
                    param1 = `${randCoord()}/${randCoeff() + 1}`;
                    param2 = `(${randCoord()}, ${randCoord()})`;
                } else if (taskType === "two_lines") {
                    param1 = generateRandomLine();
                    param2 = generateRandomLine();
                } else if (taskType === "point_perpendicular" || taskType === "point_parallel") {
                    param1 = `(${randCoord()}, ${randCoord()})`;
                    param2 = generateRandomLine();
                } else if (taskType === "two_points" || taskType === "perpendicular_bisector") {
                    param1 = `(${randCoord()}, ${randCoord()})`;
                    let x2, y2;
                    do { x2 = randCoord(); y2 = randCoord(); } while (x2 === parseInt(param1.split(',')[0].replace(/\D/g, ''))); 
                    param2 = `(${x2}, ${y2})`;
                }
                param3 = "";
            }

            // ==========================================
            // 3. CORE PROCESSING ENGINES
            // ==========================================
            let setupLines = [];
            let finalAnsStr = "";
            const solLines = [];

            // Formats mathematical setup cleanly without printing "- 0" iteratively
            const applyPointSlope = (m, pt) => {
                if (m === null) {
                    const std = toStandardForm(makeFrac(1), makeFrac(0), pt.x);
                    return formatStandardEq(std.a, std.b, std.c);
                }
                
                // Step 1: Initial Substitution
                let subY = pt.y.num === 0 ? "- 0" : (pt.y.num < 0 ? `+ ${formatFracPure({num: -pt.y.num, den: pt.y.den})}` : `- ${formatFracPure(pt.y)}`);
                let subX = pt.x.num === 0 ? "- 0" : (pt.x.num < 0 ? `+ ${formatFracPure({num: -pt.x.num, den: pt.x.den})}` : `- ${formatFracPure(pt.x)}`);
                solLines.push(`y ${subY} = ${formatFracPure(m)}\\left(x ${subX}\\right)`);
                
                const mx1 = mulFrac(m, pt.x);
                const yIntercept = addFrac(makeFrac(-mx1.num, mx1.den), pt.y);
                
                // Step 2: Distribute Slope (Skipped cleanly if x was 0)
                let distY = pt.y.num === 0 ? "" : ` ${subY}`;
                let distMx = mx1.num === 0 ? "" : (mx1.num < 0 ? ` + ${formatFracPure({num: -mx1.num, den: mx1.den})}` : ` - ${formatFracPure(mx1)}`);
                let distLine = `y${distY} = ${formatFracPure(m)}x${distMx}`;
                
                if (solLines[solLines.length - 1] !== distLine && pt.x.num !== 0) {
                    solLines.push(distLine);
                }

                // Step 3: Slope-Intercept Form Isolation (Skipped cleanly if no changes needed)
                let slopeIntB = yIntercept.num === 0 ? "" : (yIntercept.num < 0 ? ` - ${formatFracPure({num: -yIntercept.num, den: yIntercept.den})}` : ` + ${formatFracPure(yIntercept)}`);
                let slopeIntLine = `y = ${formatFracPure(m)}x${slopeIntB}`;
                
                if (solLines[solLines.length - 1] !== slopeIntLine && pt.y.num !== 0) {
                    solLines.push(slopeIntLine);
                }
                
                // Step 4: Final Exam Form
                const std = toStandardForm(makeFrac(-m.num, m.den), makeFrac(1), yIntercept);
                return formatStandardEq(std.a, std.b, std.c);
            };

            switch (taskType) {
                case "slope_point": {
                    const slope = parseInput(param1);
                    const pt = parsePoint(param2);
                    setupLines.push(`\\text{Find line given: Slope } m = ${formatFracPure(slope)}, \\text{ Point } (${formatFracPure(pt.x)}, ${formatFracPure(pt.y)})`);
                    solLines.push(`\\text{Point-Slope Form: } y - y_1 = m(x - x_1)`);
                    finalAnsStr = applyPointSlope(slope, pt);
                    break;
                }
                
                case "two_points": {
                    const p1 = parsePoint(param1);
                    const p2 = parsePoint(param2);
                    setupLines.push(`\\text{Find line passing through } (${formatFracPure(p1.x)}, ${formatFracPure(p1.y)}) \\text{ and } (${formatFracPure(p2.x)}, ${formatFracPure(p2.y)})`);
                    
                    const num = subFrac(p2.y, p1.y);
                    const den = subFrac(p2.x, p1.x);
                    
                    if (den.num === 0) {
                        solLines.push(`\\text{Points form a vertical line.}`);
                        finalAnsStr = applyPointSlope(null, p1);
                    } else {
                        const m = divFrac(num, den);
                        
                        let rawNumStr = formatFracPure(num);
                        let rawDenStr = formatFracPure(den);
                        let rawFrac = `\\frac{${rawNumStr}}{${den.num < 0 ? '(' + rawDenStr + ')' : rawDenStr}}`;
                        let mStr = formatFracPure(m);

                        let calcStep = `m = \\frac{y_2 - y_1}{x_2 - x_1} = ${rawFrac}`;
                        
                        // CORE FIX: Prevents \frac{8}{9} = \frac{8}{9} redundancy
                        if (rawFrac !== mStr && `\\frac{${num.num}}{${den.num}}` !== mStr) {
                            calcStep += ` = ${mStr}`;
                        }
                        solLines.push(calcStep);
                        
                        solLines.push(`\\text{Using Point-Slope Form with } (${formatFracPure(p1.x)}, ${formatFracPure(p1.y)}):`);
                        finalAnsStr = applyPointSlope(m, p1);
                    }
                    break;
                }

                case "perpendicular_bisector": {
                    const p1 = parsePoint(param1);
                    const p2 = parsePoint(param2);
                    setupLines.push(`\\text{Find perpendicular bisector of segment between } (${formatFracPure(p1.x)}, ${formatFracPure(p1.y)}) \\text{ and } (${formatFracPure(p2.x)}, ${formatFracPure(p2.y)})`);
                    
                    const midX = divFrac(addFrac(p1.x, p2.x), makeFrac(2));
                    const midY = divFrac(addFrac(p1.y, p2.y), makeFrac(2));
                    solLines.push(`\\text{1. Find Midpoint } M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)`);
                    
                    let sumX = addFrac(p1.x, p2.x);
                    let sumY = addFrac(p1.y, p2.y);
                    let mCalcStr = `M = \\left(\\frac{${formatFracPure(sumX)}}{2}, \\frac{${formatFracPure(sumY)}}{2}\\right)`;
                    let mFinalStr = `\\left(${formatFracPure(midX)}, ${formatFracPure(midY)}\\right)`;
                    
                    // CORE FIX: Prevents redundancy on easy integer midpoints
                    if (`\\left(\\frac{${sumX.num}}{2}, \\frac{${sumY.num}}{2}\\right)` !== mFinalStr) {
                        mCalcStr += ` = ${mFinalStr}`;
                    }
                    solLines.push(mCalcStr);

                    const num = subFrac(p2.y, p1.y);
                    const den = subFrac(p2.x, p1.x);
                    
                    if (den.num === 0) {
                        solLines.push(`\\text{Segment is vertical, bisector is horizontal.}`);
                        finalAnsStr = applyPointSlope(makeFrac(0), {x: midX, y: midY});
                    } else if (num.num === 0) {
                        solLines.push(`\\text{Segment is horizontal, bisector is vertical.}`);
                        finalAnsStr = applyPointSlope(null, {x: midX, y: midY});
                    } else {
                        const m = divFrac(num, den);
                        const perpM = divFrac(makeFrac(-1), m);
                        solLines.push(`\\text{2. Segment slope } m = ${formatFracPure(m)} \\implies \\text{Perpendicular slope } m_{\\perp} = ${formatFracPure(perpM)}`);
                        solLines.push(`\\text{3. Apply Point-Slope Form:}`);
                        finalAnsStr = applyPointSlope(perpM, {x: midX, y: midY});
                    }
                    break;
                }
                
                case "point_perpendicular":
                case "point_parallel": {
                    const pt = parsePoint(param1);
                    const refL = parseLineCoeffs(param2);
                    const isPerp = taskType === "point_perpendicular";
                    
                    setupLines.push(`\\text{Find line through } (${formatFracPure(pt.x)}, ${formatFracPure(pt.y)}) \\text{ ${isPerp ? "perpendicular" : "parallel"} to: } ${formatLineEqForSetup(refL.a, refL.b, refL.c)}`);
                    
                    if (refL.b.num === 0) {
                        solLines.push(`\\text{Reference line is vertical.}`);
                        finalAnsStr = applyPointSlope(isPerp ? makeFrac(0) : null, pt);
                    } else {
                        const refM = divFrac(makeFrac(-refL.a.num, refL.a.den), refL.b);
                        solLines.push(`m_{\\text{ref}} = ${formatFracPure(refM)}`);
                        
                        let targetM;
                        if (isPerp) {
                            if (refM.num === 0) targetM = null;
                            else targetM = divFrac(makeFrac(-1), refM);
                            solLines.push(targetM === null ? `\\text{Perpendicular slope is undefined (vertical line).}` : `\\text{Perpendicular slope } m = ${formatFracPure(targetM)}`);
                        } else {
                            targetM = refM;
                            solLines.push(`\\text{Parallel slope } m = ${formatFracPure(targetM)}`);
                        }
                        finalAnsStr = applyPointSlope(targetM, pt);
                    }
                    break;
                }

                case "two_lines": {
                    const L1 = parseLineCoeffs(param1);
                    const L2 = parseLineCoeffs(param2);
                    setupLines.push(`\\text{Find line through Origin } (0,0) \\text{ and intersection of:}`);
                    setupLines.push(`L_1: ${formatLineEqForSetup(L1.a, L1.b, L1.c)} \\quad L_2: ${formatLineEqForSetup(L2.a, L2.b, L2.c)}`);

                    const D = subFrac(mulFrac(L1.a, L2.b), mulFrac(L2.a, L1.b));
                    if (D.num === 0) {
                        solLines.push(`\\text{Lines are parallel/coincident.}`);
                        finalAnsStr = "\\text{Undefined}";
                    } else {
                        const Dx = subFrac(mulFrac(L1.c, L2.b), mulFrac(L2.c, L1.b));
                        const Dy = subFrac(mulFrac(L1.a, L2.c), mulFrac(L2.a, L1.c));
                        const ptX = divFrac(Dx, D);
                        const ptY = divFrac(Dy, D);
                        
                        solLines.push(`\\text{Intersection Point: } P\\left(${formatFracPure(ptX)}, ${formatFracPure(ptY)}\\right)`);
                        if (ptX.num === 0 && ptY.num === 0) {
                            solLines.push(`\\text{Intersection is at origin.}`);
                            finalAnsStr = "x - y = 0";
                        } else if (ptX.num === 0) {
                            finalAnsStr = "x = 0";
                        } else {
                            const originSlope = divFrac(ptY, ptX);
                            solLines.push(`m = \\frac{y_1}{x_1} = ${formatFracPure(originSlope)}`);
                            const std = toStandardForm(makeFrac(-originSlope.num, originSlope.den), makeFrac(1), makeFrac(0));
                            finalAnsStr = formatStandardEq(std.a, std.b, std.c);
                        }
                    }
                    break;
                }
                default: return { expr: "\\text{Invalid setup}", ans: "", sol: "" };
            }

            if (finalAnsStr !== "\\text{Undefined}") {
                solLines.push(`\\text{Standard Form Equation: } ${finalAnsStr}`);
            }
            
            // Final deduplication net just to be perfectly safe
            const cleanSolLines = solLines.filter((line, index) => index === 0 || line !== solLines[index - 1]);

            return {
                expr: `\\begin{aligned}\n& ` + setupLines.join(` \\\\[1.2em]\n& `) + `\n\\end{aligned}`,
                ans: finalAnsStr,
                sol: `\\begin{aligned}\n& ` + cleanSolLines.join(` \\\\[1.2em]\n& `) + `\n\\end{aligned}`
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
            const macroSetup = "\\newcommand{\\vr}[1]{\\rule{0.4pt}{#1 ex}} \\def\\arraystretch{0.6} ";

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
                expr: `\\begin{aligned} &\\text{Solve system of inequalities: } \\\\ &\\quad ${exprStr}\\end{aligned}`,
                ans: `= ${ansStr}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        // # Family: Systems of three Linear Equations (a1x + b1y + c1z = d1, a2x + b2y + c2z = d2, a3x + b3y + c3z = d3)
        (a, b, c, d) => {
            // 1. Core fraction arithmetic helper functions
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const lcm = (m, n) => (Math.abs(m) * Math.abs(n)) / gcd(m, n);

            const makeFrac = (n, d = 1) => {
                if (d < 0) { n = -n; d = -d; }
                let g = gcd(n, d);
                return { num: n / g, den: d / g };
            };

            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const multFrac = (f1, f2) => makeFrac(f1.num * f2.num, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);
            const scaleFrac = (f, s) => makeFrac(f.num * s, f.den);

            // 2. Generate a target integer solution (x, y, z) to guarantee a clean system
            let X = (Math.abs(a) % 5) - 2; // -2 to 2
            let Y = (Math.abs(b) % 5) - 2; // -2 to 2
            let Z = (Math.abs(c) % 5) - 2; // -2 to 2
            if (X === 0 && Y === 0 && Z === 0) { X = 1; Y = -1; Z = 2; } 

            // 3. Helper to generate dynamic fractional coefficients
            const getCoeff = (seed, offset) => {
                let num = (Math.abs(seed + offset) % 9) - 4; // -4 to 4
                if (num === 0) num = (offset % 2 === 0) ? 1 : -2; 
                let dens = [1, 1, 2, 3]; 
                let den = dens[Math.abs(seed * offset) % dens.length];
                return makeFrac(num, den);
            };

            let fracA1, fracB1, fracC1, fracA2, fracB2, fracC2, fracA3, fracB3, fracC3;
            let a1, b1, c1, a2, b2, c2, a3, b3, c3;
            let h1, k1, h2, k2, det2x2;

            let shift = 0;
            while (true) {
                fracA1 = getCoeff(a, 1 + shift); fracB1 = getCoeff(b, 2 + shift); fracC1 = getCoeff(c, 3 + shift);
                fracA2 = getCoeff(d, 4 + shift); fracB2 = getCoeff(a + b, 5 + shift); fracC2 = getCoeff(c + d, 6 + shift);
                fracA3 = getCoeff(b + c, 7 + shift); fracB3 = getCoeff(a + d, 8 + shift); fracC3 = getCoeff(a + b + c, 9 + shift);

                let loopLcm1 = lcm(fracA1.den, lcm(fracB1.den, fracC1.den));
                let loopLcm2 = lcm(fracA2.den, lcm(fracB2.den, fracC2.den));
                let loopLcm3 = lcm(fracA3.den, lcm(fracB3.den, fracC3.den));

                a1 = (fracA1.num * loopLcm1) / fracA1.den; b1 = (fracB1.num * loopLcm1) / fracB1.den; c1 = (fracC1.num * loopLcm1) / fracC1.den;
                a2 = (fracA2.num * loopLcm2) / fracA2.den; b2 = (fracB2.num * loopLcm2) / fracB2.den; c2 = (fracC2.num * loopLcm2) / fracC2.den;
                a3 = (fracA3.num * loopLcm3) / fracA3.den; b3 = (fracB3.num * loopLcm3) / fracB3.den; c3 = (fracC3.num * loopLcm3) / fracC3.den;

                h1 = b1 * a2 - b2 * a1;
                k1 = c1 * a2 - c2 * a1;
                h2 = b1 * a3 - b3 * a1;
                k2 = c1 * a3 - c3 * a1;
                det2x2 = h1 * k2 - k1 * h2;

                if (a1 !== 0 && h1 !== 0 && det2x2 !== 0) {
                    break; 
                }
                shift++;
            }

            // Compute true constants based on target solutions
            let fracD1 = addFrac(addFrac(scaleFrac(fracA1, X), scaleFrac(fracB1, Y)), scaleFrac(fracC1, Z));
            let fracD2 = addFrac(addFrac(scaleFrac(fracA2, X), scaleFrac(fracB2, Y)), scaleFrac(fracC2, Z));
            let fracD3 = addFrac(addFrac(scaleFrac(fracA3, X), scaleFrac(fracB3, Y)), scaleFrac(fracC3, Z));

            // Final clean integer extraction
            let lcm1 = lcm(fracA1.den, lcm(fracB1.den, fracC1.den)); lcm1 = lcm(lcm1, fracD1.den);
            let lcm2 = lcm(fracA2.den, lcm(fracB2.den, fracC2.den)); lcm2 = lcm(lcm2, fracD2.den);
            let lcm3 = lcm(fracA3.den, lcm(fracB3.den, fracC3.den)); lcm3 = lcm(lcm3, fracD3.den);

            a1 = (fracA1.num * lcm1) / fracA1.den; b1 = (fracB1.num * lcm1) / fracB1.den; c1 = (fracC1.num * lcm1) / fracC1.den; let d1 = (fracD1.num * lcm1) / fracD1.den;
            a2 = (fracA2.num * lcm2) / fracA2.den; b2 = (fracB2.num * lcm2) / fracB2.den; c2 = (fracC2.num * lcm2) / fracC2.den; let d2 = (fracD2.num * lcm2) / fracD2.den;
            a3 = (fracA3.num * lcm3) / fracA3.den; b3 = (fracB3.num * lcm3) / fracB3.den; c3 = (fracC3.num * lcm3) / fracC3.den; let d3 = (fracD3.num * lcm3) / fracD3.den;

            // 4. LaTeX formatting string builders (Updated to eliminate stacked fractions)
            const formatFracTerm = (f, variable, isFirst) => {
                if (f.num === 0) return "";
                let isNeg = f.num < 0; let absNum = Math.abs(f.num);
                let signStr = isFirst ? (isNeg ? "-" : "") : (isNeg ? "- " : "+ ");
                
                // Changed here: renders \frac{absNum}{den}variable instead of pulling variable inside the numerator
                let termStr = f.den === 1 ? (absNum === 1 ? variable : `${absNum}${variable}`) : `\\frac{${absNum}}{${f.den}}${variable}`;
                return signStr + termStr;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            const formatIntTerm = (coeff, variable, isFirst) => {
                if (coeff === 0) return "";
                let num = Math.abs(coeff); let numStr = num === 1 ? "" : num.toString();
                return isFirst ? (coeff < 0 ? `-${numStr}${variable}` : `${numStr}${variable}`) : (coeff < 0 ? `- ${numStr}${variable}` : `+ ${numStr}${variable}`);
            };

            let eq1 = `${formatFracTerm(fracA1, 'x', true)} ${formatFracTerm(fracB1, 'y', false)} ${formatFracTerm(fracC1, 'z', false)} = ${formatFracPure(fracD1)}`;
            let eq2 = `${formatFracTerm(fracA2, 'x', true)} ${formatFracTerm(fracB2, 'y', false)} ${formatFracTerm(fracC2, 'z', false)} = ${formatFracPure(fracD2)}`;
            let eq3 = `${formatFracTerm(fracA3, 'x', true)} ${formatFracTerm(fracB3, 'y', false)} ${formatFracTerm(fracC3, 'z', false)} = ${formatFracPure(fracD3)}`;
            let exprStr = `\\begin{cases} ${eq1} \\\\ ${eq2} \\\\ ${eq3} \\end{cases}`;

            let solLines = [`\\text{Given the system of equations:}`];
            solLines.push(`\\begin{cases} ${eq1} & \\text{(1)} \\\\ ${eq2} & \\text{(2)} \\\\ ${eq3} & \\text{(3)} \\end{cases}`);

            // 5. Clear Denominators Step
            let eq1_clear = `${formatIntTerm(a1, 'x', true)} ${formatIntTerm(b1, 'y', false)} ${formatIntTerm(c1, 'z', false)} = ${d1}`;
            let eq2_clear = `${formatIntTerm(a2, 'x', true)} ${formatIntTerm(b2, 'y', false)} ${formatIntTerm(c2, 'z', false)} = ${d2}`;
            let eq3_clear = `${formatIntTerm(a3, 'x', true)} ${formatIntTerm(b3, 'y', false)} ${formatIntTerm(c3, 'z', false)} = ${d3}`;

            solLines.push(`\\text{Step 1: Multiply each equation by its coefficient LCM to work with integers:}`);
            solLines.push(`\\begin{cases} ${eq1_clear} & \\text{(4)} \\\\ ${eq2_clear} & \\text{(5)} \\\\ ${eq3_clear} & \\text{(6)} \\end{cases}`);

            // 6. Systematic Elimination of variable x
            solLines.push(`\\text{Step 2: Eliminate } x \\text{ from equation (5) and (6) using equation (4):}`);
            
            h1 = b1 * a2 - b2 * a1; k1 = c1 * a2 - c2 * a1; let led1 = d1 * a2 - d2 * a1;
            let g1 = gcd(gcd(h1, k1), led1); if (g1 > 1) { h1 /= g1; k1 /= g1; led1 /= g1; }
            let eq4_str = `${formatIntTerm(h1, 'y', true)} ${formatIntTerm(k1, 'z', false)} = ${led1}`;
            solLines.push(`\\text{Combine (4) and (5) } \\implies {${eq4_str}} \\quad \\text{(7)}`);

            h2 = b1 * a3 - b3 * a1; k2 = c1 * a3 - c3 * a1; let led2 = d1 * a3 - d3 * a1;
            let g2 = gcd(gcd(h2, k2), led2); if (g2 > 1) { h2 /= g2; k2 /= g2; led2 /= g2; }
            let eq5_str = `${formatIntTerm(h2, 'y', true)} ${formatIntTerm(k2, 'z', false)} = ${led2}`;
            solLines.push(`\\text{Combine (4) and (6) } \\implies {${eq5_str}} \\quad \\text{(8)}`);

            // 7. Solve reduced 2x2 system
            solLines.push(`\\text{Step 3: Solve the remaining } 2 \\times 2 \\text{ system of equations (7) and (8):}`);
            
            let zCoeff = k1 * h2 - k2 * h1;
            let zConst = led1 * h2 - led2 * h1;
            solLines.push(`\\text{Multiply and subtract (8) from (7) to eliminate } y:`);
            solLines.push(`${formatIntTerm(zCoeff, 'z', true)} = ${zConst}`);
            solLines.push(`z = \\frac{${zConst}}{${zCoeff}} = ${Z}`);

            solLines.push(`\\text{Substitute } z = ${Z} \\text{ back into equation (7):}`);
            let k1_times_Z = k1 * Z;
            solLines.push(`${formatIntTerm(h1, 'y', true)} ${k1_times_Z < 0 ? '-' : '+'} ${Math.abs(k1_times_Z)} = ${led1}`);
            let rhsY = led1 - k1_times_Z;
            solLines.push(`${formatIntTerm(h1, 'y', true)} = ${rhsY}`);
            solLines.push(`y = \\frac{${rhsY}}{${h1}} = ${Y}`);

            // 8. Back substitute to find x
            solLines.push(`\\text{Step 4: Substitute } y = ${Y} \\text{ and } z = ${Z} \\text{ back into equation (4) to find } x:`);
            let b1_Y = b1 * Y;
            let c1_Z = c1 * Z;
            let combined_sub = b1_Y + c1_Z;
            solLines.push(`${formatIntTerm(a1, 'x', true)} ${b1_Y < 0 ? '-' : '+'} ${Math.abs(b1_Y)} ${c1_Z < 0 ? '-' : '+'} ${Math.abs(c1_Z)} = ${d1}`);
            solLines.push(`${formatIntTerm(a1, 'x', true)} ${combined_sub < 0 ? '-' : '+'} ${Math.abs(combined_sub)} = ${d1}`);
            let rhsX = d1 - combined_sub;
            solLines.push(`${formatIntTerm(a1, 'x', true)} = ${rhsX}`);
            solLines.push(`x = \\frac{${rhsX}}{${a1}} = ${X}`);

            solLines.push(`\\text{Final Solution Triplet: } (x, y, z) = (${X}, ${Y}, ${Z})`);

            return {
                expr: `\\begin{aligned} &\\text{Solve system of equations} \\\\ & \\quad${exprStr}\\end{aligned}`,
                ans: `x = ${X}, \\quad y = ${Y}, \\quad z = ${Z}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        // # Family: Systems of Quadratic Equations and Linear Equations (ax^2 + by^2 = c, px + qy = r)
        (a, b, c, d) => {
            // 1. Core fraction arithmetic helper functions
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const lcm = (m, n) => (Math.abs(m) * Math.abs(n)) / gcd(m, n);

            const makeFrac = (n, d = 1) => {
                if (d < 0) { n = -n; d = -d; }
                let g = gcd(n, d);
                return { num: n / g, den: d / g };
            };

            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const multFrac = (f1, f2) => makeFrac(f1.num * f2.num, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);
            const scaleFrac = (f, s) => makeFrac(f.num * s, f.den);

            // NEW: Beautiful Typographic Unified Equation Formatter
            const formatPolynomial = (components, rhsFrac) => {
                let str = "";
                let firstRendered = false;
                
                components.forEach((c) => {
                    if (c.frac.num === 0) return;
                    
                    let isNeg = c.frac.num < 0;
                    let absNum = Math.abs(c.frac.num);
                    let den = c.frac.den;
                    
                    // Handle spacing and operators beautifully
                    if (!firstRendered) {
                        if (isNeg) str += "-";
                        firstRendered = true;
                    } else {
                        str += isNeg ? " - " : " + ";
                    }
                    
                    // Format coefficients cleanly
                    let coeffStr = "";
                    if (den === 1) {
                        if (absNum !== 1 || !c.var) coeffStr = absNum.toString();
                    } else {
                        coeffStr = `\\frac{${absNum}}{${den}}`;
                    }
                    
                    str += coeffStr + (c.var || "");
                });
                
                if (!firstRendered) str += "0";
                
                // Format Right Hand Side cleanly
                let rhsStr = "";
                if (rhsFrac.num < 0) rhsStr += "-";
                let absRHS = Math.abs(rhsFrac.num);
                rhsStr += rhsFrac.den === 1 ? absRHS.toString() : `\\frac{${absRHS}}{${rhsFrac.den}}`;
                
                return `${str} = ${rhsStr}`;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            // 2. Helper to generate dynamic fractional coefficients
            const getCoeff = (seed, offset) => {
                let num = (Math.abs(seed + offset) % 7) - 3; // Range: -3 to 3
                if (num === 0) num = (offset % 2 === 0) ? 2 : -2; 
                let dens = [1, 1, 2, 3]; 
                let den = dens[Math.abs(seed * offset) % dens.length];
                return makeFrac(num, den);
            };

            let shift = 0;
            let fracA, fracB, fracP, fracQ, fracC, fracR;
            let fracA_q, fracB_q, fracC_q;
            let X1, Y1;

            while (true) {
                fracA = getCoeff(a, 1 + shift);
                fracB = getCoeff(b, 2 + shift);
                fracP = getCoeff(c, 3 + shift);
                fracQ = getCoeff(d, 4 + shift);

                if (fracQ.num === 0) { shift++; continue; }

                X1 = (Math.abs(a + shift) % 3) - 1; 
                Y1 = (Math.abs(b + shift) % 3) - 1; 
                if (X1 === 0 && Y1 === 0) { X1 = 1; Y1 = 1; }

                fracC = addFrac(scaleFrac(fracA, X1 * X1), scaleFrac(fracB, Y1 * Y1));
                fracR = addFrac(scaleFrac(fracP, X1), scaleFrac(fracQ, Y1));

                // System matrix expansion transformation setup
                fracA_q = addFrac(multFrac(fracA, multFrac(fracQ, fracQ)), multFrac(fracB, multFrac(fracP, fracP)));
                fracB_q = scaleFrac(multFrac(fracB, multFrac(fracP, fracR)), -2);
                fracC_q = subFrac(multFrac(fracB, multFrac(fracR, fracR)), multFrac(fracC, multFrac(fracQ, fracQ)));

                if (fracA_q.num !== 0) { break; }
                shift++;
            }

            // 3. Clear denominators on intermediate steps to keep operations integer-focused
            let L = lcm(fracA_q.den, lcm(fracB_q.den, fracC_q.den));
            let A_int = (fracA_q.num * L) / fracA_q.den;
            let B_int = (fracB_q.num * L) / fracB_q.den;
            let C_int = (fracC_q.num * L) / fracC_q.den;

            let disc = B_int * B_int - 4 * A_int * C_int;
            let sqrtDisc = Math.round(Math.sqrt(disc));

            let fracX1 = makeFrac(-B_int + sqrtDisc, 2 * A_int);
            let fracX2 = makeFrac(-B_int - sqrtDisc, 2 * A_int);

            let fracY1 = divFrac(subFrac(fracR, multFrac(fracP, fracX1)), fracQ);
            let fracY2 = divFrac(subFrac(fracR, multFrac(fracP, fracX2)), fracQ);

            // 4. Constructing Beautiful LaTeX Strings using our new component formatter
            let eq1 = formatPolynomial([{frac: fracA, var: 'x^2'}, {frac: fracB, var: 'y^2'}], fracC);
            let eq2 = formatPolynomial([{frac: fracP, var: 'x'}, {frac: fracQ, var: 'y'}], fracR);
            let exprStr = `\\begin{cases} ${eq1} \\\\ ${eq2} \\end{cases}`;

            let solLines = [`\\text{Given the system of equations:}`];
            solLines.push(`\\begin{cases} ${eq1} & \\text{(1)} \\\\ ${eq2} & \\text{(2)} \\end{cases}`);

            solLines.push(`\\text{Step 1: Isolate } y \\text{ from the linear equation (2):}`);
            let y_isolated_lhs = formatPolynomial([{frac: divFrac(fracR, fracQ), var: ""}, {frac: scaleFrac(divFrac(fracP, fracQ), -1), var: "x"}], makeFrac(0, 1)).split(" = ")[0];
            solLines.push(`y = ${y_isolated_lhs}`);

            solLines.push(`\\text{Step 2: Substitute } y \\text{ into equation (1) and assemble the quadratic form:}`);
            let rawQuadStr = formatPolynomial([{frac: fracA_q, var: 'x^2'}, {frac: fracB_q, var: 'x'}, {frac: fracC_q, var: ''}], makeFrac(0, 1));
            solLines.push(`${rawQuadStr}`);

            if (L > 1) {
                solLines.push(`\\text{Clear fraction fractions by multiplying across by the LCM } (${L}):`);
                let clearQuadStr = formatPolynomial([{frac: makeFrac(A_int), var: 'x^2'}, {frac: makeFrac(B_int), var: 'x'}, {frac: makeFrac(C_int), var: ''}], makeFrac(0, 1));
                solLines.push(`${clearQuadStr}`);
            }

            solLines.push(`\\text{Apply the quadratic formula to find the rational roots for } x:`);
            let b_display = B_int < 0 ? `(${B_int})` : B_int.toString();
            solLines.push(`x = \\frac{-${b_display} \\pm \\sqrt{(${B_int})^2 - 4(${A_int})(${C_int})}}{2(${A_int})}`);
            solLines.push(`x = \\frac{${-B_int} \\pm ${sqrtDisc}}{${2 * A_int}}`);

            let x1_str = formatFracPure(fracX1);
            let x2_str = formatFracPure(fracX2);
            let y1_str = formatFracPure(fracY1);
            let y2_str = formatFracPure(fracY2);

            solLines.push(`\\implies x_1 = ${x1_str}, \\quad x_2 = ${x2_str}`);

            solLines.push(`\\text{Step 3: Back-substitute each } x \\text{ value to solve for its paired } y \\text{ value:}`);
            solLines.push(`\\text{For } x_1 = ${x1_str} \\implies y_1 = ${y1_str}`);
            solLines.push(`\\text{For } x_2 = ${x2_str} \\implies y_2 = ${y2_str}`);

            let finalAns = `\\left(${x1_str}, ${y1_str}\\right)`;
            if (x1_str !== x2_str) {
                finalAns += ` \\text{ and } \\left(${x2_str}, ${y2_str}\\right)`;
            }
            solLines.push(`\\text{Final Solution Set: } ${finalAns}`);

            return {
                expr: `\\begin{aligned}&\\text{Solve system equations: }\\\\ &\\quad ${exprStr} \\end{aligned}`,
                ans: `(x, y) = ${finalAns}`,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Linear Absolute Value Equations/Inequalities (|Ax + B| = C, |Ax + B| < C, etc.)
        (a, b, c, opStr) => {
            let stringOutsideD = "0";

            // ==========================================
            // 1. Core fraction arithmetic helper functions
            // ==========================================
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const makeFrac = (n, d = 1) => {
                if (d === 0) throw new Error("Denominator cannot be zero");
                if (d < 0) { n = -n; d = -d; }
                const g = gcd(n, d);
                return { num: n / g, den: d / g };
            };
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);
            const compFrac = (f1, f2) => (f1.num * f2.den) - (f2.num * f1.den);

            const floatToFrac = (val) => {
                if (Number.isInteger(val)) return makeFrac(val, 1);
                const eps = 1.0e-6;
                let absVal = Math.abs(val);
                for (let d = 1; d <= 2000; d++) {
                    let n = Math.round(absVal * d);
                    if (Math.abs(absVal - n / d) < eps) {
                        return makeFrac(val < 0 ? -n : n, d);
                    }
                }
                return makeFrac(Math.round(val * 10000), 10000);
            };

            const parseInput = (val, defaultNum = 1, defaultDen = 1) => {
                if (!val && val !== 0) return makeFrac(defaultNum, defaultDen);
                if (typeof val === 'object' && 'num' in val) return makeFrac(val.num, val.den || 1);
                if (typeof val === 'string') {
                    val = val.replace(/\s+/g, '');
                    if (val.includes('frac')) {
                        const isNeg = val.startsWith('-');
                        const match = val.match(/\\(?:d|t)?frac\s*\{\s*(-?\d+)\s*\}\s*\{\s*(-?\d+)\s*\}/);
                        if (match) {
                            let n = parseInt(match[1], 10);
                            let d = parseInt(match[2], 10);
                            if (isNeg) n = -n;
                            if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                        }
                    }
                    if (val.includes('/')) {
                        const parts = val.split('/');
                        const n = parseInt(parts[0], 10);
                        const d = parseInt(parts[1], 10);
                        if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                    }
                    const n = Number(val);
                    if (!isNaN(n)) return floatToFrac(n);
                }
                if (typeof val === 'number' && !isNaN(val)) return floatToFrac(val);
                return makeFrac(defaultNum, defaultDen);
            };

            const parsePoly = (val) => {
                if (!val && val !== 0) return { x: makeFrac(0), c: makeFrac(0) };
                if (typeof val === 'number') return { x: makeFrac(0), c: floatToFrac(val) };
                let str = String(val).replace(/\s+/g, '');
                let fX = makeFrac(0), fC = makeFrac(0);
                
                let xIdx = str.indexOf('x');
                if (xIdx !== -1) {
                    let remainder = str.substring(xIdx + 1);
                    let coeffStr = str.substring(0, xIdx);
                    
                    if (coeffStr === '' || coeffStr === '+') fX = makeFrac(1);
                    else if (coeffStr === '-') fX = makeFrac(-1);
                    else fX = parseInput(coeffStr);
                    
                    if (remainder) fC = parseInput(remainder);
                } else {
                    fC = parseInput(str);
                }
                return { x: fX, c: fC };
            };

            const checkOp = (val) => {
                if (typeof val !== 'string') return false;
                const s = val.replace(/\s+/g, '').toLowerCase();
                return s.includes("<") || s.includes(">") || s.includes("=") || 
                    s.includes("le") || s.includes("ge") || s.includes("lt") || 
                    s.includes("gt") || s.includes("≤") || s.includes("≥") ||
                    s.includes("≠") || s.includes("!=");
            };

            // ==========================================
            // 2. AUTO-ENGINE INTERCEPTOR
            // ==========================================
            if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof opStr === 'number') {
                const randSign = () => Math.random() < 0.5 ? -1 : 1;
                const makeFracStr = (val) => {
                    if (Math.random() < 0.65) {
                        const dens = [2, 3, 4, 5, 7];
                        return `${randSign() * val}/${dens[Math.floor(Math.random() * dens.length)]}`;
                    }
                    return randSign() * val;
                };

                const ops = ["=", "\\le", "\\ge", "<", ">"];
                opStr = ops[Math.floor(Math.random() * ops.length)];

                if (Math.random() < 0.4) {
                    let A_val = Math.floor(Math.random() * 4) + 2; 
                    a = String(A_val);
                    let B_val = Math.floor(Math.random() * 10) - 5;
                    b = String(B_val);
                    
                    let C_val = Math.floor(Math.random() * (A_val - 1)) + 1;
                    if (Math.random() < 0.5) C_val = -C_val;
                    
                    let minD = Math.floor((C_val * B_val) / A_val) + 1;
                    let D_val = minD + Math.floor(Math.random() * 6) + 1;
                    
                    c = `${C_val === 1 ? '' : C_val === -1 ? '-' : C_val}x ${D_val >= 0 ? '+' : ''}${D_val}`;
                    stringOutsideD = "0";
                } else {
                    a = makeFracStr(Math.floor(Math.random() * 5) + 1);
                    b = makeFracStr(Math.floor(Math.random() * 8) + 1);
                    
                    let targetC = Math.floor(Math.random() * 8) + 1; 
                    if (Math.random() < 0.65) {
                        let outD = Math.floor(Math.random() * 10) - 5;
                        stringOutsideD = String(outD);
                        c = String(targetC + outD);
                    } else {
                        c = String(targetC);
                        stringOutsideD = "0";
                    }
                }
            }

            // ==========================================
            // 3. Full Equation String Pre-processor
            // ==========================================
            if (typeof a === 'string' && (a.includes('|') || a.includes('\\mid') || a.includes('\\left|'))) {
                let str = a.trim();
                str = str.replace(/\\left\s*\|/g, '|').replace(/\\right\s*\|/g, '|').replace(/\\mid/g, '|');
                const firstPipe = str.indexOf('|');
                const lastPipe = str.lastIndexOf('|');
                
                if (firstPipe !== -1 && lastPipe !== -1 && firstPipe < lastPipe) {
                    let inside = str.substring(firstPipe + 1, lastPipe).trim();
                    const remainder = str.substring(lastPipe + 1).trim();
                    
                    const matchD = remainder.match(/^(.*?)\s*(\\le|\\ge|<=|>=|<|>|===|==|=|≤|≥|\\neq|!=)\s*(.*)$/);
                    if (matchD) {
                        stringOutsideD = matchD[1].trim() || "0";
                        opStr = matchD[2];
                        c = matchD[3].trim();
                    }
                    
                    inside = inside.replace(/\\(?:d|t)?frac\s*\{\s*([^{}]*?)x([^{}]*?)\s*\}\s*\{([^{}]*)\}/g, (match, p1, p2, p3) => {
                        let num = (p1 + p2).trim();
                        if (num === "" || num === "+") num = "1";
                        if (num === "-") num = "-1";
                        return `\\frac{${num}}{${p3}}x`;
                    });

                    const xIndex = inside.indexOf('x');
                    if (xIndex !== -1) {
                        let aPart = inside.substring(0, xIndex).trim();
                        let bPart = inside.substring(xIndex + 1).trim();
                        
                        if (bPart.startsWith('/')) {
                            const slashMatch = bPart.match(/^\/\s*(-?\d+)/);
                            if (slashMatch) {
                                aPart = aPart + slashMatch[0].replace(/\s+/g, '');
                                bPart = bPart.substring(slashMatch[0].length).trim();
                            }
                        }
                        
                        if (aPart === "" || aPart === "+") aPart = "1";
                        if (aPart === "-") aPart = "-1";
                        if (aPart.startsWith('-/')) aPart = "-1" + aPart.substring(1);
                        if (aPart.startsWith('+/')) aPart = "1" + aPart.substring(1);
                        if (aPart.startsWith('/')) aPart = "1" + aPart;
                        if (bPart.startsWith('+')) bPart = bPart.substring(1).trim();
                        if (bPart === "") bPart = "0";
                        
                        a = aPart;
                        b = bPart;
                    } else {
                        a = "0";
                        b = inside;
                    }
                }
            }

            let detectedOp = null;
            let numericArgs = [];
            const inputArgs = [a, b, c, opStr].filter(v => v !== undefined && v !== null && v !== '');

            for (let arg of inputArgs) {
                if (checkOp(arg) && !detectedOp) detectedOp = arg;
                else numericArgs.push(arg);
            }

            if (!detectedOp) {
                const ops = ["=", "\\le", "\\ge", "<", ">"];
                detectedOp = ops[Math.floor(Math.random() * ops.length)];
            }

            let op = String(detectedOp).trim().toLowerCase();
            if (op.includes("<=") || op.includes("≤") || op.includes("le")) op = "\\le";
            else if (op.includes(">=") || op.includes("≥") || op.includes("ge")) op = "\\ge";
            else if (op.includes("!=") || op.includes("≠") || op.includes("\\neq")) op = "\\neq";
            else if (op.includes("<") || op.includes("lt")) op = "<";
            else if (op.includes(">") || op.includes("gt")) op = ">";
            else op = "="; 

            let fracA = parseInput(numericArgs[0], 0, 1);
            const fracB = parseInput(numericArgs[1], 0, 1);
            const polyC = parsePoly(numericArgs[2] || 1);
            const polyD = parsePoly(stringOutsideD);

            const flipOp = (o) => {
                const flips = { ">": "<", "<": ">", "\\le": "\\ge", "\\ge": "\\le" };
                return flips[o] || o;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            const formatLin = (fX, fC) => {
                if (fX.num === 0 && fC.num === 0) return "0";
                if (fX.num === 0) return formatFracPure(fC);
                
                let xTerm = "";
                let absNum = Math.abs(fX.num);
                let signX = fX.num < 0 ? "-" : "";
                if (fX.den === 1) {
                    xTerm = absNum === 1 ? `${signX}x` : `${signX}${absNum}x`;
                } else {
                    xTerm = `${signX}\\frac{${absNum}}{${fX.den}}x`;
                }
                
                if (fC.num === 0) return xTerm;
                let absC = makeFrac(Math.abs(fC.num), fC.den);
                return fC.num > 0 ? `${xTerm} + ${formatFracPure(absC)}` : `${xTerm} - ${formatFracPure(absC)}`;
            };

            const solveLinearStep = (fA, fTarget, currentOp) => {
                const lines = [];
                const finalVal = divFrac(fTarget, fA);
                const needsFlip = (fA.num < 0 && currentOp !== "=" && currentOp !== "\\neq");
                const finalOp = needsFlip ? flipOp(currentOp) : currentOp;

                if (fA.den !== 1) {
                    const reciprocal = makeFrac(fA.den, fA.num);
                    const flipText = needsFlip ? "\\text{, flip the inequality sign}" : "";
                    lines.push(`\\text{Multiply both sides by } ${formatFracPure(reciprocal)}${flipText}\\text{:}`);
                } else {
                    const flipText = needsFlip ? " \\text{ and flip the inequality sign}" : "";
                    if (fA.num === -1) lines.push(`\\text{Multiply both sides by -1}${flipText}\\text{:}`);
                    else if (fA.num < 0) lines.push(`\\text{Divide both sides by } ${fA.num}${flipText}\\text{:}`);
                    else if (fA.num !== 1) lines.push(`\\text{Divide both sides by } ${fA.num}\\text{:}`);
                }
                lines.push(`x ${finalOp} ${formatFracPure(finalVal)}`);
                return { lines, finalVal, finalOp };
            };

            const solveIneqStep = (fAx, fBc, fCx, fDc, currentOp) => {
                const lines = [];
                const xCoeff = subFrac(fAx, fCx);
                const constVal = subFrac(fDc, fBc);
                
                lines.push(`${formatLin(fAx, fBc)} ${currentOp} ${formatLin(fCx, fDc)}`);
                
                if (fCx.num !== 0 || fBc.num !== 0) {
                    let leftTerm = formatLin(xCoeff, makeFrac(0));
                    if (leftTerm === "") leftTerm = "0";
                    lines.push(`${leftTerm} ${currentOp} ${formatFracPure(constVal)}`);
                }
                
                const finalVal = divFrac(constVal, xCoeff);
                const needsFlip = (xCoeff.num < 0 && currentOp !== "=" && currentOp !== "\\neq");
                const finalOp = needsFlip ? flipOp(currentOp) : currentOp;
                
                if (xCoeff.num !== 1 && xCoeff.num !== 0) {
                    let flipText = needsFlip ? " \\text{ (flip sign)}" : "";
                    lines.push(`x ${finalOp} ${formatFracPure(finalVal)}${flipText}`);
                }
                return { lines, finalVal, finalOp };
            };

            // ==========================================
            // 4. NEW: INTERVAL FORMATTING HELPER
            // ==========================================
            const formatInterval = (type, frac1, op1, frac2, op2) => {
                let val1 = formatFracPure(frac1);
                let val2 = frac2 ? formatFracPure(frac2) : "";
                
                if (type === "SINGLE") {
                    if (op1 === "\\le") return `x \\in (-\\infty, ${val1}]`;
                    if (op1 === "<") return `x \\in (-\\infty, ${val1})`;
                    if (op1 === "\\ge") return `x \\in [${val1}, \\infty)`;
                    if (op1 === ">") return `x \\in (${val1}, \\infty)`;
                    return `x ${op1} ${val1}`; 
                }
                if (type === "AND") {
                    const cmp = compFrac(frac1, frac2);
                    if (cmp > 0) return "\\text{No solution}"; // Bounds cross (empty set)
                    if (cmp === 0) return `x = ${val1}`;       // e.g. [5, 5] collapse to x = 5
                    
                    let isClosedL = op1 === "\\ge" || op1 === "≥" || op1 === ">=";
                    let isClosedR = op2 === "\\le" || op2 === "≤" || op2 === "<=";
                    return `x \\in ${isClosedL ? "[" : "("}${val1}, ${val2}${isClosedR ? "]" : ")"}`;
                }
                if (type === "OR") {
                    const cmp = compFrac(frac1, frac2);
                    if (cmp > 0) return "x \\in \\mathbb{R}";  // Bounds overlap (all reals)
                    if (cmp === 0) {
                        let isClosedR = op1 === "\\le" || op1 === "≤" || op1 === "<=";
                        let isClosedL = op2 === "\\ge" || op2 === "≥" || op2 === ">=";
                        if (isClosedR || isClosedL) return "x \\in \\mathbb{R}";
                        else return `x \\neq ${val1}`;
                    }
                    let isClosedR = op1 === "\\le" || op1 === "≤" || op1 === "<=";
                    let isClosedL = op2 === "\\ge" || op2 === "≥" || op2 === ">=";
                    return `x \\in (-\\infty, ${val1}${isClosedR ? "]" : ")"} \\cup ${isClosedL ? "[" : "("}${val2}, \\infty)`;
                }
                return "";
            };

            // ==========================================
            // 5. Render Initial & Isolate 
            // ==========================================
            let innerExpr = formatLin(fracA, fracB);
            let exprStr = `\\left| ${innerExpr} \\right|`;
            
            if (polyD.x.num !== 0 || polyD.c.num !== 0) {
                let dStr = formatLin(polyD.x, polyD.c);
                exprStr += dStr.startsWith('-') ? ` - ${dStr.substring(1)}` : ` + ${dStr}`;
            }
            exprStr += ` ${op} ${formatLin(polyC.x, polyC.c)}`;

            const solLines = [`\\text{Given the absolute value expression: } ${exprStr}`];
            
            let isoPolyRHS = { x: polyC.x, c: polyC.c };
            if (polyD.x.num !== 0 || polyD.c.num !== 0) {
                solLines.push(`\\text{First, isolate the absolute value by moving terms to the right side:}`);
                isoPolyRHS = { x: subFrac(polyC.x, polyD.x), c: subFrac(polyC.c, polyD.c) };
                solLines.push(`\\left| ${innerExpr} \\right| ${op} ${formatLin(isoPolyRHS.x, isoPolyRHS.c)}`);
            }

            let finalAnsStr = "";

            // ==========================================
            // 6A. Handle A = 0
            // ==========================================
            if (fracA.num === 0) {
                let absB_val = Math.abs(fracB.num / fracB.den);
                let absB_frac = makeFrac(Math.abs(fracB.num), fracB.den);
                
                solLines.push(`\\text{Since } A = 0 \\text{, the left side is a constant: } \\left| ${formatFracPure(fracB)} \\right| = ${formatFracPure(absB_frac)}`);
                
                if (isoPolyRHS.x.num === 0) {
                    let right_val = isoPolyRHS.c.num / isoPolyRHS.c.den;
                    solLines.push(`\\text{We evaluate the logical statement: } ${formatFracPure(absB_frac)} ${op} ${formatFracPure(isoPolyRHS.c)}`);
                    
                    let isTrue = false;
                    if (op === "=") isTrue = (absB_val === right_val);
                    else if (op === "\\neq") isTrue = (absB_val !== right_val);
                    else if (op === "<") isTrue = (absB_val < right_val);
                    else if (op === "\\le") isTrue = (absB_val <= right_val);
                    else if (op === ">") isTrue = (absB_val > right_val);
                    else if (op === "\\ge") isTrue = (absB_val >= right_val);
                    
                    if (isTrue) {
                        solLines.push(`\\text{This statement is true for all real numbers.}`);
                        finalAnsStr = "x \\in \\mathbb{R}";
                    } else {
                        solLines.push(`\\text{This statement is false.}`);
                        finalAnsStr = "\\text{No solution}";
                    }
                } else {
                    solLines.push(`\\text{Now solve the linear inequality: } ${formatFracPure(absB_frac)} ${op} ${formatLin(isoPolyRHS.x, isoPolyRHS.c)}`);
                    const res = solveIneqStep(makeFrac(0), absB_frac, isoPolyRHS.x, isoPolyRHS.c, op);
                    solLines.push(...res.lines);
                    finalAnsStr = formatInterval("SINGLE", res.finalVal, res.finalOp);
                }
            } 
            // ==========================================
            // 6B. STANDARD CONSTANT SOLVER
            // ==========================================
            else if (isoPolyRHS.x.num === 0) {
                let isolatedC = isoPolyRHS.c;
                const cCmp = compFrac(isolatedC, makeFrac(0));

                if (op === "\\neq") {
                    if (cCmp < 0) {
                        solLines.push(`\\text{Since the absolute value is always non-negative, it can never equal a negative number.}`);
                        finalAnsStr = "x \\in \\mathbb{R}";
                    } else if (cCmp === 0) {
                        solLines.push(`\\text{The absolute value is zero only when the expression inside is zero.}`);
                        solLines.push(`${innerExpr} \\neq 0`);
                        const target = makeFrac(-fracB.num, fracB.den);
                        solLines.push(`${formatLin(fracA, makeFrac(0))} \\neq ${formatFracPure(target)}`);
                        const res = solveLinearStep(fracA, target, "\\neq");
                        solLines.push(...res.lines);
                        finalAnsStr = `x \\neq ${formatFracPure(res.finalVal)}`;
                    } else { 
                        solLines.push(`\\text{The absolute value is not equal to } ${formatFracPure(isolatedC)}`);
                        solLines.push(`\\text{so the inside must be different from both } ${formatFracPure(isolatedC)} \\text{ and } ${formatFracPure(makeFrac(-isolatedC.num, isolatedC.den))}`);
                        
                        solLines.push(`\\text{First excluded value:}`);
                        const target1 = subFrac(isolatedC, fracB);
                        const res1 = solveLinearStep(fracA, target1, "=");
                        solLines.push(...res1.lines);
                        
                        solLines.push(`\\text{Second excluded value:}`);
                        const negC = makeFrac(-isolatedC.num, isolatedC.den);
                        const target2 = subFrac(negC, fracB);
                        const res2 = solveLinearStep(fracA, target2, "=");
                        solLines.push(...res2.lines);
                        
                        const v1 = res1.finalVal, v2 = res2.finalVal;
                        if (compFrac(v1, v2) === 0) {
                            finalAnsStr = `x \\neq ${formatFracPure(v1)}`;
                        } else {
                            const [first, second] = compFrac(v1, v2) < 0 ? [v1, v2] : [v2, v1];
                            finalAnsStr = `x \\neq ${formatFracPure(first)} \\quad\\text{and}\\quad x \\neq ${formatFracPure(second)}`;
                        }
                    }
                }
                else if (cCmp < 0) {
                    if (op === "=" || op === "<" || op === "\\le") {
                        solLines.push(`\\text{Since absolute values are non-negative, it cannot be less than or equal to a negative value.}`);
                        finalAnsStr = "\\text{No solution}";
                    } else {
                        solLines.push(`\\text{Since absolute values are non-negative, it is always greater than a negative value.}`);
                        finalAnsStr = "x \\in \\mathbb{R}";
                    }
                }
                else if (cCmp === 0) {
                    if (op === "=" || op === "\\le") {
                        solLines.push(`\\text{An absolute value expression equals } 0 \\text{ if and only if its argument equals } 0:`);
                        solLines.push(`${innerExpr} = 0`);
                        const target = makeFrac(-fracB.num, fracB.den);
                        const res = solveLinearStep(fracA, target, "=");
                        solLines.push(...res.lines);
                        finalAnsStr = `x = ${formatFracPure(res.finalVal)}`;
                    } else if (op === "<") {
                        solLines.push(`\\text{An absolute value expression can never be strictly less than } 0.`);
                        finalAnsStr = "\\text{No solution}";
                    } else if (op === "\\ge") {
                        solLines.push(`\\text{An absolute value expression is always } \\ge 0 \\text{ for all real values.}`);
                        finalAnsStr = "x \\in \\mathbb{R}";
                    } else if (op === ">") {
                        solLines.push(`\\text{The expression holds true everywhere except where the absolute value equals } 0:`);
                        solLines.push(`${innerExpr} \\neq 0`);
                        const target = makeFrac(-fracB.num, fracB.den);
                        const res = solveLinearStep(fracA, target, "\\neq");
                        solLines.push(...res.lines);
                        finalAnsStr = `x \\neq ${formatFracPure(res.finalVal)}`;
                    }
                }
                else { 
                    const negC = makeFrac(-isolatedC.num, isolatedC.den);

                    if (op === "=") {
                        solLines.push(`\\text{Split the absolute value equation into two separate cases:}`);
                        solLines.push(`${innerExpr} = ${formatFracPure(isolatedC)} \\quad\\text{or}\\quad ${innerExpr} = ${formatFracPure(negC)}`);

                        solLines.push(`\\text{Case 1:}`);
                        const target1 = subFrac(isolatedC, fracB);
                        const res1 = solveLinearStep(fracA, target1, "=");
                        solLines.push(...res1.lines);

                        solLines.push(`\\text{Case 2:}`);
                        const target2 = subFrac(negC, fracB);
                        const res2 = solveLinearStep(fracA, target2, "=");
                        solLines.push(...res2.lines);

                        finalAnsStr = `x = ${formatFracPure(res1.finalVal)} \\quad\\text{or}\\quad x = ${formatFracPure(res2.finalVal)}`;
                    }
                    else if (op === "<" || op === "\\le") {
                        solLines.push(`\\text{Rewrite the absolute value inequality as a compound inequality:}`);
                        solLines.push(`${formatFracPure(negC)} ${op} ${innerExpr} ${op} ${formatFracPure(isolatedC)}`);

                        const targetL = subFrac(negC, fracB);
                        const targetR = subFrac(isolatedC, fracB);
                        solLines.push(`${formatFracPure(targetL)} ${op} ${formatLin(fracA, makeFrac(0))} ${op} ${formatFracPure(targetR)}`);

                        const finalValL = divFrac(targetL, fracA);
                        const finalValR = divFrac(targetR, fracA);

                        if (fracA.num < 0) {
                            const flippedOp = flipOp(op);
                            solLines.push(`\\text{Divide/multiply to isolate x, reversing the inequality signs:}`);
                            solLines.push(`${formatFracPure(finalValL)} ${flippedOp} x ${flippedOp} ${formatFracPure(finalValR)}`);
                            let lowerOp = flippedOp === "\\ge" ? "\\ge" : ">";
                            let upperOp = flippedOp === "\\ge" ? "\\le" : "<";
                            finalAnsStr = formatInterval("AND", finalValR, lowerOp, finalValL, upperOp);
                        } else {
                            solLines.push(`\\text{Divide/multiply to isolate x:}`);
                            solLines.push(`${formatFracPure(finalValL)} ${op} x ${op} ${formatFracPure(finalValR)}`);
                            let lowerOp = op === "\\le" ? "\\ge" : ">";
                            let upperOp = op === "\\le" ? "\\le" : "<";
                            finalAnsStr = formatInterval("AND", finalValL, lowerOp, finalValR, upperOp);
                        }
                    }
                    else if (op === ">" || op === "\\ge") {
                        const opLeft = op === ">" ? "<" : "\\le";
                        solLines.push(`\\text{Split into two separate inequalities:}`);
                        solLines.push(`${innerExpr} ${opLeft} ${formatFracPure(negC)} \\quad\\text{or}\\quad ${innerExpr} ${op} ${formatFracPure(isolatedC)}`);

                        solLines.push(`\\text{Solve the first inequality:}`);
                        const targetL = subFrac(negC, fracB);
                        const resL = solveLinearStep(fracA, targetL, opLeft);
                        solLines.push(...resL.lines);

                        solLines.push(`\\text{Solve the second inequality:}`);
                        const targetR = subFrac(isolatedC, fracB);
                        const resR = solveLinearStep(fracA, targetR, op);
                        solLines.push(...resR.lines);

                        if (compFrac(resL.finalVal, resR.finalVal) < 0) {
                            finalAnsStr = formatInterval("OR", resL.finalVal, resL.finalOp, resR.finalVal, resR.finalOp);
                        } else {
                            finalAnsStr = formatInterval("OR", resR.finalVal, resR.finalOp, resL.finalVal, resL.finalOp);
                        }
                    }
                }
            } 
            // ==========================================
            // 6C. POLYNOMIAL RHS SOLVER (Cx + D)
            // ==========================================
            else {
                const negCx = makeFrac(-isoPolyRHS.x.num, isoPolyRHS.x.den);
                const negCc = makeFrac(-isoPolyRHS.c.num, isoPolyRHS.c.den);

                if (op === "=" || op === "\\neq") {
                    solLines.push(`\\text{Split into two cases. Note: valid solutions must satisfy } ${formatLin(isoPolyRHS.x, isoPolyRHS.c)} \\ge 0`);
                    
                    solLines.push(`\\text{Case 1:}`);
                    const res1 = solveIneqStep(fracA, fracB, isoPolyRHS.x, isoPolyRHS.c, op);
                    solLines.push(...res1.lines);
                    
                    solLines.push(`\\text{Case 2:}`);
                    const res2 = solveIneqStep(fracA, fracB, negCx, negCc, op);
                    solLines.push(...res2.lines);
                    
                    finalAnsStr = `x ${op} ${formatFracPure(res1.finalVal)} \\quad\\text{or}\\quad x ${op} ${formatFracPure(res2.finalVal)}`;
                    solLines.push(`\\text{(Make sure to plug these back into the right side to check for extraneous solutions!)}`);
                }
                else if (op === "<" || op === "\\le") {
                    solLines.push(`\\text{Rewrite as a compound inequality:}`);
                    solLines.push(`${formatLin(negCx, negCc)} ${op} ${innerExpr} \\text{ and } ${innerExpr} ${op} ${formatLin(isoPolyRHS.x, isoPolyRHS.c)}`);
                    solLines.push(`\\text{Solve the two inequalities separately:}`);
                    
                    solLines.push(`\\text{Part 1:}`);
                    const res1 = solveIneqStep(negCx, negCc, fracA, fracB, op);
                    solLines.push(...res1.lines);
                    
                    solLines.push(`\\text{Part 2:}`);
                    const res2 = solveIneqStep(fracA, fracB, isoPolyRHS.x, isoPolyRHS.c, op);
                    solLines.push(...res2.lines);
                    
                    let isRes1Lower = res1.finalOp === "\\ge" || res1.finalOp === ">";
                    let lowerRes = isRes1Lower ? res1 : res2;
                    let upperRes = isRes1Lower ? res2 : res1;
                    
                    finalAnsStr = formatInterval("AND", lowerRes.finalVal, lowerRes.finalOp, upperRes.finalVal, upperRes.finalOp);
                }
                else if (op === ">" || op === "\\ge") {
                    const opLeft = op === ">" ? "<" : "\\le";
                    solLines.push(`\\text{Split into two separate inequalities:}`);
                    
                    solLines.push(`\\text{Case 1:}`);
                    const res1 = solveIneqStep(fracA, fracB, negCx, negCc, opLeft);
                    solLines.push(...res1.lines);
                    
                    solLines.push(`\\text{Case 2:}`);
                    const res2 = solveIneqStep(fracA, fracB, isoPolyRHS.x, isoPolyRHS.c, op);
                    solLines.push(...res2.lines);
                    
                    let isRes1UpperBounded = res1.finalOp === "\\le" || res1.finalOp === "<";
                    let leftSideRes = isRes1UpperBounded ? res1 : res2; 
                    let rightSideRes = isRes1UpperBounded ? res2 : res1;
                    
                    finalAnsStr = formatInterval("OR", leftSideRes.finalVal, leftSideRes.finalOp, rightSideRes.finalVal, rightSideRes.finalOp);
                }
            }

            solLines.push(`\\text{Final Answer: } ${finalAnsStr}`);
            const cleanSolLines = solLines.filter((line, index) => index === 0 || line !== solLines[index - 1]);

            return {
                expr: `\\begin{aligned} &\\text{Solve:} \\\\[0.8em] &\\quad ${exprStr} \\end{aligned}`,
                ans: finalAnsStr,
                sol: `\\begin{aligned}\n& ` + cleanSolLines.join(` \\\\[0.8em]\n& `) + `\n\\end{aligned}`
            };
        },
        //# Family: Solving Radical Equations (\sqrt{f(x)} = g(x), \sqrt{f(x)} = \sqrt{g(x)}, \sqrt{f(x)} \pm \sqrt{g(x)} = h(x), etc.)
        (fInput, gInput, typeInput, hInput) => {
            // typeInput options: "constant", "linear", "quadratic", "radical", 
            //                     "double_radical_zero", "double_radical_const", "triple_radical"
            let gType = typeInput || "linear";
            let signBetweenRads = fInput && String(fInput).includes('-') ? -1 : 1; 
            const solLines = [];

            // ==========================================
            // 1. Core fraction arithmetic helper functions
            // ==========================================
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            const makeFrac = (n, d = 1) => {
                if (d === 0) throw new Error("Denominator cannot be zero");
                if (d < 0) { n = -n; d = -d; }
                const g = gcd(n, d);
                return { num: n / g, den: d / g };
            };
            const addFrac = (f1, f2) => makeFrac(f1.num * f2.den + f2.num * f1.den, f1.den * f2.den);
            const subFrac = (f1, f2) => makeFrac(f1.num * f2.den - f2.num * f1.den, f1.den * f2.den);
            const multFrac = (f1, f2) => makeFrac(f1.num * f2.num, f1.den * f2.den);
            const divFrac = (f1, f2) => makeFrac(f1.num * f2.den, f1.den * f2.num);
            const compFrac = (f1, f2) => (f1.num * f2.den) - (f2.num * f1.den);

            const floatToFrac = (val) => {
                if (Number.isInteger(val)) return makeFrac(val, 1);
                const eps = 1.0e-6;
                let absVal = Math.abs(val);
                for (let d = 1; d <= 2000; d++) {
                    let n = Math.round(absVal * d);
                    if (Math.abs(absVal - n / d) < eps) {
                        return makeFrac(val < 0 ? -n : n, d);
                    }
                }
                return makeFrac(Math.round(val * 10000), 10000);
            };

            const parseInput = (val, defaultNum = 1, defaultDen = 1) => {
                if (!val && val !== 0) return makeFrac(defaultNum, defaultDen);
                if (typeof val === 'object' && 'num' in val) return makeFrac(val.num, val.den || 1);
                if (typeof val === 'string') {
                    val = val.replace(/\s+/g, '');
                    if (val.includes('frac')) {
                        const isNeg = val.startsWith('-');
                        const match = val.match(/\\(?:d|t)?frac\s*\{\s*(-?\d+)\s*\}\s*\{\s*(-?\d+)\s*\}/);
                        if (match) {
                            let n = parseInt(match[1], 10);
                            let d = parseInt(match[2], 10);
                            if (isNeg) n = -n;
                            if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                        }
                    }
                    if (val.includes('/')) {
                        const parts = val.split('/');
                        const n = parseInt(parts[0], 10);
                        const d = parseInt(parts[1], 10);
                        if (!isNaN(n) && !isNaN(d) && d !== 0) return makeFrac(n, d);
                    }
                    const n = Number(val);
                    if (!isNaN(n)) return floatToFrac(n);
                }
                if (typeof val === 'number' && !isNaN(val)) return floatToFrac(val);
                return makeFrac(defaultNum, defaultDen);
            };

            const parsePoly = (strOrArr) => {
                if (Array.isArray(strOrArr)) {
                    return strOrArr.map(v => typeof v === 'object' ? v : makeFrac(v));
                }
                let poly = [makeFrac(0), makeFrac(0), makeFrac(0), makeFrac(0), makeFrac(0)]; 
                if (!strOrArr && strOrArr !== 0) return poly;
                if (typeof strOrArr === 'number') return [floatToFrac(strOrArr)];
                
                let str = String(strOrArr).replace(/\s+/g, '').replace(/-/g, '+-');
                let terms = str.split('+').filter(t => t !== '');

                for (let term of terms) {
                    if (term.includes('x^2')) {
                        let coeffStr = term.replace('x^2', '');
                        if (coeffStr === '') coeffStr = '1';
                        if (coeffStr === '-') coeffStr = '-1';
                        poly[2] = parseInput(coeffStr);
                    } else if (term.includes('x')) {
                        let coeffStr = term.replace('x', '');
                        if (coeffStr === '') coeffStr = '1';
                        if (coeffStr === '-') coeffStr = '-1';
                        poly[1] = parseInput(coeffStr);
                    } else {
                        poly[0] = addFrac(poly[0], parseInput(term));
                    }
                }
                return poly;
            };

            const polyAdd = (p1, p2) => {
                const res = [];
                const maxLen = Math.max(p1.length, p2.length);
                for (let i = 0; i < maxLen; i++) {
                    res.push(addFrac(p1[i] || makeFrac(0), p2[i] || makeFrac(0)));
                }
                return res;
            };

            const polySub = (p1, p2) => {
                const res = [];
                const maxLen = Math.max(p1.length, p2.length);
                for (let i = 0; i < maxLen; i++) {
                    res.push(subFrac(p1[i] || makeFrac(0), p2[i] || makeFrac(0)));
                }
                return res;
            };

            const polyMult = (p1, p2) => {
                const res = Array(p1.length + p2.length - 1).fill(null).map(() => makeFrac(0));
                for (let i = 0; i < p1.length; i++) {
                    for (let j = 0; j < p2.length; j++) {
                        res[i + j] = addFrac(res[i + j], multFrac(p1[i], p2[j]));
                    }
                }
                return res;
            };

            const formatFracPure = (f) => {
                if (f.num === 0) return "0";
                if (f.den === 1) return f.num.toString();
                return f.num < 0 ? `-\\frac{${Math.abs(f.num)}}{${f.den}}` : `\\frac{${f.num}}{${f.den}}`;
            };

            const formatPoly = (p) => {
                let terms = [];
                for (let i = p.length - 1; i >= 0; i--) {
                    if (p[i].num === 0) continue;
                    let absFracStr = formatFracPure(makeFrac(Math.abs(p[i].num), p[i].den));
                    let sign = p[i].num > 0 ? " + " : " - ";
                    if (terms.length === 0 && p[i].num > 0) sign = "";
                    if (terms.length === 0 && p[i].num < 0) sign = "-";

                    let xTerm = i === 1 ? "x" : i > 1 ? `x^${i}` : "";
                    let coeff = (absFracStr === "1" && i > 0) ? "" : absFracStr;

                    terms.push(`${sign}${coeff}${xTerm}`);
                }
                return terms.length === 0 ? "0" : terms.join("");
            };

            // ==========================================
            // 2. AUTO-ENGINE INTERCEPTOR
            // ==========================================
            if (typeof fInput === 'number' && typeof gInput === 'number') {
                const types = ["constant", "linear", "quadratic", "radical", "double_radical_zero", "double_radical_const", "triple_radical"];
                gType = types[Math.floor(Math.random() * types.length)];
                let targetX = Math.floor(Math.random() * 4) + 1;
                
                if (gType === "constant") {
                    fInput = `x + 3`; gInput = `2`;
                } else if (gType === "linear") {
                    fInput = `2x + ${targetX * targetX - 2 * targetX}`; gInput = `x`;
                } else if (gType === "quadratic") {
                    fInput = `x + 2`; gInput = `x^2 - 2`;
                } else if (gType === "radical") {
                    fInput = `3x + 1`; gInput = `x + 5`;
                } else if (gType === "double_radical_zero") {
                    fInput = "2x + 5"; gInput = "x + 9";
                } else if (gType === "double_radical_const") {
                    fInput = "x + 7"; gInput = "x + 2"; hInput = "5";
                } else if (gType === "triple_radical") {
                    fInput = "3x + 1"; gInput = "x + 1"; hInput = "x + 4";
                }
            }

            // ==========================================
            // 3. Complete Explicit Type Processing Engine
            // ==========================================
            let polyF = parsePoly(fInput);
            let polyG = parsePoly(gInput);
            let polyH = hInput ? parsePoly(hInput) : [makeFrac(0)];

            let exprStr = "";
            let finalEqPoly = [];

            // --- CASE 1: CONSTANT / LINEAR / QUADRATIC ---
            if (gType === "constant" || gType === "linear" || gType === "quadratic") {
                exprStr = `\\sqrt{${formatPoly(polyF)}} = ${formatPoly(polyG)}`;
                solLines.push(`\\text{Given the radical expression: } ${exprStr}`);
                
                if (gType === "constant" && compFrac(polyG[0], makeFrac(0)) < 0) {
                    solLines.push(`\\text{Since the principal square root is non-negative, it cannot equal } ${formatFracPure(polyG[0])}.`);
                    return {
                        expr: `\\begin{aligned} &\\text{Solve:} \\\\[0.8em] &\\quad ${exprStr} \\end{aligned}`,
                        ans: "\\text{No solution}",
                        sol: `\\begin{aligned}\n& ` + solLines.join(` \\\\[0.8em]\n& `) + `\n\\end{aligned}`
                    };
                }
                if (gType !== "constant") {
                    solLines.push(`\\text{Set condition for valid domain constraints: } ${formatPoly(polyG)} \\ge 0`);
                }
                solLines.push(`\\text{Square both sides to eliminate the radical component:}`);
                solLines.push(`${formatPoly(polyF)} = \\left(${formatPoly(polyG)}\\right)^2`);
                let rhsPolyForSquaring = polyMult(polyG, polyG);
                solLines.push(`${formatPoly(polyF)} = ${formatPoly(rhsPolyForSquaring)}`);
                finalEqPoly = polySub(polyF, rhsPolyForSquaring);
            } 
            // --- CASE 2: RADICAL (\sqrt{f(x)} = \sqrt{g(x)}) ---
            else if (gType === "radical") {
                exprStr = `\\sqrt{${formatPoly(polyF)}} = \\sqrt{${formatPoly(polyG)}}`;
                solLines.push(`\\text{Given the radical expression: } ${exprStr}`);
                solLines.push(`\\text{Square both sides to eliminate the radical components:}`);
                solLines.push(`${formatPoly(polyF)} = ${formatPoly(polyG)}`);
                finalEqPoly = polySub(polyF, polyG);
            } 
            // --- CASE 3: DOUBLE RADICAL ZERO (\sqrt{} - \sqrt{} = 0) ---
            else if (gType === "double_radical_zero") {
                exprStr = `\\sqrt{${formatPoly(polyF)}} - \\sqrt{${formatPoly(polyG)}} = 0`;
                solLines.push(`\\text{Given the radical expression: } ${exprStr}`);
                solLines.push(`\\text{Isolate one radical on the right side:}`);
                solLines.push(`\\sqrt{${formatPoly(polyF)}} = \\sqrt{${formatPoly(polyG)}}`);
                solLines.push(`\\text{Square both sides to clear the radicals:}`);
                solLines.push(`${formatPoly(polyF)} = ${formatPoly(polyG)}`);
                finalEqPoly = polySub(polyF, polyG);
            } 
            // --- CASE 4: DOUBLE RADICAL CONSTANT (\sqrt{} \pm \sqrt{} = e) ---
            else if (gType === "double_radical_const") {
                let opSign = signBetweenRads === -1 ? "-" : "+";
                exprStr = `\\sqrt{${formatPoly(polyF)}} ${opSign} \\sqrt{${formatPoly(polyG)}} = ${formatPoly(polyH)}`;
                solLines.push(`\\text{Given the radical expression: } ${exprStr}`);
                solLines.push(`\\text{Isolate one radical component on the left side:}`);
                
                let rSignStr = signBetweenRads === -1 ? "+" : "-";
                solLines.push(`\\sqrt{${formatPoly(polyF)}} = ${formatPoly(polyH)} ${rSignStr} \\sqrt{${formatPoly(polyG)}}`);
                solLines.push(`\\text{Square both sides of the equation:}`);
                solLines.push(`${formatPoly(polyF)} = \\left(${formatPoly(polyH)} ${rSignStr} \\sqrt{${formatPoly(polyG)}}\\right)^2`);

                let polyHSquared = polyMult(polyH, polyH);
                solLines.push(`${formatPoly(polyF)} = ${formatPoly(polyHSquared)} ${rSignStr} 2\\left(${formatPoly(polyH)}\\right)\\sqrt{${formatPoly(polyG)}} + ${formatPoly(polyG)}`);
                
                let isolatedRHS = polySub(polyAdd(polyHSquared, polyG), polyF);
                let radCoeff = polyMult([makeFrac(2 * signBetweenRads)], polyH);
                
                solLines.push(`\\text{Group rational terms and isolate the remaining radical component:}`);
                solLines.push(`${formatPoly(radCoeff)}\\sqrt{${formatPoly(polyG)}} = ${formatPoly(isolatedRHS)}`);
                solLines.push(`\\text{Square both sides once more to clear the final radical:}`);
                
                let radCoeffSquared = polyMult(radCoeff, radCoeff);
                let lhsFinal = polyMult(radCoeffSquared, polyG);
                let rhsFinal = polyMult(isolatedRHS, isolatedRHS);
                
                solLines.push(`\\left(${formatPoly(radCoeff)}\\right)^2 \\left(${formatPoly(polyG)}\\right) = \\left(${formatPoly(isolatedRHS)}\\right)^2`);
                solLines.push(`${formatPoly(lhsFinal)} = ${formatPoly(rhsFinal)}`);
                finalEqPoly = polySub(lhsFinal, rhsFinal);
            } 
            // --- CASE 5: TRIPLE RADICAL ---
            else if (gType === "triple_radical") {
                exprStr = `\\sqrt{${formatPoly(polyF)}} - \\sqrt{${formatPoly(polyG)}} = \\sqrt{${formatPoly(polyH)}}`;
                solLines.push(`\\text{Given the radical expression: } ${exprStr}`);
                solLines.push(`\\text{Rearrange terms to render all radical coefficients positive:}`);
                solLines.push(`\\sqrt{${formatPoly(polyF)}} = \\sqrt{${formatPoly(polyH)}} + \\sqrt{${formatPoly(polyG)}}`);
                solLines.push(`\\text{Square both sides to initiate elimination:}`);
                solLines.push(`${formatPoly(polyF)} = \\left(\\sqrt{${formatPoly(polyH)}} + \\sqrt{${formatPoly(polyG)}}\\right)^2`);
                solLines.push(`${formatPoly(polyF)} = ${formatPoly(polyH)} + 2\\sqrt{\\left(${formatPoly(polyH)}\\right)\\left(${formatPoly(polyG)}\\right)} + ${formatPoly(polyG)}`);
                
                let isolatedRHS = polySub(polySub(polyF, polyH), polyG);
                let polyHGProd = polyMult(polyH, polyG);
                
                solLines.push(`\\text{Isolate the combined cross-multiplied radical term:}`);
                solLines.push(`2\\sqrt{${formatPoly(polyHGProd)}} = ${formatPoly(isolatedRHS)}`);
                solLines.push(`\\text{Square both sides a second time to clear the remaining root structure:}`);
                
                let lhsFinal = polyMult([makeFrac(4)], polyHGProd);
                let rhsFinal = polyMult(isolatedRHS, isolatedRHS);
                
                solLines.push(`4\\left(${formatPoly(polyHGProd)}\\right) = \\left(${formatPoly(isolatedRHS)}\\right)^2`);
                solLines.push(`${formatPoly(lhsFinal)} = ${formatPoly(rhsFinal)}`);
                finalEqPoly = polySub(lhsFinal, rhsFinal);
            }

            solLines.push(`\\text{Group all terms onto one side to evaluate structural roots:}`);
            solLines.push(`${formatPoly(finalEqPoly)} = 0`);

            // ==========================================
            // 4. Algebraic Solver (Linear or Quadratic)
            // ==========================================
            let candidates = [];
            while (finalEqPoly.length > 0 && finalEqPoly[finalEqPoly.length - 1].num === 0) {
                finalEqPoly.pop();
            }
            let degree = finalEqPoly.length - 1;

            if (degree === 1) {
                let c0 = finalEqPoly[0];
                let c1 = finalEqPoly[1];
                let root = divFrac(makeFrac(-c0.num, c0.den), c1);
                candidates.push(root);
                solLines.push(`\\text{Isolate linear systems: } x = ${formatFracPure(root)}`);
            } 
            else if (degree === 2) {
                let c0 = finalEqPoly[0];
                let c1 = finalEqPoly[1];
                let c2 = finalEqPoly[2];

                solLines.push(`\\text{Apply the quadratic formula where } a = ${formatFracPure(c2)}, b = ${formatFracPure(c1)}, c = ${formatFracPure(c0)}:`);
                let bSq = multFrac(c1, c1);
                let fourAC = multFrac(makeFrac(4), multFrac(c2, c0));
                let disc = subFrac(bSq, fourAC);

                solLines.push(`\\Delta = b^2 - 4ac = ${formatFracPure(disc)}`);
                let discFloat = disc.num / disc.den;

                if (discFloat < 0) {
                    solLines.push(`\\text{Since } \\Delta < 0 \\text{, there are no real coordinates found.}`);
                } else if (discFloat === 0) {
                    let root = divFrac(makeFrac(-c1.num, c1.den), multFrac(makeFrac(2), c2));
                    candidates.push(root);
                    solLines.push(`\\text{Double root simplification: } x = ${formatFracPure(root)}`);
                } else {
                    let sqrtDisc = Math.sqrt(discFloat);
                    if (Number.isInteger(sqrtDisc)) {
                        let discFracRoot = makeFrac(sqrtDisc, 1);
                        let r1 = divFrac(subFrac(makeFrac(-c1.num, c1.den), discFracRoot), multFrac(makeFrac(2), c2));
                        let r2 = divFrac(addFrac(makeFrac(-c1.num, c1.den), discFracRoot), multFrac(makeFrac(2), c2));
                        candidates.push(r1, r2);
                        solLines.push(`\\text{Roots evaluated: } x = ${formatFracPure(r1)} \\quad\\text{or}\\quad x = ${formatFracPure(r2)}`);
                    } else {
                        let r1_val = (-c1.num/c1.den - sqrtDisc) / (2 * c2.num/c2.den);
                        let r2_val = (-c1.num/c1.den + sqrtDisc) / (2 * c2.num/c2.den);
                        candidates.push({num: r1_val, den: 1, isFloat: true}, {num: r2_val, den: 1, isFloat: true});
                        solLines.push(`\\text{Roots evaluated: } x \\approx ${r1_val.toFixed(3)} \\quad\\text{or}\\quad x \\approx ${r2_val.toFixed(3)}`);
                    }
                }
            } else {
                solLines.push(`\\text{Equation degree [${degree}] requires higher-order numerical factorization techniques.}`);
            }

            // ==========================================
            // 5. Extraneous Verification Step
            // ==========================================
            let validRoots = [];
            if (candidates.length > 0) {
                solLines.push(`\\text{Verify candidates to isolate extraneous solutions:}`);
                
                for (let cand of candidates) {
                    let val = cand.isFloat ? cand.num : cand.num / cand.den;
                    let candStr = cand.isFloat ? val.toFixed(3) : formatFracPure(cand);

                    const evalP = (p) => {
                        let sum = 0;
                        for (let i = 0; i < p.length; i++) { sum += (p[i].num / p[i].den) * Math.pow(val, i); }
                        return sum;
                    };

                    let fVal = evalP(polyF);
                    let gVal = evalP(polyG);
                    let hVal = evalP(polyH);

                    let lhsCheck = 0;
                    let rhsCheck = 0;

                    if (gType === "constant" || gType === "linear" || gType === "quadratic") {
                        lhsCheck = fVal >= 0 ? Math.sqrt(fVal) : -1;
                        rhsCheck = gVal;
                    } else if (gType === "radical" || gType === "double_radical_zero") {
                        lhsCheck = fVal >= 0 ? Math.sqrt(fVal) : -1;
                        rhsCheck = gVal >= 0 ? Math.sqrt(gVal) : -2;
                    } else if (gType === "double_radical_const") {
                        lhsCheck = (fVal >= 0 ? Math.sqrt(fVal) : -1) + signBetweenRads * (gVal >= 0 ? Math.sqrt(gVal) : -5);
                        rhsCheck = hVal;
                    } else if (gType === "triple_radical") {
                        lhsCheck = (fVal >= 0 ? Math.sqrt(fVal) : -1) - (gVal >= 0 ? Math.sqrt(gVal) : -5);
                        rhsCheck = hVal >= 0 ? Math.sqrt(hVal) : -10;
                    }
                    
                    if (fVal >= 0 && (gType === "constant" || gType === "linear" || gType === "quadratic" || gVal >= 0) && (gType !== "triple_radical" || hVal >= 0) && Math.abs(lhsCheck - rhsCheck) < 1e-5) {
                        validRoots.push(candStr);
                        solLines.push(`\\bullet\\, x = ${candStr} \\implies \\text{Valid}`);
                    } else {
                        solLines.push(`\\bullet\\, x = ${candStr} \\implies \\text{Extraneous}`);
                    }
                }
            }

            validRoots = [...new Set(validRoots)];
            let finalAnsStr = validRoots.length === 0 ? "\\text{No solution}" : validRoots.map(r => `x = ${r}`).join(` \\quad\\text{or}\\quad `);
            solLines.push(`\\text{Final Answer: } ${finalAnsStr}`);

            const cleanSolLines = solLines.filter((line, index) => index === 0 || line !== solLines[index - 1]);

            return {
                expr: `\\begin{aligned} &\\text{Solve:} \\\\[0.8em] &\\quad ${exprStr} \\end{aligned}`,
                ans: finalAnsStr,
                sol: `\\begin{aligned}\n& ` + cleanSolLines.join(` \\\\[0.8em]\n& `) + `\n\\end{aligned}`
            };
        }
    ],
    hard: [
        //# Family: Solving Higher Degree Polynomials (degree 3 or 4 and Bicareer Equations) 
        (a, b, c, d) => {
            // 1. Core mathematical helpers
            const gcd = (m, n) => n === 0 ? Math.abs(m) : gcd(n, m % n);
            
            // Helper to find the GCD of an entire array of coefficients
            const arrayGcd = (arr) => arr.reduce((acc, val) => gcd(acc, Math.abs(val)), 0);

            const makeFrac = (n, den = 1) => {
                if (den < 0) { n = -n; den = -den; }
                let g = gcd(n, den);
                return { num: n / g, den: den / g };
            };
            
            const simplifyRadical = (n) => {
                let out = 1; let inside = n;
                for (let i = 2; i * i <= inside; i++) {
                    while (inside % (i * i) === 0) { out *= i; inside /= (i * i); }
                }
                return { out, in: inside };
            };

            const multPoly = (p1, p2) => {
                let res = new Array(p1.length + p2.length - 1).fill(0);
                for (let i = 0; i < p1.length; i++) {
                    for (let j = 0; j < p2.length; j++) { res[i + j] += p1[i] * p2[j]; }
                }
                return res;
            };

            const divideLinear = (poly, divisor, n) => {
                let res = [];
                let current = 0;
                for (let i = 0; i < poly.length - 1; i++) {
                    let coeff = Math.round((poly[i] + current) / divisor);
                    res.push(coeff);
                    current = coeff * n;
                }
                return res;
            };

            const buildTerm = (isNeg, isFirst, power, variable, coeffStr) => {
                let str = "";
                if (isFirst) {
                    if (isNeg) str += "-";
                } else {
                    str += isNeg ? " - " : " + ";
                }

                let varPart = power > 1 ? `${variable}^${power}` : (power === 1 ? variable : "");
                
                if (coeffStr !== "1" || power === 0 || coeffStr.includes("\\frac")) {
                    str += coeffStr;
                }
                return str + varPart;
            };

            const formatPolyFrac = (coeffsFrac, variable = "x") => {
                let str = "";
                let deg = coeffsFrac.length - 1;
                let firstRendered = false;
                
                for (let i = 0; i <= deg; i++) {
                    let f = coeffsFrac[i];
                    if (f.num === 0) continue;
                    
                    let absNum = Math.abs(f.num);
                    let coeffStr = f.den === 1 ? absNum.toString() : `\\frac{${absNum}}{${f.den}}`;
                    
                    str += buildTerm(f.num < 0, !firstRendered, deg - i, variable, coeffStr);
                    firstRendered = true;
                }
                return firstRendered ? str : "0";
            };

            const formatPolyInt = (coeffs, variable = "x") => {
                let str = "";
                let deg = coeffs.length - 1;
                let firstRendered = false;
                
                for (let i = 0; i <= deg; i++) {
                    if (coeffs[i] === 0) continue;
                    str += buildTerm(coeffs[i] < 0, !firstRendered, deg - i, variable, Math.abs(coeffs[i]).toString());
                    firstRendered = true;
                }
                return firstRendered ? str : "0";
            };

            const formatBiquadRoot = (u) => {
                let isReal = u > 0;
                let rad = simplifyRadical(Math.abs(u));
                let coeff = rad.out === 1 ? "" : rad.out;
                let imag = isReal ? "" : "i";
                
                if (rad.in === 1) return `\\pm ${coeff || (isReal ? 1 : "")}${imag}`;
                return `\\pm ${coeff}${imag}\\sqrt{${rad.in}}`;
            };

            const formatLinearFactor = (n, d) => `(${d === 1 ? "x" : `${d}x`} ${n > 0 ? "-" : "+"} ${Math.abs(n)})`;

            // 2. Control Loops and Setup
            let mode = Math.abs(a) % 3;
            let isFractional = (Math.abs(a + b) % 2 === 0); 
            
            let shift = 0;
            let maxIters = 1000; 
            let finalPolyInt, fracPoly, L, currentSign;
            let d1, n1, d2, n2, p, q, u1, u2;

            while (maxIters-- > 0) {
                if (mode === 0 || mode === 1) {
                    d1 = (Math.abs(b + shift) % 2) + 1; 
                    n1 = (Math.abs(c + shift) % 5) - 2; 
                    if (n1 === 0) n1 = 1; 

                    // FIX 1: Force d1 and n1 to be coprime immediately upon generation
                    let g1 = gcd(Math.abs(n1), d1);
                    d1 /= g1;
                    n1 /= g1;

                    d2 = 1;
                    n2 = (Math.abs(a + b + shift) % 5) - 2;
                    if (n2 === 0) n2 = 2;
                    if (n1 * d2 === n2 * d1) n2 = -n1; 

                    p = (Math.abs(d + shift) % 5) - 2; 
                    q = (Math.abs(a + c + shift) % 4) + 1; 
                    if (p * p - 4 * q >= 0) {
                        q = Math.floor((p * p) / 4) + 2; 
                    }

                    let poly_comp = [1, p, q];
                    finalPolyInt = (mode === 1) 
                        ? multPoly(multPoly([d1, -n1], [d2, -n2]), poly_comp)
                        : multPoly([d1, -n1], poly_comp);
                } else {
                    let u1IsPos = (Math.abs(b + shift) % 2 === 0);
                    let u2IsPos = (Math.abs(c + shift) % 2 === 1); 
                    
                    u1 = ((Math.abs(b + shift) % 4) + 1) * (u1IsPos ? 1 : -1);
                    u2 = ((Math.abs(c + shift) % 4) + 1) * (u2IsPos ? 1 : -1);
                    if (u1 === u2) u2 = -u2;

                    p = -(u1 + u2);
                    q = u1 * u2;
                    finalPolyInt = [1, 0, p, 0, q];
                }

                // FIX 2: Safeguard reduction of the entire polynomial array to clear out shared constants
                let gAll = arrayGcd(finalPolyInt);
                if (gAll > 1) {
                    finalPolyInt = finalPolyInt.map(c => c / gAll);
                }

                L = isFractional ? [12, 24, 30, 42, 60][Math.abs(a + b + shift) % 5] : 1;
                currentSign = ((c + d + shift) % 2 === 0) ? -1 : 1;
                fracPoly = finalPolyInt.map(coeff => makeFrac(coeff * currentSign, L));

                let uniqueDens = new Set(fracPoly.filter(f => f.num !== 0).map(f => f.den));
                let targetUniques = isFractional ? (mode === 1 ? 3 : 2) : 1;

                if (uniqueDens.size >= targetUniques && fracPoly[0].num !== 0) break;
                shift++;
            }

            // 3. Step-by-Step Document Assembly
            let eq_str = `${formatPolyFrac(fracPoly)} = 0`;
            let solLines = [];
            let exprLabel = mode === 0 ? "\\text{Solve the degree 3 equation:}" : 
                            mode === 1 ? "\\text{Solve the degree 4 equation:}" : 
                            "\\text{Solve the biquadratic equation:}";

            if (isFractional) {
                solLines.push(`\\text{Given the polynomial equation with distinct fractional denominators:}`);
                solLines.push(`${eq_str}`);
                solLines.push(`\\text{Step 1: Eliminate all fractional denominators by multiplying through by the LCM } (${L}):`);
                solLines.push(`${formatPolyInt(finalPolyInt.map(c => c * currentSign))} = 0`);

                if (currentSign === -1) {
                    solLines.push(`\\text{Normalize the equation by multiplying by } -1:`);
                    solLines.push(`${formatPolyInt(finalPolyInt)} = 0`);
                }
            } else {
                solLines.push(`\\text{Given the polynomial equation with integer coefficients:}`);
                solLines.push(`${eq_str}`);
                if (currentSign === -1) {
                    solLines.push(`\\text{Step 1: Normalize the equation by multiplying by } -1:`);
                    solLines.push(`${formatPolyInt(finalPolyInt)} = 0`);
                }
            }

            let currentStep = (isFractional || currentSign === -1) ? 2 : 1;
            let finalAnsStr = "";

            if (mode === 0 || mode === 1) {
                let root1_str = d1 === 1 ? `${n1}` : `\\frac{${n1}}{${d1}}`;
                let root2_str = `${n2}`;

                let D_inside = 4 * q - p * p;
                let rad = simplifyRadical(D_inside);
                
                const formatComplexRoot = (pVal, radOut, radIn) => { 
                    let g = gcd(Math.abs(-pVal), gcd(radOut, 2));
                    let A = -pVal / g; 
                    let B = radOut / g; 
                    let denom = 2 / g;
                    
                    let imagPart = B === 1 ? "i" : `${B}i`;
                    if (radIn !== 1) imagPart += `\\sqrt{${radIn}}`;
                    
                    let topPart = A === 0 ? `\\pm ${imagPart}` : `${A} \\pm ${imagPart}`;
                    return denom === 1 ? topPart : `\\frac{${topPart}}{${denom}}`;
                };

                let complexRootStr = formatComplexRoot(p, rad.out, rad.in);
                let factor1 = formatLinearFactor(n1, d1);

                solLines.push(`\\text{Step ${currentStep++}: Find a rational root using the Rational Root Theorem.}`);
                solLines.push(`\\text{Testing factors reveals a valid root at } x = ${root1_str} \\implies \\text{factor } ${factor1}.`);
                
                let intermediateCubic = divideLinear(finalPolyInt, d1, n1);
                solLines.push(`\\text{Step ${currentStep++}: Perform polynomial division to factor out } ${factor1}. \\text{ This perfectly reduces to:}`);
                solLines.push(`${factor1}\\left(${formatPolyInt(intermediateCubic)}\\right) = 0`);

                if (mode === 1) {
                    let factor2 = formatLinearFactor(n2, d2);
                    solLines.push(`\\text{Step ${currentStep++}: Apply the Rational Root Theorem to the remaining cubic factor.}`);
                    solLines.push(`\\text{Testing factors reveals another root at } x = ${root2_str} \\implies \\text{factor } ${factor2}.`);
                    
                    let intermediateQuadratic = divideLinear(intermediateCubic, d2, n2);
                    solLines.push(`\\text{Step ${currentStep++}: Divide the cubic factor by } ${factor2} \\text{ to leave the final quadratic expression:}`);
                    solLines.push(`${factor1}${factor2}\\left(${formatPolyInt(intermediateQuadratic)}\\right) = 0`);
                }

                solLines.push(`\\text{Step ${currentStep}: Solve the remaining irreducible quadratic component using the quadratic formula:}`);
                solLines.push(`${formatPolyInt([1, p, q])} = 0`);
                solLines.push(`x = \\frac{-${p < 0 ? `(${p})` : p} \\pm \\sqrt{${p}^2 - 4(1)(${q})}}{2(1)} = ${complexRootStr}`);

                finalAnsStr = mode === 1 
                    ? `x \\in \\left\\{ ${root1_str}, ${root2_str}, ${complexRootStr} \\right\\}` 
                    : `x \\in \\left\\{ ${root1_str}, ${complexRootStr} \\right\\}`;

            } else {
                let biquadRoot1 = formatBiquadRoot(u1);
                let biquadRoot2 = formatBiquadRoot(u2);

                solLines.push(`\\text{Step ${currentStep++}: Since the equation contains only even powers, substitute } u = x^2 \\text{ to yield a standard quadratic form:}`);
                solLines.push(`${formatPolyInt([1, p, q], "u")} = 0`);

                solLines.push(`\\text{Step ${currentStep++}: Factor or use the quadratic formula to solve for variable } u:`);
                
                const formatU = (val) => val < 0 ? `(u + ${Math.abs(val)})` : `(u - ${val})`;
                solLines.push(`\\text{Factoring yields: } ${formatU(u1)}${formatU(u2)} = 0 \\implies u = ${u1} \\quad \\text{and} \\quad u = ${u2}`);

                solLines.push(`\\text{Step ${currentStep}: Substitute back } x^2 = u \\text{ to solve for } x:`);
                solLines.push(`\\text{From } u = ${u1} \\implies x^2 = ${u1} \\implies x = ${biquadRoot1}`);
                solLines.push(`\\text{From } u = ${u2} \\implies x^2 = ${u2} \\implies x = ${biquadRoot2}`);

                finalAnsStr = `x \\in \\left\\{ ${biquadRoot1}, ${biquadRoot2} \\right\\}`;
            }

            solLines.push(`\\text{Final Solution Set:}`);
            solLines.push(finalAnsStr);

            return {
                expr: `\\begin{aligned} &${exprLabel} \\\\ & \\quad ${eq_str} \\end{aligned}`,
                ans: finalAnsStr,
                sol: `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`
            };
        },
        // Family: Logarithmic Equations
        (a, b, c, d) => {
            const bases = [2, 3, 4, 5];
            let base = bases[Math.abs(a) % 4];
            let exp = Math.abs(c) % 3 + 1; 
            let coeff = Math.abs(b) > 0 ? Math.abs(b) : 2;
            
            let powerVal = Math.pow(base, exp);
            let common = Utils.gcd ? Utils.gcd(powerVal, coeff) : 1;
            let num = powerVal / common;
            let den = coeff / common;
            let ansStr = den === 1 ? `${num}` : `\\frac{${num}}{${den}}`;
            
            return {
                expr: `\\log_{${base}}(${coeff}x) = ${exp}`,
                ans: `x = ${ansStr}`,
                sol: `\\begin{aligned}
                    &\\text{Convert to exponential form:} \\\\
                    &${coeff}x = ${base}^{${exp}} \\\\
                    &${coeff}x = ${powerVal} \\\\
                    &x = \\frac{${powerVal}}{${coeff}}${common > 1 ? ` = ${ansStr}` : ''}
                \\end{aligned}`
            };
        },
        // Family: Exponential Base Balancing
        (a, b, c, d) => {
            let shift = Math.abs(c) > 0 ? Math.abs(c) : 3;
            let ansX = 2 * shift;
            return {
                expr: `2^{x} = 4^{x - ${shift}}`,
                ans: `x = ${ansX}`,
                sol: `\\begin{aligned}
                    &\\text{Rewrite using common base } 2 \\text{ (since } 4 = 2^2): \\\\
                    &2^x = (2^2)^{x - ${shift}} \\\\
                    &2^x = 2^{2(x - ${shift})} \\\\
                    &\\text{Equate exponents:} \\\\
                    &x = 2(x - ${shift}) \\\\
                    &x = 2x - ${2 * shift} \\\\
                    &x = ${ansX}
                \\end{aligned}`
            };
        }
    ]
};
window.algebra = algebra;
