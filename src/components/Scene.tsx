import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import Truck from './Truck'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 4, 6], fov: 50 }}
      style={{ width: '100vw', height: '100vh', background: '#0f0f1a' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.8} color="#4cc9f0" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Grid on top of ground */}
      <Grid
        args={[20, 20]}
        position={[0, -0.31, 0]}
        cellColor="#4cc9f0"
        sectionColor="#4361ee"
        cellThickness={0.5}
        sectionThickness={1.2}
        fadeDistance={20}
        infiniteGrid
      />

      {/* Truck model */}
      <Truck />

      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  )
}
