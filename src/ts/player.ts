import 'regenerator-runtime/runtime';

import { drawImg, sleep, invaderDeath } from './app';
import Entity from './entity';
import Bullet from './bullet';

export default class Player extends Entity {
    keyboard = new Keyboard();
    onCoolDown = false;
    livesCount = 3;
    scoreCount = 0;
    type = 'player';

    constructor (destination: { x: number; y: number }) {
        super(destination);
        invaderDeath.subscribe(this.scorePoints);
    }

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
                new Bullet(
                    {
                        x: this.destination.x,
                        y: this.destination.y - 35
                    },
                    {
                        speed: -5,
                        shooter: 'player'
                    }
                )
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
