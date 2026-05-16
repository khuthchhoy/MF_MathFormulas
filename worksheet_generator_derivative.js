
const derivative = {
    easy: [
        // Family: Power Rule Poly combination
        (a, b, c, d) => {
            let p1 = Math.abs(a) > 1 ? Math.abs(a) : 3;
            let e1 = Math.abs(b) > 1 ? Math.abs(b) : 3;
            let p2 = c !== 0 ? c : 2;
            
            let exprStr = `${p1}x^{${e1}} ${p2 > 0 ? '+ ' : '- '}${Math.abs(p2)}x`;
            let ansStr = `= ${p1 * e1}x^{${e1 - 1 === 1 ? '' : e1 - 1}} ${p2 > 0 ? '+ ' : '- '}${Math.abs(p2)}`;
            if (e1 - 1 === 1) {
                ansStr = `= ${p1 * e1}x ${p2 > 0 ? '+ ' : '- '}${Math.abs(p2)}`;
            }
            
            return {
                expr: `\\frac{d}{dx}\\left[ ${exprStr} \\right]`,
                ans: ansStr,
                sol: `\\begin{aligned}
                    &\\text{Apply the Power Rule: } \\frac{d}{dx}(kx^n) = k \\cdot n x^{n-1} \\\\
                    &= \\frac{d}{dx}(${p1}x^{${e1}}) + \\frac{d}{dx}(${p2}x) \\\\
                    &= ${p1} \\cdot ${e1}x^{${e1 - 1}} + (${p2}) \\\\
                    &= ${ansStr.replace('= ', '')}
                \\end{aligned}`
            };
        },
        // Family: Power Rule with Reciprocals
        (a, b, c, d) => {
            let co = a !== 0 ? a : 2;
            return {
                expr: `\\frac{d}{dx}\\left[ \\frac{${Math.abs(co)}}{x} \\right]`,
                ans: `= -\\frac{${Math.abs(co)}}{x^2}`,
                sol: `\\begin{aligned}
                    &\\text{Rewrite with a negative exponent:} \\\\
                    &\\frac{${Math.abs(co)}}{x} = ${Math.abs(co)}x^{-1} \\\\
                    &\\text{Apply the Power Rule:} \\\\
                    &= ${Math.abs(co)} \\cdot (-1)x^{-2} = -\\frac{${Math.abs(co)}}{x^2}
                \\end{aligned}`
            };
        }
    ],
    med: [
        // Family: Chain Rule with Transcendental Functions
        (a, b, c, d) => {
            let co = a !== 0 ? a : 2;
            let k = b !== 0 ? b : 3;
            const funcs = [
                { name: `\\sin(${k}x)`, deriv: `\\cos(${k}x)`, outerSign: 1 },
                { name: `\\cos(${k}x)`, deriv: `\\sin(${k}x)`, outerSign: -1 },
                { name: `e^{${k}x}`, deriv: `e^{${k}x}`, outerSign: 1 }
            ];
            let idx = Math.abs(co + k) % 3;
            let f = funcs[idx];
            
            let finalCo = co * k * f.outerSign;
            let finalCoStr = finalCo === 1 ? "" : finalCo === -1 ? "-" : `${finalCo}`;
            
            return {
                expr: `\\frac{d}{dx}\\left[ ${co === 1 ? '' : co === -1 ? '-' : co}${f.name} \\right]`,
                ans: `= ${finalCoStr}${f.deriv}`,
                sol: `\\begin{aligned}
                    &\\text{Apply the Chain Rule: } \\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x) \\\\
                    &\\text{Outer derivative: } \\frac{d}{dx}(${f.name.split('(')[0]}) \\\\
                    &\\text{Inner derivative: } \\frac{d}{dx}(${k}x) = ${k} \\\\
                    &= ${co} \\cdot (${f.outerSign === -1 ? '-' : ''}${f.deriv.split('(')[0]}(${k}x)) \\cdot ${k} \\\\
                    &= ${finalCoStr}${f.deriv}
                \\end{aligned}`
            };
        },
        // Family: Product Rule basics
        (a, b, c, d) => {
            let choice = Math.abs(b) % 2;
            if (choice === 0) {
                return {
                    expr: `\\frac{d}{dx}\\left[ x^2 e^{x} \\right]`,
                    ans: `= x e^x (x + 2)`,
                    sol: `\\begin{aligned}
                        &\\text{Apply the Product Rule: } (uv)' = u'v + uv' \\\\
                        &\\text{Let } u = x^2 \\implies u' = 2x \\\\
                        &\\text{Let } v = e^x \\implies v' = e^x \\\\
                        &= (2x)(e^x) + (x^2)(e^x) \\\\
                        &= e^x(2x + x^2) = x e^x(x + 2)
                    \\end{aligned}`
                };
            } else {
                return {
                    expr: `\\frac{d}{dx}\\left[ x \\ln(x) \\right]`,
                    ans: `= \\ln(x) + 1`,
                    sol: `\\begin{aligned}
                        &\\text{Apply the Product Rule: } (uv)' = u'v + uv' \\\\
                        &\\text{Let } u = x \\implies u' = 1 \\\\
                        &\\text{Let } v = \\ln(x) \\implies v' = \\frac{1}{x} \\\\
                        &= (1)(\\ln x) + (x)\\left(\\frac{1}{x}\\right) \\\\
                        &= \\ln(x) + 1
                    \\end{aligned}`
                };
            }
        }
    ],
    hard: [
        // Family: Chain Rule with Composite Natural Logs
        (a, b, c, d) => {
            let constant = Math.abs(c) > 0 ? Math.abs(c) : 1;
            return {
                expr: `\\frac{d}{dx}\\left[ \\ln(x^2 + ${constant}) \\right]`,
                ans: `= \\frac{2x}{x^2 + ${constant}}`,
                sol: `\\begin{aligned}
                    &\\text{Apply the Chain Rule for } \\ln(u): \\frac{d}{dx}[\\ln(u)] = \\frac{u'}{u} \\\\
                    &\\text{Let } u = x^2 + ${constant} \\implies u' = 2x \\\\
                    &= \\frac{2x}{x^2 + ${constant}}
                \\end{aligned}`
            };
        },
        // Family: Implicit Differentiation
        (a, b, c, d) => {
            let r2 = Math.abs(c) > 0 ? Math.abs(c) * Math.abs(c) : 25;
            return {
                expr: `\\text{Find } \\frac{dy}{dx} \\text{ for } x^2 + y^2 = ${r2}`,
                ans: `= -\\frac{x}{y}`,
                sol: `\\begin{aligned}
                    &\\text{Differentiate both sides with respect to } x: \\\\
                    &\\frac{d}{dx}(x^2) + \\frac{d}{dx}(y^2) = \\frac{d}{dx}(${r2}) \\\\
                    &2x + 2y \\cdot \\frac{dy}{dx} = 0 \\\\
                    &2y \\cdot \\frac{dy}{dx} = -2x \\\\
                    &\\frac{dy}{dx} = -\\frac{2x}{2y} = -\\frac{x}{y}
                \\end{aligned}`
            };
        },
        // Family: Inverse Trig Derivatives
        (a, b, c, d) => {
            let k = Math.abs(b) > 1 ? Math.abs(b) : 2;
            return {
                expr: `\\frac{d}{dx}\\left[ \\arctan(${k}x) \\right]`,
                ans: `= \\frac{${k}}{1 + ${k * k}x^2}`,
                sol: `\\begin{aligned}
                    &\\text{Use the rule: } \\frac{d}{dx}[\\arctan(u)] = \\frac{u'}{1+u^2} \\\\
                    &\\text{Here } u = ${k}x \\implies u' = ${k} \\\\
                    &= \\frac{${k}}{1 + (${k}x)^2} = \\frac{${k}}{1 + ${k * k}x^2}
                \\end{aligned}`
            };
        }
    ]
};