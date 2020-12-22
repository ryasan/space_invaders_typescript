import State from './state';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import StartMenu, { StartMenuBtn } from './start-menu';

export let state: State;

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

// prettier-ignore
export const drawImg = (ctx: CanvasRenderingContext2D, body: Invader | Player) => {
    ctx.drawImage(body.img, body.coordinates.x, body.coordinates.y, 30, 30);
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

export const showGameOver = () => {
    document.body.innerHTML += '<game-over />';
};

export type Difficulty = 'easy' | 'normal' | 'hard';

type Entity = Player | Invader | Bullet;

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

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: any;
    size: { x: number; y: number };
    then = Date.now();
    reqId = 0;
    entity: any;

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
            invaders: Game.createInvaders(),
            players: [
                new Player({
                    x: this.size.x / 2,
                    y: this.size.y - 30
                })
            ]
        };
    }

    static createInvaders = (): Invader[] => {
        const invaders: Invader[] = [];

        for (let i = 0; i < 60; i++) {
            const x = 20 + (i % 12) * 50;
            const y = 20 + (i % 5) * 50;
            invaders.push(new Invader({ x, y }));
        }

        return invaders;
    };

    static isColliding = (a: Player | Invader, b: Bullet) => {
        if (a && b) {
            return !(
                a.coordinates.x + 30 / 2 <= b.x - 3 / 2 ||
                a.coordinates.y + 30 / 2 <= b.y - 6 / 2 ||
                a.coordinates.x - 30 / 2 >= b.x + 3 / 2 ||
                a.coordinates.y - 30 / 2 >= b.y + 6 / 2
            );
        }
    };

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

        if (intervalReached) this.then = now - (elapsed % 1000);

        this.getEntities().forEach((entity: Entity) => {
            entity.draw();
            if (intervalReached && entity instanceof Invader) {
                entity.toggleImg();
            }
        });
    };

    checkCollisions = () => {
        const { invaders, bullets } = this.entity;
        const [player] = this.entity.players;

        // prettier-ignore
        bullets.forEach((bullet: Bullet) => {
            invaders.forEach((invader: Invader) => {
                if (Game.isColliding(invader, bullet) && bullet.shooter === 'player') {
                    // remove bullet
                    // explode invader
                    // score points
                    invader.explode();
                    this.removeEntity(bullet);
                }
                if (Game.isColliding(player, bullet)) {
                    player.explode();
                    this.removeEntity(bullet);
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
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

window.addEventListener('load', loadStartMenu);
