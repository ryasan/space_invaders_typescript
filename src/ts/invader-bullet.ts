import { earth, state, player, playerDeathObserver } from './app';
import { rectOf, checkCollision } from './utils';

export default class InvaderBullet {
    node = document.createElement('div');
    bullets: InvaderBullet[];

    constructor (x: number, y: number, bullets: InvaderBullet[]) {
        this.node.className = 'bullet';
        this.node.style.cssText = `top: ${y - 30}px; left: ${x - 79}px`;
        this.bullets = bullets;

        playerDeathObserver.subscribe(this.remove);
    }

    remove = (): void => {
        this.bullets.splice(this.bullets.indexOf(this), 1);
        this.node.remove();
    };

    checkForHitOnPlayer = (): void => {
        if (player.element()) {
            if (checkCollision(rectOf(this.node), rectOf(player.element()))) {
                playerDeathObserver.notify();
            }
            if (this.node.offsetTop >= earth.offsetHeight) {
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
