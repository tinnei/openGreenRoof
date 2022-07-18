import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import GrassField from './GrassField.jsx';
import Teaser from './Teaser.jsx';
import Map from './Map.jsx';

function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Teaser />} />
          <Route path="/grassfield" element={<GrassField />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
