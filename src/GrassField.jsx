import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import * as THREE from 'three';
import SceneInit from './lib/SceneInit';

import styles from './styles/roof.module.css';
import textureUrl from '../assets/grass/grass.png';

// TODO: 
// [DONE] get building geometry from map selectedBuildingGeometry
// [DONE] draw plane based on points
// https://threejs.org/docs/#api/en/core/BufferGeometry
// [DONE] improve points
// https://threejs.org/examples/#webgl_geometry_shapes
// [] add vegetations with instancedMesh
// [] add vegetation menu
// [] add ID: make this page only accessible if user selected a building

function GrassField() {
  const location = useLocation();
  const { buildingGeometry, buildingHeight } = location.state;

  function disposeArray() {
    this.array = null;
  }

  useEffect(() => {
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();

    const axesHelper = new THREE.AxesHelper(20);
    thisScene.scene.add(axesHelper);

    const grassSize = 4;
    const s = 1;

    let group = new THREE.Group();
    thisScene.scene.add(group);

    // ADD ROOF
    const roofShape = new THREE.Shape(buildingGeometry);
    let roofGeometry = new THREE.ShapeGeometry(roofShape);
    let roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide }));
    roofMesh.rotateX(- Math.PI / 2);
    roofMesh.geometry.center();
    roofMesh.scale.set(s, s, s);
    group.add(roofMesh);

    const extrudeSettings = { depth: buildingHeight, bevelEnabled: true, bevelSegments: 12, steps: 1, bevelSize: 1, bevelThickness: 1 };
    roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    roofMesh.rotateX(- Math.PI / 2);
    roofMesh.geometry.center();
    roofMesh.scale.set(s, s, s);
    group.add(roofMesh);

    // SET UP GRASS BASE PLANE
    const grassPlane = new THREE.PlaneGeometry(grassSize, grassSize);
    const grassTexture = new THREE.TextureLoader().load(textureUrl);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    const gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });

    const grassBase = new THREE.Mesh(grassPlane, gtexture);
    grassBase.geometry.center();
    grassBase.translateY(buildingHeight / 2 + grassSize); // move top and bottom
    group.add(grassBase);

    // GENERATE ONE PATCH OF GRASS
    const grassGroup = new THREE.Group();
    var i = 0, maxDiv = 4, thisGrass;
    while (i < maxDiv) {
      thisGrass = grassBase.clone();
      thisGrass.rotation.y = i * (Math.round(Math.PI) / maxDiv);
      grassGroup.add(thisGrass);
      i += 1;
    }
    group.add(grassGroup);

    //// REGULAR GRID
    const grassGrid = 4;
    const grassDensity = grassSize / 2;
    for (let x = -grassGrid; x < grassGrid; x++) {
      for (let y = -grassGrid; y < grassGrid; y++) {
        group.add(grassGroup.clone().translateZ(x * grassDensity).translateX(y * grassDensity));
      }
    }

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
      <pre id="features" className={styles.infoBox} >Select vegetations *WIP</pre>
      <Link to="/map"><button className={styles.leftButton}>Back to select building</button></Link>
      <Link to="/results"><button className={styles.button}>Confirm selection</button></Link>
    </div>
  );
}

export default GrassField;