import { Vector3, Euler } from 'three';

const RAD = Math.PI / 180;
const medianAngle = 30;
const counterSpeed = 3;
let counter = 0;

class Branch {
  constructor(props) {
    this.depth = props.depth;
    this.start = props.start;
    this.end = props.end;
    if (this.depth) this.spawnBranches(this.start, this.end);
  }

  getRotation() {
    const range = 10;
    const correction = Math.cos( counter * RAD ) * range - range / 2;
    return (medianAngle + correction) * RAD;
  }

  spawnBranches(start, end) {
    const rotation = this.getRotation();
    const branchVector = end.clone().sub(start);
    const scale = 0.6;
    const depth = this.depth - 1;
    const rotationA = new Euler( 0, 0, -rotation, 'XYZ' );
    const rotationB = new Euler( 0, 0, rotation, 'XYZ' );

    const endA = branchVector
      .clone()
      .multiplyScalar(scale)
      .applyEuler(rotationA)
      .add(end);

    const endB = branchVector
      .clone()
      .multiplyScalar(scale)
      .applyEuler(rotationB)
      .add(end);

    const branchA = new Branch({ start: end, end: endA, depth });
    const branchB = new Branch({ start: end, end: endB, depth });

    this.branches = [branchA, branchB];
  }
}

class TreeSimulator {

  constructor(props) {
    this.origin = props.origin;
    this.depth = props.depth;

    this.onUpdate = props.onUpdate;
    requestAnimationFrame( () => this.update() );
  }

  buildTree() {
    this.start = new Vector3( this.origin.x, this.origin.y );
    this.end = new Vector3( 0, -200 ).add( this.start );
    const { start, end, depth } = this;
    this.tree = new Branch({ start, end, depth });
  }

  update() {
    counter += counterSpeed;
    this.buildTree();
    this.onUpdate(this.tree);
    requestAnimationFrame( () => this.update() );
  }
}

export default TreeSimulator;
