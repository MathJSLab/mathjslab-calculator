import $ from 'basic-dom-helper';
import firstExample from './first-example.json';
import { CharString, MultiArray } from 'mathjslab';

/**
 * Evaluator handlers
 */
export type EvalInputHandler = (input: HTMLTextAreaElement) => [string[], string[]];
export type EvalPromptHandler = (frame: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement) => void;

/**
 * Shell instantiation options.
 */
export interface ShellOptions {
    containerId: string;
    evalInput?: EvalInputHandler;
    evalPrompt?: EvalPromptHandler;
    input: string;
}

export interface PromptEntry {
    container: HTMLDivElement;
    box: HTMLDivElement;
    input: HTMLTextAreaElement;
    output: HTMLDivElement;
}

export interface ExampleEntry {
    file: string;
    caption: string;
    description: string;
}

/**
 * External reference for instantiated class to be used when context 'this' is
 * compromised (like in event listeners).
 */
declare global {
    /* eslint-disable-next-line  no-var */
    var ShellPointer: Shell;
}

/**
 * Shell prompt class.
 */
export class Shell {
    baseUrl: string;
    isFileProtocol: boolean;
    isTouchCapable: boolean;
    options: ShellOptions;
    examples: Record<string, ExampleEntry>;
    examplesAvailable: boolean;
    examplesHeading: HTMLHeadingElement;
    container: HTMLDivElement;
    shell: HTMLDivElement;
    variables: HTMLDivElement;
    variablesHeading: HTMLHeadingElement;
    nameTable: HTMLDivElement;
    nameList: HTMLUListElement;
    evalInput: EvalInputHandler;
    evalPrompt: EvalPromptHandler;
    examplesContainer: HTMLDivElement;
    batchContainer: HTMLDivElement;
    batchBox: HTMLDivElement;
    batchWrapper: HTMLDivElement;
    batchInput: HTMLTextAreaElement;
    batchButton: HTMLButtonElement;
    promptContainer: HTMLDivElement;
    inputLines: string[];
    input: string;
    statements: string[];
    promptUid: string[];
    promptSet: Record<string, PromptEntry>;
    promptIndex: number;

    private constructor() {
        global.ShellPointer = this;
        this.baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        this.isFileProtocol = this.baseUrl.startsWith('file:');
        this.isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
    }

    public static async initialize(options: ShellOptions): Promise<Shell> {
        const shell = new Shell();
        shell.options = options;
        shell.container = $.i(options.containerId) as HTMLDivElement;
        while (shell.container.firstChild) {
            shell.container.removeChild(shell.container.firstChild);
        }
        shell.container.className = 'container';
        if (options.evalInput) {
            shell.evalInput = options.evalInput;
        } else {
            shell.evalInput = function (input: HTMLTextAreaElement): [string[], string[]] {
                console.log(`evalInput(${input.value})`);
                return [[], input.value.split(/\r?\n/)];
            };
        }
        if (options.evalPrompt) {
            shell.evalPrompt = options.evalPrompt;
        } else {
            shell.evalPrompt = function (div: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement) {
                console.log(`evalPrompt(${input.value})`);
                output.innerHTML = `evalPrompt(${input.value})`;
            };
        }
        shell.shell = $.create('div', shell.container, 'shell_' + options.containerId, 'shell');
        if (!shell.isFileProtocol) {
            shell.examplesContainer = $.create('div', shell.shell, 'examples_' + options.containerId, 'examples');
            await global
                .compatibleFetch(`${global.MathJSLabCalc.exampleBaseUrl}example/example.json`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Examples unavailable.');
                    }
                    return response.json();
                })
                .then((data) => {
                    shell.examples = data;
                    shell.examplesAvailable = true;
                })
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                .catch((error) => {
                    shell.examplesAvailable = false;
                });
        }
        shell.variables = $.create('div', shell.container, 'variables_' + options.containerId, 'variables');
        shell.variablesHeading = $.create('h2', shell.variables);
        shell.variablesHeading.setAttribute('align', 'center');
        const setVariablesPanel = () => {
            let Y = window.scrollY - shell.container.offsetTop + window.innerHeight * 0.025;
            const maxY = shell.container.offsetHeight - shell.variables.offsetHeight;
            if (Y < 0) {
                Y = 0;
            } else if (Y > maxY) {
                Y = maxY;
            }
            shell.variables.style.top = Y + 'px';
            shell.variables.style.left = shell.shell.offsetWidth + 'px';
            shell.variables.style.height = window.innerHeight * 0.9 + 'px';
        };
        window.addEventListener('scroll', setVariablesPanel);
        window.addEventListener('resize', setVariablesPanel);
        shell.nameTable = $.create('div', shell.variables, 'nameTable_' + options.containerId);
        shell.nameList = $.create('ul', shell.nameTable, null, 'namelist');
        shell.batchContainer = $.create('div', shell.shell, 'batch_' + options.containerId);
        shell.batchBox = $.create('div', shell.batchContainer, 'batchbox_' + options.containerId, 'good');
        shell.batchWrapper = $.create('div', shell.batchBox, 'batchwrapper_' + options.containerId);
        shell.batchInput = $.create('textarea', shell.batchWrapper, 'batchtext_' + options.containerId, 'inputarea');
        $.addEventListener(shell.batchInput, 'change', shell.batchResize);
        $.addEventListener(shell.batchInput, 'cut', shell.batchDelayedResize);
        $.addEventListener(shell.batchInput, 'paste', shell.batchDelayedResize);
        $.addEventListener(shell.batchInput, 'drop', shell.batchDelayedResize);
        $.addEventListener(shell.batchInput, 'keydown', shell.batchDelayedResize);
        shell.batchInput.focus();
        shell.batchInput.select();
        shell.batchButton = $.create('button', shell.batchBox, 'batchbutton_', 'inputbutton');
        (shell.batchButton as any).style = 'width:calc(100% - 3em);height:50px';
        $.addEventListener(shell.batchButton, 'click', shell.batchExec);
        $.addEventListener(shell.batchInput, 'focus', shell.batchFocus);
        $.addEventListener(shell.batchInput, 'blur', shell.batchBlur);
        shell.promptContainer = $.create('div', shell.shell, 'prompt_' + options.containerId);
        if (global.EvaluatorPointer.debug) {
            const promptFoot = $.create('p', shell.shell);
            promptFoot.innerHTML = global.MathJSLabCalcBuildMessage;
        }
        shell.promptUid = [];
        shell.promptSet = {};
        shell.promptIndex = -1;
        shell.batchInput.value = shell.input = options.input;
        shell.batchResize();
        if (shell.isFileProtocol || !shell.examplesAvailable) {
            global.ShellPointer.batchInput.value = firstExample.content;
            global.ShellPointer.batchExec(new Event('click'));
        } else {
            shell.examplesHeading = $.create('h2', shell.examplesContainer);
            let first = true;
            for (const example in shell.examples) {
                const button = $.create('button', shell.examplesContainer, 'example-' + example);
                button.innerHTML = shell.examples[example].caption;
                $.addEventListener(button, 'click', async (event: Event): Promise<void> => {
                    const exampleId = (event.target as any).id.substring(8);
                    const response = await global.compatibleFetch(`${global.MathJSLabCalc.exampleBaseUrl}example/${shell.examples[exampleId].file}`);
                    if (!response.ok) {
                        throw new Error('Network response error.');
                    }
                    global.ShellPointer.batchInput.value = global.ShellPointer.input = await response.text();
                    global.ShellPointer.batchExec(event);
                });
                if (first) {
                    button.click();
                    first = false;
                }
            }
        }
        shell.setLanguage();
        shell.promptAppend();
        return shell;
    }

    public setLanguage(lang?: string) {
        if (lang) {
            global.lang = lang;
        }
        this.variablesHeading.innerHTML = {
            en: 'Variables',
            es: 'Variables',
            pt: 'Variáveis',
        }[global.lang] as string;
        this.batchButton.innerHTML = {
            en: 'Evaluate',
            es: 'Computar',
            pt: 'Computar',
        }[global.lang] as string;
        this.examplesHeading.innerHTML = {
            en: 'Examples',
            es: 'Ejemplos',
            pt: 'Exemplos',
        }[global.lang] as string;
    }

    public get currentPromptSet(): PromptEntry {
        return this.promptSet[this.promptUid[this.promptIndex]];
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public batchResize(event?: Event): void {
        global.ShellPointer.batchInput.style.height = '1em';
        global.ShellPointer.batchInput.style.height = global.ShellPointer.batchInput.scrollHeight + 27 + 'px';
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public batchDelayedResize(event: Event): void {
        window.setTimeout(global.ShellPointer.batchResize, 0);
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public batchFocus(event: Event): void {
        /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
        const onfocus = document.activeElement;
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public batchExec(event: Event): void {
        global.ShellPointer.promptClean();
        global.ShellPointer.loadInput();
        global.ShellPointer.batchButton.focus();
    }

    public cleanNameList(): void {
        this.nameList.remove();
        this.nameList = $.create('ul', this.nameTable, null, 'namelist');
    }

    public refreshNameList(): void {
        this.cleanNameList();
        for (const name in global.EvaluatorPointer.nameTable) {
            if (!global.EvaluatorPointer.nativeNameTableList.includes(name)) {
                const nameTableEntry = global.EvaluatorPointer.nameTable[name];
                const nameListEntry = $.create('li', this.nameList);
                if (nameTableEntry.parameter.length !== 0) {
                    nameListEntry.innerHTML = `&commat; ${name}(${nameTableEntry.parameter.map((arg) => arg.id).join(',')})`;
                } else {
                    let resultType: string = '';
                    if (nameTableEntry.expression.type !== undefined) {
                        if (nameTableEntry.expression instanceof MultiArray) {
                            resultType = '[' + nameTableEntry.expression.dimension.join('x') + ']';
                        } else if (nameTableEntry.expression instanceof CharString) {
                            resultType = '(abc)';
                        } else {
                            resultType = '#';
                        }
                        if (nameTableEntry.expression.type === 0) {
                            if (resultType[0] === '[') {
                                resultType += '&not;';
                            } else {
                                resultType = '&not;';
                            }
                        } else if (nameTableEntry.expression.type === 2) {
                            resultType += '*';
                        }
                    }
                    nameListEntry.innerHTML = `${resultType} ${name}`;
                }
            }
        }
    }

    public loadInput(): void {
        // Separe statements and lines.
        const [statements, lines] = this.evalInput(this.batchInput);
        this.statements = statements;
        this.inputLines = lines;
        // Append empty statement if last statement is not an empty string (to create an empty prompt at the end).
        if (this.statements.length === 0) {
            this.statements = [''];
        } else if (this.statements[this.statements.length - 1].trim() !== '') {
            this.statements.push('');
        }
        for (let i = 0; i < this.statements.length; i++) {
            this.promptAppend(this.statements[i]);
        }
        this.batchResize();
        this.promptSet[this.promptUid[0]].input.focus();
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public batchBlur(event: Event): void {
        global.EvaluatorPointer.Restart();
        global.ShellPointer.promptClean();
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public promptFocus(event: Event): void {
        global.ShellPointer.promptIndex = global.ShellPointer.promptUid.indexOf(document.activeElement?.id.substring(1) as string);
    }

    /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
    public promptBlur(event: Event): void {
        const onblur = global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex]].input;
        if (global.ShellPointer.isTouchCapable && onblur.value != '') {
            global.ShellPointer.evalPrompt(
                global.ShellPointer.promptSet[onblur.id.substring(1)].container,
                global.ShellPointer.promptSet[onblur.id.substring(1)].box,
                global.ShellPointer.promptSet[onblur.id.substring(1)].input,
                global.ShellPointer.promptSet[onblur.id.substring(1)].output,
            );
        }
    }

    public promptClean(): void {
        for (const i in this.promptSet) {
            this.promptSet[i].container.remove();
        }
        this.cleanNameList();
    }

    public promptAppend(text?: string | null): void {
        const uid = global.crypto.randomUUID();
        const div = $.create('div', this.promptContainer, 'd' + uid);
        this.promptCreate(uid, div);
        this.promptIndex++;
        this.promptUid.push(uid);
        this.promptSet[uid].input.value = text ?? '';
        this.promptSet[uid].input.style.width = '97%';
        this.promptSet[uid].input.style.height = '1em';
        this.promptSet[uid].input.style.height = this.promptSet[uid].input.scrollHeight + 'px';
        this.promptSet[uid].input.focus();
        if (this.isTouchCapable) {
            this.promptSet[uid].input.blur();
        } else {
            this.evalPrompt(this.promptSet[uid].container, this.promptSet[uid].box, this.promptSet[uid].input, this.promptSet[uid].output);
        }
    }

    public promptCreate(uid: string, promptFrame: HTMLDivElement): void {
        const box = $.create('div', promptFrame, 'p' + uid, 'good');
        const table = $.create('table', box);
        table.style.width = '100%';
        const tr = $.create('tr', table);
        let td: HTMLTableCellElement;
        td = $.create('td', tr);
        td.innerHTML = '&#x300B;';
        td.style.width = '1em';
        td.style.position = 'relative';
        td.style.top = '-0.175em';
        td = $.create('td', tr);
        const input = $.create('textarea', td, 'i' + uid, 'inputprompt');
        $.addEventListener(input, 'focus', this.promptFocus);
        $.addEventListener(input, 'blur', this.promptBlur);
        $.addEventListener(input, 'keydown', this.promptKeydown);

        const promptResize = () => {
            input.style.width = '97%';
            input.style.height = '1em';
            input.style.height = input.scrollHeight + 'px';
        };
        /* 0-timeout to get the already changed textarea */
        const promptDelayedResize = () => {
            window.setTimeout(promptResize, 0);
        };
        const inputFocus = () => {
            if (!this.isTouchCapable) input.focus();
        };
        $.addEventListener(input, 'change', promptResize);
        $.addEventListener(input, 'cut', promptDelayedResize);
        $.addEventListener(input, 'paste', promptDelayedResize);
        $.addEventListener(input, 'drop', promptDelayedResize);
        $.addEventListener(input, 'keydown', promptDelayedResize);
        $.addEventListener(box, 'click', inputFocus);
        promptResize();

        const output = $.create('div', box, 'o' + uid);

        this.promptSet[uid] = {
            container: promptFrame,
            box,
            input,
            output,
        };
        this.refreshNameList();
    }

    public promptKeydown(event: KeyboardEvent) {
        let onfocus = document.activeElement as HTMLTextAreaElement;
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (onfocus.selectionStart == 0) {
                    // cria prompt anterior se pressionado enter com o cursor em 0
                    const pdiv = document.getElementById('d' + onfocus?.id.substring(1));
                    const uid = global.crypto.randomUUID();
                    const div = $.create('div', null, 'd' + uid);
                    global.ShellPointer.promptCreate(uid, div);
                    global.ShellPointer.promptUid.splice(global.ShellPointer.promptIndex, 0, uid);
                    global.ShellPointer.promptIndex++;
                    global.ShellPointer.promptContainer.insertBefore(div, pdiv);
                    onfocus.style.width = '90%';
                    onfocus.style.height = '1em';
                    onfocus.style.height = onfocus.scrollHeight + 'px';
                } else {
                    if (global.ShellPointer.promptIndex + 1 == global.ShellPointer.promptUid.length) {
                        // adiciona ao final
                        const uid = global.crypto.randomUUID();
                        const div = $.create('div', global.ShellPointer.promptContainer, 'd' + uid);
                        global.ShellPointer.promptCreate(uid, div);
                        global.ShellPointer.promptUid.push(uid);
                        global.ShellPointer.promptIndex++;
                    }
                    global.ShellPointer.evalPrompt(
                        global.ShellPointer.promptSet[onfocus.id.substring(1)].container,
                        global.ShellPointer.promptSet[onfocus.id.substring(1)].box,
                        global.ShellPointer.promptSet[onfocus.id.substring(1)].input,
                        global.ShellPointer.promptSet[onfocus.id.substring(1)].output,
                    );
                    // passa ao próximo prompt
                    onfocus =
                        global.ShellPointer.promptSet[
                            global.ShellPointer.promptUid[global.ShellPointer.promptUid.indexOf(onfocus.id.substring(1)) + 1]
                        ].input;
                    onfocus.focus();
                    onfocus.selectionStart = onfocus.value.length;
                    global.ShellPointer.refreshNameList();
                }
                if (!event.shiftKey) return false;
            } else if (
                // Apaga prompt se for nulo e pressionar backspace na coluna 0.
                event.key === 'Backspace' &&
                onfocus.selectionStart == 0
            ) {
                if (
                    global.ShellPointer.promptIndex !== 0 &&
                    global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]].input.value.trim() === ''
                ) {
                    // Apaga prompt anterior.
                    global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]].container.remove();
                    delete global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]];
                    global.ShellPointer.promptUid.splice(global.ShellPointer.promptIndex - 1, 1);
                    global.ShellPointer.promptIndex--;
                    event.preventDefault();
                } else if (global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex]].input.value.trim() === '') {
                    // Apaga prompt atual.
                    global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex]].container.remove();
                    delete global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex]];
                    global.ShellPointer.promptUid.splice(global.ShellPointer.promptIndex, 1);
                    global.ShellPointer.promptIndex--;
                    global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex]].input.focus();
                    event.preventDefault();
                }
            } else if (event.key === 'ArrowUp') {
                if (global.ShellPointer.promptIndex > 0 && onfocus.selectionStart <= onfocus.value.split(/\r?\n/)[0].length) {
                    global.ShellPointer.promptSet[
                        global.ShellPointer.promptUid[global.ShellPointer.promptUid.indexOf(onfocus.id.substring(1)) - 1]
                    ].input.focus();
                    event.preventDefault();
                }
            } else if (event.key === 'ArrowDown') {
                const promptLines = onfocus.value.split(/\r?\n/);
                promptLines.pop();
                if (
                    global.ShellPointer.promptIndex + 1 < global.ShellPointer.promptUid.length &&
                    onfocus.selectionStart >= promptLines.join('\n').length + 1
                ) {
                    global.ShellPointer.promptSet[
                        global.ShellPointer.promptUid[global.ShellPointer.promptUid.indexOf(onfocus.id.substring(1)) + 1]
                    ].input.focus();
                    event.preventDefault();
                }
            }
        }
    }
}
