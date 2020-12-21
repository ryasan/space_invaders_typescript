import { Game } from './app';

interface Coordinates {
    x: number;
    y: number;
}

export default class Invader {
    constructor (game: Game, coordinates: Coordinates) {
        const { x, y } = coordinates;
        const img = new Image();
        
        // eslint-disable-next-line
        img.src = 'https://i.postimg.cc/XqLd7DGJ/invader-1.png';
        img.onload = () => {
            game.ctx.fillStyle = 'white';
            game.ctx.drawImage(img, x, y, 35, 35);
        };
    }
}
