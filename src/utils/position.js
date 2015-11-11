import {
    BOARD_SIZE,
    TILE_SIZE,
    Y_HEX_FACTOR,
} from './constants';

function getXOffset(y) {
    return BOARD_SIZE - y * TILE_SIZE / 2;
}

export function getGamePosition(posX, posY) {
    const x = posX * TILE_SIZE + getXOffset(posY);
    const y = posY * TILE_SIZE * Y_HEX_FACTOR;

    return {
        x,
        y,
    };
}

export function getGridPosition(sprite) {
    const y = Math.round(sprite.y / TILE_SIZE / Y_HEX_FACTOR);
    const x = Math.round((sprite.x - getXOffset(y)) / TILE_SIZE);

    return {
        x,
        y,
    };
}
