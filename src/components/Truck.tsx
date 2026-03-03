import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

// ----- Wheel positions (defined outside component to avoid recreation) -----
const TRACTOR_WHEEL_POSITIONS: [number, number, number][] = [
  [2.2, 0.43, 0.88],   // front left
  [2.2, 0.43, -0.88],  // front right
  [-0.75, 0.43, 0.9],  // rear axle 1 left
  [-0.75, 0.43, -0.9], // rear axle 1 right
  [-1.65, 0.43, 0.9],  // rear axle 2 left (tandem)
  [-1.65, 0.43, -0.9], // rear axle 2 right (tandem)
]

const TRAILER_WHEEL_POSITIONS: [number, number, number][] = [
  [-9.2, 0.43, 0.9],   // axle 1 left
  [-9.2, 0.43, -0.9],  // axle 1 right
  [-10.1, 0.43, 0.9],  // axle 2 left
  [-10.1, 0.43, -0.9], // axle 2 right
  [-11.0, 0.43, 0.9],  // axle 3 left
  [-11.0, 0.43, -0.9], // axle 3 right
]

const DOOR_HINGE_Z: number[] = [-0.6, 0.6]

const RIB_X_POSITIONS: number[] = [-0.5, -2.3, -4.1, -5.9, -7.7, -9.5, -10.8]

// ----- Shared Wheel (memo: props are primitive tuple, stable reference) -----
const Wheel = memo(function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tire */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.3, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      {/* Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.32, 10]} />
        <meshStandardMaterial color="#adb5bd" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Hub cap */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 8]} />
        <meshStandardMaterial color="#dee2e6" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  )
})

// ----- Tractor (memo: no props, renders once and stays stable) -----
const Tractor = memo(function Tractor() {
  // Memoize wheel list — array is stable since positions are constant
  const tractorWheels = useMemo(
    () => TRACTOR_WHEEL_POSITIONS.map((pos, i) => <Wheel key={i} position={pos} />),
    [] // empty deps: positions never change
  )

  return (
    <group>
      {/* === CHASSIS === */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[5.6, 0.28, 1.5]} />
        <meshStandardMaterial color="#2b2d42" />
      </mesh>

      {/* Chassis side rails */}
      <mesh position={[0, 0.56, 0.64]}>
        <boxGeometry args={[5.6, 0.12, 0.12]} />
        <meshStandardMaterial color="#1a1c2a" />
      </mesh>
      <mesh position={[0, 0.56, -0.64]}>
        <boxGeometry args={[5.6, 0.12, 0.12]} />
        <meshStandardMaterial color="#1a1c2a" />
      </mesh>

      {/* === FIFTH WHEEL === */}
      <mesh position={[-1.4, 0.66, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Fifth wheel slot */}
      <mesh position={[-1.4, 0.72, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.3]} />
        <meshStandardMaterial color="#555" metalness={0.9} />
      </mesh>

      {/* === CABIN === */}
      {/* Main cab body */}
      <mesh position={[1.7, 1.62, 0]}>
        <boxGeometry args={[2.4, 2.1, 1.85]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>

      {/* Cab roof */}
      <mesh position={[1.7, 2.72, 0]}>
        <boxGeometry args={[2.5, 0.12, 1.9]} />
        <meshStandardMaterial color="#c1121f" />
      </mesh>

      {/* Roof aero fairing */}
      <mesh position={[2.7, 2.82, 0]}>
        <boxGeometry args={[0.5, 0.2, 1.88]} />
        <meshStandardMaterial color="#c1121f" />
      </mesh>

      {/* Windshield */}
      <mesh position={[2.88, 1.75, 0]}>
        <boxGeometry args={[0.06, 1.05, 1.45]} />
        <meshStandardMaterial color="#90e0ef" transparent opacity={0.55} />
      </mesh>

      {/* Side window left */}
      <mesh position={[1.7, 1.95, 0.935]}>
        <boxGeometry args={[1.6, 0.75, 0.04]} />
        <meshStandardMaterial color="#90e0ef" transparent opacity={0.55} />
      </mesh>

      {/* Side window right */}
      <mesh position={[1.7, 1.95, -0.935]}>
        <boxGeometry args={[1.6, 0.75, 0.04]} />
        <meshStandardMaterial color="#90e0ef" transparent opacity={0.55} />
      </mesh>

      {/* Rear cab panel */}
      <mesh position={[0.45, 1.2, 0]}>
        <boxGeometry args={[0.15, 1.6, 1.85]} />
        <meshStandardMaterial color="#c1121f" />
      </mesh>

      {/* Front bumper */}
      <mesh position={[2.95, 0.6, 0]}>
        <boxGeometry args={[0.12, 0.55, 1.88]} />
        <meshStandardMaterial color="#dee2e6" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Grille */}
      <mesh position={[2.96, 1.0, 0]}>
        <boxGeometry args={[0.06, 0.65, 1.3]} />
        <meshStandardMaterial color="#333" metalness={0.6} />
      </mesh>

      {/* Headlight left */}
      <mesh position={[2.97, 0.82, 0.56]}>
        <boxGeometry args={[0.06, 0.26, 0.38]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} />
      </mesh>
      {/* Headlight right */}
      <mesh position={[2.97, 0.82, -0.56]}>
        <boxGeometry args={[0.06, 0.26, 0.38]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffd166" emissiveIntensity={1.5} />
      </mesh>

      {/* Mirror left */}
      <mesh position={[2.6, 2.1, 1.1]}>
        <boxGeometry args={[0.3, 0.18, 0.06]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      {/* Mirror right */}
      <mesh position={[2.6, 2.1, -1.1]}>
        <boxGeometry args={[0.3, 0.18, 0.06]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Exhaust stack */}
      <mesh position={[0.5, 2.55, -1.0]}>
        <cylinderGeometry args={[0.07, 0.07, 1.9, 10]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Fuel tanks */}
      <mesh position={[-0.2, 0.72, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 1.6, 12]} />
        <meshStandardMaterial color="#495057" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.2, 0.72, -1.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 1.6, 12]} />
        <meshStandardMaterial color="#495057" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* 6 wheels */}
      {tractorWheels}
    </group>
  )
})

// ----- Trailer (memo: no props, renders once and stays stable) -----
const Trailer = memo(function Trailer() {
  // Memoize repeated JSX lists
  const trailerWheels = useMemo(
    () => TRAILER_WHEEL_POSITIONS.map((pos, i) => <Wheel key={i} position={pos} />),
    []
  )

  const doorHinges = useMemo(
    () =>
      DOOR_HINGE_Z.map((z, i) => (
        <mesh key={i} position={[-11.14, 2.08, z]}>
          <boxGeometry args={[0.08, 2.6, 0.06]} />
          <meshStandardMaterial color="#888" metalness={0.7} />
        </mesh>
      )),
    []
  )

  const verticalRibs = useMemo(
    () =>
      RIB_X_POSITIONS.map((x, i) => (
        <group key={i}>
          <mesh position={[x, 2.08, 1.28]}>
            <boxGeometry args={[0.12, 2.78, 0.05]} />
            <meshStandardMaterial color="#1d3557" />
          </mesh>
          <mesh position={[x, 2.08, -1.28]}>
            <boxGeometry args={[0.12, 2.78, 0.05]} />
            <meshStandardMaterial color="#1d3557" />
          </mesh>
        </group>
      )),
    []
  )

  return (
    <group position={[-1.4, 0, 0]}>
      {/* === KINGPIN === */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 10]} />
        <meshStandardMaterial color="#bbb" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* === TRAILER CHASSIS === */}
      <mesh position={[-5.8, 0.48, 0]}>
        <boxGeometry args={[11.6, 0.22, 1.5]} />
        <meshStandardMaterial color="#2b2d42" />
      </mesh>
      <mesh position={[-5.8, 0.56, 0.62]}>
        <boxGeometry args={[11.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#1a1c2a" />
      </mesh>
      <mesh position={[-5.8, 0.56, -0.62]}>
        <boxGeometry args={[11.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#1a1c2a" />
      </mesh>

      {/* === LANDING GEAR === */}
      <mesh position={[-0.8, 0.28, 0.7]}>
        <boxGeometry args={[0.1, 0.56, 0.1]} />
        <meshStandardMaterial color="#555" metalness={0.5} />
      </mesh>
      <mesh position={[-0.8, 0.28, -0.7]}>
        <boxGeometry args={[0.1, 0.56, 0.1]} />
        <meshStandardMaterial color="#555" metalness={0.5} />
      </mesh>
      <mesh position={[-0.8, 0.04, 0.7]}>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[-0.8, 0.04, -0.7]}>
        <boxGeometry args={[0.22, 0.06, 0.22]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* === CONTAINER BODY === */}
      <mesh position={[-5.6, 2.08, 0]}>
        <boxGeometry args={[11.0, 2.78, 2.52]} />
        <meshStandardMaterial color="#457b9d" />
      </mesh>

      {/* Container roof */}
      <mesh position={[-5.6, 3.5, 0]}>
        <boxGeometry args={[11.05, 0.08, 2.55]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>

      {/* Container front face */}
      <mesh position={[-0.07, 2.08, 0]}>
        <boxGeometry args={[0.06, 2.78, 2.52]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>

      {/* Container rear doors */}
      <mesh position={[-11.13, 2.08, 0]}>
        <boxGeometry args={[0.06, 2.76, 2.5]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>
      {/* Door center split */}
      <mesh position={[-11.14, 2.08, 0]}>
        <boxGeometry args={[0.04, 2.76, 0.04]} />
        <meshStandardMaterial color="#0d1b2a" />
      </mesh>

      {/* Door hinges */}
      {doorHinges}

      {/* Vertical ribs */}
      {verticalRibs}

      {/* Bottom sill rails */}
      <mesh position={[-5.6, 0.72, 1.28]}>
        <boxGeometry args={[11.0, 0.12, 0.08]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>
      <mesh position={[-5.6, 0.72, -1.28]}>
        <boxGeometry args={[11.0, 0.12, 0.08]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>

      {/* 6 trailer wheels */}
      {trailerWheels}
    </group>
  )
})

// ----- Main Export -----
export default function Truck() {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[4.5, 0, 0]}>
      <Tractor />
      <Trailer />
    </group>
  )
}
