import {
    BOARD_SIZE,
    TILE_SIZE,
} from './constants';

export default function getPosition(gridX, gridY) {
    const xOffset = BOARD_SIZE - gridY * TILE_SIZE / 2;

    const x = gridX * TILE_SIZE + xOffset;
    const y = gridY * TILE_SIZE * 0.8;

    return {
        x,
        y,
    };
}
