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

    // SET UP GROUND PLANE
    const groundSize = 100;
    const grassSize = 24;
    const groundPlane = new THREE.PlaneBufferGeometry(groundSize, groundSize);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const groundMesh = new THREE.Mesh(groundPlane, groundMaterial);
    groundMesh.rotateX(- Math.PI / 2);
    thisScene.scene.add(groundMesh);

    const p1x = buildingGeometry[0]["x"];
    const p1y = buildingGeometry[0]["y"];
    console.log("point 1 x:", p1x);
    console.log("point 1 y:", p1y);

    const geometry = new THREE.BufferGeometry();
    const verticesArray = [];
    for (var i = 0; i < buildingGeometry.length; i++) {
      verticesArray.push(buildingGeometry[i]["x"], buildingGeometry[i]["y"], 0);
    }
    console.log("vertice from geo: ", verticesArray);
    const verticesFromGeo = new Float32Array(verticesArray);

    geometry.setAttribute('position', new THREE.BufferAttribute(verticesFromGeo, 3));
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(- Math.PI / 2);
    mesh.geometry.center(); // key
    mesh.translateZ(5);
    thisScene.scene.add(mesh);

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