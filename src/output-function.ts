import { plotData } from './plot/plot-data';
import { CanvasHistogram } from './plot/canvas-histogram';
import { CanvasPlot } from './plot/canvas-plot';
import { plotHeight, plotWidth } from './evaluator-configuration';

export const insertOutput = { type: '' };

/* eslint-disable-next-line  @typescript-eslint/ban-types */
export const outputFunction: { [k: string]: Function } = {
    plot: function (parent: string): void {
        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const cv = new CanvasPlot(parent, plotWidth, plotHeight, plotData);
        insertOutput.type = '';
    },
    hist: function (parent: string): void {
        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const cv = new CanvasHistogram(parent, plotWidth, plotHeight, plotData);
        insertOutput.type = '';
    },
};
