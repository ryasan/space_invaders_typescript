import { earth, state, player, deathObserver, BULLET_WIDTH } from './app';
import { rectOf, checkCollision } from './utils';

class InvaderBullet {
    node = document.createElement('div');
    bullets: InvaderBullet[];

    constructor (x: number, y: number, bullets: InvaderBullet[]) {
        this.node.className = 'bullet';
        this.node.style.cssText = `top: ${y - 30}px; left: ${x + BULLET_WIDTH}px`; // prettier-ignore
        this.bullets = bullets;

        deathObserver.subscribe(this.remove);
    }

    remove = (): void => {
        this.bullets.splice(this.bullets.indexOf(this), 1);
        this.node.remove();
    };

    checkForHitOnPlayer = (): void => {
        if (player.element()) {
            if (checkCollision(rectOf(this.node), rectOf(player.element()))) {
                this.remove();
                deathObserver.notify();
            }
            if (this.node.offsetTop >= earth.offsetHeight) {
                console.log('bullet destroyed');
                this.remove();
            }
        }
    };

    update = (): void => {
        if (!state.isPaused) {
            this.node.style.top = `${this.node.offsetTop + 10}px`;
            this.checkForHitOnPlayer();
        }
        requestAnimationFrame(this.update);
    };

    element = (): HTMLElement => {
        return this.node;
    };
}

export default InvaderBullet;
