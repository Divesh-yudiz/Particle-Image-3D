import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import fragment from '../shaders/points.fs';
import vertex from '../shaders/points.vs';
import texsSrc from '../assets/Images/nature-1.jpg'

import { debounce } from '@ykob/js-util';
import loadTexs from '../LoaderManager/loadTexs.js'
import Points from './Points.js'

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};
const resolution = new THREE.Vector2(device.width, device.height);
const mousemove = new THREE.Vector2();

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.camera = new THREE.PerspectiveCamera(
      75,
      device.width / device.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 2);
    this.camera.far = 50000;
    this.camera.setFocalLength(24);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

    this.controls = new OrbitControls(this.camera, this.canvas);

    this.clock = new THREE.Clock();
    this.points = new Points();
    this.setLights();
    this.setGeometry();
    window.addEventListener('mousemove', this.onMouseMove);
    this.render();
    this.setResize();
  }

  onMouseMove = (e) => {
    mousemove.set(
      e.clientX / resolution.x * 2 - 1,
      -(e.clientY / resolution.y) * 2 + 1
    );
  };

  setLights() {
    this.ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1, 1));
    this.scene.add(this.ambientLight);
  }

  setGeometry() {

    var loader = new THREE.TextureLoader();

    // load a texture
    loader.load(
      // URL of the texture
      texsSrc,
      // callback function
      (texture) => {
        // Texture loaded callback
        this.camera.position.set(0, 0, 1200);
        this.camera.lookAt(0, 0, 0);

        this.points.createObj(texture);

        this.scene.add(this.points.obj);
      }
    );

  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();
    this.points.render(elapsedTime, this.camera, mousemove);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
