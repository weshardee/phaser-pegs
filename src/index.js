import GameState from './states/GameState';

const game = new Phaser.Game(500, 500, Phaser.AUTO, 'peg-game', {
    create,
    update,
});
game.state.add('GameState', GameState, false);
game.state.start('GameState');

export default game;

function create() {

}

function update() {

}
