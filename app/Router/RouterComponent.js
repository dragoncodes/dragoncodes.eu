import React from 'react';

import page from 'page';
import { connect } from 'react-redux';

import HomeController from '../resources/components/home/HomeController';
import ProjectsController from '../resources/components/projects/ProjectsController';
import AboutController from '../resources/components/about/AboutController';

const ROUTES = [
    {
        hash: '',
        holder: '.home-container',
        demonstrationShown: true,
        footerVisible: true,
        controller: <HomeController />
    },

    {
        hash: 'about',
        holder: '.about-container',
        demonstrationShown: false,
        footerVisible: false,
        controller: <AboutController />
    },

    {
        hash: 'projects',
        holder: '.projects-container',
        demonstrationShown: false,
        footerVisible: false,
        controller: <ProjectsController />
    }
];

export default class RouterComponent extends React.Component {

    static propTypes:{
        onShouldShowHideDemo: React.PropTypes.func.isRequired,
        enqueueTransition: React.PropTypes.func.isRequired,
        childRouteLoaded: React.PropTypes.func.isRequired,
        transitionInProgress: React.PropTypes.bool
        }

    constructor () {
        super();

        ROUTES.forEach((object, index)=> {
            page("/" + object.hash, this.handleRoute.bind(this));
        });

        page('/projects/:project', this.propagateChildRoute.bind(this), this.handleRoute.bind(this));
        page.exit('/projects/:project', this.propagateChildRouteExit.bind(this));
        page('*', () => {
            page('/');
        });

        this.currentHash = '';

        this.isLandingRoute = true;

        this.state = {
            currentRoute: null
        };
    }

    propagateChildRouteExit () {
        this.props.childRouteLoaded(null);
    }

    propagateChildRoute (route, next) {
        this.props.childRouteLoaded(route);

        next();
    }

    componentDidMount () {
        page.start();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.transitionInProgress && this.props.transitionInProgress != nextProps.transitionInProgress) {
            this.props.onShouldShowHideDemo(this.state.currentRoute.demonstrationShown);
        }
    }

    handleRoute (route, next) {
        this.currentHash = route.path.replace('/', '');

        let queryIndex = this.currentHash.indexOf('?');
        if (queryIndex !== -1) {
            this.currentHash = this.currentHash.substr(0, queryIndex);
        }

        if (this.currentHash.indexOf('/') !== -1) {
            this.currentHash = this.currentHash.split('/')[ 0 ];
        }

        ROUTES.forEach((routeIterator, index)=> {
            if (routeIterator.hash === this.currentHash) {
                let currentRoute = ROUTES[ index ];

                if (this.state.currentRoute && this.state.currentRoute.hash === currentRoute.hash) {
                    return;
                }

                this.setState({
                    currentRoute: currentRoute
                });

                if (!this.isLandingRoute) {
                    this.props.onShouldShowHideDemo(true);
                    this.props.enqueueTransition(currentRoute);
                } else {
                    this.isLandingRoute = false;
                    this.props.onShouldShowHideDemo(currentRoute.demonstrationShown);
                }
            }
        });
    }

    render () {
        const { currentRoute } = this.state;
        const { transitionInProgress } = this.props;

        return (
            <div className="router-outlet">
                { transitionInProgress ? null : currentRoute ? currentRoute.controller : null }
            </div>
        );
    }
}

var _routerConfigInstance;
export class Router {

    constructor () {
    }

    static get Instance () {
        if (!_routerConfigInstance) {
            _routerConfigInstance = new Router();
        }

        return _routerConfigInstance;
    }

    getLinkForRouteName (route) {
        route = route.toLowerCase();

        let link = '';

        if (route === 'blog') {
            link = 'http://dragoncodes.eu/blog/';
        } else if (route === 'github') {
            link = 'https://github.com/dragoncodes';
        } else if (route === 'home') {
            link = '/';
        } else if (route === 'youtube') {
            link = 'https://www.youtube.com/channel/UCap-CEc_3CJBVLz_9mp7MNg'
        } else {
            let routeObj = null;
            for (let i = 0; i < ROUTES.length; i++) {
                if (ROUTES[ i ].hash === route) {
                    routeObj = ROUTES[ i ];
                    break;
                }
            }

            if (routeObj) {
                link = ('/' + routeObj.hash);
            } else {
                link = route;
            }
        }

        return link;
    }

    go (route) {

        let url = this.getLinkForRouteName(route);

        if (url.indexOf('http') !== -1) {
            var win = window.open(url, '_blank');
            win.focus();
        } else {
            page(url);
        }
    }
}