import {
    loadNewGame,
    state,
    btnGroup,
    loadStartMenu,
    deathObserver,
    player
} from './app';
import { intervals } from './invaders';

const Button = (text: string, onclick: () => void) => {
    return Object.assign(document.createElement('button'), {
        onclick: onclick,
        textContent: text,
        className: 'btn'
    });
};

export default class Controls {
    resetBtn: HTMLElement;
    playBtn: HTMLElement;
    pauseBtn: HTMLElement;
    startMenuBtn: HTMLElement;

    constructor () {
        this.resetBtn = Button('RESET', this.reset);
        this.playBtn = Button('PLAY', this.play);
        this.pauseBtn = Button('PAUSE', this.pause);
        this.startMenuBtn = Button('MENU', loadStartMenu);

        deathObserver.subscribe(this.pause);
    }

    pause = (): void => {
        if (btnGroup.contains(this.pauseBtn)) {
            state.setIsPaused(true);
            btnGroup.appendChild(this.playBtn);
            btnGroup.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (btnGroup.contains(this.playBtn)) {
            state.setIsPaused(false);
            btnGroup.appendChild(this.pauseBtn);
            btnGroup.removeChild(this.playBtn);
        }
        if (!document.contains(player.element()) && !state.gameIsOver) {
            player.render();
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
