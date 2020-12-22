import { Game } from './app';

const preloadImg = (url: string) => {
    return Object.assign(new Image(), { src: url });
};

const [Img1, Img2] = [
    'https://i.postimg.cc/XqLd7DGJ/invader-1.png',
    'https://i.postimg.cc/59Sw3j7V/invader-2.png'
].map(preloadImg);

interface Coordinates {
    x: number;
    y: number;
}

export default class Invader {
    game: Game;
    coordinates: Coordinates;
    img = Img1;
    isFirstImg = true;
    x = 0;
    speed = 1;

    constructor (game: Game, coordinates: Coordinates) {
        this.game = game;
        this.coordinates = coordinates;
    }

    update = () => {
        if (this.x < 0 || this.x > 580) {
            this.speed = -this.speed;
        }
        this.coordinates.x += this.speed;
        this.x += this.speed;
    };

    draw = () => {
        drawInvader(this.game.ctx, this);
    };

    toggleImg = () => {
        this.isFirstImg = !this.isFirstImg;
        this.img = this.isFirstImg ? Img1 : Img2;
    };
}

const drawInvader = function (ctx: CanvasRenderingContext2D, body: Invader) {
    ctx.drawImage(body.img, body.coordinates.x, body.coordinates.y, 30, 30);
};
