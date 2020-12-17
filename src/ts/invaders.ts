import {
    columns,
    state,
    earth,
    ROW_LENGTH,
    COLUMN_LENGTH,
    SHIP_HEIGHT
} from './app';
import { random, rectOf } from './utils';
import Invader from './invader';

export const intervals = {
    attack: null as number | null,
    moveDown: null as number | null
};

const speed = {
    slow: 1500,
    normal: 1000,
    fast: 500
};

type Matrix = Invaders[][];

const createMatrix = (): Matrix => {
    const matrix: any[] = [];
    let arr;

    for (let i = 0; i < COLUMN_LENGTH; i++) {
        arr = [];

        for (let j = 0; j < ROW_LENGTH; j++) {
            arr.push(new Invader(i, j));
        }

        matrix.push(arr);
    }

    return matrix;
};

interface Dimensions {
    right: number;
    left: number;
    x: number;
    y: number;
}

const RIGHT = 'RIGHT';
const LEFT = 'LEFT';

class Invaders {
    matrix: Matrix = createMatrix();
    invaderElements = document.getElementById('invader-column-list') as HTMLElement; // prettier-ignore
    earthDims: Dimensions;
    direction = RIGHT;
    x = 0;
    y = 0;

    constructor () {
        this.earthDims = rectOf(earth);
    }

    getDimensions = (): Dimensions => {
        return rectOf(this.invaderElements);
    };

    checkWall = (): void => {
        const { right, left } = this.getDimensions();
        if (right >= this.earthDims.right) this.direction = LEFT;
        if (left <= this.earthDims.left) this.direction = RIGHT;
    };

    moveRight = (): void => {
        this.invaderElements.style.right = `${(this.x -= 1)}px`;
        this.checkWall();
    };

    moveLeft = (): void => {
        this.invaderElements.style.right = `${(this.x += 1)}px`;
        this.checkWall();
    };

    moveDown = (): void => {
        if (!state.isPaused) {
            this.invaderElements.style.top = `${(this.y += SHIP_HEIGHT)}px`;
        }
    };

    updateMoving = (): void => {
        if (!state.isPaused) {
            if (this.direction === RIGHT) this.moveRight();
            if (this.direction === LEFT) this.moveLeft();
        }

        requestAnimationFrame(this.updateMoving);
    };

    updateBottom = (): any[] => {
        return this.matrix.map(column => {
            return column[column.length - 1];
        });
    };

    updateAttack = (): void => {
        if (!state.isPaused) {
            const bottomInvaders: Invader[] = this.updateBottom();
            const idx = random(0, COLUMN_LENGTH - 1);

            if (bottomInvaders[idx]) {
                bottomInvaders[idx].fire();
            }
        }
    };

    removeInvader = (invader: Invader): void => {
        const [col, row] = invader.coordinates;

        this.matrix[col].splice(row, 1);
        invader.remove();
    };

    update = (): void => {
        this.updateMoving();
        intervals.attack = setInterval(this.updateAttack, speed.normal);
        intervals.moveDown = setInterval(this.moveDown, 10000);
    };

    render = (): void => {
        const cols = [...columns];
        let children: Element[];

        this.matrix.forEach((invaders, i) => {
            children = invaders.map((invader: any) => {
                return (invader as Invader).element();
            });

            cols[i].append(...children);
        });
    };
}

export default Invaders;
