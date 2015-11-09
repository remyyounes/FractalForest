import Physijs from 'physijs-browserify';
import THREE from 'three';
const P = Physijs(THREE);

P.scripts.worker = 'libs/physi-worker.js';
P.scripts.ammo = 'ammo.js';

let pos = 0;
let renderer = null;
let scene = null;
let light = null;
let box = null;
let trunk = null;
let ground = null;
let camera = null;

function initBoxes() {
  const boxMaterial = P.createMaterial(
    new THREE.MeshBasicMaterial({ color: 0x00FF00 }),
    0, // friction
    32.8 // restitution/bounciness
  );

  box = new P.BoxMesh(
    new THREE.CubeGeometry( 15, 15, 15 ),
    boxMaterial,
  );

  trunk = new P.BoxMesh(
    new THREE.CubeGeometry( 15, 15, 15 ),
    boxMaterial
  );
  trunk.position.copy( new THREE.Vector3(0, -30, 0) );
  const boxPosition = new THREE.Vector3(0, 10, 0);
  box.position.copy( boxPosition );
  box.rotation.x = (20) * Math.PI / 180;
  scene.add(box);
  scene.add(trunk);
}

function initGround() {
  const boxMaterial = P.createMaterial(
    new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    0, // friction
    0.01 // restitution/bounciness
  );

  ground = new P.BoxMesh(
    new THREE.CubeGeometry( 50, 1, 50 ),
    boxMaterial,
    0
  );

  ground.position.copy( new THREE.Vector3(0, -40, 0) );
  scene.add(ground);
}

function initRenderer(mount) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  mount.appendChild( renderer.domElement );
}

function initLight() {
  // Light
  light = new THREE.DirectionalLight( 0xFFFFFF );
  light.position.set( 20, 40, -15 );
  light.target.position.copy( scene.position );
  light.castShadow = true;
  light.shadowCameraLeft = -60;
  light.shadowCameraTop = -60;
  light.shadowCameraRight = 60;
  light.shadowCameraBottom = 60;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 200;
  light.shadowBias = -0.0001;
  light.shadowMapWidth = light.shadowMapHeight = 2048;
  light.shadowDarkness = 0.7;
  scene.add( light );
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set( 60, 50, 60 );
  camera.lookAt( new THREE.Vector3(0, -10, 0));
  scene.add( camera );
}

function initScene() {
  scene = new P.Scene();
  scene.setGravity(new THREE.Vector3( 0, 0, 0 ));
  scene.addEventListener(
    'update',
    function onUpdatedPhysics() {
      scene.simulate( undefined, 2 );
    }
  );
}

function fixBranch() {
  const anchor = new THREE.Vector3(0, 35, 0);
  const target = box.position.clone().sub( anchor.add(trunk.position) );
  const distance = target.length();
  const v = box.getLinearVelocity().length();
  const k = 20000;
  const b = 10300;
  const vb = v * b;
  const kd = k * distance;
  const force = kd - vb;
  console.log(force);
  box.applyCentralForce(target.multiplyScalar(-force));
}

function render() {
  fixBranch();
  scene.simulate();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}


function main() {
  const mount = window.document.body.appendChild(
    document.createElement('div')
  );

  initRenderer(mount);
  initScene();
  initCamera();
  initLight();
  initGround();
  initBoxes();
  requestAnimationFrame(render);
}

main();
