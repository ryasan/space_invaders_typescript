import { EntityCollection, ship } from './app';
import Entity from './entity';

import { Destination } from './app';
import Particle from './particle';

export default class Explosion extends Entity {
    collection: EntityCollection = 'explosions';
    particlesPerExplosion = 20;
    particles: Particle[] = [];
    w = 0;
    h = 0;

    constructor (destination: Destination) {
        super(destination);

        for (let i = 0; i < this.particlesPerExplosion; i++) {
            this.particles.push(
                new Particle({
                    x: this.destination.x + ship.w / 2,
                    y: this.destination.y + ship.h / 2
                })
            );
        }
    }

    destroy = () => {
        this.game.destroyEntity(this);
    };

    update = () => {
        if (this.particles.length === 0) {
            this.destroy();
            return;
        }

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update();
        }
    };

    draw = () => {
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            if (particle.size <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            particle.draw();
        }
    };
}
