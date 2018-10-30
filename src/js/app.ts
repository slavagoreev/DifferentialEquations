import { parseKatex } from './katex/index';
import { EulerMethod } from './euler/index';


let x0 = 0;
let y0 = 2;
let x1 = 6.4;
let step = 0.25;
let integrationConst = 1/3 * (Math.log((y0 - 3) / y0)) - x0 * x0 / 2;

/**
 * Function for numerical methods
 * f(x,y) = xy^2 -3xy
 * @param x
 * @param y
 * @returns {number} the value of f(x,y) in this point
 */
function equation(x: number, y: number) {
    return x * y * y - 3 * x * y;
}

/**
 * Function for exact solution
 * Computing value of y in the certain point of x
 * @param x
 * @returns {number} value of y
 */
function solution(x: number) {
    return - (3 / Math.exp(3 * integrationConst + (3 / 2) * (x * x) - 1));
}


document.addEventListener("DOMContentLoaded", function () {
    parseKatex();
    const euler = new EulerMethod(equation, {
        displayName: 'Euler\'s method',
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step)
      .draw(document.getElementById('euler'), {})

});
