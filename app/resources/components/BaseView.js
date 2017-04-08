import constants from '../../constants/AppConstants.js';

class BaseView {

  constructor() {

    //this.active = false;
    //router.on(constants.ROUTE_CHANGE, this.routeListener.bind(this));
  }

  /* Implement these */
  onCreate() {

  }

  prepareChildRoutes(page){
    this.page = page;
  }

  onDestroy() {
  }
}
export default BaseView;
