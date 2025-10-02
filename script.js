// Global variables
let map;
let countriesLayer;
let showLabels = false;
let currentTheme = 'light';
let lightTileLayer, darkTileLayer;
const colors = ['#28a745', '#dc3545', '#fd7e14']; // Green, Red, Orange
let countryColors = {};

// Initialize the map
function initMap() {
    // Define the world's inhabited area bounds (like Google Maps)
    const worldBounds = [
        [-55, -Infinity],  // Bottom of Australia/South America to infinite west
        [75, Infinity]     // Top of North America/Northern Europe to infinite east
    ];
    
    // Create the map with horizontal world wrapping enabled
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,        // Prevent zooming out beyond the world area
        maxZoom: 18,
        worldCopyJump: true, // Enable seamless horizontal wrapping
        maxBounds: worldBounds, // Limit to inhabited world area
        maxBoundsViscosity: 0.8 // Some resistance at boundaries
    });

    // Create light theme tile layer with light background
    lightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        maxZoom: 18,
        noWrap: false // Enable tile wrapping for seamless horizontal scroll
    });

    // Create dark theme tile layer with dark background
    darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors, © CARTO',
        maxZoom: 18,
        noWrap: false // Enable tile wrapping for seamless horizontal scroll
    });

    // Add the appropriate tile layer based on current theme
    if (currentTheme === 'dark') {
        darkTileLayer.addTo(map);
    } else {
        lightTileLayer.addTo(map);
    }

    // Custom map controls
    map.zoomControl.setPosition('topright');
    
    // Load country boundaries
    loadCountries();
}

// Load country data and boundaries
async function loadCountries() {
    try {
        // Using a public GeoJSON source for world countries
        const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
        const data = await response.json();
        
        // Assign random colors to countries
        assignColorsToCountries(data.features);
        
        // Create multiple copies of the countries layer for world wrapping
        const layerGroup = L.layerGroup();
        
        // Create the main countries layer
        const mainLayer = L.geoJSON(data, {
            style: styleCountry,
            onEachFeature: onEachCountry
        });
        
        // Create wrapped copies of the layer (left and right)
        const leftLayer = L.geoJSON(data, {
            style: styleCountry,
            onEachFeature: onEachCountry,
            coordsToLatLng: function(coords) {
                return L.latLng(coords[1], coords[0] - 360); // Shift 360 degrees west
            }
        });
        
        const rightLayer = L.geoJSON(data, {
            style: styleCountry,
            onEachFeature: onEachCountry,
            coordsToLatLng: function(coords) {
                return L.latLng(coords[1], coords[0] + 360); // Shift 360 degrees east
            }
        });
        
        // Add all layers to the group
        layerGroup.addLayer(mainLayer);
        layerGroup.addLayer(leftLayer);
        layerGroup.addLayer(rightLayer);
        
        // Add the layer group to the map
        countriesLayer = layerGroup.addTo(map);
        
        // Set initial view to show the world nicely within bounds
        map.setView([10, 0], 2); // Slightly more centered view
        
        // Add loaded class for professional fade-in animation
        setTimeout(() => {
            document.getElementById('map').classList.add('loaded');
        }, 500);
        
    } catch (error) {
        console.error('Error loading country data:', error);
        // Fallback: create a simple world map with basic countries
        createFallbackMap();
    }
}

// Assign colors to countries
function assignColorsToCountries(countries) {
    countries.forEach(country => {
        const countryName = country.properties.name || country.properties.NAME || 'Unknown';
        // Assign colors in a way that distributes them evenly
        const colorIndex = Math.floor(Math.random() * colors.length);
        countryColors[countryName] = colors[colorIndex];
    });
}

// Style function for countries - Professional styling
function styleCountry(feature) {
    const countryName = feature.properties.name || feature.properties.NAME || 'Unknown';
    const color = countryColors[countryName] || colors[0];
    const borderColor = currentTheme === 'dark' ? '#374151' : '#ffffff';
    
    return {
        fillColor: color,
        weight: 0.5,
        opacity: 0.9,
        color: borderColor,
        fillOpacity: 0.85,
        dashArray: '0',
        className: 'country-polygon'
    };
}

// Add interactivity to each country
function onEachCountry(feature, layer) {
    const countryName = feature.properties.name || feature.properties.NAME || 'Unknown';
    const color = countryColors[countryName] || colors[0];
    const colorName = color === colors[0] ? 'Green' : color === colors[1] ? 'Red' : 'Orange';
    
    // Mouse events
    layer.on({
        mouseover: function(e) {
            highlightCountry(e);
            showTooltip(e, countryName);
        },
        mouseout: function(e) {
            resetCountryStyle(e);
            hideTooltip();
        },
        click: function(e) {
            showCountryInfo(countryName);
            map.fitBounds(e.target.getBounds());
        }
    });
}

// Highlight country on hover - White border only
function highlightCountry(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ffffff',
        fillOpacity: 0.85, // Keep original fill opacity
        opacity: 1
    });
    layer.bringToFront();
}

// Reset country style - Remove white border completely
function resetCountryStyle(e) {
    const layer = e.target;
    // Reset to original country styling
    layer.setStyle(styleCountry(layer.feature));
}

// Show tooltip - Country name only
function showTooltip(e, countryName) {
    const tooltip = document.createElement('div');
    tooltip.className = 'country-tooltip';
    tooltip.innerHTML = `${countryName}`;
    tooltip.id = 'country-tooltip';
    
    // Remove existing tooltip
    const existingTooltip = document.getElementById('country-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    document.addEventListener('mousemove', function(event) {
        tooltip.style.position = 'fixed';
        tooltip.style.left = (event.clientX + 10) + 'px';
        tooltip.style.top = (event.clientY - 30) + 'px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '9999';
    });
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('country-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Show country information popup - Simple name only
function showCountryInfo(countryName) {
    const popup = L.popup({
        className: 'professional-popup',
        closeButton: true,
        autoClose: false,
        closeOnEscapeKey: true
    })
        .setLatLng(map.getCenter())
        .setContent(`
            <div style="text-align: center; padding: 12px 16px;">
                <h3 style="margin: 0; color: var(--text-primary); font-size: 20px; font-weight: 600;">${countryName}</h3>
            </div>
        `)
        .openOn(map);
}

// Randomize country colors
function randomizeColors() {
    if (!countriesLayer) return;
    
    // First, reassign colors to all countries
    const tempColors = {};
    countriesLayer.eachLayer(function(layerGroup) {
        if (layerGroup.eachLayer) {
            layerGroup.eachLayer(function(layer) {
                if (layer.feature) {
                    const countryName = layer.feature.properties.name || layer.feature.properties.NAME || 'Unknown';
                    if (!tempColors[countryName]) {
                        const colorIndex = Math.floor(Math.random() * colors.length);
                        tempColors[countryName] = colors[colorIndex];
                    }
                }
            });
        } else if (layerGroup.feature) {
            const countryName = layerGroup.feature.properties.name || layerGroup.feature.properties.NAME || 'Unknown';
            if (!tempColors[countryName]) {
                const colorIndex = Math.floor(Math.random() * colors.length);
                tempColors[countryName] = colors[colorIndex];
            }
        }
    });
    
    // Update the global color mapping
    countryColors = tempColors;
    
    // Apply the new colors to all layers
    countriesLayer.eachLayer(function(layerGroup) {
        if (layerGroup.eachLayer) {
            layerGroup.eachLayer(function(layer) {
                if (layer.feature) {
                    layer.setStyle(styleCountry(layer.feature));
                }
            });
        } else if (layerGroup.feature) {
            layerGroup.setStyle(styleCountry(layerGroup.feature));
        }
    });
}

// Toggle country labels
function toggleLabels() {
    showLabels = !showLabels;
    
    if (showLabels) {
        countriesLayer.eachLayer(function(layerGroup) {
            if (layerGroup.eachLayer) {
                layerGroup.eachLayer(function(layer) {
                    if (layer.feature) {
                        const countryName = layer.feature.properties.name || layer.feature.properties.NAME || 'Unknown';
                        const center = layer.getBounds().getCenter();
                        
                        const marker = L.marker(center, {
                            icon: L.divIcon({
                                className: 'country-label',
                                html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${countryName}</div>`,
                                iconSize: [100, 20],
                                iconAnchor: [50, 10]
                            })
                        });
                        
                        marker.addTo(map);
                        layer.labelMarker = marker;
                    }
                });
            } else if (layerGroup.feature) {
                const countryName = layerGroup.feature.properties.name || layerGroup.feature.properties.NAME || 'Unknown';
                const center = layerGroup.getBounds().getCenter();
                
                const marker = L.marker(center, {
                    icon: L.divIcon({
                        className: 'country-label',
                        html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${countryName}</div>`,
                        iconSize: [100, 20],
                        iconAnchor: [50, 10]
                    })
                });
                
                marker.addTo(map);
                layerGroup.labelMarker = marker;
            }
        });
    } else {
        countriesLayer.eachLayer(function(layerGroup) {
            if (layerGroup.eachLayer) {
                layerGroup.eachLayer(function(layer) {
                    if (layer.labelMarker) {
                        map.removeLayer(layer.labelMarker);
                        delete layer.labelMarker;
                    }
                });
            } else if (layerGroup.labelMarker) {
                map.removeLayer(layerGroup.labelMarker);
                delete layerGroup.labelMarker;
            }
        });
    }
}

// Fallback map creation (in case the external GeoJSON fails)
function createFallbackMap() {
    // Create sample countries with basic shapes
    const sampleCountries = [
        {
            name: "United States",
            bounds: [[24.396308, -125.0], [49.384358, -66.93457]],
            color: colors[0]
        },
        {
            name: "Canada",
            bounds: [[41.676555, -141.0], [83.23324, -52.636291]],
            color: colors[1]
        },
        {
            name: "Brazil",
            bounds: [[-33.750706, -73.982817], [5.264877, -32.392998]],
            color: colors[2]
        },
        {
            name: "Russia",
            bounds: [[41.151416, 19.66064], [81.857361, 180.0]],
            color: colors[0]
        },
        {
            name: "China",
            bounds: [[15.775279, 73.557693], [53.560974, 134.77281]],
            color: colors[1]
        },
        {
            name: "Australia",
            bounds: [[-43.634597, 113.338953], [-10.668187, 153.569469]],
            color: colors[2]
        }
    ];
    
    sampleCountries.forEach(country => {
        const rectangle = L.rectangle(country.bounds, {
            color: '#ffffff',
            weight: 2,
            fillColor: country.color,
            fillOpacity: 0.7
        }).addTo(map);
        
        rectangle.bindPopup(`<strong>${country.name}</strong><br>Sample country area`);
        
        rectangle.on('mouseover', function() {
            this.setStyle({ fillOpacity: 0.9, weight: 3 });
        });
        
        rectangle.on('mouseout', function() {
            this.setStyle({ fillOpacity: 0.7, weight: 2 });
        });
    });
    
    // Set a nice world view for the fallback within bounds
    map.setView([10, 0], 2);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first
    initTheme();
    
    // Initialize the map
    initMap();
    
    // Theme toggle listener
    const themeToggleBottom = document.getElementById('theme-toggle-bottom');
    if (themeToggleBottom) {
        themeToggleBottom.addEventListener('change', toggleTheme);
    }
    
    // Map event listeners
    map.on('zoomend', function() {
        const zoom = map.getZoom();
        // Adjust country border width based on zoom level
        if (countriesLayer) {
            const weight = zoom > 4 ? 2 : 1;
            countriesLayer.eachLayer(function(layerGroup) {
                if (layerGroup.eachLayer) {
                    layerGroup.eachLayer(function(layer) {
                        if (layer.feature) {
                            layer.setStyle({ weight: weight });
                        }
                    });
                } else if (layerGroup.feature) {
                    layerGroup.setStyle({ weight: weight });
                }
            });
        }
        
        // Ensure view stays within world bounds when zooming out
        if (zoom <= 2) {
            const center = map.getCenter();
            if (center.lat > 70 || center.lat < -50) {
                map.setView([10, center.lng], zoom, { animate: false });
            }
        }
    });
});

// Utility function to get a random color from the palette
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to get color statistics
function getColorStats() {
    const stats = { green: 0, red: 0, orange: 0 };
    
    Object.values(countryColors).forEach(color => {
        if (color === colors[0]) stats.green++;
        else if (color === colors[1]) stats.red++;
        else if (color === colors[2]) stats.orange++;
    });
    
    return stats;
}

// Function to reset map view to world bounds
function resetMapView() {
    // Reset to optimal world view within bounds
    map.setView([10, 0], 2, {
        animate: true,
        duration: 1
    });
}

// Theme Management Functions
function initTheme() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('map-theme') || 'light';
    currentTheme = savedTheme;
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle switch state
    const themeToggleBottom = document.getElementById('theme-toggle-bottom');
    if (themeToggleBottom) {
        themeToggleBottom.checked = currentTheme === 'dark';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Save preference
    localStorage.setItem('map-theme', currentTheme);
    
    // Switch map tiles
    if (map) {
        if (currentTheme === 'dark') {
            map.removeLayer(lightTileLayer);
            map.addLayer(darkTileLayer);
        } else {
            map.removeLayer(darkTileLayer);
            map.addLayer(lightTileLayer);
        }
        
        // Update country borders
        if (countriesLayer) {
            countriesLayer.eachLayer(function(layerGroup) {
                if (layerGroup.eachLayer) {
                    layerGroup.eachLayer(function(layer) {
                        if (layer.feature) {
                            layer.setStyle(styleCountry(layer.feature));
                        }
                    });
                } else if (layerGroup.feature) {
                    layerGroup.setStyle(styleCountry(layerGroup.feature));
                }
            });
        }
    }
    
}



// Console commands for developers
window.mapControls = {
    randomizeColors,
    toggleLabels,
    toggleTheme,
    resetMapView,
    getColorStats,
    map,
    countriesLayer,
    countryColors,
    currentTheme
};