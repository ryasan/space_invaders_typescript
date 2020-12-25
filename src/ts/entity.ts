import { Game, htmlElement } from "./app";

export default class Entity {
    game = htmlElement('#game') as Game;
    destination: { x: number; y: number };

    constructor (destination: { x: number; y: number }) {
        this.destination = destination;
    }
}
