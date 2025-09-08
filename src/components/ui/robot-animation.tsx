import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RobotMesh() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Robot Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.2, 0.8]} />
        <meshStandardMaterial color="#1E7EFF" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Robot Head */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#4A94FF" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 0.85, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.15, 0.85, 0.35]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.7, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#1E7EFF" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#1E7EFF" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Heart indicator on chest */}
      <mesh position={[0, 0.1, 0.41]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff6b9d" />
      </mesh>
    </group>
  );
}

interface RobotAnimationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RobotAnimation({ className, size = 'md' }: RobotAnimationProps) {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`${sizeMap[size]} ${className}`}
    >
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#1E7EFF" />
        <pointLight position={[-2, -2, 2]} intensity={0.3} color="#4A94FF" />
        <RobotMesh />
      </Canvas>
    </motion.div>
  );
}