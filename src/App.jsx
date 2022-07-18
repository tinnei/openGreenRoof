import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import styles from './styles/intro.module.css';

import GrassField from '/./page/GrassField';
import Teaser from '/./page/Teaser';
import Map from '/./page/Map';

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
