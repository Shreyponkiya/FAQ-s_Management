import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react"
import { LanguageProvider } from "./context/LanguageContext";
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <LanguageProvider>
    <App />
  </LanguageProvider>
  </React.StrictMode>
)
