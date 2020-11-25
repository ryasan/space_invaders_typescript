import { loadGame, state, btnGroup } from './app';
import { interval } from './invaders';

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
            clearInterval(interval);
            loadGame();
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

    renderBtns = (): void => {
        btnGroup.append(this.resetBtn, this.playBtn);
    };
}

export default Controls;
