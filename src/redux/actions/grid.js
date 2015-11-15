export const CREATE = 'CREATE_GRID';
export const MOVE = 'MOVE_GRID_PEG';
export const REMOVE = 'REMOVE_GRID_PEG';
export const ADD = 'ADD_GRID_PEG';

export function createGrid(size) {
    return {
        type: CREATE,
        size,
    };
}

export function movePeg(start, end) {
    return {
        type: MOVE,
        start,
        end,
    };
}

export function removePeg(position) {
    return {
        type: REMOVE,
        position,
    };
}

export function addPeg(position) {
    return {
        type: REMOVE,
        position,
    };
}
