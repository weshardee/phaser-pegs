import {
    GAME_SIZE,
} from './constants';

const SHAKE_DURATION = 100;
const SHAKE_DISTANCE = 5;

const EXCITEMENT_SWING_ROTATION = 0.05;
const EXCITEMENT_SWING_DURATION = 90;

const FADE_DURATION = 200;
const SLIDE_DURATION = 200;

const FALL_DURATION = 600;
const FALL_MAX_DELAY = 200;
const FALL_EASING = Phaser.Easing.Bounce.Out;

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

export function fadeIn(sprite) {
    sprite.game.tweens.create(sprite)
        .to({ alpha: 1 }, FADE_DURATION)
        .start();
}

export function fadeOut(sprite) {
    sprite.game.tweens.create(sprite)
        .to({ alpha: 0 }, FADE_DURATION)
        .start();
}

export function slide(sprite, position) {
    sprite.game.tweens.create(sprite)
        .to(position, SLIDE_DURATION, Phaser.Easing.Back.InOut)
        .start()
    ;
}

export function fallIn(sprite) {
    const { game } = sprite;
    const delay = Math.random() * FALL_MAX_DELAY;
    const props = { y: '-' + game.height };

    game.tweens.create(sprite)
        .from(props, FALL_DURATION, FALL_EASING)
        .delay(delay)
        .start()
    ;
}
