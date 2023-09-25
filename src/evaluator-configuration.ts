import $ from 'basic-dom-helper';
/* Number and matrix operations and functions */
import { Decimal, ComplexDecimal, MultiArray, Evaluator, TEvaluatorConfig, NodeName, NodeExpr } from 'mathjslab';
export { Evaluator };

import { MathMarkdown } from './math-markdown';
export { MathMarkdown };

declare const Chart: any;

export type PlotData = {
    data: Array<number>;
    X: Array<number | string>;
    MinX: number;
    MaxX: number;
    MinY: number;
    MaxY: number;
};

export const plotData: PlotData = {
    data: [],
    X: [],
    MinX: 0,
    MaxX: 0,
    MinY: 0,
    MaxY: 0,
};

export const plotWidth = 550;
export const plotHeight = 300;

export const insertOutput = { type: '' };

/* eslint-disable-next-line  @typescript-eslint/ban-types */
export const outputFunction: { [k: string]: Function } = {
    plot2d: function (parent: string): void {
        const ctx = $.create('canvas', parent);
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: plotData.X,
                datasets: [
                    {
                        label: 'Plot',
                        data: plotData.data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                    },
                ],
            },
        });
        insertOutput.type = '';
    },
    histogram: function (parent: string): void {
        const ctx = $.create('canvas', parent);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: plotData.X,
                datasets: [
                    {
                        label: 'Histogram',
                        data: plotData.data,
                        borderWidth: 1,
                    },
                ],
            },
        });
        insertOutput.type = '';
    },
};

export const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
export const lang = navigator.language;

export const EvaluatorConfiguration: TEvaluatorConfig = {
    aliasTable: {
        /* Number functions */
        abs: /^abs(olut(o|e))?$/i,
        arg: /^arg(ument(o)?)?|angle|[aâ]ngulo$/i,
        sign: /^sign(al)?|sinal|sgn$/i,
        conj: /^conj(uga(do|te)?)?$/i,
        sqrt: /^r(ai)?z(2|q(uadrada)?)|sqrt$/i,
        root: /^r(ai)?z|r(oo)?t$/i,
        power: /^pot([eê]ncia)?|elev(ado)?|pow(er)?$/i,
        exp: /^exp(onen((cial)|(tial)))?$/i,
        ln: /^ln$/i,
        log: /^log$/i,
        log10: /^log10$/i,
        asin: /^a(rc)?s[ei]n$/i,
        sin: /^s[ei]n$/i,
        acos: /^a(rc)?cos$/i,
        cos: /^cos$/i,
        atan: /^a(rc)?t(g|an)$/i,
        tan: /^t(g|an)$/i,
        asinh: /^a(rc)?s[ei]nh$/i,
        sinh: /^s[ei]nh$/i,
        acosh: /^a(rc)?cosh$/i,
        cosh: /^cosh$/i,
        atanh: /^a(rc)?t(g|an)h$/i,
        tanh: /^t(g|an)h$/i,
        factorial: /^fa(c)?t(orial)?$/i,
        binomial: /^binom(i(o|al))?$/i,
        /* Matrix functions */
        eye: /^ident(i(dade|ty))?|eye$/i,
        inv: /^inv(er(t(er)?|s[ea])?)?$/i,
        det: /^det(erminant(e)?)?$/i,
        trace: /^tr(a[cç]o|ace)$/i,
        ctranspose: /^trans(p((ose)?|(osta)?))?$/i,
        elem: /^elem(ento?)?$/i,
        row: /^lin(ha|e)?|row$/i,
        nrows: /^n(um)?lin(has|es)?|nrows$/i,
        col: /^col(u(na|mn))?$/i,
        ncols: /^n(um)?col(u(na|mn))?s$/i,
        minor: /^m[ie]nor$/i,
        cofactor: /^cofa(c)?t(or)?$/i,
        adj: /^adj(unta|oint)?$/i,
        pivot: /^piv[oô]t?$/i,
        // lu: /^lu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osi[cç][aã]o|osition)?)?)?lu$/i,
        // plu: /^plu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osi[cç][aã]o|osition)?)?)?plu$/i,
        min: /^m[ií]]n(imo)?|min(imum)?$/i,
        max: /^m[aá]x(imo)?|max(imum)?$/i,
        mean: /^m[eé]dia|mean$/i,
        /* Special functions */
        summation: /^soma(t[oó]rio)?|sum(mation)?$/i,
        productory: /^prod(t[oó]rio|(ctory)?)$/i,
        plot2d: /^gr[aá](f(ico)?|ph?(ics?)?)?$/i,
        histogram: /^hist(ogram(a)?)?$/i,
        /* Constants */
        pi: /^cte\.pi$/i,
        e: /^cte\.e$/i,
    },

    externalFunctionTable: {
        summation: {
            ev: [false, true, true, false],
            func: (variable: NodeName, start: ComplexDecimal, end: ComplexDecimal, expr: NodeExpr): ComplexDecimal => {
                if (!start.im.eq(0)) throw new Error('complex number sum index');
                if (!end.im.eq(0)) throw new Error('complex number sum index');
                let result: ComplexDecimal = ComplexDecimal.zero();
                const sum_function_name = `summation`;
                global.EvaluatorPointer.localTable[sum_function_name] = {};
                for (let i = start.re.toNumber(); i <= end.re.toNumber(); i++) {
                    global.EvaluatorPointer.localTable[sum_function_name][variable.id] = new ComplexDecimal(i, 0);
                    result = ComplexDecimal.add(result, global.EvaluatorPointer.Evaluator(expr, true, sum_function_name));
                }
                delete global.EvaluatorPointer.localTable[sum_function_name];
                return result;
            },
        },

        productory: {
            ev: [false, true, true, false],
            func: (variable: NodeName, start: ComplexDecimal, end: ComplexDecimal, expr: NodeExpr): ComplexDecimal => {
                if (!start.im.eq(0)) throw new Error('complex number prod index');
                if (!end.im.eq(0)) throw new Error('complex number prod index');
                let result: ComplexDecimal = ComplexDecimal.one();
                const prod_function_name = `productory`;
                global.EvaluatorPointer.localTable[prod_function_name] = {};
                for (let i = start.re.toNumber(); i <= end.re.toNumber(); i++) {
                    global.EvaluatorPointer.localTable[prod_function_name][variable.id] = new ComplexDecimal(i, 0);
                    result = ComplexDecimal.mul(result, global.EvaluatorPointer.Evaluator(expr, true, prod_function_name));
                }
                delete global.EvaluatorPointer.localTable[prod_function_name];
                return result;
            },
        },

        plot2d: {
            ev: [false, false, true, true],
            func: (expr: NodeExpr, variable: NodeName, minx: ComplexDecimal, maxx: ComplexDecimal): NodeExpr => {
                insertOutput.type = 'plot2d';
                if (!minx.im.eq(0)) {
                    throw new Error('complex number in plot2d minimum x axis');
                } else {
                    plotData.MinX = minx.re.toNumber();
                }
                if (!maxx.im.eq(0)) {
                    throw new Error('complex number in plot2d maximum x axis');
                } else {
                    plotData.MaxX = maxx.re.toNumber();
                }
                const deltaX = (plotData.MaxX - plotData.MinX) / plotWidth;
                const plot_function_name = `plot2d`;
                global.EvaluatorPointer.localTable[plot_function_name] = {};
                const save_precision = Decimal.precision;
                Decimal.set({ precision: 20 });
                plotData.MaxY = 0;
                plotData.MinY = 0;
                plotData.X = [];
                plotData.data = [];
                for (let i = 0; i < plotWidth; i++) {
                    global.EvaluatorPointer.localTable[plot_function_name][variable.id] = new ComplexDecimal(plotData.MinX + deltaX * i, 0);
                    plotData.X[i] = global.EvaluatorPointer.localTable[plot_function_name][variable.id].re.toNumber();
                    const data_y = global.EvaluatorPointer.Evaluator(expr, true, plot_function_name);
                    if (isFinite(data_y.re.toNumber()) && isFinite(data_y.im.toNumber()) && data_y.im.eq(0)) {
                        plotData.data[i] = data_y.re.toNumber();
                    } else {
                        throw new Error('non real number in plot2d y axis');
                    }
                    plotData.MaxY = Math.max(plotData.MaxY, plotData.data[i]);
                    plotData.MinY = Math.min(plotData.MinY, plotData.data[i]);
                }
                delete global.EvaluatorPointer.localTable[plot_function_name];
                Decimal.set({ precision: save_precision });
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('plot2d'), { list: [expr, variable, minx, maxx] });
            },
        },

        histogram: {
            ev: [true, true],
            func: (IMAG: MultiArray, DOM?: MultiArray): NodeExpr => {
                insertOutput.type = 'histogram';
                if (IMAG.dim[0] !== 1) {
                    IMAG = MultiArray.transpose(IMAG);
                }
                if (DOM && DOM.dim[0] !== 1) {
                    DOM = MultiArray.transpose(DOM);
                }
                plotData.MaxY = 0;
                plotData.MinY = 0;
                plotData.X = [];
                plotData.data = [];
                for (let i = 0; i < IMAG.dim[1]; i++) {
                    if (DOM) {
                        if ('re' in DOM.array[0][i]) {
                            plotData.X[i] = DOM.array[0][i].re.toNumber();
                        } else if ('str' in DOM.array[0][i]) {
                            plotData.X[i] = (DOM.array[0][i] as any).str;
                        }
                    } else {
                        plotData.X[i] = i;
                    }
                    if (isFinite(IMAG.array[0][i].re.toNumber()) && isFinite(IMAG.array[0][i].im.toNumber()) && IMAG.array[0][i].im.eq(0)) {
                        plotData.data[i] = IMAG.array[0][i].re.toNumber();
                    } else {
                        throw new Error('non real number in histogram y axis');
                    }
                    plotData.MaxY = Math.max(plotData.MaxY, plotData.data[i]);
                    plotData.MinY = Math.min(plotData.MinY, plotData.data[i]);
                }
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('histogram'), { list: [IMAG, DOM] });
            },
        },
    },

    externalCmdWListTable: {
        help: {
            func: (...args: string[]): void => {
                const encodeName = (name: string): string => {
                    const result: string[] = [];
                    for (let i = 0; i < name.length; i++) {
                        const c = name.charCodeAt(i);
                        if (
                            (c >= 48 && c <= 57) || // digit
                            (c >= 65 && c <= 90) || // Upper case letter
                            (c >= 97 && c <= 122) // Lower case letter
                        ) {
                            result.push(name[i]);
                        } else {
                            result.push(`%${name.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0')}`);
                        }
                    }
                    return result.join('');
                };
                const promptSet = global.ShellPointer.currentPromptSet;
                if (args.length == 1) {
                    if (global.ShellPointer.isFileProtocol) {
                        promptSet.box.className = 'bad';
                        promptSet.output.innerHTML = 'help command unavailable <b>offline</b>.';
                    } else {
                        fetch(`${baseUrl}help/${lang}/${encodeURIComponent(encodeName(args[0]))}.md`)
                            .then((response) => {
                                if (response.ok) {
                                    promptSet.box.className = 'info';
                                    return response.text();
                                } else {
                                    promptSet.box.className = 'bad';
                                    return `help ${args[0]} not found.`;
                                }
                            })
                            .then((responseText) => {
                                promptSet.output.innerHTML = MathMarkdown.md2html(responseText);
                                MathMarkdown.typeset();
                            });
                    }
                } else if (args.length == 0) {
                    promptSet.box.className = 'info';
                    promptSet.output.innerHTML = MathMarkdown.md2html(
                        `For help with individual commands and functions type

\`help NAME\`

(replace NAME with the name of the command or function you would like to learn more about).

### Operators:

${global.EvaluatorPointer.opList.map((op) => `\`${op}\``).join(', ')}

### Functions:

${global.EvaluatorPointer.baseFunctionList.map((func) => `\`${func}\``).join(', ')}`,
                    );
                    MathMarkdown.typeset();
                } else {
                    promptSet.box.className = 'bad';
                    promptSet.output.innerHTML = `help: function called with too many inputs`;
                }
            },
        },
        restart: {
            func: () => {
                global.EvaluatorPointer.Restart();
                const promptSet = global.ShellPointer.currentPromptSet;
                promptSet.box.className = 'good';
                promptSet.output.innerHTML = `restart`;
            },
        },
    },
};

/**
 * Evaluator instance.
 */
export const evaluator = Evaluator.initialize(EvaluatorConfiguration);

MathMarkdown.initialize();
