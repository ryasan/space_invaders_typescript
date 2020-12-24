import { drawImg, randomInt } from './app';
import Entity from './entity';
import Bullet from './bullet';

export default class Invader extends Entity {
    speed = 1;
    x = 0;
    type = 'invader';
    cycleIdx = 0;
    cycle = [
        { x: 0, y: 0 },
        { x: 0, y: 120 }
    ];

    constructor (destination: { x: number; y: number }) {
        super(destination);
    }

    update = () => {
        if (this.x < 0 || this.x > 580) {
            this.speed = -this.speed;
        }
        this.destination.x += this.speed;
        this.x += this.speed;

        // give invader a 1 to 2000 chance of shooting a bullet per frame
        if (randomInt(1, 2000) > 1999) {
            this.game.addEntity(
                new Bullet(
                    {
                        x: this.destination.x,
                        y: this.destination.y
                    },
                    {
                        speed: 5,
                        shooter: 'invader'
                    }
                )
            );
        }
    };

    draw = (frameCount: number) => {
        if (frameCount === 30) {
            this.cycleIdx = (this.cycleIdx + 1) % this.cycle.length;
        }
        drawImg(this.game.ctx, this.cycle[this.cycleIdx], this.destination);
    };
}
