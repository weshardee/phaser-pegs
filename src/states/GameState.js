import Grid from '../utils/Grid';
import Peg from '../objects/Peg';
import {
    getGamePosition,
    getGridPosition,
} from '../utils/position';

import {
    AUDIO_ERROR_URI,
    BOARD_SIZE,
    MIDDLE,
    NUM_PEG_TYPES,
} from '../utils/constants';

const tileURI = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABZCAYAAABhckmzAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNS0xMS0xMFQxMjoxMTo1NDwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjQ8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NjU8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4K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';
const pegsURI = 'data:image/jpeg;base64,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';

class GameState extends Phaser.State {
    preload() {
        this.game.load.audio('error', AUDIO_ERROR_URI);
        this.game.load.image('tile', tileURI);
        this.game.load.spritesheet('pegs', pegsURI, 40, 64, NUM_PEG_TYPES);
    }

    create() {
        this.game.stage.backgroundColor = 0x333333;

        this.grid = new Grid(BOARD_SIZE);

        // initialize groups for tiles and pegs
        this.boardGroup = this.game.add.group(undefined, 'board');
        this.tilesGroup = this.game.add.group(this.boardGroup, 'tiles');
        this.pegsGroup = this.game.add.group(this.boardGroup, 'pegs');

        // populate board
        for (const { x, y } of this.grid) {
            const gamePosition = getGamePosition(x, y);
            this.addTile(gamePosition);

            if (y > 0) {
                const peg = this.addPeg(gamePosition);
                this.grid.setPosition(x, y, peg.id);
            }
        }

        this.grid.log();

        // center board
        this.boardGroup.x = MIDDLE;
        this.boardGroup.y = (MIDDLE - this.boardGroup.height / 2) * 1.3;
    }

    addTile({ x, y }) {
        const tile = this.game.add.sprite(x, y, 'tile', undefined, this.tilesGroup);

        tile.anchor.x = 0.5;
        tile.anchor.y = 0.375;

        tile.inputEnabled = true;
        tile.events.onInputUp.add(this.onTileClick, this);
    }

    onTileClick(sprite) {
        const gridPos = getGridPosition(sprite);

        if (this.excited) {
            this.jumpTo(gridPos);
        }
    }

    jumpTo(endPos) {
        const startPos = getGridPosition(this.excited);
        const isValid = this.isValidMove(startPos, endPos);

        if (!isValid) {
            this.disappoint();
        }
    }

    isValidMove(startPos, endPos) {
        const middle = {
            x: (startPos.x - endPos.x) / 2 + startPos.x,
            y: (startPos.y - endPos.y) / 2 + startPos.y,
        };

        if (this.grid.isEmpty(middle)) {
            return false;
        }

        if (this.grid.isEmpty(endPos)) {
            return true;
        }

        return false;
    }

    addPeg({ x, y }) {
        const peg = new Peg(this.game, this.pegsGroup, x, y);
        peg.sprite.events.onInputUp.add(this.onPegClick, this);
        return peg;
    }

    onPegClick(sprite) {
        if (this.excited) {
            this.disappoint();
        }

        // figure out pegboard position of click
        const pos = getGridPosition(sprite);

        if (this.hasValidMoves(pos)) {
            this.excite(sprite);
            this.selected = sprite;
        } else {
            this.shake(sprite);
        }
    }

    excite(sprite) {
        const swing = 0.05;
        const swingDuration = 90;
        const tween = this.game.tweens.create(sprite)
            .to({ rotation: swing }, swingDuration, Phaser.Easing.Back.Out)
            .to({ rotation: 0 }, swingDuration, Phaser.Easing.Linear.None)
            .to({ rotation: -swing }, swingDuration, Phaser.Easing.Back.Out)
            .to({ rotation: 0 }, swingDuration, Phaser.Easing.Linear.None)
            .loop(true)
            .start()
        ;
        this.excited = sprite;
        this.excitedTween = tween;
    }

    disappoint() {
        this.shake(this.excited);
        this.excitedTween.loop(false);
        this.excited = null;
    }

    shake(sprite) {
        const duration = 100;
        const dist = 5;
        const start = { x: sprite.x };
        const right = { x: sprite.x + dist };
        const left = { x: sprite.x - dist };
        this.game.tweens.create(sprite)
            .to(left, duration / 4)
            .to(right, duration / 2)
            .to(start, duration / 4)
            .start()
        ;
        this.game.sound.play('error');
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

    hasPeg(x, y) {
        if (this.isOutOfBounds(x, y)) {
            return false;
        }
    }

    getId(x, y) {
        const row = this.grid[y];

        if (row === undefined) {
            return true;
        }

        const pos = row[x];

        if (pos === undefined) {
            return true;
        }
    }

}

export default GameState;
