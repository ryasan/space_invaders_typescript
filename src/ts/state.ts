export type Difficulty = 'easy' | 'normal' | 'hard';

export default class State {
    isPaused = true;
    difficulty: Difficulty;
    gameIsOver = false;

    constructor (difficulty = 'normal' as Difficulty) {
        this.difficulty = difficulty;
    }

    setDifficulty = (difficulty: Difficulty) => {
        this.difficulty = difficulty;
    };

    setIsPaused = (bool = true): void => {
        this.isPaused = bool;
    };
}
