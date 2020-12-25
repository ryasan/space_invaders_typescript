import { state, loadStartMenu, loadGame } from './app';

export default class Header extends HTMLElement {
    controlBtns: any;
    resetBtn: HTMLElement;
    playBtn: HTMLElement;
    pauseBtn: HTMLElement;
    startMenuBtn: HTMLElement;
    score: HTMLElement;

    static createBtn = (text: string, onclick: () => void) => {
        return Object.assign(document.createElement('button'), {
            onclick: onclick,
            textContent: text,
            className: 'btn'
        });
    };

    constructor () {
        super();
        this.innerHTML = `
            <div id="control-btns"></div>
            <div id="score">
                <span>Score: </span><span id="score-count">0</span>
            </div>
            <div id="lives">
                <span>Lives</span>    
            </div>
        `;
        this.id = 'header';

        this.score = document.querySelector('#score-count') as HTMLElement;

        this.resetBtn = Header.createBtn('RESET', () => loadGame());
        this.startMenuBtn = Header.createBtn('MENU', () => loadStartMenu());
        this.playBtn = Header.createBtn('PLAY', this.play);
        this.pauseBtn = Header.createBtn('PAUSE', this.pause);

        this.controlBtns = this.querySelector('#control-btns');
        this.controlBtns.append(this.startMenuBtn, this.resetBtn, this.playBtn);
    }

    connectedCallback () {
        window.addEventListener('blur', this.pause);
    }

    disconnectedCallback () {
        window.removeEventListener('blur', this.pause);
    }

    pause = (): void => {
        if (this.controlBtns.contains(this.pauseBtn)) {
            state.setIsPaused(true);
            this.controlBtns.appendChild(this.playBtn);
            this.controlBtns.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (this.controlBtns.contains(this.playBtn)) {
            state.setIsPaused(false);
            this.controlBtns.appendChild(this.pauseBtn);
            this.controlBtns.removeChild(this.playBtn);
        }
    };
}
