import {
    NUM_PEG_TYPES,
} from '../utils/constants';

let count = 1;

class Peg {
    constructor(game, group, x, y) {
        this.id = count++;
        this.game = game;

        this.sprite = this.game.add.sprite(x, y, 'pegs', Math.floor(Math.random() * NUM_PEG_TYPES), group);

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.8;

        //  Input Enable the sprite
        this.sprite.inputEnabled = true;
    }
}

export default Peg;
