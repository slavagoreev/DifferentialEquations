import { IMethodOptions } from '../../models/method.model';
import { EulerMethod } from '../euler/index';

export class RungeKuttaMethod extends EulerMethod {
    options: IMethodOptions = {
        displayName: 'Runge-Kutta\'s method',
        chartName: 'rungeKuttaMethod',
        initialValues: { x: 0, y: 0 },
        minimum: 0,
        maximum: 1,
        scaleType: 'linear'
    };
    constructor(equation: (x: number, y: number) => number, options?: IMethodOptions) {
        super(equation, options);
        if (options)
            this.options = {...this.options, ...options};
    }

    public compute(interval: { start: number; end: number; }, step: number): EulerMethod {
        for (let i = interval.start; i <= interval.end; i += step) {
            this.xCoords.push(+i);
        }
        let result, k1, k2, k3, k4;
        // Set the starting point
        this.yCoords.push(this.options.initialValues.y);
        for (let i = 1; i < this.xCoords.length; i++) {
            k1 = this.equation(this.xCoords[i-1], +this.yCoords[i-1]);
            k2 = this.equation(this.xCoords[i-1] + step/2, +this.yCoords[i-1] + step*k1/2);
            k3 = this.equation(this.xCoords[i-1] + step/2, +this.yCoords[i-1] + step*k2/2);
            k4 = this.equation(this.xCoords[i-1] + step, +this.yCoords[i-1] + step*k3);

            result = this.yCoords[i-1] + (step/6)*(k1+2*k2+2*k3+k4);
            this.yCoords.push(result);
        }
        this.findBoundaries();
        return this as EulerMethod;
    };

}
