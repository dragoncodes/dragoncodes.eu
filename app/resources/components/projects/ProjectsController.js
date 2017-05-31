import React from 'react';
import { connect } from 'react-redux';
import { Router } from '../../../router/RouterComponent';
import { TweenLite, TweenMax } from 'gsap';

class ProjectsController extends React.Component {

    static propTypes:{
        childRoute: React.PropTypes.string,
        projects: React.PropTypes.array
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
                        <a href={project.href} target="_blank" className="project-item-link">
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

        const { projects } = this.props;

        for (let i = 0; i < projects.length; i++) {
            if (projects[ i ].route === subRoute.pathname) {
                return projects[ i ];
            }
        }

        // No project found return to projects
        Router.Instance.go('/projects');
    }

    onProjectItemClick (project) {
        Router.Instance.go(project.route);
    }

    renderProjectsList () {

        const { projects } = this.props;

        if(!projects){
            return (<div>Loading projects...</div>);
        }

        const items = projects.map((project) =>
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
        childRoute: state.routerInteraction.childRoute,
        projects: state.remoteDataInteraction.projects
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

