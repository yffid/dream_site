"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

function ParticleSystem({ count = 2000, mousePosition }: ParticleSystemProps) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(1 - 2 * Math.random());
      const radius = 1 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Blue gradient colors
      const intensity = Math.random() * 0.5 + 0.5;
      colors[i * 3] = 0.1 * intensity;     // R
      colors[i * 3 + 1] = 0.5 * intensity; // G  
      colors[i * 3 + 2] = 1.0 * intensity; // B
    }

    return { 
      positions: new THREE.Float32BufferAttribute(positions, 3),
      colors: new THREE.Float32BufferAttribute(colors, 3),
      velocities 
    };
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;

    const positionAttribute = mesh.current.geometry.attributes.position as THREE.BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    
    // Mouse interaction - convert screen coordinates to 3D space
    const mouse3D = new THREE.Vector3(
      (mousePosition.x / window.innerWidth) * 2 - 1,
      -(mousePosition.y / window.innerHeight) * 2 + 1,
      0
    ).unproject(state.camera);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Current particle position
      const particlePos = new THREE.Vector3(
        positions[i3],
        positions[i3 + 1], 
        positions[i3 + 2]
      );

      // Calculate distance to mouse
      const distance = particlePos.distanceTo(mouse3D);
      const repelForce = Math.max(0, (2 - distance) * 0.01);

      // Apply repulsion force
      if (distance < 2) {
        const direction = particlePos.clone().sub(mouse3D).normalize();
        positions[i3] += direction.x * repelForce;
        positions[i3 + 1] += direction.y * repelForce;
        positions[i3 + 2] += direction.z * repelForce;
      }

      // Add orbital motion
      const time = state.clock.getElapsedTime();
      positions[i3] += Math.sin(time + i * 0.01) * 0.001;
      positions[i3 + 1] += Math.cos(time + i * 0.01) * 0.001;
      
      // Add velocity
      positions[i3] += particles.velocities[i3] * delta;
      positions[i3 + 1] += particles.velocities[i3 + 1] * delta;
      positions[i3 + 2] += particles.velocities[i3 + 2] * delta;
    }

    positionAttribute.needsUpdate = true;
    mesh.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <primitive object={particles.positions} attach="attributes-position" />
        <primitive object={particles.colors} attach="attributes-color" />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface NeuralCoreProps {
  className?: string;
}

export function NeuralCore({ className }: NeuralCoreProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [degradePerformance, setDegradePerformance] = React.useState(false);

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        className="w-full h-full"
      >
        <PerformanceMonitor
          onIncline={() => setDegradePerformance(false)}
          onDecline={() => setDegradePerformance(true)}
        />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#1E7EFF" />
        
        <ParticleSystem 
          count={degradePerformance ? 1000 : 2000}
          mousePosition={mousePosition}
        />
      </Canvas>
    </div>
  );
}