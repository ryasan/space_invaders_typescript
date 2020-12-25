import { EntityCollection } from './app';
import Entity from './entity';

export default class Bullet extends Entity {
    speed: number;
    collection: EntityCollection = 'bullets';
    w = 3;
    h = 6;

    constructor (
        destination: { x: number; y: number },
        props: { speed: number }
    ) {
        super(destination);
        this.speed = props.speed;
    }

    update = () => {
        this.destination.y += this.speed;
        if (this.destination.y > this.game.canvas.height || this.destination.y < 0) {
            this.game.removeEntities(this);
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
