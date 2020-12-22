import { getGame, state } from './app';

interface BulletProps {
    x: number;
    y: number;
    speed: number;
}

export default class Bullet {
    x: number;
    y: number;
    speed: number;
    game = getGame();

    constructor (props: BulletProps) {
        this.x = props.x;
        this.y = props.y;
        this.speed = props.speed;
    }

    update = () => {
        this.y += this.speed;
        if (this.y > this.game.size.y) {
            this.game.removeEntity(this);
        }
    };

    draw = () => {
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(this.x + 14, this.y + 30, 2, 7);
    };
}
