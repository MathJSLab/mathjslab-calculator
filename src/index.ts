import { evalPrompt } from './eval-prompt';
import { Shell } from './shell';
import './style.css';

export const inputLines: string[] = [];

function bootstrap() {
    Shell.initialize({
        containerId: 'calculator',
        evalPrompt,
        inputLines,
        batch: true,
        prompt: true,
    });
}
bootstrap();
