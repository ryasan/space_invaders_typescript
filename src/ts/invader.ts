import InvaderBullet from './invader-bullet';
import { earth } from './app';
import { rectOf } from './utils';

export default class Invader {
    node = document.createElement('div');
    bullets: InvaderBullet[] = [];
    bullet: InvaderBullet | null = null;
    coordinates: [number, number];

    constructor (x: number, y: number) {
        this.node.className = 'invader';
        this.coordinates = [x, y];
    }

    remove = (): void => {
        this.element().remove();
    };

    fire = (): void => {
        const { x, y } = rectOf(this.node);
        this.bullet = new InvaderBullet(x, y, this.bullets);
        this.bullets.push(this.bullet);
        this.update();
    };

    update = (): void => {
        if (this.bullet) {
            earth.appendChild(this.bullet.element());
            this.bullet.update();
        }
    };

    element = (): HTMLElement => {
        return this.node;
    };
}
