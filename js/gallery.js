/**
 * Pavillon am Ufer - Gallery & Lightbox
 * Image gallery with lightbox functionality
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // Gallery Lightbox
    // ===================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    const images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push({
            src: img.src,
            alt: img.alt
        });

        // Click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image: ${img.alt}`);

        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Focus management for accessibility
        lightboxClose.focus();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Return focus to the gallery item that was clicked
        if (galleryItems[currentImageIndex]) {
            galleryItems[currentImageIndex].focus();
        }
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = images[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        // Add loading animation
        lightboxImage.style.opacity = '0';
        lightboxImage.onload = function() {
            lightboxImage.style.transition = 'opacity 0.3s ease';
            lightboxImage.style.opacity = '1';
        };
    }

    // Previous image
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking outside image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // ===================================
    // Touch Swipe Support for Mobile
    // ===================================
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }

    // ===================================
    // Preload Adjacent Images
    // ===================================
    function preloadAdjacentImages(index) {
        const prevIndex = (index - 1 + images.length) % images.length;
        const nextIndex = (index + 1) % images.length;

        // Preload previous image
        const prevImg = new Image();
        prevImg.src = images[prevIndex].src;

        // Preload next image
        const nextImg = new Image();
        nextImg.src = images[nextIndex].src;
    }

    // Preload images when lightbox opens
    const originalOpenLightbox = openLightbox;
    openLightbox = function(index) {
        originalOpenLightbox(index);
        preloadAdjacentImages(index);
    };

    // ===================================
    // Gallery Image Counter
    // ===================================
    function createImageCounter() {
        const counter = document.createElement('div');
        counter.id = 'lightbox-counter';
        counter.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 16px;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 8px 16px;
            border-radius: 20px;
            font-family: var(--font-body);
        `;
        lightbox.appendChild(counter);
        return counter;
    }

    const imageCounter = createImageCounter();

    // Update counter when image changes
    const originalUpdateLightboxImage = updateLightboxImage;
    updateLightboxImage = function() {
        originalUpdateLightboxImage();
        imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    };

    // ===================================
    // Lazy Loading for Gallery Images
    // ===================================
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target.querySelector('img');
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });

    // ===================================
    // Gallery Animation on Scroll
    // ===================================
    const galleryAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, {
        threshold: 0.1
    });

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        galleryAnimationObserver.observe(item);
    });

    // ===================================
    // Full Screen Mode
    // ===================================
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            lightbox.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Add fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
    fullscreenBtn.style.cssText = `
        position: absolute;
        top: 2rem;
        left: 2rem;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        font-size: 2rem;
        padding: 1rem 1.5rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    `;

    fullscreenBtn.addEventListener('click', toggleFullScreen);
    fullscreenBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    });
    fullscreenBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });

    lightbox.appendChild(fullscreenBtn);

    // ===================================
    // Zoom Functionality
    // ===================================
    let isZoomed = false;

    lightboxImage.addEventListener('click', function() {
        isZoomed = !isZoomed;

        if (isZoomed) {
            this.style.transform = 'scale(1.5)';
            this.style.cursor = 'zoom-out';
            this.style.transition = 'transform 0.3s ease';
        } else {
            this.style.transform = 'scale(1)';
            this.style.cursor = 'zoom-in';
        }
    });

    lightboxImage.style.cursor = 'zoom-in';

    // Reset zoom when changing images
    const originalShowNext = showNextImage;
    const originalShowPrev = showPreviousImage;

    showNextImage = function() {
        isZoomed = false;
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.cursor = 'zoom-in';
        originalShowNext();
    };

    showPreviousImage = function() {
        isZoomed = false;
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.cursor = 'zoom-in';
        originalShowPrev();
    };

    // ===================================
    // Console Log
    // ===================================
    console.log(`%c📸 Gallery initialized with ${images.length} images`, 'color: #2c5f4f; font-weight: bold;');
});
