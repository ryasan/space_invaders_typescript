import { loadNewGame, state, btnGroup } from './app';
import { intervals } from './invaders';

const Button = (text: string, id?: string) => {
    const btn = document.createElement('button');
    if (id) btn.id = id;
    btn.textContent = text;
    btn.className = 'btn';

    return btn;
};

const decorateWide = (btn: HTMLElement) => {
    btn.classList.add('btn--wide');

    return btn;
};

class Controls {
    resetBtn = Button('RESET');
    playBtn = Button('PLAY');
    pauseBtn = Button('PAUSE');

    constructor () {
        decorateWide(this.resetBtn);
        this.resetBtn.addEventListener('click', () => {
            console.log('test')
            if (intervals.attack !== null) clearInterval(intervals.attack);
            if (intervals.moveDown !== null) clearInterval(intervals.moveDown);
            loadNewGame(state.difficulty);
        });

        decorateWide(this.playBtn);
        this.playBtn.addEventListener('click', () => {
            if (btnGroup.contains(this.playBtn)) {
                state.setPause(false);
                btnGroup.appendChild(this.pauseBtn);
                btnGroup.removeChild(this.playBtn);
            }
        });

        decorateWide(this.pauseBtn);
        this.pauseBtn.addEventListener('click', () => {
            if (btnGroup.contains(this.pauseBtn)) {
                state.setPause(true);
                btnGroup.appendChild(this.playBtn);
                btnGroup.removeChild(this.pauseBtn);
            }
        });
    }

    pause = (): void => {
        this.pauseBtn.click();
    };

    play = (): void => {
        this.playBtn.click();
    };

    render = (): void => {
        btnGroup.append(this.resetBtn, this.playBtn);
    };
}

export default Controls;
