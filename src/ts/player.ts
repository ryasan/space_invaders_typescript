import 'regenerator-runtime/runtime';

import { getGame, drawImg, state, sleep } from './app';
import Bullet from './bullet';

export default class Player {
    destination: { x: number; y: number };
    game = getGame();
    keyboard: Keyboard;
    onCoolDown = false;
    livesCount = 3;
    scoreCount = 0;

    constructor (destination: { x: number; y: number }) {
        this.destination = destination;
        this.keyboard = new Keyboard();
    }

    explode = () => {
        // cause explosion animation
        // pause
        state.setIsPaused(true);
        this.game.removeEntity(this);
    };

    scorePoints = async (): Promise<void> => {
        for (let i = 1; i <= 10; i++) {
            this.scoreCount++;
            await sleep(25);
        }
    };

    update = () => {
        if (this.keyboard.pressing['ArrowLeft'] && this.destination.x > 0) {
            this.destination.x -= 5;
        }
        if (this.keyboard.pressing['ArrowRight'] && this.destination.x < 1170) {
            this.destination.x += 5;
        }
        if (!this.onCoolDown && this.keyboard.pressing[' ']) {
            this.onCoolDown = true;
            this.game.addEntity(
                new Bullet({
                    speed: -5,
                    shooter: 'player',
                    destination: {
                        x: this.destination.x,
                        y: this.destination.y - 35
                    }
                })
            );
            sleep(200).then(() => (this.onCoolDown = false));
        }
    };

    draw = () => {
        drawImg(this.game.ctx, { x: 0, y: 240 }, this.destination);
    };
}

class Keyboard {
    pressing: any = {};

    constructor () {
        window.addEventListener('keydown', e => {
            this.pressing[e.key] = true;
        });
        window.addEventListener('keyup', e => {
            this.pressing[e.key] = false;
        });
    }
}
