import State, { Difficulty } from './state';
import Invader from './invader';

// prettier-ignore
export const GAME_OVER = 'GAME_OVER',
             START_MENU = 'START_MENU',
             NEW_GAME = 'NEW_GAME';

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
    }
};

const keys = { LEFT: 37, RIGHT: 39, DOWN: 40, SPACE: 32 };

const onKeydown = (e: KeyboardEvent): void => {
    const state = (document.querySelector('#game') as Game).state;

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

    renderNewScreen = () => {
        renderScreen(NEW_GAME);
    };

    connectedCallback () {
        this.addEventListener('click', this.renderNewScreen);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.renderNewScreen);
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
    state: State;

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

        this.resetBtn = Header.createBtn('RESET', this.reset);
        this.playBtn = Header.createBtn('PLAY', this.play);
        this.pauseBtn = Header.createBtn('PAUSE', this.pause);
        this.startMenuBtn = Header.createBtn('MENU', this.goToStartMenu);

        this.controlBtns = document.querySelector('#control-btns') as HTMLElement; // prettier-ignore
        this.controlBtns.append(this.startMenuBtn, this.resetBtn, this.playBtn);

        this.state = (document.querySelector('#game') as Game).state;
    }

    connectedCallback () {
        window.addEventListener('blur', this.pause);
    }

    disconnectedCallback () {
        window.removeEventListener('blur', this.pause);
    }

    pause = (): void => {
        if (this.controlBtns.contains(this.pauseBtn)) {
            this.state.setIsPaused(true);
            this.controlBtns.appendChild(this.playBtn);
            this.controlBtns.removeChild(this.pauseBtn);
        }
    };

    play = (): void => {
        if (this.controlBtns.contains(this.playBtn)) {
            this.state.setIsPaused(false);
            this.controlBtns.appendChild(this.pauseBtn);
            this.controlBtns.removeChild(this.playBtn);
        }
    };

    goToStartMenu = (): void => {
        renderScreen(START_MENU);
    };

    reset = (): void => {
        renderScreen(NEW_GAME);
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
    difficulty: any;
    screen: CanvasRenderingContext2D;
    state: State;
    invaders: Invader[] = [];
    reqId = 0;
    then = Date.now();
    size: { x: number; y: number };

    constructor () {
        super();
        this.id = 'game';
        this.innerHTML = html.game();

        this.difficulty = this.getAttribute('difficulty') || 'normal';
        this.state = new State(this.difficulty);

        this.canvas = this.querySelector('#canvas');
        this.screen = this.canvas.getContext('2d');
        this.size = {
            x: this.screen.canvas.width,
            y: this.screen.canvas.height
        };
        this.invaders = createInvaders(this);
    }

    connectedCallback () {
        this.tick();
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
    }

    tick = () => {
        this.draw();
        this.reqId = window.requestAnimationFrame(this.tick);
    };

    draw = () => {
        this.screen.clearRect(0, 0, this.size.x, this.size.y);

        const now = Date.now();
        const elapsed = now - this.then;

        if (elapsed > 1500) {
            this.then = now - (elapsed % 1500);

            for (let i = 0; i < this.invaders.length; i++) {
                this.invaders[i].toggleImg();
            }
        }

        for (let i = 0; i < this.invaders.length; i++) {
            this.invaders[i].draw(this.screen);
        }
    };
}

export const renderScreen = (screen: string): any => {
    switch (screen) {
        case NEW_GAME:
            document.body.innerHTML = '<game-start></game-start>';
            break;
        case START_MENU:
            document.body.innerHTML = '<start-menu></start-menu>';
            break;
        case GAME_OVER:
            document.body.innerHTML += '<game-over></game-over>';
            break;
        default:
            throw Error('oops');
    }
};

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
        tagName: 'game-start',
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

window.addEventListener('load', () => {
    renderScreen(START_MENU);
});
