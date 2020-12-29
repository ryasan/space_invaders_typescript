import {
    drawImg,
    sleep,
    EntityCollection,
    ship,
    bullet,
    Destination,
    EntityType,
    showGameOver,
    shoot,
    playerKilled,
    playSound
} from './app';
import Entity from './entity';
import Bullet from './bullet';
import Subject from './observers';
import Explosion from './explosion';

export default class Player extends Entity {
    keyboard = new Keyboard();
    onCoolDown = false;
    w = ship.w;
    h = ship.h;
    collection: EntityCollection = 'ships';
    playerDeath = new Subject();

    constructor (destination: Destination) {
        super(destination);

        this.playerDeath.subscribe(
            this.destroy,
            this.playerDeath.unsubscribeAll
        );
    }

    destroy = ({ entities }: { entities: EntityType[] }) => {
        const destroyUs = [...entities, ...this.game.entity.bullets];

        playSound(playerKilled);
        destroyUs.forEach(this.game.destroyEntity);
        this.game.addEntity(new Explosion(this.destination));

        this.livesList.firstElementChild?.remove();
        if (this.livesList.childElementCount <= 0) {
            showGameOver(false);
        }

        sleep(750).then(this.game.header.pause);
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
            playSound(shoot);
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
            sleep(500).then(() => (this.onCoolDown = false));
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
