import evalInput from './evalInput';
import evalPrompt from './evalPrompt';
import { Shell } from './Shell';
import './main.css';

export const input: string = '';

function bootstrap() {
    Shell.initialize({
        containerId: 'mathjslab-prompt',
        examplesId: 'mathjslab-examples',
        evalPrompt,
        evalInput,
        input,
    });
}
bootstrap();
