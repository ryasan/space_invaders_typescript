export type Difficulty = 'easy' | 'normal' | 'hard';

class State {
    isPaused = true;
    gameIsOver = false;
    difficulty: Difficulty = 'normal';
    speed = {
        easy: 1250,
        normal: 750,
        hard: 250
    };

    constructor (difficulty: Difficulty) {
        this.difficulty = difficulty;
    }

    togglePause = (): void => {
        this.isPaused = !this.isPaused;
    };

    setPause = (bool: boolean): void => {
        this.isPaused = bool;
    };

    setGameIsOver = (bool: boolean): void => {
        this.setPause(bool);
        this.gameIsOver = bool;
    };
}

export default State;
