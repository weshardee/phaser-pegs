import {
    EMPTY,
} from './constants';

export default class Grid {
    constructor(size) {
        this.size = size;
        this.rows = new Array(size);

        for (let y = 0; y < size; y++) {
            const row = new Array(y + 1);
            row.fill(EMPTY);
            this.rows[y] = row;
        }

        this.log();
    }

    [Symbol.iterator]() {
        let x = 0;
        let y = 0;

        return {
            next: () => {
                const done = y === this.size;
                const id = done ? undefined : this.rows[y][x];
                const value = { x, y, id };

                if (x === y) {
                    x = 0;
                    y++;
                } else {
                    x++;
                }

                return { value, done };
            },
        };
    }

    getPosition(x, y) {
        return this.rows[y][x];
    }

    setPosition(x, y, value) {
        this.rows[y][x] = value;
    }

    log() {
        for (let y = 0; y < this.size; y++) {
            console.log(this.rows[y]);
        }
    }

}
