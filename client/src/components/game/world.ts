import * as THREE from "three";

export class World {
  constructor(scene: THREE.Scene) {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light with shadows
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add environment elements
    this.addRandomObstacles(scene);
    this.addDecorations(scene);
  }

  private addRandomObstacles(scene: THREE.Scene) {
    const boxGeometry = new THREE.BoxGeometry(1, 2, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      roughness: 0.7,
    });

    // Add some random boxes as obstacles
    for (let i = 0; i < 10; i++) {
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(
        Math.random() * 40 - 20,
        1,
        Math.random() * 40 - 20
      );
      box.castShadow = true;
      box.receiveShadow = true;
      scene.add(box);
    }
  }

  private addDecorations(scene: THREE.Scene) {
    // Add trees
    const treeGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const treeMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5a27,
      roughness: 0.8,
    });

    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x483c32,
      roughness: 0.9,
    });

    for (let i = 0; i < 15; i++) {
      const treeGroup = new THREE.Group();

      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.25;
      treeGroup.add(trunk);

      const leaves = new THREE.Mesh(treeGeometry, treeMaterial);
      leaves.position.y = 1.5;
      treeGroup.add(leaves);

      treeGroup.position.set(
        Math.random() * 40 - 20,
        0,
        Math.random() * 40 - 20
      );

      treeGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      scene.add(treeGroup);
    }
  }
}