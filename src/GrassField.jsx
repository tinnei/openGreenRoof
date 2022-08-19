import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import * as THREE from 'three';
import SceneInit from './lib/SceneInit';

import styles from './styles/roof.module.css';

import customData from '../data/veg.json';

// TODO - Aug 1 to Aug 15
// - add context building to scene
// - add sunlight vectors
// - raycast sunlight
// - calculate sum of sunlights per day
// - show flower list based on sunlight
// - [DONE] randomize grass
// https://www.reddit.com/r/threejs/comments/scwjwb/im_trying_to_position_instances_of_instancedmesh/

function GrassField() {
  const location = useLocation();
  const { buildingGeometry, buildingHeight, nearbyBuildings } = location.state;

  const thisScene = new SceneInit('moduleCanvas');
  var objects = []; var raycaster = false;
  var gtexture; var textureUrl = new URL('../assets/texture/grass/grass.png', import.meta.url).href;

  const [selectedVeg, setSelectedVeg] = useState(0);

  function getImageUrl(name) {
    return new URL(`../assets/${name}`, import.meta.url).href;
  }

  function vegSelected(id, e) {
    e.preventDefault();
    let selectedVeg = id;
    setSelectedVeg(selectedVeg);
    console.log('You selected veg:' + selectedVeg + " name:" + customData[selectedVeg].vegName);

    textureUrl = getImageUrl(customData[id].imageSrc);
  }

  useEffect(() => {
    console.log("data here:", customData);
    thisScene.initialize();
    thisScene.animate();

    // Added custom angles here
    // TODO: incorporate this to sceneInit
    thisScene.scene.translateZ(25); // move camera to left
    thisScene.camera.translateX(100); // move down the camera to eye level with grassroof 

    const grassSize = 2;
    const s = 1;
    const amount = 100;
    const count = Math.pow(amount, 2);
    const stepSize = 0.4;

    // const axesHelper = new THREE.AxesHelper(20);
    // thisScene.scene.add(axesHelper);
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
    objects.push(roofMesh); // for grass occlusion
    group.add(roofMesh);

    // ADD ROOF VOLUME
    const extrudeSettings = { depth: buildingHeight, bevelEnabled: true, bevelSegments: 0, steps: 1, bevelSize: 1, bevelThickness: 1 };
    roofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofMesh = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    roofMesh.geometry.center();
    roofMesh.translateY(buildingHeight / 2);
    roofMesh.rotateX(- Math.PI / 2);
    group.add(roofMesh);

    // --------------------------------
    // ----- ADD NEARBY BUILDINGS ----- 
    // --------------------------------

    // ADD NEARBY BUILDINGS
    // TODO: center this after groupping
    // Need to merge two shapes
    let buildingGroup = new THREE.Group();

    console.log("nearbyBuildingData---", nearbyBuildings);
    nearbyBuildings.forEach((building) => {
      let buildingHeight = building["height"];
      let buildingCoors = building["coors"];
      console.log(buildingHeight);
      console.log(buildingCoors);

      const roofShape = new THREE.Shape(buildingCoors);
      const extrudeSettings = { depth: buildingHeight, bevelEnabled: true, bevelSegments: 0, steps: 1, bevelSize: 1, bevelThickness: 1 };
      let nearbyRoofGeometry = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
      let nearbyRoofMesh = new THREE.Mesh(nearbyRoofGeometry, new THREE.MeshPhongMaterial({ color: 0x00ffff }));
      nearbyRoofMesh.rotateX(- Math.PI / 2);
      buildingGroup.add(nearbyRoofMesh);
    });
    buildingGroup.name = "surroundingBuildingsGroup"
    thisScene.scene.add(buildingGroup);

    const aabb = new THREE.Box3();
    let bboxcenter = aabb.setFromObject(buildingGroup).getCenter(buildingGroup.position).multiplyScalar(- 1);
    console.log("bounding box center of group:", bboxcenter);
    buildingGroup.translateX(0);
    buildingGroup.translateY(buildingHeight / 2);
    buildingGroup.translateZ(0);
    // bboxcenter = aabb.setFromObject(buildingGroup).getCenter(buildingGroup.position);
    // console.log("updated bounding box of group", bboxcenter);

    // ------------------------
    // ----- PUT ON GRASS ----- 
    // ------------------------

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
    const zDirection = new THREE.Vector3(0, -1, 0);

    let rndX; let rndY;
    let rndRotationX; let rndRotationY;

    for (let x = -amount / 2; x < amount / 2; x++) {
      for (let z = -amount / 2; z < amount / 2; z++) {

        // STEP 1: Calculate intersection
        pointer.x = x * stepSize;
        pointer.y = 50;
        pointer.z = z * stepSize;
        raycaster.set(pointer, zDirection);
        // thisScene.scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000));
        var intersects = raycaster.intersectObjects(objects);
        // console.log("intersect at point", grass_i, ":", intersects);

        // STEP 2: Calculate instancedMesh matrix
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        if (intersects.length > 0) {
          rndX = Math.random(); rndY = Math.random();
          position.x = x * stepSize + rndX;
          position.y = grassSize / 2;
          position.z = z * stepSize + rndY;

          rndRotationX = Math.random();
          rotation.y = rndRotationX;
          quaternion.setFromEuler(rotation);
          scale.x = scale.y = scale.z = Math.random() * 0.5 + 0.5;

          matrix.compose(position, quaternion, scale);
          grassInstancedMeshX.setMatrixAt(grass_i, matrix);

          rndRotationY = Math.random();
          rotation.y = rndRotationY;
          quaternion.setFromEuler(rotation);
          scale.x = scale.y = scale.z = Math.random() * 1;

          matrix.compose(position, quaternion, scale);
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

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
      <pre id="features" className={styles.infoBox} >
        <h1>Select vegetations *WIP</h1>
        <div className={styles.vegButtonGroups}>
          <button id="vegBtn" className={styles.vegButton} onClick={(e) => vegSelected(0, e)}>
            <img className={styles.vegButtonImg} src="../assets/menu/flower/common_daisy.png" />
            <h5>Common Daisy</h5></button>
          <button id="vegBtn" className={styles.vegButton} onClick={(e) => vegSelected(1, e)}>
            <img className={styles.vegButtonImg} src="../assets/menu/flower/armeria_maritama.png" />
            <h5>Armeria Maritama</h5></button>
        </div>
        <div className={styles.vegButtonGroups}>
          <button className={styles.vegButton}>
            Flower C</button>
          <button className={styles.vegButton}>Flower D</button>
        </div>
        <div className={styles.vegButtonGroups}>
          <button className={styles.vegButton}>Flower E</button>
          <button className={styles.vegButton}>Flower F</button>
        </div>
      </pre >
      <div className={styles.buttonGroup}>
        <Link to="/map"><button className={styles.button}>Back to select building</button></Link>
        <Link to="/results" state={{ veg: selectedVeg }}><button className={styles.button}>Confirm selection</button></Link>
      </div>
      {/* <Link to="/"><button className={styles.button}>Back to home</button></Link> */}
    </div >
  );
}

export default GrassField;