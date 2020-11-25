import 'regenerator-runtime/runtime';

import Player from './player';
import Invaders from './invaders';
import State from './state';
import Controls from './controls';

// prettier-ignore
export const LEFT_ARROW = 37,
             RIGHT_ARROW = 39,
             DOWN_ARROW = 40,
             SPACE_BAR = 32,
             SHIP_WIDTH = 90,
             BULLET_WIDTH = 6,
             COLUMN_LENGTH = 11,
             ROW_LENGTH = 5;

// prettier-ignore
export let player: Player,
           invaders: Invaders,
           state: State,
           controls: Controls,
           container: HTMLElement,
           columns: HTMLCollection,
           btnGroup: HTMLElement,
           earth: HTMLElement;

export const center = (SHIP_WIDTH / 2) - (BULLET_WIDTH / 2); // prettier-ignore

const onKeydown = (e: KeyboardEvent): void => {
    if (!state.isPaused) {
        if (e.keyCode === LEFT_ARROW) player.moveLeft();
        if (e.keyCode === RIGHT_ARROW) player.moveRight();
        if (e.keyCode === DOWN_ARROW) player.stopMoving();
        if (e.keyCode === SPACE_BAR) player.fire();
    }
};

const initHTML = () => {
    document.body.innerHTML = `
        <div id="container">
            <div id="header">
                <div id="btn-group">
                </div>
                <div id="score">
                    <span>SCORE:</span>&nbsp;<span id="score-count">0</span>
                </div>
                <div id="lives">
                    <span>LIVES:</span>
                    <ul class="lives-count"></ul>
                </div>
            </div>

            <div id="earth">
                <ul id="invader-column-list">
                    ${`<li class="invader-column"></li>`.repeat(11)}
                </ul>
                <div id="player-zone">
                    <div id="gun"></div>
                </div>
            </div>
        </div>
    `;

    container = document.getElementById('container') as HTMLElement;
    btnGroup = document.getElementById('btn-group') as HTMLElement;
    earth = document.getElementById('earth') as HTMLElement;
    columns = document.getElementsByClassName('invader-column') as HTMLCollection; // prettier-ignore
};

export const loadGame = (): void => {
    initHTML();

    state = new State();

    controls = new Controls();
    controls.renderBtns();

    invaders = new Invaders();
    invaders.render();
    invaders.update();

    player = new Player();
    player.render();
    player.update();

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('blur', controls.pause);
};

window.addEventListener('load', loadGame);
