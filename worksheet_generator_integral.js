
const integral = {
    easy: [
        // Family: Reverse Power Rule
        (a, b, c, d) => {
            let pwr = Math.abs(b) >= 1 && Math.abs(b) <= 5 ? Math.abs(b) : 2;
            let coA = Math.abs(a) > 0 ? Math.abs(a) : 2;
            let coef = coA * (pwr + 1);
            let constC = c !== 0 ? c : 3;
            let signC = constC > 0 ? `- ${constC}` : `+ ${Math.abs(constC)}`;
            
            return {
                expr: `\\int \\left( ${coeff}x^{${pwr}} ${signC} \\right) \\, dx`,
                ans: `= ${coA}x^{${pwr + 1}} ${constC > 0 ? '-' : '+'} ${Math.abs(constC)}x + C`,
                sol: `\\begin{aligned}
                    &\\text{Integrate term-by-term via the Reverse Power Rule:} \\\\
                    &= \\int ${coeff}x^{${pwr}} \\, dx - \\int ${constC} \\, dx \\\\
                    &= ${coeff} \\cdot \\frac{x^{${pwr + 1}}}{${pwr + 1}} ${constC > 0 ? '-' : '+'} ${Math.abs(constC)}x + C \\\\
                    &= ${coA}x^{${pwr + 1}} ${constC > 0 ? '-' : '+'} ${Math.abs(constC)}x + C
                \\end{aligned}`
            };
        }
    ],
    med: [
        // Family: Basic Trig U-Substitution
        (a, b, c, d) => {
            let coA = a !== 0 ? a : 3;
            let k = b !== 0 ? b : 2;
            let totalCoef = coA * k;
            
            return {
                expr: `\\int ${totalCoef} \\cos(${k}x) \\, dx`,
                ans: `= ${coA} \\sin(${k}x) + C`,
                sol: `\\begin{aligned}
                    &\\text{Apply } u\\text{-substitution:} \\\\
                    &\\text{Let } u = ${k}x \\implies du = ${k} \\, dx \\implies dx = \\frac{du}{${k}} \\\\
                    &\\text{Substitute into the integral:} \\\\
                    &= \\int ${totalCoef} \\cos(u) \\cdot \\frac{du}{${k}} \\\\
                    &= \\int ${coA} \\cos(u) \\, du = ${coA} \\sin(u) + C \\\\
                    &= ${coA} \\sin(${k}x) + C
                \\end{aligned}`
            };
        }
    ],
    hard: [
        // Family: Integration by Parts (x * e^kx)
        (a, b, c, d) => {
            let k = b !== 0 ? b : 2;
            let kSq = k * k;
            return {
                expr: `\\int x e^{${k}x} \\, dx`,
                ans: `= \\frac{1}{${k}} x e^{${k}x} - \\frac{1}{${kSq}} e^{${k}x} + C`,
                sol: `\\begin{aligned}
                    &\\text{Apply Integration by Parts: } \\int u \\, dv = uv - \\int v \\, du \\\\
                    &\\text{Let } u = x \\implies du = dx \\\\
                    &\\text{Let } dv = e^{${k}x} \\, dx \\implies v = \\frac{1}{${k}} e^{${k}x} \\\\
                    &= (x)\\left(\\frac{1}{${k}} e^{${k}x}\\right) - \\int \\left(\\frac{1}{${k}} e^{${k}x}\\right) \\, dx \\\\
                    &= \\frac{1}{${k}} x e^{${k}x} - \\frac{1}{${kSq}} e^{${k}x} + C
                \\end{aligned}`
            };
        },
        // Family: Partial Fractions Basics
        (a, b, c, d) => {
            let valC = Math.abs(c) > 0 && Math.abs(c) <= 6 ? Math.abs(c) : 3;
            let cSq = valC * valC;
            let doubleC = 2 * valC;
            return {
                expr: `\\int \\frac{1}{x^2 - ${cSq}} \\, dx`,
                ans: `= \\frac{1}{${doubleC}} \\ln\\left| \\frac{x - ${valC}}{x + ${valC}} \\right| + C`,
                sol: `\\begin{aligned}
                    &\\text{Decompose the integrand into partial fractions:} \\\\
                    &\\frac{1}{(x - ${valC})(x + ${valC})} = \\frac{A}{x - ${valC}} + \\frac{B}{x + ${valC}} \\\\
                    &\\text{Solving for constants gives } A = \\frac{1}{${doubleC}}, \\, B = -\\frac{1}{${doubleC}} \\\\
                    &= \\int \\left( \\frac{1/${doubleC}}{x - ${valC}} - \\frac{1/${doubleC}}{x + ${valC}} \\right) \\, dx \\\\
                    &= \\frac{1}{${doubleC}} \\ln\\left| \\frac{x - ${valC}}{x + ${valC}} \\right| + C
                \\end{aligned}`
            };
        }
    ]
};