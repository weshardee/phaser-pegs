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
const PEGS_URI = 'images/pegs.png'

class GameState extends Phaser.State {
    preload() {
        this.game.load.audio('error', AUDIO_ERROR_URI);
        this.game.load.image('tile', tileURI);
        this.game.load.spritesheet('pegs', PEGS_URI, 40, 66, NUM_PEG_TYPES);
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
                this.addPeg(gamePosition);
                this.grid.fill({ x, y });
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
            return this.disappoint();
        }

        const middle = this.getMiddle(startPos, endPos);
        this.grid.fill(endPos);
        this.grid.empty(startPos);
        this.grid.empty(middle);

        const endGamePos = getGamePosition(endPos.x, endPos.y);
        this.excited.x = endGamePos.x;
        this.excited.y = endGamePos.y;

        // clear excited state
        this.excitedTween.loop(false);
        this.excited = null;

        // kill the jumped peg
        const middlePeg = this.getPegAt(middle);
        this.kill(middlePeg);

        this.grid.log();
    }

    kill(sprite) {
        const deathDuration = 200;
        const alpha = 0;
        const scale = {
            x: 0,
            y: 0,
        };

        this.game.tweens.create(sprite)
            .to({ alpha }, deathDuration)
            .start()
        ;

        this.game.tweens.create(sprite.scale)
            .to(scale, deathDuration)
            .start()
        ;
    }

    isValidMove(startPos, endPos) {
        const middle = this.getMiddle(startPos, endPos);

        if (this.grid.isEmpty(middle)) {
            return false;
        }

        if (this.grid.isEmpty(endPos)) {
            return middle;
        }

        return false;
    }

    getPegAt({ x, y }) {
        const peg = this.pegsGroup.children.find(sprite => {
            const gridPos = getGridPosition(sprite);
            if (gridPos.x === x && gridPos.y === y) {
                return true;
            }
            return false;
        });
        return peg;
    }

    getMiddle(startPos, endPos) {
        const deltaX = startPos.x - endPos.x;
        const deltaY = startPos.y - endPos.y;
        return {
            x: deltaX / 2 + endPos.x,
            y: deltaY / 2 + endPos.y,
        };
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
