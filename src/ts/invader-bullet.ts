import { center, earth, state, player } from './app';
import { rectOf, checkCollision } from './utils';

class InvaderBullet {
    node = document.createElement('div');
    bullets: InvaderBullet[];

    constructor (bullets: InvaderBullet[]) {
        this.node.className = 'bullet';
        this.node.style.cssText = `bottom: 0; left: ${center}px`;
        this.bullets = bullets;
    }

    remove = (): void => {
        this.bullets.splice(this.bullets.indexOf(this), 1);
        this.node.remove();
    };

    checkForHitOnPlayer = (): void => {
        if (player.element()) {
            if (checkCollision(rectOf(this.node), rectOf(player.element()))) {
                this.remove();
                player.die();
            }
            if (this.node.offsetTop >= earth.offsetHeight) {
                this.remove();
            }
        }
    };

    update = (): void => {
        if (!state.isPaused) {
            this.node.style.top = `${this.node.offsetTop + 5}px`;
            this.checkForHitOnPlayer();
        }
        requestAnimationFrame(this.update);
    };

    element = (): HTMLElement => {
        return this.node;
    };
}

export default InvaderBullet;
