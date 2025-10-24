/**
 * Pavillon am Ufer - Main JavaScript
 * Interactive features and functionality
 */

// ===================================
// Smooth Scrolling for Navigation
// ===================================
document.addEventListener('DOMContentLoaded', function() {

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }

                // Scroll to section
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // Navbar Background on Scroll
    // ===================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }
    });

    // ===================================
    // Active Navigation Link on Scroll
    // ===================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // ===================================
    // Contact Form Validation & Submit
    // ===================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            // Success message (in production, this would send to a server)
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.');
            contactForm.reset();
        });
    }

    // ===================================
    // Newsletter Form
    // ===================================
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }

            alert('Vielen Dank für Ihre Anmeldung zum Newsletter!');
            newsletterForm.reset();
        });
    }

    // ===================================
    // Scroll Animations (Fade in on scroll)
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate feature cards, menu items, review cards
    const animateElements = document.querySelectorAll('.feature-card, .menu-category, .review-card, .info-card');

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ===================================
    // Back to Top Button (optional enhancement)
    // ===================================
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.innerHTML = '↑';
        button.setAttribute('aria-label', 'Back to top');
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            z-index: 999;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        `;

        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });

        document.body.appendChild(button);
    }

    createBackToTopButton();

    // ===================================
    // Loading Animation (fade in page)
    // ===================================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // ===================================
    // Lazy Loading Images Enhancement
    // ===================================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Performance Monitoring
    // ===================================
    if ('PerformanceObserver' in window) {
        // Monitor long tasks
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                // Log performance metrics (for development)
                console.log('Performance:', entry.name, entry.duration);
            }
        });

        // Observe navigation and resource timing
        if (performance.getEntriesByType) {
            observer.observe({ entryTypes: ['navigation', 'resource'] });
        }
    }

    // ===================================
    // Accessibility: Skip to Main Content
    // ===================================
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;

    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c🌊 Pavillon am Ufer', 'color: #2c5f4f; font-size: 24px; font-weight: bold;');
    console.log('%cWillkommen am Landwehrkanal! ☕', 'color: #d4a574; font-size: 16px;');
    console.log('%cWebsite built with ❤️ for Berlin\'s best café', 'color: #666; font-size: 12px;');
});

// ===================================
// Service Worker Registration (PWA ready)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
