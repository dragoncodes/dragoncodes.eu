import AnimationStore from '../../stores/AnimationStore.js';
import BaseDemonstration from './demonstrations/Base.js';
import constants from '../../constants/AppConstants';

export default class BaseInteractiveController {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.demonstrationClass = BaseDemonstration;

    AnimationStore.addChangeListener(this.drawCall.bind(this));
  }

  instantiateDemonstration() {
    this.demonstration = new this.demonstrationClass(this.scene, this.camera);
  }

  drawCall(data) {
    if (this.demonstration) {
      this.demonstration.drawCall(data);
    }
  }

  showHide(show) {
    if (show) {
      $('#sceneSet').css('visibility', 'visible');
    } else {
      $('#sceneSet').css('visibility', 'hidden');
    }

    if (this.demonstration) {
      if (show)
        this.demonstration.onCreate();
      else this.demonstration.onDestroy();
    }
  }
}
