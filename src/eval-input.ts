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
        const statements: string[] = [];
        const lines: string[] = input.value.split(/\r?\n/);
        const tree = global.EvaluatorPointer.Parse(input.value);
        if (tree) {
            for (let i = 0; i < tree.list.length; i++) {
                if (tree.list[i].stop.line === tree.list[i].start.line) {
                    // if statement is single line and there's no other statement in the same line then pass entire line.
                    if (
                        (i === 0 || tree.list[i - 1].stop.line < tree.list[i].start.line) &&
                        (i === tree.list.length - 1 || tree.list[i + 1].start.line > tree.list[i].start.line)
                    ) {
                        statements[i] = lines[tree.list[i].start.line - 1];
                    } else {
                        statements[i] = lines[tree.list[i].start.line - 1].substring(tree.list[i].start.column, tree.list[i].stop.column + 1);
                    }
                } else {
                    let result: string;
                    if (i === 0 || tree.list[i - 1].stop.line < tree.list[i].start.line) {
                        result = lines[tree.list[i].start.line - 1] + '\n';
                    } else {
                        result = lines[tree.list[i].start.line - 1].substring(tree.list[i].start.column) + '\n';
                    }
                    if (tree.list[i].stop.line > tree.list[i].start.line + 1) {
                        result += lines.slice(tree.list[i].start.line, tree.list[i].stop.line - 1).join('\n') + '\n';
                    }
                    if (i === tree.list.length - 1 || tree.list[i + 1].start.line > tree.list[i].start.line) {
                        result += lines[tree.list[i].stop.line - 1];
                    } else {
                        result += lines[tree.list[i].stop.line - 1].substring(0, tree.list[i].stop.column);
                    }
                    statements[i] = result.trim();
                }
            }
            return [statements, lines];
        } else {
            return [[], []];
        }
    } catch (error) {
        // TODO: Better error handling.
        global.alert(error);
        return [[], []];
    }
}
