import * as THREE from "three";

export class Character {
  private mesh: THREE.Group;
  private direction: THREE.Vector3;
  private velocity: THREE.Vector3;
  private onGround: boolean;
  private jumpForce: number = 0.15;
  private gravity: number = 0.006;

  constructor(scene: THREE.Scene, character: { color: string; height: number; width: number }) {
    this.mesh = new THREE.Group();
    this.direction = new THREE.Vector3(0, 0, -1);
    this.velocity = new THREE.Vector3();
    this.onGround = true;

    const material = new THREE.MeshPhongMaterial({ 
      color: character.color,
      shininess: 30,
    });

    // Body
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1 * character.width, 0.1 * character.width, 1 * character.height),
      material
    );
    body.castShadow = true;
    body.position.y = 0.5 * character.height;
    this.mesh.add(body);

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 * character.width),
      material
    );
    head.castShadow = true;
    head.position.y = 1 * character.height + 0.2;
    this.mesh.add(head);

    // Arms
    const armGeometry = new THREE.CylinderGeometry(
      0.05 * character.width,
      0.05 * character.width,
      0.6 * character.width
    );

    const leftArm = new THREE.Mesh(armGeometry, material);
    leftArm.castShadow = true;
    leftArm.position.set(-0.3 * character.width, 0.8 * character.height, 0);
    leftArm.rotation.z = Math.PI / 2;
    this.mesh.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, material);
    rightArm.castShadow = true;
    rightArm.position.set(0.3 * character.width, 0.8 * character.height, 0);
    rightArm.rotation.z = -Math.PI / 2;
    this.mesh.add(rightArm);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(
      0.05 * character.width,
      0.05 * character.width,
      0.6 * character.height
    );

    const leftLeg = new THREE.Mesh(legGeometry, material);
    leftLeg.castShadow = true;
    leftLeg.position.set(-0.15 * character.width, 0.3 * character.height, 0);
    this.mesh.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, material);
    rightLeg.castShadow = true;
    rightLeg.position.set(0.15 * character.width, 0.3 * character.height, 0);
    this.mesh.add(rightLeg);

    scene.add(this.mesh);
  }

  move(direction: THREE.Vector3) {
    const rotatedDirection = direction.clone().applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.mesh.rotation.y
    );
    this.mesh.position.add(rotatedDirection);
  }

  rotate(angle: number) {
    this.mesh.rotation.y += angle;
    this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  }

  jump() {
    if (this.onGround) {
      this.velocity.y = this.jumpForce;
      this.onGround = false;
    }
  }

  update() {
    // Apply gravity
    if (!this.onGround) {
      this.velocity.y -= this.gravity;
    }

    this.mesh.position.y += this.velocity.y;

    // Ground collision
    if (this.mesh.position.y <= 0) {
      this.mesh.position.y = 0;
      this.velocity.y = 0;
      this.onGround = true;
    }
  }

  getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }
}