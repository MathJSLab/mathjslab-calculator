/**
 * Script load options.
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLScriptElement)
 */
export interface LoadScriptOptions {
    src?: string;
    text?: string;
    async?: boolean;
    crossOrigin?: string | null;
    defer?: boolean;
    integrity?: string;
    noModule?: boolean;
    referrerPolicy?: string;
    type?: string;
}

/**
 * Link load options.
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLLinkElement)
 */
export interface LoadLinkOptions {
    href?: string;
    as?: string;
    crossOrigin?: string | null;
    disabled?: boolean;
    hreflang?: string;
    imageSizes?: string;
    imageSrcset?: string;
    integrity?: string;
    media?: string;
    referrerPolicy?: string;
    rel?: string;
    type?: string;
}

/**
 * Basic DOM Helper abstract class
 *
 * This class provides static methods to manipulate DOM objects programatticaly.
 */
export default abstract class ScriptLinkLoad {
    /* Selected load script and stylesheet methods */

    private static loadURIError(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): void {
        if (typeof event !== 'string') {
            throw new URIError(`The file ${event.target} didn't load correctly${error ? ` ${error.message}.` : '.'}`);
        } else {
            throw new URIError(event);
        }
    }

    /**
     * Set options to script element.
     * @param script
     * @param options
     */
    private static setScriptOptions(script: HTMLScriptElement, options: LoadScriptOptions): void {
        if (options.type !== undefined) {
            script.type = options.type;
        } else {
            script.type = 'text/javascript';
        }
        if (options.src) {
            script.src = options.src;
        }
        if (options.text) {
            script.text = options.text;
        }
        if (options.async !== undefined) {
            if (options.async) {
                script.async = true;
                /**
                 * The defer attribute may be specified with the async
                 * attribute, so legacy browsers that only support defer (and
                 * not async) fall back to the defer behavior instead of the
                 * default blocking behavior.
                 */
                script.defer = true;
            } else {
                script.async = false;
            }
        }
        if (options.defer !== undefined) {
            script.defer = options.defer;
        }
        if (options.crossOrigin !== undefined) {
            script.crossOrigin = options.crossOrigin;
        }
        if (options.integrity !== undefined) {
            script.integrity = options.integrity;
        }
        if (options.noModule !== undefined) {
            script.noModule = options.noModule;
        }
        if (options.referrerPolicy !== undefined) {
            script.referrerPolicy = options.referrerPolicy;
        }
    }

    /**
     * Set options to link element.
     * @param link
     * @param options
     */
    private static setLinkOptions(link: HTMLLinkElement, options: LoadLinkOptions): void {
        if (options.type !== undefined) {
            link.type = options.type;
        } else {
            link.type = 'text/css';
        }
        if (options.href) {
            link.href = options.href;
        }
        if (options.as !== undefined) {
            link.as = options.as;
        }
        if (options.crossOrigin !== undefined) {
            link.crossOrigin = options.crossOrigin;
        }
        if (options.disabled !== undefined) {
            link.disabled = options.disabled;
        }
        if (options.hreflang !== undefined) {
            link.hreflang = options.hreflang;
        }
        if (options.imageSizes !== undefined) {
            link.imageSizes = options.imageSizes;
        }
        if (options.imageSrcset !== undefined) {
            link.imageSrcset = options.imageSrcset;
        }
        if (options.integrity !== undefined) {
            link.integrity = options.integrity;
        }
        if (options.media !== undefined) {
            link.media = options.media;
        } else {
            link.media = 'all';
        }
        if (options.referrerPolicy !== undefined) {
            link.referrerPolicy = options.referrerPolicy;
        }
        if (options.rel !== undefined) {
            link.rel = options.rel;
        } else {
            link.rel = 'stylesheet';
        }
    }

    /**
     * Append script to head (optionally).
     * The defer and async attributes must not be specified if the src attribute is absent, the this method can't be called before set src.
     * ### References
     * * https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement
     * * https://www.educative.io/answers/how-to-dynamically-load-a-js-file-in-javascript
     * * https://web.dev/efficiently-load-third-party-javascript/
     *
     * @param src Script source
     * @param onload OnLoad handler
     * @param onerror OnError handler
     * @param options Load options
     * @param append If true then append (default true)
     * @returns
     */
    public static appendScriptToHeadSync(
        options: LoadScriptOptions | string,
        onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
        onerror?: OnErrorEventHandler,
        append = true,
    ): HTMLScriptElement {
        const script: HTMLScriptElement = document.createElement('script');
        if (onload) {
            script.onload = onload;
        }
        script.onerror = onerror ? onerror : ScriptLinkLoad.loadURIError;
        if (typeof options !== 'string') {
            ScriptLinkLoad.setScriptOptions(script, options);
        } else {
            ScriptLinkLoad.setScriptOptions(script, { src: options });
        }
        if (append) {
            document.head.appendChild(script);
        }
        return script;
    }

    public static appendScriptToHead(options: LoadScriptOptions | string, append = true): Promise<HTMLScriptElement> {
        return new Promise((resolve, reject) => {
            try {
                const script: HTMLScriptElement = document.createElement('script');
                if (typeof options !== 'string') {
                    ScriptLinkLoad.setScriptOptions(script, options);
                } else {
                    ScriptLinkLoad.setScriptOptions(script, { src: options });
                }
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                script.addEventListener('load', (ev) => {
                    resolve(script);
                });
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                script.addEventListener('error', (ev) => {
                    reject(new Error(`appendScriptToHead: cannot load ${script.src}`));
                });
                if (append) {
                    document.head.appendChild(script);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public static appendLinkToHeadSync(
        options: LoadLinkOptions | string,
        onload?: ((this: GlobalEventHandlers, ev: Event) => any) | null,
        onerror?: OnErrorEventHandler,
        append = true,
    ): HTMLLinkElement {
        const link: HTMLLinkElement = document.createElement('link');
        if (onload) {
            link.onload = onload;
        }
        link.onerror = onerror ? onerror : ScriptLinkLoad.loadURIError;
        if (typeof options !== 'string') {
            ScriptLinkLoad.setLinkOptions(link, options);
        } else {
            ScriptLinkLoad.setLinkOptions(link, { href: options });
        }
        if (append) {
            document.head.appendChild(link);
        }
        return link;
    }
}
