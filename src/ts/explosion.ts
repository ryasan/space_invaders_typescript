import {EntityCollection, ship} from './app';
import Entity from './entity';

import {Destination} from './app';
import Particle from './particle';

export default class Explosion extends Entity {
  particlesPerExplosion = 20;
  particles: Particle[] = [];
  collection: EntityCollection = 'explosions';

  constructor(destination: Destination) {
    super(destination);

    for (let i = 0; i < this.particlesPerExplosion; i++) {
      const particle = new Particle({
        x: this.destination.x + ship.w / 2,
        y: this.destination.y + ship.h / 2
      });

      this.particles.push(particle);
    }
  }

  update = () => {
    if (this.particles.length === 0) {
      this.game.destroyEntity(this);
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
