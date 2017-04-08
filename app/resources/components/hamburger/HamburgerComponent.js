import React from 'react';
import { TweenLite } from 'gsap';

export default class HamburgerComponent extends React.Component {

    static propTypes:{
        onClick: React.PropTypes.func.isRequired,
        open: React.PropTypes.bool.isRequired
        }

    constructor () {
        super();
    }

    componentDidMount () {
        // TODO Hook animation events

        this.hookAnimationEvents();
    }

    hookAnimationEvents () {

        this.menuButton = $('.hamburger-holder');
        this.menuButton.on('mouseover', () => {
            var lines = this.menuButton.children('.hamburger-line');
            //
            //TweenLite.to(lines[0], 0.5, {rotation: 45});
            //TweenLite.to(lines[1], 0.5, {rotation: -45});
            //TweenLite.to(lines[2], 0.5, {opacity: 0});
        });

        this.menuButton.on('mouseleave', () => {
            var lines = this.menuButton.children('.hamburger-line');

            //TweenLite.to(lines[0], 0.5, {rotation: 0});
            //TweenLite.to(lines[1], 0.5, {rotation: 0});
            //TweenLite.to(lines[2], 0.5, {opacity: 1});
        });

        this.menuButton.on('click', this.onMenuButtonClick.bind(this));
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.open !== nextProps.open) {
            var lines = this.menuButton.children('.hamburger-line');

            const hide = !nextProps.open;

            if (hide) {

                TweenLite.to(lines[ 0 ], 0.5, { rotation: 0 });
                TweenLite.to(lines[ 1 ], 0.5, { rotation: 0 });
                TweenLite.to(lines[ 2 ], 0.5, { opacity: 1 });

            } else {

                TweenLite.to(lines[ 0 ], 0.5, { rotation: 45 });
                TweenLite.to(lines[ 1 ], 0.5, { rotation: -45 });
                TweenLite.to(lines[ 2 ], 0.5, { opacity: 0 });
            }
        }
    }

    onMenuButtonClick () {
        this.props.onClick();
    }

    render () {
        return (
            <div className="hamburger-holder">
                <div className="hamburger-line">&thinsp;</div>
                <div className="hamburger-line">&thinsp;</div>
                <div className="hamburger-line">&thinsp;</div>
            </div>
        );
    }
}


//- .hamburger-holder
//-     .hamburger-line
//-         | &thinsp;
//-     .hamburger-line
//-         | &thinsp;
//-     .hamburger-line
//-         | &thinsp;