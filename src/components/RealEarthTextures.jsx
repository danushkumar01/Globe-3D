import * as THREE from 'three';

/**
 * Real Earth Textures - Using NASA Blue Marble and other high-quality sources
 */

// High-quality Earth texture URLs
export const EARTH_TEXTURE_URLS = {
  earthDay: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  earthNight: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  earthSpecular: 'https://unpkg.com/three-globe/example/img/earth-water.png',
  earthTopology: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  earthClouds: 'https://unpkg.com/three-globe/example/img/clouds.png',
};

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

/**
 * Create vibrant fallback texture when API loading fails
 */
const createFallbackTexture = (type) => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (type === 'Earth Day') {
    console.log('⚠️ Using fallback Earth texture');
    
    // Bright ocean background with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#1e40af');    // Deep blue poles
    gradient.addColorStop(0.5, '#0ea5e9');  // Bright cyan ocean
    gradient.addColorStop(1, '#1e40af');    // Deep blue poles
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Vibrant green continents - approximate positions
    ctx.fillStyle = '#10b981'; // Emerald green
    // North America
    ctx.fillRect(200, 250, 400, 350);
    // South America
    ctx.fillRect(550, 450, 250, 400);
    
    ctx.fillStyle = '#16a34a'; // Forest green
    // Europe
    ctx.fillRect(950, 250, 250, 200);
    // Africa
    ctx.fillRect(950, 450, 350, 350);
    
    ctx.fillStyle = '#22c55e'; // Light green
    // Asia
    ctx.fillRect(1250, 150, 600, 500);
    
    ctx.fillStyle = '#dc2626'; // Red/orange
    // Australia
    ctx.fillRect(1650, 650, 250, 200);
    
    // Add texture variation
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const brightness = Math.random() * 50 + 200;
      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.1)`;
      ctx.fillRect(x, y, 2, 2);
    }
    
  } else if (type === 'Clouds') {
    // Transparent base
    ctx.clearRect(0, 0, 2048, 1024);
    
    // White fluffy clouds
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const radius = Math.random() * 80 + 40;
      
      const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloudGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      cloudGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = cloudGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'Specular' || type === 'Bump Map') {
    // Gray texture for specular/bump maps
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 2048, 1024);
    
    // Add noise
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const brightness = Math.random() * 100 + 100;
      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
      ctx.fillRect(x, y, 2, 2);
    }
  } else {
    // Default gray
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 2048, 1024);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
};

/**
 * Load a single texture with proper configuration
 */
const loadSingleTexture = (url, name) => {
  return new Promise((resolve) => {
    console.log(`📥 Loading ${name}...`);
    
    textureLoader.load(
      url,
      (texture) => {
        // Proper texture configuration for vibrant colors
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = 16;
        texture.needsUpdate = true;
        
        console.log(`✅ Loaded ${name}`);
        resolve(texture);
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          console.log(`⏳ ${name}: ${percent}%`);
        }
      },
      (error) => {
        console.warn(`⚠️ Failed to load ${name}, using fallback:`, error.message);
        resolve(createFallbackTexture(name));
      }
    );
  });
};

// Export individual texture loaders
export const loadEarthDayTexture = () => loadSingleTexture(EARTH_TEXTURE_URLS.earthDay, 'Earth Day');
export const loadEarthNightTexture = () => loadSingleTexture(EARTH_TEXTURE_URLS.earthNight, 'Earth Night');
export const loadSpecularMap = () => loadSingleTexture(EARTH_TEXTURE_URLS.earthSpecular, 'Specular');
export const loadBumpMap = () => loadSingleTexture(EARTH_TEXTURE_URLS.earthTopology, 'Bump Map');
export const loadCloudTexture = () => loadSingleTexture(EARTH_TEXTURE_URLS.earthClouds, 'Clouds');

/**
 * Load all Earth textures at once
 */
export const loadAllEarthTextures = async () => {
  console.log('🌍 Starting to load all Earth textures...');
  
  try {
    const [earthDay, earthNight, specular, bump, clouds] = await Promise.all([
      loadEarthDayTexture(),
      loadEarthNightTexture(),
      loadSpecularMap(),
      loadBumpMap(),
      loadCloudTexture(),
    ]);

    console.log('✅ All Earth textures loaded successfully!');
    
    return {
      earthDay,
      earthNight,
      specular,
      bump,
      clouds,
    };
  } catch (error) {
    console.error('❌ Error loading Earth textures:', error);
    
    // Return all fallback textures if something goes wrong
    return {
      earthDay: createFallbackTexture('Earth Day'),
      earthNight: createFallbackTexture('Earth Night'),
      specular: createFallbackTexture('Specular'),
      bump: createFallbackTexture('Bump Map'),
      clouds: createFallbackTexture('Clouds'),
    };
  }
};

// Default export
const EarthTextureAPI = {
  EARTH_TEXTURE_URLS,
  loadAllEarthTextures,
  loadEarthDayTexture,
  loadEarthNightTexture,
  loadSpecularMap,
  loadBumpMap,
  loadCloudTexture,
};

export default EarthTextureAPI;
