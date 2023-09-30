import $ from 'basic-dom-helper';
import firstExample from './first-example.json';
import buildConfiguration from './build-configuration.json';

/**
 * Shell evaluator prompt handler
 */
export type EvalPromptHandler = (frame: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement) => void;

export interface BatchOptions {
    cleanOnBlur: boolean;
}

export interface PromptOptions {
    cleanOnBlur: boolean;
}

/**
 * Shell instantiation options.
 */
export interface ShellOptions {
    containerId: string;
    evalPrompt?: EvalPromptHandler;
    inputLines: string[];
    batch?: BatchOptions | boolean;
    prompt?: PromptOptions | boolean;
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
    /* eslint-disable-next-line  no-var */
    var MathJSLabCalcBuildVersion: string;
}

/**
 * Shell prompt class.
 */
export class Shell {
    baseUrl: string;
    isFileProtocol: boolean;
    isTouchCapable: boolean;
    examples: Record<string, ExampleEntry>;
    examplesAvailable: boolean;
    container: HTMLDivElement;
    shell: HTMLDivElement;
    variables: HTMLDivElement;
    nameTable: HTMLDivElement;
    nameList: HTMLUListElement;
    evalPrompt: EvalPromptHandler;
    examplesContainer: HTMLDivElement;
    batchContainer: HTMLDivElement;
    batchBox: HTMLDivElement;
    batchWrapper: HTMLDivElement;
    batchInput: HTMLTextAreaElement;
    batchButton: HTMLButtonElement;
    promptContainer: HTMLDivElement;
    inputLines: string[];
    promptUid: string[];
    promptSet: Record<string, PromptEntry>;
    promptIndex: number;

    private constructor() {
        global.ShellPointer = this;
        global.MathJSLabCalcBuildVersion = buildConfiguration.buildTime;
        this.baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        this.isFileProtocol = this.baseUrl.startsWith('file:');
        this.isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0;
    }

    public static async initialize(options: ShellOptions): Promise<Shell> {
        const shell = new Shell();
        shell.container = $.i(options.containerId) as HTMLDivElement;
        shell.container.className = 'container';
        if (options.evalPrompt) {
            shell.evalPrompt = options.evalPrompt;
        } else {
            shell.evalPrompt = function (div: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement) {
                console.log(`evalPrompt(${input.value})`);
                output.innerHTML = `evalPrompt(${input.value})`;
            };
        }
        shell.inputLines = options.inputLines;
        shell.shell = $.create('div', shell.container, 'shell_' + options.containerId, 'shell');
        if (!shell.isFileProtocol) {
            shell.examplesContainer = $.create('div', shell.shell, 'examples_' + options.containerId, 'examples');
            await fetch(`${shell.baseUrl}example/example.json`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response error.');
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
        const variable_head = $.create('h2', shell.variables);
        variable_head.innerHTML = 'Variables';
        variable_head.setAttribute('align', 'center');
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
        shell.batchButton.innerHTML = 'Evaluate';
        (shell.batchButton as any).style = 'width:calc(100% - 3em);height:50px';
        $.addEventListener(shell.batchButton, 'click', shell.batchExec);
        $.addEventListener(shell.batchInput, 'focus', shell.batchFocus);
        $.addEventListener(shell.batchInput, 'blur', shell.batchBlur);
        shell.promptContainer = $.create('div', shell.shell, 'prompt_' + options.containerId);
        shell.promptUid = [];
        shell.promptSet = {};
        shell.promptIndex = -1;
        shell.updateBatch();
        //TLN.append_line_numbers(shell.batchInput.id);
        shell.batchResize();
        shell.loadExamples();
        shell.promptAppend();
        return shell;
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
        global.ShellPointer.loadBatch();
        global.ShellPointer.loadLines();
        global.ShellPointer.batchButton.focus();
    }

    public cleanNameList(): void {
        this.nameList.remove();
        this.nameList = $.create('ul', this.nameTable, null, 'namelist');
    }

    public refreshNameList(): void {
        this.cleanNameList();
        for (const name in global.EvaluatorPointer.nameTable) {
            if (!global.EvaluatorPointer.readonlyNameTable.includes(name)) {
                const nameTableEntry = global.EvaluatorPointer.nameTable[name];
                const nameListEntry = $.create('li', this.nameList);
                if (nameTableEntry.args.length !== 0) {
                    nameListEntry.innerHTML = `&#x219B; ${name}(${nameTableEntry.args.map((arg) => arg.id).join(',')})`;
                } else {
                    let resultType: string = '';
                    if (nameTableEntry.expr['type'] !== undefined) {
                        if ('array' in nameTableEntry.expr) {
                            resultType = '[' + nameTableEntry.expr.dim.slice().join('x') + ']';
                        } else {
                            resultType = '#';
                        }
                        if (nameTableEntry.expr['type'] === 0) {
                            if (resultType[0] === '#') {
                                resultType = '¬';
                            } else {
                                resultType += '¬';
                            }
                        } else if (nameTableEntry.expr['type'] === 2) {
                            resultType += '*';
                        }
                    }
                    nameListEntry.innerHTML = `${resultType} ${name}`;
                }
            }
        }
    }

    public updateBatch(): void {
        this.batchInput.value = this.inputLines.join('\n');
    }

    public loadBatch(): void {
        this.inputLines = this.batchInput.value.split('\n');
    }

    public loadLines(): void {
        if (this.inputLines[this.inputLines.length - 1].trim() !== '') {
            this.inputLines.push('');
        }
        if (this.inputLines && this.inputLines.length == 0) this.inputLines = [''];
        if (this.inputLines) {
            for (let i = 0; i < this.inputLines.length; i++) {
                this.promptAppend(this.inputLines[i]);
            }
            this.batchResize();
            this.promptSet[this.promptUid[0]].input.focus();
        }
    }

    public loadExamples(): void {
        if (this.isFileProtocol || !this.examplesAvailable) {
            global.ShellPointer.batchInput.value = firstExample.content;
            global.ShellPointer.batchExec(new Event('click'));
        } else {
            const examplesHeading = $.create('h2', this.examplesContainer);
            examplesHeading.innerHTML = 'Examples';
            let first = true;
            for (const example in this.examples) {
                const button = $.create('button', this.examplesContainer, 'example-' + example);
                button.innerHTML = this.examples[example].caption;
                $.addEventListener(button, 'click', async (event: Event): Promise<void> => {
                    const exampleId = (event.target as any).id.substring(8);
                    const response = await fetch(`${this.baseUrl}example/${this.examples[exampleId].file}`);
                    if (!response.ok) {
                        throw new Error('Network response error.');
                    }
                    global.ShellPointer.batchInput.value = await response.text();
                    global.ShellPointer.batchExec(event);
                });
                if (first) {
                    button.click();
                    first = false;
                }
            }
        }
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
        const uid = $.uid();
        const div = $.create('div', this.promptContainer, 'd' + uid);
        this.promptCreate(uid, div);
        this.promptIndex++;
        this.promptUid.push(uid);
        if (text) this.promptSet[uid].input.value = text;
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
                    const uid = $.uid();
                    const div = $.create('div', null, 'd' + uid);
                    global.ShellPointer.promptCreate(uid, div);
                    global.ShellPointer.promptUid.splice(global.ShellPointer.promptIndex, 0, uid);
                    global.ShellPointer.promptIndex++;
                    global.ShellPointer.promptContainer.insertBefore(div, pdiv);
                    onfocus.style.width = '90%';
                    onfocus.style.height = '1em';
                    onfocus.style.height = onfocus.scrollHeight + 'px';
                    global.ShellPointer.inputLines.splice(global.ShellPointer.promptIndex - 1, 0, onfocus.value);
                    global.ShellPointer.batchInput.value = global.ShellPointer.inputLines.join('\n');
                } else {
                    if (global.ShellPointer.promptIndex + 1 == global.ShellPointer.promptUid.length) {
                        // adiciona ao final
                        const uid = $.uid();
                        const div = $.create('div', global.ShellPointer.promptContainer, 'd' + uid);
                        global.ShellPointer.promptCreate(uid, div);
                        global.ShellPointer.promptUid.push(uid);
                        global.ShellPointer.inputLines.push(global.ShellPointer.promptSet[onfocus?.id.substring(1)].input.value);
                        global.ShellPointer.batchInput.value = global.ShellPointer.inputLines.join('\n');
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
                // apaga prompt anterior se for nulo e pressionar backspace na coluna 0
                event.key === 'Backspace' &&
                onfocus.selectionStart == 0 &&
                global.ShellPointer.promptIndex != 0 &&
                global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]].input.value == ''
            ) {
                // apaga prompt anterior
                global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]].container.remove();
                delete global.ShellPointer.promptSet[global.ShellPointer.promptUid[global.ShellPointer.promptIndex - 1]];
                global.ShellPointer.promptUid.splice(global.ShellPointer.promptIndex - 1, 1);
                global.ShellPointer.inputLines.splice(global.ShellPointer.promptIndex - 1, 1);
                global.ShellPointer.batchInput.value = global.ShellPointer.inputLines.join('\n');
                global.ShellPointer.promptIndex--;
            } else if (event.key === 'ArrowUp') {
                if (global.ShellPointer.promptIndex > 0)
                    global.ShellPointer.promptSet[
                        global.ShellPointer.promptUid[global.ShellPointer.promptUid.indexOf(onfocus.id.substring(1)) - 1]
                    ].input.focus();
            } else if (event.key === 'ArrowDown') {
                if (global.ShellPointer.promptIndex + 1 < global.ShellPointer.promptUid.length)
                    global.ShellPointer.promptSet[
                        global.ShellPointer.promptUid[global.ShellPointer.promptUid.indexOf(onfocus.id.substring(1)) + 1]
                    ].input.focus();
            }
        }
    }
}
