import './resources/main.css';

import './resources/util/util.js';

import { routerInteraction } from './reducers/routerInteraction';

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import ReactDOM from 'react-dom';
import React from 'react';

import AppComponent from './resources/components/app/';

const store = createStore(routerInteraction);

ReactDOM.render(
    <Provider store={store}>
        <AppComponent />
    </Provider>,
    document.getElementById('appRoot')
);

// === Analytics
(function (i, s, o, g, r, a, m) {
    i[ 'GoogleAnalyticsObject' ] = r;
    i[ r ] = i[ r ] || function () {
            (i[ r ].q = i[ r ].q || []).push(arguments)
        }, i[ r ].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[ 0 ];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-73676239-1', 'auto');
ga('send', 'pageview');

// ==============
