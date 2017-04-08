import BaseDemonstration from './Base.js';
import { Router } from '../../../Router/RouterComponent';
import constants from '../../../constants/AppConstants';
import {TweenLite, TimelineLite} from 'gsap';
import * as THREE from 'three';

export default class CubeDemonstration extends BaseDemonstration {
  constructor(scene, camera) {
    super(scene, camera);

    this.colorsNeedRedefine.background = '#A7DBD8';
    this.colorsNeedRedefine.theme = '#A7DBD8';
    this.colorsNeedRedefine.menu = '#6b2020';
    this.colorsNeedRedefine.menu_background = '#E0E4CC';

    this.initLighting();

    this.createScene();

    this.initOrbitControls();

    this.cubeHovered = false;

    this.sceneSelector = 'body';
  }

  initLighting() {
    let light = new THREE.DirectionalLight(0xffffff, 1);

    light.position.y = 1;
    //light.position.x = -3;
    light.position.z = 5;

    let secondLight = new THREE.DirectionalLight(0xffffff, 1);

    secondLight.position.z = -5;
    secondLight.rotation.y = Math.PI;

    this.scene.add(secondLight);
    this.scene.add(light);
  }

  checkIfIntersects(event) {
    let camera = this.camera,
      mouse = new THREE.Vector2();

    if (event.changedTouches && event.changedTouches[0]) {
      mouse.x = +(event.changedTouches[0].pageX / window.innerWidth) * 2 + -1;
      mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
    } else {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    }

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects([this.cube]);

    return intersects;
  }

  onDragEndHandler(event) {

    let intersects = this.checkIfIntersects(event);
    if (intersects) {
      for (var i = 0; i < intersects.length; i++) {

        let selected = this.materialTexts[intersects[i].face.materialIndex];

        if (selected) {

          if (this.deltaMove.x == 0 && this.deltaMove.y == 0) {
            selected = selected === 'Home' ? '' : selected.toLowerCase();

             Router.Instance.go(selected);
          }

          break;
        }
      }
    }

    this.isDragging = false;

    this.timeoutId = setTimeout(()=> {
      this.revertToInitial();
    }, 3500);
  }

  onDragStartHandler(event) {
    //event.preventDefault();

    this.isDragging = true;
    this.deltaMove = {x: 0, y: 0};

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  onDragHandler(e) {

    let deltaMove = this.deltaMove = {
      x: THREE.Math.clamp(e.offsetX - this.previousMousePosition.x, -4.2, 4.2),
      y: THREE.Math.clamp(e.offsetY - this.previousMousePosition.y, -1.2, 1.2)
    };

    if (!window.mobileAndTabletcheck()) {
      let intersections = this.checkIfIntersects(e),
        previousHoverState = this.cubeHovered,
        hoveredTextSide = '';

      if (intersections && intersections[0] && intersections[0].object.name === 'dragonCube') {
        this.cubeHovered = true;

        hoveredTextSide = this.materialTexts[intersections[0].face.materialIndex];

      } else {
        this.cubeHovered = false;
      }

      if (previousHoverState !== this.cubeHovered) {
        this.hoverStatusChanged(e);
      }

      if (this.cubeHovered) {
        let url = Router.Instance.getLinkForRouteName(hoveredTextSide);
        this.interactionAnchor.attr('href', url);

        if(url.indexOf('http') !== -1){
          this.interactionAnchor.attr('target', '_blank');
        } else {
          this.interactionAnchor.attr('target', '');
        }
      }

    }
    if (this.isDragging) {

      e.preventDefault && e.preventDefault();

      let deltaRotationQuaternion = new THREE.Quaternion().
        setFromEuler(
        new THREE.Euler(THREE.Math.degToRad(deltaMove.y * 1), THREE.Math.degToRad(deltaMove.x * 1), 0, 'XYZ')
      );

      this.cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.cube.quaternion);
    }

    this.previousMousePosition = {
      x: e.offsetX,
      y: e.offsetY
    };
  }

  hoverStatusChanged(event) {
    if (this.cubeHovered) {


      if (!this.interactionAnchor) {
        this.interactionAnchor = $(document.createElement('a'));
      }

      let anchor = this.interactionAnchor;

      anchor.on('mouseover', (e)=> {
        e.preventDefault();
      });

      anchor.on('mouseup', (e)=> {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
      });

      anchor.on('mousedown', (e)=> {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = false;
      });

      anchor.text("     ");
      //anchor.css('background-color', 'purple');
      anchor.attr('href', 'about');
      anchor.css('width', '9em');
      anchor.css('height', '9em');
      anchor.css('position', 'absolute');


      $('body')[0].appendChild(anchor[0]);

      anchor.css('top', window.innerHeight / 2 - anchor.height() / 2);
      anchor.css('left', window.innerWidth / 2 - anchor.width() / 2);
    }
  }

  initOrbitControls() {

  }

  onCreate() {
    this.isDragging = false;
    this.previousMousePosition = {
      x: 0,
      y: 0
    };

    const renderArea = $(this.sceneSelector)[0];

    if (this.onDragEndBind)
      return;

    this.onDragStartBind = this.onDragStartHandler.bind(this);
    this.onDragEndBind = this.onDragEndHandler.bind(this);
    this.onDragMoveBind = this.onDragHandler.bind(this);

    if (window.mobileAndTabletcheck()) {

      $('html').css('overflow', 'hidden');

      renderArea.addEventListener('touchstart', this.onDragStartBind);

      this.onDragMoveBind = (e) => {
        //e.preventDefault();
        //e.stopPropagation && e.stopPropagation();
        //e.stopImmediatePropagation();
        e = e.touches[0];

        e.offsetX = e.pageX;
        e.offsetY = e.pageY;

        this.onDragHandler(e);
      };
      renderArea.addEventListener('touchmove', this.onDragMoveBind);

      renderArea.addEventListener('touchend', this.onDragEndBind);
    } else {

      if (this.interactionAnchor)
        this.interactionAnchor.css('visibility', 'visible');

      /*renderArea*/
      document.addEventListener('mousedown', this.onDragStartBind);

      renderArea.addEventListener('mousemove', this.onDragMoveBind);

      document.addEventListener('mouseup', this.onDragEndBind);
    }
  }

  onDestroy() {
    const renderArea = $(this.sceneSelector)[0];

    if (window.mobileAndTabletcheck()) {
      $('html').css('overflow', '');
      renderArea.removeEventListener('touchstart', this.onDragStartBind);
      renderArea.removeEventListener('touchmove', this.onDragMoveBind);
      renderArea.removeEventListener('touchend', this.onDragEndBind);
    } else {

      if (this.interactionAnchor)
        this.interactionAnchor.css('visibility', 'hidden');

      renderArea.removeEventListener('mousedown', this.onDragStartBind);
      renderArea.removeEventListener('mousemove', this.onDragMoveBind);
      document.removeEventListener('mouseup', this.onDragEndBind);
    }

    this.onDragEndBind = null;
    this.onDragStartBind = null;
    this.onDragMoveBind = null;
  }

  revertToInitial() {
    let tl = this.timeline = new TimelineLite({});

    tl.to(this.cube.rotation, 0.2, {x: 0, y: 0, z: 0});
  }

  createScene() {
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    /*
     cubeMaterial = new THREE.MeshPhongMaterial({
     color: 0xe12727,
     morphTargets: true
     });*/


    var texts = this.materialTexts = ["About", "Blog", "Github", "Youtube", "Home", "Projects"];
    var materials = [];

    var colorPallete = ['#69D2E7', '#69D2E7', '#E0E4CC'/*'#E0E4CC'*/, '#E0E4CC', '#FA6900', '#F38630'];

    for (let i = 0; i < 6; i++) {

      materials[i] = new THREE.MeshBasicMaterial({color: 0xffffffff});

      var x = document.createElement("canvas");
      var xc = x.getContext("2d");
      x.width = x.height = 256;

      xc.font = "50pt Caveat Brush";
      xc.fillStyle = colorPallete[i];

      xc.fillRect(0, 0, x.width, x.height);

      if (i !== 2 && i !== 3) {
        xc.fillStyle = "#000000";
        xc.textAlign = "center";
        xc.textBaseline = "middle";

        xc.fillText(texts[i], x.width / 2, x.height / 2);
      }

      if (i == 2) {

        let github = new Image();

        this.gitXc = xc;
        github.onload = () => {
          let width = 256, height = 256;
          this.gitXc.drawImage(github, x.width / 2 - width / 2, x.height / 2 - height / 2, width, height);
          materials[2].map.needsUpdate = true;

          this.gitXc = null;
          delete this.gitXc;
        };

        github.src = '/assets/images/github.png';
      } else if (i == 3) {
        let youtube = new Image();

        this.youtubeXc = xc;
        youtube.onload = () => {
          let width = 256, height = 256;
          this.youtubeXc.drawImage(youtube, x.width / 2 - width / 2, x.height / 2 - height / 2, width, height);
          materials[3].map.needsUpdate = true;

          this.youtubeXc = null;
          delete this.youtubeXc;
        };

        youtube.src = '/assets/images/youtube.png';
      }

      materials[i].morphTargets = true;
      materials[i].map = new THREE.Texture(x);
      materials[i].map.needsUpdate = true;
      materials[i].map.anisotropy = 4;
    }

    for (var i = 0; i < 8; i++) {
      var vertices = [];
      for (var v = 0; v < cubeGeometry.vertices.length; v++) {
        vertices.push(cubeGeometry.vertices[v].clone());

        if (v === i) {
          vertices[vertices.length - 1].x *= 1.5;
          vertices[vertices.length - 1].y *= 1.5;
          vertices[vertices.length - 1].z *= 1.5;
        }
      }

      cubeGeometry.morphTargets.push({name: "target" + 0, vertices: vertices});
    }

    let cube = this.cube = new THREE.Mesh(cubeGeometry, new THREE.MultiMaterial(materials)/*cubeMaterial*/);

    cube.name = 'dragonCube';

    this.scene.add(cube);

    this.emit(constants.DEMONSTRATION_LOADED);
  }

  on(eventName, listener) {
    super.on(eventName, listener);

    if (eventName === constants.DEMONSTRATION_LOADED && this.cube) {
      this.emit(constants.DEMONSTRATION_LOADED);
    }
  }

  drawCall(data) {
  }

  startRandomTransition(tl) {
    var random = THREE.Math.randInt(0, 1);

    if (random === 0) {
      this.bounceAnim(tl);
    } else {
      this.morphAnim(tl);
    }
  }

  bounceAnim(tl) {
    tl.to(this.cube.scale, 0.25, {x: 0.85, y: .85, z: .85, ease: Bounce.easeOut});
    tl.to(this.cube.position, .5, {x: 2, y: 2, z: 0, ease: Bounce.easeOut}, '-=0.25');
    tl.to(this.cube.position, .5, {x: -2, y: 2, z: 0, ease: Bounce.easeOut});
    tl.to(this.cube.scale, 0.25, {x: 1, y: 1, z: 1}, '-=0.5');
    tl.to(this.cube.position, 0.25, {x: 0, y: 0, z: 0});
  }

  morphAnim(tl) {

    //let meshMorph = {2: 0}, meshMorphSecond = {2: 0};
    //tl.to(meshMorph, 0.5, {
    //  2: 0.8, onUpdate: ()=> {
    //    this.cube.morphTargetInfluences[0] = meshMorph['2'];
    //  }
    //});
    //
    //tl.to(meshMorph, 0.5, {
    //  2: 0, onUpdate: ()=> {
    //    this.cube.morphTargetInfluences[0] = meshMorph['2'];
    //  }
    //});


    let meshMorph = {2: 0}, meshMorphSecond = {2: 0};

    tl.to(meshMorph, 0.5, {
      2: 0.8, onUpdate: ()=> {
        this.cube.morphTargetInfluences[0] = meshMorph['2'];
        this.cube.morphTargetInfluences[1] = meshMorph['2'];
        this.cube.morphTargetInfluences[2] = meshMorph['2'];
        this.cube.morphTargetInfluences[3] = meshMorph['2'];
      }
    });

    tl.to(meshMorphSecond, 0.5, {
      2: 0.8, onUpdate: ()=> {
        this.cube.morphTargetInfluences[4] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[5] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[6] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[7] = meshMorphSecond['2'];
      }
    });

    tl.to(meshMorph, 0.5, {
      2: 0, onUpdate: ()=> {
        this.cube.morphTargetInfluences[0] = meshMorph['2'];
        this.cube.morphTargetInfluences[1] = meshMorph['2'];
        this.cube.morphTargetInfluences[2] = meshMorph['2'];
        this.cube.morphTargetInfluences[3] = meshMorph['2'];
      }
    });

    tl.to(meshMorphSecond, 0.5, {
      2: 0, onUpdate: ()=> {
        this.cube.morphTargetInfluences[4] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[5] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[6] = meshMorphSecond['2'];
        this.cube.morphTargetInfluences[7] = meshMorphSecond['2'];
      }
    });
  }

  interruptTransition() {
    super.interruptTransition();

    //TweenLite.set(this.cube.rotation, {x: 0, y: 0, z: 0});
    TweenLite.set(this.cube.scale, {x: 1, y: 1, z: 1});
    TweenLite.set(this.cube.position, {x: 0, y: 0, z: 0});

  }

  playInitialAnimation() {
    let tl = this.timeline = new TimelineLite({});

    setTimeout(()=> {
      tl.to(this.cube.rotation, 1, {x: 0, y: Math.PI * 2, z: 0});
      tl.to(this.cube.rotation, 1, {x: 0, y: 0, z: 0});
    }, 500);
  }

  startTransition(route) {
    super.startTransition(route);

    let tl = this.timeline = new TimelineLite({
        onComplete: () => {
          setTimeout(()=> {

            if (this.timeline) {
              this.transitionEnd();
            }

          }, 200);
        }
      }),
      routeName = route.hash,
      faceToRotationMap = {'': 0, 'about': -Math.PI / 2, 'projects': -Math.PI};

    tl.to(this.cube.rotation, 0.3, {x: 0, y: 0, z: 0});
    TweenLite.set(this.cube.scale, {x: 1, y: 1, z: 1});
    TweenLite.set(this.cube.position, {x: 0, y: 0, z: 0});

    tl.to(this.cube.scale, 0.5, {y: 0.7, ease: Elastic.easeOut.config(1, 0.3)});
    if (routeName !== '') {
      tl.to(this.cube.rotation, 0.8, {ease: Expo.easeOut, y: faceToRotationMap[routeName]}, '-=0.1');
    }

    tl.to(this.cube.scale, 0.5, {y: 2, z: 2, x: 2, ease: Elastic.easeOut.config(1, 0.3)});

    tl.to(this.cube.scale, 0.4, {x: 1, y: 1, z: 1});

    //this.startRandomTransition(tl);
  }
}
