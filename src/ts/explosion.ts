import { EntityCollection } from './app';
import Entity from './entity';

// class Particle {
//     x = 200;
//     y = 200;

//     draw = () => {
//         // draw particle
//     };
// }

export default class Explosion extends Entity {
    collection: EntityCollection = 'explosions';
    w = 0;
    h = 0;

    constructor (destination: { x: number; y: number }) {
        super(destination);
    }

    update = () => {
        // update
    };

    draw = () => {
        // draw
    };
}
