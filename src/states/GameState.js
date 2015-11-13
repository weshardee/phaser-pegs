import Grid from '../utils/Grid';
import Peg from '../objects/Peg';
import {
    getGamePosition,
    getGridPosition,
} from '../utils/position';

import {
    FADE_DURATION,
    GAME_SIZE,
    AUDIO_ERROR_URI,
    AUDIO_JUMP_URI,
    BOARD_SIZE,
    MIDDLE,
    NUM_PEG_TYPES,
    NUM_TILE_TYPES,
    DEATH_DURATION,
    DEATH_SCALE,
    DEATH_ALPHA,
    RESET_URI,
    JUMP_DURATION,
    FALL_DURATION,
} from '../utils/constants';

const TILE_URI = 'images/tiles.png';
const PEGS_URI = 'images/pegs.png';

class GameState extends Phaser.State {
    preload() {
        this.game.load.audio('jump', AUDIO_JUMP_URI);
        this.game.load.audio('error', AUDIO_ERROR_URI);
        this.game.load.spritesheet('tiles', TILE_URI, 65, 89, NUM_TILE_TYPES);
        this.game.load.spritesheet('pegs', PEGS_URI, 40, 66, NUM_PEG_TYPES);
        this.game.load.image('reset', RESET_URI, 190, 49);
    }

    create() {
        this.game.stage.backgroundColor = 0x333333;

        this.grid = new Grid(BOARD_SIZE);

        // initialize groups for tiles and pegs
        this.boardGroup = this.game.add.group(undefined, 'board');
        this.tilesGroup = this.game.add.group(this.boardGroup, 'tiles');
        this.pegsGroup = this.game.add.group(this.boardGroup, 'pegs');
        this.deadPegsGroup = this.game.add.group(this.boardGroup, 'deadPegs');

        // build board
        for (const { x, y } of this.grid) {
            const gamePosition = getGamePosition(x, y);
            this.addTile(gamePosition);
        }

        // center board
        this.boardGroup.x = MIDDLE;
        this.boardGroup.y = (MIDDLE - this.boardGroup.height / 2) * 1.6;

        // add reset button
        this.game.add.button(0, 0, 'reset', this.reset, this);

        // populate board
        this.isPopulated = false;

        // add banner
        const textStyle = {
            fill: '#ffffff',
        };
        this.endMessage = this.game.add.text(this.world.width - 20, 14, '', textStyle);
        this.endMessage.anchor.x = 1;
        this.endMessage.alpha = 0;
    }

    populate(emptyPos) {
        this.isPopulated = true;

        // populate board
        for (const { x, y } of this.grid) {
            const gamePosition = getGamePosition(x, y);
            if (x !== emptyPos.x || y !== emptyPos.y) {
                this.addPeg(gamePosition);
                this.grid.fill({ x, y });
            }
        }
    }

    empty() {
        this.isPopulated = false;
        this.pegsGroup.children.slice().forEach(sprite => {
            this.kill(sprite);
        });
    }

    reset() {
        this.isPopulated = false;
        this.empty();

        this.game.tweens.create(this.endMessage)
            .to({ alpha: 0 }, FADE_DURATION)
            .start();
    }

    addTile({ x, y }) {
        const tile = this.game.add.sprite(x, y, 'tiles', 0, this.tilesGroup);

        tile.anchor.x = 0.5;
        tile.anchor.y = 0.375;

        tile.inputEnabled = true;
        tile.events.onInputUp.add(this.onTileClick, this);
    }

    onTileClick(sprite) {
        const gridPos = getGridPosition(sprite);

        if (this.excited) {
            this.jumpTo(gridPos);
        } else if (!this.isPopulated) {
            this.populate(gridPos);
        }
    }

    jumpTo(endPos) {
        this.game.sound.play('jump');

        const startPos = getGridPosition(this.excited);
        const isValid = this.isValidMove(startPos, endPos);

        if (!isValid) {
            return this.disappoint();
        }

        const middle = this.getMiddle(startPos, endPos);
        this.grid.fill(endPos);
        this.grid.empty(startPos);
        this.grid.empty(middle);

        // move the sprite
        const endGamePos = getGamePosition(endPos.x, endPos.y);

        this.game.tweens.create(this.excited)
            .to(endGamePos, JUMP_DURATION, Phaser.Easing.Back.InOut)
            .start()
        ;

        // clear excited state
        this.excitedTween.loop(false);
        this.excited = null;

        // kill the jumped peg
        const middlePeg = this.getPegAt(middle);
        this.kill(middlePeg);
    }

    kill(sprite) {
        this.game.tweens.create(sprite)
            .to({ alpha: DEATH_ALPHA }, DEATH_DURATION)
            .start()
        ;

        const death = this.game.tweens.create(sprite.scale)
            .to(DEATH_SCALE, DEATH_DURATION)
        ;

        death.onComplete.add(() => {
            sprite.destroy();
            this.checkPegs();
        });

        death.start();

        this.pegsGroup.remove(sprite);
        this.deadPegsGroup.add(sprite);
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

        this.game.tweens.create(peg.sprite)
            .from({ y: '-' + GAME_SIZE }, FALL_DURATION, Phaser.Easing.Bounce.Out)
            .delay(Math.random() * 200)
            .start()
        ;

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

    checkPegs() {
        this.pegsGroup.forEach(sprite => {
            const pos = getGridPosition(sprite);
            sprite.alive = this.hasValidMoves(pos);
        });

        if (this.pegsGroup.getFirstAlive() === null) {
            this.end();
        }
    }

    end() {
        const numRemainingPegs = this.pegsGroup.countDead();

        if (numRemainingPegs === 0) {
            return;
        }

        const MESSAGES = [
            'Just Plain Eg-no-ra-moose',
            'You\'re a Genius',
            'You\'re Pretty Smart',
            'Just Plain Dumb',
        ];

        this.endMessage.text = MESSAGES[0];

        if (numRemainingPegs < 4) {
            this.endMessage.text = MESSAGES[numRemainingPegs];
        }

        this.game.tweens.create(this.endMessage)
            .to({ alpha: 1 }, FADE_DURATION)
            .start();
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
