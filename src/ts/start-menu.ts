import { loadGame, Difficulty } from './app';

export class StartMenuBtn extends HTMLElement {
    difficulty: Difficulty;

    constructor () {
        super();
        this.difficulty = this.getAttribute('difficulty') as Difficulty;
        this.innerHTML = `
            <li class="menu__difficulty">
                <a>${this.difficulty}</a>
            </li>
        `;
    }

    loadGame = () => {
        loadGame(this.difficulty);
    };

    connectedCallback () {
        this.addEventListener('click', this.loadGame);
    }

    disconnectedCallback () {
        this.removeEventListener('click', this.loadGame);
    }
}

export default class StartMenu extends HTMLElement {
    constructor () {
        super();
        this.innerHTML = `
            <div class="menu__gif"></div>
            <h1 class="menu__title">Space Invaders</h1>
            <div class="menu__difficulty-container">
                <h3 class="difficulty__title">Select Difficulty</h3>
                <ul id="guide-list">
                    <li class="guide"><span>&#8678;</span><span>- Left</span></li>
                    <li class="guide"><span>&#8680;</span><span>- Right</span></li>
                    <li class="guide"><span>SPACEBAR</span><span>- Fire</span></li>
                </ul>
                <ul class="menu__difficulty-list">
                    <start-menu-button difficulty="easy"></start-menu-button>
                    <start-menu-button difficulty="normal"></start-menu-button>
                    <start-menu-button difficulty="hard"></start-menu-button>
                </ul>
            </div>
        `;
        this.id = 'menu';
    }
}
