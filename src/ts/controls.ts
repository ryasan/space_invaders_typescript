import {
    loadNewGame,
    state,
    btnGroup,
    loadStartMenu,
    deathObserver
} from './app';
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
    startMenuBtn = Button('MENU');

    constructor () {
        decorateWide(this.startMenuBtn);
        this.startMenuBtn.addEventListener('click', loadStartMenu);

        decorateWide(this.resetBtn);
        this.resetBtn.addEventListener('click', this.reset);

        decorateWide(this.playBtn);
        this.playBtn.addEventListener('click', this.play);

        decorateWide(this.pauseBtn);
        this.pauseBtn.addEventListener('click', this.pause);

        deathObserver.subscribe(this.pause);
    }

    pause = (): void => {
        if (btnGroup.contains(this.pauseBtn)) {
            state.setPause(true);
            btnGroup.appendChild(this.playBtn);
            btnGroup.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (btnGroup.contains(this.playBtn)) {
            state.setPause(false);
            btnGroup.appendChild(this.pauseBtn);
            btnGroup.removeChild(this.playBtn);
        }
    };

    reset = (): void => {
        if (intervals.attack !== null) clearInterval(intervals.attack);
        if (intervals.moveDown !== null) clearInterval(intervals.moveDown);
        loadNewGame(state.difficulty);
    };

    render = (): void => {
        btnGroup.append(this.startMenuBtn, this.resetBtn, this.playBtn);
    };
}

export default Controls;
