import { ChartOptions } from "chart.js";
import * as Chart from 'chart.js';

export interface IMethod {
    xCoords: number[];
    yCoords: number[];
    chart: Chart;

    /**
     * Equation to be computed
     * @param x
     * @param y
     */
    equation: (x: number, y: number) => number;
    options: IMethodOptions;

    /**
     * Updates options
     * @param new options
     */
    updateOptions: (options: IMethodOptions) => IMethod;

    /**
     * Resets graph
     */
    reset: () => IMethod;

    /**
     * Computes the graph of equation with given parameters
     * @param interval of computation
     * @param step of computation
     */
    compute: (interval: { start: number; end: number; }, step?: number) => IMethod;

    /**
     * Draws a plot
     * @param ctx into which will be drawn
     * @param options of Chart.js
     */
    draw: (ctx: any, options: ChartOptions) => IMethod;
}

export interface IMethodOptions {
    graphTitle?: string;
    displayName?: string;
    chartName?: string;
    initialValues: { x: number; y: number };
    minimum?: number;
    maximum?: number;
    scaleType?: string;
}
