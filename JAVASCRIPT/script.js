let cursorX = 0;

document.addEventListener('mousemove', (event) => {
    cursorX = event.clientX;
});

function animate() {
    const screenWidth = window.innerWidth;
    const percentage = (cursorX / screenWidth) * 100;

    const galanacci = document.getElementById('galanacci');
    const pog = document.getElementById('pog');
    const galanacciLogo = document.querySelector('#galanacci-logo img');
    const pogLogo = document.querySelector('#pog-logo img');

    galanacci.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0% 100%)`;
    pog.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;

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

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('img01');
    const images = document.querySelectorAll('.product-image');
    let currentImageIndex = 0;

    images.forEach((image, index) => {
        image.onclick = function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            currentImageIndex = index;
        };
    });

    document.getElementsByClassName('close-modal')[0].onclick = () => modal.style.display = 'none';

    function showImage(n) {
        currentImageIndex = (currentImageIndex + n + images.length) % images.length;
        modalImg.src = images[currentImageIndex].src;
    }

    document.querySelector('.prev').onclick = () => showImage(-1);
    document.querySelector('.next').onclick = () => showImage(1);
});

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
            title: "Product 1",
            price: "$1500.00",
            description: "Classic denim jacket with a modern twist.",
            colors: ['#0000FF', '#000000', '#FFFFFF'],
            images: ['/images/product1_1.jpg', '/images/product1_2.jpg', '/images/product1_3.jpg']
        },
        // ... (other product info)
    };

    modelPaths.forEach((path, index) => {
        loader.load(path, (gltf) => {
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
        camera.fov = aspect < 1 ? 100 : 75;
        models.forEach(model => {
            const scale = model.userData.defaultScale * (aspect < 1 ? 0.75 : 1);
            model.scale.set(scale, scale, scale);
        });
        camera.updateProjectionMatrix();
    }

    let isItemSelected = false;
    let selectedModel = null;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
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

    function showHUDOverlay(modelPath) {
        if (isItemSelected) {
            const info = productInfo[modelPath];
            if (info) {
                document.getElementById('product-title').textContent = info.title;
                document.getElementById('product-price').textContent = info.price;
                document.getElementById('product-description').textContent = info.description;
                
                const colorContainer = document.getElementById('product-colors');
                colorContainer.innerHTML = '';
                info.colors.forEach(color => {
                    const colorOption = document.createElement('div');
                    colorOption.className = 'color-option';
                    colorOption.style.backgroundColor = color;
                    colorContainer.appendChild(colorOption);
                });
                
                const imageSlider = document.getElementById('image-slider');
                imageSlider.innerHTML = '';
                info.images.forEach(imageSrc => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = info.title;
                    imageSlider.appendChild(img);
                });
                
                document.getElementById('hud-overlay').classList.remove('hidden');
            }
        }
    }

    function hideHUDOverlay() {
        document.getElementById('hud-overlay').classList.add('hidden');
    }

    function showFullImage(imageSrc) {
        document.getElementById('full-image').src = imageSrc;
        document.getElementById('full-image-container').classList.remove('hidden');
    }

    function hideFullImage() {
        document.getElementById('full-image-container').classList.add('hidden');
    }

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
                document.getElementById('hud-overlay').classList.remove('hidden');
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

    function showOverlay(modelPath) {
        const info = productInfo[modelPath];
        if (info) {
            document.getElementById('product-title').textContent = info.title;
            document.getElementById('product-price').textContent = info.price;
            document.getElementById('product-description').textContent = info.description;
            
            const colorContainer = document.getElementById('product-colors');
            colorContainer.innerHTML = '';
            info.colors.forEach(color => {
                const colorOption = document.createElement('div');
                colorOption.className = 'color-option';
                colorOption.style.backgroundColor = color;
                colorContainer.appendChild(colorOption);
            });
            
            document.getElementById('product-sizes').value = '';
            document.getElementById('product-overlay').classList.add('visible');
        }
    }

    function hideOverlay() {
        document.getElementById('product-overlay').classList.remove('visible');
    }

    function onClick(event) {
        event.preventDefault();
        if (isTransitioning) return;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

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
            isItemSelected = true;
            const modelPath = modelPaths[models.indexOf(clickedModel)];
            showHUDOverlay(modelPath);    

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

        } else if (selectedModel) {
            isTransitioning = true;
            isItemSelected = false;
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

            hideHUDOverlay();
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
        if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
            isDragging = true;
            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    });

    window.addEventListener('touchstart', (event) => {
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
    });

    window.addEventListener('touchmove', (event) => {
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

    window.addEventListener('mousemove', (event) => {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(models, true);
        document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'auto';
    });

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        handleZoom(-event.deltaY * 0.0005);
    }, { passive: false });

    window.addEventListener('mousedown', onClick);
    window.addEventListener('touchstart', onClick, { passive: false });
});

// Event listeners outside of DOMContentLoaded
document.getElementById('add-to-cart').addEventListener('click', () => {
    const size = document.getElementById('size-select').value;
    const title = document.getElementById('product-title').textContent;
    alert(`Added ${title} (Size: ${size.toUpperCase()}) to cart!`);
});

document.addEventListener('click', (event) => {
    const overlay = document.getElementById('product-overlay');
    const wardrobeContainer = document.getElementById('wardrobe-container');
    
    if (!overlay.contains(event.target) && !wardrobeContainer.contains(event.target)) {
        hideOverlay();
    }
});

document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('add-to-cart').addEventListener('click', function() {
    const selectedSize = document.querySelector('.size-btn.selected');
    if (selectedSize) {
        alert(`Added to cart: ${document.getElementById('product-title').textContent} - Size: ${selectedSize.dataset.size}`);
    } else {
        alert('Please select a size');
    }
});

document.getElementById('buy-now').addEventListener('click', function() {
    const selectedSize = document.querySelector('.size-btn.selected');
    if (selectedSize) {
        alert(`Proceeding to checkout: ${document.getElementById('product-title').textContent} - Size: ${selectedSize.dataset.size}`);
    } else {
        alert('Please select a size');
    }
});

document.getElementById('product-overlay').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
        hideOverlay();
    }
});

document.getElementById('close-full-image').addEventListener('click', hideFullImage);
document.getElementById('full-image-container').addEventListener('click', (event) => {
    if (event.target === event.currentTarget) {
        hideFullImage();
    }
});