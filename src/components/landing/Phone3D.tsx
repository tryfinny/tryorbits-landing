import { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface PhoneProps {
  mousePosition: { x: number; y: number };
}

function PhoneModel({ mousePosition }: PhoneProps) {
  const phoneRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (phoneRef.current) {
      // Enhanced smooth interpolation with spring-like behavior
      const targetRotationY = mousePosition.x * 0.4;
      const targetRotationX = -mousePosition.y * 0.25;
      
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(
        phoneRef.current.rotation.y,
        targetRotationY,
        0.08
      );
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(
        phoneRef.current.rotation.x,
        targetRotationX,
        0.08
      );

      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      phoneRef.current.scale.setScalar(1 + breathe);
    }

    // Animate screen glow
    if (screenRef.current) {
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <group 
        ref={phoneRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Phone body with enhanced materials */}
        <RoundedBox args={[2.2, 4.5, 0.25]} radius={0.2} smoothness={4}>
          <meshStandardMaterial 
            color="#1a1a1a" 
            metalness={0.9} 
            roughness={0.15}
            envMapIntensity={1}
          />
        </RoundedBox>
        
        {/* Screen with glow effect */}
        <RoundedBox 
          ref={screenRef}
          args={[2, 4.1, 0.02]} 
          radius={0.15} 
          smoothness={4} 
          position={[0, 0, 0.14]}
        >
          <meshStandardMaterial 
            color="#F5EEE6" 
            metalness={0.1} 
            roughness={0.2}
            emissive="#F5EEE6"
            emissiveIntensity={0.1}
          />
        </RoundedBox>

        {/* Animated app interface elements */}
        <RoundedBox args={[1.6, 0.5, 0.01]} radius={0.1} smoothness={4} position={[0, 1.5, 0.16]}>
          <meshStandardMaterial 
            color={hovered ? "#E07B5D" : "#D4886B"} 
            metalness={0.1} 
            roughness={0.4}
            emissive="#D4886B"
            emissiveIntensity={hovered ? 0.2 : 0.05}
          />
        </RoundedBox>
        
        {/* Card 1 */}
        <RoundedBox args={[1.6, 0.7, 0.01]} radius={0.1} smoothness={4} position={[0, 0.7, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        {/* Card 2 */}
        <RoundedBox args={[1.6, 0.7, 0.01]} radius={0.1} smoothness={4} position={[0, -0.2, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        {/* Card 3 */}
        <RoundedBox args={[1.6, 0.7, 0.01]} radius={0.1} smoothness={4} position={[0, -1.1, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        {/* Camera notch with shine */}
        <mesh position={[0, 2.05, 0.14]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
          <meshStandardMaterial color="#222" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Subtle reflection plane */}
        <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial 
            color="#D4886B" 
            transparent 
            opacity={0.1}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Floating ambient particles
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 30;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#D4886B"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

interface Phone3DProps {
  className?: string;
}

export function Phone3D({ className }: Phone3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePosition.current = { x, y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current && e.touches[0]) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
      mousePosition.current = { x, y };
    }
  };

  return (
    <div 
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 0, 4]} intensity={0.4} color="#D4886B" />
        <pointLight position={[3, 3, 3]} intensity={0.2} color="#fff" />
        <Suspense fallback={null}>
          <PhoneModel mousePosition={mousePosition.current} />
          <AmbientParticles />
        </Suspense>
      </Canvas>
    </div>
  );
}
