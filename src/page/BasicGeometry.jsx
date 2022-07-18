import { useEffect } from 'react';

import * as THREE from 'three';
import { GUI } from 'dat.gui';

import SceneInit from '../lib/SceneInit';

function BasicGeometry() {

    useEffect(() => {
        const thisScene = new SceneInit('moduleCanvas');
        thisScene.initialize();
        thisScene.animate();

        const boxGeometry = new THREE.BoxGeometry(16, 16, 16);
        const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        thisScene.scene.add(boxMesh);

        // initialize GUI
        const gui = new GUI();

        // GUI - customization
        const geometryFolder = gui.addFolder('Mesh Geometry');
        geometryFolder.open();
        const rotationFolder = geometryFolder.addFolder('Rotation');
        rotationFolder.add(boxMesh.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
        rotationFolder.add(boxMesh.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
        rotationFolder.add(boxMesh.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');
        const scaleFolder = geometryFolder.addFolder('Scale');
        scaleFolder.add(boxMesh.scale, 'x', 0, 2).name('Scale X Axis');
        scaleFolder.add(boxMesh.scale, 'y', 0, 2).name('Scale Y Axis');
        scaleFolder.add(boxMesh.scale, 'z', 0, 2).name('Scale Z Axis');
        scaleFolder.open();

        const materialFolder = gui.addFolder('Tray Material');
        const materialParams = {
            boxMeshColor: boxMesh.material.color.getHex(),
        };
        materialFolder.add(boxMesh.material, 'wireframe');
        materialFolder.addColor(materialParams, 'boxMeshColor').onChange((value) => boxMesh.material.color.set(value));

        // Destroy the GUI on reload to prevent multiple stale UI from being displayed on screen.
        return () => {
            gui.destroy();
        };
    }, []);

    return (
        <div>
            <canvas id="moduleCanvas" />
        </div>
    );
}

export default BasicGeometry;