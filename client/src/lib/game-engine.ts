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
  private mouseDown: boolean = false;
  private mouseMoveSpeed: number = 0.002;

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
    this.renderer.shadowMap.enabled = true;

    this.world = new World(this.scene);
    this.character = new Character(this.scene, user.character);

    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(this.character.getPosition());

    this.setupControls();
    this.animate();
  }

  private setupControls() {
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousedown", () => (this.mouseDown = true));
    window.addEventListener("mouseup", () => (this.mouseDown = false));
    window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.mouseDown) return;

    const deltaX = event.movementX * this.mouseMoveSpeed;
    const deltaY = event.movementY * this.mouseMoveSpeed;

    this.character.rotate(deltaX);
    this.camera.position.y = Math.max(2, Math.min(10, 
      this.camera.position.y - deltaY * 5
    ));
  }

  private handleResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private update() {
    const moveSpeed = 0.1;
    const moveDirection = new THREE.Vector3();

    if (this.keys["w"]) moveDirection.z -= 1;
    if (this.keys["s"]) moveDirection.z += 1;
    if (this.keys["a"]) moveDirection.x -= 1;
    if (this.keys["d"]) moveDirection.x += 1;
    if (this.keys[" "]) this.character.jump();

    if (moveDirection.length() > 0) {
      moveDirection.normalize().multiplyScalar(moveSpeed);
      this.character.move(moveDirection);
    }

    this.character.update();

    // Camera follows character
    const characterPos = this.character.getPosition();
    const cameraTarget = new THREE.Vector3(
      characterPos.x,
      characterPos.y + 2,
      characterPos.z
    );
    this.camera.lookAt(cameraTarget);
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("mousedown", () => (this.mouseDown = true));
    window.removeEventListener("mouseup", () => (this.mouseDown = false));
    window.removeEventListener("mousemove", (e) => this.handleMouseMove(e));
    this.renderer.dispose();
  }
}