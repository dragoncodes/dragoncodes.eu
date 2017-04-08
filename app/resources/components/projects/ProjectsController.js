import React from 'react';
import { connect } from 'react-redux';
import { Router } from '../../../Router/RouterComponent';
import { TweenLite, TweenMax } from 'gsap';

const PROJECTS = [

    {
        id: 1,
        title: 'St. Valentines Promotional Page',
        catchPhrase: "Love is in the air?",
        mainImage: '/assets/images/molly-promo.png',
        route: '/projects/valentines',
        href: 'http://dragoncodes.eu/valentines',
        description: `A simple 3D heart model, made from triangles with a custom Vertex Shader. The closer it got to Valentines day, the closer the triangles were
              to each other.`
    },

    {
        id: 2,
        title: 'Elemental - Android Game',
        catchPhrase: "Listen to the sounds of the elements!",
        mainImage: 'https://lh3.googleusercontent.com/jxoXys2wFNe00hbS5TDt4Igzzh47IxaMkgyyNBZUzMlH0fgiw2nZK90CvuZheAhJqcI=w300-rw',
        route: '/projects/elemental-game',
        href: 'https://play.google.com/store/apps/details?id=eu.dragoncodes.elementalfree',
        description: `Created with love using Unity3D and C#. Unique object interactions puzzle game <div>&thinsp;</div><a class='clear-anchor' target='_blank' href='http://dragoncodes.eu/blog/elemental'>Read mode here<a/>`
    }
];

class ProjectsController extends React.Component {

    static propTypes:{
        childRoute: React.PropTypes.string
        }

    constructor () {
        super();
    }

    componentDidMount () {
        this.hookProjectHolderInteractions();
    }

    componentDidUpdate () {
        const { childRoute } = this.props;

        if (!childRoute) {
            this.hookProjectHolderInteractions();
        }
    }

    render () {

        const { childRoute } = this.props;

        return (
            <div className="projects-container">
                { this.renderContent(childRoute) }
            </div>
        );
    }

    renderContent (childRoute) {
        if (!childRoute || childRoute === '') {
            return this.renderProjectsList();
        } else {
            return this.renderProject(this.getProjectForRoute(childRoute));
        }
    }

    renderProject (project) {
        return (
            <div className="project-holder">
                <div className="project">
                    <div className="project-item-title">
                        { project.title }
                    </div>
                    <img onClick={ () => this.onProjectImageClicked(project) } className="project-item-main-image"
                         src={project.mainImage}/>

                    <div className="project-item-catchphrase">
                        <a href={project.href} className="project-item-link">
                            { project.catchPhrase }
                        </a>
                    </div>

                    <div className="project-item-description" dangerouslySetInnerHTML={{__html: project.description}}>
                    </div>
                </div>
            </div>
        );
    }

    getProjectForRoute (subRoute) {
        for (let i = 0; i < PROJECTS.length; i++) {
            if (PROJECTS[ i ].route === subRoute.pathname) {
                return PROJECTS[ i ];
            }
        }

        // No project found return to projects
        Router.Instance.go('/projects');
    }

    onProjectItemClick (project) {
        Router.Instance.go(project.route);
    }

    renderProjectsList () {

        const items = PROJECTS.map((project) =>
                <div onClick={ ()=> this.onProjectItemClick(project) } key={project.id}
                     className="project-item-holder col-md-12">
                    <div className="project-item-title">
                        { project.title }
                    </div>
                    <img src={project.mainImage}
                         className="project-item-main-image"/>
                </div>
        );
        return items;
    }

    onProjectImageClicked (project) {
        var win = window.open(project.href, '_blank');
        win.focus();
    }

    hookProjectHolderInteractions () {
        this.projectsContiner = $('.projects-container');

        if (!mobileAndTabletcheck()) {

            TweenLite.set(this.projectsContiner, {
                css: {
                    transformStyle: "preserve-3d",
                    perspective: 800
                }
            });

            let holders = $('.project-item-holder');

            holders.on('mousemove', this.onProjectHover.bind(this));

            holders.on('mouseleave', (event) => {
                TweenLite.to(event.currentTarget, 1, { rotationX: 0, rotationY: 0, rotationZ: 0 });
            });
        }
    }

    onProjectHover (event) {

        let target = $(event.currentTarget),
            pos = target.offset(),
            clientX = event.clientX - pos.left,
            clientY = event.clientY - pos.top,
            rectWidth = target.outerWidth(),
            rectHeight = target.outerHeight();

        let maxDeg = 15;

        let rotX = ((rectHeight / 2) - clientY) / (rectHeight / 2) * maxDeg;
        let rotY = -((rectWidth / 2) - clientX) / (rectWidth / 2) * maxDeg;

        rotX = rotX.toFixed(3);
        rotY = rotY.toFixed(3);

        TweenMax.to(target, 0.2, { rotationX: rotX, rotationY: rotY });
    }
}

const mapStateToProps = (state) => {
    return {
        childRoute: state.childRoute
    };
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const Project = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsController);

export default Project;

