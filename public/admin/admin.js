/**
 * SOLEA ADMIN DASHBOARD - JAVASCRIPT
 * ===================================
 * 
 * Handles all admin dashboard functionality:
 * - Authentication (login/logout)
 * - Product management (CRUD)
 * - Order management
 * - Settings management
 */

// ==================== GLOBAL STATE ====================

// Store authentication state
let isAuthenticated = false;
let authCredentials = null;

// Store current data
let products = [];
let orders = [];
let settings = {};

// ==================== INITIALIZATION ====================

/**
 * Initialize the admin dashboard when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (stored in sessionStorage)
    const storedAuth = sessionStorage.getItem('adminAuth');
    if (storedAuth) {
        authCredentials = storedAuth;
        isAuthenticated = true;
        showDashboard();
    }
    
    // Setup login form handler
    setupLoginForm();
    
    // Setup navigation
    setupNavigation();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup logout
    setupLogout();
    
    // Setup forms
    setupProductForm();
    setupSettingsForms();
    setupOrderFilters();
});

// ==================== AUTHENTICATION ====================

/**
 * Setup login form submission handler
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');
            
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store auth credentials
                    authCredentials = btoa(`${username}:${password}`);
                    sessionStorage.setItem('adminAuth', authCredentials);
                    isAuthenticated = true;
                    
                    // Show dashboard
                    showDashboard();
                } else {
                    errorDiv.textContent = data.error || 'Identifiants invalides';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                console.error('Login error:', error);
                errorDiv.textContent = 'Erreur de connexion au serveur';
                errorDiv.style.display = 'block';
            }
        });
    }
}

/**
 * Setup logout functionality
 */
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear auth
            sessionStorage.removeItem('adminAuth');
            authCredentials = null;
            isAuthenticated = false;
            
            // Show login screen
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('login-screen').style.display = 'flex';
        });
    }
}

/**
 * Show the admin dashboard and load data
 */
function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    
    // Load initial data
    loadDashboardData();
}

/**
 * Make authenticated API request
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Fetch response
 */
async function authFetch(url, options = {}) {
    const headers = {
        ...options.headers,
        'Authorization': `Basic ${authCredentials}`,
        'X-Admin-Auth': 'authenticated'
    };
    
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    return fetch(url, { ...options, headers });
}

// ==================== NAVIGATION ====================

/**
 * Setup sidebar navigation
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.dataset.section;
            if (section) {
                showSection(section);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                document.querySelector('.admin-sidebar').classList.remove('open');
            }
        });
    });
}

/**
 * Show a specific content section
 * @param {string} sectionId - Section identifier
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
    const titles = {
        'dashboard': 'Tableau de Bord',
        'products': 'Gestion des Produits',
        'orders': 'Gestion des Commandes',
        'settings': 'Paramètres'
    };
    document.getElementById('page-title').textContent = titles[sectionId] || 'Admin';
    
    // Update nav active state
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    
    // Load section-specific data
    switch (sectionId) {
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

/**
 * Setup mobile menu toggle
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.admin-sidebar') && !e.target.closest('#mobile-menu-btn')) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// ==================== DASHBOARD DATA ====================

/**
 * Load all dashboard data
 */
async function loadDashboardData() {
    try {
        // Load products
        const productsResponse = await authFetch('/api/admin/products');
        const productsData = await productsResponse.json();
        products = productsData.products || [];
        document.getElementById('stat-products').textContent = products.length;
        
        // Load orders
        const ordersResponse = await authFetch('/api/admin/orders');
        const ordersData = await ordersResponse.json();
        orders = ordersData.orders || [];
        document.getElementById('stat-orders').textContent = orders.length;
        
        const newOrders = orders.filter(o => o.status === 'new');
        document.getElementById('stat-new-orders').textContent = newOrders.length;
        
        // Load settings
        const settingsResponse = await authFetch('/api/admin/settings');
        settings = await settingsResponse.json();
        document.getElementById('stat-currency').textContent = settings.currency?.code || 'EUR';
        
        // Display recent orders
        displayRecentOrders();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Display recent orders on dashboard
 */
function displayRecentOrders() {
    const container = document.getElementById('recent-orders');
    const recentOrders = orders.slice(0, 5);
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune commande</p>';
        return;
    }
    
    container.innerHTML = recentOrders.map(order => `
        <div class="order-card" onclick="viewOrder('${order.id}')" style="margin-bottom: 0.75rem; padding: 0.75rem; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${order.orderNumber}</strong>
                    <span class="status-badge status-${order.status}" style="margin-left: 0.5rem;">${getStatusLabel(order.status)}</span>
                </div>
                <span>${settings.currency?.symbol || '€'}${order.total?.toFixed(2) || '0.00'}</span>
            </div>
            <div class="text-muted" style="font-size: 0.8rem; margin-top: 0.25rem;">
                ${order.customer?.firstName || ''} ${order.customer?.lastName || ''} - ${formatDate(order.createdAt)}
            </div>
        </div>
    `).join('');
}

// ==================== PRODUCTS MANAGEMENT ====================

/**
 * Load and display products
 */
async function loadProducts() {
    try {
        const response = await authFetch('/api/admin/products');
        const data = await response.json();
        products = data.products || [];
        
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

/**
 * Display products in table
 */
function displayProducts() {
    const tbody = document.getElementById('products-tbody');
    const currencySymbol = settings.currency?.symbol || '€';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Aucun produit trouvé</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <img src="${product.images?.[0] || 'images/placeholder.jpg'}" alt="${product.name}" class="product-thumb">
            </td>
            <td>
                <strong>${product.name}</strong>
                <div class="text-muted" style="font-size: 0.8rem;">${product.sku || ''}</div>
            </td>
            <td>${currencySymbol}${product.price?.toFixed(2) || '0.00'}</td>
            <td>${getCategoryLabel(product.category)}</td>
            <td>${product.stock || 0}</td>
            <td>
                <span class="status-badge ${product.visible !== false ? 'status-completed' : 'status-cancelled'}">
                    ${product.visible !== false ? 'Oui' : 'Non'}
                </span>
            </td>
            <td class="actions">
                <button class="btn btn-small btn-secondary" onclick="editProduct('${product.id}')">✏️</button>
                <button class="btn btn-small btn-danger" onclick="deleteProduct('${product.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Open product modal for adding/editing
 * @param {object} product - Product data (optional, for editing)
 */
function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('product-modal-title');
    
    // Reset form
    form.reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('variants-container').innerHTML = '';
    
    // Uncheck all checkboxes
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    if (product) {
        // Edit mode
        title.textContent = 'Modifier le Produit';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name || '';
        document.getElementById('product-sku').value = product.sku || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-long-description').value = product.longDescription || '';
        document.getElementById('product-price').value = product.price || 0;
        document.getElementById('product-stock').value = product.stock || 0;
        document.getElementById('product-category').value = product.category || 'shampoo';
        document.getElementById('product-visible').value = product.visible !== false ? 'true' : 'false';
        document.getElementById('product-ingredients').value = product.ingredients || '';
        
        // Set hair type checkboxes
        if (product.hairType) {
            product.hairType.forEach(type => {
                const cb = form.querySelector(`input[name="hairType"][value="${type}"]`);
                if (cb) cb.checked = true;
            });
        }
        
        // Set special checkboxes
        if (product.special) {
            product.special.forEach(spec => {
                const cb = form.querySelector(`input[name="special"][value="${spec}"]`);
                if (cb) cb.checked = true;
            });
        }
        
        // Display existing images
        if (product.images && product.images.length > 0) {
            document.getElementById('image-preview').innerHTML = product.images.map(img => 
                `<img src="${img}" alt="Product image">`
            ).join('');
        }
        
        // Add existing variants
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach(variant => addVariant(variant.name, variant.price));
        }
    } else {
        // Add mode
        title.textContent = 'Ajouter un Produit';
        document.getElementById('product-id').value = '';
        
        // Add a default variant
        addVariant('', '');
    }
    
    modal.classList.add('show');
}

/**
 * Close product modal
 */
function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
}

/**
 * Edit a product
 * @param {string} productId - Product ID
 */
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        openProductModal(product);
    }
}

/**
 * Delete a product
 * @param {string} productId - Product ID
 */
async function deleteProduct(productId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    
    try {
        const response = await authFetch(`/api/admin/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
            loadDashboardData();
        } else {
            const data = await response.json();
            alert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression du produit');
    }
}

/**
 * Add a variant row
 * @param {string} name - Variant name
 * @param {number} price - Variant price
 */
function addVariant(name = '', price = '') {
    const container = document.getElementById('variants-container');
    const row = document.createElement('div');
    row.className = 'variant-row';
    row.innerHTML = `
        <input type="text" name="variant-name" placeholder="Nom (ex: 250ml)" value="${name}">
        <input type="number" name="variant-price" placeholder="Prix" step="0.01" min="0" value="${price}">
        <button type="button" class="variant-remove" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(row);
}

/**
 * Setup product form submission
 */
function setupProductForm() {
    const form = document.getElementById('product-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Collect form data
        const productId = document.getElementById('product-id').value;
        const isEdit = !!productId;
        
        // Collect hair types
        const hairType = [];
        form.querySelectorAll('input[name="hairType"]:checked').forEach(cb => {
            hairType.push(cb.value);
        });
        
        // Collect special tags
        const special = [];
        form.querySelectorAll('input[name="special"]:checked').forEach(cb => {
            special.push(cb.value);
        });
        
        // Collect variants
        const variants = [];
        document.querySelectorAll('.variant-row').forEach(row => {
            const name = row.querySelector('input[name="variant-name"]').value;
            const price = parseFloat(row.querySelector('input[name="variant-price"]').value);
            if (name && !isNaN(price)) {
                variants.push({ name, price });
            }
        });
        
        const productData = {
            name: document.getElementById('product-name').value,
            sku: document.getElementById('product-sku').value,
            description: document.getElementById('product-description').value,
            longDescription: document.getElementById('product-long-description').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            category: document.getElementById('product-category').value,
            visible: document.getElementById('product-visible').value === 'true',
            ingredients: document.getElementById('product-ingredients').value,
            hairType,
            special,
            variants
        };
        
        try {
            const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await authFetch(url, {
                method,
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                closeProductModal();
                loadProducts();
                loadDashboardData();
            } else {
                const data = await response.json();
                alert(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erreur lors de la sauvegarde du produit');
        }
    });
    
    // Handle image upload preview
    const imageInput = document.getElementById('product-images');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const preview = document.getElementById('image-preview');
            
            Array.from(this.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

// ==================== ORDERS MANAGEMENT ====================

/**
 * Load and display orders
 */
async function loadOrders() {
    try {
        const response = await authFetch('/api/admin/orders');
        const data = await response.json();
        orders = data.orders || [];
        
        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

/**
 * Display orders in list
 * @param {string} filter - Status filter
 */
function displayOrders(filter = 'all') {
    const container = document.getElementById('orders-list');
    const currencySymbol = settings.currency?.symbol || '€';
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }
    
    if (filteredOrders.length === 0) {
        container.innerHTML = '<p class="loading">Aucune commande trouvée</p>';
        return;
    }
    
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card" onclick="viewOrder('${order.id}')">
            <div class="order-header">
                <div>
                    <span class="order-number">${order.orderNumber}</span>
                    <span class="order-date">${formatDate(order.createdAt)}</span>
                </div>
                <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
            </div>
            <div class="order-customer">
                <strong>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong>
                <span>${order.customer?.email || ''} • ${order.customer?.phone || ''}</span>
            </div>
            <div class="order-summary">
                <span>${order.items?.length || 0} article(s)</span>
                <span class="order-total">${currencySymbol}${order.total?.toFixed(2) || '0.00'}</span>
            </div>
        </div>
    `).join('');
}

/**
 * Setup order filter buttons
 */
function setupOrderFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter orders
            displayOrders(filter);
        });
    });
}

/**
 * View order details
 * @param {string} orderId - Order ID
 */
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-modal');
    const content = document.getElementById('order-detail-content');
    const currencySymbol = settings.currency?.symbol || '€';
    
    content.innerHTML = `
        <div class="order-detail-section">
            <h4>Informations</h4>
            <p><strong>Numéro:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
            <p><strong>Statut:</strong> <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></p>
        </div>
        
        <div class="order-detail-section">
            <h4>Client</h4>
            <p><strong>Nom:</strong> ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</p>
            <p><strong>Email:</strong> ${order.customer?.email || ''}</p>
            <p><strong>Téléphone:</strong> ${order.customer?.phone || ''}</p>
            <p><strong>Adresse:</strong> ${order.customer?.address || 'Non fournie'}</p>
            <p><strong>Contact préféré:</strong> ${order.customer?.preferredContact || 'Email'}</p>
        </div>
        
        <div class="order-detail-section">
            <h4>Articles</h4>
            <div class="order-items-list">
                ${order.items?.map(item => `
                    <div class="order-item-row">
                        <div>
                            <strong>${item.name}</strong>
                            ${item.variant ? `<span class="text-muted"> (${item.variant})</span>` : ''}
                            <span class="text-muted"> × ${item.quantity}</span>
                        </div>
                        <span>${currencySymbol}${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('') || ''}
            </div>
            <div class="order-totals">
                <p>Sous-total: ${currencySymbol}${order.subtotal?.toFixed(2) || '0.00'}</p>
                <p>Livraison: ${order.shipping || 'À confirmer'}</p>
                <p class="total">Total: ${currencySymbol}${order.total?.toFixed(2) || '0.00'}</p>
            </div>
        </div>
        
        ${order.notes ? `
            <div class="order-detail-section">
                <h4>Notes du Client</h4>
                <p>${order.notes}</p>
            </div>
        ` : ''}
        
        <div class="order-detail-section">
            <h4>Mettre à jour le Statut</h4>
            <div class="order-status-form">
                <select id="order-status-select">
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>Nouvelle</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En cours</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Terminée</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                </select>
                <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}')">Mettre à jour</button>
            </div>
        </div>
        
        <div class="order-detail-section">
            <h4>Notes Internes</h4>
            <textarea id="order-internal-notes" rows="3" style="width: 100%;">${order.internalNotes || ''}</textarea>
            <button class="btn btn-secondary mt-1" onclick="updateOrderNotes('${order.id}')">Enregistrer les notes</button>
        </div>
    `;
    
    modal.classList.add('show');
}

/**
 * Close order modal
 */
function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('show');
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 */
async function updateOrderStatus(orderId) {
    const status = document.getElementById('order-status-select').value;
    
    try {
        const response = await authFetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            loadOrders();
            loadDashboardData();
            closeOrderModal();
        } else {
            const data = await response.json();
            alert(data.error || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Erreur lors de la mise à jour du statut');
    }
}

/**
 * Update order internal notes
 * @param {string} orderId - Order ID
 */
async function updateOrderNotes(orderId) {
    const internalNotes = document.getElementById('order-internal-notes').value;
    
    try {
        const response = await authFetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ internalNotes })
        });
        
        if (response.ok) {
            alert('Notes enregistrées');
        } else {
            const data = await response.json();
            alert(data.error || 'Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error('Error updating notes:', error);
        alert('Erreur lors de la sauvegarde des notes');
    }
}

// ==================== SETTINGS MANAGEMENT ====================

/**
 * Load settings into forms
 */
async function loadSettings() {
    try {
        const response = await authFetch('/api/admin/settings');
        settings = await response.json();
        
        // Currency
        document.getElementById('currency-code').value = settings.currency?.code || 'EUR';
        document.getElementById('currency-symbol').value = settings.currency?.symbol || '€';
        
        // Business
        document.getElementById('business-name').value = settings.business?.name || 'Solea';
        document.getElementById('free-shipping').value = settings.business?.freeShippingThreshold || 50;
        document.getElementById('shipping-cost').value = settings.business?.shippingCost || 5.99;
        
        // Contact
        document.getElementById('contact-phone').value = settings.contact?.phone || '';
        document.getElementById('contact-email').value = settings.contact?.email || '';
        document.getElementById('contact-whatsapp').value = settings.contact?.whatsapp || '';
        document.getElementById('contact-address').value = settings.contact?.address || '';
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Setup settings forms
 */
function setupSettingsForms() {
    // Currency form
    const currencyForm = document.getElementById('currency-form');
    if (currencyForm) {
        currencyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveSettings({
                currency: {
                    code: document.getElementById('currency-code').value,
                    symbol: document.getElementById('currency-symbol').value,
                    name: getCurrencyName(document.getElementById('currency-code').value)
                }
            });
        });
    }
    
    // Business form
    const businessForm = document.getElementById('business-form');
    if (businessForm) {
        businessForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveSettings({
                business: {
                    name: document.getElementById('business-name').value,
                    freeShippingThreshold: parseFloat(document.getElementById('free-shipping').value),
                    shippingCost: parseFloat(document.getElementById('shipping-cost').value)
                }
            });
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveSettings({
                contact: {
                    phone: document.getElementById('contact-phone').value,
                    email: document.getElementById('contact-email').value,
                    whatsapp: document.getElementById('contact-whatsapp').value,
                    address: document.getElementById('contact-address').value
                }
            });
        });
    }
    
    // Admin form (password change)
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (!newPassword) {
                alert('Veuillez entrer un nouveau mot de passe');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }
            
            await saveSettings({
                admin: { password: newPassword }
            });
            
            // Clear form
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });
    }
}

/**
 * Save settings to server
 * @param {object} settingsData - Settings to save
 */
async function saveSettings(settingsData) {
    try {
        const response = await authFetch('/api/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData)
        });
        
        if (response.ok) {
            alert('Paramètres enregistrés avec succès');
            loadDashboardData();
        } else {
            const data = await response.json();
            alert(data.error || 'Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Erreur lors de la sauvegarde des paramètres');
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get readable category label
 * @param {string} category - Category code
 * @returns {string} Category label
 */
function getCategoryLabel(category) {
    const labels = {
        'shampoo': 'Shampooing',
        'conditioner': 'Après-Shampooing',
        'mask': 'Masque',
        'serum': 'Sérum / Huile',
        'styling': 'Coiffage'
    };
    return labels[category] || category;
}

/**
 * Get readable status label
 * @param {string} status - Status code
 * @returns {string} Status label
 */
function getStatusLabel(status) {
    const labels = {
        'new': 'Nouvelle',
        'processing': 'En cours',
        'completed': 'Terminée',
        'cancelled': 'Annulée'
    };
    return labels[status] || status;
}

/**
 * Get currency name from code
 * @param {string} code - Currency code
 * @returns {string} Currency name
 */
function getCurrencyName(code) {
    const names = {
        'EUR': 'Euro',
        'USD': 'Dollar US',
        'GBP': 'Livre Sterling',
        'CHF': 'Franc Suisse',
        'CAD': 'Dollar Canadien',
        'XOF': 'Franc CFA',
        'MAD': 'Dirham Marocain'
    };
    return names[code] || code;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make functions globally available
window.showSection = showSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.addVariant = addVariant;
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.updateOrderStatus = updateOrderStatus;
window.updateOrderNotes = updateOrderNotes;
