const ANCHOR_X = 0.5;
const ANCHOR_Y = 0.375;

export default class Tile extends Phaser.Sprite {
    constructor(game, x, y, onInput, onInputContext) {
        super(game, x, y, 'tiles', 0);
        this.anchor.x = ANCHOR_X;
        this.anchor.y = ANCHOR_Y;
        this.inputEnabled = true;
        this.events.onInputUp.add(onInput, onInputContext);
    }
}
