import * as Chart from 'chart.js';
import { IMethod, IMethodOptions } from '../../models/method.model';
import { ChartOptions } from 'chart.js';

export class ErrorsGraph {
    public xCoords: number[] = [];
    public methods: IMethod[];
    public yCoordsByMethod: {[s: string]: number[]} = {};
    public chart: Chart = null;

    solution: (x: number) => number;
    options: IMethodOptions = {
        graphTitle: 'Global error comparison. You may click on the label to eliminate some line',
        initialValues: { x: 0, y: 0 },
        minimum: 0,
        maximum: 1,
        scaleType: 'linear'
    };

    constructor(methods: IMethod[], solution: (x: number) => number) {
        this.solution = solution;
        this.methods = methods;
    }

    public reset() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.xCoords = [];
        this.yCoordsByMethod = {};
        return this;

    }

    public compute(interval: { start: number; end: number; }, step: number) {
        for (let i = interval.start; i <= interval.end; i += step) {
            this.xCoords.push(+i);
        }
        // Set the starting point
        for (const chartName in this.methods) {
            const result = [];
            for (let i = 0; i < this.xCoords.length; i++) {
                if (!this.yCoordsByMethod[chartName]) {
                    this.yCoordsByMethod[chartName] = [];
                }
                const solution = this.solution(this.xCoords[i]);
                const error = Math.abs(solution - this.methods[chartName].yCoords[i]);
                result.push(new ErrorReport(solution, this.methods[chartName].yCoords[i], error));
                // Calculate absolute difference between points of solutions and method
                this.yCoordsByMethod[chartName].push(error);
            }
            console.info(this.methods[chartName].options.displayName);
            console.table(result);
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
                    data: this.xCoords.map(() => 0),
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

    public renderAllErrors() {
        let methodN = 0;
        const colors = ['#8859bf', '#dd6f00', '#ce3b4d'];
        // Set the starting point
        for (const chartName in this.methods) {
            this.addNewDataset(
                this.methods[chartName].options.displayName,
                this.yCoordsByMethod[chartName],
                colors[methodN]);

            methodN++;
        }
        this.chart.update();
        return this;
    }

    public printErrors() {
    }
}
class ErrorReport {
    exact: number;
    approximation: number;
    error: number;
    constructor (exact: number, approximation: number, error: number) {
        this.exact = exact;
        this.approximation = approximation;
        this.error = error;
    }
}
