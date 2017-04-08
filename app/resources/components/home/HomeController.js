import {TimelineLite, TweenLite} from 'gsap';
import BaseView from '../BaseView.js';

import React from 'react';

const TEXTS = [
//  `“People who deny the existence of dragons are often eaten by dragons. From within.”
//― Ursula K. Le Guin`,

    `Welcome to the lair of Peter Marinov`,

    `DragonCodes`
];

class HomeController extends React.Component {
    constructor () {
        super();

        setTimeout(()=> {

            this.populateInfo();
        }, 5000);
    }

    componentDidMount () {
        this.infoContainer = $('.' + 'info-container');
        this.currentIndex = 0;

        this.populateInfo();
    }

    render () {

        return (
            <div className="home-container">
                <div className="info-container">
                </div>
            </div>
        );
    }

    populateInfo () {
        this.infoContainer.html('');

        let timeline = new TimelineLite();
        timeline.stop();

        let text = TEXTS[ this.currentIndex ];
        for (var i = 0; i < text.length; i++) {
            let span = $(document.createElement('span'));
            span.html(text[ i ]);

            span.css('opacity', 0);

            this.infoContainer[ 0 ].appendChild(span[ 0 ]);

            timeline.staggerTo(span, .06, { opacity: 1 });
        }

        timeline.play();
        //
        this.currentIndex++;
    }

    //onCreate(){
    //  $('.dragon-footer').css('display', 'block');
    //}
    //
    //onDestroy(){
    //  $('.dragon-footer').css('display', 'none');
    //}
}


export default HomeController;
