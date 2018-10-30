import { parseKatex } from './katex/index';
import { EulerMethod } from './euler/index';
import { ImprovedEulerMethod } from './improved/index';
import { RungeKuttaMethod } from './runge-kutta/index';


let x0 = 0;
let y0 = 2;
let x1 = 6.4;
let step = 0.1;
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
    calculateGraphs();
});

function calculateGraphs() {
    const euler = new EulerMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step)
        .draw(document.getElementById('euler'), {});
    (euler.chart.canvas.parentNode as any).style.height = '300px';

    const improvedEulerMethod = new ImprovedEulerMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step);

    const rungeKuttaMethod = new RungeKuttaMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step);

    euler.addNewDataset(
        'Improved Euler\'s method',
        improvedEulerMethod.yCoords,
        '#dd6f00');

    euler.addNewDataset(
        'Runge-Kutta\'s method',
        improvedEulerMethod.yCoords,
        '#ce3b4d');

    euler.addNewDataset(
        'Exact',
        euler.xCoords.map((x) => solution(x)),
        '#00ac23');
    console.log(euler.xCoords.map((x) => solution(x)));
    euler.chart.update();
}
