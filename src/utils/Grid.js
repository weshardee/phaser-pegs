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

    emptyAll() {
        for (const { x, y } of this) {
            this.empty({x, y});
        }
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

    hasValidMoves({ x, y }) {
        const jumpDist = 2;
        const start = { x, y };
        const ends = [
            {
                x,
                y: y + jumpDist,
            },
            {
                x,
                y: y - jumpDist,
            },
            {
                x: x - jumpDist,
                y: y - jumpDist,
            },
            {
                x: x + jumpDist,
                y: y + jumpDist,
            },
            {
                x: x + jumpDist,
                y,
            },
            {
                x: x - jumpDist,
                y,
            },
        ];

        for (let i in ends) {
            const end = ends[i];
            if (this.isValidMove(start, end)) {
                return true;
            }
        }

        return false;
    }

    isValidMove(startPos, endPos) {
        const middle = this.getMiddle(startPos, endPos);

        if (this.isEmpty(middle)) {
            return false;
        }

        if (this.isEmpty(endPos)) {
            return true;
        }

        return false;
    }

    getMiddle(startPos, endPos) {
        const deltaX = startPos.x - endPos.x;
        const deltaY = startPos.y - endPos.y;
        return {
            x: deltaX / 2 + endPos.x,
            y: deltaY / 2 + endPos.y,
        };
    }
}
