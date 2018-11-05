import { parseKatex } from '../../katex/index';
import { EulerMethod } from '../../graphs/euler/index';
import { ImprovedEulerMethod } from '../../graphs/improved/index';
import { RungeKuttaMethod } from '../../graphs/runge-kutta/index';
// @ts-ignore
import * as IMask from 'imask';
import { ErrorsGraph } from '../../graphs/errors/index';
import { ExactGraph } from '../../graphs/exact/index';
import './index.scss';

let x0 = 0;
let y0 = 0;
let x1 = 3;
let step = 0.1;
let integrationConst = Math.exp(2 * x0) * (y0 - 2 * x0 + 1);

/**
 * Function for numerical methods
 * f(x,y) = -2y + 4x
 * @param x
 * @param y
 * @returns {number} the value of f(x,y) in this point
 */
function equation(x: number, y: number) {
    return -2 * y + 4 * x;
}

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
    calculateGraphs();
    renderMaskedInputs();
    newInputHandler();
});
let euler: EulerMethod,
    improvedEulerMethod: ImprovedEulerMethod,
    rungeKuttaMethod: RungeKuttaMethod,
    globalErrors: ErrorsGraph,
    exactSolution: number[],
    exactGraph: ExactGraph,
    form: HTMLFormElement;

function calculateGraphs() {
    euler = new EulerMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step)
        .draw(document.getElementById('euler'), {});
    (euler.chart.canvas.parentNode as any).style.height = '300px';

    improvedEulerMethod = new ImprovedEulerMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step);

    rungeKuttaMethod = new RungeKuttaMethod(equation, {
        initialValues: { x: x0, y: y0 }
    }).compute({start: x0, end: x1}, step);
    updateGraphs();
}
function calculateGraphReport() {
    exactGraph = new ExactGraph(solution)
        .compute({start: x0, end: x1}, step)
        .draw(document.getElementById('exact'), {});
    console.log(exactSolution);
}

function updateGraphs() {
    euler.addNewDataset(
        'Improved Euler\'s method',
        improvedEulerMethod.yCoords,
        '#dd6f00');

    euler.addNewDataset(
        'Runge-Kutta\'s method',
        improvedEulerMethod.yCoords,
        '#ce3b4d');
    exactSolution = euler.xCoords.map((x) => solution(x));
    euler.addNewDataset(
        'Exact',
        exactSolution,
        '#00ac23');
    if (globalErrors) {
        globalErrors.reset();
    }
    calculateErrors();
}

function calculateErrors() {
    globalErrors = new ErrorsGraph([ euler, improvedEulerMethod, rungeKuttaMethod ], solution)
        .compute({start: x0, end: x1}, step)
        .draw(document.getElementById('globalErrors'), {})
        .renderAllErrors();
}

function renderMaskedInputs() {
    const elements = document.querySelectorAll('.masked');
    elements.forEach((input: HTMLInputElement) => {
        const maskOptions = {
            mask: new RegExp(input.attributes.getNamedItem('data-mask').value, "i"),
        };
        new IMask(input, maskOptions);
        autoSize(input)
    });
}

function autoSize(input: HTMLInputElement) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'position: absolute; left: -9999px');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    resizeInput(ctx, input, null, true);
    input.addEventListener('keydown', function (e) {
        resizeInput(ctx, this, e, false);
    });
    input.addEventListener('keyup', () => {
        if (input.value === '') {
            input.style.width = `10px`;
        }
    });
    input.addEventListener('keypress', (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            form.submit();
            return false;
        }
    });
}

function resizeInput(ctx: CanvasRenderingContext2D, input: HTMLInputElement, e: KeyboardEvent, force = false) {
    // Numbers and delete buttons only
    if (force || (e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode == 46 || e.keyCode == 8 || e.key === '.' || e.key === ',') {
        ctx.font = getComputedStyle(input,null).getPropertyValue('font');
        if (e && (e.keyCode == 46 || e.keyCode == 8)) {
            // Shrink on backspace
            input.style.width = ctx.measureText(input.value).width + 'px';
        } else {
            // Grow on number typed
            input.style.width = ctx.measureText(input.value + '  ').width + 9 + 'px';
        }
    }
}

function newInputHandler() {
    form = document.getElementById('initial-values') as HTMLFormElement;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newX0: any = document.getElementById('initialX0');
        const newY0: any = document.getElementById('initialY0');
        const newX1: any = document.getElementById('initialX1');
        const newStep: any = document.getElementById('step');
        // `+` means `convert to number`
        x0 = +newX0.value;
        y0 = +newY0.value;
        x1 = +newX1.value;
        step = +newStep.value;
        integrationConst = Math.exp(2 * x0) * (y0 - 2 * x0 + 1);
        euler.reset()
            .updateOptions({ initialValues: { x: x0, y: y0 } })
            .compute({start: x0, end: x1}, step)
            .draw(document.getElementById('euler'), {});
        improvedEulerMethod.reset()
            .updateOptions({ initialValues: { x: x0, y: y0 } })
            .compute({start: x0, end: x1}, step);
        rungeKuttaMethod.reset()
            .updateOptions({ initialValues: { x: x0, y: y0 } })
            .compute({start: x0, end: x1}, step);
        updateGraphs();
        return false;
    });
    form.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) {
            var src: any = e.srcElement || e.target;
            if (src.tagName.toLowerCase() != "textarea") {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }
            }
        }
    });

}
