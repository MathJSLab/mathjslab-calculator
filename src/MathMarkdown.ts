import ScriptLinkLoad, { LoadScriptOptions, LoadLinkOptions } from './ScriptLinkLoad';

declare const marked: {
    parse: (text: string) => string;
    use: (options: any) => void;
};

declare const MathJax: { typeset: () => void };

export interface Resource {
    name: string;
    extendedName: string;
    linkOptions?: LoadLinkOptions;
    scriptOptions?: LoadScriptOptions;
    loaded: boolean;
    onLoadLink?: () => void;
    onLoadScript?: () => void;
}

export const ResourceTable: Record<string, Resource> = {
    mathjax: {
        name: 'mathjax',
        extendedName: 'MathJax',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/mathjax@latest/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML',
        },
        loaded: false,
    },
    marked: {
        name: 'marked',
        extendedName: 'Marked',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/marked@latest/marked.min.js',
        },
        loaded: false,
        onLoadScript: () => {
            const renderer = {
                code(code: string, language: string) {
                    if (language === 'mermaid') {
                        renderMermaid = true;
                        return '<div class="mermaid" align="center">' + code + '</div>';
                    } else {
                        return (
                            '<pre><code>' +
                            code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') +
                            '</code></pre>'
                        );
                    }
                },
            };
            marked.use({ renderer });
        },
    },
    chartjs: {
        /* homepage: https://www.chartjs.org/docs/latest/ */
        name: 'chartjs',
        extendedName: 'Chart.js',
        scriptOptions: {
            src: 'https://cdn.jsdelivr.net/npm/chart.js@latest/dist/chart.umd.min.js',
        },
        loaded: false,
    },
};

export let renderMermaid: boolean = false;

export abstract class MathMarkdown {
    public static loadIfNeed(name: string, aditionalTest = true): void {
        if (!ResourceTable[name].loaded && aditionalTest) {
            if (!!ResourceTable[name].linkOptions) {
                ScriptLinkLoad.appendLinkToHeadSync(
                    ResourceTable[name].linkOptions as LoadLinkOptions,
                    () => {
                        ResourceTable[name].loaded = true;
                        if (typeof ResourceTable[name].onLoadLink !== 'undefined') {
                            ResourceTable[name].onLoadLink!();
                        }
                    },
                    (error) => {
                        throw new URIError(`${ResourceTable[name].extendedName} didn't load correctly: ${error}`);
                    },
                );
            }
            if (!!ResourceTable[name].scriptOptions) {
                ScriptLinkLoad.appendScriptToHeadSync(
                    ResourceTable[name].scriptOptions as LoadScriptOptions,
                    () => {
                        ResourceTable[name].loaded = true;
                        if (typeof ResourceTable[name].onLoadScript !== 'undefined') {
                            ResourceTable[name].onLoadScript!();
                        }
                    },
                    (error) => {
                        throw new URIError(`${ResourceTable[name].extendedName} didn't load correctly: ${error}`);
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

    public static mathTypeset(): void {
        if (ResourceTable['mathjax'].loaded) {
            MathJax.typeset();
        }
    }

    public static renderMermaid(): void {
        if (renderMermaid) {
            /* eslint-disable-next-line  @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            import('https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.esm.min.mjs').then(async (module) => {
                const mermaid = await module.default;
                document.querySelectorAll('.mermaid').forEach((m) => {
                    mermaid.default.init(undefined, m);
                });
                renderMermaid = false;
            });
        }
    }

    public static typeset(): void {
        MathMarkdown.mathTypeset();
        MathMarkdown.renderMermaid();
    }
}
