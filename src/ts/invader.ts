import { Game } from './app';
import Img1 from '../images/invader-1.png';
import Img2 from '../images/invader-2.png';

interface Coordinates {
    x: number;
    y: number;
}

export default class Invader {
    constructor (game: Game, coordinates: Coordinates, isFirstImg: boolean) {
        const { x, y } = coordinates;
        const img = new Image();

        img.src = isFirstImg ? Img1 : Img2;

        img.onload = () => {
            game.ctx.fillStyle = 'white';
            game.ctx.drawImage(img, x, y, 30, 30);
        };
    }
}
