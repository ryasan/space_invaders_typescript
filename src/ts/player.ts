import { getGame, drawImg } from './app';
import { preloadImg } from './invader';

export default class Player {
    coordinates: { x: number; y: number };
    img = preloadImg('https://i.postimg.cc/X7n5n7px/player.png');
    game = getGame();
    x: number;
    keyboard: Keyboard;

    constructor (coordinates: { x: number; y: number }) {
        this.coordinates = coordinates;
        this.x = (this.game.size.x / 2) + 15; // prettier-ignore
        this.keyboard = new Keyboard();
    }

    update = () => {
        if (this.keyboard.pressed.ArrowLeft && this.coordinates.x > 0) {
            this.coordinates.x -= 5;
        }
        if (this.keyboard.pressed.ArrowRight && this.coordinates.x < 1170) {
            this.coordinates.x += 5;
        }
    };

    draw = () => {
        drawImg(this.game.ctx, this);
    };
}

class Keyboard {
    pressed: any = {};

    constructor () {
        window.addEventListener('keydown', e => {
            this.pressed[e.key] = true;
        });
        window.addEventListener('keyup', e => {
            this.pressed[e.key] = false;
        });
    }
}
