import 'regenerator-runtime/runtime';

import Player from './player';
import Invaders from './invaders';
import State, { Difficulty } from './state';
import Controls from './controls';
import Observer from './observers';

const keys = { LEFT: 37, RIGHT: 39, DOWN: 40, SPACE: 32 };

// prettier-ignore
export const COLUMN_LENGTH = 10,
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

const onKeydown = (e: KeyboardEvent): void => {
    if (!state.isPaused) {
        if (e.keyCode === keys.LEFT) player.moveLeft();
        if (e.keyCode === keys.RIGHT) player.moveRight();
        if (e.keyCode === keys.DOWN) player.stopMoving();
        if (e.keyCode === keys.SPACE) player.fire();
    }
};

class MenuButton extends HTMLElement {
    name: string;

    constructor () {
        super();

        this.name = this.getAttribute('name') as string;
        this.innerHTML = `
            <li class="menu__difficulty">
                <a>${this.name}</a>
            </li>
        `;
    }

    loadNewGame () {
        loadNewGame(this.name as Difficulty);
    }

    connectedCallback () {
        this.addEventListener('click', this.loadNewGame);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.loadNewGame);
    }
}

const components = [
    {
        tagName: 'menu-button',
        component: MenuButton
    }
];

components.forEach(c => {
    window.customElements.define(c.tagName, c.component);
});

// TODO - add control instructions to start menu
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
                    <menu-button name="easy"></menu-button>
                    <menu-button name="normal"></menu-button>
                    <menu-button name="hard"></menu-button>
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
