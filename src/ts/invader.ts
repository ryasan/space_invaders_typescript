import { getGame, drawImg, randomInt, preloadImg } from './app';
import Bullet from './bullet';

export default class Invader {
    coordinates: { x: number; y: number };
    isFirstImg = true;
    images: HTMLImageElement[];
    img: HTMLImageElement;
    speed = 1;
    x = 0;
    game = getGame();

    constructor (coordinates: { x: number; y: number }) {
        this.coordinates = coordinates;

        this.images = [
            'https://i.postimg.cc/XqLd7DGJ/invader-1.png',
            'https://i.postimg.cc/59Sw3j7V/invader-2.png'
        ].map(preloadImg);
        this.img = this.images[0];
    }

    explode = () => {
        // cause explosion animation
        this.game.removeEntity(this);
    };

    update = () => {
        if (this.x < 0 || this.x > 580) {
            this.speed = -this.speed;
        }
        this.coordinates.x += this.speed;
        this.x += this.speed;

        // give invader a 1 to 2000 chance of shooting a bullet per frame
        if (randomInt(1, 2000) > 1999) {
            this.game.addEntity(
                new Bullet({
                    x: this.coordinates.x,
                    y: this.coordinates.y,
                    speed: 5,
                    shooter: 'invader'
                })
            );
        }
    };

    draw = () => {
        drawImg(this.game.ctx, this);
    };

    toggleImg = () => {
        const [Img1, Img2] = this.images;
        this.img = this.img === Img1 ? Img2 : Img1;
    };
}
