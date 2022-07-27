import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import * as THREE from 'three';
import SceneInit from './lib/SceneInit';

import styles from './styles/roof.module.css';

// TODO: 
// [DONE] get building geometry from map selectedBuildingGeometry
// [DONE] draw plane based on points
// https://threejs.org/docs/#api/en/core/BufferGeometry
// [DONE] improve poitns
// [] add vegetations with instancedMesh
// [] make this page only accessible if user selected a building

function GrassField() {
  const location = useLocation();
  const { buildingGeometry } = location.state;

  function disposeArray() {
    this.array = null;
  }

  useEffect(() => {
    // console.log("building Points, from map:", buildingGeometry);
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();
    const axesHelper = new THREE.AxesHelper(20);
    thisScene.scene.add(axesHelper);

    const grassSize = 24;

    const s = 2;
    const roofShape = new THREE.Shape(buildingGeometry);
    const roofGeometry = new THREE.ShapeGeometry(roofShape);
    const roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide }));
    roofMesh.rotateX(- Math.PI / 2);
    roofMesh.geometry.center();
    roofMesh.scale.set(s, s, s);
    thisScene.scene.add(roofMesh);

    // // SET UP GRASS BASE PLANE
    // const grassPlane = new THREE.PlaneGeometry(grassSize, grassSize);
    // const grassTexture = new THREE.TextureLoader().load("../assets/grass/grass.png");
    // grassTexture.wrapS = THREE.RepeatWrapping;
    // grassTexture.wrapT = THREE.RepeatWrapping;
    // const gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });

    // const grassBase = new THREE.Mesh(grassPlane, gtexture);
    // grassBase.rotation.y = 0;
    // grassBase.translateY(grassSize / 2); // move down to plane, a bit hacky here
    // thisScene.scene.add(grassBase);

    // // GENERATE PATCH OF GRASS
    // const grassGroup = new THREE.Group();
    // var i = 0, maxDiv = 4, thisGrass;
    // while (i < maxDiv) {
    //   thisGrass = grassBase.clone();
    //   thisGrass.rotation.y = i * (Math.round(Math.PI) / maxDiv);
    //   grassGroup.add(thisGrass);
    //   i += 1;
    // }
    // thisScene.scene.add(grassGroup);

    // const grassGrid = 4;
    // const grassDensity = grassSize / 2;
    // for (let x = -grassGrid; x < grassGrid; x++) {
    //   for (let y = -grassGrid; y < grassGrid; y++) {
    //     thisScene.scene.add(grassGroup.clone().translateZ(x * grassDensity).translateX(y * grassDensity));
    //   }
    // }

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
      {/* <pre id="features" className={styles.infoBox} >Select vegetations</pre> */}
      <Link to="/map"><button className={styles.leftButton}>Back to select building</button></Link>
      <Link to="/results"><button className={styles.button}>Confirm selection</button></Link>
    </div>
  );
}

export default GrassField;