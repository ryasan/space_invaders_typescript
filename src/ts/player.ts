import PlayerBullet from './player-bullet';
import { center, state, score, livesList } from './app';
import { rectOf, sleep } from './utils';
import { deathObserver } from './observers';

class Player {
    livesCount = 3;
    scoreCount = 0;
    x = 500;
    moveID = 0;
    node = document.createElement('div');

    bullets: PlayerBullet[] = [];
    bullet: PlayerBullet | null = null;
    onCoolDown = false;

    constructor () {
        this.node.id = 'player';
        deathObserver.subscribe(this.endGame);
    }

    die = (): void => {
        // deathObserver.notify({ livesCount: this.livesCount-- });
        this.livesCount--;
        this.node.remove();
        livesList.removeChild(livesList.childNodes[0]);
    };

    endGame = (ctx: any): void => {
        console.log(ctx);
        // do something
    };

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
            score.textContent = this.scoreCount.toString();
            await sleep(25);
        }
    };

    fire = (): void => {
        const { x, y } = rectOf(this.node);
        this.bullet = new PlayerBullet(x, y, this.bullets);
        this.bullets.push(this.bullet);
        this.update();
    };

    update = (): void => {
        if (this.bullet && !this.onCoolDown) {
            this.node.appendChild(this.bullet.element());
            this.bullet.update();
            this.onCoolDown = true;
            sleep(150).then(() => (this.onCoolDown = false));
        }
    };

    element = (): HTMLElement => {
        return this.node;
    };

    // prettier-ignore
    render = (): void => {
        livesList.innerHTML = '<div class="life"></div>'.repeat(this.livesCount);
        (document.getElementById('player-zone') as HTMLElement).appendChild(this.node)
    };
}

export default Player;
