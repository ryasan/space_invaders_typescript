import {
    drawImg,
    randomInt,
    EntityCollection,
    isColliding,
    ship,
    bullet,
    EntityType
} from './app';
import Entity from './entity';
import Bullet from './bullet';

export default class Invader extends Entity {
    speed = 1;
    x = 0;
    w = ship.w;
    h = ship.h;
    collection: EntityCollection = 'ships';
    cycleIdx = 0;
    cycle = [
        { x: 0, y: 0 },
        { x: 0, y: 120 }
    ];

    constructor (destination: { x: number; y: number }) {
        super(destination);
    }

    isBottom = (): boolean => {
        const { ships } = this.game.entity;
        const copy = {
            destination: {
                x: this.destination.x,
                y: this.destination.y + this.h + 1
            },
            w: this.w,
            h: this.h
        } as Invader;

        return ships.every((s: EntityType) => {
            return !isColliding(s, copy);
        });
    };

    update = () => {
        if (this.x < 0 || this.x > this.game.canvas.width / 2) {
            this.speed = -this.speed;
        }
        this.destination.x += this.speed;
        this.x += this.speed;

        if (this.isBottom()) {
            // 1 in 300 chance of shooting bullet
            if (randomInt(1, 300) > 299) {
                this.game.addEntity(
                    new Bullet(
                        {
                            x: this.destination.x + (this.w / 2) - (bullet.w / 2), // prettier-ignore
                            y: this.destination.y + this.h
                        },
                        {
                            speed: bullet.s
                        }
                    )
                );
            }
        }
    };

    draw = (frameCount: number) => {
        if (frameCount === 30) {
            this.cycleIdx = (this.cycleIdx + 1) % this.cycle.length;
        }
        drawImg(this.game.ctx, this.cycle[this.cycleIdx], this.destination);
    };
}
