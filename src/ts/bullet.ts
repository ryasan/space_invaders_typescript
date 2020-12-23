import { getGame, bullet } from './app';

type Shooter = 'player' | 'invader';

interface BulletProps {
    destination: { x: number; y: number };
    speed: number;
    shooter: Shooter;
}

export default class Bullet {
    destination: { x: number; y: number };
    speed: number;
    shooter: Shooter;
    game = getGame();

    constructor (props: BulletProps) {
        this.destination = props.destination;
        this.speed = props.speed;
        this.shooter = props.shooter;
    }

    explode = () => {
        this.game.removeEntity(this);
    };

    update = () => {
        this.destination.y += this.speed;

        if (this.destination.y > this.game.size.y || this.destination.y < 0) {
            this.game.removeEntity(this);
        }
    };

    draw = () => {
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(
            this.destination.x + 14,
            this.destination.y + 30,
            bullet.width,
            bullet.height
        );
    };
}
