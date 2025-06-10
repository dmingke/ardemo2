import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.154.0/examples/jsm/loaders/GLTFLoader.js?module';
import { ARButton } from 'https://unpkg.com/three@0.154.0/examples/jsm/webxr/ARButton.js?module';


let camera, scene, renderer, controller, mixer;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // XR session
  document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }));

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Load GLB Model with Animation
  const loader = new GLTFLoader();
  loader.load('base_basic_shaded.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.visible = false;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());

    // Tap to place model
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
      model.position.setFromMatrixPosition(controller.matrixWorld);
      model.visible = true;
    });
    scene.add(controller);
  });
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render(timestamp, frame) {
  if (mixer) mixer.update(0.016);
  renderer.render(scene, camera);
}
