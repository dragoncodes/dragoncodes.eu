import { TimelineLite, TweenLite } from 'gsap';

import LoadingPane from './components/loadingPane/';

import Router from '../router/RouterContainer';

import React from 'react';
import ReactDOM from 'react-dom';

export default class MainController extends React.Component {

    propTypes:{
        threeSceneLoading: React.PropTypes.bool.isRequired
        }

    constructor () {
        super();

        this.state = {
            loadingTransitionOver: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.threeSceneLoading !== nextProps.threeSceneLoading) {
            this.fadeLoadingPane();
        }
    }

    fadeLoadingPane () {
        var tl = this.loadingPaneTimeline = new TimelineLite({
            onComplete: () => {
                this.setState({ loadingTransitionOver: true });
            }
        });

        let loadingPane = document.querySelector('.loading-overlay');

        tl.from(loadingPane, 0.5, { opacity: 1 });
        tl.to(loadingPane, 0.5, { opacity: 0, display: 'none' });
    }

    render () {

        const { threeSceneLoading } = this.props;

        if (threeSceneLoading || !this.state.loadingTransitionOver) {
            return <LoadingPane />;
        }

        return (
            <div className="container main-container">
                <Router/>
            </div>
        );
    }
}
