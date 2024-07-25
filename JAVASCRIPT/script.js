// Global variable to track cursor position
let cursorX = 0;

// Event listener to update cursor position on mouse move
document.addEventListener('mousemove', (event) => {
    cursorX = event.clientX;
});

// Function to animate the split screen effect
function animate() {
    const screenWidth = window.innerWidth;
    const percentage = (cursorX / screenWidth) * 100;

    // Get DOM elements
    const galanacci = document.getElementById('galanacci');
    const pog = document.getElementById('pog');
    const galanacciLogo = document.querySelector('#galanacci-logo img');
    const pogLogo = document.querySelector('#pog-logo img');

    // Update clip paths based on cursor position
    galanacci.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    pog.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;

    // Calculate and set logo opacities
    let galanacciOpacity = 1, pogOpacity = 0;

    if (percentage < 20) {
        galanacciOpacity = 1;
        pogOpacity = 0;
    } else if (percentage > 80) {
        galanacciOpacity = 0;
        pogOpacity = 1;
    } else {
        galanacciOpacity = 1 - (percentage - 12.5) / 75;
        pogOpacity = (percentage - 12.5) / 75;
    }

    galanacciLogo.style.opacity = galanacciOpacity;
    pogLogo.style.opacity = pogOpacity;

    // Continue animation
    requestAnimationFrame(animate);
}

// Start the animation
requestAnimationFrame(animate);

// Image modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('img01');
    const images = document.querySelectorAll('.product-image');
    let currentImageIndex = 0;

    // Open modal on image click
    images.forEach((image, index) => {
        image.onclick = function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            currentImageIndex = index;
        };
    });

    // Close modal
    document.getElementsByClassName('close-modal')[0].onclick = () => modal.style.display = 'none';

    // Navigate between images in modal
    function showImage(n) {
        currentImageIndex = (currentImageIndex + n + images.length) % images.length;
        modalImg.src = images[currentImageIndex].src;
    }

    document.querySelector('.prev').onclick = () => showImage(-1);
    document.querySelector('.next').onclick = () => showImage(1);
});

// 3D Wardrobe functionality

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('wardrobe-container').appendChild(renderer.domElement);

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
        [-4, -2, 0],
        [0, -2, 0],
        [4, -2, 0],
        [4, -5.5, 0],
        [0, -6, 0],
        [-4, -6, 0]
    ];

    const defaultScale = 4;

    const productInfo = {
        '/3DM/GLN_DENIM_JACKET.glb': {
            title: "Product Tite 1",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/denim_jacket_1.jpg",
                "/images/denim_jacket_2.jpg",
                "/images/denim_jacket_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET.glb': {
            title: "Product Tite 2",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_1.jpg",
                "/images/leather_jacket_2.jpg",
                "/images/leather_jacket_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_2.glb': {
            title: "Product Tite 3",
            price: "£1,500.00",
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
        },
        '/3DM/GLN_LEATHER_JACKET_3.glb': {
            title: "Product Tite 5",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
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

    modelPaths.forEach((path, index) => {
        console.log('Loading model:', path);
        loader.load(path, (gltf) => {
            console.log('Model loaded:', path);
            const model = gltf.scene;
            model.position.set(...modelPositions[index]);
            model.scale.set(defaultScale, defaultScale, defaultScale);
            model.userData.isSelected = false;
            model.userData.defaultScale = defaultScale;
            scene.add(model);
            models.push(model);
        }, undefined, (error) => {
            console.error(error);
        });
    });

    camera.position.set(0, -2, 7);

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

    let selectedModel = null;
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let isTransitioning = false;

    let touchStartX, touchStartY;
    let rotationSpeed = 0.005;
    let rotationMomentum = 0;
    let lastTouchTime = 0;
    const maxRotationSpeed = 0.1;

    let currentZoom = 1;
    const maxZoom = 1.3;
    const minZoom = 1;
    const zoomSpeed = 0.005;
    let initialCameraDistance = 7;

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

    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    function isPointInOverlay(x, y) {
        const overlay = document.getElementById('product-overlay');
        const rect = overlay.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom &&
            overlay.classList.contains('visible')
        );
    }

    function showOverlay(modelPath) {
        console.log('Showing overlay for:', modelPath);
        const info = productInfo[modelPath];
        if (info) {
          try {
            document.getElementById('product-title').textContent = info.title;
            document.getElementById('product-price').textContent = info.price;
            document.getElementById('product-description').textContent = info.description;
            
            // Populate images
            const imageContainer = document.querySelector('#image-overlay .image-container');
            const mobileImageContainer = document.querySelector('#product-overlay .product-images');
            if (imageContainer) imageContainer.innerHTML = '';
            if (mobileImageContainer) mobileImageContainer.innerHTML = '';
            
            info.images.forEach(src => {
              const img = document.createElement('img');
              img.src = src;
              img.alt = info.title;
              if (imageContainer) imageContainer.appendChild(img.cloneNode(true));
              if (mobileImageContainer) mobileImageContainer.appendChild(img);
            });
      
            document.getElementById('product-overlay').classList.add('visible');
            document.getElementById('image-overlay').classList.add('visible');
            
            if (isMobileDevice()) {
              document.getElementById('product-overlay').style.height = '50%';
            }
          } catch (error) {
            console.error('Error showing overlay:', error);
          }
        } else {
          console.error('No product info found for:', modelPath);
        }
      }

      function hideOverlay() {
        console.log('Hiding overlay');
        document.getElementById('product-overlay').classList.remove('visible');
        document.getElementById('image-overlay').classList.remove('visible');
        if (isMobileDevice()) {
          document.getElementById('product-overlay').style.height = '33.33%';
        }
      }

    function onClick(event) {
        console.log('Click event triggered');
        event.preventDefault();

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
                .to({
                    x: center.x,
                    y: center.y,
                    z: center.z + distance
                }, 1000)
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

            new TWEEN.Tween(spotLight)
                .to({ intensity: 5 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(ambientLight)
                .to({ intensity: 0 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

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

            new TWEEN.Tween(spotLight)
                .to({ intensity: 0 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            new TWEEN.Tween(ambientLight)
                .to({ intensity: 8 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();

            hideOverlay();
        }
    }

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

    window.addEventListener('mousedown', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
            isDragging = true;
            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    });

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

    window.addEventListener('mousemove', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) {
            document.body.style.cursor = 'auto';
            return;
        }
        if (isDragging && selectedModel && selectedModel.userData.isSelected) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            rotationSpeed = 0.005 * (window.devicePixelRatio || 1);
            let rotation = deltaMove.x * rotationSpeed;

            rotation = Math.max(Math.min(rotation, maxRotationSpeed), -maxRotationSpeed);

            selectedModel.rotation.y += rotation;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }

            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(models, true);
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    });

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

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
        initialPinchDistance = 0;
        if (Math.abs(rotationMomentum) > 0.0001) {
            requestAnimationFrame(updateModelRotation);
        }
    });

    window.addEventListener('wheel', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        event.preventDefault();
        handleZoom(-event.deltaY * 0.0005);
    }, { passive: false });

    window.addEventListener('mousedown', onClick);
    window.addEventListener('touchstart', onClick, { passive: false });

    function resizeRenderer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        
        camera.updateProjectionMatrix();
        adjustCameraAndModels();
    }

    window.addEventListener('resize', resizeRenderer);

    // Add event listener for the "Add to Cart" button
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
            if (isUp) {
                dragText.textContent = 'Swipe Down';
                dragHandle.classList.add('down');
            } else {
                dragText.textContent = 'Swipe Up';
                dragHandle.classList.remove('down');
            }
        }
    
        function startDragging(e) {
            if (!overlay.classList.contains('visible')) return;
            isDragging = true;
            startY = e.touches[0].clientY;
            startHeight = overlay.offsetHeight;
            overlay.style.transition = 'none';
        }
    
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const currentY = e.touches[0].clientY;
            const deltaY = startY - currentY;
            let newHeight = startHeight + deltaY;
            newHeight = Math.max(window.innerHeight * 0.1, Math.min(newHeight, window.innerHeight * 0.9));
            
            overlay.style.height = `${newHeight}px`;
        }
    
        function stopDragging() {
            if (!isDragging) return;
            isDragging = false;
            overlay.style.transition = 'height 0.3s ease-out';
            
            const currentHeight = overlay.offsetHeight;
            const threshold = window.innerHeight * 0.5;
            
            if (currentHeight > threshold) {
                overlay.style.height = '90%';
                updateDragHandleState(true);
            } else {
                overlay.style.height = '10%';
                updateDragHandleState(false);
            }
        }
    
        dragHandle.addEventListener('touchstart', startDragging, { passive: false });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchcancel', stopDragging);
    
        // Initial state
        updateDragHandleState(false);
    }
    
    // Call this function when the DOM is loaded
    document.addEventListener('DOMContentLoaded', initOverlayDrag);

    // Initialize overlay drag functionality
    initOverlayDrag();

    // Initial setup
    resizeRenderer()
    
});