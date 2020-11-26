import InvaderBullet from './invader-bullet';

class Invader {
    node = document.createElement('div');
    bullets: InvaderBullet[] = [];
    bullet: InvaderBullet | null = null;
    coordinates: [number, number];

    constructor (numA: number, numB: number) {
        this.node.className = 'invader';
        this.coordinates = [numA, numB];
    }

    remove = (): void => {
        this.element().remove();
    };

    fire = (): void => {
        this.bullet = new InvaderBullet(this.bullets);
        this.bullets.push(this.bullet);
        this.update();
    };

    update = (): void => {
        if (this.bullet) {
            this.node.appendChild(this.bullet.element());
            this.bullet.update();
        }
    };

    element = (): HTMLElement => {
        return this.node;
    };
}

export default Invader;
