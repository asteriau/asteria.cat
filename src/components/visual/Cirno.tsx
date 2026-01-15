'use client'

import { Suspense, useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'

interface CirnoProps {
  modelUrl?: string
  scale?: number
  rotationSpeed?: number
  floatHeight?: number
  floatSpeed?: number
}

function CirnoRenderer({
  modelUrl = '/models/cirno.glb',
  scale = 1,
  rotationSpeed = 2,
  floatHeight = 0.05,
  floatSpeed = 1,
}: CirnoProps) {
  const gltf = useLoader(GLTFLoader, modelUrl)

  // Clone the scene/materials so we never mutate the cached gltf
  const sceneClone = useMemo(() => {
    const cloned = gltf.scene.clone(true) as THREE.Group

    // Reset transform state on the clone so bounding box /scale calculations are deterministic
    cloned.position.set(0, 0, 0)
    cloned.rotation.set(0, 0, 0)
    cloned.scale.set(1, 1, 1)

    // Clone materials so opacity/transparency changes don't affect the original GLTF cache
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((m) => (m as THREE.Material).clone())
        } else {
          child.material = (child.material as THREE.Material).clone()
        }
      }
    })

    return cloned
  }, [gltf])

  const meshRef = useRef<THREE.Object3D | null>(null)
  const fadeProgressRef = useRef(0)
  const initialY = useRef(0)
  const materialsRef = useRef<THREE.Material[]>([])

  // Spring state for entry "bouncy" animation
  const scaleCurrent = useRef(1)
  const scaleVel = useRef(0)
  const scaleTarget = useRef(1)

  const baseYCurrent = useRef(0) // the base (non-float) y that springs to initialY
  const baseYVel = useRef(0)
  const baseYTarget = useRef(0)

  // Parameters controlling the spring feel
  const SCALE_STIFFNESS = 55
  const SCALE_DAMPING = 12
  const Y_STIFFNESS = 35
  const Y_DAMPING = 8

  useEffect(() => {
    if (!sceneClone) return

    // Gather materials and init transparency for fade-in
    materialsRef.current = []
    sceneClone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => {
          const mat = m as any
          // Make transparent and start invisible for fade-in
          if (typeof mat.transparent === 'boolean') mat.transparent = true
          if (typeof mat.opacity === 'number') mat.opacity = 0
          materialsRef.current.push(mat)
        })
      }
    })

    // Reset transforms (i forgot why this is here but if i delete this shit breaks)
    sceneClone.position.set(0, 0, 0)
    sceneClone.rotation.set(0, 0, 0)
    sceneClone.scale.set(1, 1, 1)

    // Compute bounding box and center horizontally
    const bbox = new THREE.Box3().setFromObject(sceneClone)
    const center = new THREE.Vector3()
    bbox.getCenter(center)

    sceneClone.position.x -= center.x
    sceneClone.position.z -= center.z

    // Align bottom to y = 0
    const minY = bbox.min.y
    sceneClone.position.y -= minY
    initialY.current = sceneClone.position.y
    baseYTarget.current = initialY.current // final base Y after entry animation

    // Scale model to fit target size
    const size = new THREE.Vector3()
    bbox.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 1
    const computedScaleFactor = (targetSize / maxDim) * scale
    scaleTarget.current = computedScaleFactor

    // Start entry from a smaller scale for the pop-in (60% of final by default)
    scaleCurrent.current = computedScaleFactor * 0.6
    scaleVel.current = 0

    // Start base Y slightly below final so it "pops" up
    baseYCurrent.current = initialY.current - Math.min(0.12, computedScaleFactor * 0.25)
    baseYVel.current = 0

    // Apply initial visual values to the clone so there's no visible jump
    sceneClone.scale.setScalar(scaleCurrent.current)
    sceneClone.position.y = baseYCurrent.current

    // done wooooo woooo wo yea
  }, [sceneClone, scale])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Fade in materials
    if (fadeProgressRef.current < 1) {
      fadeProgressRef.current = Math.min(fadeProgressRef.current + delta * 2, 1)
      materialsRef.current.forEach((material) => {
        ;(material as any).opacity = fadeProgressRef.current
        ;(material as any).depthWrite = fadeProgressRef.current === 1
      })
    }

    // Simple spring integrator (semi-implicit Euler) for scale
    {
      const x = scaleCurrent.current
      const v = scaleVel.current
      const target = scaleTarget.current
      // acceleration = stiffness * (target - x) - damping * v
      const a = SCALE_STIFFNESS * (target - x) - SCALE_DAMPING * v
      const newV = v + a * delta
      const newX = x + newV * delta
      scaleVel.current = newV
      scaleCurrent.current = newX
      // apply to object
      try {
        meshRef.current.scale.setScalar(scaleCurrent.current)
      } catch (e) {
        // ignore if setting scale fails for some reason
      }
    }

    // Spring for base Y (entry pop), then add float on top
    {
      const y = baseYCurrent.current
      const v = baseYVel.current
      const target = baseYTarget.current
      const a = Y_STIFFNESS * (target - y) - Y_DAMPING * v
      const newV = v + a * delta
      const newY = y + newV * delta
      baseYVel.current = newV
      baseYCurrent.current = newY

      // Float offset on top of base Y
      let floatOffset = 0
      if (floatHeight > 0) {
        floatOffset = Math.sin(state.clock.elapsedTime * floatSpeed) * floatHeight
      }

      meshRef.current.position.y = baseYCurrent.current + floatOffset
    }

    // continuous rotation
    meshRef.current.rotation.y += rotationSpeed * delta
  })

  return <primitive ref={meshRef} object={sceneClone} />
}

export function Cirno({
  modelUrl = '/models/cirno.glb',
  scale = 1,
  rotationSpeed = 2,
  floatHeight = 0.05,
  floatSpeed = 1,
}: CirnoProps) {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const adjustedScale = useMemo(() => {
    return scale // scaling handled in renderer
  }, [scale])

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] md:h-[350px] rounded-[20px] overflow-hidden relative"
    >
      {/* small inner shift to prevent clipping during float/pop. adjust translate-y-2 -> translate-y-[value] as needed */}
      <div className="absolute inset-0 translate-y-2">
        {isVisible && (
          <Canvas
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)}
            frameloop="always"
            performance={{ min: 0.5 }}
          >
            <PerspectiveCamera makeDefault position={[0, 0.15, 3.2]} fov={40} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 5]} intensity={0.8} />
            <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#88ccff" />
            <Suspense fallback={null}>
              <CirnoRenderer
                modelUrl={modelUrl}
                scale={adjustedScale}
                rotationSpeed={rotationSpeed}
                floatHeight={floatHeight}
                floatSpeed={floatSpeed}
              />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        )}
      </div>
    </div>
  )
}
