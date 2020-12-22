import { getGame, drawImg } from './app';
import { preloadImg } from './invader';
import { sleep } from './utils';
import Bullet from './bullet';

export default class Player {
    coordinates: { x: number; y: number };
    img = preloadImg('https://i.postimg.cc/X7n5n7px/player.png');
    game = getGame();
    keyboard: Keyboard;
    onCoolDown = false;

    constructor (coordinates: { x: number; y: number }) {
        this.coordinates = coordinates;
        this.keyboard = new Keyboard();
    }

    explode = () => {
        // cause explosion animation
        // pause
        this.game.removeEntity(this);
    };

    update = () => {
        if (this.keyboard.pressing.ArrowLeft && this.coordinates.x > 0) {
            this.coordinates.x -= 5;
        }
        if (this.keyboard.pressing.ArrowRight && this.coordinates.x < 1170) {
            this.coordinates.x += 5;
        }
        if (!this.onCoolDown && this.keyboard.pressing[' ']) {
            this.onCoolDown = true;
            this.game.addEntity(
                new Bullet({
                    x: this.coordinates.x,
                    y: this.coordinates.y,
                    speed: -5,
                    shooter: 'player'
                })
            );
            sleep(200).then(() => (this.onCoolDown = false));
        }
    };

    draw = () => {
        drawImg(this.game.ctx, this);
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
