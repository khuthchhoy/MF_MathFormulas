
import { Utils } from './worksheet_generator_utils.js';
export const trigonometry = {
        easy: [
            () => {
                // Use an array of objects to keep angles and values paired and easy to read
                const values = [
                    { angle: '0', val: '0' },
                    { angle: '\\frac{\\pi}{2}', val: '1' },
                    { angle: '\\pi', val: '0' },
                    { angle: '\\frac{3\\pi}{2}', val: '-1' },
                    { angle: '2\\pi', val: '0' }
                ];

                // Use Utils.getRnd to match your helper object
                const r = Utils.getRnd(0, values.length - 1);
                const choice = values[r];

                return {
                    // Added a space after \sin for better LaTeX rendering
                    expr: `\\sin\\left(${choice.angle}\\right)`,
                    ans: `= ${choice.val}`,
                    sol: `\\text{From the unit circle, the y-coordinate at } ${choice.angle} \\text{ is } ${choice.val}.`
                };
            }
        ],
        med: [
            (a) => ({
                expr: `\\sin^2(${Math.abs(a)}x) + \\cos^2(${Math.abs(a)}x)`,
                ans: `= 1`,
                sol: `\\text{Pythagorean Identity: } \\sin^2(\\theta) + \\cos^2(\\theta) = 1 \\text{ for any } \\theta`
            })
        ],
        hard: [
            (a, b) => ({
                expr: `\\cos^2(${b}x) - \\sin^2(${b}x)`,
                ans: `= \\cos(${2 * b}x)`,
                sol: `\\text{Double Angle Identity: } \\cos^2(\\theta) - \\sin^2(\\theta) = \\cos(2\\theta)`
            }),
            (a, b, c, d) => ({
                expr: `\\sin(${c}x)\\cos(${d}x) + \\cos(${c}x)\\sin(${d}x)`,
                ans: `= \\sin(${c + d}x)`,
                sol: `\\text{Sum Formula: } \\sin(A)\\cos(B) + \\cos(A)\\sin(B) = \\sin(A+B)`
            }),
            () => ({
                expr: `\\frac{\\sin(x)}{\\cos(x)}`,
                ans: `= \\tan(x)`,
                sol: `\\text{Quotient Identity: } \\frac{\\sin(x)}{\\cos(x)} = \\tan(x)`
            }),
            () => ({
                expr: `\\tan^2(x) + 1`,
                ans: `= \\sec^2(x)`,
                sol: `\\text{Pythagorean Identity: } \\tan^2(x) + 1 = \\sec^2(x)`
            }),
            () => ({
                expr: `\\sin(2x)`,
                ans: `= 2\\sin(x)\\cos(x)`,
                sol: `\\text{Double Angle Identity for Sine.}`
            }),
            () => ({
                expr: `\\cos(3x)`,
                ans: `= 4\\cos^3(x) - 3\\cos(x)`,
                sol: `\\text{Triple Angle Identity for Cosine.}`
            }),
            () => ({
                expr: `\\frac{1 + \\cos(2x)}{2}`,
                ans: `= \\cos^2(x)`,
                sol: `\\text{Power-Reducing Identity for Cosine.}`
            }),
            () => ({
                expr: `\\csc(x) \\cdot \\sin(x)`,
                ans: `= 1`,
                sol: `\\text{Reciprocal Identity: } \\frac{1}{\\sin(x)} \\cdot \\sin(x) = 1`
            }),
            () => ({
                expr: `\\frac{\\sin(3x)}{\\sin(x)}`,
                ans: `= 3 - 4\\sin^2(x)`,
                sol: `\\begin{aligned} &= \\frac{3\\sin(x) - 4\\sin^3(x)}{\\sin(x)} = 3 - 4\\sin^2(x) \\end{aligned}`
            }),
            () => ({
                expr: `\\cos^2(x) - \\sin^2(x)`,
                ans: `= \\cos(2x)`,
                sol: `\\text{Double Angle Identity for Cosine.}`
            }),
            () => ({
                expr: `\\tan(x) \\cdot \\cot(x)`,
                ans: `= 1`,
                sol: `\\text{Reciprocal Identity: } \\tan(x) \\cdot \\frac{1}{\\tan(x)} = 1`
            }),
            (a, b, c) => ({
                expr: `\\arcsin(${c / 5})`,
                ans: `= \\theta \\text{ where } \\sin\\theta = ${c / 5}`,
                sol: `\\text{By definition of inverse sine.}`
            }),
            () => ({
                expr: `\\cos^{-1}\\left(\\frac{1}{2}\\right)`,
                ans: `= \\frac{\\pi}{3}`,
                sol: `\\text{The angle in } [0, \\pi] \\text{ where } \\cos(\\theta) = 1/2 \\text{ is } \\pi/3`
            }),
            () => ({
                expr: `\\sin(2x) = 2\\sin(x)\\cos(x)`,
                ans: `\\text{Identity holds}`,
                sol: `\\text{This is the standard double-angle identity for sine.}`
            }),
            () => ({
                expr: `\\frac{1 - \\cos(2x)}{\\sin(2x)}`,
                ans: `= \\tan(x)`,
                sol: `\\begin{aligned} &= \\frac{1 - (1 - 2\\sin^2x)}{2\\sin x \\cos x} = \\tan x \\end{aligned}`
            }),
            () => ({
                expr: `\\sin\\left(\\frac{\\pi}{12}\\right) \\cos\\left(\\frac{\\pi}{12}\\right)`,
                ans: `= \\frac{1}{4}`,
                sol: `\\begin{aligned} &= \\frac{1}{2} \\left(2\\sin\\frac{\\pi}{12}\\cos\\frac{\\pi}{12}\\right) = \\frac{1}{4} \\end{aligned}`
            }),
            () => ({
                expr: `\\cos^4(x) - \\sin^4(x)`,
                ans: `= \\cos(2x)`,
                sol: `\\begin{aligned} &= (\\cos^2x - \\sin^2x)(\\cos^2x + \\sin^2x) = \\cos(2x) \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\tan\\left(\\arccos\\left(\\frac{${c}}{\\sqrt{${c * c + d * d}}}\\right)\\right)`,
                ans: `= \\frac{${d}}{${c}}`,
                sol: `\\text{Draw triangle: adj}=${c}, \\text{opp}=${d}. \\tan = \\frac{\\text{opp}}{\\text{adj}} = \\frac{${d}}{${c}}`
            }),
            () => ({
                expr: `\\sin(x) + \\sin(x)\\cot^2(x)`,
                ans: `= \\csc(x)`,
                sol: `\\begin{aligned} &= \\sin x (1 + \\cot^2 x) = \\sin x (\\csc^2 x) = \\csc x \\end{aligned}`
            })
        ]
    };