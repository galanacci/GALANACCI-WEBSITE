// 3D Wardrobe functionality

document.addEventListener('DOMContentLoaded', () => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('wardrobe-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 8);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff, 0);
    spotLight.position.set(0, 0, 10);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.5;
    spotLight.distance = 10;
    scene.add(spotLight);
    const spotLightTarget = new THREE.Object3D();
    scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;

    // Model loading
    const loader = new THREE.GLTFLoader();
    const models = [];
    const modelPaths = [
        '/3DM/GLN_DENIM_JACKET.glb',
        '/3DM/GLN_LEATHER_JACKET.glb',
        '/3DM/GLN_LEATHER_JACKET_2.glb',
        '/3DM/GLN_LEATHER_VEST.glb',
        '/3DM/GLN_LEATHER_JACKET_3.glb',
        '/3DM/GLN_LEATHER_JACKET_4.glb'
    ];
    const modelPositions = [
        [-4, -2, 0], [0, -2, 0], [4, -2, 0],
        [4, -5.5, 0], [0, -6, 0], [-4, -6, 0]
    ];
    const defaultScale = 4;

    const productInfo = {
        '/3DM/GLN_DENIM_JACKET.glb': {
            title: "K2G LEATHER JACKET",
            price: "£2,000.00",
            description: "This is a 1 of 1 piece which was hand-screenprinted by GALANACCI THE CREATOR. 'K2G,' standing for 'Keys 2 Greatness,' is the brand's emblem and serves as a&nbsp;symbol for greatness. This emblem originates from the original 'Greatness' graphic.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET.glb': {
            title: "K2G CROPPED LEATHER JACKET",
            price: "£2,500.00",
            description: "This is a 1 of 1 piece which was hand-screenprinted by GALANACCI THE CREATOR. The 'Core' refers to the combination of the 'Pioneers of Greatness' slogan (front) and the 'Keys 2 Greatness' emblem (back). This is a flagship design for GALANACCI® and it symbolizes the pursuit of greatness.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_2.glb': {
            title: "Product Tite 3",
            price: "£3,200.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_2_1.jpg",
                "/images/leather_jacket_2_2.jpg",
                "/images/leather_jacket_2_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_VEST.glb': {
            title: "Product Tite 4",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
                        images: [
                "/images/leather_jacket_2_1.jpg",
                "/images/leather_jacket_2_2.jpg",
                "/images/leather_jacket_2_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_3.glb': {
            title: "POG DENIM JACKET",
            price: "£1,500.00",
            description: "This is a 1 of 1 piece which was hand-embroidered by GALANACCI THE CREATOR. 'POG,' standing for 'Pioneers of Greatness,' is the brand's slogan and serves as an invitation for you to become a pioneer of greatness. This concept originates from the 'Greatness' poem.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_4.glb': {
            title: "Product Tite 6",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_4_1.jpg",
                "/images/leather_jacket_4_2.jpg",
                "/images/leather_jacket_4_3.jpg"
            ]
        }
    };

    // Load models
    modelPaths.forEach((path, index) => {
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.position.set(...modelPositions[index]);
            model.scale.set(defaultScale, defaultScale, defaultScale);
            model.userData = { isSelected: false, defaultScale };
            scene.add(model);
            models.push(model);
        });
    });

    camera.position.set(0, -2, 7);

    // Variables for interaction
    let selectedModel = null;
    let isDragging = false;
    let isTransitioning = false;
    let rotationSpeed = 0.005;
    let rotationMomentum = 0;
    let currentZoom = 1;
    const maxZoom = 1.3, minZoom = 1, zoomSpeed = 0.005;
    let initialCameraDistance = 7;
    const maxRotationSpeed = 0.1;

    function updateModelRotation() {
        if (selectedModel && selectedModel.userData.isSelected) {
            rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);
            selectedModel.rotation.y += rotationMomentum;
            rotationMomentum *= 0.95;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }

            if (Math.abs(rotationMomentum) > 0.0001) {
                requestAnimationFrame(updateModelRotation);
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        models.forEach(model => {
            if (!model.userData.isSelected) {
                model.rotation.y += 0.005;
            }
        });
        if (selectedModel && selectedModel.userData.isSelected) {
            rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);
            selectedModel.rotation.y += rotationMomentum;
            rotationMomentum *= 0.95;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }
        }
        TWEEN.update();
        renderer.render(scene, camera);
    }
    animate();

    // Utility functions
    const isMobileDevice = () => window.innerWidth <= 768;
    const isPointInOverlay = (x, y) => {
        const overlay = document.getElementById('product-overlay');
        const rect = overlay.getBoundingClientRect();
        return (
            x >= rect.left && x <= rect.right &&
            y >= rect.top && y <= rect.bottom &&
            overlay.classList.contains('visible')
        );
    };

    // Show/hide overlay
    function showOverlay(modelPath) {
        const info = productInfo[modelPath];
        if (info) {
            document.getElementById('product-title').textContent = info.title;
            document.getElementById('product-price').textContent = info.price;
            document.getElementById('product-description').textContent = info.description;
            
            const imageContainer = document.querySelector('#image-overlay .image-container');
            const mobileImageContainer = document.querySelector('#product-overlay .product-images');
            [imageContainer, mobileImageContainer].forEach(container => {
                if (container) {
                    container.innerHTML = '';
                    info.images.forEach((src, index) => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = info.title;
                        img.addEventListener('click', (event) => {
                            event.stopPropagation();
                            showImage(index);
                            showViewer();
                        });
                        container.appendChild(img.cloneNode(true));
                    });
                }
            });

            document.getElementById('product-overlay').classList.add('visible');
            document.getElementById('image-overlay').classList.add('visible');
            
            if (isMobileDevice()) {
                document.getElementById('product-overlay').style.height = '50%';
                document.getElementById('product-overlay').style.overflowY = 'auto';
                document.getElementById('product-overlay').style.WebkitOverflowScrolling = 'touch';
            }
        }
    }

    function hideOverlay() {
        document.getElementById('product-overlay').classList.remove('visible');
        document.getElementById('image-overlay').classList.remove('visible');
        if (isMobileDevice()) {
            document.getElementById('product-overlay').style.height = '33.33%';
        }
    }

    // Click handler
    function onClick(event) {
        if (isTransitioning) return;
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
        if (isPointInOverlay(clientX, clientY)) return;

        const mouse = new THREE.Vector2(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(models, true);

        if (intersects.length > 0) {
            const clickedModel = intersects[0].object.parent;
            if (selectedModel && selectedModel !== clickedModel) {
                selectedModel.userData.isSelected = false;
            }
            selectedModel = clickedModel;
            isTransitioning = true;

            const boundingBox = new THREE.Box3().setFromObject(clickedModel);
            const center = boundingBox.getCenter(new THREE.Vector3());
            const size = boundingBox.getSize(new THREE.Vector3());
            const distance = size.length() * 0.75;

            new TWEEN.Tween(camera.position)
                .to({ x: center.x, y: center.y, z: center.z + distance }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    isTransitioning = false;
                    selectedModel.userData.isSelected = true;
                    currentZoom = 1;
                    initialCameraDistance = distance;
                })
                .start();

            spotLight.position.set(center.x, center.y, center.z + distance);
            spotLightTarget.position.copy(center);

            new TWEEN.Tween(spotLight).to({ intensity: 5 }, 1000).start();
            new TWEEN.Tween(ambientLight).to({ intensity: 0 }, 1000).start();

            const modelPath = modelPaths[models.indexOf(clickedModel)];
            showOverlay(modelPath);
        } else if (selectedModel) {
            isTransitioning = true;
            new TWEEN.Tween(camera.position)
                .to({ x: 0, y: -2, z: 7 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    isTransitioning = false;
                    selectedModel.userData.isSelected = false;
                    selectedModel = null;
                    currentZoom = 1;
                    adjustCameraAndModels();
                })
                .start();

            new TWEEN.Tween(spotLight).to({ intensity: 0 }, 1000).start();
            new TWEEN.Tween(ambientLight).to({ intensity: 8 }, 1000).start();

            hideOverlay();
        }
    }

    // Zoom functionality
    function handleZoom(delta) {
        if (selectedModel && selectedModel.userData.isSelected) {
            currentZoom += delta;
            currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));
    
            const boundingBox = new THREE.Box3().setFromObject(selectedModel);
            const center = boundingBox.getCenter(new THREE.Vector3());
            
            const newCameraPosition = new THREE.Vector3(
                center.x,
                center.y,
                center.z + initialCameraDistance / currentZoom
            );
    
            camera.position.copy(newCameraPosition);
            camera.lookAt(center);
        }
    }

    // Event listeners
    window.addEventListener('mousedown', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (isDragging && selectedModel && selectedModel.userData.isSelected) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            rotationSpeed = 0.005 * (window.devicePixelRatio || 1);
            let rotation = deltaMove.x * rotationSpeed;

            rotation = Math.max(Math.min(rotation, maxRotationSpeed), -maxRotationSpeed);

            selectedModel.rotation.y += rotation;

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('wheel', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        event.preventDefault();
        handleZoom(-event.deltaY * 0.0005);
    }, { passive: false });

    window.addEventListener('mousedown', onClick);
    window.addEventListener('touchstart', onClick, { passive: false });

    // Resize handler
    function adjustCameraAndModels() {
        const aspect = window.innerWidth / window.innerHeight;

        if (aspect < 1) {
            camera.fov = 100;
            models.forEach(model => {
                const scale = model.userData.defaultScale * 0.75;
                model.scale.set(scale, scale, scale);
            });
        } else {
            camera.fov = 75;
            models.forEach(model => {
                const scale = model.userData.defaultScale;
                model.scale.set(scale, scale, scale);
            });
        }

        camera.updateProjectionMatrix();
    }

    function resizeRenderer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        adjustCameraAndModels();
    }
    window.addEventListener('resize', resizeRenderer);

    // Add to cart functionality
    document.getElementById('add-to-cart').addEventListener('click', () => {
        const size = document.getElementById('size-select').value;
        const color = document.getElementById('color-select').value;
        const title = document.getElementById('product-title').textContent;
        alert(`Added ${title} (Size: ${size.toUpperCase()}, Color: ${color}) to cart!`);
    });

    // Overlay drag functionality
    function initOverlayDrag() {
        if (!isMobileDevice()) return;
        const overlay = document.getElementById('product-overlay');
        const dragHandle = document.querySelector('.drag-handle');
        const dragText = dragHandle.querySelector('.text');
        let startY, startHeight, isDragging = false;

        function updateDragHandleState(isUp) {
            dragText.textContent = isUp ? 'Swipe Down' : 'Swipe Up';
            dragHandle.classList.toggle('down', isUp);
        }

        dragHandle.addEventListener('touchstart', (e) => {
            if (!overlay.classList.contains('visible')) return;
            isDragging = true;
            startY = e.touches[0].clientY;
            startHeight = overlay.offsetHeight;
            overlay.style.transition = 'none';
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaY = startY - e.touches[0].clientY;
            let newHeight = Math.max(window.innerHeight * 0.1, Math.min(startHeight + deltaY, window.innerHeight * 0.9));
            overlay.style.height = `${newHeight}px`;
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            overlay.style.transition = 'height 0.3s ease-out';
        const currentHeight = overlay.offsetHeight;
        const threshold = window.innerHeight * 0.5;
        overlay.style.height = currentHeight > threshold ? '90%' : '10%';
        updateDragHandleState(currentHeight > threshold);
    });

    updateDragHandleState(false);
}

document.addEventListener('DOMContentLoaded', initOverlayDrag);

// Image lightbox functionality
const fullscreenViewer = document.getElementById('fullscreen-image-viewer');
const fullscreenImage = fullscreenViewer.querySelector('.fullscreen-image');
const closeViewer = fullscreenViewer.querySelector('.close-viewer');
const prevButton = fullscreenViewer.querySelector('.prev');
const nextButton = fullscreenViewer.querySelector('.next');

let currentImageIndex = 0;
let images = [];

function showImage(index) {
    fullscreenImage.src = images[index].src;
    currentImageIndex = index;
}

function showViewer() {
    fullscreenViewer.style.display = 'flex';
}

function hideViewer() {
    fullscreenViewer.style.display = 'none';
}

closeViewer.addEventListener('click', hideViewer);
prevButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
});
nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
});

document.addEventListener('click', function(event) {
    if (event.target.matches('.product-images img')) {
        showViewer();
    }
});

// Touch events for model rotation
let touchStartX, touchStartY;
let lastTouchTime = 0;

window.addEventListener('touchstart', (event) => {
    if (isPointInOverlay(event.touches[0].clientX, event.touches[0].clientY)) return;
    if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
        if (event.touches.length === 1) {
            isDragging = true;
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
            lastTouchTime = Date.now();
            rotationMomentum = 0;
        } else if (event.touches.length === 2) {
            initialPinchDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
        }
    }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
    if (isPointInOverlay(event.touches[0].clientX, event.touches[0].clientY)) return;
    if (selectedModel && selectedModel.userData.isSelected) {
        event.preventDefault();
        if (event.touches.length === 1 && isDragging) {
            const currentX = event.touches[0].clientX;
            const deltaMove = currentX - touchStartX;

            const currentTime = Date.now();
            const timeDelta = Math.max(currentTime - lastTouchTime, 1);

            rotationSpeed = 0.005 * (window.devicePixelRatio || 1);
            let rotation = deltaMove * rotationSpeed;

            rotation = Math.max(Math.min(rotation, maxRotationSpeed), -maxRotationSpeed);

            selectedModel.rotation.y += rotation;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }

            rotationMomentum = rotation / timeDelta * 15;
            rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);

            touchStartX = currentX;
            lastTouchTime = currentTime;
        } else if (event.touches.length === 2) {
            const currentPinchDistance = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
            
            if (initialPinchDistance > 0) {
                const pinchDelta = (currentPinchDistance - initialPinchDistance) * zoomSpeed;
                handleZoom(pinchDelta);
            }
            
            initialPinchDistance = currentPinchDistance;
        }
    }
}, { passive: false });

window.addEventListener('touchend', () => {
    isDragging = false;
    initialPinchDistance = 0;
    if (Math.abs(rotationMomentum) > 0.0001) {
        requestAnimationFrame(updateModelRotation);
    }
});

// Initial setup
resizeRenderer();
});