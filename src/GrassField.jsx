import { useEffect } from 'react';
import * as THREE from 'three';

import SceneInit from './lib/SceneInit';
import { useLocation } from 'react-router-dom'

// TODO: get building geometry from map selectedBuildingGeometry

function GrassField() {
  const location = useLocation()
  const { buildingGeometry } = location.state

  useEffect(() => {
    console.log("buildingID from map:", buildingGeometry);
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();

    // SET UP GROUND PLANE
    const groundSize = 100;
    const grassSize = 24;
    const groundPlane = new THREE.PlaneBufferGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const groundMesh = new THREE.Mesh(groundPlane, groundMaterial);
    groundMesh.rotateX(- Math.PI / 2);
    thisScene.scene.add(groundMesh);

    // SET UP GRASS BASE PLANE
    const grassPlane = new THREE.PlaneGeometry(grassSize, grassSize);
    const grassTexture = new THREE.TextureLoader().load("../assets/grass/grass.png");
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    const gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });

    const grassBase = new THREE.Mesh(grassPlane, gtexture);
    grassBase.rotation.y = 0;
    grassBase.translateY(grassSize / 2); // move down to plane, a bit hacky here
    thisScene.scene.add(grassBase);

    // GENERATE PATCH OF GRASS
    const grassGroup = new THREE.Group();
    var i = 0, maxDiv = 4, thisGrass;
    while (i < maxDiv) {
      thisGrass = grassBase.clone();
      thisGrass.rotation.y = i * (Math.round(Math.PI) / maxDiv);
      grassGroup.add(thisGrass);
      i += 1;
    }
    thisScene.scene.add(grassGroup);

    const grassGrid = 4;
    const grassDensity = grassSize / 2;
    for (let x = -grassGrid; x < grassGrid; x++) {
      for (let y = -grassGrid; y < grassGrid; y++) {
        thisScene.scene.add(grassGroup.clone().translateZ(x * grassDensity).translateX(y * grassDensity));
      }
    }

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
    </div>
  );
}

export default GrassField;