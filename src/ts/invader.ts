import {
    drawImg,
    randomInt,
    EntityCollection,
    isColliding,
    ship,
    bullet,
    EntityType,
    Destination,
    state
} from './app';
import Entity from './entity';
import Bullet from './bullet';

export default class Invader extends Entity {
    w = ship.w;
    h = ship.h;
    x = 0;
    speed = 1;
    collection: EntityCollection = 'ships';
    cycleIdx = 0;
    cycle = [
        { x: 0, y: 0 },
        { x: 0, y: 120 }
    ];

    constructor (destination: Destination) {
        super(destination);
    }

    explode = () => {
        // boom
    };

    isBottom = (): boolean => {
        const { ships } = this.game.entity;
        const clone = {
            destination: {
                x: this.destination.x,
                y: this.destination.y + this.h + 1
            },
            w: this.w,
            h: this.h
        } as Invader;

        return ships.every((s: EntityType) => {
            return !isColliding(s, clone);
        });
    };

    bulletFrequency = (): boolean => {
        switch (state.difficulty) {
            case 'easy':
                return randomInt(1, 500) > 499;
            case 'hard':
                return randomInt(1, 100) > 99;
            default:
            case 'normal':
                return randomInt(1, 300) > 299;
        }
    };

    update = () => {
        if (this.x < 0 || this.x > this.game.canvas.width / 2) {
            this.speed = -this.speed;
        }
        this.destination.x += this.speed;
        this.x += this.speed;

        if (this.isBottom()) {
            // 1 in 300 chance of shooting bullet
            if (this.bulletFrequency()) {
                this.game.addEntity(
                    new Bullet(
                        {
                            x: this.destination.x + (this.w / 2) - (bullet.w / 2), // prettier-ignore
                            y: this.destination.y + this.h
                        },
                        {
                            speed: bullet.s,
                            shooter: 'invader'
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
