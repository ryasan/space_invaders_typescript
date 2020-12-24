export default class Entity {
    game = document.querySelector('#game') as any;
    destination: { x: number; y: number };

    constructor (destination: { x: number; y: number }) {
        this.destination = destination;
    }
}
