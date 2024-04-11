import * as THREE from 'three'

const texLoader = new THREE.TextureLoader();

export default function(imgs, callback) {
  const textures = [];
  
  // Load textures
  for (let i = 0; i < imgs.length; i++) {
    texLoader.load(imgs[i], (texture) => {
      textures.push(texture);
      if (textures.length === imgs.length) {
        callback(textures);
      }
    });
  }
}