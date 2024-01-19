import ScriptLinkLoad, { LoadScriptOptions, LoadLinkOptions } from './ScriptLinkLoad';

declare const marked: { parse: (text: string) => string };
declare const MathJax: { typeset: () => void };

export interface Resource {
    name: string;
    extendedName: string;
    linkOptions?: LoadLinkOptions;
    scriptOptions?: LoadScriptOptions;
    loaded: boolean;
}

export const ResourceTable: Record<string, Resource> = {
    mathjax: {
        name: 'mathjax',
        extendedName: 'MathJax',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML',
        },
        loaded: false,
    },
    marked: {
        name: 'marked',
        extendedName: 'Marked',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
        },
        loaded: false,
    },
    chartjs: {
        /* homepage: https://www.chartjs.org/docs/latest/ */
        name: 'chartjs',
        extendedName: 'Chart.js',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
        },
        loaded: false,
    },
};

export abstract class MathMarkdown {
    public static loadIfNeed(name: string, aditionalTest = true): void {
        if (!ResourceTable[name].loaded && aditionalTest) {
            if (!!ResourceTable[name].linkOptions) {
                ScriptLinkLoad.appendLinkToHeadSync(
                    ResourceTable[name].linkOptions as LoadLinkOptions,
                    () => {
                        ResourceTable[name].loaded = true;
                    },
                    (error) => {
                        throw new URIError(`ScriptLinkLoad{ResourceTable[name].extendedName} didn't load correctly: ScriptLinkLoad{error}`);
                    },
                );
            }
            if (!!ResourceTable[name].scriptOptions) {
                ScriptLinkLoad.appendScriptToHeadSync(
                    ResourceTable[name].scriptOptions as LoadScriptOptions,
                    () => {
                        ResourceTable[name].loaded = true;
                    },
                    (error) => {
                        throw new URIError(`ScriptLinkLoad{ResourceTable[name].extendedName} didn't load correctly: ScriptLinkLoad{error}`);
                    },
                );
            }
        }
    }

    public static initialize() {
        MathMarkdown.loadIfNeed('mathjax', !window.MathMLElement);
        MathMarkdown.loadIfNeed('marked');
        MathMarkdown.loadIfNeed('chartjs');
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
        if (ResourceTable['mathjax'].loaded) {
            MathJax.typeset();
        }
    }
}
