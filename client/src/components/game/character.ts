import * as THREE from "three";

export class Character {
  private mesh: THREE.Group;
  private direction: THREE.Vector3;

  constructor(scene: THREE.Scene, character: { color: string; height: number; width: number }) {
    this.mesh = new THREE.Group();
    this.direction = new THREE.Vector3();

    // Create stick figure
    const material = new THREE.MeshBasicMaterial({ color: character.color });
    
    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1 * character.width, 0.1 * character.width, 1 * character.height),
      material
    );
    body.position.y = 0.5 * character.height;
    this.mesh.add(body);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 * character.width),
      material
    );
    head.position.y = 1 * character.height + 0.2;
    this.mesh.add(head);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.05 * character.width, 0.05 * character.width, 0.6 * character.width);
    
    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.position.set(-0.3 * character.width, 0.8 * character.height, 0);
    leftArm.rotation.z = Math.PI / 2;
    this.mesh.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.position.set(0.3 * character.width, 0.8 * character.height, 0);
    rightArm.rotation.z = -Math.PI / 2;
    this.mesh.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.05 * character.width, 0.05 * character.width, 0.6 * character.height);
    
    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.position.set(-0.15 * character.width, 0.3 * character.height, 0);
    this.mesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.position.set(0.15 * character.width, 0.3 * character.height, 0);
    this.mesh.add(rightLeg);

    scene.add(this.mesh);
  }

  moveForward(distance: number) {
    this.mesh.position.z -= distance;
  }

  moveBackward(distance: number) {
    this.mesh.position.z += distance;
  }

  moveLeft(distance: number) {
    this.mesh.position.x -= distance;
  }

  moveRight(distance: number) {
    this.mesh.position.x += distance;
  }
}
