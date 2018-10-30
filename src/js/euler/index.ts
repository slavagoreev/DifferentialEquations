import * as Chart from 'chart.js';
import { IMethod, IMethodOptions } from '../models/method.model';
import { ChartOptions } from 'chart.js';

export class EulerMethod implements IMethod {
    xCoords: number[] = [];
    yCoords: number[] = [];

    equation: (x: number, y: number) => number;
    options: IMethodOptions = {
        displayName: 'Euler\'s method',
        initialValues: { x: 0, y: 0 },
        minimum: 0,
        maximum: 1,
        scaleType: 'linear'
    };

    constructor(equation: (x: number, y: number) => number, options?: IMethodOptions) {
        this.equation = equation;
        if (options)
            this.options = options;
    }
    public compute(interval: { start: number; end: number; }, step: number) {
        for (let i = interval.start; i <= interval.end; i += step) {
            this.xCoords.push(+i);
        }
        let result;
        // Set the starting point
        this.yCoords.push(this.options.initialValues.y);
        for (let i = 1; i < this.xCoords.length; i++) {
            result = this.yCoords[i-1] + step * (this.equation(this.xCoords[i-1], this.yCoords[i-1]));

            this.yCoords.push(result);
        }
        this.findBoundaries();
        return this as EulerMethod;
    };

    private findBoundaries() {
        this.yCoords.forEach((num, i) => {
            if (num > this.options.maximum) {
                this.options.maximum = num;
                if (num > 1000) {
                    this.options.scaleType = 'logarithmic';
                    this.yCoords[i] = 1000;
                }
            } else if (num < this.options.minimum) {
                this.options.minimum = num;
            }
        })
    }

    public draw(ctx: any, options: ChartOptions) {
        let y;
        console.log(this.yCoords);
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.xCoords.map((num) => num.toFixed(1)),
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: `#8859bf`,
                    borderColor: `#a770d7`,
                    data: this.yCoords,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: this.options.displayName,
                },
                // scales: {
                //     yAxes: [{
                //         ticks: {
                //             suggestedMin:  this.options.minimum * 1.1,
                //
                //             // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
                //             suggestedMax: this.options.maximum * 1.1
                //         },
                //         type: this.options.scaleType,
                //     }]
                // }
            }
        });
        (window as any).eulerChart = chart;
        return this as EulerMethod;
    };
}
