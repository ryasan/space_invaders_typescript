import { loadGameOverModal } from './app';

export type Difficulty = 'easy' | 'normal' | 'hard';

export default class State {
    isPaused = true;
    gameIsOver = false;
    difficulty: Difficulty = 'normal';
    speed = { easy: 1250, normal: 750, hard: 250 };

    constructor (difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    togglePause = (): void => {
        this.isPaused = !this.isPaused;
    };

    setIsPaused = (bool: boolean): void => {
        this.isPaused = bool;
    };

    endGame = (): void => {
        this.setIsPaused(true);
        this.gameIsOver = true;
        loadGameOverModal();
    };
}
