import DynamicModule from './DynamicModule';

declare global {
    var marked: {
        parse: (text: string) => string;
        use: (options: any) => void;
    };
    var MathJax: { typeset: () => void } | undefined;
}

let renderMermaid: boolean = false;

export abstract class MathMarkdown {
    public static initialize() {
        if (!window.MathMLElement) {
            DynamicModule.load('mathjax');
        }
        DynamicModule.load('marked').then((module) => {
            global.marked = module;
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
            global.marked.use({ renderer });
        });
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
        if (global.MathJax) {
            global.MathJax.typeset();
        }
    }

    public static renderMermaid(): void {
        if (renderMermaid) {
            DynamicModule.use('mermaid', (mermaid) => {
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
