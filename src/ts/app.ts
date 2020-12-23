import State from './state';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import StartMenu, { StartMenuBtn } from './start-menu';
import Explosion from './explosion';

const spriteSheet = Object.assign(new Image(), {
    src: 'https://i.postimg.cc/YC0dkRm8/sprite-sheet.png'
});

export const ship = {
    spriteWidth: 110,
    spriteHeight: 110,
    width: 30,
    height: 30
};
export const bullet = { width: 3, height: 6 };

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

export const drawImg = (
    ctx: CanvasRenderingContext2D,
    sprite: { x: number; y: number },
    destination: { x: number; y: number }
) => {
    ctx.drawImage(
        spriteSheet,
        sprite.x,
        sprite.y,
        ship.spriteWidth,
        ship.spriteHeight,
        destination.x,
        destination.y,
        ship.width,
        ship.height
    );
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

type Entity = Player | Invader | Bullet | Explosion;

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
                    y: this.size.y - ship.height
                })
            ]
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

    // prettier-ignore
    static isColliding (a: Player | Invader, b: Bullet) {
        if (a && b) {
            return !(
                a.destination.x + ship.width / 2 <= b.destination.x - bullet.width / 2 ||
                a.destination.y + ship.height / 2 <= b.destination.y - bullet.height / 2 ||
                a.destination.x - ship.width / 2 >= b.destination.x + bullet.width / 2 ||
                a.destination.y - ship.height / 2 >= b.destination.y + bullet.height / 2
            );
        }
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
        this.frameCount = (this.frameCount + 1) % 60;

        this.getEntities().forEach((entity: Entity) => {
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
