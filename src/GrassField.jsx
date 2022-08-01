import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import * as THREE from 'three';
import SceneInit from './lib/SceneInit';

import styles from './styles/roof.module.css';
// import textureUrl from '../assets/grass/grass.png';

import customData from '../data/veg.json';

// TODO: 
// [DONE] get building geometry from map selectedBuildingGeometry
// [DONE] draw plane based on points
// https://threejs.org/docs/#api/en/core/BufferGeometry
// [DONE] improve points
// https://threejs.org/examples/#webgl_geometry_shapes
// [DONE] add instanced mesh
// https://threejs.org/examples/#webgl_instancing_raycast
// [DONE] check if within bounding box
// https://jsfiddle.net/f2Lommf5/11557/
// [] add vegetation menu
// [] add ID: make this page only accessible if user selected a building

function GrassField() {
  const location = useLocation();
  const { buildingGeometry, buildingHeight } = location.state;
  var objects = [];
  var raycaster = false;
  var textureUrl = new URL('../assets/grass/grass.png', import.meta.url).href;
  var gtexture;

  function selectVeg(id, e) {
    e.preventDefault();
    console.log('You selected veg:' + id + " name:" + customData[id].vegName);
    // var vegImgUrl = '../assets/' + customData[id].imageSrc;
    // console.log("vegImgUrl", vegImgUrl);
    textureUrl = new URL('../assets/' + customData[id].imageSrc, import.meta.url).href;
  }

  useEffect(() => {
    console.log("data here:", customData);
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();
    const grassSize = 2;
    const s = 1;
    const amount = 40;
    const count = Math.pow(amount, 2);
    const stepSize = 1;

    const axesHelper = new THREE.AxesHelper(20);
    thisScene.scene.add(axesHelper);
    var gridHelper = new THREE.GridHelper(100, 10);
    thisScene.scene.add(gridHelper);
    let group = new THREE.Group();
    thisScene.scene.add(group);

    raycaster = new THREE.Raycaster();

    // ADD ROOF GEOMETRY PLANE
    const roofShape = new THREE.Shape(buildingGeometry);
    let roofGeometry = new THREE.ShapeGeometry(roofShape);
    roofGeometry.rotateX(- Math.PI / 2);
    let roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide }));
    roofMesh.geometry.center();
    objects.push(roofMesh); // for occlusion
    group.add(roofMesh);

    // ADD ROOF VOLUME
    const extrudeSettings = { depth: buildingHeight, bevelEnabled: true, bevelSegments: 0, steps: 1, bevelSize: 1, bevelThickness: 1 };
    roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    roofMesh.geometry.center();
    roofMesh.translateY(buildingHeight / 2);
    roofMesh.rotateX(- Math.PI / 2);
    group.add(roofMesh);


    // SET UP GRASS BASE PLANE
    const grassPlane = new THREE.PlaneGeometry(grassSize, grassSize);
    const grassTexture = new THREE.TextureLoader().load(textureUrl);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });
    const grassBase = new THREE.Mesh(grassPlane, gtexture);
    grassBase.geometry.center();

    // listen for texture change
    let vbtn = document.getElementById("vegBtn");
    vbtn.addEventListener("click", e => {
      e.preventDefault();
      gtexture.map = new THREE.TextureLoader().load(textureUrl);
    });

    // GRASS INSTANCED MESH
    const grassXPlane = grassPlane;
    const grassYPlane = new THREE.PlaneGeometry(grassSize, grassSize);
    grassYPlane.rotateY(Math.PI / 2);

    let grassInstancedMeshX = new THREE.InstancedMesh(grassXPlane, gtexture, count);
    let grassInstancedMeshY = new THREE.InstancedMesh(grassYPlane, gtexture, count);
    let grass_i = 0;
    let pointer = new THREE.Vector3();
    const matrix = new THREE.Matrix4();
    const zDirection = new THREE.Vector3(0, -1, 0);

    for (let x = -amount / 2; x < amount / 2; x++) {
      for (let z = -amount / 2; z < amount / 2; z++) {
        pointer.x = x * stepSize;
        pointer.y = 50;
        pointer.z = z * stepSize;
        raycaster.set(pointer, zDirection);
        // thisScene.scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000));

        var intersects = raycaster.intersectObjects(objects);
        // console.log("intersect at point", grass_i, ":", intersects);

        if (intersects.length > 0) {
          // console.log("ADD POINT", grass_i);
          // TODO: need to add some randomization here, eg: rotation
          matrix.setPosition(x * stepSize, grassSize / 2, z * stepSize);
          grassInstancedMeshX.setMatrixAt(grass_i, matrix);
          grassInstancedMeshY.setMatrixAt(grass_i, matrix);
        }
        grass_i++;
      }
    }
    grassInstancedMeshX.geometry.center();
    grassInstancedMeshY.geometry.center();
    grassInstancedMeshX.translateY(buildingHeight); // move grass to higher
    grassInstancedMeshY.translateY(buildingHeight); // move grass to higher
    group.add(grassInstancedMeshX);
    group.add(grassInstancedMeshY);
    group.scale.set(s, s, s);

    // [TODO] - GENERATE ONE PATCH OF GRASS with max div
    // const grassGroup = new THREE.Group();
    // var grassPlane_i = 0, maxDiv = 4, thisGrass;
    // while (grassPlane_i < maxDiv) {
    //   thisGrass = grassBase.clone();
    //   thisGrass.rotation.y = grassPlane_i * (Math.round(Math.PI) / maxDiv);
    //   grassGroup.add(thisGrass);
    //   grassPlane_i += 1;
    // }
    // group.add(grassGroup);
  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
      <pre id="features" className={styles.infoBox} >Select vegetations *WIP
        <div className={styles.vegButtonGroups}>
          <button id="vegBtn" className={styles.vegButton} onClick={(e) => selectVeg(0, e)}>Flower A</button>
          <button id="vegBtn" className={styles.vegButton} onClick={(e) => selectVeg(1, e)}>Flower B</button>
        </div>
        <div className={styles.vegButtonGroups}>
          <button className={styles.vegButton}>Flower C</button>
          <button className={styles.vegButton}>Flower D</button>
        </div>
        <div className={styles.vegButtonGroups}>
          <button className={styles.vegButton}>Flower E</button>
          <button className={styles.vegButton}>Flower F</button>
        </div>
      </pre>
      <Link to="/map"><button className={styles.leftButton}>Back to select building</button></Link>
      <Link to="/results"><button className={styles.button}>Confirm selection</button></Link>
    </div>
  );
}

export default GrassField;