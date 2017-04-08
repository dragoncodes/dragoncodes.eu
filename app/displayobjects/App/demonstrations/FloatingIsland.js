import BaseDemonstration from './Base.js';
import constants from '../../../constants/AppConstants';
import {TweenLite, TimelineLite} from 'gsap';
import OBJLoader from '../../../Loaders/OBJLoader.js'
import * as THREE from 'three';

export default class FloatingIslandDemonstration extends BaseDemonstration {
  constructor(scene, camera) {
    super(scene, camera);

    this.colorsNeedRedefine = {
      'menu': '#000000',
      'background': '#757575'
    };

    let manager = this.loadingManager = new THREE.LoadingManager();
    let loader = new THREE.TextureLoader(manager);

    this.objNameToTexture = {
      'tree1': 'Tree_01.png',
      'tree2': 'Tree_02.png',
      'tree3': 'Tree_03.png',
      'tree4': 'Tree_04.png',
      'tree5': 'Tree_05.png',
      'tree6': 'Tree_06.png',
      'tree7': 'Tree_07.png',
      'tree10_t': 'Tree_10_Tree.png',
      'tree10_h': 'Tree_10_House.png',
      'material__58': 'BackGround_Tree.png',
      'wire_229166215': 'BackGround_Tree.png'
    };

    for (let key in this.objNameToTexture) {

      if (key === 'wire_229166215') {
        this.objNameToTexture[key] = this.objNameToTexture['material__58'];
        continue;
      }

      if (this.objNameToTexture.hasOwnProperty(key)) {
        this.objNameToTexture[key] = loader.load('/assets/models/floatingIslandTextures/' + this.objNameToTexture[key]);
      }
    }

    manager.onLoad = () => {
      this.createScene();
    };

    this.startCameraPosition = {x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z};
    this.animState = 0;
  }

  createFloatingIsland() {
    let manager = this.loadingManager;
    let loader = new OBJLoader(manager);

    manager.onLoad = () => {
      this.emit(constants.DEMONSTRATION_LOADED);
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    };

    loader.load('/assets/models/floatinIsland.obj', (object) => {

      object.position.x = 0;
      object.position.y = -14;
      object.position.z = -35;

      let scale = 0.24;

      object.scale.x = scale;
      object.scale.y = scale;
      object.scale.z = scale;

      object.children.forEach((child, index)=> {
        child.scale.x = scale;
        child.scale.y = scale;
        child.scale.z = scale;

        let key = child.material.name.toLowerCase();

        if (this.objNameToTexture.hasOwnProperty(key)) {

          child.material = new THREE.MeshPhongMaterial({
            map: this.objNameToTexture[key]
          });

        } else {
          console.warn(`Missing name ${child.material.name}`);
        }
      });

      this.floatingIsland = object;
      this.scene.add(object);
    });
  }

  createSky() {
    let scene = this.scene;
    scene.fog = new THREE.Fog(0xffffff, 1, 5000);
    scene.fog.color.setHSL(0.6, 0, 1);
    // LIGHTS
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);
    //
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(50);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    var d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x050505});
    groundMat.color.setHSL(0.095, 1, 0.75);
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -33;
    scene.add(ground);
    ground.receiveShadow = true;
    // SKYDOME
    var vertexShader = `varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`;
    var fragmentShader = `uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
			}`;
    var uniforms = {
      topColor: {value: new THREE.Color(0x0077ff)},
      bottomColor: {value: new THREE.Color(0xffffff)},
      offset: {value: 33},
      exponent: {value: 0.6}
    };
    uniforms.topColor.value.copy(hemiLight.color);
    scene.fog.color.copy(uniforms.bottomColor.value);
    var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    var skyMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide
    });
    var sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
  }

  createScene() {

    this.createSky();
    this.createFloatingIsland();
  }

  drawCall(data) {
    if (!this.transitioning && this.floatingIsland) {
      this.floatingIsland.rotation.y += 0.007;

      if (this.floatingIsland.rotation.y >= Math.PI * 2) {
        this.floatingIsland.rotation.y = 0;
      }
    }
  }

  startAnimTransition(tl) {

    if (this.animState === 0) {

      tl.to(this.floatingIsland.rotation, 0.5, {x: 0, y: 0, z: 0});
      tl.to(this.camera.position, .5, {x: 0, y: -2, z: -20}, '-=0.2');
      tl.to(this.camera.position, .7, {x: 6, y: 5.9, z: -38}, '-=0.3');
      tl.to(this.camera.rotation, 0.7, {y: -0.54}, '-=0.7');
    } else if (this.animState === 1) {
      tl.set(this.floatingIsland.rotation, {x: 0, y: 0, z: 0});
      tl.set(this.camera.position, {x: 0, y: -2, z: -20});
      tl.set(this.camera.position, {x: 6, y: 5.9, z: -38});
      tl.set(this.camera.rotation, {y: -0.54});

      tl.to(this.camera.position, 0.7, {x: 0, y: 0, z: this.startCameraPosition.z});
      tl.to(this.camera.rotation, 0.7, {x: 0, y: 0, z: 0}, '-=0.6');
    }

  }

  startTransition(route) {
    super.startTransition(route);

    let tl = this.timeline = new TimelineLite({
      onComplete: () => {
        this.transitionEnd();

        this.camera.position.x = this.startCameraPosition.x;
        this.camera.position.y = this.startCameraPosition.y;
        this.camera.position.z = this.startCameraPosition.z;

        this.camera.rotation.y = 0;

        if (this.animState === 0) {
          this.animState = 1;
        } else if (this.animState === 1) {
          this.animState = 0;
        }
      }
    });

    if (route.demonstrationShown && this.animState === 0) {
      this.transitionEnd();
      this.animState = 1;
      return;
    }

    this.startAnimTransition(tl);
  }
}
