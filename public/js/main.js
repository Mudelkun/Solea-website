/* ==========================================
   SOLEA WEBSITE - JAVASCRIPT FUNCTIONALITY
   ==========================================
   
   This file contains all interactive functionality for the website:
   - Mobile menu toggle
   - Product carousel navigation
   - Smooth scrolling
   - Form validation
   - Dynamic interactions
   
   ========================================== */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== MOBILE MENU TOGGLE ====================
    // Handles hamburger menu functionality for mobile devices
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle 'active' class to show/hide mobile menu
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon transformation
            this.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on a menu item
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ==================== SMOOTH SCROLLING ====================
    // Implements smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only apply to valid anchor links
            if (href !== '#' && href.length > 1) {
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Smooth scroll to target element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ==================== PRODUCT CAROUSEL NAVIGATION ====================
    // Handles left/right navigation for product carousel
    const carouselPrev = document.querySelector('.carousel-btn.prev');
    const carouselNext = document.querySelector('.carousel-btn.next');
    const carouselTrack = document.querySelector('.carousel-track');
    
    if (carouselPrev && carouselNext && carouselTrack) {
        // Scroll left when clicking previous button
        carouselPrev.addEventListener('click', function() {
            const scrollAmount = 300; // Pixels to scroll
            carouselTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Scroll right when clicking next button
        carouselNext.addEventListener('click', function() {
            const scrollAmount = 300; // Pixels to scroll
            carouselTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        // Optional: Hide/show navigation buttons based on scroll position
        carouselTrack.addEventListener('scroll', function() {
            const maxScroll = this.scrollWidth - this.clientWidth;
            
            // Hide prev button if at start
            if (this.scrollLeft <= 0) {
                carouselPrev.style.opacity = '0.5';
                carouselPrev.style.pointerEvents = 'none';
            } else {
                carouselPrev.style.opacity = '1';
                carouselPrev.style.pointerEvents = 'auto';
            }
            
            // Hide next button if at end
            if (this.scrollLeft >= maxScroll - 5) {
                carouselNext.style.opacity = '0.5';
                carouselNext.style.pointerEvents = 'none';
            } else {
                carouselNext.style.opacity = '1';
                carouselNext.style.pointerEvents = 'auto';
            }
        });
    }
    
    // ==================== NEWSLETTER FORM VALIDATION ====================
    // Validates email input and handles form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Basic email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailPattern.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                emailInput.focus();
                return;
            }
            
            // Simulate form submission (replace with actual API call)
            console.log('Newsletter subscription for:', email);
            
            // Show success message
            alert('Merci ! Vous êtes maintenant inscrit à notre newsletter.');
            
            // Clear form
            emailInput.value = '';
        });
    }
    
    // ==================== CART FUNCTIONALITY ====================
    // Handles add to cart/order list functionality
    const addToCartButtons = document.querySelectorAll('.product-info .btn-primary');
    const cartCount = document.querySelector('.cart-count');
    
    if (addToCartButtons.length > 0 && cartCount) {
        let itemCount = 0;
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Increment cart count
                itemCount++;
                cartCount.textContent = itemCount;
                
                // Add visual feedback
                this.textContent = 'Ajouté !';
                this.style.backgroundColor = 'var(--color-success)';
                
                // Animate cart icon
                const cartIcon = document.querySelector('.cart-icon');
                if (cartIcon) {
                    cartIcon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        cartIcon.style.transform = 'scale(1)';
                    }, 200);
                }
                
                // Reset button text after delay
                setTimeout(() => {
                    this.textContent = 'Ajouter à la Liste';
                    this.style.backgroundColor = '';
                }, 2000);
            });
        });
    }
    
    // ==================== HEADER SCROLL EFFECT ====================
    // Add shadow to header on scroll for better visibility
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled down
            if (currentScroll > 50) {
                header.style.boxShadow = '0 4px 16px rgba(63, 34, 64, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(63, 34, 64, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
    // Animate elements when they come into viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Elements to observe for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .product-card, .testimonial-card, .news-card'
    );
    
    // Create intersection observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in animation when element is visible
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // ==================== SEARCH FUNCTIONALITY ====================
    // Handle search box interaction
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const searchTerm = searchInput.value.trim();
            
            if (searchTerm) {
                // Simulate search (replace with actual search implementation)
                console.log('Searching for:', searchTerm);
                alert(`Recherche pour: "${searchTerm}"\n\nLa fonctionnalité de recherche sera bientôt disponible.`);
            } else {
                searchInput.focus();
            }
        });
        
        // Allow Enter key to trigger search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchButton.click();
            }
        });
    }
    
    // ==================== LAZY LOADING FOR IMAGES ====================
    // Implement lazy loading for better performance
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ==================== SCROLL TO TOP BUTTON ====================
    // Create and handle scroll to top functionality
    createScrollToTopButton();
    
    function createScrollToTopButton() {
        // Create button element
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--color-blackberry-cream);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 16px rgba(63, 34, 64, 0.2);
        `;
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top on click
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        scrollBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--color-midnight-violet)';
            this.style.transform = 'translateY(-5px)';
        });
        
        scrollBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'var(--color-blackberry-cream)';
            this.style.transform = 'translateY(0)';
        });
    }
    
    // ==================== CONSOLE LOG ====================
    // Display welcome message in console
    console.log('%cBienvenue sur Solea!', 'color: #5D355C; font-size: 20px; font-weight: bold;');
    console.log('%cSite web développé avec passion ✨', 'color: #918687; font-size: 14px;');
});
