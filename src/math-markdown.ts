declare const marked: { parse: (text: string) => string };
declare const MathJax: { typeset: () => void };

let usingMathJax = false;
let usingMarked = false;

export abstract class MathMarkdown {

    public static initialize() {
        MathMarkdown.loadMathJaxIfNeed();
        MathMarkdown.loadMarkedIfNeed();
    }

    private static appendScriptToHead(src: string, onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null, onerror?: OnErrorEventHandler): HTMLScriptElement {
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
        script.defer = true;
        document.head.appendChild(script);
        return script;
    }

    public static loadMathJaxIfNeed(force = false): void {
        if (!usingMathJax && (force || !window.MathMLElement)) {
            const script: HTMLScriptElement = document.createElement('script');
            MathMarkdown.appendScriptToHead(
                'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML',
                // 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/latest.js?tex-svg.js',
                () => {
                    usingMathJax = true;
                },
                (error) => {
                    throw new URIError(`MathJax didn't load correctly: ${error}`);
                }
            );
        }
    }

    public static loadMarkedIfNeed(): void {
        if (!usingMarked) {
            const script: HTMLScriptElement = document.createElement('script');
            MathMarkdown.appendScriptToHead(
                'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
                () => {
                    usingMarked = true;
                },
                (error) => {
                    throw new URIError(`Marked didn't load correctly: ${error}`);
                }
            );
        }
    }

    public static md2html(text: string): string {
        return marked.parse(text);
    }

    public static typeset(): void {
        if (usingMathJax) {
            MathJax.typeset();
        }
    }

}
