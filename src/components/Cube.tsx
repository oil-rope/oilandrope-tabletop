import React, { Component } from "react";
import * as THREE from "three";

export class Cube extends Component {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  cube: THREE.Mesh;

  constructor(props: React.ProfilerProps) {
    super(props);
    this.animate = this.animate.bind(this);
  }

  init(): HTMLCanvasElement {
    // Creating scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a3b4c);

    // Add camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth * 0.98, window.innerHeight);

    // Add geometry
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.cube);

    this.camera.position.z = 5;

    return this.renderer.domElement;
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render(this.scene, this.camera);
  }

  componentDidMount(): void {
    document.getElementById("tabletopID").appendChild(this.init());
    this.animate();
  }

  render(): JSX.Element {
    return <div id="tabletopID"></div>;
  }
}

export default Cube;
