import { config } from '../../../../package.json';
import constants from '../../../constants/AppConstants';

import { connect } from 'react-redux'
import React from 'react';

import SwWebGLRenderer from '../../../Renderer/DragonWebGLRenderer';
import { Scene, PerspectiveCamera, DirectionalLight } from 'three';

import Menu from '../menu/';
import Hamburger from '../hamburger/HamburgerComponent';

import Detector from '../../../extern/Detector.js';

import HomeInteractiveController from '../../../displayobjects/App/HomeInteractiveController';

import MainController from '../../MainController';

class AppComponent extends React.Component {

    static propTypes:{
        demonstrationShown: React.PropTypes.bool,
        transitionInProgress: React.PropTypes.bool,
        transitionOver: React.PropTypes.func
        }

    constructor () {
        super();

        this.state = {
            menuOpen: false,
            threeSceneLoading: true
        };
    }

    componentDidMount () {
        this.initThreeScene();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.demonstrationShown !== nextProps.demonstrationShown) {
            this.homeInteractionController.showHide(nextProps.demonstrationShown);
        } else if (this.props.transitionInProgress != nextProps.transitionInProgress && nextProps.transitionInProgress) {
            this.homeInteractionController.demonstration.routeChangeRequest(nextProps.transitionToRoute, ()=> {
                this.props.transitionOver();
            });
        }
    }

    initThreeScene () {
        if (Detector.webgl) {

            const mainRenderer = new SwWebGLRenderer({
                antialias: false,
                alpha: true
            });
            const mainScene = new Scene();
            const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

            document.getElementById('sceneSet').appendChild(mainRenderer.domElement);

            camera.position.z = 10;

            mainRenderer.camera = camera;
            mainRenderer.scene = mainScene;

            const homeInteractionController = this.homeInteractionController = new HomeInteractiveController(mainScene, camera);
            // const mainController = new MainController();

            homeInteractionController.demonstration.on(constants.DEMONSTRATION_LOADED, () => {

                this.redefineColorsForDemonstration(homeInteractionController.demonstration);
                mainRenderer.start();

                this.setState({
                    threeSceneLoading: false
                });

                //homeInteractionController.demonstration.playInitialAnimation();
                homeInteractionController.showHide(false);

                // TODO ROUTER COMMENTED
                // let router = Router.getInstance();
                // router.init(homeInteractionController);
            });

        } else {
            document.body.innerHTML = '';
            Detector.addGetWebGLMessage();
        }
    }

    redefineColorsForDemonstration (demonstration) {
        let redefines = demonstration.colorsNeedRedefine,
            css = ``,
            head = document.head;

        if (redefines.menu) {
            css += `

           .menu-overlay a, .menu-mobile-holder a {
             color: ${redefines.menu};
           }

           .menu-overlay a:hover, .menu-mobile-holder a:hover {
             color: ${redefines.menu};
           }

           .menu-overlay a:focus, .menu-mobile-holder a:focus {
             color: ${redefines.menu};
           }

           .dragon-footer a {
             color: ${redefines.menu};
           }

           .about-info { color: ${redefines.menu}; }
           .project-item-description {
             color: ${redefines.menu};
           }
         `;

        }

        if (redefines.background) {
            css += `.background{ background-color: ${redefines.background} }`;
        }

        if (redefines.theme) {
            let meta = document.createElement('meta');

            meta.name = "theme-color";
            meta.content = redefines.theme;
            head.appendChild(meta);

            meta = document.createElement('meta');
            meta.name = 'msapplication-navbutton-color';
            meta.content = redefines.theme;

            head.appendChild(meta);

            meta = document.createElement('meta');
            meta.name = 'apple-mobile-web-app-status-bar-style';
            meta.content = redefines.theme;

            head.appendChild(meta);
        }

        if (redefines.menu_background) {
            css += `.menu-overlay{ background-color: ${redefines.menu_background} }`;
        }

        var blob = new Blob([ css ], { type: 'text/css' }),
            url = window.URL.createObjectURL(blob);

        var link = document.createElement('link');

        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;

        head.appendChild(link);

    }

    onHamburgerClicker () {

        this.checkDemonstrationState();

        this.setState({
            menuOpen: !this.state.menuOpen
        });
    }

    checkDemonstrationState(){
        if(!this.state.menuOpen) {
            this.homeInteractionController.showHide(false);
        } else {
            this.homeInteractionController.showHide(this.props.demonstrationShown);
        }
    }

    onNavigationClicked () {
        this.setState({
            menuOpen: false
        });

        this.checkDemonstrationState();
    }

    render () {
        const { threeSceneLoading, menuOpen } = this.state;

        return (
            <div>
                <MainController threeSceneLoading={threeSceneLoading}/>

                <div className="background">&thinsp;</div>

                <Hamburger onClick={this.onHamburgerClicker.bind(this)} open={menuOpen}/>
                <Menu onNavigationClick={this.onNavigationClicked.bind(this)} open={menuOpen}/>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        demonstrationShown: state.demonstrationShown,
        transitionInProgress: state.transitionInProgress,
        transitionToRoute: state.transitionToRoute
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        transitionOver: () => {
            dispatch({
                type: 'TRANSITION_OVER'
            })
        }
    }
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppComponent);

export default App;

