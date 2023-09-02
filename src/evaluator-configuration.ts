/* Number and matrix operations and functions */
import { Decimal, ComplexDecimal, MultiArray, Evaluator, TEvaluatorConfig, NodeName, NodeExpr } from 'mathjslab';

import { insertOutput, plotData, plotWidth } from './plot-engine';

export const EvaluatorConfiguration: TEvaluatorConfig = {
    aliasTable: {
        /* Number functions */
        abs: /^abs(olut(o|e))?|mod(ul(o|e))?$/i,
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
        lu: /^lu(dec(omp(osi[cç][aã]o|osition)?)?)?|(dec(omp(osi[cç][aã]o|osition)?)?)?lu$/i,
        min: /^m[ií]]n(imo)?|min(imum)?$/i,
        max: /^m[aá]x(imo)?|max(imum)?$/i,
        mean: /^m[eé]dia|mean$/i,
        /* Special functions */
        sum: /^soma(t[oó]rio)?|sum(mation)?$/i,
        prod: /^prod(t[oó]rio|(ctory)?)$/i,
        plot: /^gr[aá](f(ico)?|ph?(ics?)?)?|plot$/i,
        hist: /^hist(ogram(a)?)?$/i,
        /* Constants */
        pi: /^cte\.pi$/i,
        e: /^cte\.e$/i,
    },

    externalFuctionTable: {
        sum: {
            // summation
            ev: [false, true, true, false],
            func: function (variable: NodeName, start: ComplexDecimal, end: ComplexDecimal, expr: NodeExpr, that: Evaluator): ComplexDecimal {
                if (!start.im.eq(0)) throw new Error('complex number sum index');
                if (!end.im.eq(0)) throw new Error('complex number sum index');
                let result: ComplexDecimal = ComplexDecimal.zero();
                const sum_function_name = `sum`;
                that.localTable[sum_function_name] = {};
                for (let i = start.re.toNumber(); i <= end.re.toNumber(); i++) {
                    that.localTable[sum_function_name][variable.id] = new ComplexDecimal(i, 0);
                    result = ComplexDecimal.add(result, that.Evaluator(expr, true, sum_function_name));
                }
                delete that.localTable[sum_function_name];
                return result;
            },
        },

        prod: {
            // productory
            ev: [false, true, true, false],
            func: function (variable: NodeName, start: ComplexDecimal, end: ComplexDecimal, expr: NodeExpr, that: Evaluator): ComplexDecimal {
                if (!start.im.eq(0)) throw new Error('complex number prod index');
                if (!end.im.eq(0)) throw new Error('complex number prod index');
                let result: ComplexDecimal = ComplexDecimal.one();
                const prod_function_name = `prod`;
                that.localTable[prod_function_name] = {};
                for (let i = start.re.toNumber(); i <= end.re.toNumber(); i++) {
                    that.localTable[prod_function_name][variable.id] = new ComplexDecimal(i, 0);
                    result = ComplexDecimal.mul(result, that.Evaluator(expr, true, prod_function_name));
                }
                delete that.localTable[prod_function_name];
                return result;
            },
        },

        plot: {
            // plot 2D
            ev: [false, false, true, true],
            func: function (expr: NodeExpr, variable: NodeName, minx: ComplexDecimal, maxx: ComplexDecimal, that: Evaluator): NodeExpr {
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
                const plot_function_name = `plot`;
                that.localTable[plot_function_name] = {};
                const save_precision = Decimal.precision;
                Decimal.set({ precision: 20 });
                plotData.MaxY = 0;
                plotData.MinY = 0;
                for (let i = 0; i < plotWidth; i++) {
                    that.localTable[plot_function_name][variable.id] = new ComplexDecimal(plotData.MinX + deltaX * i, 0);
                    const data_y = that.Evaluator(expr, true, 'plot');
                    if (isFinite(data_y.re.toNumber()) && isFinite(data_y.im.toNumber()) && data_y.im.eq(0)) {
                        plotData.data[i] = data_y.re.toNumber();
                    } else {
                        throw new Error('non real number in plot y axis');
                    }
                    plotData.MaxY = Math.max(plotData.MaxY, plotData.data[i]);
                    plotData.MinY = Math.min(plotData.MinY, plotData.data[i]);
                }
                delete that.localTable[plot_function_name];
                Decimal.set({ precision: save_precision });
                return that.nodeArgExpr(that.nodeName('plot'), { list: [expr, variable, minx, maxx] });
            },
        },

        hist: {
            // histogram
            ev: [true],
            func: function (M: MultiArray, that: Evaluator): NodeExpr {
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
                return that.nodeArgExpr(that.nodeName('hist'), { list: [temp] });
            },
        },
    },
};
