import $ from 'basic-dom-helper';

import { Decimal, ComplexDecimal, MultiArray, Evaluator, TEvaluatorConfig, NodeName, NodeExpr, TAliasNameTable } from 'mathjslab';
export { Evaluator };

import { MathMarkdown } from './math-markdown';
export { MathMarkdown };

export type MathJSLabCalcConfiguration = {
    exampleBaseUrl?: string;
    helpBaseUrl?: string;
    defaultLanguage?: string;
};

declare global {
    /* eslint-disable-next-line  no-var */
    var MathJSLabCalc: MathJSLabCalcConfiguration;
    /* eslint-disable-next-line  no-var */
    var MathJSLabCalcBuildMessage: string;
}

export const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
if (typeof global.MathJSLabCalc === 'undefined') {
    global.MathJSLabCalc = {
        exampleBaseUrl: baseUrl,
        helpBaseUrl: baseUrl,
        defaultLanguage: 'en',
    };
} else {
    if (global.MathJSLabCalc.exampleBaseUrl !== undefined || global.MathJSLabCalc.exampleBaseUrl !== null) {
        if (global.MathJSLabCalc.exampleBaseUrl![global.MathJSLabCalc.exampleBaseUrl!.length - 1] !== '/') {
            global.MathJSLabCalc.exampleBaseUrl += '/';
        }
    } else {
        global.MathJSLabCalc.exampleBaseUrl = baseUrl;
    }
    if (global.MathJSLabCalc.helpBaseUrl !== undefined || global.MathJSLabCalc.helpBaseUrl !== null) {
        if (global.MathJSLabCalc.helpBaseUrl![global.MathJSLabCalc.helpBaseUrl!.length - 1] !== '/') {
            global.MathJSLabCalc.helpBaseUrl += '/';
        }
    } else {
        global.MathJSLabCalc.helpBaseUrl = baseUrl;
    }
    if (global.MathJSLabCalc.defaultLanguage === undefined || global.MathJSLabCalc.defaultLanguage === null) {
        global.MathJSLabCalc.defaultLanguage = 'en';
    }
}

export let languageAlias: Record<string,TAliasNameTable> = {
    en: {},
    pt: {
        /* Number functions */
        abs: /^abs(olut(o|e))?$/,
        arg: /^arg(ument(o)?)?|angle|angulo$/,
        sign: /^sign(al)?|sinal|sgn$/,
        conj: /^conj(uga(do|te)?)?$/,
        sqrt: /^r(ai)?z(2|q(uadrada)?)|sqrt$/,
        root: /^r(ai)?z|r(oo)?t$/,
        power: /^pot(encia)?|elev(ado)?|pow(er)?$/,
        exp: /^exp(onen((cial)|(tial)))?$/,
        ln: /^ln$/,
        log: /^log$/,
        log10: /^log10$/,
        asin: /^a(rc)?s[ei]n$/,
        sin: /^s[ei]n$/,
        acos: /^a(rc)?cos$/,
        cos: /^cos$/,
        atan: /^a(rc)?t(g|an)$/,
        tan: /^t(g|an)$/,
        asinh: /^a(rc)?s[ei]nh$/,
        sinh: /^s[ei]nh$/,
        acosh: /^a(rc)?cosh$/,
        cosh: /^cosh$/,
        atanh: /^a(rc)?t(g|an)h$/,
        tanh: /^t(g|an)h$/,
        factorial: /^fa(c)?t(orial)?$/,
        binomial: /^binom(i(o|al))?$/,
        /* Matrix functions */
        eye: /^ident(i(dade|ty))?|eye$/,
        inv: /^inv(er(t(er)?|s[ea])?)?$/,
        det: /^det(erminant(e)?)?$/,
        trace: /^tr(aco|ace)$/,
        ctranspose: /^trans(p((ose)?|(osta)?))?$/,
        elem: /^elem(ento?)?$/,
        row: /^lin(ha|e)?|row$/,
        nrows: /^n(um)?lin(has|es)?|nrows$/,
        col: /^col(u(na|mn))?$/,
        ncols: /^n(um)?col(u(na|mn))?s$/,
        minor: /^m[ie]nor$/,
        cofactor: /^cofa(c)?t(or)?$/,
        adj: /^adj(unta|oint)?$/,
        pivot: /^pivot?$/,
        // lu: /^lu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osicao|osition)?)?)?lu$/,
        // plu: /^plu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osicao|osition)?)?)?plu$/,
        min: /^min(imo)?|min(imum)?$/,
        max: /^max(imo)?|max(imum)?$/,
        mean: /^media|mean$/,
        /* Special functions */
        summation: /^soma(torio)?|sum(mation)?$/,
        productory: /^prod(torio|(ctory)?)$/,
        plot2d: /^gra(f(ico)?|ph?(ics?)?)?$/,
        histogram: /^hist(ogram(a)?)?$/,
    }
}

export let lang = navigator.language.split('-')[0];
if (!(lang in languageAlias)) {
    lang = global.MathJSLabCalc.defaultLanguage as string;
}

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

export const plotWidth = 100;

export const insertOutput = { type: '' };

/* eslint-disable-next-line  @typescript-eslint/ban-types */
export const outputFunction: { [k: string]: Function } = {
    plot2d: function (parent: string): void {
        if (global.ShellPointer.isFileProtocol) {
            const promptSet = global.ShellPointer.currentPromptSet;
            promptSet.box.className = 'bad';
            promptSet.output.innerHTML = 'plot2d command unavailable <b>offline</b>.';
        } else {
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
        }
        insertOutput.type = '';
    },
    histogram: function (parent: string): void {
        if (global.ShellPointer.isFileProtocol) {
            const promptSet = global.ShellPointer.currentPromptSet;
            promptSet.box.className = 'bad';
            promptSet.output.innerHTML = 'histogram command unavailable <b>offline</b>.';
        } else {
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
        }
        insertOutput.type = '';
    },
};

export const EvaluatorConfiguration: TEvaluatorConfig = {
    /**
     * Alias table
     */
    aliasTable: languageAlias[lang],

    /**
     * External function table
     */
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

    /**
     * External command word list table
     */
    externalCmdWListTable: {
        help: {
            func: (...args: string[]): void => {
                const encodeName = (name: string): string => {
                    name = global.EvaluatorPointer.aliasName(name);
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
                        fetch(`${global.MathJSLabCalc.helpBaseUrl}help/${lang}/${encodeURIComponent(encodeName(args[0]))}.md`)
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

replace NAME with operator or the name of the command or function you would like to learn more about.

### Operators:

&plus; &nbsp; - &nbsp; .\* &nbsp; \* &nbsp; ./ &nbsp; / &nbsp; .\\ &nbsp; \\ &nbsp; .^ &nbsp; ^ &nbsp;
\*\* &nbsp; .** &nbsp; .\' &nbsp; \' &nbsp; < &nbsp; <= &nbsp; == &nbsp; >= &nbsp; > &nbsp; != &nbsp;
~= &nbsp; &amp; &nbsp; | &nbsp; ! &nbsp; ~ &nbsp; &amp;&amp; &nbsp; || &nbsp; ++ &nbsp; --

### Functions:

${global.EvaluatorPointer.baseFunctionList
    .map((func) => `\`${func}\``)
    .sort()
    .join(', ')}`,
                    );
                    MathMarkdown.typeset();
                } else {
                    promptSet.box.className = 'bad';
                    promptSet.output.innerHTML = `help: function called with too many inputs`;
                }
            },
        },
        clear: {
            func: () => {
                global.EvaluatorPointer.Restart();
                const promptSet = global.ShellPointer.currentPromptSet;
                promptSet.box.className = 'good';
                promptSet.output.innerHTML = `clear variables`;
            },
        },
    },
};

/**
 * Evaluator an MathMarkdown initialization.
 */
export const evaluator = Evaluator.initialize(EvaluatorConfiguration);
import buildConfiguration from './build-configuration.json';
evaluator.debug = buildConfiguration.debug;
global.MathJSLabCalcBuildMessage = buildConfiguration.buildMessage;
MathMarkdown.initialize();
