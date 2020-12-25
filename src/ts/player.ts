import {
    drawImg,
    sleep,
    EntityCollection,
    ship,
    bullet,
    Destination,
    showGameOver,
    playerDeath,
    EntityType,
    htmlElement
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

        playerDeath.subscribe(
            // this.explode,
            this.destroyHTML,
            // this.destroyEntities,
            this.game.header.pause
        );
    }

    explode = () => {
        // explosion animation
    };

    destroyEntities = (props: { entities: EntityType[] }) => {        
        const [, bullet] = props.entities;
        this.game.destroyEntity(bullet);
    };

    destroyHTML = (props) => {
        // const livesList = htmlElement('#lives-list');
        console.log('test: ', props);
        // if (livesList.childElementCount > 0) {
        //     livesList.firstElementChild.remove()
        // } else {
        //     showGameOver();
        // }
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
