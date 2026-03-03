import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

const EnergyNode = ({ position, color, scale = 1, speed = 2, mouseReact = false }: { position: [number, number, number]; color: string; scale?: number, speed?: number, mouseReact?: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      
      let targetX = position[0];
      let targetY = position[1] + Math.sin(t * speed + position[0]) * 0.2;
      
      if (mouseReact) {
        // Subtly move towards the mouse pointer
        targetX += (state.pointer.x * 2 - targetX) * 0.1;
        targetY += (state.pointer.y * 2 - targetY) * 0.1;
      }

      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.05);

      ref.current.rotation.x = t * 0.5;
      ref.current.rotation.z = t * 0.3;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 24, 24]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.8}
        roughness={0.2}
        distort={0.6}
        speed={speed}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </Sphere>
  );
};

const ResonanceWave = ({ color, rotationSpeed, radius, mouseReact = false }: { color: string, rotationSpeed: number, radius: number, mouseReact?: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       
       let targetRotX = Math.sin(t * 0.2) * 0.2;
       let targetRotY = t * rotationSpeed;
       
       if (mouseReact) {
         targetRotX += state.pointer.y * 0.5;
         targetRotY += state.pointer.x * 0.5;
       }

       ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.05);
       ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.05);
       ref.current.rotation.z = Math.cos(t * 0.1) * 0.1;
    }
  });

  return (
    <Torus ref={ref} args={[radius, 0.02, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.4} wireframe />
    </Torus>
  );
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00E5FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF007F" />
        
        <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
          {/* Core */}
          <EnergyNode position={[0, 0, 0]} color="#FFFFFF" scale={0.9} speed={6} mouseReact />
          
          {/* Logic/Conscience (Cyan) */}
          <EnergyNode position={[-3, 2, -1]} color="#00E5FF" scale={0.7} speed={2.5} mouseReact />
          
          {/* Emotion/Soul (Magenta) */}
          <EnergyNode position={[3, -2, -1]} color="#FF007F" scale={0.7} speed={3.5} mouseReact />
          
          {/* Resonance Waves */}
          <ResonanceWave color="#00E5FF" rotationSpeed={0.25} radius={3.5} mouseReact />
          <ResonanceWave color="#FF007F" rotationSpeed={-0.35} radius={4.5} mouseReact />
          <ResonanceWave color="#9D00FF" rotationSpeed={0.15} radius={5.5} mouseReact />
        </Float>

        <Environment preset="night" />
        <Stars radius={100} depth={50} count={1000} factor={2} saturation={1} fade speed={0.5} />
      </Canvas>
    </div>
  );
};

export const GovernanceScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#00E5FF" />
        <spotLight position={[-5, -5, -5]} angle={0.3} penumbra={1} intensity={2} color="#FF007F" />
        <Environment preset="night" />
        
        <Float rotationIntensity={0.5} floatIntensity={0.5} speed={1}>
          <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
            {/* AEGIS Field Sphere */}
            <Sphere args={[2, 24, 24]}>
              <meshStandardMaterial color="#9D00FF" transparent opacity={0.1} wireframe />
            </Sphere>
            
            {/* Core */}
            <EnergyNode position={[0, 0, 0]} color="#FFFFFF" scale={0.5} speed={3} />
            
            {/* Orbiting Elements */}
            <ResonanceWave color="#00E5FF" rotationSpeed={0.2} radius={2.2} />
            <ResonanceWave color="#FF007F" rotationSpeed={-0.2} radius={2.4} />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
