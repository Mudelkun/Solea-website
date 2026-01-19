/**
 * SOLEA WEBSITE - EXPRESS SERVER
 * ==============================
 *
 * Node.js + Express server with JSON database for:
 * - Product management (CRUD operations)
 * - Order management
 * - Admin dashboard
 * - Settings management (including currency)
 *
 * This server serves static files and provides API endpoints.
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================

// Rate limiting for API endpoints (disabled for development)
// Uncomment and adjust for production
/*
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});

// Stricter rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});
*/

// No-op middleware for development (rate limiting disabled)
const apiLimiter = (req, res, next) => next();
const adminLimiter = (req, res, next) => next();

// Apply rate limiting to API routes
app.use("/api/", apiLimiter);
app.use("/api/admin/", adminLimiter);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// ==================== FILE PATHS ====================

// Paths to JSON data files
const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

// ==================== HELPER FUNCTIONS ====================

/**
 * Read data from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {object} Parsed JSON data
 */
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Write data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {object} data - Data to write
 * @returns {boolean} Success status
 */
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Generate a unique ID for new items
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
}

// ==================== IMAGE UPLOAD CONFIGURATION ====================

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "public", "images", "products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image uploads (multer 2.x API)
const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// ==================== SIMPLE AUTH MIDDLEWARE ====================

/**
 * Basic authentication middleware for admin routes
 * Checks for admin credentials in session or request
 */
function requireAuth(req, res, next) {
  // Check for auth header or session
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const encoded = authHeader.split(" ")[1];
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const [username, password] = decoded.split(":");

    const settings = readJsonFile(SETTINGS_FILE);
    if (
      settings &&
      username === settings.admin.username &&
      password === settings.admin.password
    ) {
      return next();
    }
  }

  // Check for session cookie
  const sessionAuth = req.headers["x-admin-auth"];
  if (sessionAuth === "authenticated") {
    return next();
  }

  res.status(401).json({ error: "Authentication required" });
}

// ==================== API ROUTES: PRODUCTS ====================

/**
 * GET /api/products
 * Get all visible products (for public use)
 */
app.get("/api/products", (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  // Get settings for currency
  const settings = readJsonFile(SETTINGS_FILE);

  // Filter only visible products for public API
  let products = data.products.filter((p) => p.visible !== false);

  // Apply filters from query parameters
  const { category, hairType, special, minPrice, maxPrice, search, sort } =
    req.query;

  // Filter by category
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  // Filter by hair type
  if (hairType) {
    products = products.filter(
      (p) => p.hairType && p.hairType.includes(hairType),
    );
  }

  // Filter by special tags (new, bestseller, bio)
  if (special) {
    products = products.filter((p) => p.special && p.special.includes(special));
  }

  // Filter by price range
  if (minPrice) {
    products = products.filter((p) => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter((p) => p.price <= parseFloat(maxPrice));
  }

  // Search by name or description
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower),
    );
  }

  // Sort products
  if (sort) {
    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  res.json({
    products: products,
    currency: settings ? settings.currency : { symbol: "€", code: "EUR" },
    total: products.length,
  });
});

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
app.get("/api/products/:id", (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  const settings = readJsonFile(SETTINGS_FILE);

  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  const product = data.products.find((p) => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json({
    product: product,
    currency: settings ? settings.currency : { symbol: "€", code: "EUR" },
  });
});

/**
 * GET /api/admin/products
 * Get all products including hidden ones (admin only)
 */
app.get("/api/admin/products", requireAuth, (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  res.json({ products: data.products });
});

/**
 * POST /api/admin/products
 * Create a new product (admin only)
 */
app.post("/api/admin/products", requireAuth, (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  // Create new product with provided data
  const newProduct = {
    id: generateId(),
    name: req.body.name || "New Product",
    description: req.body.description || "",
    longDescription: req.body.longDescription || "",
    price: parseFloat(req.body.price) || 0,
    category: req.body.category || "shampoo",
    hairType: req.body.hairType || [],
    special: req.body.special || [],
    sku: req.body.sku || `SKU-${Date.now()}`,
    rating: 0,
    reviewCount: 0,
    images: req.body.images || ["images/placeholder.jpg"],
    variants: req.body.variants || [],
    benefits: req.body.benefits || [],
    ingredients: req.body.ingredients || "",
    certifications: req.body.certifications || [],
    stock: parseInt(req.body.stock) || 0,
    visible: req.body.visible !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to products array
  data.products.push(newProduct);

  // Save to file
  if (!writeJsonFile(PRODUCTS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save product" });
  }

  res
    .status(201)
    .json({ product: newProduct, message: "Product created successfully" });
});

/**
 * PUT /api/admin/products/:id
 * Update an existing product (admin only)
 */
app.put("/api/admin/products/:id", requireAuth, (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  // Find product index
  const productIndex = data.products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Update product with provided data, keeping existing values for unset fields
  const existingProduct = data.products[productIndex];
  const updatedProduct = {
    ...existingProduct,
    name: req.body.name !== undefined ? req.body.name : existingProduct.name,
    description:
      req.body.description !== undefined
        ? req.body.description
        : existingProduct.description,
    longDescription:
      req.body.longDescription !== undefined
        ? req.body.longDescription
        : existingProduct.longDescription,
    price:
      req.body.price !== undefined
        ? parseFloat(req.body.price)
        : existingProduct.price,
    category:
      req.body.category !== undefined
        ? req.body.category
        : existingProduct.category,
    hairType:
      req.body.hairType !== undefined
        ? req.body.hairType
        : existingProduct.hairType,
    special:
      req.body.special !== undefined
        ? req.body.special
        : existingProduct.special,
    sku: req.body.sku !== undefined ? req.body.sku : existingProduct.sku,
    images:
      req.body.images !== undefined ? req.body.images : existingProduct.images,
    variants:
      req.body.variants !== undefined
        ? req.body.variants
        : existingProduct.variants,
    benefits:
      req.body.benefits !== undefined
        ? req.body.benefits
        : existingProduct.benefits,
    ingredients:
      req.body.ingredients !== undefined
        ? req.body.ingredients
        : existingProduct.ingredients,
    certifications:
      req.body.certifications !== undefined
        ? req.body.certifications
        : existingProduct.certifications,
    stock:
      req.body.stock !== undefined
        ? parseInt(req.body.stock)
        : existingProduct.stock,
    visible:
      req.body.visible !== undefined
        ? req.body.visible
        : existingProduct.visible,
    updatedAt: new Date().toISOString(),
  };

  // Update in array
  data.products[productIndex] = updatedProduct;

  // Save to file
  if (!writeJsonFile(PRODUCTS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save product" });
  }

  res.json({
    product: updatedProduct,
    message: "Product updated successfully",
  });
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product (admin only)
 */
app.delete("/api/admin/products/:id", requireAuth, (req, res) => {
  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  // Find product index
  const productIndex = data.products.findIndex((p) => p.id === req.params.id);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Remove product
  const deletedProduct = data.products.splice(productIndex, 1)[0];

  // Save to file
  if (!writeJsonFile(PRODUCTS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save changes" });
  }

  res.json({
    product: deletedProduct,
    message: "Product deleted successfully",
  });
});

/**
 * POST /api/admin/products/:id/images
 * Upload images for a product (admin only)
 */
app.post(
  "/api/admin/products/:id/images",
  requireAuth,
  upload.array("images", 5),
  async (req, res) => {
    console.log("Image upload endpoint called for product:", req.params.id);
    console.log("Files received:", req.files ? req.files.length : 0);

    if (!req.files || req.files.length === 0) {
      console.error("No files in request");
      return res.status(400).json({ error: "No images uploaded" });
    }

    const data = readJsonFile(PRODUCTS_FILE);
    if (!data) {
      console.error("Failed to read products file");
      return res.status(500).json({ error: "Failed to read products" });
    }

    // Find product
    const product = data.products.find((p) => p.id === req.params.id);
    if (!product) {
      console.error("Product not found:", req.params.id);
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Processing", req.files.length, "files...");

    // Process uploaded files (multer 2.x stores files with temp names)
    const newImages = [];
    for (const file of req.files) {
      console.log(
        "Processing file:",
        file.originalname,
        "Type:",
        file.mimetype,
      );

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        console.log("File type not allowed:", file.mimetype);
        continue;
      }

      // Generate proper filename with extension
      const ext = path.extname(file.originalname) || ".jpg";
      const newFilename =
        "product-" +
        Date.now() +
        "-" +
        Math.random().toString(36).substring(2, 11) +
        ext;
      const oldPath = file.path;
      const newPath = path.join(uploadDir, newFilename);

      console.log("Old path:", oldPath);
      console.log("New path:", newPath);

      // Rename file with proper extension
      try {
        fs.renameSync(oldPath, newPath);
        console.log("File saved successfully:", newFilename);
        newImages.push("images/products/" + newFilename);
      } catch (error) {
        console.error("Error renaming file:", error.message);
      }
    }

    if (newImages.length === 0) {
      console.error("No valid images were processed");
      return res.status(400).json({ error: "No valid images uploaded" });
    }

    console.log("Successfully saved", newImages.length, "images");

    // Replace image array with new images first, then existing images (removing placeholder)
    const existingImages = (product.images || []).filter(
      (img) => img !== "images/placeholder.jpg",
    );
    product.images = [...newImages, ...existingImages];
    product.updatedAt = new Date().toISOString();

    // Save to file
    if (!writeJsonFile(PRODUCTS_FILE, data)) {
      console.error("Failed to write products file");
      return res.status(500).json({ error: "Failed to save product" });
    }

    console.log("Product updated with new images");
    res.json({ images: newImages, message: "Images uploaded successfully" });
  },
);

/**
 * PUT /api/admin/products/:id/image-views
 * Update which view(s) each image belongs to (admin only)
 */
app.put("/api/admin/products/:id/image-views", requireAuth, (req, res) => {
  const { imageViews } = req.body;

  if (!imageViews || typeof imageViews !== "object") {
    return res.status(400).json({ error: "Invalid image views data" });
  }

  const data = readJsonFile(PRODUCTS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read products" });
  }

  // Find product
  const product = data.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Update image structure to include view information
  if (product.images && Array.isArray(product.images)) {
    product.images = product.images.map((img, index) => {
      // Support both old format (string) and new format (object)
      const imagePath = typeof img === "string" ? img : img.path || img;
      const view = imageViews[index] || "vue1";

      return {
        path: imagePath,
        view: view,
      };
    });
  }

  product.updatedAt = new Date().toISOString();

  // Save to file
  if (!writeJsonFile(PRODUCTS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save product" });
  }

  console.log("Image views updated for product:", req.params.id);
  res.json({ message: "Image views updated successfully" });
});

// ==================== API ROUTES: ORDERS ====================

/**
 * GET /api/admin/orders
 * Get all orders (admin only)
 */
app.get("/api/admin/orders", requireAuth, (req, res) => {
  const data = readJsonFile(ORDERS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read orders" });
  }

  // Sort by newest first
  const orders = data.orders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  res.json({ orders: orders });
});

/**
 * POST /api/orders
 * Create a new order (public - for customers)
 */
app.post("/api/orders", (req, res) => {
  const data = readJsonFile(ORDERS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read orders" });
  }

  // Validate required fields
  if (
    !req.body.customer ||
    !req.body.customer.email ||
    !req.body.customer.phone
  ) {
    return res
      .status(400)
      .json({ error: "Customer email and phone are required" });
  }

  if (!req.body.items || req.body.items.length === 0) {
    return res
      .status(400)
      .json({ error: "Order must contain at least one item" });
  }

  // Create new order
  const newOrder = {
    id: generateId(),
    orderNumber: `SOL-${Date.now().toString().slice(-8)}`,
    customer: {
      firstName: req.body.customer.firstName || "",
      lastName: req.body.customer.lastName || "",
      email: req.body.customer.email,
      phone: req.body.customer.phone,
      address: req.body.customer.address || "",
      preferredContact: req.body.customer.preferredContact || "email",
      newsletter: req.body.customer.newsletter || false,
    },
    items: req.body.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      variant: item.variant || "",
      subtotal: parseFloat(item.price) * parseInt(item.quantity),
    })),
    notes: req.body.notes || "",
    subtotal: parseFloat(req.body.subtotal) || 0,
    shipping: req.body.shipping || "À confirmer",
    total: parseFloat(req.body.total) || 0,
    status: "new",
    internalNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to orders array
  data.orders.push(newOrder);

  // Save to file
  if (!writeJsonFile(ORDERS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save order" });
  }

  res
    .status(201)
    .json({ order: newOrder, message: "Order submitted successfully" });
});

/**
 * PUT /api/admin/orders/:id
 * Update order status (admin only)
 */
app.put("/api/admin/orders/:id", requireAuth, (req, res) => {
  const data = readJsonFile(ORDERS_FILE);
  if (!data) {
    return res.status(500).json({ error: "Failed to read orders" });
  }

  // Find order
  const order = data.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  // Update order fields
  if (req.body.status) order.status = req.body.status;
  if (req.body.internalNotes !== undefined)
    order.internalNotes = req.body.internalNotes;
  order.updatedAt = new Date().toISOString();

  // Save to file
  if (!writeJsonFile(ORDERS_FILE, data)) {
    return res.status(500).json({ error: "Failed to save order" });
  }

  res.json({ order: order, message: "Order updated successfully" });
});

// ==================== API ROUTES: SETTINGS ====================

/**
 * GET /api/settings
 * Get public settings (currency, contact info)
 */
app.get("/api/settings", (req, res) => {
  const settings = readJsonFile(SETTINGS_FILE);
  if (!settings) {
    return res.status(500).json({ error: "Failed to read settings" });
  }

  // Return only public settings (no admin credentials)
  res.json({
    currency: settings.currency,
    contact: settings.contact,
    business: settings.business,
  });
});

/**
 * GET /api/admin/settings
 * Get all settings (admin only)
 */
app.get("/api/admin/settings", requireAuth, (req, res) => {
  const settings = readJsonFile(SETTINGS_FILE);
  if (!settings) {
    return res.status(500).json({ error: "Failed to read settings" });
  }

  // Return all settings except password
  res.json({
    currency: settings.currency,
    contact: settings.contact,
    business: settings.business,
    admin: { username: settings.admin.username },
  });
});

/**
 * PUT /api/admin/settings
 * Update settings (admin only)
 */
app.put("/api/admin/settings", requireAuth, (req, res) => {
  const settings = readJsonFile(SETTINGS_FILE);
  if (!settings) {
    return res.status(500).json({ error: "Failed to read settings" });
  }

  // Update currency
  if (req.body.currency) {
    settings.currency = {
      symbol: req.body.currency.symbol || settings.currency.symbol,
      code: req.body.currency.code || settings.currency.code,
      name: req.body.currency.name || settings.currency.name,
    };
  }

  // Update contact info
  if (req.body.contact) {
    settings.contact = {
      phone: req.body.contact.phone || settings.contact.phone,
      email: req.body.contact.email || settings.contact.email,
      whatsapp: req.body.contact.whatsapp || settings.contact.whatsapp,
      address: req.body.contact.address || settings.contact.address,
    };
  }

  // Update business settings
  if (req.body.business) {
    settings.business = {
      name: req.body.business.name || settings.business.name,
      freeShippingThreshold:
        req.body.business.freeShippingThreshold !== undefined
          ? parseFloat(req.body.business.freeShippingThreshold)
          : settings.business.freeShippingThreshold,
      shippingCost:
        req.body.business.shippingCost !== undefined
          ? parseFloat(req.body.business.shippingCost)
          : settings.business.shippingCost,
    };
  }

  // Update admin password if provided
  if (req.body.admin && req.body.admin.password) {
    settings.admin.password = req.body.admin.password;
  }

  // Save to file
  if (!writeJsonFile(SETTINGS_FILE, settings)) {
    return res.status(500).json({ error: "Failed to save settings" });
  }

  res.json({ message: "Settings updated successfully" });
});

// ==================== API ROUTES: AUTHENTICATION ====================

/**
 * POST /api/admin/login
 * Admin login
 */
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const settings = readJsonFile(SETTINGS_FILE);
  if (!settings) {
    return res.status(500).json({ error: "Failed to read settings" });
  }

  // Check credentials
  if (
    username === settings.admin.username &&
    password === settings.admin.password
  ) {
    res.json({
      success: true,
      message: "Login successful",
      username: username,
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ==================== ADMIN PAGES ====================

/**
 * Serve admin dashboard page
 */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

// ==================== ERROR HANDLING ====================

// Handle 404 for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Handle multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File is too large. Maximum size is 5MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
  next();
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌸 SOLEA Website Server                             ║
║                                                       ║
║   Server running at: http://localhost:${PORT}           ║
║   Admin dashboard:   http://localhost:${PORT}/admin     ║
║                                                       ║
║   API Endpoints:                                      ║
║   • GET  /api/products        - List products         ║
║   • GET  /api/products/:id    - Get single product    ║
║   • GET  /api/settings        - Get public settings   ║
║   • POST /api/orders          - Submit order          ║
║                                                       ║
║   Admin API (requires auth):                          ║
║   • POST   /api/admin/login   - Admin login           ║
║   • GET    /api/admin/products                        ║
║   • POST   /api/admin/products                        ║
║   • PUT    /api/admin/products/:id                    ║
║   • DELETE /api/admin/products/:id                    ║
║   • GET    /api/admin/orders                          ║
║   • PUT    /api/admin/orders/:id                      ║
║   • GET    /api/admin/settings                        ║
║   • PUT    /api/admin/settings                        ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
