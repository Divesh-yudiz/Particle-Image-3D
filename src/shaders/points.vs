attribute vec3 position;
attribute vec2 uv;

uniform vec3 mouse;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);
  vec3 subPosition = mouse - mPosition.xyz;
  float force = (500.0 - clamp(length(subPosition), 0.0, 300.0)) / 4.0;
  mPosition = vec4(mPosition.xyz + force * normalize(-subPosition), 1.0);
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * mPosition;
  gl_PointSize = 4.0;
}
