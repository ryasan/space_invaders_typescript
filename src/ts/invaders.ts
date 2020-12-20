import { columns, state, earth, ROW_LENGTH, COLUMN_LENGTH } from './app';
import { random, rectOf } from './utils';
import Invader from './invader';

// TODO - Add game ender when invaders reach bottom

export const intervals = {
    attack: null as number | null,
    moveDown: null as number | null
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

export default class Invaders {
    matrix: Matrix = createMatrix();
    invaderElements = document.getElementById('invader-column-list') as HTMLElement; // prettier-ignore
    earthDims: Dimensions;
    direction = RIGHT;
    x = 0;
    y = 0;
    // indices = Array.from(Array(columns.length).keys());

    constructor () {
        this.earthDims = rectOf(earth);
        // console.log(this.indices);
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
            this.invaderElements.style.top = `${(this.y += 50)}px`;
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

            if (columns[idx].hasChildNodes()) {
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
        intervals.attack = setInterval(this.updateAttack, state.speed[state.difficulty]); // prettier-ignore
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
