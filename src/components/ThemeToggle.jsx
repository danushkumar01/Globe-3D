import React from 'react'
import { useTheme } from '../hooks/useTheme.jsx'

const ThemeToggle = () => {
  const { currentTheme, toggleTheme } = useTheme()

  return (
    <div className="theme-toggle-bottom">
      <label className="toggle-switch-bottom">
        <input 
          type="checkbox" 
          id="theme-toggle-bottom"
          checked={currentTheme === 'dark'}
          onChange={toggleTheme}
        />
        <span className="slider-bottom">
          <span className="toggle-icon sun">☀️</span>
          <span className="toggle-icon moon">🌙</span>
        </span>
      </label>
    </div>
  )
}

export default ThemeToggle