import PlayerBullet from './player-bullet';
import { center, state } from './app';
import { sleep } from './utils';

class Player {
    lives = 3;
    scoreCount = 0;
    x = 500;
    moveID = 0;
    node = document.createElement('div');
    score = document.getElementById('score-count') as HTMLElement;
    gun = document.getElementById('gun') as HTMLElement;
    bullets: PlayerBullet[] = [];
    bullet: PlayerBullet | null = null;

    constructor () {
        this.node.id = 'player';
    }

    moveLeft = (): void => {
        this.stopMoving();
        if (this.node.offsetLeft > 0 && !state.isPaused) {
            this.node.style.left = `${(this.x -= 5)}px`;
            this.moveID = requestAnimationFrame(this.moveLeft);
        }
    };

    moveRight = (): void => {
        this.stopMoving();
        if (this.node.offsetLeft < 1010 && !state.isPaused) {
            this.node.style.left = `${(this.x += 5)}px`;
            this.moveID = requestAnimationFrame(this.moveRight);
        }
    };

    stopMoving = (): void => {
        if (this.moveID) cancelAnimationFrame(this.moveID);
    };

    scorePoints = async (): Promise<void> => {
        for (let i = 1; i <= 10; i++) {
            this.scoreCount++;
            this.score.textContent = this.scoreCount.toString();
            await sleep(25);
        }
    };

    fire = (): void => {
        const x = this.node.offsetLeft + center;
        this.bullet = new PlayerBullet(x, this.bullets);
        this.bullets.push(this.bullet);
        this.update();
    };

    update = (): void => {
        if (this.bullet) {
            this.gun.appendChild(this.bullet.element());
            this.bullet.update();
        }
    };

    element = (): HTMLElement => {
        return this.node;
    };

    render = (): void => {
        (document.getElementById('player-zone') as HTMLElement).appendChild(this.node) // prettier-ignore
    };
}

export default Player;
