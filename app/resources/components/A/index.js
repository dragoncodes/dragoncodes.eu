import React from 'react';

export default class A extends React.Component {

    static propTypes:{
        href: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        className: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
        }

    render () {
        const { className, href, title, onClick } = this.props;

        return (
            <a style={{cursor: 'pointer'}} onClick={()=> onClick && onClick()} className={className} href={href}>{title}</a>
        );
    }
}