import { Game } from './app';
import Img1 from '../images/invader-1.png';
import Img2 from '../images/invader-2.png';

interface Coordinates {
    x: number;
    y: number;
}

export default class Invader {
    img = new Image();
    game: Game;
    center: Coordinates;
    isFirstImg = true;

    constructor (game: Game, center: Coordinates) {
        this.game = game;
        this.center = center;
        this.img.src = Img1;
    }

    draw = () => {
        drawRect(this.game.ctx, this);
        // this.img.src = this.isFirstImg ? Img1 : Img2;
        // this.img.onload = () => {
        //     const { x, y } = this.coordinates;
        //     this.game.screen.drawImage(this.img, x, y, 30, 30);
        // };
    };

    toggleImg = () => {
        this.isFirstImg = !this.isFirstImg;
        this.img.src = this.isFirstImg ? Img1 : Img2;
    };
}

const drawRect = function (ctx: CanvasRenderingContext2D, body: Invader) {
    ctx.drawImage(body.img, body.center.x, body.center.y, 30, 30);
};
