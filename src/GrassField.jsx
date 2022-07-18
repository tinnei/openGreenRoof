import { useEffect } from 'react';
import * as THREE from 'three';

import SceneInit from './lib/SceneInit';

// TODO: get building geometry from map selectedBuildingGeometry

function GrassField() {

  useEffect(() => {
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
    // -- reorganized code -- //
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

    // const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    // const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    //   const count = 20;
    //   const instancedGrassMesh = new THREE.InstancedMesh(
    //     boxGeometry,
    //     boxMaterial,
    //     count
    //   );
    //   thisScene.scene.add(instancedGrassMesh);

    //   const dummy = new THREE.Object3D();
    //   for (let i = 0; i < count; i++) {
    //     for (let j = 0; j < count; j++) {
    //       dummy.position.set(i, 0, j);
    //       dummy.updateMatrix();
    //       instancedGrassMesh.setMatrixAt(i * j + j, dummy.matrix);
    //     }
    //   }

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
    </div>
  );
}

export default GrassField;