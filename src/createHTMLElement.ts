export default function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    parent?: HTMLElement | null,
    i?: string | null,
    c?: string | null,
): HTMLElementTagNameMap[K] {
    if (arguments.length == 1) {
        return document.createElement(tag);
    } else {
        const result = document.createElement(tag);
        if (parent) {
            parent.append(result);
        }
        if (arguments.length > 2 && i) result.setAttribute('id', i);
        if (arguments.length > 3 && c) result.setAttribute('class', c);
        return result;
    }
}
