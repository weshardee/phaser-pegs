const SHAKE_DURATION = 100;
const DIST = 5;
export const AUDIO_ERROR_ID = 'error';

export function shake(sprite) {
    const { game, x } = sprite;
    const start = { x };
    const right = { x: x + DIST };
    const left = { x: x - DIST };

    game.sound.play(AUDIO_ERROR_ID);
    return game.tweens.create(sprite)
        .to(left, SHAKE_DURATION / 4)
        .to(right, SHAKE_DURATION / 2)
        .to(start, SHAKE_DURATION / 4)
        .start()
    ;
}
