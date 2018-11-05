import { IMethodOptions } from '../../models/method.model';
import { EulerMethod } from '../euler/index';

export class ImprovedEulerMethod extends EulerMethod {
    options: IMethodOptions = {
        displayName: 'Improved Euler\'s method',
        chartName: 'improvedEulerChart',
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
        let result;
        // Set the starting point
        this.yCoords.push(this.options.initialValues.y);
        for (let i = 1; i < this.xCoords.length; i++) {
            result = this.yCoords[i - 1] + step * (this.equation(+this.xCoords[i - 1] + step / 2, this.yCoords[i - 1] + (step / 2) * this.equation(this.xCoords[i-1], +this.yCoords[i-1])));
            this.yCoords.push(result);
        }
        this.findBoundaries();
        return this as EulerMethod;
    };

}
