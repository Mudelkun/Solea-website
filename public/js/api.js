/**
 * SOLEA WEBSITE - API CLIENT
 * ==========================
 * 
 * Client-side API functions to fetch data from the server
 * Used by all frontend pages to load products and settings
 */

// ==================== API BASE URL ====================

const API_BASE = '';

// ==================== CACHED DATA ====================

// Cache for settings to avoid repeated requests
let cachedSettings = null;

// ==================== API FUNCTIONS ====================

/**
 * Fetch all products with optional filters
 * @param {object} filters - Filter parameters
 * @returns {Promise} Products data
 */
async function fetchProducts(filters = {}) {
    try {
        const params = new URLSearchParams();
        
        // Add filter parameters
        if (filters.category) params.append('category', filters.category);
        if (filters.hairType) params.append('hairType', filters.hairType);
        if (filters.special) params.append('special', filters.special);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        
        const url = params.toString() ? `/api/products?${params}` : '/api/products';
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], currency: { symbol: '€' }, total: 0 };
    }
}

/**
 * Fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise} Product data
 */
async function fetchProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

/**
 * Fetch site settings (currency, contact, etc.)
 * @returns {Promise} Settings data
 */
async function fetchSettings() {
    // Return cached settings if available
    if (cachedSettings) {
        return cachedSettings;
    }
    
    try {
        const response = await fetch('/api/settings');
        
        if (!response.ok) {
            throw new Error('Failed to fetch settings');
        }
        
        cachedSettings = await response.json();
        return cachedSettings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return {
            currency: { symbol: '€', code: 'EUR' },
            business: { freeShippingThreshold: 50, shippingCost: 5.99 }
        };
    }
}

/**
 * Submit an order
 * @param {object} orderData - Order data
 * @returns {Promise} Order result
 */
async function submitOrder(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit order');
        }
        
        return { success: true, order: data.order };
    } catch (error) {
        console.error('Error submitting order:', error);
        return { success: false, error: error.message };
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} symbol - Currency symbol
 * @returns {string} Formatted price
 */
function formatPrice(price, symbol = '€') {
    return `${price.toFixed(2)}${symbol}`;
}

/**
 * Generate product card HTML
 * @param {object} product - Product data
 * @param {string} currencySymbol - Currency symbol
 * @returns {string} HTML string
 */
function generateProductCardHTML(product, currencySymbol = '€') {
    const badge = product.special && product.special.length > 0 
        ? `<span class="product-badge ${product.special[0]}">${getBadgeLabel(product.special[0])}</span>` 
        : '';
    
    const stars = '★'.repeat(product.rating || 5) + '☆'.repeat(5 - (product.rating || 5));
    
    return `
        <div class="product-card" 
             data-category="${product.category || ''}"
             data-hairtype="${(product.hairType || []).join(',')}"
             data-price="${product.price}"
             data-special="${(product.special || []).join(',')}">
            <a href="product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    <img src="${product.images?.[0] || 'images/placeholder.jpg'}" alt="${product.name}">
                    ${badge}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-rating">
                        <span class="stars">${stars}</span>
                        <span class="rating-count">(${product.reviewCount || 0})</span>
                    </div>
                    <p class="product-price">${formatPrice(product.price, currencySymbol)}</p>
                </div>
            </a>
            <button class="btn btn-small btn-primary add-to-cart" data-product-id="${product.id}">
                Ajouter à la Liste
            </button>
        </div>
    `;
}

/**
 * Generate featured product card HTML (for carousel)
 * @param {object} product - Product data
 * @param {string} currencySymbol - Currency symbol
 * @returns {string} HTML string
 */
function generateFeaturedProductHTML(product, currencySymbol = '€') {
    const badge = product.special && product.special.length > 0 
        ? `<span class="product-badge ${product.special[0]}">${getBadgeLabel(product.special[0])}</span>` 
        : '';
    
    const stars = '★'.repeat(product.rating || 5) + '☆'.repeat(5 - (product.rating || 5));
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.images?.[0] || 'images/placeholder.jpg'}" alt="${product.name}">
                ${badge}
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${product.reviewCount || 0})</span>
                </div>
                <p class="product-price">${formatPrice(product.price, currencySymbol)}</p>
                <button class="btn btn-small btn-primary add-to-cart" data-product-id="${product.id}">
                    Ajouter à la Liste
                </button>
            </div>
        </div>
    `;
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
 * Get cart from localStorage
 * @returns {array} Cart items
 */
function getCart() {
    return JSON.parse(localStorage.getItem('soleaCart')) || [];
}

/**
 * Save cart to localStorage
 * @param {array} cart - Cart items
 */
function saveCart(cart) {
    localStorage.setItem('soleaCart', JSON.stringify(cart));
    updateCartCount();
}

/**
 * Add product to cart
 * @param {object} product - Product data
 * @param {number} quantity - Quantity to add
 * @param {string} variant - Variant name (optional)
 */
function addToCart(product, quantity = 1, variant = '') {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id && item.variant === variant);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || 'images/placeholder.jpg',
            quantity,
            variant
        });
    }
    
    saveCart(cart);
    showCartFeedback();
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

/**
 * Show cart feedback animation
 */
function showCartFeedback() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 300);
    }
}

// ==================== INITIALIZATION ====================

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// Export functions for use in other scripts
window.SoleaAPI = {
    fetchProducts,
    fetchProduct,
    fetchSettings,
    submitOrder,
    formatPrice,
    generateProductCardHTML,
    generateFeaturedProductHTML,
    getCart,
    saveCart,
    addToCart,
    updateCartCount
};
