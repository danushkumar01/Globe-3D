import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../hooks/useTheme.jsx'

const WorldMap = () => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const countriesLayerRef = useRef(null)
  const lightTileLayerRef = useRef(null)
  const darkTileLayerRef = useRef(null)
  
  const { currentTheme } = useTheme()
  
  const [showLabels, setShowLabels] = useState(false)
  const [countryColors, setCountryColors] = useState({})
  
  const colors = ['#28a745', '#dc3545', '#fd7e14'] // Green, Red, Orange

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Define the world's inhabited area bounds (like Google Maps)
    const worldBounds = [
      [-55, -Infinity],  // Bottom of Australia/South America to infinite west
      [75, Infinity]     // Top of North America/Northern Europe to infinite east
    ]
    
    // Create the map with horizontal world wrapping enabled
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,        // Prevent zooming out beyond the world area
      maxZoom: 18,
      worldCopyJump: true, // Enable seamless horizontal wrapping
      maxBounds: worldBounds, // Limit to inhabited world area
      maxBoundsViscosity: 0.8 // Some resistance at boundaries
    })

    mapInstanceRef.current = map

    // Create light theme tile layer with light background
    const lightTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 18,
      noWrap: false // Enable tile wrapping for seamless horizontal scroll
    })

    // Create dark theme tile layer with dark background
    const darkTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 18,
      noWrap: false // Enable tile wrapping for seamless horizontal scroll
    })

    lightTileLayerRef.current = lightTileLayer
    darkTileLayerRef.current = darkTileLayer

    // Add the appropriate tile layer based on current theme
    if (currentTheme === 'dark') {
      darkTileLayer.addTo(map)
    } else {
      lightTileLayer.addTo(map)
    }

    // Custom map controls
    map.zoomControl.setPosition('topright')
    
    // Load country boundaries
    loadCountries(map)

    // Map event listeners
    map.on('zoomend', function() {
      const zoom = map.getZoom()
      // Adjust country border width based on zoom level
      if (countriesLayerRef.current) {
        const weight = zoom > 4 ? 2 : 1
        countriesLayerRef.current.eachLayer(function(layerGroup) {
          if (layerGroup.eachLayer) {
            layerGroup.eachLayer(function(layer) {
              if (layer.feature) {
                layer.setStyle({ weight: weight })
              }
            })
          } else if (layerGroup.feature) {
            layerGroup.setStyle({ weight: weight })
          }
        })
      }
      
      // Ensure view stays within world bounds when zooming out
      if (zoom <= 2) {
        const center = map.getCenter()
        if (center.lat > 70 || center.lat < -50) {
          map.setView([10, center.lng], zoom, { animate: false })
        }
      }
    })

    // Add loaded class for professional fade-in animation
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.classList.add('loaded')
      }
    }, 500)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Handle theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !lightTileLayerRef.current || !darkTileLayerRef.current) return

    const map = mapInstanceRef.current

    // Switch map tiles
    if (currentTheme === 'dark') {
      map.removeLayer(lightTileLayerRef.current)
      map.addLayer(darkTileLayerRef.current)
    } else {
      map.removeLayer(darkTileLayerRef.current)
      map.addLayer(lightTileLayerRef.current)
    }
    
    // Update country borders
    if (countriesLayerRef.current) {
      countriesLayerRef.current.eachLayer(function(layerGroup) {
        if (layerGroup.eachLayer) {
          layerGroup.eachLayer(function(layer) {
            if (layer.feature) {
              layer.setStyle(styleCountry(layer.feature))
            }
          })
        } else if (layerGroup.feature) {
          layerGroup.setStyle(styleCountry(layerGroup.feature))
        }
      })
    }
  }, [currentTheme])

  // Load country data and boundaries
  const loadCountries = async (map) => {
    try {
      // Using a public GeoJSON source for world countries
      const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      const data = await response.json()
      
      // Assign random colors to countries
      const newCountryColors = assignColorsToCountries(data.features)
      setCountryColors(newCountryColors)
      
      // Create multiple copies of the countries layer for world wrapping
      const layerGroup = L.layerGroup()
      
      // Create the main countries layer
      const mainLayer = L.geoJSON(data, {
        style: (feature) => styleCountry(feature, newCountryColors),
        onEachFeature: (feature, layer) => onEachCountry(feature, layer, map, newCountryColors)
      })
      
      // Create wrapped copies of the layer (left and right)
      const leftLayer = L.geoJSON(data, {
        style: (feature) => styleCountry(feature, newCountryColors),
        onEachFeature: (feature, layer) => onEachCountry(feature, layer, map, newCountryColors),
        coordsToLatLng: function(coords) {
          return L.latLng(coords[1], coords[0] - 360) // Shift 360 degrees west
        }
      })
      
      const rightLayer = L.geoJSON(data, {
        style: (feature) => styleCountry(feature, newCountryColors),
        onEachFeature: (feature, layer) => onEachCountry(feature, layer, map, newCountryColors),
        coordsToLatLng: function(coords) {
          return L.latLng(coords[1], coords[0] + 360) // Shift 360 degrees east
        }
      })
      
      // Add all layers to the group
      layerGroup.addLayer(mainLayer)
      layerGroup.addLayer(leftLayer)
      layerGroup.addLayer(rightLayer)
      
      // Add the layer group to the map
      countriesLayerRef.current = layerGroup.addTo(map)
      
      // Set initial view to show the world nicely within bounds
      map.setView([10, 0], 2) // Slightly more centered view
      
    } catch (error) {
      console.error('Error loading country data:', error)
      // Fallback: create a simple world map with basic countries
      createFallbackMap(map)
    }
  }

  // Assign colors to countries
  const assignColorsToCountries = (countries) => {
    const newCountryColors = {}
    countries.forEach(country => {
      const countryName = country.properties.name || country.properties.NAME || 'Unknown'
      // Assign colors in a way that distributes them evenly
      const colorIndex = Math.floor(Math.random() * colors.length)
      newCountryColors[countryName] = colors[colorIndex]
    })
    return newCountryColors
  }

  // Style function for countries - Professional styling
  const styleCountry = (feature, colors = countryColors) => {
    const countryName = feature.properties.name || feature.properties.NAME || 'Unknown'
    const color = colors[countryName] || colors[0]
    const borderColor = currentTheme === 'dark' ? '#374151' : '#ffffff'
    
    return {
      fillColor: color,
      weight: 0.5,
      opacity: 0.9,
      color: borderColor,
      fillOpacity: 0.85,
      dashArray: '0',
      className: 'country-polygon'
    }
  }

  // Add interactivity to each country
  const onEachCountry = (feature, layer, map, colors) => {
    const countryName = feature.properties.name || feature.properties.NAME || 'Unknown'
    const color = colors[countryName] || colors[0]
    const colorName = color === colors[0] ? 'Green' : color === colors[1] ? 'Red' : 'Orange'
    
    // Store the original style immediately after the layer is styled
    setTimeout(() => {
      if (layer.options && !layer._originalStyle) {
        layer._originalStyle = {
          fillColor: layer.options.fillColor,
          weight: layer.options.weight,
          opacity: layer.options.opacity,
          color: layer.options.color,
          fillOpacity: layer.options.fillOpacity,
          dashArray: layer.options.dashArray
        }
      }
    }, 100)
    
    // Mouse events
    layer.on({
      mouseover: function(e) {
        highlightCountry(e)
        showTooltip(e, countryName)
      },
      mouseout: function(e) {
        resetCountryStyle(e)
        hideTooltip()
      },
      click: function(e) {
        showCountryInfo(countryName, map)
        map.fitBounds(e.target.getBounds())
      }
    })
  }

  // Highlight country on hover - White border only
  const highlightCountry = (e) => {
    const layer = e.target
    // Store the original style on the layer for later restoration
    if (!layer._originalStyle) {
      layer._originalStyle = {
        fillColor: layer.options.fillColor,
        weight: layer.options.weight,
        opacity: layer.options.opacity,
        color: layer.options.color,
        fillOpacity: layer.options.fillOpacity,
        dashArray: layer.options.dashArray
      }
    }
    
    layer.setStyle({
      fillColor: layer._originalStyle.fillColor, // Keep original fill color exactly as it was
      weight: 3,
      color: '#ffffff', // White border for highlight
      fillOpacity: layer._originalStyle.fillOpacity, // Keep original fill opacity
      opacity: 1,
      dashArray: '0'
    })
    layer.bringToFront()
  }

  // Reset country style - Remove white border completely
  const resetCountryStyle = (e) => {
    const layer = e.target
    
    // Use the stored original style if available, otherwise fallback to styleCountry function
    if (layer._originalStyle) {
      layer.setStyle(layer._originalStyle)
    } else {
      // Fallback to recalculating the style
      layer.setStyle(styleCountry(layer.feature))
    }
  }

  // Show tooltip - Country name only
  const showTooltip = (e, countryName) => {
    const tooltip = document.createElement('div')
    tooltip.className = 'country-tooltip'
    tooltip.innerHTML = countryName
    tooltip.id = 'country-tooltip'
    
    // Remove existing tooltip
    const existingTooltip = document.getElementById('country-tooltip')
    if (existingTooltip) {
      existingTooltip.remove()
    }
    
    document.body.appendChild(tooltip)
    
    // Position tooltip
    const handleMouseMove = (event) => {
      tooltip.style.position = 'fixed'
      tooltip.style.left = (event.clientX + 10) + 'px'
      tooltip.style.top = (event.clientY - 30) + 'px'
      tooltip.style.pointerEvents = 'none'
      tooltip.style.zIndex = '9999'
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    // Store the event listener function on the tooltip for cleanup
    tooltip._handleMouseMove = handleMouseMove
  }

  // Hide tooltip
  const hideTooltip = () => {
    const tooltip = document.getElementById('country-tooltip')
    if (tooltip) {
      if (tooltip._handleMouseMove) {
        document.removeEventListener('mousemove', tooltip._handleMouseMove)
      }
      tooltip.remove()
    }
  }

  // Show country information popup - Simple name only
  const showCountryInfo = (countryName, map) => {
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
      .openOn(map)
  }

  // Fallback map creation (in case the external GeoJSON fails)
  const createFallbackMap = (map) => {
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
    ]
    
    sampleCountries.forEach(country => {
      const rectangle = L.rectangle(country.bounds, {
        color: '#ffffff',
        weight: 2,
        fillColor: country.color,
        fillOpacity: 0.7
      }).addTo(map)
      
      rectangle.bindPopup(`<strong>${country.name}</strong><br>Sample country area`)
      
      rectangle.on('mouseover', function() {
        this.setStyle({ fillOpacity: 0.9, weight: 3 })
      })
      
      rectangle.on('mouseout', function() {
        this.setStyle({ fillOpacity: 0.7, weight: 2 })
      })
    })
    
    // Set a nice world view for the fallback within bounds
    map.setView([10, 0], 2)
  }

  // Randomize country colors
  const randomizeColors = () => {
    if (!countriesLayerRef.current) return
    
    // First, reassign colors to all countries
    const tempColors = {}
    countriesLayerRef.current.eachLayer(function(layerGroup) {
      if (layerGroup.eachLayer) {
        layerGroup.eachLayer(function(layer) {
          if (layer.feature) {
            const countryName = layer.feature.properties.name || layer.feature.properties.NAME || 'Unknown'
            if (!tempColors[countryName]) {
              const colorIndex = Math.floor(Math.random() * colors.length)
              tempColors[countryName] = colors[colorIndex]
            }
          }
        })
      } else if (layerGroup.feature) {
        const countryName = layerGroup.feature.properties.name || layerGroup.feature.properties.NAME || 'Unknown'
        if (!tempColors[countryName]) {
          const colorIndex = Math.floor(Math.random() * colors.length)
          tempColors[countryName] = colors[colorIndex]
        }
      }
    })
    
    // Update the color mapping
    setCountryColors(tempColors)
    
    // Apply the new colors to all layers
    countriesLayerRef.current.eachLayer(function(layerGroup) {
      if (layerGroup.eachLayer) {
        layerGroup.eachLayer(function(layer) {
          if (layer.feature) {
            layer.setStyle(styleCountry(layer.feature, tempColors))
          }
        })
      } else if (layerGroup.feature) {
        layerGroup.setStyle(styleCountry(layerGroup.feature, tempColors))
      }
    })
  }

  // Toggle country labels
  const toggleLabels = () => {
    if (!countriesLayerRef.current || !mapInstanceRef.current) return
    
    const newShowLabels = !showLabels
    setShowLabels(newShowLabels)
    
    if (newShowLabels) {
      countriesLayerRef.current.eachLayer(function(layerGroup) {
        if (layerGroup.eachLayer) {
          layerGroup.eachLayer(function(layer) {
            if (layer.feature) {
              const countryName = layer.feature.properties.name || layer.feature.properties.NAME || 'Unknown'
              const center = layer.getBounds().getCenter()
              
              const marker = L.marker(center, {
                icon: L.divIcon({
                  className: 'country-label',
                  html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${countryName}</div>`,
                  iconSize: [100, 20],
                  iconAnchor: [50, 10]
                })
              })
              
              marker.addTo(mapInstanceRef.current)
              layer.labelMarker = marker
            }
          })
        } else if (layerGroup.feature) {
          const countryName = layerGroup.feature.properties.name || layerGroup.feature.properties.NAME || 'Unknown'
          const center = layerGroup.getBounds().getCenter()
          
          const marker = L.marker(center, {
            icon: L.divIcon({
              className: 'country-label',
              html: `<div style="background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: bold; border: 1px solid #ccc; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">${countryName}</div>`,
              iconSize: [100, 20],
              iconAnchor: [50, 10]
            })
          })
          
          marker.addTo(mapInstanceRef.current)
          layerGroup.labelMarker = marker
        }
      })
    } else {
      countriesLayerRef.current.eachLayer(function(layerGroup) {
        if (layerGroup.eachLayer) {
          layerGroup.eachLayer(function(layer) {
            if (layer.labelMarker) {
              mapInstanceRef.current.removeLayer(layer.labelMarker)
              delete layer.labelMarker
            }
          })
        } else if (layerGroup.labelMarker) {
          mapInstanceRef.current.removeLayer(layerGroup.labelMarker)
          delete layerGroup.labelMarker
        }
      })
    }
  }

  // Function to reset map view to world bounds
  const resetMapView = () => {
    if (!mapInstanceRef.current) return
    
    // Reset to optimal world view within bounds
    mapInstanceRef.current.setView([10, 0], 2, {
      animate: true,
      duration: 1
    })
  }

  // Function to get color statistics
  const getColorStats = () => {
    const stats = { green: 0, red: 0, orange: 0 }
    
    Object.values(countryColors).forEach(color => {
      if (color === colors[0]) stats.green++
      else if (color === colors[1]) stats.red++
      else if (color === colors[2]) stats.orange++
    })
    
    return stats
  }

  // Expose functions to window for developer console access
  useEffect(() => {
    window.mapControls = {
      randomizeColors,
      toggleLabels,
      resetMapView,
      getColorStats,
      map: mapInstanceRef.current,
      countriesLayer: countriesLayerRef.current,
      countryColors,
      currentTheme
    }
    
    return () => {
      if (window.mapControls) {
        delete window.mapControls
      }
    }
  }, [countryColors, currentTheme])

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />
}

export default WorldMap