import 'regenerator-runtime/runtime';

import State from './state';
import Subject from './observers';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import Explosion from './explosion';
import StartMenu, { StartMenuBtn } from './start-menu';

export const [explosionSound, invaderKilledSound, shootSound] = [
    'https://space-invader-sounds.s3-us-west-1.amazonaws.com/explosion.wav',
    'https://space-invader-sounds.s3-us-west-1.amazonaws.com/invaderkilled.wav',
    'https://space-invader-sounds.s3-us-west-1.amazonaws.com/shoot.wav'
].map(s => new Audio(s));

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EntityCollection = 'ships' | 'bullets' | 'explosions';

export const ship = (() => {
    const w = 30;
    const h = 30;

    return {
        spriteW: 110,
        spriteH: 110,
        w: w,
        h: h,
        rX: w / 2,
        rY: h / 2
    };
})() as {
    spriteW: number;
    spriteH: number;
    w: number;
    h: number;
    rX: number;
    rY: number;
};

export const bullet = (() => {
    const w = 3;
    const h = 6;

    return {
        w: w,
        h: h,
        rY: h / 2,
        rX: w / 2,
        s: 5
    };
})() as {
    w: number;
    h: number;
    s: number;
    rY: number;
    rX: number;
};

export let state: State, playerDeath: Subject;

export const sleep = (ms = 0): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomInt = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const htmlElement = (selector: string) => {
    return document.querySelector(selector) as HTMLElement;
};

const spriteSheet = Object.assign(new Image(), {
    src: 'https://i.postimg.cc/YC0dkRm8/sprite-sheet.png'
});

export const drawImg = (
    ctx: CanvasRenderingContext2D,
    sprite: { x: number; y: number },
    destination: { x: number; y: number }
) => {
    ctx.drawImage(
        spriteSheet,
        sprite.x,
        sprite.y,
        ship.spriteW,
        ship.spriteH,
        destination.x,
        destination.y,
        ship.w,
        ship.h
    );
};

export const loadGame = (difficulty = state.difficulty) => {
    state.setDifficulty(difficulty);
    state.setIsPaused(true);
    playerDeath = new Subject();

    document.body.innerHTML = `<game-map />`;
};

export const loadStartMenu = () => {
    state = new State();
    document.body.innerHTML = '<start-menu />';
};

export const showCountDown = () => {
    (htmlElement('#game') as Game).appendChild(new CountDown());
};

export const showGameOver = () => {
    (htmlElement('#game') as Game).appendChild(new GameOver());
};

export const isColliding = (a: EntityType, b: EntityType) => {
    return !!(
        a !== b &&
        a.destination.x + a.w > b.destination.x &&
        a.destination.x < b.destination.x + b.w &&
        a.destination.y + a.h > b.destination.y &&
        a.destination.y < b.destination.y + b.h
    );
};

class GameOver extends HTMLElement {
    playAgainBtn: HTMLElement;
    mainMenuBtn: HTMLElement;

    constructor () {
        super();
        this.id = 'modal';
        this.innerHTML = `
            <div id="modal__inner">
                <h1 id="modal__title">GAME OVER!</h1>
                <button id="play-again-btn" class="btn">
                    PLAY AGAIN
                </button>
                <button id="main-menu-btn" class="btn">
                    MAIN MENU
                </button>
            </div>
        `;

        this.playAgainBtn = this.querySelector('#play-again-btn') as HTMLElement; // prettier-ignore
        this.mainMenuBtn = this.querySelector('#main-menu-btn') as HTMLElement;
    }

    connectedCallback () {
        this.playAgainBtn.addEventListener('click', () => loadGame());
        this.mainMenuBtn.addEventListener('click', () => loadStartMenu());
    }

    disconnectedCallback () {
        this.playAgainBtn.removeEventListener('click', () => loadGame());
        this.mainMenuBtn.removeEventListener('click', () => loadStartMenu());
    }
}

class CountDown extends HTMLElement {
    constructor () {
        super();
        this.id = 'modal';
        this.innerHTML = `
            <div id="modal__inner">
                <h1 id="modal__title">3</h1>
            </div>
        `;
    }

    connectedCallback () {
        this.startCountDown();
    }

    startCountDown = async (): Promise<void> => {
        const game = htmlElement('#game') as Game;

        for (let i = 3; i >= 1; i--) {
            // prettier-ignore
            (game
                .querySelector('#modal h1') as HTMLElement)
                .textContent = i.toString();
            await sleep(1000);
        }

        if (!game.entity.ships.find(s => s instanceof Player)) {
            game.addEntity(
                new Player({
                    x: game.canvas.width / 2,
                    y: game.canvas.height - ship.h
                })
            );
        }

        this.remove();
        state.setIsPaused(false);
    };
}

export type Destination = { x: number; y: number };

export type EntityType = Player | Invader | Bullet | Explosion;

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    header: Header;
    reqId = 0;
    frameCount = 0;
    entity: {
        bullets: Bullet[];
        explosions: Explosion[];
        ships: (Player & Invader)[];
    };

    constructor () {
        super();
        this.innerHTML = `
            <top-header></top-header>
            <canvas
                id="canvas"
                width="${this.getSize().w}"
                height="${this.getSize().h}">
            </canvas>
        `;

        this.id = 'game';
        this.header = htmlElement('#header') as Header;
        this.canvas = htmlElement('#canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.entity = {
            bullets: [],
            explosions: [],
            ships: [
                ...Game.createInvaders(),
                new Player({
                    x: this.canvas.width / 2,
                    y: this.canvas.height - ship.h
                })
            ] as (Player & Invader)[]
        };
    }

    static createInvaders (): Invader[] {
        const invaders: Invader[] = [];

        for (let i = 0; i < 60; i++) {
            const x = 20 + (i % 12) * 50;
            const y = 20 + (i % 5) * 50;
            invaders.push(new Invader({ x, y }));
        }

        return invaders;
    }

    connectedCallback () {
        this.tick();
        window.addEventListener('resize', this.onResize);
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
        window.removeEventListener('resize', this.onResize);
    }

    getSize = () => {
        return {
            w: Math.min(window.innerWidth - 10, 1200),
            h: Math.min(window.innerHeight - 10, 700)
        };
    };

    onResize = () => {
        const { w, h } = this.getSize();
        this.canvas.width = w;
        this.canvas.height = h;
    };

    addEntity = (e: EntityType) => {
        this.entity[e.collection].push(e as any);
    };

    destroyEntity = (e: EntityType) => {
        const idx = this.entity[e.collection].indexOf(e as any);
        if (idx !== -1) {
            this.entity[e.collection].splice(idx, 1);
        }
    };

    tick = () => {
        if (!state.isPaused) {
            this.update();
            this.draw();
        } else {
            this.draw();
        }

        this.reqId = window.requestAnimationFrame(this.tick);
    };

    getEntities = (): any => {
        return Object.values(this.entity).reduce((a: any, v: any) => {
            return [...a, ...v];
        }, []);
    };

    update = () => {
        this.checkCollisions();
        this.getEntities().forEach((entity: EntityType) => {
            entity.update();
        });
    };

    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frameCount = (this.frameCount + 1) % 60;

        this.getEntities().forEach((entity: EntityType) => {
            entity.draw(this.frameCount);
        });
    };

    checkCollisions = () => {
        const { ships, bullets } = this.entity;

        bullets.forEach((b: Bullet) => {
            ships.forEach((s: Player | Invader) => {
                if (isColliding(s, b)) {
                    if (s instanceof Invader && b.props.shooter === 'player') {
                        [s, b].forEach(this.destroyEntity);
                        s.explode();
                    }
                    if (s instanceof Player && b.props.shooter === 'invader') {
                        playerDeath.notify({ entities: [s, b] });
                    }
                }
            });
        });
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
    },
    {
        tagName: 'count-down',
        component: CountDown
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

window.addEventListener('load', loadStartMenu);
