import { ActionTypes } from '../actions/';

export const remoteDataInteraction = (state = {}, action = {}) => {
    switch (action.type) {
        case ActionTypes.ProjectsLoaded:

            return Object.assign({}, state, {
                projects: action.projects
            });
        default:
            return state;
    }
};