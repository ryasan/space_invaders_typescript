import { getGame, drawImg } from './app';
import Bullet from './bullet';

export const preloadImg = (url: string) => {
    return Object.assign(new Image(), { src: url });
};

const [Img1, Img2] = [
    'https://i.postimg.cc/XqLd7DGJ/invader-1.png',
    'https://i.postimg.cc/59Sw3j7V/invader-2.png'
].map(preloadImg);

const randomInt = (min = 1, max = 10) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default class Invader {
    coordinates: { x: number; y: number };
    isFirstImg = true;
    img = Img1;
    speed = 1;
    x = 0;
    game = getGame();

    constructor (coordinates: { x: number; y: number }) {
        this.coordinates = coordinates;
    }

    update = () => {
        if (this.x < 0 || this.x > 580) {
            this.speed = -this.speed;
        }
        this.coordinates.x += this.speed;
        this.x += this.speed;

        // give invader a 1 to 5000 chance of shooting a bullet per frame
        if (randomInt(1, 5000) > 4999) {
            this.game.addEntity(
                new Bullet({
                    x: this.coordinates.x,
                    y: this.coordinates.y,
                    speed: 5
                })
            );
        }
    };

    draw = () => {
        drawImg(this.game.ctx, this);
    };

    toggleImg = () => {
        this.img = this.img === Img1 ? Img2 : Img1;
    };
}
