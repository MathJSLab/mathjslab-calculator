declare const marked: { parse: (text: string) => string };
declare const MathJax: { typeset: () => void };
declare const Chart: any;

let usingMathJax = false;
let usingMarked = false;
let usingChartJs = false;

export abstract class MathMarkdown {
    public static initialize() {
        MathMarkdown.loadMathJaxIfNeed();
        MathMarkdown.loadMarkedIfNeed();
        MathMarkdown.loadChartJsIfNeed();
    }

    private static appendScriptToHead(
        src: string,
        onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
        onerror?: OnErrorEventHandler,
    ): HTMLScriptElement {
        const script: HTMLScriptElement = document.createElement('script');
        script.type = 'text/javascript';
        if (onload) {
            script.onload = onload;
        }
        if (onerror) {
            script.onerror = onerror;
        }
        script.src = src;
        script.async = true;
        script.defer = false;
        document.head.appendChild(script);
        return script;
    }

    public static loadMathJaxIfNeed(force = false): void {
        if (!usingMathJax && (force || !window.MathMLElement)) {
            MathMarkdown.appendScriptToHead(
                'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML',
                // 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/latest.js?tex-svg.js',
                () => {
                    usingMathJax = true;
                },
                (error) => {
                    throw new URIError(`MathJax didn't load correctly: ${error}`);
                },
            );
        }
    }

    public static loadMarkedIfNeed(): void {
        if (!usingMarked) {
            MathMarkdown.appendScriptToHead(
                'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
                () => {
                    usingMarked = true;
                },
                (error) => {
                    throw new URIError(`Marked didn't load correctly: ${error}`);
                },
            );
        }
    }

    /**
     * Load Chart.js
     * homepage: https://www.chartjs.org/docs/latest/
     */
    public static loadChartJsIfNeed(): void {
        if (!usingChartJs) {
            MathMarkdown.appendScriptToHead(
                'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
                () => {
                    if (!!Chart) {
                        usingChartJs = true;
                    }
                },
                (error) => {
                    throw new URIError(`Chart.js didn't load correctly: ${error}`);
                },
            );
        }
    }

    public static replaceMath(text: string): string {
        let data = text;
        let replaced: boolean;
        const replace = (regexp: RegExp, display: 'inline' | 'block', quotelength: number) => {
            replaced = true;
            while (replaced) {
                const matched = regexp.exec(data);
                if (matched) {
                    const reference = matched[2];
                    data =
                        data.slice(0, matched.index) +
                        global.EvaluatorPointer.toMathML(reference, display) +
                        data.slice(matched.index + matched[2].length + quotelength);
                    replaced = true;
                } else {
                    replaced = false;
                }
            }
        };
        replace(/(\%\%\%)([^\%]+)(\%\%\%)/gm, 'block', 6);
        replace(/(\%\%)([^\%]+)(\%\%)/gm, 'inline', 4);
        return data;
    }

    public static md2html(text: string): string {
        return marked.parse(MathMarkdown.replaceMath(text));
    }

    public static typeset(): void {
        if (usingMathJax) {
            MathJax.typeset();
        }
    }
}
