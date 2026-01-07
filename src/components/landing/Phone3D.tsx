import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PhoneProps {
  mousePosition: { x: number; y: number };
}

function PhoneModel({ mousePosition }: PhoneProps) {
  const phoneRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (phoneRef.current) {
      // Smooth interpolation towards mouse position
      phoneRef.current.rotation.y = THREE.MathUtils.lerp(
        phoneRef.current.rotation.y,
        mousePosition.x * 0.3,
        0.05
      );
      phoneRef.current.rotation.x = THREE.MathUtils.lerp(
        phoneRef.current.rotation.x,
        -mousePosition.y * 0.2,
        0.05
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={phoneRef}>
        {/* Phone body */}
        <RoundedBox args={[2.2, 4.5, 0.25]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        
        {/* Screen */}
        <RoundedBox args={[2, 4.1, 0.02]} radius={0.15} smoothness={4} position={[0, 0, 0.14]}>
          <meshStandardMaterial 
            color="#E8DED1" 
            metalness={0.1} 
            roughness={0.3}
            emissive="#E8DED1"
            emissiveIntensity={0.1}
          />
        </RoundedBox>

        {/* Screen content - app interface mockup */}
        <RoundedBox args={[1.6, 0.4, 0.01]} radius={0.1} smoothness={4} position={[0, 1.5, 0.16]}>
          <meshStandardMaterial color="#D4886B" metalness={0.1} roughness={0.5} />
        </RoundedBox>
        
        <RoundedBox args={[1.6, 0.8, 0.01]} radius={0.1} smoothness={4} position={[0, 0.6, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        <RoundedBox args={[1.6, 0.8, 0.01]} radius={0.1} smoothness={4} position={[0, -0.4, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        <RoundedBox args={[1.6, 0.8, 0.01]} radius={0.1} smoothness={4} position={[0, -1.4, 0.16]}>
          <meshStandardMaterial color="#F0E6DC" metalness={0.1} roughness={0.5} />
        </RoundedBox>

        {/* Camera notch */}
        <mesh position={[0, 2.05, 0.14]}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 32]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
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
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 4]} intensity={0.3} color="#D4886B" />
        <Suspense fallback={null}>
          <PhoneModel mousePosition={mousePosition.current} />
        </Suspense>
      </Canvas>
    </div>
  );
}
