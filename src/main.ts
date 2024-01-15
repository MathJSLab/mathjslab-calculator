import evalInput from './eval-input';
import evalPrompt from './eval-prompt';
import { Shell } from './shell';
import './main.css';

export const input: string = '';

function bootstrap() {
    Shell.initialize({
        containerId: 'mathjslab-calculator',
        examplesId: 'mathjslab-examples',
        evalPrompt,
        evalInput,
        input,
    });
}
bootstrap();
