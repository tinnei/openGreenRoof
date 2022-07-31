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
// [] add instanced mesh
// https://threejs.org/examples/#webgl_instancing_raycast
// [] check if within bounding box
// https://jsfiddle.net/f2Lommf5/11557/
// [] add vegetation menu
// [] add ID: make this page only accessible if user selected a building

function GrassField() {
  const location = useLocation();
  const { buildingGeometry, buildingHeight } = location.state;
  var objects = [];
  var raycaster = false;

  function disposeArray() {
    this.array = null;
  }

  useEffect(() => {
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();
    const grassSize = 16;
    const s = 1;

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
    objects.push(roofMesh);
    // group.add(roofMesh);
    // console.log("added occlude object -- ", objects);

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
    const gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });
    const grassBase = new THREE.Mesh(grassPlane, gtexture);
    grassBase.geometry.center();

    // [TODO] - GENERATE ONE PATCH OF GRASS
    // const grassGroup = new THREE.Group();
    // var i = 0, maxDiv = 4, thisGrass;
    // while (i < maxDiv) {
    //   thisGrass = grassBase.clone();
    //   thisGrass.rotation.y = i * (Math.round(Math.PI) / maxDiv);
    //   grassGroup.add(thisGrass);
    //   i += 1;
    // }
    // group.add(grassGroup);

    // GRASS INSTANCED MESH
    const amount = 20;
    const count = Math.pow(amount, 2);

    let grassInstancedMesh = new THREE.InstancedMesh(grassPlane, gtexture, count);
    let grass_i = 0; const stepSize = 5;
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
          matrix.setPosition(x * stepSize, grassSize / 2, z * stepSize);
          grassInstancedMesh.setMatrixAt(grass_i, matrix);
        }
        grass_i++;
      }
    }
    grassInstancedMesh.geometry.center();
    grassInstancedMesh.translateY(buildingHeight); // move grass to higher
    group.add(grassInstancedMesh);
    group.scale.set(s, s, s);

    //// REGULAR GRID
    // const grassGrid = 4;
    // const grassDensity = grassSize / 2;
    // for (let x = -grassGrid; x < grassGrid; x++) {
    //   for (let y = -grassGrid; y < grassGrid; y++) {
    //     group.add(grassGroup.clone().translateZ(x * grassDensity).translateX(y * grassDensity));
    //   }
    // }
  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
      {/* <pre id="features" className={styles.infoBox} >Select vegetations *WIP</pre> */}
      <Link to="/map"><button className={styles.leftButton}>Back to select building</button></Link>
      <Link to="/results"><button className={styles.button}>Confirm selection</button></Link>
    </div>
  );
}

export default GrassField;