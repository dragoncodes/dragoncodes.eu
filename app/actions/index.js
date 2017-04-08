import { RouteActionTypes } from '../reducers/routerInteraction';

export const showHideDemonstration = (showHide) => {
    return {
        type: RouteActionTypes.ShowHideDemo,
        showHide
    }
};

export const enqueueTransition = (route) => {
    return {
        type: RouteActionTypes.EnqueueRouterTransition,
        route: route
    }
};

export const requestChildRoute = (route) => {
    return {
        type: RouteActionTypes.RequestChildRoute,
        route: route
    }
};