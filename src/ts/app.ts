import State, { Difficulty } from './state';
import Invader from './invader';

export let state: State;

const html = {
    gameOver: () => {
        return `
            <div class="game-over__inner">
                <h1 class="game-over__title">GAME OVER!</h1>
                <button id="play-again-btn" class="btn">
                    PLAY AGAIN
                </button>
                <button id="main-menu-btn" class="btn">
                    MAIN MENU
                </button>
            </div>
        `;
    },
    startMenuBtn: (difficulty: Difficulty) => {
        return `
            <li class="menu__difficulty">
                <a>${difficulty}</a>
            </li>
        `;
    },
    startMenu: () => {
        return `
            <div class="menu__gif"></div>
            <h1 class="menu__title">Space Invaders</h1>
            <div class="menu__difficulty-container">
                <h3 class="difficulty__title">Select Difficulty</h3>
                <ul class="menu__difficulty-list">
                    <start-menu-button difficulty="easy"></start-menu-button>
                    <start-menu-button difficulty="normal"></start-menu-button>
                    <start-menu-button difficulty="hard"></start-menu-button>
                </ul>
            </div>
        `;
    },
    header: () => {
        return `
            <div id="control-btns"></div>
            <div id="score"></div>
            <div id="lives"></div>
        `;
    },
    game: () => {
        return `
            <top-header></top-header>
            <canvas id="canvas" width="1200" height="720"></canvas>
        `;
    },
    globalState: () => {
        return '';
    }
};

const keys = { LEFT: 37, RIGHT: 39, DOWN: 40, SPACE: 32 };

const onKeydown = (e: KeyboardEvent): void => {
    if (!state.isPaused) {
        if (e.keyCode === keys.LEFT) console.log('move left');
        if (e.keyCode === keys.RIGHT) console.log('move right');
        if (e.keyCode === keys.DOWN) console.log('move down');
        if (e.keyCode === keys.SPACE) console.log('fire');
    }
};

class GameOver extends HTMLElement {
    constructor () {
        super();
        this.id = 'game-over';
        this.innerHTML = html.gameOver();
    }
}

class StartMenuBtn extends HTMLElement {
    difficulty: Difficulty;

    constructor () {
        super();
        this.difficulty = this.getAttribute('difficulty') as Difficulty;
        this.innerHTML = html.startMenuBtn(this.difficulty);
    }

    loadGame = () => {
        loadGame(this.difficulty);
    };

    connectedCallback () {
        this.addEventListener('click', this.loadGame);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.loadGame);
    }
}

class StartMenu extends HTMLElement {
    constructor () {
        super();
        this.id = 'menu';
        this.innerHTML = html.startMenu();
    }
}

class Header extends HTMLElement {
    controlBtns: HTMLElement;
    resetBtn: HTMLElement;
    playBtn: HTMLElement;
    pauseBtn: HTMLElement;
    startMenuBtn: HTMLElement;

    static createBtn = (text: string, onclick: () => void) => {
        return Object.assign(document.createElement('button'), {
            onclick: onclick,
            textContent: text,
            className: 'btn'
        });
    };

    constructor () {
        super();
        this.id = 'header';
        this.innerHTML = html.header();

        this.resetBtn = Header.createBtn('RESET', () => loadGame());
        this.startMenuBtn = Header.createBtn('MENU', () => loadStartMenu());
        this.playBtn = Header.createBtn('PLAY', this.play);
        this.pauseBtn = Header.createBtn('PAUSE', this.pause);
        this.controlBtns = document.querySelector('#control-btns') as HTMLElement; // prettier-ignore
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

const createInvaders = (game: Game): Invader[] => {
    const invaders: Invader[] = [];

    for (let i = 0; i < 60; i++) {
        const x = 20 + (i % 12) * 50;
        const y = 20 + (i % 5) * 50;
        invaders.push(new Invader(game, { x, y }));
    }

    return invaders;
};

export class Game extends HTMLElement {
    canvas: any;
    ctx: CanvasRenderingContext2D;
    invaders: Invader[] = [];
    reqId = 0;
    then = Date.now();
    size: { x: number; y: number };

    constructor () {
        super();
        this.id = 'game';
        this.innerHTML = html.game();

        this.canvas = this.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');
        this.size = {
            x: this.ctx.canvas.width,
            y: this.ctx.canvas.height
        };

        this.invaders = createInvaders(this);
    }

    connectedCallback () {
        this.draw();
        this.tick();
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
    }

    tick = () => {
        if (!state.isPaused) this.update();
        this.draw();
        this.reqId = window.requestAnimationFrame(this.tick);
    };

    update = () => {
        for (let i = 0; i < this.invaders.length; i++) {
            this.invaders[i].update();
        }
    };

    draw = () => {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);

        // flip invader arms animation after 1500ms
        const now = Date.now();
        const elapsed = now - this.then;
        const intervalReached = elapsed > 1000;

        if (intervalReached) {
            this.then = now - (elapsed % 1000);
        }

        for (let i = 0; i < this.invaders.length; i++) {
            this.invaders[i].draw();
            if (intervalReached) this.invaders[i].toggleImg();
        }
    };
}

const components = [
    {
        tagName: 'start-menu',
        component: StartMenu
    },
    {
        tagName: 'start-menu-button',
        component: StartMenuBtn
    },
    {
        tagName: 'game-map',
        component: Game
    },
    {
        tagName: 'game-over',
        component: GameOver
    },
    {
        tagName: 'top-header',
        component: Header
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

export const loadStartMenu = () => {
    state = new State();
    document.body.innerHTML = '<start-menu />';
};

export const loadGame = (difficulty = state.difficulty) => {
    state.setDifficulty(difficulty);
    state.setIsPaused(true);
    document.body.innerHTML = `<game-map />`;
};

export const showGameOver = () => {
    document.body.innerHTML += '<game-over />';
};

window.addEventListener('load', loadStartMenu);
