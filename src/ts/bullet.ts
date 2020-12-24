import Entity from './entity';

type Shooter = 'player' | 'invader';

interface BulletProps {
    speed: number;
    shooter: Shooter;
}

export default class Bullet extends Entity {
    shooter: Shooter;
    speed: number;
    type = 'bullet';
    width = 3;
    height = 6;

    constructor (destination: { x: number; y: number }, props: BulletProps) {
        super(destination);
        this.speed = props.speed;
        this.shooter = props.shooter;
    }

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
            this.width,
            this.height
        );
    };
}
