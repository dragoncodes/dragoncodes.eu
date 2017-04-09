import React from 'react';
import A from '../A';
import { TweenLite } from 'gsap';

export default class MenuComponent extends React.Component {

    static propTypes:{
        open: React.PropTypes.bool,
        onNavigationClick: React.PropTypes.func.isRequired
        }

    constructor () {
        super();

        this.state = {
            open: false
        }
    }

    componentDidMount () {
        this.menuHolder = $('.menu-overlay');

        //this.menuHolder.on('click', (e) => {
        //    e.preventDefault();
        //    e.stopPropagation();
        //});

        this.menuHolder.on('mousemove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.open !== nextProps.open) {

            const hide = !nextProps.open;

            if (hide) {

                TweenLite.to(this.menuHolder, .4, {
                    top: '-120%', onComplete: ()=> {
                        this.setState({
                            open: false
                        })
                    }
                });

            } else {

                this.setState({
                    open: true
                });
                TweenLite.set(this.menuHolder, { top: '-100%' });

                TweenLite.to(this.menuHolder, .4, {
                    top: 0
                });
            }
        }
    }

    render () {

        const { open } = this.state;

        return (
            <div className="menu-overlay" style={{ display: open ? 'block' : 'none' }}>
                <div className="dragon-menu-content col-md-15">
                    <A onClick={this.props.onNavigationClick} href="/" title="Home" />
                </div>

                <div className="dragon-menu-content col-md-15">
                    <a style={{cursor: 'pointer'}} onClick={() => this.props.onNavigationClick()} href="/about">About</a>
                </div>

                <div className="dragon-menu-content col-md-15">
                    <a onClick={() => this.props.onNavigationClick()} href="/projects">Projects</a>
                </div>

                <div className="dragon-menu-content col-md-15">
                    <a onClick={() => this.props.onNavigationClick()} href="http://dragoncodes.eu/blog/"
                       target="_blank">Blog</a>
                </div>

                <div className="dragon-menu-content col-md-15">
                    <a onClick={() => this.props.onNavigationClick()} href="mailto:dragoncodeseu@gmail.com">Contact</a>
                </div>
            </div>
        );
    }
}