import Physijs from 'physijs-browserify';
import THREE from 'three';
const P = Physijs(THREE);

P.scripts.worker = 'libs/physi-worker.js';
P.scripts.ammo = 'ammo.js';

let renderer = null;
let scene = null;
let light = null;
let box = null;
let trunk = null;
let ground = null;
let camera = null;

function initBoxes() {
  const boxMaterial = P.createMaterial(
    new THREE.MeshBasicMaterial({
      color: 0x00FF00, transparent: true, opacity: 0.4 }
    ),
    0, // friction
    32.8 // restitution/bounciness
  );

  box = new P.BoxMesh( new THREE.CubeGeometry( 1, 1, 1 ), boxMaterial );
  trunk = new P.BoxMesh( new THREE.CubeGeometry( 15, 15, 15 ), boxMaterial );

  trunk.position.copy( new THREE.Vector3(0, -30, 0) );
  box.position.copy( new THREE.Vector3(0, 20, 0) );

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

function initRenderer(mount, width, height) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( width, height );
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

function initCamera(width, height) {
  camera = new THREE.PerspectiveCamera( 35, width / height, 1, 1000 );
  camera.position.set( 50, 30, 60 );
  camera.lookAt( new THREE.Vector3(0, 5, 0));
  scene.add( camera );
}

function initScene() {
  scene = new P.Scene();
  scene.setGravity(new THREE.Vector3( 0, -5, 0 ));
  scene.addEventListener(
    'update',
    function onUpdatedPhysics() {
      scene.simulate( undefined, 2 );
    }
  );
}


function createVector(name, color, opacity) {
  const transparent = true;
  const geometry = new THREE.Geometry();
  const material = new THREE.LineBasicMaterial({ color, transparent, opacity });
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  const line = new THREE.Line(geometry, material);
  line.name = name;
  scene.add(line);
}

function initVectors() {
  createVector('springLine', 0x00ffff, 0.5 );
  createVector('velocityLine', 0xff0000, 1.5 );
  createVector('dampLine', 0xffff00, 1.5 );
}

function showForce(position, force, lineName) {
  const line = scene.getObjectByName(lineName);
  line.geometry.vertices[0] = position.clone();
  line.geometry.vertices[1] = position.clone().add(force);
  line.geometry.verticesNeedUpdate = true;
}

function getDampingForce(damping, velocity) {
  const damp = -damping * velocity.length();
  return velocity.clone().normalize().multiplyScalar(damp);
}

function getSpringForce(coefficient, target) {
  const distance = target.length();
  const force = -coefficient * distance;
  return target.clone().normalize().multiplyScalar(force);
}

function anchorTo(anchor, options, body) {
  const bodyPos = body.position;
  const target = bodyPos.clone().sub(anchor);
  const velocity = body.getLinearVelocity();
  const dampForce = getDampingForce(options.damping, velocity);
  const springForce = getSpringForce(options.coefficient, target);

  body.applyCentralForce(springForce.add(dampForce));

  showForce( bodyPos, velocity, 'velocityLine' );
  showForce( bodyPos, springForce, 'springLine' );
  showForce( bodyPos, dampForce, 'dampLine' );
}

function fixBranch() {
  const offset = new THREE.Vector3(0, 35, 0);
  const anchor = offset.add(trunk.position.clone());

  anchorTo(anchor, {coefficient: 8, damping: 1}, box);
}

function render() {
  fixBranch();
  scene.simulate();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}


function main() {
  const { document, innerWidth: width, innerHeight: height } = window;
  const mount = document.body.appendChild(
    document.createElement('div')
  );

  initRenderer(mount, width, height);
  initScene();
  initCamera(width, height);
  initLight();
  initGround();
  initBoxes();
  initVectors();
  requestAnimationFrame(render);
}

main();
