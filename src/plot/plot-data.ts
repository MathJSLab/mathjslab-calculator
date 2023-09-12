export type PlotData = {
    data: Array<number>;
    tag: Array<string>;
    MinX: number;
    MaxX: number;
    MinY: number;
    MaxY: number;
};

export const plotData: PlotData = {
    data: [],
    tag: [],
    MinX: 0,
    MaxX: 0,
    MinY: 0,
    MaxY: 0,
};
