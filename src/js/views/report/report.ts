import { parseKatex } from '../../katex/index';
// @ts-ignore
import * as IMask from 'imask';
import { ExactGraph } from '../../graphs/exact/index';

import 'file-loader!./report.html';
import './report.scss';
console.log('report');



let x0 = 0;
let y0 = 0;
let x1 = 3;
let step = 0.1;
let integrationConst = Math.exp(2 * x0) * (y0 - 2 * x0 + 1);


/**
 * Function for exact solution
 * Computing value of y in the certain point of x
 * @param x
 * @returns {number} value of y
 */
function solution(x: number) {
    const exp = Math.exp(2 * x);
    return (2 * x * exp - exp + integrationConst) / exp;
}


document.addEventListener("DOMContentLoaded", function () {
    parseKatex();
    calculateGraphReport();
});
let exactGraph: ExactGraph;

function calculateGraphReport() {
    exactGraph = new ExactGraph(solution)
        .compute({start: -2, end: 20}, 0.5)
        .draw(document.getElementById('exact'), {});
    console.log(exactGraph);
}
