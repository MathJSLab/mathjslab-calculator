/**
 * Input Evaluator
 */

/**
 *
 * @param input
 * @returns [statements[], lines[]]
 */
export default function evalInput(input: HTMLTextAreaElement): [string[], string[]] {
    try {
        const lines: string[] = input.value.split(/\r?\n/);
        const getText = (start: { line: number; column: number }, stop: { line: number; column: number }): string => {
            if (stop.line === start.line) {
                return lines[start.line - 1].substring(start.column, stop.column + 1);
            } else {
                let result = lines[start.line - 1].substring(start.column) + '\n';
                if (stop.line > start.line + 1) {
                    result += lines.slice(start.line, stop.line - 1).join('\n') + '\n';
                }
                result += lines[stop.line - 1].substring(0, stop.column);
                return result.trim();
            }
        };
        const statement: string[] = [];
        const tree = global.EvaluatorPointer.Parse(input.value);
        if (tree) {
            for (let i = 0; i < tree.list.length; i++) {
                statement[i] = getText(tree.list[i].start, tree.list[i].stop);
            }
            return [statement, lines];
        } else {
            return [[], []];
        }
    } catch (error) {
        global.alert(error);
        return [[], []];
    }
}
