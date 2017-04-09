import { constants } from '../../constants/AppConstants';

export const fetchProjects = () => {
    return fetch(constants.API_URL + '/projects', {
    }).then( response => response.json() ).catch( e => console.error(e) );
};