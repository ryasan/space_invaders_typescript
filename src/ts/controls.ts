import { state, renderScreen, START_MENU, NEW_GAME } from './app';
import { intervals } from './invaders';

const Button = (text: string, onclick: () => void) => {
    return Object.assign(document.createElement('button'), {
        onclick: onclick,
        textContent: text,
        className: 'btn'
    });
};

export default class Controls extends HTMLElement {
    resetBtn: HTMLElement;
    playBtn: HTMLElement;
    pauseBtn: HTMLElement;
    startMenuBtn: HTMLElement;

    constructor () {
        super();
        this.id = 'control-btns';
        this.resetBtn = Button('RESET', this.reset);
        this.playBtn = Button('PLAY', this.play);
        this.pauseBtn = Button('PAUSE', this.pause);
        this.startMenuBtn = Button('MENU', this.goToStartMenu);

        this.append(this.startMenuBtn, this.resetBtn, this.playBtn);
    }

    connectedCallback () {
        window.addEventListener('blur', this.pause);
    }

    disconnectedCallback () {
        window.removeEventListener('blur', this.pause);
    }

    pause = (): void => {
        if (this.contains(this.pauseBtn)) {
            state.setIsPaused(true);
            this.appendChild(this.playBtn);
            this.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (this.contains(this.playBtn)) {
            state.setIsPaused(false);
            this.appendChild(this.pauseBtn);
            this.removeChild(this.playBtn);
        }
        // if (!document.contains(player.element()) && !state.gameIsOver) {
        //     player.render();
        // }
    };

    goToStartMenu = (): void => {
        renderScreen(START_MENU);
    };

    reset = (): void => {
        if (intervals.attack !== null) clearInterval(intervals.attack);
        if (intervals.moveDown !== null) clearInterval(intervals.moveDown);
        renderScreen(NEW_GAME);
    };
}
