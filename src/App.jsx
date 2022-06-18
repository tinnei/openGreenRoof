import { useEffect } from 'react';

import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';

// import './App.css';

function App() {
  
  useEffect(()=> {
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();

    let loadedModel;
    const glftLoader = new GLTFLoader();
    glftLoader.load('./assets/plants/plants_kit/scene.gltf', (gltfScene) => {
      loadedModel = gltfScene;

      gltfScene.scene.rotation.y = Math.PI / 3;
      gltfScene.scene.position.y = 3;
      gltfScene.scene.scale.set(3, 3, 3);
      thisScene.scene.add(gltfScene.scene);
    });

    // initialize GUI
    const gui = new GUI();

    // GUI - customization
    // const geometryFolder = gui.addFolder('Mesh Geometry');
    // geometryFolder.open();
    // const rotationFolder = geometryFolder.addFolder('Rotation');
    // rotationFolder.add(loadedModel.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
    // rotationFolder.add(boxMesh.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
    // rotationFolder.add(boxMesh.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');
    // const scaleFolder = geometryFolder.addFolder('Scale');
    // scaleFolder.add(loadedModel.scale, 'x', 0, 2).name('Scale X Axis');
    // scaleFolder.add(boxMesh.scale, 'y', 0, 2).name('Scale Y Axis');
    // scaleFolder.add(boxMesh.scale, 'z', 0, 2).name('Scale Z Axis');
    // scaleFolder.open();

    // const materialFolder = gui.addFolder('Tray Material');
    // const materialParams = {
    //   boxMeshColor: boxMesh.material.color.getHex(),
    // };
    // materialFolder.add(boxMesh.material, 'wireframe');
    // materialFolder.addColor(materialParams, 'boxMeshColor').onChange((value) => boxMesh.material.color.set(value));

    // Destroy the GUI on reload to prevent multiple stale UI from being displayed on screen.
    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <div>
      <canvas id="moduleCanvas"/>
    </div>
  );
}

export default App;
