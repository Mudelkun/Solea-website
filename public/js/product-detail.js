/* ==========================================
   PRODUCT DETAIL PAGE - ADDITIONAL JAVASCRIPT
   ==========================================
   
   Additional product detail page enhancements
   
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== ZOOM ON HOVER FOR MAIN IMAGE ====================
    const mainImage = document.querySelector('.main-image');
    
    if (mainImage) {
        const img = mainImage.querySelector('img');
        
        mainImage.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            img.style.transform = 'scale(1.5)';
        });
        
        mainImage.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    }
    
    // ==================== PRODUCT URL PARAMETERS ====================
    // Get product ID from URL and load product data
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // In a real application, you would fetch product data from an API
        console.log('Loading product:', productId);
        
        // Update breadcrumb
        const breadcrumb = document.getElementById('product-breadcrumb');
        if (breadcrumb) {
            const productTitle = document.querySelector('.product-title');
            if (productTitle) {
                breadcrumb.textContent = productTitle.textContent;
            }
        }
    }
    
    // ==================== REVIEW HELPFUL BUTTONS ====================
    const helpfulButtons = document.querySelectorAll('.review-helpful button');
    
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentText = this.textContent;
            const match = currentText.match(/\((\d+)\)/);
            
            if (match) {
                const count = parseInt(match[1]) + 1;
                this.textContent = `👍 Utile (${count})`;
                this.disabled = true;
                this.style.opacity = '0.6';
            }
        });
    });
    
    // ==================== SHARE PRODUCT ====================
    // Add share functionality if needed
    const shareButton = document.querySelector('.share-product');
    
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: document.querySelector('.product-title')?.textContent,
                    text: document.querySelector('.product-short-description p')?.textContent,
                    url: window.location.href
                }).catch(err => console.log('Error sharing:', err));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Lien copié dans le presse-papier!');
            }
        });
    }
    
    // ==================== SMOOTH SCROLL TO REVIEWS ====================
    const viewReviewsBtn = document.querySelector('[data-scroll-to="reviews"]');
    
    if (viewReviewsBtn) {
        viewReviewsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const reviewsTab = document.querySelector('[data-tab="reviews"]');
            if (reviewsTab) {
                reviewsTab.click();
                setTimeout(() => {
                    document.querySelector('.product-tabs').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    }
    
    // ==================== PRICE UPDATE ANIMATION ====================
    const priceElements = document.querySelectorAll('.product-price.large');
    
    function animatePriceChange(element, newPrice) {
        element.style.transform = 'scale(1.1)';
        element.style.color = 'var(--color-warning)';
        
        setTimeout(() => {
            element.textContent = newPrice;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }
    
    // ==================== KEYBOARD NAVIGATION FOR GALLERY ====================
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails.length > 0) {
        let currentIndex = 0;
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % thumbnails.length;
                thumbnails[currentIndex].click();
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
                thumbnails[currentIndex].click();
            }
        });
    }
    
    // ==================== STICKY ADD TO CART ON SCROLL ====================
    const productActions = document.querySelector('.product-actions');
    const productDetailInfo = document.querySelector('.product-detail-info');
    
    if (productActions && productDetailInfo && window.innerWidth > 768) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    createStickyCart();
                } else {
                    removeStickyCart();
                }
            },
            { threshold: 0 }
        );
        
        observer.observe(productActions);
    }
    
    function createStickyCart() {
        if (document.querySelector('.sticky-cart')) return;
        
        const stickyCart = document.createElement('div');
        stickyCart.className = 'sticky-cart';
        stickyCart.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;
        
        const productTitle = document.querySelector('.product-title')?.textContent;
        const productPrice = document.querySelector('.product-price.large')?.textContent;
        
        stickyCart.innerHTML = `
            <div style="flex: 1;">
                <strong>${productTitle}</strong>
                <p style="color: var(--color-deep-plum); font-weight: 700;">${productPrice}</p>
            </div>
            <button class="btn btn-primary add-to-cart" style="white-space: nowrap;">
                Ajouter à la Liste
            </button>
        `;
        
        document.body.appendChild(stickyCart);
        
        setTimeout(() => {
            stickyCart.style.transform = 'translateY(0)';
        }, 100);
    }
    
    function removeStickyCart() {
        const stickyCart = document.querySelector('.sticky-cart');
        if (stickyCart) {
            stickyCart.style.transform = 'translateY(100%)';
            setTimeout(() => {
                stickyCart.remove();
            }, 300);
        }
    }
    
    // ==================== PRODUCT RECOMMENDATIONS ====================
    // Track viewed products for recommendations
    function trackProductView(productId) {
        let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
        
        if (!viewedProducts.includes(productId)) {
            viewedProducts.unshift(productId);
            viewedProducts = viewedProducts.slice(0, 10); // Keep last 10
            localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
        }
    }
    
    if (productId) {
        trackProductView(productId);
    }
});
