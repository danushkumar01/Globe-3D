# World Map with Country Colors - React/JSX Version

A modern interactive world map application with both 2D and 3D views, featuring country-specific data visualization and news sentiment analysis.

## Features

### 🌍 Dual View Modes
- **2D Map View**: Interactive Leaflet.js-based world map with smooth navigation
- **3D Globe View**: Three.js-powered realistic Earth globe with orbital controls
- **Seamless Toggle**: Switch between 2D and 3D views using NavLink navigation

### 📊 Data Visualization
- **News Sentiment Analysis**: Countries colored based on news sentiment scores
- **Real-time Data**: Dynamic country markers with news count and sentiment
- **Interactive Tooltips**: Hover to see detailed country information
- **Sentiment Legend**: Color-coded system (Very Positive to Very Negative)

### 🎨 Theme & UI
- **Dark/Light Mode**: Toggle between light and dark themes with persistent preferences
- **Modern Navigation**: Clean NavLink-based toggle buttons (🗺️ 2D Map / 🌍 3D Globe)
- **Responsive Design**: Adaptive layouts for desktop and mobile devices
- **Smooth Transitions**: Animated transitions between views and theme changes

### 🗺️ 2D Map Features
- **Country Coloring**: Sentiment-based country coloring system
- **Zoom Controls**: Click countries to zoom in and view details
- **Label Toggle**: Show/hide country name labels
- **Color Randomization**: Randomize country colors for testing

### 🌐 3D Globe Features
- **Realistic Earth**: High-quality NASA Blue Marble textures
- **Orbital Controls**: Smooth rotation, zoom, and pan controls
- **Country Markers**: 3D positioned markers based on lat/lon coordinates
- **Lighting System**: Multiple light sources for realistic Earth rendering
- **Auto-rotation**: Optional auto-rotation feature

### ⌨️ Keyboard Shortcuts
- `Ctrl+R` or `Cmd+R`: Randomize colors (2D view)
- `Ctrl+L` or `Cmd+L`: Toggle labels (2D view)
- `Ctrl+T` or `Cmd+T`: Toggle theme

## How to Use

### Getting Started
1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run dev`
3. **Open Browser**: Navigate to `http://localhost:3000`

### Navigation
1. **Switch Views**: 
   - Click "🗺️ 2D Map" for traditional map view
   - Click "🌍 3D Globe" for interactive 3D globe
2. **2D Map Navigation**: 
   - Use mouse wheel to zoom in/out
   - Click and drag to pan around the map
   - Click on any country to zoom in and see details
3. **3D Globe Navigation**:
   - Left-click and drag to rotate the globe
   - Right-click and drag to pan
   - Scroll to zoom in/out
   - Click on country markers for information
4. **Theme Control**: Use the theme toggle switch to switch between light and dark modes

### Interactive Features
   - Hover over countries to see their names and assigned colors
   - Countries will highlight when you hover over them
4. **Use Controls**:
   - Click "Randomize Colors" to reassign colors to all countries
   - Click "Toggle Country Labels" to show/hide country names on the map

## Technical Details

### Technologies Used
- **HTML5**: Structure and layout
- **CSS3**: Styling with gradients, animations, and responsive design
- **JavaScript (ES6)**: Interactive functionality and map controls
- **Leaflet.js**: Open-source mapping library
- **GeoJSON**: Country boundary data from public sources

### Files Structure
```
pulse_2/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

### Color Scheme
- **Green (#28a745)**: Represents one-third of world countries
- **Red (#dc3545)**: Represents one-third of world countries  
- **Orange (#fd7e14)**: Represents one-third of world countries

### Theme System
- **Light Mode**: Clean white interface with subtle shadows and bright country colors
- **Dark Mode**: Dark interface with muted backgrounds and bright country colors for contrast
- **Consistent Colors**: All UI elements use CSS variables for perfect color consistency
- **Automatic Tile Switching**: Map tiles automatically switch between light and dark variants

### Data Source
The application uses GeoJSON data for country boundaries from a public GitHub repository. If the external data fails to load, it falls back to basic rectangular representations of major countries.

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Efficient country boundary rendering
- Optimized hover and click event handling
- Responsive zoom-based styling adjustments
- Lazy loading of country labels
- Memory-efficient color assignment

## Customization

You can easily customize the colors by modifying the `colors` array in `script.js`:

```javascript
const colors = ['#28a745', '#dc3545', '#fd7e14']; // Green, Red, Orange
```

## Developer Console

The application exposes a `mapControls` object in the console for debugging:

```javascript
// Access map controls in browser console
mapControls.randomizeColors();  // Randomize colors programmatically
mapControls.toggleLabels();     // Toggle labels programmatically
mapControls.getColorStats();    // Get color distribution statistics
```

## Troubleshooting

1. **Map not loading**: Check internet connection (requires external tile and GeoJSON data)
2. **Countries not colored**: The application includes a fallback system for major countries
3. **Performance issues**: Try zooming out for better performance with many countries visible

## Future Enhancements

- Add search functionality for specific countries
- Implement color themes (e.g., by continent, population, GDP)
- Add export functionality for map images
- Include country statistics and information panels
- Add animation effects for color transitions