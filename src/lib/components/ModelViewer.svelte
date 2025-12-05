<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

  export let modelUrl: string = '/models/cirno.glb';
  export let scale: number = 0.1;
  export let floatHeight: number = 0.05;
  export let floatSpeed: number = 1;
  export let rotationSpeed: number = 0.5;
  export let backgroundColor: string = 'transparent';

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let model: THREE.Object3D;
  let animationId: number;
  let fadeInProgress = 0;
  let initialY = 0;
  let time = 0;
  let isMobile = false;
  let mobileScaleFactor = 21.3;
  let modelBoundingBox: THREE.Box3;

  onMount(() => {
    if (!container) return;
    checkMobile();
    init();
    return cleanup;
  });

  function checkMobile() {
    isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', handleResizeCheck);
  }

  function handleResizeCheck() {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      updateModelScale();
    }
  }

  function getAdjustedScale() {
    return isMobile ? scale * mobileScaleFactor : scale;
  }

  function updateModelScale() {
    if (model) {
      const adjustedScale = getAdjustedScale();
      model.scale.setScalar(adjustedScale);
      if (modelBoundingBox) modelBoundingBox.setFromObject(model);
    }
  }

  function init() {
    // Scene
    scene = new THREE.Scene();
    scene.frustumCulled = false;

    // Camera
    camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    // Load model
    loadModel();

    // Animation
    animate();

    window.addEventListener('resize', onWindowResize);
  }

  function loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) child.frustumCulled = false;
        });
        const adjustedScale = getAdjustedScale();
        model.scale.setScalar(adjustedScale);
        centerModel();
        model.position.set(0, 0, 0);
        initialY = model.position.y;
        fadeInProgress = 0;
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );
  }

  function centerModel() {
    if (!model) return;
    modelBoundingBox = new THREE.Box3().setFromObject(model);
    const center = modelBoundingBox.getCenter(new THREE.Vector3());
    const size = modelBoundingBox.getSize(new THREE.Vector3());

    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.tan(fov / 2)) * 1.5;
    camera.position.z = Math.max(cameraZ, 3);

    model.updateMatrixWorld(true);
    modelBoundingBox.setFromObject(model);
  }

  function updateFadeIn(delta: number) {
    if (fadeInProgress < 1 && model) {
      fadeInProgress = Math.min(fadeInProgress + delta * 2, 1);
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.depthWrite = false;
          child.material.opacity = fadeInProgress;
          child.material.needsUpdate = true;
          if (fadeInProgress === 1) child.material.depthWrite = true;
        }
      });
    }
  }

  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    if (model) centerModel();
  }

  function animate(timestamp?: number) {
    animationId = requestAnimationFrame(animate);
    const delta = time ? Math.min(((timestamp || 0) - time) / 1000, 0.1) : 0.016;
    time = timestamp || 0;

    updateFadeIn(delta);

    if (model && fadeInProgress > 0) {
      model.rotation.y += rotationSpeed * delta;
      if (floatHeight > 0) {
        const floatOffset = Math.sin(timestamp * 0.001 * floatSpeed) * floatHeight;
        model.position.y = initialY + floatOffset;
      }
      model.position.y += Math.sin(timestamp * 0.001) * 0.001;
    }

    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);
    if (scene) {
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      scene.clear();
    }
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (container?.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    }
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('resize', handleResizeCheck);
  }
</script>

<div bind:this={container} class="model-container"></div>

<style>
.model-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.model-container canvas {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: crisp-edges;
}
</style>
