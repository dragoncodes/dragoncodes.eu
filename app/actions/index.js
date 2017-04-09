export const RouteActionTypes = {
    ShowHideDemo: 'SHOW_HIDE_DEMO',
    EnqueueRouterTransition: 'ENQUEUE_TRANSITION',
    TransitionEnd: 'TRANSITION_OVER',
    RequestChildRoute: 'REQUEST_CHILD_ROUTE'
};

export const ActionTypes = {
    ProjectsLoaded: 'PROJECTS_LOADED'
};

export const transitionEnd = () => {
    return {
        type: RouteActionTypes.TransitionEnd
    }
};

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

export const projectsLoaded = (projects) => {

    return {
        type: ActionTypes.ProjectsLoaded,
        projects
    }
};