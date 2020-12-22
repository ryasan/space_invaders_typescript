import State, { Difficulty } from './state';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';

export let state: State;

// prettier-ignore
export const drawImg = (ctx: CanvasRenderingContext2D, body: Invader | Player) => {
    ctx.drawImage(body.img, body.coordinates.x, body.coordinates.y, 30, 30);
};

export const getGame = () => {
    return document.querySelector('#game') as Game;
};

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
    controlBtns: any;
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

const isColliding = (a: Player | Invader, b: Bullet) => {
    return !(
        a.coordinates.x + 30 / 2 <= b.x - 3 / 2 ||
        a.coordinates.y + 30 / 2 <= b.y - 6 / 2 ||
        a.coordinates.x - 30 / 2 >= b.x + 3 / 2 ||
        a.coordinates.y - 30 / 2 >= b.y + 6 / 2
    );
};

const createInvaders = (): Invader[] => {
    const invaders: Invader[] = [];

    for (let i = 0; i < 60; i++) {
        const x = 20 + (i % 12) * 50;
        const y = 20 + (i % 5) * 50;
        invaders.push(new Invader({ x, y }));
    }

    return invaders;
};

type Entity = Player | Invader | Bullet;

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: any;
    size: { x: number; y: number };
    then = Date.now();
    reqId = 0;
    entity: any;

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

        this.entity = {
            bullets: [],
            invaders: createInvaders(),
            players: [new Player({ x: this.size.x / 2, y: this.size.y - 30 })]
        };
    }

    connectedCallback () {
        this.tick();
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
    }

    addEntity = (entity: Entity) => {
        const type: any = entity.constructor.name.toLowerCase() + 's';
        this.entity[type].push(entity);
    };

    removeEntity = (entity: Entity) => {
        const type: any = entity.constructor.name.toLowerCase() + 's';
        const idx = this.entity[type].indexOf(entity);

        if (idx !== -1) {
            this.entity[type].splice(idx, 1);
        }
    };

    checkCollisions = () => {
        const { invaders, bullets } = this.entity;

        // prettier-ignore
        invaders.forEach((invader: Invader) => {
            bullets.forEach((bullet: Bullet) => {
                if (isColliding(invader, bullet) && bullet.shooter === 'player') {
                    invader.explode();
                    this.removeEntity(bullet);
                }
            });
        });
    };

    tick = () => {
        if (!state.isPaused) this.update();
        this.draw();

        this.reqId = window.requestAnimationFrame(this.tick);
    };

    getEntities = (): any => {
        return Object.values(this.entity).reduce((a: any, v: any) => {
            return [...a, ...v];
        }, []);
    };

    update = () => {
        this.checkCollisions();
        this.getEntities().forEach((entity: Entity) => {
            entity.update();
        });
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

        this.getEntities().forEach((entity: Entity) => {
            entity.draw();
            if (intervalReached && entity instanceof Invader) {
                entity.toggleImg();
            }
        });
    };
}

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

window.addEventListener('load', loadStartMenu);
