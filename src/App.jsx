import React, { useState } from 'react'
import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme.jsx'
import WorldMap from './components/WorldMap.jsx'
import Globe from './components/Globe.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <ThemeProvider>
        <div className="App">
          {/* Navigation Toggle */}
          <nav className="view-toggle-nav">
            <div className="view-toggle-container">
              <NavLink 
                to="/2d" 
                className={({ isActive }) => 
                  `view-toggle-btn ${isActive ? 'active' : ''}`
                }
              >
                🗺️ 2D Map
              </NavLink>
              <NavLink 
                to="/3d" 
                className={({ isActive }) => 
                  `view-toggle-btn ${isActive ? 'active' : ''}`
                }
              >
                🌍 3D Globe
              </NavLink>
            </div>
          </nav>

          {/* Main Content */}
          <div className="main-content">
            <Routes>
              <Route path="/2d" element={
                <div id="map">
                  <WorldMap />
                </div>
              } />
              <Route path="/3d" element={
                <div id="globe">
                  <Globe />
                </div>
              } />
              <Route path="/" element={<Navigate to="/2d" replace />} />
            </Routes>
          </div>
          
          {/* Theme Toggle Switch */}
          <ThemeToggle />
        </div>
      </ThemeProvider>
    </Router>
  )
}

export default App