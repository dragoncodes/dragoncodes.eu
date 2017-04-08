import * as THREE from 'three';
import RendererStore from '../stores/RendererStore.js';
import AnimationStore from '../stores/AnimationStore.js';

export default class DragonWebGLRenderer extends THREE.WebGLRenderer {

  constructor(...args) {
    super(...args);

    this.resolution = window.devicePixelRatio;

    window.addEventListener('resize', this.resizeHandler.bind(this));

    RendererStore.set('resolution', this.resolution);

    this.setClearColor(0x000000, 0);
    this.setPixelRatio(this.resolution);
    this.camera = false;
    this.scene = false;

    this.setStore();

    this.resizeHandler();
  }

  setStore() {
    RendererStore.set('width', this.getWindowSize()[0]);
    RendererStore.set('height', this.getWindowSize()[1]);
  }

  resizeHandler() {
    const w = this.getWindowSize()[0];
    const h = this.getWindowSize()[1];

    this.setSize(w, h);
    this.setStore();

    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    // IOS Not resizing after orientation change
    var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (iOS && viewportmeta) {
      if (viewportmeta.content.match(/width=device-width/)) {
        viewportmeta.content = viewportmeta.content.replace(/width=[^,]+/, 'width=1');
      }
      viewportmeta.content = viewportmeta.content.replace(/width=[^,]+/, 'width=' + window.innerWidth);
    }

    RendererStore.emitChange();
  }

  getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return [width, height];
  }

  start() {
    this.active = true;
    window.requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    this.active = false;
  }

  isRenderable() {
    return this.scene !== false && this.camera !== false;
  }

  animate() {

    if (this.active && this.isRenderable()) {

      this.render(this.scene, this.camera);

      AnimationStore.emitChange();
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }

}
