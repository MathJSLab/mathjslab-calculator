/**
 * Prompt Evaluator
 */
import createHTMLElement from './createHTMLElement';
import { insertOutput, outputFunction, MathMarkdown } from './EvaluatorConfiguration';

/**
 * evalPrompt function
 * @param frame
 * @param box
 * @param input
 * @param output
 */
export default function evalPrompt(frame: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement): void {
    let tree: any;
    try {
        tree = global.EvaluatorPointer.Parse(input.value);
        if (tree) {
            const unparse_input = global.EvaluatorPointer.Unparse(tree);
            const eval_input = global.EvaluatorPointer.Evaluate(tree);
            if (global.EvaluatorPointer.exitStatus === global.EvaluatorPointer.response.OK) {
                box.className = 'good';
                const unparse_eval_input = global.EvaluatorPointer.Unparse(eval_input);
                if (unparse_input !== unparse_eval_input) {
                    const evalsign =
                        typeof tree.list[0].type === 'string' &&
                        tree.list[0].type.substring(tree.list[0].type.length - 1, tree.list[0].type.length) === '='
                            ? '&rArr;'
                            : '=';
                    output.innerHTML =
                        '<table><tr><td>' +
                        global.EvaluatorPointer.UnparseMathML(tree) +
                        `</td><td><math xmlns = 'http://www.w3.org/1998/Math/MathML' display='block'><mo>${evalsign}</mo></math></td><td>` +
                        global.EvaluatorPointer.UnparseMathML(eval_input) +
                        '</td></tr></table>';
                } else {
                    output.innerHTML = '<table><tr><td>' + global.EvaluatorPointer.UnparseMathML(tree) + '</td></tr></table>';
                }
                if (insertOutput.type !== '') {
                    const uid = global.crypto.randomUUID();
                    createHTMLElement('div', output, 'o' + uid);
                    outputFunction[insertOutput.type]('o' + uid);
                }
                if (global.EvaluatorPointer.debug) {
                    output.innerHTML +=
                        '<pre>' +
                        '<br /><br />Input   : ' +
                        JSON.stringify(tree, (key: string, value: any) => (key !== 'parent' ? value : value === null ? 'root' : true), 2) +
                        '<br /><br />Evaluate: ' +
                        JSON.stringify(eval_input, (key: string, value: any) => (key !== 'parent' ? value : value === null ? 'root' : true), 2) +
                        '<br /><br />Unparse Input   :' +
                        unparse_input +
                        '<br /><br />Unparse Evaluate:' +
                        unparse_eval_input +
                        '</pre>';
                }
            }
        }
    } catch (error) {
        box.className = 'bad';
        output.innerHTML =
            "<table><tr><td align='left'>" +
            global.EvaluatorPointer.UnparseMathML(tree) +
            '</td></tr></table><br />' +
            error +
            (global.EvaluatorPointer.debug
                ? '<br /><br /><pre>Input   : ' +
                  JSON.stringify(tree, (key: string, value: any) => (key !== 'parent' ? value : value === null ? 'root' : true), 2) +
                  '</pre>'
                : '');
        if (global.EvaluatorPointer.debug) throw error;
    }
    MathMarkdown.mathTypeset();
}
