import 'regenerator-runtime/runtime';

window.requestAnimationFrame = (() => {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

import State from './state';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import Explosion from './explosion';
import StartMenu, { StartMenuBtn } from './start-menu';

export let state: State;

export type Difficulty = 'easy' | 'normal' | 'hard';
export type EntityCollection = 'ships' | 'bullets' | 'explosions';
export type EntityType = Player | Invader | Bullet | Explosion;
export type Destination = { x: number; y: number };
export type BulletProps = { speed: number; shooter: 'player' | 'invader' };
export type Fn = (...args: any) => any;

export const ship = {
    spriteW: 110,
    spriteH: 110,
    w: 30,
    h: 30,
    rX: 30 / 2,
    rY: 30 / 2
};

export const bullet = {
    w: 3,
    h: 6,
    rX: 3 / 2,
    rY: 6 / 2,
    s: 5
};

export const spriteSheet = Object.assign(new Image(), {
    src: 'https://i.postimg.cc/YC0dkRm8/sprite-sheet.png'
});

// prettier-ignore
export const drawImg = (ctx: CanvasRenderingContext2D, sprite: { x: number; y: number }, destination: { x: number; y: number }) => {
    ctx.drawImage(spriteSheet, sprite.x, sprite.y, ship.spriteW, ship.spriteH, destination.x, destination.y, ship.w, ship.h);
};

export const createAudio = (s: string) => new Audio(s);

export const playerKilled = createAudio('https://space-invader-sounds.s3-us-west-1.amazonaws.com/explosion.wav');
export const invaderKilled = createAudio('https://space-invader-sounds.s3-us-west-1.amazonaws.com/invaderkilled.wav');
export const shoot = createAudio('https://space-invader-sounds.s3-us-west-1.amazonaws.com/shoot.wav');

export const playSound = async (audio: HTMLMediaElement) => {
    audio.preload = 'none';
    await audio.play();
};

export const sleep = (ms = 0): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const loadGame = (difficulty = state.difficulty) => {
    state.setDifficulty(difficulty);
    state.setIsPaused(true);
    document.body.innerHTML = `<game-map />`;
};

export const loadStartMenu = () => {
    state = new State();
    document.body.innerHTML = '<start-menu />';
};

export const htmlElement = (selector: string) => {
    return document.querySelector(selector) as HTMLElement;
};

export const showCountDown = () => {
    htmlElement('#game').appendChild(new CountDown());
};

export const showGameOver = (isWinner: boolean) => {
    const game = htmlElement('#game') as Game;
    htmlElement('#game').appendChild(new GameOver(isWinner, game));
};

export const getConstructor = (e: any) => {
    return null !== e ? e.constructor : null;
};

export const isPlayer = (e: any) => {
    return getConstructor(e) === Player;
};

export const isInvader = (e: any) => {
    return getConstructor(e) === Invader;
};

export const isBullet = (e: any) => {
    return getConstructor(e) === Bullet;
};

export const randomInt = (
    min: number,
    max: number,
    positive?: boolean | undefined
) => {
    let num;

    if (!positive) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    } else {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    return num;
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
    game: Game;
    text: string;

    constructor (isWinner: boolean, game: Game) {
        super();
        this.game = game;
        this.text = isWinner ? 'YOU WIN' : 'YOU LOST';

        this.id = 'modal';
        this.innerHTML = `
            <div id="modal__inner">
                <h1 id="modal__title">${this.text}!</h1>
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
        if (!state.isPaused) this.game.header.pause();
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
        const count = htmlElement('#modal h1');

        for (let i = 3; i >= 1; i--) {
            count.textContent = i.toString();
            await sleep(1000);
        }

        if (!game.entity.ships.find(s => isPlayer(s))) {
            const player = new Player({
                x: game.canvas.width / 2,
                y: game.canvas.height - ship.h
            });
            game.addEntity(player);
        }
        this.remove();
        state.setIsPaused(false);
    };
}

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    header: Header;
    entity: Record<EntityCollection, any[]>;
    frameCount = 0;
    scoreCount = 0;
    reqId = 0;

    constructor () {
        super();
        this.innerHTML = `
            <top-header></top-header>
            <canvas
                id="canvas"
                width="${this.getSize.w}"
                height="${this.getSize.h}">
            </canvas>
        `;

        this.id = 'game';
        this.header = htmlElement('#header') as Header;
        this.canvas = htmlElement('#canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        const player = new Player({
            x: this.canvas.width / 2,
            y: this.canvas.height - ship.h - 20
        });

        this.entity = {
            bullets: [],
            explosions: [],
            ships: [...Game.createInvaders(), player]
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

    get getSize () {
        return {
            w: Math.min(window.innerWidth - 10, 1200),
            h: Math.min(window.innerHeight - 10, 700)
        };
    }

    get getEntities () {
        const entities = Object.values(this.entity);
        return entities.reduce((a: any, v: any) => {
            return [...a, ...v];
        }, []);
    }

    connectedCallback () {
        this.tick();
        window.addEventListener('resize', this.onResize);
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        const { w, h } = this.getSize;
        this.canvas.width = w;
        this.canvas.height = h;
    };

    addEntity = (e: EntityType) => {
        this.entity[e.collection].push(e as EntityType);
    };

    destroyEntity = (e: EntityType) => {
        const idx = this.entity[e.collection].indexOf(e as EntityType);
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

    update = () => {
        this.checkCollisions();
        this.getEntities.forEach((entity: EntityType) => {
            entity.update();
        });
    };

    draw = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frameCount = (this.frameCount + 1) % 60;

        this.getEntities.forEach((entity: EntityType) => {
            entity.draw(this.frameCount);
        });
    };

    checkCollisions = () => {
        const { ships, bullets } = this.entity;

        bullets.forEach((b: Bullet) => {
            ships.forEach((s: any) => {
                if (isColliding(s, b)) {
                    if (isInvader(s) && b.props.shooter === 'player') {
                        s.invaderDeath.notify({ entities: [s, b] });
                    }
                    if (isPlayer(s) && b.props.shooter === 'invader') {
                        s.playerDeath.notify({ entities: [s] });
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
