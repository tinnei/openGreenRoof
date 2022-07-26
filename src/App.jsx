import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import GrassField from './GrassField';
import Teaser from './Teaser';
import Map from './Map';
import Results from './Results';

function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Teaser />} />
          <Route path="/grassfield" element={<GrassField />} />
          <Route path="/map" element={<Map />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
