/* ==========================================
   SHOP SECTION - JAVASCRIPT FUNCTIONALITY
   ==========================================
   
   Handles:
   - Product filtering and sorting
   - Cart management (localStorage)
   - Product detail interactions
   - Order request form
   
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== CART DATA MANAGEMENT ====================
    let cart = JSON.parse(localStorage.getItem('soleaCart')) || [];
    
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
    
    // Initialize cart count
    updateCartCount();
    
    // ==================== MOBILE FILTER TOGGLE ====================
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const shopSidebar = document.querySelector('.shop-sidebar');
    
    if (mobileFilterToggle && shopSidebar) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
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
    
    // ==================== PRODUCT FILTERING ====================
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    const productsGrid = document.getElementById('products-grid');
    const productCards = document.querySelectorAll('.product-card');
    const productCountEl = document.getElementById('product-count');
    
    if (filterCheckboxes.length > 0 && productsGrid) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        function applyFilters() {
            const activeFilters = {
                category: [],
                hairtype: [],
                price: [],
                special: []
            };
            
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.checked && checkbox.value !== 'all') {
                    const filterType = checkbox.name;
                    activeFilters[filterType].push(checkbox.value);
                }
            });
            
            let visibleCount = 0;
            
            productCards.forEach(card => {
                let show = true;
                
                // Check category
                if (activeFilters.category.length > 0) {
                    const cardCategory = card.dataset.category;
                    if (!activeFilters.category.includes(cardCategory)) {
                        show = false;
                    }
                }
                
                // Check hair type
                if (activeFilters.hairtype.length > 0 && show) {
                    const cardHairTypes = (card.dataset.hairtype || '').split(',');
                    const hasMatch = activeFilters.hairtype.some(type => 
                        cardHairTypes.includes(type)
                    );
                    if (!hasMatch) {
                        show = false;
                    }
                }
                
                // Check price
                if (activeFilters.price.length > 0 && show) {
                    const cardPrice = parseFloat(card.dataset.price);
                    let priceMatch = false;
                    
                    activeFilters.price.forEach(range => {
                        if (range === '0-20' && cardPrice < 20) priceMatch = true;
                        if (range === '20-40' && cardPrice >= 20 && cardPrice < 40) priceMatch = true;
                        if (range === '40-60' && cardPrice >= 40 && cardPrice < 60) priceMatch = true;
                        if (range === '60+' && cardPrice >= 60) priceMatch = true;
                    });
                    
                    if (!priceMatch) {
                        show = false;
                    }
                }
                
                // Check special
                if (activeFilters.special.length > 0 && show) {
                    const cardSpecial = (card.dataset.special || '').split(',');
                    const hasMatch = activeFilters.special.some(spec => 
                        cardSpecial.includes(spec)
                    );
                    if (!hasMatch) {
                        show = false;
                    }
                }
                
                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });
            
            if (productCountEl) {
                productCountEl.textContent = visibleCount;
            }
        }
    }
    
    // ==================== FILTER RESET ====================
    const filterReset = document.querySelector('.filter-reset');
    if (filterReset) {
        filterReset.addEventListener('click', function() {
            filterCheckboxes.forEach(checkbox => {
                if (checkbox.value === 'all') {
                    checkbox.checked = true;
                } else {
                    checkbox.checked = false;
                }
            });
            applyFilters();
        });
    }
    
    // ==================== PRODUCT SORTING ====================
    const sortSelect = document.getElementById('sort');
    if (sortSelect && productsGrid) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const cardsArray = Array.from(productCards);
            
            cardsArray.sort((a, b) => {
                switch(sortBy) {
                    case 'price-asc':
                        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                    case 'price-desc':
                        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                    case 'newest':
                        // Assuming cards with 'new' badge are newest
                        const aNew = a.dataset.special?.includes('new') ? 1 : 0;
                        const bNew = b.dataset.special?.includes('new') ? 1 : 0;
                        return bNew - aNew;
                    case 'rating':
                        // Could be enhanced with actual rating data
                        return 0;
                    default: // popularity
                        return 0;
                }
            });
            
            cardsArray.forEach(card => productsGrid.appendChild(card));
        });
    }
    
    // ==================== ADD TO CART ====================
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.dataset.productId || generateProductId();
            const productCard = this.closest('.product-card') || this.closest('.product-detail-section');
            
            let productName, productPrice, productImage;
            
            if (productCard.classList.contains('product-card')) {
                // From product listing
                productName = productCard.querySelector('h3, h4').textContent;
                productPrice = parseFloat(productCard.querySelector('.product-price').textContent.replace('€', ''));
                productImage = productCard.querySelector('.product-image img').src;
            } else {
                // From product detail page
                productName = document.querySelector('.product-title').textContent;
                const selectedVariant = document.querySelector('.variant-btn.active');
                productPrice = selectedVariant ? parseFloat(selectedVariant.dataset.price) : 24.99;
                productImage = document.getElementById('main-product-image').src;
                
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                const variant = selectedVariant?.dataset.variant || '500ml';
                
                addToCart(productId, productName, productPrice, productImage, quantity, variant);
                return;
            }
            
            addToCart(productId, productName, productPrice, productImage, 1);
        });
    });
    
    function addToCart(id, name, price, image, quantity = 1, variant = '') {
        const existingItem = cart.find(item => item.id === id && item.variant === variant);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity,
                variant
            });
        }
        
        saveCart();
        
        // Show feedback
        showCartFeedback();
    }
    
    function showCartFeedback() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Could add a toast notification here
        console.log('Produit ajouté au panier!');
    }
    
    function generateProductId() {
        return 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    // ==================== PRODUCT DETAIL - IMAGE GALLERY ====================
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imageUrl = this.dataset.image;
                mainImage.src = imageUrl;
                
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // ==================== PRODUCT DETAIL - VARIANT SELECTION ====================
    const variantButtons = document.querySelectorAll('.variant-btn');
    const productPriceLarge = document.querySelector('.product-price.large');
    
    if (variantButtons.length > 0) {
        variantButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                variantButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                if (productPriceLarge) {
                    const newPrice = this.dataset.price;
                    productPriceLarge.textContent = newPrice + '€';
                }
            });
        });
    }
    
    // ==================== PRODUCT DETAIL - QUANTITY CONTROLS ====================
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const quantityInput = document.getElementById('quantity');
    
    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            const max = parseInt(quantityInput.max) || 10;
            if (value < max) {
                quantityInput.value = value + 1;
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min) || 1;
            const max = parseInt(this.max) || 10;
            
            if (value < min) this.value = min;
            if (value > max) this.value = max;
        });
    }
    
    // ==================== PRODUCT DETAIL - TABS ====================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === tabId) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }
    
    // ==================== PRODUCT DETAIL - FAQ ACCORDION ====================
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQs
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked FAQ if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }
    
    // ==================== ORDER LIST PAGE ====================
    const orderItemsContainer = document.querySelector('.order-items');
    const emptyCartMessage = document.querySelector('.empty-cart');
    
    if (window.location.pathname.includes('order-list.html')) {
        renderOrderList();
    }
    
    function renderOrderList() {
        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            if (orderItemsContainer) {
                orderItemsContainer.style.display = 'none';
            }
            document.querySelector('.order-summary')?.style.display = 'none';
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none';
            }
            
            const orderItemsHtml = cart.map(item => `
                <div class="order-item" data-id="${item.id}">
                    <div class="order-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item-details">
                        <h3>${item.name}</h3>
                        ${item.variant ? `<p>Taille: ${item.variant}</p>` : ''}
                        <p class="order-item-price">${item.price.toFixed(2)}€</p>
                        <div class="order-item-controls">
                            <div class="quantity-controls">
                                <button class="qty-btn minus" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
                                <button class="qty-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="order-item-actions">
                        <p class="item-subtotal">${(item.price * item.quantity).toFixed(2)}€</p>
                        <button class="remove-item" data-id="${item.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Supprimer
                        </button>
                    </div>
                </div>
            `).join('');
            
            const orderItemsSection = document.querySelector('.order-items');
            if (orderItemsSection) {
                const existingItems = orderItemsSection.querySelector('.order-items-list');
                if (existingItems) {
                    existingItems.innerHTML = orderItemsHtml;
                } else {
                    const itemsList = document.createElement('div');
                    itemsList.className = 'order-items-list';
                    itemsList.innerHTML = orderItemsHtml;
                    orderItemsSection.appendChild(itemsList);
                }
            }
            
            updateOrderSummary();
            attachOrderListListeners();
        }
    }
    
    function attachOrderListListeners() {
        // Quantity controls
        document.querySelectorAll('.order-item .qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateCartQuantity(itemId, -1);
            });
        });
        
        document.querySelectorAll('.order-item .qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                updateCartQuantity(itemId, 1);
            });
        });
        
        document.querySelectorAll('.order-item input[type="number"]').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.dataset.id;
                const newQuantity = parseInt(this.value);
                setCartQuantity(itemId, newQuantity);
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                removeFromCart(itemId);
            });
        });
    }
    
    function updateCartQuantity(itemId, change) {
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) item.quantity = 1;
            if (item.quantity > 10) item.quantity = 10;
            saveCart();
            renderOrderList();
        }
    }
    
    function setCartQuantity(itemId, quantity) {
        const item = cart.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity));
            saveCart();
            renderOrderList();
        }
    }
    
    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        renderOrderList();
    }
    
    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        const subtotalEl = document.querySelector('.summary-row:nth-child(1) span:last-child');
        const shippingEl = document.querySelector('.summary-row:nth-child(2) span:last-child');
        const totalEl = document.querySelector('.summary-row.total span:last-child');
        const shippingNote = document.querySelector('.shipping-note');
        
        if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + '€';
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Gratuit' : shipping.toFixed(2) + '€';
        if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
        
        if (shippingNote) {
            if (subtotal >= 50) {
                shippingNote.textContent = '✓ Livraison gratuite !';
                shippingNote.style.display = 'block';
            } else {
                const remaining = (50 - subtotal).toFixed(2);
                shippingNote.textContent = `Plus que ${remaining}€ pour la livraison gratuite`;
                shippingNote.style.display = 'block';
            }
        }
    }
    
    // ==================== ORDER REQUEST PAGE ====================
    if (window.location.pathname.includes('order-request.html')) {
        renderOrderRequestSummary();
        setupOrderRequestForm();
    }
    
    function renderOrderRequestSummary() {
        const summaryContainer = document.querySelector('.order-summary-items');
        
        if (cart.length === 0) {
            window.location.href = 'shop.html';
            return;
        }
        
        if (summaryContainer) {
            const itemsHtml = cart.map(item => `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="summary-item-details">
                        <h4>${item.name}</h4>
                        <p>Quantité: ${item.quantity}${item.variant ? ` • ${item.variant}` : ''}</p>
                    </div>
                    <div class="summary-item-price">
                        ${(item.price * item.quantity).toFixed(2)}€
                    </div>
                </div>
            `).join('');
            
            summaryContainer.innerHTML = itemsHtml;
        }
        
        updateOrderSummary();
    }
    
    function setupOrderRequestForm() {
        const orderForm = document.getElementById('order-request-form');
        
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    firstName: document.getElementById('first-name')?.value,
                    lastName: document.getElementById('last-name')?.value,
                    email: document.getElementById('email')?.value,
                    phone: document.getElementById('phone')?.value,
                    address: document.getElementById('address')?.value,
                    notes: document.getElementById('notes')?.value,
                    contactMethod: document.getElementById('contact-method')?.value,
                    newsletter: document.getElementById('newsletter')?.checked,
                    cart: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                };
                
                // Simulate form submission
                console.log('Order request submitted:', formData);
                
                // Show confirmation
                showConfirmation();
                
                // Clear cart
                cart = [];
                saveCart();
            });
        }
    }
    
    function showConfirmation() {
        const formSection = document.querySelector('.order-request-layout');
        const confirmationSection = document.querySelector('.confirmation-message');
        
        if (formSection && confirmationSection) {
            formSection.style.display = 'none';
            confirmationSection.classList.add('show');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // ==================== WISHLIST FUNCTIONALITY ====================
    const wishlistBtn = document.querySelector('.wishlist');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const isFavorite = this.classList.toggle('active');
            
            if (isFavorite) {
                this.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Retiré des Favoris
                `;
                this.style.color = '#e74c3c';
            } else {
                this.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Ajouter aux Favoris
                `;
                this.style.color = '';
            }
        });
    }
});
