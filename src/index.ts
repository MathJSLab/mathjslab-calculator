import { inputLines } from './input';
import { evalPrompt } from './eval-prompt';
import { Shell } from './shell';
import { MathJaxLoader } from './math-jax-loader';
import './style.css';

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
