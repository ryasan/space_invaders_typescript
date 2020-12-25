import { Game } from "./app";

export default class Entity {
    game = document.querySelector('#game') as Game;
    destination: { x: number; y: number };

    constructor (destination: { x: number; y: number }) {
        this.destination = destination;
    }
}
