import Grid from '../utils/Grid';
import Peg from '../objects/Peg';
import Tile from '../objects/Tile';

import {
    getGamePosition,
    getGridPosition,
} from '../utils/position';

import {
    shake,
    excite,
    fadeIn,
    AUDIO_ERROR_ID,
} from '../utils/animations';

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
    END_MESSAGES,
} from '../utils/constants';

const TILE_URI = 'images/tiles.png';
const PEGS_URI = 'images/pegs.png';

class GameState extends Phaser.State {
    preload() {
        this.game.load.audio('jump', AUDIO_JUMP_URI);
        this.game.load.audio(AUDIO_ERROR_ID, AUDIO_ERROR_URI);
        this.game.load.spritesheet('tiles', TILE_URI, 65, 89, NUM_TILE_TYPES);
        this.game.load.spritesheet('pegs', PEGS_URI, 40, 66, NUM_PEG_TYPES);
        this.game.load.image('reset', RESET_URI, 190, 49);
    }

    create() {
        this.game.stage.backgroundColor = 0x333333;

        // initialize groups for tiles and pegs
        this.boardGroup = this.game.add.group(undefined, 'board');
        this.tilesGroup = this.game.add.group(this.boardGroup, 'tiles');
        this.pegsGroup = this.game.add.group(this.boardGroup, 'pegs');
        this.deadPegsGroup = this.game.add.group(this.boardGroup, 'deadPegs');

        // build board
        this.grid = new Grid(BOARD_SIZE);
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

    reset() {
        this.isPopulated = false;
        this.grid.emptyAll();
        this.pegsGroup.children.slice().forEach(sprite => {
            this.kill(sprite);
        });
        this.game.tweens.create(this.endMessage)
            .to({ alpha: 0 }, FADE_DURATION)
            .start();
    }

    addTile({ x, y }) {
        const tile = new Tile(this.game, x, y, this.onTileClick, this);
        this.tilesGroup.add(tile);
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
        const isValid = this.grid.isValidMove(startPos, endPos);

        if (!isValid) {
            return this.disappoint();
        }

        const middle = this.grid.getMiddle(startPos, endPos);
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

        if (this.grid.hasValidMoves(pos)) {
            this.excite(sprite);
            this.selected = sprite;
        } else {
            shake(sprite);
        }
    }

    excite(sprite) {
        this.excited = sprite;
        this.excitedTween = excite(sprite);
    }

    disappoint() {
        shake(this.excited);
        this.excitedTween.loop(false);
        this.excited = null;
    }

    checkPegs() {
        this.pegsGroup.forEach(sprite => {
            const pos = getGridPosition(sprite);
            sprite.alive = this.grid.hasValidMoves(pos);
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

        this.endMessage.text = END_MESSAGES[0];

        if (numRemainingPegs < 4) {
            this.endMessage.text = END_MESSAGES[numRemainingPegs];
        }

        fadeIn(this.endMessage);
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
