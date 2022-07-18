import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

import GrassField from './GrassField';
import Teaser from './Teaser';
import Map from './Map';

function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Teaser />
          </Route>
          <Route path="/grassfield">
            <GrassField />
          </Route>
          <Route path="/map">
            <Map />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
