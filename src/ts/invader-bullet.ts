import { center, earth, state, player, SHIP_HEIGHT } from './app';
import { rectOf, checkCollision } from './utils';

class InvaderBullet {
    node = document.createElement('div');
    bullets: InvaderBullet[];
    y: number;
    x: number;

    constructor (x: number, y: number, bullets: InvaderBullet[]) {
        this.node.className = 'bullet';
        this.node.style.cssText = `top: ${y + SHIP_HEIGHT}px; left: ${x + center}px`; // prettier-ignore
        this.bullets = bullets;
        this.x = x;
        this.y = y;
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
            if (this.y >= earth.offsetHeight + SHIP_HEIGHT) {
                this.remove();
            }
        }
    };

    update = (): void => {
        if (!state.isPaused) {
            this.node.style.top = `${(this.y += 10)}px`;
            this.checkForHitOnPlayer();
        }
        requestAnimationFrame(this.update);
    };

    element = (): HTMLElement => {
        return this.node;
    };
}

export default InvaderBullet;
