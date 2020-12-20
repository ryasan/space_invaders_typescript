import { earth, state, player, invaders, invaderDeathObserver } from './app';
import { rectOf, checkCollision } from './utils';

export default class PlayerBullet {
    node = document.createElement('div');
    bullets: PlayerBullet[];

    constructor (x: number, bullets: PlayerBullet[]) {
        this.node.className = 'bullet';
        this.node.style.cssText = `bottom: 40px; left: ${x - 80}px`; // prettier-ignore
        this.bullets = bullets;

        invaderDeathObserver.subscribe(this.remove)
    }

    remove = (): void => {
        this.bullets.splice(this.bullets.indexOf(this), 1);
        this.node.remove();
    };

    checkForHitOnInvader = (): void => {
        const rect1 = rectOf(this.node);
        let invader: any;

        for (const i in invaders.matrix) {
            for (const j in invaders.matrix) {
                invader = invaders.matrix[i][j];
                const rect2 = invader ? rectOf(invader.element()) : null;

                // prettier-ignore
                if (invader && checkCollision(rect1, rect2)) {
                    this.remove();
                    player.scorePoints();
                    invaders.removeInvader({ invader });
                    // invaderDeathObserver.notify({ invader });
                }
                if (this.node.offsetTop <= -earth.offsetHeight) {
                    this.remove();
                }
            }
        }
    };

    update = (): void => {
        if (!state.isPaused) {
            this.node.style.top = `${this.node.offsetTop - 10}px`;
            this.checkForHitOnInvader();
        }

        requestAnimationFrame(this.update);
    };

    element = (): HTMLElement => {
        return this.node;
    };
}
