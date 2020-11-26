import { columns, state, ROW_LENGTH, COLUMN_LENGTH } from './app';
import { random } from './utils';
import Invader from './invader';

const speed = {
    slow: 1500,
    normal: 1000,
    fast: 500
};

type Matrix = Invaders[][];

const createMatrix = (): Matrix => {
    const matrix: any[] = [];
    let arr;

    for (let i = 0; i < COLUMN_LENGTH - 1; i++) {
        arr = [];

        for (let j = 0; j < ROW_LENGTH; j++) {
            arr.push(new Invader(i, j));
        }

        matrix.push(arr);
    }

    return matrix;
};

class Invaders {
    matrix: Matrix = createMatrix();

    updateBottom = (): any[] => {
        return this.matrix.map(column => {
            return column[column.length - 1];
        });
    };

    randomAttack = (): void => {
        if (!state.isPaused) {
            const bottomInvaders: Invader[] = this.updateBottom();
            const idx = random(0, COLUMN_LENGTH - 2);

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
        setInterval(this.randomAttack, speed.normal);
    };

    render = (): void => {
        const cols = [...columns].slice(0, -1);
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
