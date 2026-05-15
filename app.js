import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene Setup
const scene = new THREE.Scene();

// 2. Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Position the camera slightly up and back

// 3. Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic camera controls (drag to rotate)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 4. Lighting (So we can see the model)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 5. Load the Player Model (.glb)
const loader = new GLTFLoader();
let playerModel;

loader.load(
    'models/player.glb', // Make sure your file is in this exact folder
    function (gltf) {
        playerModel = gltf.scene;
        scene.add(playerModel);
        
        // Optional: Center the model or scale it if it's too big/small
        // playerModel.scale.set(1, 1, 1); 
    },
    undefined, // Progress callback (optional)
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 6. Animation Loop (The "Heartbeat" of the game)
function animate() {
    requestAnimationFrame(animate);
    
    controls.update(); // Required for OrbitControls
    
    // Optional: make the player spin slowly just to see it!
    if (playerModel) {
        // playerModel.rotation.y += 0.01; 
    }

    renderer.render(scene, camera);
}

animate();