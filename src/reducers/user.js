import initialState from '../constants/initialState';
import * as types from '../constants/types';

export function user(state = initialState.loading, action) {
    switch (action.type) {
        case types.app.LOADING:
            return true;
        case types.app.LOADED:
            return false;
        default:
            return state;
    }
}
