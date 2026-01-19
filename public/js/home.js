/**
 * SOLEA HOMEPAGE - JAVASCRIPT
 * ===========================
 * 
 * Loads featured products dynamically on the homepage
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Load featured products for the carousel
    await loadFeaturedProducts();
    
    // Setup add to cart functionality for dynamically loaded products
    setupDynamicAddToCart();
});

/**
 * Load featured products from the API and display in carousel
 */
async function loadFeaturedProducts() {
    const carousel = document.getElementById('featured-products-carousel');
    if (!carousel) return;
    
    try {
        // Fetch products sorted by popularity (review count)
        const data = await SoleaAPI.fetchProducts({ sort: 'popularity' });
        const products = data.products || [];
        const currencySymbol = data.currency?.symbol || '€';
        
        if (products.length === 0) {
            carousel.innerHTML = '<p class="text-muted">Aucun produit disponible</p>';
            return;
        }
        
        // Take top 8 products for the carousel
        const featuredProducts = products.slice(0, 8);
        
        // Generate HTML for each product
        carousel.innerHTML = featuredProducts.map(product => {
            const badge = product.special && product.special.length > 0 
                ? `<span class="product-badge ${product.special[0]}">${getBadgeLabel(product.special[0])}</span>` 
                : '';
            
            const stars = '★'.repeat(product.rating || 5) + '☆'.repeat(5 - (product.rating || 5));
            
            return `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <a href="product-detail.html?id=${product.id}">
                            <img src="${product.images?.[0] || 'images/placeholder.jpg'}" alt="${product.name}">
                        </a>
                        ${badge}
                    </div>
                    <div class="product-info">
                        <a href="product-detail.html?id=${product.id}">
                            <h4>${product.name}</h4>
                        </a>
                        <div class="product-rating">
                            <span class="stars">${stars}</span>
                            <span class="rating-count">(${product.reviewCount || 0})</span>
                        </div>
                        <p class="product-price">${product.price.toFixed(2)}${currencySymbol}</p>
                        <button class="btn btn-small btn-primary add-to-cart-btn" 
                                data-product='${JSON.stringify({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    images: product.images
                                }).replace(/'/g, "&#39;")}'>
                            Ajouter à la Liste
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Re-attach add to cart handlers
        setupDynamicAddToCart();
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        carousel.innerHTML = '<p class="text-muted">Erreur lors du chargement des produits</p>';
    }
}

/**
 * Get badge label from special tag
 * @param {string} special - Special tag
 * @returns {string} Badge label
 */
function getBadgeLabel(special) {
    const labels = {
        'new': 'Nouveau',
        'bestseller': 'Bestseller',
        'bio': 'Bio'
    };
    return labels[special] || special;
}

/**
 * Setup add to cart functionality for dynamically loaded products
 */
function setupDynamicAddToCart() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        // Remove existing listeners to avoid duplicates
        button.replaceWith(button.cloneNode(true));
    });
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const productData = JSON.parse(this.dataset.product.replace(/&#39;/g, "'"));
                
                // Add to cart
                SoleaAPI.addToCart(productData, 1);
                
                // Visual feedback
                const originalText = this.textContent;
                this.textContent = 'Ajouté !';
                this.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
                
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        });
    });
}
