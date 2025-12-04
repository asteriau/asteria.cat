<!-- ModelViewer.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  export let modelUrl = '/models/cirno.glb';
  export let scale = 0.1; 
  export let floatHeight = 0.05; 
  export let floatSpeed = 1;
  export let rotationSpeed = 0.5;
  export let backgroundColor = 'transparent';
  
  let container;
  let scene, camera, renderer, model;
  let animationId;
  let fadeInProgress = 0;
  let initialY = 0;
  let time = 0;
  let isMobile = false;
  let mobileScaleFactor = 21.3;
  let modelBoundingBox = null;
  
  onMount(() => {
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
      
      // Update bounding box after scaling
      if (modelBoundingBox) {
        model.updateMatrixWorld(true);
        modelBoundingBox.setFromObject(model);
      }
    }
  }
  
  function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.frustumCulled = false; // Prevent automatic culling
    
    // Create camera with better settings
    camera = new THREE.PerspectiveCamera(
      35, 
      container.clientWidth / container.clientHeight,
      0.1,
      1000 
    );
    camera.position.set(0, 0, 3); 
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true // Helps with depth precision
    });
    
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.localClippingEnabled = false; // Disable clipping
    
    container.appendChild(renderer.domElement);
    
    // Setup lighting
    setupLighting();
    
    // Load the model
    loadModel();
    
    // Start animation loop
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }
  
  function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 5, 5);
    scene.add(directionalLight);
    
    // Fill light
    const fillLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);
  }
  
  async function loadModel() {
    try {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const loader = new GLTFLoader();
      
      loader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;
          
          // Disable frustum culling on all children
          model.traverse((child) => {
            child.frustumCulled = false;
          });
          
          // Apply adjusted scale
          const adjustedScale = getAdjustedScale();
          model.scale.setScalar(adjustedScale);
          
          // Center the model
          centerModel();
          
          // Position model
          model.position.set(0, 0, 0);
          initialY = model.position.y;
          
          // Make model visible
          fadeInProgress = 0;
          
          // Add to scene
          scene.add(model);
          
          // Start fade in animation
          startFadeIn();
          
          console.log('Cirno model loaded successfully');
        },
        (progress) => {
        },
        (error) => {
          console.error('Error loading cirno model:', error);
        }
      );
    } catch (error) {
      console.error('Error importing GLTFLoader:', error);
    }
  }
  
  function centerModel() {
    if (!model) return;
    
    // Create bounding box to understand model size
    modelBoundingBox = new THREE.Box3().setFromObject(model);
    const center = modelBoundingBox.getCenter(new THREE.Vector3());
    const size = modelBoundingBox.getSize(new THREE.Vector3());
    
    console.log('Model size:', size);
    console.log('Model center:', center);
    
    // Center the model
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;
    
    // Adjust camera based on model size
    if (size.length() > 0) {
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / Math.tan(fov / 2));
      
      // Add some margin
      cameraZ *= 1.5;
      camera.position.z = Math.max(cameraZ, 3);
      
      console.log('Adjusted camera distance:', camera.position.z);
    }
    
    // Update bounding box after centering
    model.updateMatrixWorld(true);
    modelBoundingBox.setFromObject(model);
  }
  
  function startFadeIn() {
    // Set initial opacity to 0 and make materials transparent
    if (model) {
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          // Make material transparent for fade effect
          if (!child.material.transparent) {
            child.material.transparent = true;
            child.material.depthWrite = false; // Helps with transparency
          }
          child.material.opacity = 0;
          child.material.needsUpdate = true;
        }
      });
    }
  }
  
  function updateFadeIn(delta) {
    if (fadeInProgress < 1 && model) {
      fadeInProgress = Math.min(fadeInProgress + delta * 2, 1);
      
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = fadeInProgress;
          
          // Add subtle emissive effect during fade in
          if (fadeInProgress < 1) {
            if (!child.material.emissive) {
              child.material.emissive = new THREE.Color(0x88ccff);
            }
            child.material.emissiveIntensity = (1 - fadeInProgress) * 0.1;
          } else {
            child.material.emissiveIntensity = 0;
            // Restore depth write after fade complete
            child.material.depthWrite = true;
          }
          child.material.needsUpdate = true;
        }
      });
    }
  }
  
  function onWindowResize() {
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    // Re-center model if needed
    if (model) {
      centerModel();
    }
  }
  
  function animate(timestamp) {
    animationId = requestAnimationFrame(animate);
    
    // Calculate delta time
    const delta = time ? Math.min((timestamp - time) / 1000, 0.1) : 0.016;
    time = timestamp;
    
    // Update fade in
    updateFadeIn(delta);
    
    // Update model animations
    if (model && fadeInProgress > 0) {
      // Continuous rotation
      model.rotation.y += rotationSpeed * delta;
      
      // Subtle floating animation
      if (floatHeight > 0) {
        const floatOffset = Math.sin(timestamp * 0.001 * floatSpeed) * floatHeight;
        model.position.y = initialY + floatOffset;
      }
      
      // Gentle up/down bob
      model.position.y += Math.sin(timestamp * 0.001) * 0.001;
    }
    
    // Render scene
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  
  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Cleanup Three.js resources
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object.texture) {
          object.texture.dispose();
        }
      });
      scene.clear();
    }
    
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    }
    
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('resize', handleResizeCheck);
  }
  
  // Public methods
  export function setModelScale(newScale) {
    scale = newScale;
    updateModelScale();
  }
  
  export function setFloatHeight(height) {
    floatHeight = height;
  }
  
  export function setRotationSpeed(speed) {
    rotationSpeed = speed;
  }
  
  export function setMobileScaleFactor(factor) {
    mobileScaleFactor = factor;
    updateModelScale();
  }
  
  // Method to manually center the model
  export function centerModelNow() {
    if (model) {
      centerModel();
    }
  }
</script>

<div bind:this={container} class="model-container">
  <!-- Container for Three.js canvas -->
</div>

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
  
  @media (max-width: 768px) {
    .model-container {
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
    }
  }
</style>