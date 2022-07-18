import React from 'react'
import ReactDOM from 'react-dom/client'

import 'mapbox-gl/dist/mapbox-gl.css';
import '/src/index.css'

import App from '/src/App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
