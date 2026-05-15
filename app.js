import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// 1. SCENE & CAMERA SETUP
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Position camera behind where the player will start
camera.position.set(0, 5, 10); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// ==========================================
// 2. CREATE THE MADDEN FIELD
// ==========================================
// Main green field (53.3 yards wide, 120 yards long including endzones)
const fieldGeo = new THREE.PlaneGeometry(53.3, 120);
const fieldMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.8 });
const field = new THREE.Mesh(fieldGeo, fieldMat);
field.rotation.x = -Math.PI / 2; // Lay it flat
scene.add(field);

// Add White Yard Lines every 10 units
for (let z = -50; z <= 50; z += 10) {
    const lineGeo = new THREE.PlaneGeometry(53.3, 0.3);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.01, z); // Slightly above grass to prevent glitching
    scene.add(line);
}

// ==========================================
// 3. THE PLAYER (Placeholder Box for now)
// ==========================================
// ==========================================
// 3. THE ACTUAL PLAYER MODEL
// ==========================================
const loader = new GLTFLoader();
let player; // This will hold our 3D model once it loads

loader.load(
    'models/player.glb', 
    function (gltf) {
        player = gltf.scene;
        
        // Madden players are big! Adjust scale if he looks like an ant
        player.scale.set(1, 1, 1); 
        
        player.position.set(0, 0, 40); // Start on the field
        scene.add(player);
    },
    undefined,
    function (error) {
        console.error('Model failed to load:', error);
    }
);

// ==========================================
// 4. CONTROLS & MOVEMENT LOGIC
// ==========================================
const keys = { w: false, a: false, s: false, d: false };
const moveSpeed = 0.3;

// Listen for key presses
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (key in keys) keys[key] = false;
});

// ==========================================
// 5. THE GAME LOOP (Updates every frame)
// ==========================================
function animate() {
    requestAnimationFrame(animate);

    // Player Movement
    if (keys.w) player.position.z -= moveSpeed; // Run forward (down field)
    if (keys.s) player.position.z += moveSpeed; // Run backward
    if (keys.a) player.position.x -= moveSpeed; // Strafe left
    if (keys.d) player.position.x += moveSpeed; // Strafe right

    // Madden Camera Follow: Keep camera locked behind the player
    camera.position.x = player.position.x;
    camera.position.y = player.position.y + 4;  // 4 units above player
    camera.position.z = player.position.z + 8;  // 8 units behind player
    camera.lookAt(player.position);

    renderer.render(scene, camera);
}

// Handle browser window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();