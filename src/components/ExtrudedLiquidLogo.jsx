import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ExtrudedLiquidLogo({ logoUrl, scrollProgress = 0 }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load texture and create 3D geometry
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(logoUrl, (texture) => {
      // Create extruded box
      const geometry = new THREE.BoxGeometry(2, 2, 0.3, 16, 16, 8);
      
      // Create material with basic lighting
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0,
        emissive: 0x111111,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshRef.current = mesh;

      // Add lights
      const light1 = new THREE.DirectionalLight(0xffffff, 1);
      light1.position.set(5, 5, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
      light2.position.set(-5, -5, 5);
      scene.add(light2);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Animation loop
      const render = () => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;

        // Move backwards and rotate based on scroll
        mesh.position.z = -scrollProgress * 3;
        mesh.rotation.x = scrollProgress * 0.3;
        mesh.rotation.y = scrollProgress * 0.2;

        // Subtle rotation animation
        mesh.rotation.z += 0.0005;

        renderer.render(scene, camera);
        frameRef.current = requestAnimationFrame(render);
      };
      render();
    });

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [logoUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
