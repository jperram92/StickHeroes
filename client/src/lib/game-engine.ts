import * as THREE from "three";
import { Character } from "@/components/game/character";
import { World } from "@/components/game/world";
import type { User } from "@shared/schema";

export class GameEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private character: Character;
  private world: World;
  private keys: { [key: string]: boolean } = {};

  constructor(canvas: HTMLCanvasElement, user: User) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.world = new World(this.scene);
    this.character = new Character(this.scene, user.character);

    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);

    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
    window.addEventListener("resize", this.handleResize);

    this.animate();
  }

  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private update() {
    const moveSpeed = 0.1;
    if (this.keys["w"]) this.character.moveForward(moveSpeed);
    if (this.keys["s"]) this.character.moveBackward(moveSpeed);
    if (this.keys["a"]) this.character.moveLeft(moveSpeed);
    if (this.keys["d"]) this.character.moveRight(moveSpeed);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    window.removeEventListener("resize", this.handleResize);
    this.renderer.dispose();
  }
}
