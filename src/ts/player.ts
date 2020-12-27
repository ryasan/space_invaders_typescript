import {
    drawImg,
    sleep,
    EntityCollection,
    ship,
    bullet,
    Destination,
    EntityType,
    playerDeath,
    showGameOver,
    shootSound,
    explosionSound
} from './app';
import Entity from './entity';
import Bullet from './bullet';

export default class Player extends Entity {
    keyboard = new Keyboard();
    onCoolDown = false;
    scoreCount = 0;
    w = ship.w;
    h = ship.h;
    collection: EntityCollection = 'ships';

    constructor (destination: Destination) {
        super(destination);
        playerDeath.subscribe(this.destroy);
    }

    explode = () => {
        console.log('explode animation');
    };

    destroy = ({ entities }: { entities: EntityType[] }) => {
        const livesList = document.querySelector('#lives-list') as HTMLElement;

        livesList.firstElementChild?.remove();
        if (livesList.childElementCount <= 0) {
            showGameOver();
        }

        this.game.header.pause();

        explosionSound.load();
        explosionSound.play();

        entities.forEach(this.game.destroyEntity);

        playerDeath.unsubscribeAll();
    };

    scorePoints = async (): Promise<void> => {
        for (let i = 1; i <= 10; i++) {
            this.scoreCount++;

            (document
                .querySelector('#score-count') as HTMLElement)
                .textContent = this.scoreCount.toString(); // prettier-ignore

            await sleep(25);
        }
    };

    update = () => {
        if (this.keyboard.pressing['ArrowLeft'] && this.destination.x > 0) {
            this.destination.x -= 5;
        }
        if (
            this.keyboard.pressing['ArrowRight'] &&
            this.destination.x < this.game.canvas.width - ship.w
        ) {
            this.destination.x += 5;
        }
        if (!this.onCoolDown && this.keyboard.pressing[' ']) {
            this.onCoolDown = true;
            shootSound.load();
            shootSound.play();
            this.game.addEntity(
                new Bullet(
                    {
                        x: this.destination.x + (ship.w / 2) - (bullet.w / 2), // prettier-ignore
                        y: this.destination.y - bullet.h
                    },
                    {
                        speed: -bullet.s,
                        shooter: 'player'
                    }
                )
            );
            sleep(200).then(() => (this.onCoolDown = false));
        }
    };

    draw = () => {
        drawImg(this.game.ctx, { x: 0, y: 240 }, this.destination);
    };
}

class Keyboard {
    pressing: any = {};

    constructor () {
        window.addEventListener('keydown', e => {
            this.pressing[e.key] = true;
        });
        window.addEventListener('keyup', e => {
            this.pressing[e.key] = false;
        });
    }
}
