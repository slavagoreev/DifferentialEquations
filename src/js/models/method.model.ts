import { ChartOptions } from "chart.js";

export interface IMethod {
    xCoords: number[];
    yCoords: number[];

    /**
     * Equation to be computed
     * @param x
     * @param y
     */
    equation: (x: number, y: number) => number;
    options: IMethodOptions;

    /**
     * Initializes method of computing
     * @param equation to be computed
     * @param options that specifies further behaviour of method
     */
    init?: (equation: (x: number, y: number) => number, options?: IMethodOptions) => IMethod;

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
    displayName?: string;
    initialValues: { x: number; y: number };
    minimum?: number;
    maximum?: number;
    scaleType?: string;
}
