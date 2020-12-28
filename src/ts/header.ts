import {
    state,
    loadStartMenu,
    loadGame,
    htmlElement,
    showCountDown,
    showGameOver
} from './app';

export default class Header extends HTMLElement {
    controlBtns: any;
    timeLeft: any;
    resetBtn: HTMLElement;
    playBtn: HTMLElement;
    pauseBtn: HTMLElement;
    startMenuBtn: HTMLElement;
    interval: any;
    distance = 90000;

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
            <div id="stats">
                <div>Score:<span id="score-count">0</span></div>
                <div>Time Left:<span id="time-left"></span></div>
            </div>
            <div id="lives">
                <div>Lives: </div>
                <div id="lives-list">
                    <div class="life"></div>
                    <div class="life"></div>
                    <div class="life"></div>
                </div>
            </div>
        `;
        this.id = 'header';

        this.resetBtn = Header.createBtn('RESET', () => loadGame());
        this.startMenuBtn = Header.createBtn('MENU', () => loadStartMenu());
        this.playBtn = Header.createBtn('PLAY', this.play);
        this.pauseBtn = Header.createBtn('PAUSE', this.pause);

        this.controlBtns = this.querySelector('#control-btns');
        this.controlBtns.append(this.startMenuBtn, this.resetBtn, this.playBtn);

        this.timeLeft = this.querySelector('#time-left');
        this.renderTime();
    }

    disconnectedCallback () {
        clearInterval(this.interval);
    }

    // prettier-ignore
    renderTime = () => {
        if (!state.isPaused) this.distance -= 1000;

        const minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((this.distance % (1000 * 60)) / 1000);
        this.timeLeft.textContent = `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;

        if (!minutes && !seconds) showGameOver(false);
    };

    pause = (): void => {
        if (this.controlBtns.contains(this.pauseBtn)) {
            state.setIsPaused(true);
            this.controlBtns.appendChild(this.playBtn);
            this.controlBtns.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (htmlElement('#lives-list').childElementCount) {
            showCountDown();

            if (!this.interval) {
                this.interval = setInterval(this.renderTime, 1000);
            }

            if (this.controlBtns.contains(this.playBtn)) {
                this.controlBtns.appendChild(this.pauseBtn);
                this.controlBtns.removeChild(this.playBtn);
            }
        }
    };
}
