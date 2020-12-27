const randInt = (min: number, max: number, positive: boolean | undefined) => {
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
    particlesPerExplosion = 20;
    particlesMinSpeed = 3;
    particlesMaxSpeed = 6;
    particleMinSize = 1;
    particleMaxSize = 3;

    constructor (x: number, y: number) {
        this.destination = { x, y };
        this.velocity = {
            x: randInt(this.particleMinSize),

        };
    }
}
