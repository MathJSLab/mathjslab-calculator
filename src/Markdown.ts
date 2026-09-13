import { appEngine } from './appEngine';
import mermaid from 'mermaid';
import { marked, MarkedOptions } from 'marked';

const escapeHTML = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

abstract class Markdown {
    private static initialized = false;
    private static diagramId = 0;
    private static readonly diagrams = new WeakMap<Element, Promise<void>>();

    public static initialize(): void {
        if (Markdown.initialized) return;
        const renderer = {
            code: (token: { lang?: string; text: string }): string | false => {
                switch (token.lang?.trim().split(/\s+/)[0]) {
                    case 'mermaid':
                        return `<div class="mermaid" align="center">${escapeHTML(token.text)}</div>`;
                    default:
                        return false;
                }
            },
            codespan: (token: { text: string }): string | false => {
                const text = token.text.trim();
                const singleMatch = text.match(/^%([\s\S]*?)%$/);
                const doubleMatch = text.match(/^%%([\s\S]*?)%%$/);
                if (doubleMatch) {
                    return appEngine.interpreter.ToMathML(doubleMatch[1]!, 'block');
                } else if (singleMatch) {
                    return appEngine.interpreter.ToMathML(singleMatch[1]!, 'inline');
                } else {
                    return false;
                }
            },
        };
        marked.use({
            renderer,
            breaks: false,
        });
        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            suppressErrorRendering: true,
        });
        Markdown.initialized = true;
    }

    /**
     *
     * @param src
     * @param options
     * @returns
     */
    public static parse: (src: string, options?: MarkedOptions<string, string> | null | undefined) => string = (src: string, options?: MarkedOptions | null): string =>
        marked.parse(src, options) as string;

    /**
     * Render pending diagrams in a container and its open shadow roots.
     * Each diagram is processed once, including across concurrent calls.
     * Invalid diagrams retain their source and show an error locally.
     */
    public static async typeset(element: ParentNode = document): Promise<void> {
        const found = new Set<Element>();
        const walker = (node: ParentNode): void => {
            if (node instanceof Element) {
                if (node.matches('.mermaid')) found.add(node);
                if (node.shadowRoot) walker(node.shadowRoot);
            }
            node.querySelectorAll('.mermaid').forEach((el) => found.add(el));
            node.querySelectorAll('*').forEach((el) => {
                if (el.shadowRoot) walker(el.shadowRoot);
            });
        };
        walker(element);
        await Promise.all(
            Array.from(found, (diagram) => {
                let pending = Markdown.diagrams.get(diagram);
                if (!pending) {
                    pending = Markdown.renderDiagram(diagram);
                    Markdown.diagrams.set(diagram, pending);
                }
                return pending;
            }),
        );
    }

    private static async renderDiagram(diagram: Element): Promise<void> {
        const source = diagram.textContent ?? '';
        try {
            // Mermaid measures in the document body, then the SVG is moved into
            // the destination (which may be inside a shadow root).
            const { svg, bindFunctions } = await mermaid.render(`mathjslab-mermaid-${++Markdown.diagramId}`, source);
            diagram.innerHTML = svg;
            bindFunctions?.(diagram);
        } catch (error) {
            const message = document.createElement('pre');
            message.className = 'mermaid-error';
            message.setAttribute('role', 'alert');
            message.textContent = `Mermaid: ${error instanceof Error ? error.message : String(error)}`;
            const code = document.createElement('pre');
            code.textContent = source;
            diagram.replaceChildren(message, code);
        }
    }
}
export { Markdown };
export default { Markdown };
