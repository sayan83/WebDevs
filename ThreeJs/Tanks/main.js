function makeCamera(fov=40) {
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function main () {
    // Initialized rendered. Set its background color and added shadow property
    const canvas = document.getElementById('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xAAAAAA);
    renderer.shadowMap.enabled = true;

    // BUILD THE MAIN CAMERA
    const camera = makeCamera();
    camera.position.set(8,4,10).multiplyScalar(3);
    camera.lookAt(0,0,0);

    const scene = new THREE.Scene();

    // BUILD THE LIGHT-1 AND CONFIGURE SHADOWS FOR IT
    const light1 = new THREE.DirectionalLight(0xFFFFFF, 1);
    light1.position.set(0,20,0);
    scene.add(light1)
    light1.casteShadow = true;
    light1.shadow.mapSize.width = 2048;
    light1.shadow.mapSize.height = 2048;
    const d = 50;
    light1.shadow.camera.left = -d;
    light1.shadow.camera.right = d;
    light1.shadow.camera.top = d;
    light1.shadow.camera.bottom = -d;
    light1.shadow.camera.near = 1;
    light1.shadow.camera.far = 50;
    light1.shadow.bias = 0.001;

    // BUILD THE LIGHT-2
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(1, 2, 4);
    scene.add(light2);

    // BUILD THE GROUND
    const groundGeometry = new THREE.PlaneBufferGeometry(50,50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -0.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh)

    // BUILD THE TANK 




    // TEMPORARY RENDERING
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    renderer.render(scene,camera)
}


main()