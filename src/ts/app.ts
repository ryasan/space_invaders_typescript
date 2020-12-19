import 'regenerator-runtime/runtime';

import Player from './player';
import Invaders from './invaders';
import State, { Difficulty } from './state';
import Controls from './controls';
import Observer from './observers';

// prettier-ignore
export const LEFT_ARROW = 37,
             RIGHT_ARROW = 39,
             DOWN_ARROW = 40,
             SPACE_BAR = 32,
             SHIP_WIDTH = 90,
             SHIP_HEIGHT = 50,
             BULLET_WIDTH = 6,
             COLUMN_LENGTH = 10,
             ROW_LENGTH = 5;

// prettier-ignore
export let player: Player,
           invaders: Invaders,
           state: State,
           controls: Controls,
           deathObserver: Observer,
           container: HTMLElement,
           columns: HTMLCollection,
           btnGroup: HTMLElement,
           earth: HTMLElement,
           score: HTMLElement,
           livesList: HTMLElement

export const center = (SHIP_WIDTH / 2) - (BULLET_WIDTH / 2); // prettier-ignore

const onKeydown = (e: KeyboardEvent): void => {
    if (!state.isPaused) {
        if (e.keyCode === LEFT_ARROW) player.moveLeft();
        if (e.keyCode === RIGHT_ARROW) player.moveRight();
        if (e.keyCode === DOWN_ARROW) player.stopMoving();
        if (e.keyCode === SPACE_BAR) player.fire();
    }
};

export const loadStartMenu = (): void => {
    document.body.innerHTML = `
        <div id="menu">
            <div class="menu__gif"></div>
            <h1 class="menu__title">
                Space Invaders
            </h1>
            <div class="menu__difficulty-container">
                <h3 class="difficulty__title">Select difficulty</h3>
                <ul class="menu__difficulty-list">
                    <li class="menu__difficulty">
                        <a data-mode="easy">Easy</a>
                    </li>
                    <li class="menu__difficulty">
                        <a data-mode="normal">Normal</a>
                    </li>
                    <li class="menu__difficulty">
                        <a data-mode="hard">Hard</a>
                    </li>
                </ul>
            </div>
        </div>
    `;

    [...document.getElementsByClassName('menu__difficulty')].forEach(node =>
        node.addEventListener('click', (e: Event) => {
            const { mode } = (e.target as HTMLElement).dataset;
            loadNewGame(mode as Difficulty);
        })
    );
};

const loadEnvironment = (): void => {
    document.body.innerHTML = `
        <div id="container">
            <div id="header">
                <div id="btn-group"></div>
                <div id="score">
                    <span>SCORE:</span>&nbsp;<span id="score-count">0</span>
                </div>
                <div id="lives">
                    <span>LIVES:</span>
                    <ul id="lives-list"></ul>
                </div>
            </div>

            <div id="earth">
                <ul id="invader-column-list">
                    ${`<li class="invader-column"></li>`.repeat(10)}
                </ul>
                <div id="player-zone"></div>
            </div>
        </div>
    `;

    columns = document.getElementsByClassName('invader-column') as HTMLCollection; // prettier-ignore
    container = document.getElementById('container') as HTMLElement;
    btnGroup = document.getElementById('btn-group') as HTMLElement;
    earth = document.getElementById('earth') as HTMLElement;
    score = document.getElementById('score-count') as HTMLElement;
    livesList = document.getElementById('lives-list') as HTMLElement;
};

export const loadGameOverModal = () => {
    container.innerHTML += `
            <div id="modal" class="modal">
                <div class="modal__inner">
                    <h1 class="modal__title">GAME OVER!</h1>
                    <button id="play-again-btn" class="btn">
                        PLAY AGAIN
                    </button>
                    <button id="main-menu-btn" class="btn">
                        MAIN MENU
                    </button>
                </div>
            </div>
        `;

    (document.getElementById('play-again-btn') as HTMLElement).addEventListener(
        'click',
        controls.reset
    );
    (document.getElementById('main-menu-btn') as HTMLElement).addEventListener(
        'click',
        loadStartMenu
    );
};

export const loadNewGame = (difficulty: Difficulty): void => {
    loadEnvironment();

    state = new State(difficulty);

    deathObserver = new Observer();

    controls = new Controls();
    controls.render();

    invaders = new Invaders();
    invaders.render();
    invaders.update();

    player = new Player();
    player.render();

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('blur', controls.pause);
};

window.addEventListener('load', loadStartMenu);
