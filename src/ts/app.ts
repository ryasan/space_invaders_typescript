import State from './state';
import Subject from './observers';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import Explosion from './explosion';
import StartMenu, { StartMenuBtn } from './start-menu';

export type Difficulty = 'easy' | 'normal' | 'hard';

export const ship = {
    spriteW: 110,
    spriteH: 110,
    w: 30,
    h: 30
};

export let state: State, playerDeath: Subject, invaderDeath: Subject;

export const getGame = () => {
    return document.querySelector('#game') as Game;
};

export const sleep = (ms = 0): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomInt = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const preloadImg = (url: string) => {
    return Object.assign(new Image(), { src: url });
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
    invaderDeath = new Subject();

    document.body.innerHTML = `<game-map />`;
};

export const loadStartMenu = () => {
    state = new State();
    document.body.innerHTML = '<start-menu />';
};

export const showGameOver = () => {
    document.body.innerHTML += '<game-over />';
};

class GameOver extends HTMLElement {
    constructor () {
        super();
        this.id = 'game-over';
        this.innerHTML = `
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
    }
}

type EntityType = Player | Invader | Bullet | Explosion;

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: any;
    size: { x: number; y: number };
    then = Date.now();
    reqId = 0;
    entity: any;
    frameCount = 0;

    constructor () {
        super();
        this.innerHTML = `
            <top-header></top-header>
            <canvas id="canvas" width="1200" height="720"></canvas>
        `;
        this.id = 'game';

        this.canvas = this.querySelector('#canvas');
        this.ctx = this.canvas.getContext('2d');
        this.size = {
            x: this.ctx.canvas.width,
            y: this.ctx.canvas.height
        };

        this.entity = {
            bullets: [],
            explosions: [],
            invaders: Game.createInvaders(),
            players: [
                new Player({
                    x: this.size.x / 2,
                    y: this.size.y - ship.h
                })
            ]
        };

        invaderDeath.subscribe(this.removeEntity, this.explode);
        playerDeath.subscribe(this.removeEntity, this.explode, state.setIsPaused); // prettier-ignore
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

    // prettier-ignore
    static isColliding (a: EntityType, b: Bullet) {
        if (a && b) {
            return !(
                a.destination.x + ship.w / 2 <= b.destination.x - b.width / 2 ||
                a.destination.y + ship.h / 2 <= b.destination.y - b.height / 2 ||
                a.destination.x - ship.w / 2 >= b.destination.x + b.width / 2 ||
                a.destination.y - ship.h / 2 >= b.destination.y + b.height / 2
            );
        }

        return null;
    }

    connectedCallback () {
        this.tick();
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
    }

    explode = (entity: EntityType) => {
        console.log(entity.destination);
    };

    addEntity = (entity: EntityType) => {
        const type = entity.type + 's';
        this.entity[type].push(entity);
    };

    removeEntity = (entity: EntityType) => {
        const type: string = entity.constructor.name.toLowerCase() + 's';
        const idx = this.entity[type].indexOf(entity);

        if (idx !== -1) this.entity[type].splice(idx, 1);
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
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
        this.frameCount = (this.frameCount + 1) % 60;

        this.getEntities().forEach((entity: EntityType) => {
            entity.draw(this.frameCount);
        });
    };

    checkCollisions = () => {
        const { invaders, bullets } = this.entity;
        const [player] = this.entity.players;

        // prettier-ignore
        bullets.forEach((bullet: Bullet) => {
            invaders.forEach((invader: Invader) => {
                if (Game.isColliding(invader, bullet) && bullet.shooter === 'player') {
                    invaderDeath.notify(bullet);
                }
            });

            if (Game.isColliding(player, bullet)) {
                playerDeath.notify(player)
            }
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
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

window.addEventListener('load', loadStartMenu);
