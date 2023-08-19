/**
 * Polyfill for MathML support using MathJax
 */

declare const MathJax: any;

export const MathJaxLoader = {
    /**
     * Flag signaling if MathJax has been loaded.
     */
    usingMathJax: false,

    /**
     * Test MathML native suport and load MathJax if need
     */
    loadMathJaxIfNeed: function (): void {
        if (!window.MathMLElement) {
            MathJaxLoader.usingMathJax = true;
            const script: HTMLScriptElement = document.createElement('script');
            document.head.appendChild(script);
            script.onerror = function (oError: any): void {
                throw new URIError('MathJax at ' + oError.target.src + " didn't load correctly.");
            };
            script.onload = function () {
                MathJaxLoader.usingMathJax = true;
            };
            // script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML"; // version 2.7.7
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML';
        }
    },

    /**
     * Render MathML after load
     */
    renderMathML: function (): void {
        if (MathJaxLoader.usingMathJax) {
            // MathJax.Hub.Typeset(); // for version 2.7.7
            MathJax.typeset();
        }
    },
};
