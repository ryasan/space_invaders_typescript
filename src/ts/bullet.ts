import { getGame } from './app';

type Shooter = 'player' | 'invader';

interface BulletProps {
    x: number;
    y: number;
    speed: number;
    shooter: Shooter;
}

export default class Bullet {
    x: number;
    y: number;
    speed: number;
    shooter: Shooter;
    game = getGame();

    constructor (props: BulletProps) {
        this.x = props.x;
        this.y = props.y;
        this.speed = props.speed;
        this.shooter = props.shooter;
    }

    explode = () => {
        this.game.removeEntity(this);
    };

    update = () => {
        this.y += this.speed;

        if (this.y > this.game.size.y || this.y < 0) {
            this.game.removeEntity(this);
        }
    };

    draw = () => {
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(this.x + 14, this.y + 30, 3, 6);
    };
}
