import $, { Tfetch } from 'basic-dom-helper';

import { Decimal, ComplexDecimal, MultiArray, Evaluator, TEvaluatorConfig, NodeName, NodeExpr, TAliasNameTable, CharString } from 'mathjslab';
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
    /* eslint-disable-next-line  no-var */
    var compatibleFetch: Tfetch;
    /* eslint-disable-next-line  no-var */
    var lang: string;
    /* eslint-disable-next-line  no-var */
    var setLanguage: (lang?: string) => void;
}
global.compatibleFetch = $.fetch;

export const languageAlias: Record<string, TAliasNameTable> = {
    en: {
        /* Number functions */
        abs: /^abs(olute)?$/,
        arg: /^arg(ument)?$|^angle$/,
        sign: /^sign(al)?$|^sgn$/,
        conj: /^conj(ugate)?$/,
        sqrt: /^sq(uare)?r(oo)?t$/,
        root: /^r(oo)?t$/,
        power: /^pow(er)?$/,
        exp: /^exp(onential)?$/,
        log: /^ln$/,
        log10: /^l((og)?arithm)10$/,
        asin: /^a(rc)?sine?$/,
        sin: /^sin$/,
        acos: /^a(rc)?cos(ine)?$/,
        cos: /^cos(ine)?$/,
        atan: /^a(rc)?tan(gent)?$/,
        tan: /^tan(gent)?$/,
        asinh: /^a(rea)?sine?h(((yp)?erb)?olic)?$/,
        sinh: /^sine?h(((yp)?erb)?olic)?$/,
        acosh: /^a(rea)?cos(ine)?h(((yp)?erb)?olic)?$/,
        cosh: /^cos(ine)?h(((yp)?erb)?olic)?$/,
        atanh: /^a(rea)?tan(gent)?h(((yp)?erb)?olic)?$/,
        tanh: /^tan(gent)?h(((yp)?erb)?olic)?$/,
        factorial: /^fact(orial)?$/,
        /* Matrix functions */
        eye: /^ident(ity)?$/,
        inv: /^inv(erse)?$/,
        det: /^det(erminant)?$/,
        trace: /^tr(ace)?$/,
        ctranspose: /^trans(p((ose)?)?)?$/,
        elem: /^elem(ent)?$/,
        row: /^line?$/,
        nrows: /^n(um)?lin(es)?$/,
        col: /^col(umn)?$/,
        ncols: /^n(um)?col(umn)?s$/,
        adj: /^adj(oint)?$/,
        lu: /^lu(dec(omp(osition)?)?)?$/,
        plu: /^plu(dec(omp(osition)?)?)?$/,
        min: /^min(imum)??!(us)$/,
        max: /^max(imum)?$/,
        /* Special functions */
        plot2d: /^graph(ics?)?$/,
        histogram: /^hist(ogram)?$/,
    },
    es: {
        /* Number functions */
        abs: /^abs(olute)?$/,
        arg: /^arg(ument)?$|^angle$/,
        sign: /^sign(al)?$|^sgn$/,
        conj: /^conj(ugate)?$/,
        sqrt: /^sq(uare)?r(oo)?t$/,
        root: /^r(oo)?t$/,
        power: /^pow(er)?$/,
        exp: /^exp(onential)?$/,
        log: /^ln$/,
        log10: /^l((og)?arithm)10$/,
        asin: /^a(rc)?sine?$/,
        sin: /^sin$/,
        acos: /^a(rc)?cos(ine)?$/,
        cos: /^cos(ine)?$/,
        atan: /^a(rc)?tan(gent)?$/,
        tan: /^tan(gent)?$/,
        asinh: /^a(rea)?sine?h(((yp)?erb)?olic)?$/,
        sinh: /^sine?h(((yp)?erb)?olic)?$/,
        acosh: /^a(rea)?cos(ine)?h(((yp)?erb)?olic)?$/,
        cosh: /^cos(ine)?h(((yp)?erb)?olic)?$/,
        atanh: /^a(rea)?tan(gent)?h(((yp)?erb)?olic)?$/,
        tanh: /^tan(gent)?h(((yp)?erb)?olic)?$/,
        factorial: /^fact(orial)?$/,
        /* Matrix functions */
        eye: /^ident(ity)?$/,
        inv: /^inv(erse)?$/,
        det: /^det(erminant)?$/,
        trace: /^tr(ace)?$/,
        ctranspose: /^trans(p((ose)?)?)?$/,
        elem: /^elem(ent)?$/,
        row: /^line?$/,
        nrows: /^n(um)?lin(es)?$/,
        col: /^col(umn)?$/,
        ncols: /^n(um)?col(umn)?s$/,
        adj: /^adj(oint)?$/,
        lu: /^lu(dec(omp(osition)?)?)?$/,
        plu: /^plu(dec(omp(osition)?)?)?$/,
        min: /^min(imum)??!(us)$/,
        max: /^max(imum)?$/,
        /* Special functions */
        plot2d: /^graph(ics?)?$/,
        histogram: /^hist(ogram)?$/,
    },
    pt: {
        /* Number functions */
        abs: /^abs(olut(o|e))?$/,
        arg: /^arg(ument(o)?)?$|^angle$|^angulo$/,
        sign: /^sign(al)?$|^sinal$|^sgn$/,
        conj: /^conj(uga(do|te)?)?$/,
        sqrt: /^r(ai)?z(2|q(uadrada)?)$|^sqrt$/,
        root: /^r(ai)?z$|^r(oo)?t$/,
        power: /^pot(encia)?$|^elev(ado)?|^pow(er)?$/,
        exp: /^exp(onen((cial)|(tial)))?$/,
        log: /^ln$/,
        log10: /^l((og)?aritmo)10$/,
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
        eye: /^ident(i(dade|ty))?$|^eye$/,
        inv: /^inv(er(t(er)?|s[ea])?)?$/,
        det: /^det(erminant(e)?)?$/,
        trace: /^tr(aco|ace)$/,
        ctranspose: /^trans(p((ose)?|(osta)?))?$/,
        elem: /^elem(ento?)?$/,
        row: /^lin(ha|e)?|row$/,
        nrows: /^n(um)?lin(has|es)?$|^nrows$/,
        col: /^col(u(na|mn))?$/,
        ncols: /^n(um)?col(u(na|mn))?s$/,
        minor: /^m[ie]nor$/,
        cofactor: /^cofa(c)?t(or)?$/,
        adj: /^adj(unta|oint)?$/,
        pivot: /^pivot?$/,
        // lu: /^lu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osicao|osition)?)?)?lu$/,
        // plu: /^plu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osicao|osition)?)?)?plu$/,
        minus: /^menos$$/,
        min: /^min(imo)??!(us)|min(imum)??!(us)$/,
        max: /^max(imo)?|max(imum)?$/,
        mean: /^media|mean$/,
        /* Special functions */
        summation: /^somatorio$/,
        productory: /^produtorio$/,
        plus: /^mais$/,
        plot2d: /^gra(f(ico)?|ph?(ics?)?)?$/,
        histogram: /^hist(ogram(a)?)?$/,
    },
};

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
    aliasTable: languageAlias[global.lang],

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
            unparserML: (tree: any): string => {
                return (
                    '<mstyle displaystyle="true"><munderover><mo>&sum;</mo><mrow>' +
                    global.EvaluatorPointer.unparserML(tree.args[0]) +
                    '<mo>=</mo>' +
                    global.EvaluatorPointer.unparserML(tree.args[1]) +
                    '</mrow><mrow>' +
                    global.EvaluatorPointer.unparserML(tree.args[2]) +
                    '</mrow>' +
                    '</munderover>' +
                    global.EvaluatorPointer.unparserML(tree.args[3]) +
                    '</mstyle>'
                );
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
            unparserML: (tree: any): string => {
                return (
                    '<mstyle displaystyle="true"><munderover><mo>&prod;</mo><mrow>' +
                    global.EvaluatorPointer.unparserML(tree.args[0]) +
                    '<mo>=</mo>' +
                    global.EvaluatorPointer.unparserML(tree.args[1]) +
                    '</mrow><mrow>' +
                    global.EvaluatorPointer.unparserML(tree.args[2]) +
                    '</mrow>' +
                    '</munderover>' +
                    global.EvaluatorPointer.unparserML(tree.args[3]) +
                    '</mstyle>'
                );
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

        markdown: {
            ev: [true],
            func: (url: CharString): NodeExpr => {
                const promptSet = global.ShellPointer.currentPromptSet;
                if (global.ShellPointer.isFileProtocol) {
                    promptSet.box.className = 'bad';
                    promptSet.output.innerHTML = 'markdown function unavailable <b>offline</b>.';
                } else {
                    global
                        .compatibleFetch(url.string)
                        .then((response) => {
                            if (response.ok) {
                                return response.text();
                            } else {
                                throw new URIError('Load error.');
                            }
                        })
                        .then((responseFile: string) => {
                            promptSet.box.className = 'doc';
                            promptSet.output.innerHTML = MathMarkdown.md2html(responseFile);
                            MathMarkdown.typeset();
                        })
                        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
                        .catch((error) => {
                            promptSet.box.className = 'bad';
                            promptSet.output.innerHTML = `markdown: error loading ${url.string}`;
                        });
                }
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('markdown'), {
                    list: [url.string],
                });
            },
        },

        load: {
            ev: [true],
            func: (...url: CharString[]): NodeExpr => {
                const promptSet = global.ShellPointer.currentPromptSet;
                if (global.ShellPointer.isFileProtocol) {
                    promptSet.box.className = 'bad';
                    promptSet.output.innerHTML = 'load function unavailable <b>offline</b>.';
                } else {
                    url.forEach((file: CharString) => {
                        global
                            .compatibleFetch(file.string)
                            .then((response) => {
                                if (response.ok) {
                                    return response.text();
                                } else {
                                    throw new URIError('Load error.');
                                }
                            })
                            .then((responseFile: string) => {
                                const lines = responseFile.replace('\r\n', '\n').split('\n');
                                promptSet.output.innerHTML = '';
                                let error: boolean = false;
                                let errorMessage: string = '';
                                let lineno: number;
                                insertOutput.type = '';
                                for (lineno = 0; lineno < lines.length; lineno++) {
                                    try {
                                        if (lines[lineno].trim()) {
                                            const tree = global.EvaluatorPointer.Parse(lines[lineno]);
                                            if (tree) {
                                                global.EvaluatorPointer.Evaluate(tree);
                                            }
                                        }
                                    } catch (e) {
                                        error = true;
                                        errorMessage = `load: error loading ${file.string} at line ${lineno + 1}: ${e}`;
                                        break;
                                    }
                                }
                                if (error) {
                                    promptSet.box.className = 'bad';
                                    promptSet.output.innerHTML = errorMessage;
                                } else {
                                    promptSet.box.className = 'good';
                                    promptSet.output.innerHTML = `Loaded ${lineno + 1} lines from ${file.string}</ br>`;
                                }
                                global.ShellPointer.refreshNameList();
                            })
                            /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
                            .catch((error) => {
                                promptSet.box.className = 'bad';
                                promptSet.output.innerHTML = `load: error loading ${file.string}`;
                            });
                    });
                }
                return global.EvaluatorPointer.nodeArgExpr(global.EvaluatorPointer.nodeName('load'), {
                    list: [...url.map((url) => global.EvaluatorPointer.nodeString(url.str))],
                });
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
                        global
                            .compatibleFetch(`${global.MathJSLabCalc.helpBaseUrl}help/${global.lang}/${encodeURIComponent(encodeName(args[0]))}.md`)
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
                    global
                        .compatibleFetch(`${global.MathJSLabCalc.helpBaseUrl}help/${global.lang}/help.md`)
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
                            promptSet.output.innerHTML = MathMarkdown.md2html(
                                responseText +
                                    global.EvaluatorPointer.baseFunctionList
                                        .map((func) => `\`${func}\``)
                                        .sort()
                                        .join(', '),
                            );
                            MathMarkdown.typeset();
                        });
                } else {
                    promptSet.box.className = 'bad';
                    promptSet.output.innerHTML = `help: function called with too many inputs`;
                }
            },
        },
        clear: {
            func: (...args: string[]): void => {
                const promptSet = global.ShellPointer.currentPromptSet;
                insertOutput.type = '';
                global.EvaluatorPointer.Clear(...args);
                promptSet.box.className = 'good';
                promptSet.output.innerHTML = `clear ${args.length > 0 ? args.join(', ') : 'variables'}`;
            },
        },
    },
};

import buildConfiguration from './build-configuration.json';

/**
 * To change the language after load (to be used in a language selection menu, for example).
 * @param lang
 */
global.setLanguage = (lang?: string) => {
    if (lang) {
        global.lang = lang in languageAlias ? lang : (MathJSLabCalc.defaultLanguage as string);
    }
    global.ShellPointer.setLanguage();
    EvaluatorConfiguration.aliasTable = languageAlias[global.lang];
    const evaluator = Evaluator.initialize(EvaluatorConfiguration);
    evaluator.debug = buildConfiguration.debug;
    global.ShellPointer.batchExec(new Event('click'));
};

/**
 * Evaluator and MathMarkdown initialization.
 */
function bootstrap() {
    const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
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
    global.lang = navigator.language.split('-')[0];
    if (!(global.lang in languageAlias)) {
        global.lang = global.MathJSLabCalc.defaultLanguage as string;
    }
    EvaluatorConfiguration.aliasTable = languageAlias[global.lang];
    const evaluator = Evaluator.initialize(EvaluatorConfiguration);
    evaluator.debug = buildConfiguration.debug;
    global.MathJSLabCalcBuildMessage = buildConfiguration.buildMessage;
    MathMarkdown.initialize();
}
bootstrap();
