const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas })
console.log(renderer)

const fav = 75
const aspect = 2
const near = 0.1
const far = 5.0
const camera = new THREE.PerspectiveCamera(fav, aspect, near, far)
camera.position.z = 2;

const scene = new THREE.Scene();

const height = 1
const width = 1
const depth = 1
const geometry = new THREE.BoxGeometry(width, height, depth)

const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 })

const cube = new THREE.Mesh(geometry, material)
console.log(cube)

scene.add(cube)

// renderer.render(scene, camera)

const color = 0xFFFFFF
const intensity = 1
const light = new THREE.DirectionalLight(color, intensity)
light.position.set(-1, 2, 4)
scene.add(light)

function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width != width || canvas.height != height;
    if(needResize) 
        renderer.setSize(width, height, false)

    return needResize;
}

function render(time) {
    time *= 0.001

    if(resizeRendererToDisplaySize()) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    cube.rotation.x = time;
    cube.rotation.y = time;

    renderer.render(scene, camera)

    requestAnimationFrame(render)
}
render()