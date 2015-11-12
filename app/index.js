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
let springLine = null;
let velocityLine = null;
let dampLine = null;

function initBoxes() {
  const boxMaterial = P.createMaterial(
    new THREE.MeshBasicMaterial({ color: 0x00FF00, transparent: true, opacity: 0.4 }),
    0, // friction
    32.8 // restitution/bounciness
  );

  box = new P.BoxMesh(
    new THREE.CubeGeometry( 1, 1, 1 ),
    boxMaterial,
  );

  trunk = new P.BoxMesh(
    new THREE.CubeGeometry( 15, 15, 15 ),
    boxMaterial
  );
  trunk.position.copy( new THREE.Vector3(0, -30, 0) );
  const boxPosition = new THREE.Vector3(0, 20, 0);
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
  camera.position.set( 50, 30, 60 );
  camera.lookAt( new THREE.Vector3(0, 5, 0));
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

function initVectors() {
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  const materialRed = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 1.5 });
  const materialYellow = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1.5 });
  const geometry = new THREE.Geometry();
  const velocityGeometry = new THREE.Geometry();
  const dampGeometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  velocityGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  velocityGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  dampGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  dampGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  springLine = new THREE.Line(geometry, material);
  velocityLine = new THREE.Line(velocityGeometry, materialRed);
  dampLine = new THREE.Line(dampGeometry, materialYellow);
  scene.add(springLine);
  scene.add(velocityLine);
  scene.add(dampLine);
}

function fixBranch() {
  const anchor = new THREE.Vector3(0, 35, 0).add(trunk.position.clone());
  const target = box.position.clone().sub( anchor );

  const distance = target.length();
  const velocity = box.getLinearVelocity();
  const v = velocity.length();
  const k = 200;
  const b = 10;
  // const vb = velocity.y < 0 ? -v * b : v * b;
  // const vb = v * b;
  // const vb = velocity.length() * b;
  const vb = v * b;
  const kd = k * distance;
  const force = -kd;
  const finalForce = target.clone().normalize().multiplyScalar(force);
  const dampForce = velocity.clone().normalize().multiplyScalar(-vb);
  console.log(force);


  velocityLine.geometry.vertices[0] = box.position.clone();
  velocityLine.geometry.vertices[1] = box.position.clone().add(box.getLinearVelocity().clone());
  springLine.geometry.vertices[0] = box.position.clone();
  springLine.geometry.vertices[1] = box.position.clone().add(finalForce);
  dampLine.geometry.vertices[0] = box.position.clone();
  dampLine.geometry.vertices[1] = box.position.clone().add(dampForce);

  velocityLine.geometry.verticesNeedUpdate = true;
  springLine.geometry.verticesNeedUpdate = true;
  dampLine.geometry.verticesNeedUpdate = true;

  box.applyCentralForce(finalForce);
  box.applyCentralForce(dampForce);
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
  initVectors();
  requestAnimationFrame(render);
}

main();
