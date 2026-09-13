import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import { Marked } from 'marked';
import { HTMLElement, parse } from 'node-html-parser';

// Exercise the real Markdown service and Marked parser. Only the browser DOM
// and Mermaid's SVG layout are substituted; visual layout needs a browser.
HTMLElement.prototype.replaceChildren = function (...nodes) {
    this.set_content(nodes);
};
const element = (html = '') => parse(`<div>${html}</div>`, { blockTextElements: { script: true, noscript: true, style: true } }).firstChild;

function service() {
    const calls = [];
    const bindings = [];
    const math = [];
    const mermaid = {
        initialize() {},
        async render(id, source) {
            calls.push({ id, source });
            await Promise.resolve();
            if (source === 'invalid') throw new Error('Invalid diagram');
            return { svg: `<svg id="${id}"></svg>`, bindFunctions: (node) => bindings.push(node) };
        },
    };
    const document = element();
    document.createElement = (tag) => parse(`<${tag}></${tag}>`).firstChild;
    const exports = {};
    const imports = {
        './appEngine': {
            appEngine: {
                interpreter: {
                    ToMathML(source, display) {
                        math.push({ source, display });
                        return `<math display="${display}"></math>`;
                    },
                },
            },
        },
        mermaid,
        marked: { marked: new Marked() },
    };
    const source = fs.readFileSync(new URL('../src/Markdown.ts', import.meta.url), 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
    vm.runInNewContext(outputText, { exports, require: (name) => imports[name], document, Element: HTMLElement, Error });
    exports.Markdown.initialize();
    return { Markdown: exports.Markdown, calls, bindings, math, document };
}

test('code and Mermaid source survive HTML parsing without interpreting tags or entities', async () => {
    const { Markdown, calls, math } = service();
    const source = 'graph TD\n A["<b> &amp; </div> <br/> end"] --> B';
    const container = element(Markdown.parse('```mermaid title\n' + source + '\n```\n\n```html\n<b>&amp;</b>\n```\n\n`<i>&amp;</i>`\n\n`%a<2%`\n\n`%%b>3%%`'));
    assert.equal(container.querySelector('.mermaid').textContent, source);
    assert.equal(container.querySelector('code.language-html').textContent.trim(), '<b>&amp;</b>');
    assert.equal(container.querySelector('p code').textContent, '<i>&amp;</i>');
    assert.deepEqual(math, [
        { source: 'a<2', display: 'inline' },
        { source: 'b>3', display: 'block' },
    ]);
    await Markdown.typeset(container);
    assert.equal(calls[0].source, source);
    assert.ok(container.querySelector('.mermaid svg'));
});

test('independent documents, repeated and concurrent typesetting preserve diagrams and unique IDs', async () => {
    const { Markdown, calls, bindings } = service();
    const first = element(Markdown.parse('```mermaid\ngraph TD; A-->B\n```'));
    const second = element(Markdown.parse('```mermaid\nsequenceDiagram\n A->>B: Hello\n```'));
    await Promise.all([Markdown.typeset(first), Markdown.typeset(second), Markdown.typeset(first)]);
    const svg = first.innerHTML;
    await Markdown.typeset(first);
    assert.equal(first.innerHTML, svg);
    assert.equal(calls.length, 2);
    assert.equal(new Set(calls.map(({ id }) => id)).size, 2);
    assert.equal(bindings.length, 2);
});

test('default document traversal includes nested shadow roots and a diagram passed as the root', async () => {
    const { Markdown, calls, document } = service();
    document.innerHTML = '<section></section>';
    const host = document.querySelector('section');
    host.shadowRoot = element('<article></article>');
    host.shadowRoot.querySelector('article').shadowRoot = element(Markdown.parse('```mermaid\ngraph TD; A-->B\n```'));
    await Markdown.typeset();
    const diagram = element(Markdown.parse('```mermaid\ngraph TD; C-->D\n```')).firstChild;
    await Markdown.typeset(diagram);
    assert.equal(calls.length, 2);
    assert.ok(diagram.querySelector('svg'));
});

test('an invalid diagram keeps its source and error while later diagrams still render', async () => {
    const { Markdown, calls } = service();
    const container = element(Markdown.parse('```mermaid\ninvalid\n```\n\n```mermaid\ngraph TD; A-->B\n```'));
    await Markdown.typeset(container);
    assert.match(container.querySelector('[role="alert"]').textContent, /Invalid diagram/);
    assert.match(container.querySelector('.mermaid').textContent, /invalid/);
    assert.equal(container.querySelectorAll('svg').length, 1);
    assert.equal(calls.length, 2);
});
