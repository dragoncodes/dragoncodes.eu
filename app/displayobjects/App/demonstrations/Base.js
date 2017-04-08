import EventEmitter from 'events';
import constants from '../../../constants/AppConstants';

export default class BaseDemonstration extends EventEmitter {
  constructor(scene, camera) {
    super();

    this.colorsNeedRedefine = {
      'menu': false,
      'menu_background': false,
      'background': false
    };

    this.scene = scene;
    this.camera = camera;
  }

  drawCall(data) {

  }

  onCreate(){}
  onDestroy(){}

  routeChangeRequest(route, listener) {

    if(this.transitioning){
      this.interruptTransition();
    }

    this.on(constants.TRANSITION_END, listener);

    this.startTransition(route);
  }

  interruptTransition() {
    if (this.timeline) {
      this.timeline.stop();
      this.timeline = null;
    }

    this.removeAllListeners(constants.TRANSITION_END);
  }

  startTransition(route) {

    this.transitioning = true;
    this.emit(constants.TRANSITION_START);
  }

  playInitialAnimation() {
  }

  transitionEnd() {
    this.transitioning = false;
    this.emit(constants.TRANSITION_END);

    this.removeAllListeners(constants.TRANSITION_END);
  }

}
