/**
 * Prompt Evaluator
 */
import $ from 'basic-dom-helper';
import { Evaluator, evaluator, insertOutput, outputFunction, MathMarkdown } from './evaluator-configuration';

/**
 * evalPrompt function
 * @param frame
 * @param box
 * @param input
 * @param output
 */
export function evalPrompt(frame: HTMLDivElement, box: HTMLDivElement, input: HTMLTextAreaElement, output: HTMLDivElement): void {
    let tree: any;
    try {
        tree = evaluator.Parse(input.value);
        if (tree) {
            const unparse_input = evaluator.Unparse(tree);
            const eval_input = evaluator.Evaluate(tree);
            if (evaluator.exitStatus === Evaluator.response.OK) {
                box.className = 'good';
                const unparse_eval_input = evaluator.Unparse(eval_input);
                if (unparse_input !== unparse_eval_input) {
                    const evalsign =
                        typeof tree.list[0].type === 'string' &&
                        tree.list[0].type.substring(tree.list[0].type.length - 1, tree.list[0].type.length) === '='
                            ? '&rArr;'
                            : '=';
                    output.innerHTML =
                        '<table><tr><td>' +
                        evaluator.UnparseML(tree) +
                        `</td><td><math xmlns = 'http://www.w3.org/1998/Math/MathML' display='block'><mo>${evalsign}</mo></math></td><td>` +
                        evaluator.UnparseML(eval_input) +
                        '</td></tr></table>';
                } else {
                    output.innerHTML = '<table><tr><td>' + evaluator.UnparseML(tree) + '</td></tr></table>';
                }
                if (insertOutput.type !== '') {
                    const uid = $.uid();
                    $.create('div', output, 'o' + uid);
                    outputFunction[insertOutput.type]('o' + uid);
                }
                if (evaluator.debug) {
                    output.innerHTML +=
                        '<pre>' +
                        '<br /><br />Input   : ' +
                        JSON.stringify(tree, (key: string, value: any) => (key !== 'parent' ? value : true), 2) +
                        '<br /><br />Evaluate: ' +
                        JSON.stringify(eval_input, (key: string, value: any) => (key !== 'parent' ? value : true), 2) +
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
        output.innerHTML = "<table><tr><td align='left'>" + evaluator.UnparseML(tree) + '</td></tr></table><br />' + error; // +
        evaluator.debug
            ? '<br /><br /><pre>Input   : ' + JSON.stringify(tree, (key: string, value: any) => (key !== 'parent' ? value : true), 2) + '</pre>'
            : '';
        if (evaluator.debug) throw error;
    }
    MathMarkdown.typeset();
}
