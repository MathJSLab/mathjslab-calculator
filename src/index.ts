import { evalPrompt } from './eval-prompt';
import { Shell } from './shell';
import { MathJaxLoader } from './math-jax-loader';
import './style.css';

export const inputLines: string[] = [];

function bootstrap() {
    new Shell({
        containerId: 'calculator',
        evalPrompt,
        inputLines,
        batch: true,
        prompt: true,
    });
    MathJaxLoader.loadMathJaxIfNeed();
}
bootstrap();
