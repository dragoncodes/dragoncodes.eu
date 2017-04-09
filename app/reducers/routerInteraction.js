import { RouteActionTypes } from '../actions/';

export const routerInteraction = (state = {}, action = {}) => {
    switch (action.type) {
        case RouteActionTypes.ShowHideDemo:

            return Object.assign({}, state, {
                demonstrationShown: action.showHide
            });
        case RouteActionTypes.EnqueueRouterTransition:
            return Object.assign({}, state, {
                transitionInProgress: true,
                transitionToRoute: action.route
            });

        case RouteActionTypes.TransitionEnd:
            return Object.assign({}, state, {
                transitionInProgress: false,
                transitionToRoute: null
            });

        case RouteActionTypes.RequestChildRoute:
            return Object.assign({}, state, {
                childRoute: action.route
            });
        default:
            return state;
    }
};
