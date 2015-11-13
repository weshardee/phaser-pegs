import {
    EMPTY,
    FULL,
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

    getPosition({ x, y }) {
        const row = this.rows[y];
        if (row === undefined) {
            return undefined;
        }
        return row[x];
    }

    empty({ x, y }) {
        this.rows[y][x] = EMPTY;
    }

    fill({ x, y }) {
        this.rows[y][x] = FULL;
    }

    log() {
        for (let y = 0; y < this.size; y++) {
            console.log(this.rows[y]);
        }
    }

    isEmpty({ x, y }) {
        return this.getPosition({ x, y }) === EMPTY;
    }
}
