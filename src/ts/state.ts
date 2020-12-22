export type Difficulty = 'easy' | 'normal' | 'hard';

export default class State {
    isPaused = true;
    difficulty: Difficulty;

    constructor (difficulty = 'normal' as Difficulty) {
        this.difficulty = difficulty;
    }

    setDifficulty = (difficulty: Difficulty) => {
        this.difficulty = difficulty;
    };

    togglePause = (): void => {
        this.isPaused = !this.isPaused;
    };

    setIsPaused = (bool: boolean): void => {
        this.isPaused = bool;
    };
}
