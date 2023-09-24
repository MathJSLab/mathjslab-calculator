/* Number and matrix operations and functions */
import { Decimal, ComplexDecimal, MultiArray, Evaluator, TEvaluatorConfig, NodeName, NodeExpr } from 'mathjslab';
export { Evaluator };

import { MathMarkdown } from './math-markdown';
export { MathMarkdown };

import { CanvasPlot } from './plot/canvas-plot';
import { CanvasHistogram } from './plot/canvas-histogram';
import { plotData } from './plot/plot-data';

export const plotWidth = 550;
export const plotHeight = 300;

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
        pow: /^pot([eê]ncia)?|elev(ado)?|pow$/i,
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
                insertOutput.type = 'plot';
                if (!minx.im.eq(0)) {
                    throw new Error('complex number in plot minimum x axis');
                } else {
                    plotData.MinX = minx.re.toNumber();
                }
                if (!maxx.im.eq(0)) {
                    throw new Error('complex number in plot maximum x axis');
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
                for (let i = 0; i < plotWidth; i++) {
                    global.EvaluatorPointer.localTable[plot_function_name][variable.id] = new ComplexDecimal(plotData.MinX + deltaX * i, 0);
                    const data_y = global.EvaluatorPointer.Evaluator(expr, true, plot_function_name);
                    if (isFinite(data_y.re.toNumber()) && isFinite(data_y.im.toNumber()) && data_y.im.eq(0)) {
                        plotData.data[i] = data_y.re.toNumber();
                    } else {
                        throw new Error('non real number in plot y axis');
                    }
                    plotData.MaxY = Math.max(plotData.MaxY, plotData.data[i]);
                    plotData.MinY = Math.min(plotData.MinY, plotData.data[i]);
                }
                delete global.EvaluatorPointer.localTable[plot_function_name];
                Decimal.set({ precision: save_precision });
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('plot'), { list: [expr, variable, minx, maxx] });
            },
        },

        histogram: {
            // histogram
            ev: [true],
            func: (M: MultiArray): NodeExpr => {
                insertOutput.type = 'hist';
                const DMin = Math.min(M.dim[0], M.dim[1]);
                let temp: any = M;
                if (DMin != 1 && DMin != 2) {
                    throw new Error('invalid dimensions in hist');
                } else {
                    if (DMin == M.dim[1]) {
                        temp = MultiArray.transpose(M);
                    }
                    plotData.MaxY = 0;
                    plotData.MinY = 0;
                    for (let i = 0; i < temp.dim[1]; i++) {
                        if (isFinite(temp.array[0][i].re.toNumber()) && isFinite(temp.array[0][i].im.toNumber()) && temp.array[0][i].im.eq(0)) {
                            plotData.data[i] = temp.array[0][i].re.toNumber();
                        } else {
                            throw new Error('non real number in histogram y axis');
                        }
                        plotData.MaxY = Math.max(plotData.MaxY, plotData.data[i]);
                        plotData.MinY = Math.min(plotData.MinY, plotData.data[i]);
                    }
                    if (temp.dim[0] == 2) {
                        plotData.MaxX = 0;
                        plotData.MinX = 0;
                        for (let i = 0; i < temp.dim[1]; i++) {
                            if ('str' in temp.array[1][0]) {
                                plotData.tag[i] = temp.array[1][i].str;
                            } else {
                                if (
                                    isFinite(temp.array[1][i].re.toNumber()) &&
                                    isFinite(temp.array[1][i].im.toNumber()) &&
                                    temp.array[1][i].im.eq(0)
                                ) {
                                    plotData.tag[i] = temp.array[1][i].re.toNumber().toString();
                                } else {
                                    throw new Error('non real number in histogram x axis');
                                }
                                plotData.MaxX = Math.max(plotData.MaxX, M.array[1][i].re.toNumber());
                                plotData.MinX = Math.min(plotData.MinX, M.array[1][i].re.toNumber());
                            }
                        }
                    }
                }
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('hist'), { list: [temp] });
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
            }
        }
    },
};

/**
 * Evaluator instance.
 */
export const evaluator = Evaluator.initialize(EvaluatorConfiguration);

MathMarkdown.initialize();
