import Invader from './invader';
import { container, columns, state, ROW_LENGTH, COLUMN_LENGTH } from './app';
import { random, rectOf } from './utils';

export let interval: number;

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
}

class Invaders {
    matrix: Matrix = createMatrix();
    invaderElements = document.getElementById('invader-column-list') as HTMLElement; // prettier-ignore
    containerDims: Dimensions;
    invaderListDims: Dimensions;
    isRight = true;
    isLeft = false;

    constructor () {
        this.containerDims = rectOf(container);
        this.invaderListDims = rectOf(this.invaderElements);
    }

    moveRight = (): void => {
        console.log('right');
    };

    moveLeft = (): void => {
        console.log('left');
    };

    moveDown = (): void => {
        console.log('down');
    };

    updateMoving = (): void => {
        if (!state.isPaused) {
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
        interval = setInterval(this.updateAttack, speed.normal);
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
