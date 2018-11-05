import * as Chart from 'chart.js';
import { IMethod, IMethodOptions } from '../../models/method.model';
import { ChartOptions } from 'chart.js';

export class ExactGraph {
    public xCoords: number[] = [];
    public yCoords: number[] = [];
    public chart: Chart = null;

    solution: (x: number) => number;

    options: IMethodOptions = {
        graphTitle: 'Exact solution of the equation',
        displayName: 'Graph of the solution',
        chartName: 'exact',
        initialValues: { x: 0, y: 0 },
        minimum: 0,
        maximum: 1,
        scaleType: 'linear'
    };

    constructor(solution: (x: number) => number) {
        this.solution = solution;
    }

    public reset() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.xCoords = [];
        this.yCoords = [];
        return this;

    }

    public compute(interval: { start: number; end: number; }, step: number) {
        for (let i = interval.start; i <= interval.end; i += step) {
            this.xCoords.push(+i);
            this.yCoords.push(this.solution(i));
        }
        return this;
    };

    public draw(ctx: any, options: ChartOptions) {
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.xCoords.map((num) => num.toFixed(1)),
                datasets: [{
                    label: 'Exact solution',
                    backgroundColor: `#009125`,
                    borderColor: `#00ac23`,
                    data: this.yCoords,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: this.options.graphTitle,
                },
            }
        });
        return this;
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
    }
}
