import { routerInteraction } from './routerInteraction';
import { remoteDataInteraction } from './remoteDataInteraction';

import { combineReducers } from 'redux';

export default combineReducers({remoteDataInteraction, routerInteraction});