
import { Utils } from './worksheet_generator_utils.js';
export const derivative = {
        easy: [
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ ${a}x^{${b}} ${c > 0 ? '+' : '-'} ${Math.abs(c)}x \\right]`,
                ans: `= ${a * b}x^{${b - 1}} ${c > 0 ? '+' : '-'} ${Math.abs(c)}`,
                sol: `\\text{Power Rule: } \\frac{d}{dx}(ax^n) = anx^{n-1}`
            })
        ],
        med: [
            (a, b) => {
                let funcs = [`\\sin(${b}x)`, `\\cos(${b}x)`, `e^{${b}x}`];
                let ansFuncs = [`${b}\\cos(${b}x)`, `-${b}\\sin(${b}x)`, `${b}e^{${b}x}`];
                let r = Math.floor(Math.random() * 3);
                let sign = (a < 0 && r === 1) ? "" : (a > 0 && r === 1) ? "-" : "";
                return {
                    expr: `\\frac{d}{dx} \\left[ ${a}${funcs[r]} \\right]`,
                    ans: `= ${sign}${Math.abs(a * b)}${ansFuncs[r].replace(/-?${b}/, '')}`,
                    sol: `\\text{Chain Rule: multiply by outer derivative.}`
                };
            }
        ],
        hard: [
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\ln(${b}x^2 + ${c}) \\right]`,
                ans: `= \\frac{${2 * b}x}{${b}x^2 + ${c}}`,
                sol: `\\text{Chain rule: } \\frac{1}{u} \\cdot u' \\implies \\frac{1}{${b}x^2+${c}} \\cdot (${2 * b}x)`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ e^{${b}x^2 + ${c}} \\right]`,
                ans: `= ${2 * b}x \\, e^{${b}x^2 + ${c}}`,
                sol: `\\text{Chain rule: } e^u \\cdot u' \\implies e^{${b}x^2+${c}} \\cdot (${2 * b}x)`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\sin(${Math.abs(a)}x^2 + ${b}) \\right]`,
                ans: `= ${2 * Math.abs(a)}x \\, \\cos(${Math.abs(a)}x^2 + ${b})`,
                sol: `\\text{Chain rule: } \\cos(u) \\cdot u' \\implies \\cos(${Math.abs(a)}x^2+${b}) \\cdot (${2 * Math.abs(a)}x)`
            }),
            (a, b, c, d) => {
                let n = d + 1;
                return {
                    expr: `\\frac{d}{dx} \\left[ (${b}x + ${c})^{${n}} \\right]`,
                    ans: `= ${n * b} (${b}x + ${c})^{${n - 1}}`,
                    sol: `\\text{General Power Rule: } n u^{n-1} \\cdot u' \\implies ${n}(${b}x+${c})^{${n - 1}} \\cdot (${b})`
                };
            },
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\tan(${b}x + ${c}) \\right]`,
                ans: `= ${b} \\sec^{2}(${b}x + ${c})`,
                sol: `\\text{Derivative of } \\tan(u) \\text{ is } \\sec^2(u) \\cdot u' \\implies \\sec^2(${b}x+${c}) \\cdot ${b}`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\sqrt{${b}x^2 + ${c}} \\right]`,
                ans: `= \\frac{${b}x}{\\sqrt{${b}x^2 + ${c}}}`,
                sol: `\\text{Chain Rule: } \\frac{1}{2\\sqrt{u}} \\cdot u' = \\frac{${2 * b}x}{2\\sqrt{${b}x^2+${c}}}`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\cos(3x^2 + ${c}) \\right]`,
                ans: `= -6x \\sin(3x^2 + ${c})`,
                sol: `\\text{Chain rule: } -\\sin(u) \\cdot u' \\implies -\\sin(3x^2+${c}) \\cdot (6x)`
            }),
            () => ({
                expr: `\\frac{d}{dx} \\left[ e^{x} \\sin(x) \\right]`,
                ans: `= e^{x} (\\sin(x) + \\cos(x))`,
                sol: `\\text{Product Rule: } (e^x)'\\sin(x) + e^x(\\sin(x))' = e^x\\sin(x) + e^x\\cos(x)`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\frac{${a}x}{x^2 + ${c}} \\right]`,
                ans: `= \\frac{${a}(x^2 + ${c}) - 2x(${a}x)}{(x^2 + ${c})^2}`,
                sol: `\\text{Quotient Rule: } \\frac{f'g - fg'}{g^2} \\implies \\frac{(${a})(x^2+${c}) - (${a}x)(2x)}{(x^2+${c})^2}`
            }),
            (a, b) => ({
                expr: `\\frac{d}{dx} \\left[ \\ln(\\sin(${b}x)) \\right]`,
                ans: `= ${b} \\cot(${b}x)`,
                sol: `\\text{Chain rule: } \\frac{1}{\\sin(${b}x)} \\cdot \\cos(${b}x) \\cdot ${b} = ${b}\\frac{\\cos(${b}x)}{\\sin(${b}x)}`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ (x^2 + ${c}) e^{${b}x} \\right]`,
                ans: `= e^{${b}x}(2x + ${b}(x^2 + ${c}))`,
                sol: `\\text{Product Rule: } (2x)e^{${b}x} + (x^2+${c})(${b}e^{${b}x})`
            }),
            () => ({
                expr: `\\frac{d}{dx} \\left[ x^{x} \\right]`,
                ans: `= x^{x} (\\ln x + 1)`,
                sol: `\\text{Logarithmic Diff: } \\ln y = x\\ln x \\implies \\frac{y'}{y} = \\ln x + 1 \\implies y' = x^x(\\ln x + 1)`
            }),
            (a, b) => ({
                expr: `\\frac{d^{2}}{dx^{2}} \\left[ x^{${b}} \\right]`,
                ans: `= ${b}(${b}-1)x^{${b - 2}}`,
                sol: `\\text{First Deriv: } ${b}x^{${b - 1}}. \\text{ Second Deriv: } ${b}(${b - 1})x^{${b - 2}}`
            }),
            (a, b) => ({
                expr: `\\frac{d}{dx} \\left[ \\arctan(${b}x) \\right]`,
                ans: `= \\frac{${b}}{1 + (${b}x)^2}`,
                sol: `\\text{Deriv of } \\arctan(u) \\text{ is } \\frac{u'}{1+u^2} \\implies \\frac{${b}}{1+(${b}x)^2}`
            }),
            () => ({
                expr: `\\frac{d}{dx} \\left[ \\ln(x^2 + 1) \\right]`,
                ans: `= \\frac{2x}{x^2 + 1}`,
                sol: `\\text{Chain rule: } \\frac{1}{u} \\cdot u' \\implies \\frac{2x}{x^2+1}`
            }),
            () => ({
                expr: `\\frac{d}{dx} \\left[ x^{\\ln x} \\right]`,
                ans: `= 2x^{\\ln x - 1} \\ln x`,
                sol: `\\text{Log Diff: } \\ln y = (\\ln x)^2 \\implies \\frac{y'}{y} = 2\\ln x (1/x) \\implies y' = 2x^{\\ln x - 1}\\ln x`
            }),
            (a, b, c) => ({
                expr: `\\frac{dy}{dx} \\text{ for } x^2 + y^2 = ${c * c}`,
                ans: `= -\\frac{x}{y}`,
                sol: `\\text{Implicit: } 2x + 2yy' = 0 \\implies 2yy' = -2x \\implies y' = -x/y`
            }),
            (a, b, c) => ({
                expr: `\\frac{d}{dx} \\left[ \\arcsin(${c}x) \\right]`,
                ans: `= \\frac{${c}}{\\sqrt{1 - ${c * c}x^2}}`,
                sol: `\\text{Deriv of } \\arcsin(u) \\text{ is } \\frac{u'}{\\sqrt{1-u^2}} \\implies \\frac{${c}}{\\sqrt{1-(${c}x)^2}}`
            }),
            () => ({
                expr: `\\frac{d}{dx} \\left[ \\frac{\\sin x}{x} \\right]`,
                ans: `= \\frac{x\\cos x - \\sin x}{x^2}`,
                sol: `\\text{Quotient Rule: } \\frac{f'g - fg'}{g^2} = \\frac{(\\cos x)x - (\\sin x)(1)}{x^2}`
            })
        ]
    };