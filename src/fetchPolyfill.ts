function fetchPolyfill(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return new Promise((resolve: (value: Response | PromiseLike<Response>) => void) => {
        const xhttp = new XMLHttpRequest();
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        xhttp.onload = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
            resolve({
                ok: true,
                json: (): Promise<any> => Promise.resolve(JSON.parse(this.responseText)),
                text: (): Promise<string> => Promise.resolve(this.responseText),
            } as Response);
        };
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        xhttp.onerror = function (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) {
            resolve({
                ok: false,
            } as Response);
        };
        xhttp.open(init ? init.method || 'GET' : 'GET', input.toString(), true);
        xhttp.send();
    });
}

if (typeof window.fetch !== 'function') {
    window.fetch = fetchPolyfill;
}
