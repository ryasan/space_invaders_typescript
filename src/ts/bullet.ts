import { EntityCollection, Destination } from './app';
import Entity from './entity';

type BulletProps = {
    speed: number;
    shooter: 'player' | 'invader';
};

export default class Bullet extends Entity {
    collection: EntityCollection = 'bullets';
    props: BulletProps;
    w = 3;
    h = 6;

    constructor (destination: Destination, props: BulletProps) {
        super(destination);
        this.props = props;
    }

    update = () => {
        this.destination.y += this.props.speed;
        if (
            this.destination.y > this.game.canvas.height ||
            this.destination.y < 0
        ) {
            this.game.destroyEntity(this);
        }
    };

    draw = () => {
        this.game.ctx.fillStyle = 'white';
        this.game.ctx.fillRect(
            this.destination.x,
            this.destination.y,
            this.w,
            this.h
        );
    };
}
