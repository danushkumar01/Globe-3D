import React from 'react'
import { ThemeProvider } from './hooks/useTheme.jsx'
import WorldMap from './components/WorldMap.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <div id="map">
          <WorldMap />
        </div>
        
        {/* Theme Toggle Switch */}
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App