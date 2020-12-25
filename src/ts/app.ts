import State from './state';
import Subject from './observers';
import Invader from './invader';
import Player from './player';
import Bullet from './bullet';
import Header from './header';
import Explosion from './explosion';
import StartMenu, { StartMenuBtn } from './start-menu';

export type Difficulty = 'easy' | 'normal' | 'hard';

export type EntityCollection = 'ships' | 'bullets' | 'explosions';

export const ship = (() => {
    const w = 30;
    const h = 30;

    return { spriteW: 110, spriteH: 110, w: w, h: h, rX: w / 2, rY: h / 2 };
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

    return { w: w, h: h, rY: h / 2, rX: w / 2, s: 5 };
})() as {
    w: number;
    h: number;
    s: number;
    rY: number;
    rX: number;
};

export let state: State, death: Subject;

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
    death = new Subject();

    document.body.innerHTML = `<game-map />`;
};

export const loadStartMenu = () => {
    state = new State();
    document.body.innerHTML = '<start-menu />';
};

export const showGameOver = () => {
    document.body.innerHTML += '<game-over />';
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

// export const isColliding = (a: EntityType, b: EntityType) => {
//     return !(
//         a === b ||
//         a.destination.x - a.w / 2 >= b.destination.x + b.w / 2 ||
//         a.destination.y - a.h / 2 >= b.destination.y + b.h / 2 ||
//         a.destination.x + a.w / 2 <= b.destination.x - b.w / 2 ||
//         a.destination.y + a.h / 2 <= b.destination.y - b.h / 2
//     );
// };

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

export type EntityType = Player | Invader | Bullet | Explosion;

export class Game extends HTMLElement {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    header: Header;
    then = Date.now();
    reqId = 0;
    frameCount = 0;
    entity: {
        bullets: Bullet[];
        explosions: Explosion[];
        ships: (Player & Invader)[];
    };

    constructor () {
        super();
        this.initialize();
        this.id = 'game';
        this.header = document.querySelector('#header') as Header;

        this.canvas = this.querySelector('#canvas') as HTMLCanvasElement;
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
        death.subscribe(this.removeEntities, this.explode);
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

    static screen = (): { w: number; h: number } => ({
        w: Math.min(window.innerWidth - 10, 1200),
        h: Math.min(window.innerHeight - 10, 700)
    });

    initialize = () => {
        const { w, h } = Game.screen();

        this.innerHTML = `
            <top-header></top-header>
            <canvas id="canvas" width="${w}" height="${h}"></canvas>
        `;
    };

    connectedCallback () {
        this.tick();
        window.addEventListener('resize', this.initialize);
    }

    disconnectedCallback () {
        window.cancelAnimationFrame(this.reqId);
    }

    explode = (entity: EntityType) => {
        // console.log(entity.destination);
    };

    addEntity = (entity: EntityType) => {
        if (entity.collection === 'bullets') {
            this.entity[entity.collection].push(entity as any);
        }
    };

    removeEntities = (...entities: EntityType[]) => {
        entities.forEach(entity => {
            const idx = this.entity[entity.collection].indexOf(entity as any);
            if (idx !== -1) this.entity[entity.collection].splice(idx, 1);
        });
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

        bullets.forEach((bullet: Bullet) => {
            ships.forEach((ship: Player | Invader) => {
                if (isColliding(ship, bullet)) {
                    if (ship instanceof Invader) {
                        death.notify(ship, bullet);
                    }
                    if (ship instanceof Player) {
                        death.notify(ship, bullet);
                        this.header.pause();
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
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

window.addEventListener('load', loadStartMenu);
