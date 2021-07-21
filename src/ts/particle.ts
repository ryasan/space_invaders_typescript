import Entity from './entity';

import {Destination, randomInt} from './app';

export default class Particle extends Entity {
  velocity: {x: number; y: number};
  particlesPerExplosion = 20;
  particlesMinSpeed = 3;
  particlesMaxSpeed = 6;
  particleMinSize = 3;
  particleMaxSize = 6;
  size: number;

  constructor(destination: Destination) {
    super(destination);
    this.velocity = {
      x: randomInt(this.particlesMinSpeed, this.particlesMaxSpeed),
      y: randomInt(this.particlesMinSpeed, this.particlesMaxSpeed)
    };
    this.size = randomInt(this.particleMinSize, this.particleMaxSize, true);
  }

  update = () => {
    this.destination.x += this.velocity.x;
    this.destination.y += this.velocity.y;
    this.size -= 0.1;
  };

  draw = () => {
    this.game.ctx.fillStyle = '#26c6da';
    this.game.ctx.fillRect(this.destination.x, this.destination.y, this.size, this.size);
  };
}
