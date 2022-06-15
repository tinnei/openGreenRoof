import { useEffect } from 'react';

import * as THREE from 'three';

import SceneInit from './lib/SceneInit';

// import './App.css';

function App() {
  
  useEffect(()=> {
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();

    const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    thisScene.scene.add(boxMesh);
  }, []);

  return (
    <div>
      <canvas id="moduleCanvas"/>
    </div>
  )
}

export default App;
