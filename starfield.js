// Three.js Starfield Animation
(function() {
    let scene, camera, renderer, stars = [];
    let starCount = 25000;
    let speed = 0.5;
    
    function init() {
        // Get canvas element
        const canvas = document.getElementById('starfield-canvas');
        if (!canvas) return;
        
        // Create scene
        scene = new THREE.Scene();
        
        // Create camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 0;
        
        // Create renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create stars
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const velocities = new Float32Array(starCount);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Random position in 3D space
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
            
            // Random velocity (speed towards camera)
            velocities[i] = Math.random() * 0.5 + 0.1;
            
            // Random size
            sizes[i] = Math.random() * 2 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create star material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffffff) }
            },
            vertexShader: `
                attribute float size;
                attribute float velocity;
                varying vec3 vColor;
                
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                    
                    // Color based on distance (brighter when closer)
                    float distance = length(mvPosition.xyz);
                    float brightness = 1.0 - (distance / 1000.0);
                    vColor = vec3(brightness, brightness, brightness);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        // Create points system
        const starSystem = new THREE.Points(geometry, material);
        scene.add(starSystem);
        
        // Store reference for animation
        stars = {
            geometry: geometry,
            material: material,
            system: starSystem
        };
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start animation
        animate();
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        if (!stars.geometry) return;
        
        const positions = stars.geometry.attributes.position.array;
        const velocities = stars.geometry.attributes.velocity.array;
        
        // Update star positions
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Move stars towards camera
            positions[i3 + 2] += velocities[i] * speed;
            
            // Reset stars that have passed the camera
            if (positions[i3 + 2] > 100) {
                positions[i3] = (Math.random() - 0.5) * 2000;
                positions[i3 + 1] = (Math.random() - 0.5) * 2000;
                positions[i3 + 2] = -1000;
            }
        }
        
        // Update geometry
        stars.geometry.attributes.position.needsUpdate = true;
        
        // Update time uniform for shader
        stars.material.uniforms.time.value += 0.01;
        
        // Render
        renderer.render(scene, camera);
    }
    
    function onWindowResize() {
        if (!camera || !renderer) return;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

