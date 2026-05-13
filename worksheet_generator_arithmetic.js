import { Utils } from './worksheet_generator_utils.js';

export const arithmetic = {
        easy: [
            (a, b) => ({
                expr: `${a} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`,
                ans: `= ${a + b}`,
                sol: `\\text{Combine terms: } ${a} ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${a + b}`
            })
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
                let num = Math.abs(a) * d + c * b;
                return {
                    expr: `\\frac{${Math.abs(a)}}{${b}} + \\frac{${c}}{${d}}`,
                    ans: `= \\frac{${num}}{${b * d}}`,
                    sol: `\\begin{aligned} &\\text{Common denom: } ${b} \\times ${d} = ${b * d} \\\\ &= \\frac{${Math.abs(a) * d}}{${b * d}} + \\frac{${c * b}}{${b * d}} = \\frac{${num}}{${b * d}} \\end{aligned}`
                };
            },
            (a, b, c, d) => ({
                expr: `${c} \\times (${d} + 1)^2 - ${Math.abs(a)}`,
                ans: `= ${c * Math.pow(d + 1, 2) - Math.abs(a)}`,
                sol: `\\begin{aligned} &= ${c} \\times (${d + 1})^2 - ${Math.abs(a)} = ${c * Math.pow(d + 1, 2) - Math.abs(a)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{${a * b} + ${c * d}}{${b}}`,
                ans: `= \\frac{${(a * b) + (c * d)}}{${b}}`,
                sol: `\\begin{aligned} &= \\frac{${a * b} + ${c * d}}{${b}} = \\frac{${a * b + c * d}}{${b}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `(${a} + ${b}) \\div ${c} \\times ${d}`,
                ans: `= ${Math.floor(((a + b) / c) * d)}`,
                sol: `\\begin{aligned} &= (${a + b}) \\div ${c} \\times ${d} \\approx ${Math.floor(((a + b) / c) * d)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\sqrt{${b}^2 + ${c}^2} \\times ${a}`,
                ans: `\\approx ${Math.round(a * Math.sqrt(b * b + c * c))}`,
                sol: `\\begin{aligned} &= \\sqrt{${b * b} + ${c * c}} \\times ${a} \\approx ${Math.round(a * Math.sqrt(b * b + c * c))} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `${a}\\% \\text{ of } ${b} + ${c}`,
                ans: `= ${Math.round((a / 100) * b) + c}`,
                sol: `\\begin{aligned} &= 0.${Math.abs(a)} \\times ${b} + ${c} = ${Math.round((a / 100) * b) + c} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\left| ${a} - ${b} \\right| \\times ${c}`,
                ans: `= ${Math.abs(a - b) * c}`,
                sol: `\\begin{aligned} &= |${a - b}| \\times ${c} = ${Math.abs(a - b) * c} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{${a}}{${b}} \\div \\frac{${c}}{${d}}`,
                ans: `= \\frac{${a * d}}{${b * c}}`,
                sol: `\\begin{aligned} &\\text{Multiply by reciprocal: } \\frac{${a}}{${b}} \\times \\frac{${d}}{${c}} = \\frac{${a * d}}{${b * c}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `(${a} \\times ${b}) + (${c} \\div ${d})`,
                ans: `= ${a * b + Math.floor(c / d)}`,
                sol: `\\begin{aligned} &= (${a * b}) + (${(c / d).toFixed(2)}) \\approx ${a * b + Math.floor(c / d)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\sqrt[${d}]{${b}^{${c}}} \\times ${a}`,
                ans: `= ${Math.round(a * Math.pow(b, c / d))}`,
                sol: `\\begin{aligned} &= ${b}^{${c}/${d}} \\times ${a} \\approx ${Math.round(a * Math.pow(b, c / d))} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{${a} + ${b} + ${c}}{${d}}`,
                ans: `= \\frac{${a + b + c}}{${d}}`,
                sol: `\\begin{aligned} &= \\frac{${a + b + c}}{${d}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `0.\\overline{${Math.abs(a)}} \\times ${b}`,
                ans: `= ${Math.round((Math.abs(a) / 9) * b)}`,
                sol: `\\begin{aligned} &= \\frac{${Math.abs(a)}}{9} \\times ${b} \\approx ${Math.round((Math.abs(a) / 9) * b)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{1}{${a}} + \\frac{1}{${b}} + \\frac{1}{${c}}`,
                ans: `= \\frac{${b * c + a * c + a * b}}{${a * b * c}}`,
                sol: `\\begin{aligned} &\\text{Find LCD } (${a * b * c}) \\implies \\frac{${b * c + a * c + a * b}}{${a * b * c}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `(${a}^{${b}})^{${c}} \\div ${d}`,
                ans: `= ${(Math.pow(a, b * c) / d).toFixed(2)}`,
                sol: `\\begin{aligned} &= ${a}^{${b * c}} \\div ${d} \\approx ${(Math.pow(a, b * c) / d).toFixed(2)} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\log_{10}(${b}) \\times ${a}`,
                ans: `\\approx ${Math.round(a * Math.log10(b))}`,
                sol: `\\begin{aligned} &\\approx ${Math.log10(b).toFixed(2)} \\times ${a} \\approx ${Math.round(a * Math.log10(b))} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `\\frac{\\frac{${Math.abs(a)}}{${b}}}{\\frac{${c}}{${d}}}`,
                ans: `= \\frac{${Math.abs(a) * d}}{${b * c}}`,
                sol: `\\begin{aligned} &= \\frac{${Math.abs(a)}}{${b}} \\times \\frac{${d}}{${c}} = \\frac{${Math.abs(a) * d}}{${b * c}} \\end{aligned}`
            }),
            (a, b, c, d) => ({
                expr: `(${Math.abs(a)} \\times 10^{${c}}) \\times (${b} \\times 10^{${d}})`,
                ans: `= ${Math.abs(a) * b} \\times 10^{${c + d}}`,
                sol: `\\begin{aligned} &= (${Math.abs(a)} \\times ${b}) \\times 10^{${c}+${d}} = ${Math.abs(a) * b} \\times 10^{${c + d}} \\end{aligned}`
            }),
            (a, b, c, d) => {
                let factA = Math.abs(a) + 3;
                return {
                    expr: `\\frac{${factA}!}{(${factA}-2)!}`,
                    ans: `= ${factA * (factA - 1)}`,
                    sol: `\\begin{aligned} &= \\frac{${factA} \\times ${factA - 1} \\times (${factA}-2)!}{(${factA}-2)!} = ${factA * (factA - 1)} \\end{aligned}`
                };
            },
            (a, b, c, d) => ({
                expr: `\\log_{${b}}(${b}^{${c}}) + \\ln(e^{${d}})`,
                ans: `= ${c + d}`,
                sol: `\\begin{aligned} &= ${c}\\log_{${b}}(${b}) + ${d}\\ln(e) = ${c}(1) + ${d}(1) = ${c + d} \\end{aligned}`
            })
        ]
    };