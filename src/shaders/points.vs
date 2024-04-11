attribute vec3 position;
attribute vec2 uv;

uniform vec3 mouse;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c){
  vec4 K=vec4(1.,2./3.,1./3.,3.);
  vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
  return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
}

void main(){
  // coordinate transformation
  vec4 mPosition=modelMatrix*vec4(position,1.);
  vec3 subPosition=mouse-mPosition.xyz;
  float force=(200.-clamp(length(subPosition),0.,50.))/4.;
  mPosition=vec4(mPosition.xyz+force*normalize(-subPosition),1.);
  vUv=uv;
  gl_Position=projectionMatrix*viewMatrix*mPosition;
  gl_PointSize=3.;
}
