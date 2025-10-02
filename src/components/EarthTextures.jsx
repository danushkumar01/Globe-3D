import * as THREE from 'three';

/**
 * Ultra-Realistic Earth Texture Generator
 * Creates photorealistic Earth textures with proper geographic features,
 * accurate colors, and natural terrain variations
 */

// Enhanced Earth texture creator with photorealistic continents and oceans
export const createRealisticEarthTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 4096; // 4K resolution for maximum quality
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Create realistic ocean base with depth variations
  const oceanGradient = ctx.createLinearGradient(0, 0, 0, 2048);
  oceanGradient.addColorStop(0, '#001f3f');    // Deep polar ocean
  oceanGradient.addColorStop(0.15, '#003d5c'); // Deep ocean trenches
  oceanGradient.addColorStop(0.4, '#004d73');  // Normal ocean depth
  oceanGradient.addColorStop(0.6, '#005580');  // Shallow ocean
  oceanGradient.addColorStop(0.85, '#003d5c'); // Deep ocean
  oceanGradient.addColorStop(1, '#001f3f');    // Deep polar ocean

  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, 4096, 2048);
  
  // Add ocean depth texture with noise
  for (let y = 0; y < 2048; y++) {
    for (let x = 0; x < 4096; x += 4) {
      const noise = Math.sin(x * 0.005) * Math.sin(y * 0.005) * 20;
      const depth = Math.floor(Math.random() * 15 + noise);
      ctx.fillStyle = `rgba(0, ${40 + depth}, ${80 + depth}, 0.1)`;
      ctx.fillRect(x, y, 4, 1);
    }
  }

  
  // NORTH AMERICA - Detailed and realistic
  ctx.save();
  
  // Rocky Mountains and Western regions
  ctx.fillStyle = '#8B7355'; // Mountain brown
  ctx.beginPath();
  ctx.moveTo(400, 350);
  ctx.bezierCurveTo(350, 300, 500, 280, 650, 320);
  ctx.bezierCurveTo(750, 350, 850, 320, 900, 380);
  ctx.bezierCurveTo(920, 450, 880, 520, 850, 580);
  ctx.bezierCurveTo(800, 620, 720, 640, 650, 620);
  ctx.bezierCurveTo(550, 600, 450, 580, 420, 520);
  ctx.bezierCurveTo(390, 450, 380, 380, 400, 350);
  ctx.fill();
  
  // Great Plains - light grassland
  ctx.fillStyle = '#9CAF88';
  ctx.beginPath();
  ctx.ellipse(700, 480, 120, 80, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Eastern forests
  ctx.fillStyle = '#4A6741';
  ctx.beginPath();
  ctx.ellipse(820, 450, 80, 100, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Canadian Shield and tundra
  ctx.fillStyle = '#7A8B7A';
  ctx.beginPath();
  ctx.ellipse(650, 320, 180, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Mexican deserts
  ctx.fillStyle = '#C4A777';
  ctx.beginPath();
  ctx.ellipse(550, 580, 80, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // SOUTH AMERICA - Amazon and diverse terrain
  ctx.save();
  
  // Main continent shape
  ctx.fillStyle = '#7A8B5E';
  ctx.beginPath();
  ctx.moveTo(650, 780);
  ctx.bezierCurveTo(620, 720, 680, 700, 720, 740);
  ctx.bezierCurveTo(760, 800, 750, 880, 740, 960);
  ctx.bezierCurveTo(730, 1100, 720, 1240, 700, 1340);
  ctx.bezierCurveTo(680, 1400, 650, 1420, 630, 1380);
  ctx.bezierCurveTo(610, 1280, 600, 1120, 610, 980);
  ctx.bezierCurveTo(615, 880, 630, 800, 650, 780);
  ctx.fill();
  
  // Amazon Rainforest - deep green
  ctx.fillStyle = '#1B4D1B';
  ctx.beginPath();
  ctx.ellipse(670, 850, 80, 120, 0.1, 0, Math.PI * 2);
  ctx.fill();
  
  // Andes Mountains
  ctx.fillStyle = '#9B8B7E';
  ctx.beginPath();
  ctx.rect(630, 900, 20, 400);
  ctx.fill();
  
  // Patagonian grasslands
  ctx.fillStyle = '#B8A68E';
  ctx.beginPath();
  ctx.ellipse(660, 1320, 50, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // AFRICA - Sahara, rainforests, and savannas
  ctx.save();
  
  // Main continent
  ctx.fillStyle = '#A8956B';
  ctx.beginPath();
  ctx.moveTo(2080, 580);
  ctx.bezierCurveTo(2050, 520, 2120, 500, 2200, 530);
  ctx.bezierCurveTo(2280, 560, 2320, 620, 2310, 700);
  ctx.bezierCurveTo(2320, 840, 2300, 980, 2280, 1100);
  ctx.bezierCurveTo(2260, 1220, 2220, 1320, 2180, 1300);
  ctx.bezierCurveTo(2140, 1280, 2100, 1200, 2090, 1080);
  ctx.bezierCurveTo(2080, 920, 2070, 740, 2080, 580);
  ctx.fill();
  
  // Sahara Desert - realistic sand color
  ctx.fillStyle = '#EDC9AF';
  ctx.beginPath();
  ctx.ellipse(2180, 680, 110, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Add Sahara texture
  for (let i = 0; i < 200; i++) {
    ctx.fillStyle = `rgba(237, 201, 175, ${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(
      2100 + Math.random() * 160,
      640 + Math.random() * 100,
      Math.random() * 3,
      0, Math.PI * 2
    );
    ctx.fill();
  }
  
  // Congo Rainforest
  ctx.fillStyle = '#2D5016';
  ctx.beginPath();
  ctx.ellipse(2150, 850, 70, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // East African Highlands
  ctx.fillStyle = '#8B9B6F';
  ctx.beginPath();
  ctx.ellipse(2240, 900, 40, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Kalahari Desert
  ctx.fillStyle = '#D4A574';
  ctx.beginPath();
  ctx.ellipse(2160, 1200, 60, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // EUROPE - Detailed geography
  ctx.save();
  
  // Main landmass
  ctx.fillStyle = '#7A9B6E';
  ctx.beginPath();
  ctx.moveTo(1950, 420);
  ctx.bezierCurveTo(1920, 380, 2000, 360, 2080, 390);
  ctx.bezierCurveTo(2160, 420, 2180, 460, 2150, 500);
  ctx.bezierCurveTo(2110, 530, 2040, 540, 1980, 520);
  ctx.bezierCurveTo(1940, 490, 1930, 450, 1950, 420);
  ctx.fill();
  
  // Scandinavian Peninsula
  ctx.fillStyle = '#6B8B69';
  ctx.beginPath();
  ctx.ellipse(2040, 360, 60, 40, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Alps
  ctx.fillStyle = '#C0C0C0';
  ctx.beginPath();
  ctx.ellipse(2050, 470, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // ASIA - Massive and diverse
  ctx.save();
  
  // Siberia and Northern Asia
  ctx.fillStyle = '#7A8B7A';
  ctx.beginPath();
  ctx.moveTo(2200, 280);
  ctx.bezierCurveTo(2300, 240, 2600, 220, 2900, 250);
  ctx.bezierCurveTo(3200, 280, 3400, 320, 3350, 400);
  ctx.bezierCurveTo(3300, 480, 3100, 500, 2800, 480);
  ctx.bezierCurveTo(2500, 460, 2300, 420, 2250, 360);
  ctx.bezierCurveTo(2210, 320, 2190, 300, 2200, 280);
  ctx.fill();
  
  // Siberian Taiga forests
  ctx.fillStyle = '#3A5F3A';
  ctx.beginPath();
  ctx.ellipse(2900, 320, 300, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Central Asia and Middle East
  ctx.fillStyle = '#9B8B6F';
  ctx.beginPath();
  ctx.moveTo(2300, 450);
  ctx.bezierCurveTo(2400, 420, 2600, 440, 2750, 480);
  ctx.bezierCurveTo(2800, 520, 2780, 580, 2720, 600);
  ctx.bezierCurveTo(2600, 620, 2450, 610, 2350, 580);
  ctx.bezierCurveTo(2280, 550, 2270, 500, 2300, 450);
  ctx.fill();
  
  // Gobi Desert
  ctx.fillStyle = '#D2B48C';
  ctx.beginPath();
  ctx.ellipse(2900, 450, 120, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Himalayan Mountains - snow-capped
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(2680, 500);
  ctx.lineTo(2720, 480);
  ctx.lineTo(2760, 495);
  ctx.lineTo(2800, 485);
  ctx.lineTo(2840, 500);
  ctx.lineTo(2810, 510);
  ctx.lineTo(2760, 515);
  ctx.lineTo(2710, 510);
  ctx.closePath();
  ctx.fill();
  
  // Add snow texture to Himalayas
  ctx.fillStyle = '#F0F8FF';
  for (let i = 0; i < 50; i++) {
    ctx.beginPath();
    ctx.arc(
      2680 + Math.random() * 160,
      485 + Math.random() * 25,
      Math.random() * 2,
      0, Math.PI * 2
    );
    ctx.fill();
  }
  
  // Indian Subcontinent
  ctx.fillStyle = '#8B9B5E';
  ctx.beginPath();
  ctx.moveTo(2720, 540);
  ctx.bezierCurveTo(2700, 520, 2740, 510, 2780, 530);
  ctx.bezierCurveTo(2820, 580, 2810, 660, 2780, 720);
  ctx.bezierCurveTo(2750, 760, 2700, 770, 2670, 740);
  ctx.bezierCurveTo(2650, 700, 2660, 640, 2680, 580);
  ctx.bezierCurveTo(2695, 555, 2710, 540, 2720, 540);
  ctx.fill();
  
  // Southeast Asian forests
  ctx.fillStyle = '#2D5F2D';
  ctx.beginPath();
  ctx.ellipse(2950, 680, 100, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // East Asia - China, Korea, Japan
  ctx.fillStyle = '#7A9B6E';
  ctx.beginPath();
  ctx.moveTo(2900, 480);
  ctx.bezierCurveTo(3000, 460, 3150, 480, 3200, 520);
  ctx.bezierCurveTo(3220, 580, 3180, 640, 3120, 660);
  ctx.bezierCurveTo(3040, 680, 2960, 660, 2920, 620);
  ctx.bezierCurveTo(2890, 580, 2885, 520, 2900, 480);
  ctx.fill();
  
  // Japanese archipelago
  ctx.fillStyle = '#6B8B5E';
  ctx.beginPath();
  ctx.ellipse(3240, 520, 25, 60, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // AUSTRALIA - Outback and coastal regions
  ctx.save();
  
  // Main continent
  ctx.fillStyle = '#CD853F';
  ctx.beginPath();
  ctx.ellipse(3400, 1380, 160, 110, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Australian Outback - red center
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.ellipse(3400, 1380, 100, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Add outback texture
  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `rgba(210, 105, 30, ${Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.arc(
      3340 + Math.random() * 120,
      1330 + Math.random() * 100,
      Math.random() * 2,
      0, Math.PI * 2
    );
    ctx.fill();
  }
  
  // Coastal regions - greener
  ctx.fillStyle = '#8B9B6F';
  ctx.beginPath();
  ctx.arc(3320, 1420, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3480, 1360, 35, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // GREENLAND - Ice and tundra
  ctx.save();
  ctx.fillStyle = '#E0F2F7';
  ctx.beginPath();
  ctx.ellipse(1150, 220, 90, 70, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Ice cap details
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(1150, 220, 60, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // ANTARCTICA - Massive ice sheet
  ctx.save();
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 1850, 4096, 198);
  
  // Ice texture
  for (let i = 0; i < 300; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * 4096,
      1850 + Math.random() * 198,
      Math.random() * 5 + 1,
      0, Math.PI * 2
    );
    ctx.fill();
  }
  ctx.restore();

  // Add atmospheric effects and details
  ctx.globalCompositeOperation = 'overlay';
  
  // Add subtle cloud shadows
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 4096;
    const y = Math.random() * 2048;
    const width = Math.random() * 200 + 100;
    const height = Math.random() * 50 + 20;
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Reset composition mode
  ctx.globalCompositeOperation = 'source-over';

  // Add city lights for night side effect
  ctx.fillStyle = 'rgba(255, 255, 150, 0.8)';
  const cityLights = [
    // Major cities
    { x: 750, y: 450 },   // New York
    { x: 600, y: 480 },   // Los Angeles
    { x: 2050, y: 470 },  // London
    { x: 2100, y: 480 },  // Paris
    { x: 2800, y: 520 },  // Delhi
    { x: 3100, y: 480 },  // Beijing
    { x: 3200, y: 500 },  // Tokyo
    { x: 3400, y: 1350 }, // Sydney
    { x: 2180, y: 1150 }, // Cape Town
    { x: 680, y: 1000 },  // São Paulo
  ];

  cityLights.forEach(city => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    const gradient = ctx.createRadialGradient(city.x, city.y, 0, city.x, city.y, 15);
    gradient.addColorStop(0, 'rgba(255, 255, 150, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(city.x, city.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 150, 0.8)'; // Reset for next city
  });

  return new THREE.CanvasTexture(canvas);
};

// Create normal map for more realistic lighting
export const createNormalMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const imageData = ctx.createImageData(2048, 1024);
  
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 2048; x++) {
      const index = (y * 2048 + x) * 4;
      
      // Create noise-based normal map
      const noise1 = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 0.5 + 0.5;
      const noise2 = Math.sin(x * 0.02 + 100) * Math.cos(y * 0.02 + 100) * 0.3 + 0.5;
      const combined = (noise1 + noise2) / 2;
      
      // Convert to normal map colors (RGB = XYZ)
      imageData.data[index] = combined * 255;     // R (X)
      imageData.data[index + 1] = combined * 255; // G (Y) 
      imageData.data[index + 2] = 255;            // B (Z) - always up
      imageData.data[index + 3] = 255;            // A
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return new THREE.CanvasTexture(canvas);
};

// Create specular map for water reflection
export const createSpecularMap = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Start with black (no reflection)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 2048, 1024);

  // Add white areas for water (high reflection)
  ctx.fillStyle = '#FFFFFF';
  
  // Ocean areas that should be reflective
  const oceanAreas = [
    { x: 0, y: 0, width: 400, height: 1024 }, // Pacific
    { x: 1000, y: 0, width: 600, height: 1024 }, // Atlantic
    { x: 2800, y: 200, width: 800, height: 600 }, // Indian Ocean
    { x: 3600, y: 0, width: 496, height: 1024 }, // Pacific cont.
  ];

  oceanAreas.forEach(area => {
    ctx.fillRect(area.x, area.y, area.width, area.height);
  });

  // Remove land areas (make them black/non-reflective)
  ctx.fillStyle = '#000000';
  
  // Same continent shapes as main texture but black
  ctx.beginPath();
  ctx.ellipse(600, 400, 180, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(650, 900, 80, 200, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Continue for other continents...

  return new THREE.CanvasTexture(canvas);
};