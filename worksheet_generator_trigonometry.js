
const trigonometry = {
    easy: [
        // Family: Basic Unit Circle Values
        (a, b, c, d) => {
            const values = [
                { func: '\\sin', angle: '0', val: '0', reason: 'y\\text{-coordinate at } 0' },
                { func: '\\sin', angle: '\\frac{\\pi}{2}', val: '1', reason: 'y\\text{-coordinate at } \\frac{\\pi}{2}' },
                { func: '\\sin', angle: '\\pi', val: '0', reason: 'y\\text{-coordinate at } \\pi' },
                { func: '\\cos', angle: '0', val: '1', reason: 'x\\text{-coordinate at } 0' },
                { func: '\\cos', angle: '\\frac{\\pi}{2}', val: '0', reason: 'x\\text{-coordinate at } \\frac{\\pi}{2}' },
                { func: '\\cos', angle: '\\pi', val: '-1', reason: 'x\\text{-coordinate at } \\pi' }
            ];
            let idx = Math.abs(a + b) % values.length;
            let choice = values[idx];
            return {
                expr: `${choice.func}\\left(${choice.angle}\\right)`,
                ans: `= ${choice.val}`,
                sol: `\\begin{aligned}
                    &\\text{From the unit circle, the } ${choice.reason} \\\\
                    &\\text{is exactly } ${choice.val}.
                \\end{aligned}`
            };
        }
    ],
    med: [
        // Family: Pythagorean Trigonometric Identity
        (a, b, c, d) => {
            let multiplier = Math.abs(a) > 0 ? Math.abs(a) : 2;
            let argStr = multiplier === 1 ? "x" : `${multiplier}x`;
            return {
                expr: `\\sin^2(${argStr}) + \\cos^2(${argStr})`,
                ans: `= 1`,
                sol: `\\begin{aligned}
                    &\\text{Apply the Pythagorean Identity: } \\\\
                    &\\sin^2(\\theta) + \\cos^2(\\theta) = 1 \\text{ for any angle } \\theta. \\\\
                    &\\text{Since } \\theta = ${argStr}, \\text{ the expression evaluates directly to } 1.
                \\end{aligned}`
            };
        }
    ],
    hard: [
        // Family: Algebraic-Trigonometric Composition
        (a, b, c, d) => {
            let sideAdj = Math.abs(c) > 0 ? Math.abs(c) : 3;
            let sideOpp = Math.abs(d) > 0 ? Math.abs(d) : 4;
            let hypSq = sideAdj * sideAdj + sideOpp * sideOpp;
            
            return {
                expr: `\\tan\\left( \\arccos\\left( \\frac{${sideAdj}}{\\sqrt{${hypSq}}} \\right) \\right)`,
                ans: `= \\frac{${sideOpp}}{${sideAdj}}`,
                sol: `\\begin{aligned}
                    &\\text{Let } \\theta = \\arccos\\left(\\frac{${sideAdj}}{\\sqrt{${hypSq}}}\\right) \\implies \\cos(\\theta) = \\frac{${sideAdj}}{\\sqrt{${hypSq}}} = \\frac{\\text{Adj}}{\\text{Hyp}} \\\\
                    &\\text{Find the opposite side: } \\text{Opp} = \\sqrt{(\\sqrt{${hypSq}})^2 - ${sideAdj}^2} = ${sideOpp} \\\\
                    &\\text{Thus, } \\tan(\\theta) = \\frac{\\text{Opp}}{\\text{Adj}} = \\frac{${sideOpp}}{${sideAdj}}
                \\end{aligned}`
            };
        },
        // Family: Double-Angle Simplification
        (a, b, c, d) => {
            return {
                expr: `\\cos^4(x) - \\sin^4(x)`,
                ans: `= \\cos(2x)`,
                sol: `\\begin{aligned}
                    &\\text{Factor as a difference of squares:} \\\\
                    &\\cos^4(x) - \\sin^4(x) = (\\cos^2(x) - \\sin^2(x))(\\cos^2(x) + \\sin^2(x)) \\\\
                    &\\text{Substitute known identities: } \\cos^2(x) + \\sin^2(x) = 1 \\\\
                    &\\text{and } \\cos^2(x) - \\sin^2(x) = \\cos(2x) \\\\
                    &= (\\cos(2x)) \\cdot (1) = \\cos(2x)
                \\end{aligned}`
            };
        }
    ]
};