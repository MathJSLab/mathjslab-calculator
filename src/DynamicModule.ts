import importUMD from './importUMD';

type ModulesConfiguration = {
    [key: string]: {
        module: any;
        import: any;
        timeout: number;
    };
};

const modulesConfiguration: ModulesConfiguration = {
    marked: {
        module: null,
        import: () => importUMD('https://cdn.jsdelivr.net/npm/marked@latest/marked.min.js'),
        timeout: 0,
    },
    mathjax: {
        module: null,
        import: () => {
            return new Promise((resolve, reject) => {
                try {
                    const script: HTMLScriptElement = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = false;
                    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                    script.addEventListener('load', (ev) => {
                        resolve(global.MathJax);
                    });
                    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                    script.addEventListener('error', (ev) => {
                        reject(new URIError(`cannot load ${script.src}`));
                    });
                    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@latest/es5/tex-mml-chtml.js?config=TeX-MML-AM_CHTML';
                    document.head.appendChild(script);
                } catch (error) {
                    reject(error);
                }
            });
        },
        timeout: 0,
    },
    plotly: {
        module: null,
        import: () => importUMD('https://unpkg.com/plotly.js-dist-min@latest/plotly.min.js'),
        timeout: 10000,
    },
    mermaid: {
        module: null,

        /* @ts-ignore */
        import: () => import('https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.esm.min.mjs').then((module) => module.default),
        timeout: 10000,
    },
};

export default abstract class DynamicModule {
    private static setModuleTimeout(name: string): void {
        if (modulesConfiguration[name].timeout > 0) {
            setTimeout(() => {
                modulesConfiguration[name].module = null;
            }, modulesConfiguration[name].timeout);
        }
    }

    public static use(name: string, handler: (module: any) => void): void {
        if (modulesConfiguration[name].module) {
            handler(modulesConfiguration[name].module);
        } else {
            modulesConfiguration[name].import().then((module: any) => {
                modulesConfiguration[name].module = module;
                handler(module);
                DynamicModule.setModuleTimeout(name);
            });
        }
    }

    public static async load(name: string): Promise<any> {
        if (modulesConfiguration[name].module) {
            return new Promise((resolve) => {
                resolve(modulesConfiguration[name].module);
            });
        } else {
            return modulesConfiguration[name].import().then((module: any) => {
                modulesConfiguration[name].module = module;
                DynamicModule.setModuleTimeout(name);
                return new Promise((resolve) => {
                    resolve(module);
                });
            });
        }
    }

    public static unload(name: string): void {
        modulesConfiguration[name].module = null;
    }
}
