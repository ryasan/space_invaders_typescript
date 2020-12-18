interface Speed {
    slow: number;
    normal: number;
    fast: number;
}

const speed: Speed = {
    slow: 1250,
    normal: 750,
    fast: 250
};

class State {
    isPaused = true;
    gameIsOver = false;
    difficulty = speed.normal;

    constructor (difficulty: keyof Speed) {
        this.difficulty = speed[difficulty];
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
