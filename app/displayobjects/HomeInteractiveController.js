import BaseInteractiveController from './BaseInteractiveController.js';
import CubeDemonstration from './demonstrations/Cube.js';
import FloatingIslandDemonstration from './demonstrations/FloatingIsland.js';
import * as THREE from 'three';

const mobileDemonstrations = [
  CubeDemonstration
];

const PCDemonstrations = [
  //FloatingIslandDemonstration
  CubeDemonstration
];

class HomeInteractiveController extends BaseInteractiveController {
  constructor(scene, camera) {
    super(scene, camera);

    if(window.mobileAndTabletcheck()){
      this.demonstrationClass = mobileDemonstrations[THREE.Math.randInt(0, mobileDemonstrations.length - 1)];
    } else {
      this.demonstrationClass = PCDemonstrations[THREE.Math.randInt(0, PCDemonstrations.length - 1)];
    }

    this.instantiateDemonstration();
  }
}

export default HomeInteractiveController;
