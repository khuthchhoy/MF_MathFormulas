
const algebra = {
    easy: [
        (a, b, c, d) => {
            // 1. Setup predictable coefficients to guarantee a balance of real and complex cases
            let A = Math.abs(a) % 4 + 1; // Keep A positive and small (1 to 4) for clean denominators
            let B = b % 7; 
            if (B === 0) B = 3;          // Prevent B from being 0 to keep linear term visible
            
            // Router: 0 = Real Roots (Disc >= 0), 1 = Complex Roots (Disc < 0)
            let variant = Math.abs(d) % 2;
            let C = 0;

            if (variant === 0) {
                // Force C to be negative to guarantee a positive discriminant (Real roots)
                C = -(Math.abs(c) % 5 + 1); 
            } else {
                // Force C to be large enough relative to B so that B^2 - 4AC < 0 (Complex roots)
                C = Math.floor((B * B) / (4 * A)) + Math.abs(c % 3) + 1;
            }

            const gcd = (x, y) => y === 0 ? Math.abs(x) : gcd(y, x % y);

            // Helper to extract square factors from a radical expression
            const simplifyRadical = (n) => {
                let outside = 1;
                let inside = n;
                for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
                    if (n % (i * i) === 0) {
                        outside = i;
                        inside = n / (i * i);
                        break;
                    }
                }
                return { outside, inside };
            };

            // Calculate Discriminant (Delta)
            let disc = B * B - 4 * A * C;
            let absDisc = Math.abs(disc);
            let isComplex = disc < 0;

            // 2. Format the initial quadratic equation string beautifully
            const formatTerm = (coeff, literal, isFirst) => {
                if (coeff === 0) return "";
                let sign = coeff > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
                let absC = Math.abs(coeff);
                let valStr = (absC === 1 && literal !== "") ? "" : `${absC}`;
                return `${sign}${valStr}${literal}`;
            };

            let exprStr = formatTerm(A, "x^2", true) + formatTerm(B, "x", false) + formatTerm(C, "", false) + " = 0";

            let ansStr = "";
            let solLines = [];

            solLines.push(`\\text{Identify coefficients: } a = ${A}, \\, b = ${B}, \\, c = ${C}`);
            solLines.push(`\\text{Calculate the discriminant } \\Delta = b^2 - 4ac:`);
            solLines.push(`\\Delta = (${B})^2 - 4(${A})(${C}) = ${B * B} - ${4 * A * C} = ${disc}`);

            // Scaffolding helper to insulate 1 and -1 constants from Utils.clean macro stripping
            const insulateConstant = (val) => Math.abs(val) === 1 ? `{${val}}` : `${val}`;
            let initialBStr = insulateConstant(-B);

            // 3. Resolve Root Calculations & Simplify Structural Layouts
            let sqrtVal = Math.sqrt(absDisc);
            let isSquare = Number.isInteger(sqrtVal);

            if (isSquare && !isComplex) {
                // Case A: Real Roots with Perfect Square Discriminant (Rational Numbers)
                solLines.push(`\\text{Since } \\Delta > 0 \\text{ and is a perfect square, we find two distinct rational roots.}`);
                
                let num1 = -B + sqrtVal;
                let num2 = -B - sqrtVal;
                let den = 2 * A;

                const formatFraction = (n, d) => {
                    if (n === 0) return "0";
                    let isNeg = (n < 0 && d > 0) || (n > 0 && d < 0);
                    let g = Math.abs(gcd(n, d));
                    let finalN = Math.abs(n) / g;
                    let finalD = Math.abs(d) / g;
                    if (finalD === 1) return isNeg ? `-${finalN}` : `${finalN}`;
                    return isNeg ? `-\\frac{${finalN}}{${finalD}}` : `\\frac{${finalN}}{${finalD}}`;
                };

                let r1 = formatFraction(num1, den);
                let r2 = formatFraction(num2, den);
                
                ansStr = r1 === r2 ? `x = ${r1}` : `x = ${r1}, \\quad x = ${r2}`;
                solLines.push(`x = \\frac{-(${B}) \\pm \\sqrt{${disc}}}{2(${A})} = \\frac{${initialBStr} \\pm ${sqrtVal}}{${den}}`);
                solLines.push(`\\text{Roots: } ${ansStr}`);

            } else if (isSquare && isComplex) {
                // Case B: Complex Roots with Perfect Square Magnitudes (e.g., -49 -> ±7i)
                solLines.push(`\\text{Since } \\Delta < 0, \\text{ we obtain two distinct complex conjugate roots.}`);
                
                let g = gcd(gcd(Math.abs(B), sqrtVal), 2 * A);
                let finalB = -B / g;
                let finalI = sqrtVal / g;
                let finalDen = (2 * A) / g;
                
                let iTerm = finalI === 1 ? "i" : `${finalI}i`;
                let bStr = finalB === 0 ? "" : insulateConstant(finalB);
                let combinedRoots = "";
                
                if (finalDen === 1) {
                    combinedRoots = finalB === 0 ? `\\pm ${iTerm}` : `${bStr} \\pm ${iTerm}`;
                } else {
                    combinedRoots = finalB === 0 ? `\\frac{\\pm ${iTerm}}{${finalDen}}` : `\\frac{${bStr} \\pm ${iTerm}}{${finalDen}}`;
                }
                
                ansStr = `x = ${combinedRoots}`;
                solLines.push(`x = \\frac{-(${B}) \\pm \\sqrt{${absDisc}}i}{2(${A})} = \\frac{${initialBStr} \\pm ${sqrtVal}i}{${2 * A}}`);
                solLines.push(`\\text{Simplify fractions: } ${ansStr}`);

            } else {
                // Case C: Irrational Real Roots OR Complex Roots with Radical Components
                let { outside, inside } = simplifyRadical(absDisc);
                solLines.push(isComplex 
                    ? `\\text{Since } \\Delta < 0, \\text{ we find two distinct complex roots containing radicals.}` 
                    : `\\text{Since } \\Delta > 0 \\text{ and is not a perfect square, we find two irrational real roots.}`
                );

                let g = gcd(gcd(Math.abs(B), outside), 2 * A);
                let finalB = -B / g;
                let finalOutside = outside / g;
                let finalDen = (2 * A) / g;

                let radicalPart = finalOutside === 1 ? `\\sqrt{${inside}}` : `${finalOutside}\\sqrt{${inside}}`;
                let suffix = isComplex ? `${radicalPart}i` : radicalPart;
                let bStr = finalB === 0 ? "" : insulateConstant(finalB);
                let combinedRoots = "";

                if (finalDen === 1) {
                    combinedRoots = finalB === 0 ? `\\pm ${suffix}` : `${bStr} \\pm ${suffix}`;
                } else {
                    combinedRoots = finalB === 0 ? `\\frac{\\pm ${suffix}}{${finalDen}}` : `\\frac{${bStr} \\pm ${suffix}}{${finalDen}}`;
                }

                ansStr = `x = ${combinedRoots}`;
                let basicRadicalForm = isComplex ? `\\sqrt{${absDisc}}i` : `\\sqrt{${disc}}`;
                let simplifiedRadicalForm = isComplex ? `${outside}\\sqrt{${inside}}i` : `${outside}\\sqrt{${inside}}`;

                solLines.push(`x = \\frac{-(${B}) \\pm ${basicRadicalForm}}{2(${A})}`);
                solLines.push(`\\text{Simplify the radical: } x = \\frac{${initialBStr} \\pm ${simplifiedRadicalForm}}{${2 * A}}`);
                solLines.push(`\\text{Reduce to lowest terms: } ${ansStr}`);
            }

            // Combine step strings into aligned structure
            let solStr = `\\begin{aligned}\n&` + solLines.join(` \\\\\n&`) + `\n\\end{aligned}`;

            return {
                expr: exprStr,
                ans: `= ${ansStr}`,
                sol: solStr
            };
        }
    ],
    med: [
       
    ],
    hard: [
        
    ]
};
window.algebra = algebra;