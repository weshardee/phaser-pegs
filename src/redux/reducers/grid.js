import * as GRID_ACTION_TYPES from '../actions/grid';
import Grid from '../../utils/Grid';

const INITIAL = new Grid();

export default function grid(state = INITIAL, action) {
    switch (action.type) {
    case GRID_ACTION_TYPES.CREATE:
        const { size } = action;
        return new Grid(size);

    default:
        return state;
    }
    return state;
}
