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

    // BUILD THE TANK OBJECT
    const tankWidth = 4;
    const tankHeight = 1;
    const tankLength = 8;
    const tank = new THREE.Object3D();
    scene.add(tank);

    // MAKE THE TANK BODY
    const bodyGeometry = new THREE.BoxBufferGeometry(tankWidth, tankHeight, tankLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    bodyMesh.casteShadow = true;
    tank.add(bodyMesh);

    // MAKE THE TANK CAMERA AND PLACE IT ON THE BODY CONSTRUCTED ABOVE
    const tankCameraFov = 75;
    const tankCamera = makeCamera(tankCameraFov);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    bodyMesh.add(tankCamera);

    // MAKE THE WHEELS OF TANK
    const wheelRadius = 1;
    const wheelThickness = 0.5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderBufferGeometry(wheelRadius, wheelRadius, wheelThickness, wheelSegments);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA });
    const wheelPositions = [
      [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, tankLength / 3],
      [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, tankLength / 3],
      [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, 0],
      [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, 0],
      [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, -tankLength / 3],
      [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, -tankLength / 3],
    ];
    const wheelMeshes = wheelPositions.map(position => {
      const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheelMesh.position.set(...position);
      wheelMesh.rotation.z = Math.PI * 0.5;
      bodyMesh.add(wheelMesh);
      return wheelMesh;
    })

    // MAKE THE DOME ON THE TANK
    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * .5;
    const domeGeometry = new THREE.SphereBufferGeometry(
      domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
      domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = .5;

    // MAKE THE TANK TURRET
    const turretWidth = 0.1; 
    const turretHeight = 0.1;
    const turretLength = tankLength * 0.75 * 0.2;
    const turretGeometry = new THREE.BoxBufferGeometry(turretWidth, turretHeight, turretLength);
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
    turretMesh.casteShadow = true;
    turretMesh.position.z = turretLength * 0.5;
    const turretPivot = new THREE.Object3D();
    turretPivot.position.y = 1;
    turretPivot.position.z = turretLength * 0.5;
    turretPivot.scale.set(5,5,5);
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);

    // MAKE THE TURRET CAMERA
    const turretCamera = makeCamera();
    turretCamera.position.y = 0.75 * 0.2;
    turretMesh.add(turretCamera);

    // MAKE THE TARGET
    const targetGeometry = new THREE.SphereBufferGeometry(0.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.casteShadow = true;
    const targetOrbit = new THREE.Object3D();
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();
    scene.add(targetOrbit);
    targetOrbit.add(targetElevation);
    targetElevation.position.z = tankLength * 2;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);

    // MAKE THE TARGET CAMERA AND ADD IT ABOVE THE TARGET
    const targetCamera = makeCamera();
    const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.z = -2;
    targetCamera.position.y = 1;
    targetCamera.rotation.y = Math.PI;
    targetCameraPivot.add(targetCamera);
    targetBob.add(targetCameraPivot);
    // targetCamera.lookAt(0,0,0);

    // MAKE THE CURVE FOR THE TANK TO MOVE ON
    const curve = new THREE.SplineCurve( [
      new THREE.Vector2( -10, 0 ),
      new THREE.Vector2( -5, 5 ),
      new THREE.Vector2( 0, 0 ),
      new THREE.Vector2( 5, -5 ),
      new THREE.Vector2( 10, 0 ),
      new THREE.Vector2( 5, 10 ),
      new THREE.Vector2( -5, 10 ),
      new THREE.Vector2( -10, -10 ),
      new THREE.Vector2( -15, -8 ),
      new THREE.Vector2( -10, 0 ),
    ] );
    const points = curve.getPoints( 50 );
    const curveGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
    const splineObject = new THREE.Line(curveGeometry, curveMaterial);
    splineObject.rotation.x = Math.PI * 0.5;
    splineObject.position.y = 0.05;
    scene.add(splineObject);

    // POSITION VECTORS OF TARGET, TANK, AND TANK TARGET RESPECTIVELY
    const targetPosition = new THREE.Vector3();
    const tankPosition = new THREE.Vector2();
    const tankTarget = new THREE.Vector2();

    // CREATE A LIST OF ALL CAMERAS
    const cameras = [
      { cam: camera, name: 'Main Camera'},
      { cam: targetCamera, name: 'Target Camera'},
      { cam: tankCamera, name: 'Tank Camera'},
      { cam: turretCamera, name: 'Turret Camera'},
    ];

    // FINAL RENDER FUNCTION FOR ALL ANIMATIONS
    function render(time) {
      time *= 0.001;

      if(resizeRendererToDisplaySize(renderer,canvas)) {
        cameras.forEach( camera => {
          const cameraDetails = camera.cam;
          cameraDetails.aspect = canvas.clientWidth / canvas.clientHeight;
          cameraDetails.updateProjectionMatrix();
        });
      }

      // MOVING THE TARGET OBJECT
      const targetYSpeed = 2;
      const targetYMovementSpace = 4;
      const targetOrbitSpeed = 0.5;
      targetOrbit.rotation.y = time * targetOrbitSpeed;
      targetBob.position.y = Math.sin(time * targetYSpeed) * targetYMovementSpace;
      targetMesh.rotation.x = time * 7;
      targetMesh.rotation.y = time * 13;

      // MOVING THE TANK
      const tankSpeed = 0.05;
      const tankTime = time * tankSpeed;
      curve.getPointAt(tankTime%1, tankPosition);
      curve.getPointAt((tankTime+0.01)%1, tankTarget);
      tank.position.set(tankPosition.x, 0, tankPosition.y);
      tank.lookAt(tankTarget.x, 0, tankTarget.y);

      // ROTATING THE WHEELS
      wheelMeshes.forEach( wheelMesh => {
        wheelMesh.rotation.x = time * 3;
      })

      // TARGETING THE TARGET WITH TURRET
      targetMesh.getWorldPosition(targetPosition);
      turretPivot.lookAt(targetPosition);

      // MAKE THE TURRET CAMERA LOOK AT THE TARGET
      turretCamera.lookAt(targetPosition)

      // MAKE TARGET CAMERA LOOK AT TANK
      tank.getWorldPosition(targetPosition);
      targetCameraPivot.lookAt(targetPosition)

      // RENDER FINAL IMAGE TO CANVAS
      renderer.render(scene,camera)

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function resizeRendererToDisplaySize(renderer,canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}


main()