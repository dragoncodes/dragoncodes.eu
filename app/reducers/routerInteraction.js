export const RouteActionTypes = {
    ShowHideDemo: 'SHOW_HIDE_DEMO',
    EnqueueRouterTransition: 'ENQUEUE_TRANSITION',
    TransitionEnd: 'TRANSITION_OVER',
    RequestChildRoute: 'REQUEST_CHILD_ROUTE'
};

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
