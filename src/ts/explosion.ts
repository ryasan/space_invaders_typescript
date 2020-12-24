import Entity from './entity';

// class Particle {
//     x = 200;
//     y = 200;

//     draw = () => {
//         // draw particle
//     };
// }

export default class Explosion extends Entity {
    type = 'bullet';

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
