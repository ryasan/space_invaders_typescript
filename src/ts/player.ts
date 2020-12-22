import { getGame, drawImg } from './app';
import { preloadImg } from './invader';

export default class Player {
    coordinates: { x: number; y: number };
    img = preloadImg('https://i.postimg.cc/X7n5n7px/player.png');
    game = getGame();
    speed = 5;
    x: number;

    constructor (coordinates: { x: number; y: number }) {
        this.coordinates = coordinates;
        this.x = (this.game.size.x / 2) + 15; // prettier-ignore
    }

    update = () => {
        // if (this.x < 20 || this.x > 1180) {
        //     this.speed = -this.speed;
        // }
        // this.coordinates.x += this.speed;
        // this.x += this.speed;
    };

    draw = () => {
        drawImg(this.game.ctx, this);
    };
}
