import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- CONFIGURATION ---
const SETTINGS = {
  metalness: 1.0,
  roughness: 0.02, // Near perfect mirror
  envMapIntensity: 3.5, // BLINDING bright reflections
  color: '#ffffff',
  links: 12,
  spacing: 1.8
};

// --- INDIVIDUAL CHAIN LINK COMPONENT ---
const ChainLink = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      {/* TorusGeometry args: [radius, tube, radialSegments, tubularSegments] 
         We use 64/64 segments for ultra-smooth reflections
      */}
      <torusGeometry args={[1.2, 0.45, 64, 64]} />
      
      {/* Standard Material with Physical properties.
         We flatten the chain slightly on the Z-axis (scale={[1, 1, 0.6]}) 
         to give it that "Cuban Link" look which catches light better.
      */}
      <meshStandardMaterial
        color={SETTINGS.color}
        metalness={SETTINGS.metalness}
        roughness={SETTINGS.roughness}
        envMapIntensity={SETTINGS.envMapIntensity}
      />
      
      {/* Flattening the geometry to make it a Cuban link */}
      <group scale={[1, 1, 0.6]} />
    </mesh>
  );
};

// --- THE WHOLE CHAIN ASSEMBLY ---
const ChainGroup = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle floating animation
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
  });

  // Generate the links array
  const links = Array.from({ length: SETTINGS.links }, (_, i) => {
    const y = (i - SETTINGS.links / 2) * SETTINGS.spacing;
    // Alternate rotation for every other link (90 degrees)
    const rotY = i % 2 !== 0 ? Math.PI / 2 : 0;
    
    return <ChainLink key={i} position={[0, y, 0]} rotation={[0, rotY, 0]} />;
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 12]}> 
      {/* Slight Z-tilt for style */}
      {links}
    </group>
  );
};

// --- SCENE LIGHTING & ENVIRONMENT ---
const StudioScene = () => {
  return (
    <>
      {/* 1. HDRI ENVIRONMENT: The primary source of "Silver" look */}
      <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr" 
      />

      {/* 2. MANUAL LIGHTS: To force the brightness even further */}
      {/* Key Light (Flash) */}
      <directionalLight position={[10, 10, 5]} intensity={4} color="#ffffff" castShadow />
      {/* Cool Rim Light (Blue tint) */}
      <spotLight position={[-10, 10, -5]} intensity={100} color="#eefeff" angle={0.5} penumbra={1} />
      {/* Fill Light (Underneath) */}
      <pointLight position={[0, -10, 5]} intensity={2} color="#ffffff" />
    </>
  );
};

// --- MAIN EXPORTED COMPONENT ---
export default function SilverChain() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
      <Canvas
        shadows
        dpr={[1, 2]} // Handle high-res screens
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: 1.5 // OVER-EXPOSE FOR BRIGHTNESS
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />

        <StudioScene />
        <ChainGroup />

        {/* POST PROCESSING: BLOOM EFFECT */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={1.1} // Only glow things brighter than pure white
            mipmapBlur // Soft, expensive-looking blur
            intensity={0.8} // Glow strength
            radius={0.6}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Optional Overlay Text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        color: 'white', fontFamily: 'sans-serif', 
        pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.5
      }}>
        STERLING
      </div>
    </div>
  );
}
