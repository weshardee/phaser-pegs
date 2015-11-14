const SHAKE_DURATION = 100;
const SHAKE_DISTANCE = 5;

const EXCITEMENT_SWING_ROTATION = 0.05;
const EXCITEMENT_SWING_DURATION = 90;

export const AUDIO_ERROR_ID = 'error';

export function shake(sprite) {
    const { game, x } = sprite;
    const start = { x };
    const right = { x: x + SHAKE_DISTANCE };
    const left = { x: x - SHAKE_DISTANCE };

    game.sound.play(AUDIO_ERROR_ID);
    return game.tweens.create(sprite)
        .to(left, SHAKE_DURATION / 4)
        .to(right, SHAKE_DURATION / 2)
        .to(start, SHAKE_DURATION / 4)
        .start()
    ;
}

export function excite(sprite) {
    return sprite.game.tweens.create(sprite)
        .to({ rotation: EXCITEMENT_SWING_ROTATION }, EXCITEMENT_SWING_DURATION, Phaser.Easing.Back.Out)
        .to({ rotation: 0 }, EXCITEMENT_SWING_DURATION, Phaser.Easing.Linear.None)
        .to({ rotation: -EXCITEMENT_SWING_ROTATION }, EXCITEMENT_SWING_DURATION, Phaser.Easing.Back.Out)
        .to({ rotation: 0 }, EXCITEMENT_SWING_DURATION, Phaser.Easing.Linear.None)
        .loop(true)
        .start()
    ;

}
