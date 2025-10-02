import React, { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light')

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('map-theme') || 'light'
    setCurrentTheme(savedTheme)
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setCurrentTheme(newTheme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Save preference
    localStorage.setItem('map-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}