import * as THREE from "three";

export class World {
  constructor(scene: THREE.Scene) {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Add simple obstacles
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      roughness: 0.7,
    });

    // Add some random boxes as obstacles
    for (let i = 0; i < 5; i++) {
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      box.position.set(
        Math.random() * 10 - 5,
        0.5,
        Math.random() * 10 - 5
      );
      scene.add(box);
    }
  }
}
