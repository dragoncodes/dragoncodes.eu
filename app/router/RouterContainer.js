import { connect } from 'react-redux'
import RouterView from './RouterComponent';
import {showHideDemonstration, enqueueTransition, requestChildRoute} from '../actions';

const mapStateToProps = (state) => {
    return {
        transitionInProgress: state.routerInteraction.transitionInProgress
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onShouldShowHideDemo: (shouldShow) => {
            dispatch(showHideDemonstration(shouldShow));
        },

        enqueueTransition: (route) => {
            dispatch(enqueueTransition(route));
        },

        childRouteLoaded: (route) => {
            dispatch(requestChildRoute(route));
        }
    }
};

const Router = connect(
    mapStateToProps,
    mapDispatchToProps
)(RouterView);

export default Router;