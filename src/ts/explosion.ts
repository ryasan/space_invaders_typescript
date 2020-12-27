import { Destination, EntityCollection } from './app';
import Entity from './entity';

const randInt = (min: number, max: number, positive?: boolean | undefined) => {
    let num;
    if (positive === false) {
        num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    } else {
        num = Math.floor(Math.random() * max) + min;
    }

    return num;
};

class Particle {
    destination: Destination;
    velocity: { x: number; y: number };
    particlesMinSpeed = 3;
    particlesMaxSpeed = 6;
    particleMinSize = 1;
    particleMaxSize = 3;
    size: number;

    constructor (x: number, y: number) {
        this.destination = { x, y };
        this.velocity = {
            x: randInt(this.particleMinSize, this.particleMaxSize),
            y: randInt(this.particlesMinSpeed, this.particlesMaxSpeed)
        };
        this.size = randInt(this.particleMinSize, this.particleMaxSize, true);
    }
}

export default class Explosion extends Entity {
    collection: EntityCollection = 'explosions';
    particlesPerExplosion = 20;
    particles: Particle[] = [];
    w = 0;
    h = 0;

    constructor (destination: { x: number; y: number }) {
        super(destination);

        for (let i = 0; i < particlesPerExplosion; i++) {
            this.particles.push(new Particle(destination.x, destination.y));
        }
    }

    update = () => {
        // update
    };

    draw = () => {
        // draw
    };
}
