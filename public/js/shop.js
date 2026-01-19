/* ==========================================
   SHOP SECTION - JAVASCRIPT FUNCTIONALITY
   ==========================================
   
   Handles:
   - Product loading from API
   - Product filtering and sorting
   - Cart management (localStorage)
   - Search functionality
   - Order pages
   
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== GLOBAL VARIABLES ====================
    let allProducts = [];
    let currencySymbol = '€';
    let settings = {};
    let cart = JSON.parse(localStorage.getItem('soleaCart')) || [];
    
    // ==================== INITIALIZATION ====================
    
    updateCartCount();
    
    // Shop page
    if (document.getElementById('products-grid')) {
        loadShopProducts();
        setupMobileFilters();
    }
    
    // Order list page
    if (window.location.pathname.includes('order-list.html')) {
        loadSettings().then(() => renderOrderList());
    }
    
    // Order request page
    if (window.location.pathname.includes('order-request.html')) {
        loadSettings().then(() => {
            renderOrderRequestSummary();
            setupOrderRequestForm();
        });
    }
    
    // ==================== CART MANAGEMENT ====================
    
    function saveCart() {
        localStorage.setItem('soleaCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
        });
    }
    
    // ==================== LOAD SETTINGS ====================
    
    async function loadSettings() {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                settings = await response.json();
                currencySymbol = settings.currency?.symbol || '€';
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    // ==================== LOAD SHOP PRODUCTS ====================
    
    async function loadShopProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><p>Chargement des produits...</p></div>';
        
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            allProducts = data.products || [];
            currencySymbol = data.currency?.symbol || '€';
            settings = { currency: data.currency };
            
            displayProducts(allProducts);
            setupFilters();
            setupSorting();
            setupSearch();
            
        } catch (error) {
            console.error('Error loading products:', error);
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Erreur lors du chargement des produits</p>';
        }
    }
    
    // ==================== DISPLAY PRODUCTS ====================
    
    function displayProducts(products) {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) return;
        
        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">Aucun produit trouvé</p>';
            updateProductCount(0);
            return;
        }
        
        productsGrid.innerHTML = products.map(product => {
            const badge = product.special && product.special.length > 0 
                ? '<span class="product-badge ' + product.special[0] + '">' + getBadgeLabel(product.special[0]) + '</span>' 
                : '';
            
            const stars = '★'.repeat(product.rating || 5) + '☆'.repeat(5 - (product.rating || 5));
            
            return '<div class="product-card" data-category="' + (product.category || '') + '" data-hairtype="' + (product.hairType || []).join(',') + '" data-price="' + product.price + '" data-special="' + (product.special || []).join(',') + '">' +
                '<a href="product-detail.html?id=' + product.id + '" class="product-link">' +
                    '<div class="product-image">' +
                        '<img src="' + (product.images?.[0] || 'images/placeholder.jpg') + '" alt="' + product.name + '">' +
                        badge +
                    '</div>' +
                    '<div class="product-info">' +
                        '<h3>' + product.name + '</h3>' +
                        '<p class="product-description">' + (product.description || '') + '</p>' +
                        '<div class="product-rating">' +
                            '<span class="stars">' + stars + '</span>' +
                            '<span class="rating-count">(' + (product.reviewCount || 0) + ')</span>' +
                        '</div>' +
                        '<p class="product-price">' + product.price.toFixed(2) + currencySymbol + '</p>' +
                    '</div>' +
                '</a>' +
                '<button class="btn btn-small btn-primary add-to-cart" data-product-id="' + product.id + '" data-product-name="' + product.name + '" data-product-price="' + product.price + '" data-product-image="' + (product.images?.[0] || 'images/placeholder.jpg') + '">' +
                    'Ajouter à la Liste' +
                '</button>' +
            '</div>';
        }).join('');
        
        updateProductCount(products.length);
        setupAddToCartHandlers();
    }
    
    function updateProductCount(count) {
        const productCountEl = document.getElementById('product-count');
        if (productCountEl) {
            productCountEl.textContent = count;
        }
    }
    
    function getBadgeLabel(special) {
        const labels = {
            'new': 'Nouveau',
            'bestseller': 'Bestseller',
            'bio': 'Bio'
        };
        return labels[special] || special;
    }
    
    // ==================== FILTERING ====================
    
    function setupFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
        
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        const filterReset = document.querySelector('.filter-reset');
        if (filterReset) {
            filterReset.addEventListener('click', function() {
                filterCheckboxes.forEach(cb => {
                    cb.checked = cb.value === 'all';
                });
                displayProducts(allProducts);
            });
        }
    }
    
    function applyFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
        
        const activeFilters = {
            category: [],
            hairtype: [],
            price: [],
            special: []
        };
        
        filterCheckboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value !== 'all') {
                const filterType = checkbox.name;
                if (activeFilters[filterType]) {
                    activeFilters[filterType].push(checkbox.value);
                }
            }
        });
        
        const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
        if (!hasActiveFilters) {
            displayProducts(allProducts);
            return;
        }
        
        const filteredProducts = allProducts.filter(product => {
            if (activeFilters.category.length > 0 && !activeFilters.category.includes(product.category)) {
                return false;
            }
            
            if (activeFilters.hairtype.length > 0) {
                const productHairTypes = product.hairType || [];
                if (!activeFilters.hairtype.some(type => productHairTypes.includes(type))) {
                    return false;
                }
            }
            
            if (activeFilters.price.length > 0) {
                const price = product.price;
                let priceMatch = false;
                
                activeFilters.price.forEach(range => {
                    if (range === '0-20' && price < 20) priceMatch = true;
                    if (range === '20-40' && price >= 20 && price < 40) priceMatch = true;
                    if (range === '40-60' && price >= 40 && price < 60) priceMatch = true;
                    if (range === '60+' && price >= 60) priceMatch = true;
                });
                
                if (!priceMatch) return false;
            }
            
            if (activeFilters.special.length > 0) {
                const productSpecial = product.special || [];
                if (!activeFilters.special.some(spec => productSpecial.includes(spec))) {
                    return false;
                }
            }
            
            return true;
        });
        
        displayProducts(filteredProducts);
    }
    
    // ==================== SORTING ====================
    
    function setupSorting() {
        const sortSelect = document.getElementById('sort');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            let sortedProducts = [...allProducts];
            
            switch(sortBy) {
                case 'price-asc':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'newest':
                    sortedProducts.sort((a, b) => {
                        const aNew = a.special?.includes('new') ? 1 : 0;
                        const bNew = b.special?.includes('new') ? 1 : 0;
                        return bNew - aNew;
                    });
                    break;
                case 'rating':
                    sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                default:
                    sortedProducts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                    break;
            }
            
            displayProducts(sortedProducts);
        });
    }
    
    // ==================== SEARCH ====================
    
    function setupSearch() {
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch(this.value);
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const input = document.querySelector('.search-box input');
                if (input) {
                    performSearch(input.value);
                }
            });
        }
    }
    
    function performSearch(query) {
        if (!query || query.trim() === '') {
            displayProducts(allProducts);
            return;
        }
        
        const searchLower = query.toLowerCase().trim();
        const searchResults = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && product.description.toLowerCase().includes(searchLower))
        );
        
        displayProducts(searchResults);
    }
    
    // ==================== MOBILE FILTERS ====================
    
    function setupMobileFilters() {
        const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
        const shopSidebar = document.querySelector('.shop-sidebar');
        
        if (mobileFilterToggle && shopSidebar) {
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
            
            mobileFilterToggle.addEventListener('click', function() {
                shopSidebar.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            overlay.addEventListener('click', function() {
                shopSidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // ==================== ADD TO CART ====================
    
    function setupAddToCartHandlers() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = this.dataset.productId;
                const productName = this.dataset.productName;
                const productPrice = parseFloat(this.dataset.productPrice);
                const productImage = this.dataset.productImage;
                
                addToCart(productId, productName, productPrice, productImage, 1);
                
                const originalText = this.textContent;
                this.textContent = 'Ajouté !';
                this.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '';
                }, 2000);
            });
        });
    }
    
    function addToCart(id, name, price, image, quantity, variant) {
        quantity = quantity || 1;
        variant = variant || '';
        
        const existingItem = cart.find(item => item.id === id && item.variant === variant);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: id, name: name, price: price, image: image, quantity: quantity, variant: variant });
        }
        
        saveCart();
        showCartFeedback();
    }
    
    function showCartFeedback() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.3)';
            setTimeout(function() {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // ==================== ORDER LIST PAGE ====================
    
    function renderOrderList() {
        const emptyCart = document.getElementById('empty-cart');
        const orderItemsTable = document.getElementById('order-items-table');
        const orderItemsBody = document.getElementById('order-items-body');
        
        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (orderItemsTable) orderItemsTable.style.display = 'none';
            return;
        }
        
        if (emptyCart) emptyCart.style.display = 'none';
        if (orderItemsTable) orderItemsTable.style.display = 'block';
        
        if (orderItemsBody) {
            orderItemsBody.innerHTML = cart.map(function(item) {
                return '<tr data-id="' + item.id + '">' +
                    '<td>' +
                        '<div style="display: flex; align-items: center; gap: 1rem;">' +
                            '<img src="' + item.image + '" alt="' + item.name + '" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">' +
                            '<div><strong>' + item.name + '</strong>' + (item.variant ? '<br><small>Taille: ' + item.variant + '</small>' : '') + '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td>' + item.price.toFixed(2) + currencySymbol + '</td>' +
                    '<td>' +
                        '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
                            '<button class="qty-btn minus" data-id="' + item.id + '" style="width: 28px; height: 28px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer;">-</button>' +
                            '<input type="number" value="' + item.quantity + '" min="1" max="10" data-id="' + item.id + '" style="width: 50px; text-align: center; padding: 0.25rem;">' +
                            '<button class="qty-btn plus" data-id="' + item.id + '" style="width: 28px; height: 28px; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer;">+</button>' +
                        '</div>' +
                    '</td>' +
                    '<td><strong>' + (item.price * item.quantity).toFixed(2) + currencySymbol + '</strong></td>' +
                    '<td><button class="remove-item" data-id="' + item.id + '" style="background: none; border: none; color: #dc3545; cursor: pointer; padding: 0.5rem;">🗑️</button></td>' +
                '</tr>';
            }).join('');
            
            attachOrderListListeners();
        }
        
        updateOrderSummary();
    }
    
    function attachOrderListListeners() {
        document.querySelectorAll('.qty-btn.minus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var itemId = this.dataset.id;
                var item = cart.find(function(i) { return i.id === itemId; });
                if (item && item.quantity > 1) {
                    item.quantity--;
                    saveCart();
                    renderOrderList();
                }
            });
        });
        
        document.querySelectorAll('.qty-btn.plus').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var itemId = this.dataset.id;
                var item = cart.find(function(i) { return i.id === itemId; });
                if (item && item.quantity < 10) {
                    item.quantity++;
                    saveCart();
                    renderOrderList();
                }
            });
        });
        
        document.querySelectorAll('.quantity-controls input, input[data-id]').forEach(function(input) {
            if (input.type === 'number') {
                input.addEventListener('change', function() {
                    var itemId = this.dataset.id;
                    var item = cart.find(function(i) { return i.id === itemId; });
                    if (item) {
                        item.quantity = Math.max(1, Math.min(10, parseInt(this.value) || 1));
                        saveCart();
                        renderOrderList();
                    }
                });
            }
        });
        
        document.querySelectorAll('.remove-item').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var itemId = this.dataset.id;
                cart = cart.filter(function(item) { return item.id !== itemId; });
                saveCart();
                renderOrderList();
            });
        });
        
        var clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', function() {
                if (confirm('Êtes-vous sûr de vouloir vider votre liste ?')) {
                    cart = [];
                    saveCart();
                    renderOrderList();
                }
            });
        }
    }
    
    function updateOrderSummary() {
        var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
        var freeShippingThreshold = (settings.business && settings.business.freeShippingThreshold) || 50;
        var shippingCost = (settings.business && settings.business.shippingCost) || 5.99;
        var shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
        var total = subtotal + shipping;
        
        var subtotalEl = document.getElementById('summary-subtotal');
        var shippingEl = document.getElementById('summary-shipping');
        var totalEl = document.getElementById('summary-total');
        
        if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + currencySymbol;
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratuit' : shipping.toFixed(2) + currencySymbol;
        if (totalEl) totalEl.textContent = total.toFixed(2) + currencySymbol;
    }
    
    // ==================== ORDER REQUEST PAGE ====================
    
    function renderOrderRequestSummary() {
        var checkoutItems = document.getElementById('checkout-items');
        
        if (cart.length === 0) {
            window.location.href = 'shop.html';
            return;
        }
        
        if (checkoutItems) {
            checkoutItems.innerHTML = cart.map(function(item) {
                return '<div style="display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #eee;">' +
                    '<img src="' + item.image + '" alt="' + item.name + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">' +
                    '<div style="flex: 1;">' +
                        '<strong style="font-size: 0.9rem;">' + item.name + '</strong>' +
                        (item.variant ? '<br><small style="color: #666;">Taille: ' + item.variant + '</small>' : '') +
                        '<br><small style="color: #666;">Qté: ' + item.quantity + '</small>' +
                    '</div>' +
                    '<strong style="color: #6B2D5C;">' + (item.price * item.quantity).toFixed(2) + currencySymbol + '</strong>' +
                '</div>';
            }).join('');
        }
        
        var subtotal = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
        var checkoutSubtotal = document.getElementById('checkout-subtotal');
        var checkoutTotal = document.getElementById('checkout-total');
        
        if (checkoutSubtotal) checkoutSubtotal.textContent = subtotal.toFixed(2) + currencySymbol;
        if (checkoutTotal) checkoutTotal.textContent = subtotal.toFixed(2) + currencySymbol;
    }
    
    function setupOrderRequestForm() {
        var form = document.getElementById('checkout-form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = {
                customer: {
                    firstName: (document.getElementById('prenom') && document.getElementById('prenom').value) || '',
                    lastName: (document.getElementById('nom') && document.getElementById('nom').value) || '',
                    email: (document.getElementById('email') && document.getElementById('email').value) || '',
                    phone: (document.getElementById('telephone') && document.getElementById('telephone').value) || '',
                    address: (document.getElementById('adresse') && document.getElementById('adresse').value) || '',
                    preferredContact: (document.getElementById('mode-contact') && document.getElementById('mode-contact').value) || 'email',
                    newsletter: (document.getElementById('newsletter') && document.getElementById('newsletter').checked) || false
                },
                items: cart.map(function(item) {
                    return {
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        variant: item.variant || ''
                    };
                }),
                notes: (document.getElementById('notes') && document.getElementById('notes').value) || '',
                subtotal: cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0),
                total: cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0)
            };
            
            fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    return { ok: response.ok, data: data };
                });
            })
            .then(function(result) {
                if (result.ok) {
                    cart = [];
                    saveCart();
                    
                    document.getElementById('order-request-form').style.display = 'none';
                    document.getElementById('success-message').style.display = 'block';
                    
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    alert(result.data.error || 'Erreur lors de l\'envoi de la commande');
                }
            })
            .catch(function(error) {
                console.error('Error submitting order:', error);
                alert('Erreur lors de l\'envoi de la commande. Veuillez réessayer.');
            });
        });
    }
});
