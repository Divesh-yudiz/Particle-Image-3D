import * as THREE from 'three'
import { MathEx } from '@ykob/js-util'
import fragment from '../shaders/points.fs';
import vertex from '../shaders/points.vs';


export default class Points {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      tex: {
        type: 't',
        value: null
      },
      mouse: {
        type: 'v3',
        value: new THREE.Vector3()
      },
    };
    this.obj;
  }
  createObj(tex) {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(800, 800, 200, 200);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time, camera, mousemove) {
    this.uniforms.time.value += time;
    const v = new THREE.Vector3();
    v.set(mousemove.x, mousemove.y, -1);
    v.unproject(camera);
    const dir = v.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    this.uniforms.mouse.value.copy(pos);
  }
}
