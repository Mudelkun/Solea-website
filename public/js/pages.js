/* ==========================================
   PAGES JAVASCRIPT - Form Handling & Interactions
   ==========================================
   
   Handles:
   - School application form
   - Driving request form
   - Decoration quote form
   - Contact form
   - FAQ accordion
   
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== FORM HANDLING ====================
    
    // School Application Form
    const schoolForm = document.getElementById('school-application-form');
    if (schoolForm) {
        schoolForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Driving Request Form
    const drivingForm = document.getElementById('driving-request-form');
    if (drivingForm) {
        drivingForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Decoration Quote Form
    const decorationForm = document.getElementById('decoration-quote-form');
    if (decorationForm) {
        decorationForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Generic form submission handler
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Get form type from ID
        const formType = form.id.replace('-form', '').replace(/-/g, ' ');
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner"><circle cx="12" cy="12" r="10"></circle></svg> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate form submission (in production, this would be an API call)
        setTimeout(function() {
            console.log('Form submitted:', formType, data);
            
            // Show success message
            showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
    
    function showSuccessMessage(form) {
        // Create success message if it doesn't exist
        let successEl = form.parentElement.querySelector('.form-success-message');
        
        if (!successEl) {
            successEl = document.createElement('div');
            successEl.className = 'form-success-message';
            successEl.innerHTML = `
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Demande Envoyée !</h3>
                <p>Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais.</p>
            `;
            successEl.style.cssText = `
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #f5e6f1 0%, #fff8f3 100%);
                border-radius: 12px;
                margin-top: 1rem;
                animation: fadeIn 0.5s ease;
            `;
            form.parentElement.insertBefore(successEl, form.nextSibling);
        }
        
        successEl.style.display = 'block';
        
        // Hide form temporarily
        form.style.display = 'none';
        
        // Show form again after 5 seconds
        setTimeout(function() {
            form.style.display = 'block';
            successEl.style.display = 'none';
        }, 5000);
    }
    
    // ==================== FAQ ACCORDION ====================
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('open');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item.open').forEach(function(item) {
                if (item !== faqItem) {
                    item.classList.remove('open');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                faqItem.classList.remove('open');
                answer.style.maxHeight = '0';
            } else {
                faqItem.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ==================== ANIMATE ON SCROLL ====================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animateElements = document.querySelectorAll(
        '.program-card, .package-card, .faculty-card, .value-card, .team-card, .process-step, .contact-item, .portfolio-item'
    );
    
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    
                    setTimeout(function() {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animateElements.forEach(function(element) {
            observer.observe(element);
        });
    }
    
    // ==================== PORTFOLIO LIGHTBOX ====================
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h4') ? this.querySelector('h4').textContent : '';
            const desc = this.querySelector('p') ? this.querySelector('p').textContent : '';
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                    <div class="lightbox-info">
                        <h4>${title}</h4>
                        <p>${desc}</p>
                    </div>
                </div>
            `;
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 2rem;
                animation: fadeIn 0.3s ease;
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });
        });
    });
});

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .lightbox-content {
        max-width: 90%;
        max-height: 90%;
        position: relative;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }
    
    .lightbox-info {
        color: white;
        text-align: center;
        padding: 1rem;
    }
    
    .lightbox-info h4 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
    }
    
    .lightbox-info p {
        opacity: 0.8;
    }
    
    .form-success-message svg {
        color: #4CAF50;
    }
    
    .form-success-message h3 {
        color: #6B2D5C;
        margin: 1rem 0 0.5rem;
    }
    
    .form-success-message p {
        color: #666;
    }
`;
document.head.appendChild(style);
