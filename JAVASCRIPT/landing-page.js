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