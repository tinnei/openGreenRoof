import { useEffect } from 'react';
import * as THREE from 'three';

import SceneInit from 'src/lib/SceneInit';

function GrassField() {

  useEffect(() => {
    const thisScene = new SceneInit('moduleCanvas');
    thisScene.initialize();
    thisScene.animate();

    // SET UP GRASS BASE PLANE
    const groundPlane = new THREE.PlaneGeometry(50, 50);

    const grassTexture = new THREE.TextureLoader().load("../assets/grass/grass.png");
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    const gtexture = new THREE.MeshLambertMaterial({ map: grassTexture, depthWrite: false, transparent: true, color: 0xFF00 });

    const grassBase = new THREE.Mesh(groundPlane, gtexture);
    grassBase.rotation.y = 0;
    thisScene.scene.add(grassBase);

    // GENERATE PATCH OF GRASS
    // -- reorganized code -- //
    var i = 0, maxDiv = 4, thisGrass;
    while (i < maxDiv) {
      thisGrass = grassBase.clone();
      thisGrass.rotation.y = i * (Math.round(Math.PI) / maxDiv);
      thisScene.scene.add(thisGrass);
      i += 1;
    }

    // GENERATE INSTANCED MESH
    // InstancedMesh( geometry : BufferGeometry, material : Material, count : Integer )
    // const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
    // thisScene.scene.add( instancedMesh );

  }, []);

  return (
    <div>
      <canvas id="moduleCanvas" />
    </div>
  );
}

export default GrassField;


// -- initial set up -- //
// const grass0 = new THREE.Mesh(groundPlane, gtexture);
// grass0.rotation.y = 0;
// thisScene.scene.add(grass0);

// const grass1 = grass0.clone();
// grass1.rotation.y =   Math.round(Math.PI)/4;
// thisScene.scene.add(grass1);

// const grass2 = grass0.clone();
// grass2.rotation.y =   Math.round(Math.PI)/2;
// thisScene.scene.add(grass2);

// const grass3 = grass0.clone();
// grass3.rotation.y =  3*Math.round(Math.PI)/4;
// thisScene.scene.add(grass3);
