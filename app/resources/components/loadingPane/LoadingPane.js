import React from 'react';

export default class LoadingPane extends React.Component {

    render() {
        return (
            <div className="loading-overlay">
                <div className="loader">
                    <span>{"{"}</span>
                    <span>{"}"}</span>
                </div>
            </div>
        );
    }
}