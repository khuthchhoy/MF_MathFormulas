import { Utils } from './worksheet_generator_utils.js';
export const integral = {
        easy: [
            (a, b, c) => {
                let coef = a * (b + 1);
                return {
                    expr: `\\int \\left( ${coef}x^{${b}} - ${c} \\right) \\, dx`,
                    ans: `= ${a}x^{${b + 1}} - ${c}x + C`,
                    sol: `\\text{Reverse Power Rule: } \\int x^n dx = \\frac{x^{n+1}}{n+1}`
                };
            }
        ],
        med: [
            (a, b) => ({
                expr: `\\int ${a * b} \\cos(${b}x) \\, dx`,
                ans: `= ${a} \\sin(${b}x) + C`,
                sol: `\\text{U-Substitution: } u=${b}x, du=${b}dx \\implies \\int ${a} \\cos(u) du = ${a}\\sin(u)+C`
            })
        ],
        hard: [
            (a, b) => ({
                expr: `\\int x e^{${b}x} \\, dx`,
                ans: `= \\frac{1}{${b}} x e^{${b}x} - \\frac{1}{${b * b}} e^{${b}x} + C`,
                sol: `\\text{By Parts: } u=x, dv=e^{${b}x}dx. \\implies uv - \\int v du = \\frac{x}{${b}}e^{${b}x} - \\int \\frac{1}{${b}}e^{${b}x} dx`
            }),
            (a, b, c) => ({
                expr: `\\int \\frac{${2 * b}x}{${b}x^2 + ${c}} \\, dx`,
                ans: `= \\ln|${b}x^2 + ${c}| + C`,
                sol: `\\text{Notice numerator is exact derivative of denominator. } \\int \\frac{du}{u} = \\ln|u|`
            }),
            (a, b, c) => ({
                expr: `\\int_{0}^{${c}} ${b}x \\, dx`,
                ans: `= ${(b * c * c) / 2}`,
                sol: `\\text{Antiderivative is } \\frac{${b}x^2}{2}. \\text{ Evaluate } \\frac{${b}(${c})^2}{2} - 0 = ${(b * c * c) / 2}`
            }),
            (a, b) => ({
                expr: `\\int \\sin(${b}x) \\, dx`,
                ans: `= -\\frac{1}{${b}} \\cos(${b}x) + C`,
                sol: `\\text{U-sub: } u=${b}x \\implies du=${b}dx. \\int \\sin(u) \\frac{du}{${b}} = -\\frac{1}{${b}}\\cos(u)`
            }),
            (a, b, c) => ({
                expr: `\\int e^{${c}x} \\, dx`,
                ans: `= \\frac{1}{${c}} e^{${c}x} + C`,
                sol: `\\text{U-sub: } u=${c}x \\implies du=${c}dx. \\int e^u \\frac{du}{${c}}`
            }),
            (a, b) => ({
                expr: `\\int \\frac{1}{x^2 + ${b}^2} \\, dx`,
                ans: `= \\frac{1}{${b}} \\arctan\\left(\\frac{x}{${b}}\\right) + C`,
                sol: `\\text{Standard inverse trig integral form: } \\int \\frac{1}{x^2+a^2} = \\frac{1}{a}\\arctan(x/a)`
            }),
            () => ({
                expr: `\\int x^2 \\, dx`,
                ans: `= \\frac{x^3}{3} + C`,
                sol: `\\text{Power Rule: Add 1 to exponent, divide by new exponent.}`
            }),
            (a, b) => ({
                expr: `\\int \\sec^2(${b}x) \\, dx`,
                ans: `= \\frac{1}{${b}} \\tan(${b}x) + C`,
                sol: `\\text{The antiderivative of } \\sec^2(u) \\text{ is } \\tan(u). \\text{ Adjust for inner } ${b}.`
            }),
            () => ({
                expr: `\\int \\frac{1}{x} \\, dx`,
                ans: `= \\ln|x| + C`,
                sol: `\\text{Fundamental integration rule for } x^{-1}.`
            }),
            () => ({
                expr: `\\int \\cos^2(x) \\, dx`,
                ans: `= \\frac{x}{2} + \\frac{\\sin(2x)}{4} + C`,
                sol: `\\text{Use power reduction: } \\cos^2x = \\frac{1+\\cos(2x)}{2}. \\text{ Integrate each term.}`
            }),
            () => ({
                expr: `\\int_{0}^{\\pi} \\sin(x) \\, dx`,
                ans: `= 2`,
                sol: `\\begin{aligned} &= [-\\cos x]_0^\\pi = -\\cos(\\pi) - (-\\cos(0)) = 2 \\end{aligned}`
            }),
            () => ({
                expr: `\\int x \\ln(x) \\, dx`,
                ans: `= \\frac{1}{2}x^2 \\ln(x) - \\frac{1}{4}x^2 + C`,
                sol: `\\text{By Parts: } u=\\ln x, dv=x dx \\implies du = 1/x dx, v = x^2/2`
            }),
            (a, b) => ({
                expr: `\\int \\frac{1}{\\sqrt{x^2 + ${b}^2}} \\, dx`,
                ans: `= \\ln|x + \\sqrt{x^2 + ${b}^2}| + C`,
                sol: `\\text{Standard integral requiring Trig Substitution } x = ${b}\\tan(\\theta)`
            }),
            () => ({
                expr: `\\int e^{x} \\sin(x) \\, dx`,
                ans: `= \\frac{1}{2}e^{x}(\\sin x - \\cos x) + C`,
                sol: `\\text{Integration by Parts applied twice wraps around to original integral.}`
            }),
            (a, b, c) => ({
                expr: `\\int \\frac{x}{\\sqrt{x^2 + ${c}}} \\, dx`,
                ans: `= \\sqrt{x^2 + ${c}} + C`,
                sol: `\\text{U-sub: } u=x^2+${c}, du=2x dx \\implies \\frac{1}{2}\\int u^{-1/2}du = u^{1/2}`
            }),
            (a, b) => ({
                expr: `\\int x \\cos(${b}x) \\, dx`,
                ans: `= \\frac{1}{${b}} x \\sin(${b}x) + \\frac{1}{${b * b}} \\cos(${b}x) + C`,
                sol: `\\text{By Parts: } u=x, dv=\\cos(${b}x)dx \\implies uv - \\int v du`
            }),
            (a, b, c) => ({
                expr: `\\int \\frac{1}{x^2 - ${c * c}} \\, dx`,
                ans: `= \\frac{1}{${2 * c}} \\ln\\left|\\frac{x-${c}}{x+${c}}\\right| + C`,
                sol: `\\text{Partial Fractions: } \\frac{1}{(x-${c})(x+${c})} = \\frac{A}{x-${c}} + \\frac{B}{x+${c}}`
            }),
            () => ({
                expr: `\\int_{1}^{\\infty} \\frac{1}{x^2} \\, dx`,
                ans: `= 1`,
                sol: `\\text{Improper integral: } \\lim_{t\\to\\infty} [-1/x]_1^t = 0 - (-1) = 1`
            }),
            (a, b) => ({
                expr: `\\int \\tan(${b}x) \\, dx`,
                ans: `= \\frac{1}{${b}} \\ln|\\sec(${b}x)| + C`,
                sol: `\\text{Write as } \\sin/\\cos \\text{, then use u-sub: } u=\\cos(${b}x), du=-${b}\\sin(${b}x)dx`
            })
        ]
    };