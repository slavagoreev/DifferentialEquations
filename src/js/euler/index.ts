import * as Chart from 'chart.js';
import { IMethod, IMethodOptions } from '../models/method.model';
import { ChartOptions } from 'chart.js';
import { ChartDataSets } from 'chart.js';

export class EulerMethod implements IMethod {
    public xCoords: number[] = [];
    public yCoords: number[] = [];
    public chart: Chart = null;

    equation: (x: number, y: number) => number;
    options: IMethodOptions = {
        displayName: 'Euler\'s method',
        chartName: 'eulerChart',
        initialValues: { x: 0, y: 0 },
        minimum: 0,
        maximum: 1,
        scaleType: 'linear'
    };

    constructor(equation: (x: number, y: number) => number, options?: IMethodOptions) {
        this.equation = equation;
        if (options)
            this.options = {...this.options, ...options};
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

    protected findBoundaries() {
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
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.xCoords.map((num) => num.toFixed(1)),
                datasets: [{
                    label: this.options.displayName,
                    backgroundColor: `#8859bf`,
                    borderColor: `#a770d7`,
                    data: this.yCoords,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: this.options.displayName,
                },
            }
        });
        (window as any)[this.options.chartName] = chart;
        this.chart = chart;
        return this as EulerMethod;
    };

    public addNewDataset(label: string, data: number[], color: string) {
        this.chart.data.datasets.push({
            data,
            label,
            backgroundColor: color,
            borderColor: color,
            type: 'line',
            fill: false,
        });
        this.chart.update();
    }
}
