import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Enhanced Earth component with realistic textures
const EnhancedEarth = ({ selectedCountry, onCountryClick }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const earthRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(5, 64, 32);
    
    // Create a more realistic Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: createEarthTexture(),
      bumpScale: 0.05,
      specular: new THREE.Color('grey'),
      shininess: 100
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    earthRef.current = earth;

    // Add atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(5.1, 64, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 15;

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      if (earth) {
        earth.rotation.y += deltaMove.x * 0.005;
        earth.rotation.x += deltaMove.y * 0.005;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleWheel = (e) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(8, Math.min(30, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (earth) {
        earth.rotation.y += 0.002; // Slow rotation
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    setIsLoading(false);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Create a procedural Earth texture
  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Create a gradient for the Earth
    const gradient = ctx.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, '#4A90E2');    // Ocean blue
    gradient.addColorStop(0.3, '#87CEEB');  // Sky blue
    gradient.addColorStop(0.5, '#7FB069');  // Green for land
    gradient.addColorStop(0.7, '#8B4513');  // Brown for land
    gradient.addColorStop(1, '#4A90E2');    // Ocean blue

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 256);

    // Add some land masses (simplified)
    ctx.fillStyle = '#7FB069';
    
    // North America
    ctx.fillRect(50, 80, 100, 60);
    ctx.fillRect(80, 60, 60, 40);
    
    // Europe
    ctx.fillRect(200, 70, 50, 40);
    
    // Asia
    ctx.fillRect(280, 60, 120, 80);
    
    // Africa
    ctx.fillRect(220, 110, 60, 80);
    
    // South America
    ctx.fillRect(120, 140, 40, 100);
    
    // Australia
    ctx.fillRect(380, 180, 60, 30);

    return new THREE.CanvasTexture(canvas);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl">Loading Earth...</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedEarth;