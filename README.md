# Solea Website

A modern, responsive website for Solea - offering professional hair products, cosmetics school, driving school, and decoration services.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start at `http://localhost:3000`

### Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin`

**Default credentials:**
- Username: `admin`
- Password: `solea2026`

⚠️ **IMPORTANT**: Change the default password immediately after first login via the Settings page.

## Project Structure

```
Solea-website/
├── server.js              # Express server with API endpoints
├── package.json           # Node.js dependencies
├── data/                  # JSON database files
│   ├── products.json      # Product catalog
│   ├── orders.json        # Customer orders
│   └── settings.json      # Site settings (currency, contact, etc.)
├── public/                # Public static files
│   ├── index.html         # Main homepage
│   ├── shop.html          # Product listing
│   ├── product-detail.html # Product detail page
│   ├── order-list.html    # Shopping cart
│   ├── order-request.html # Checkout form
│   ├── admin/             # Admin dashboard
│   │   ├── index.html     # Admin interface
│   │   ├── admin.css      # Admin styles
│   │   └── admin.js       # Admin functionality
│   ├── css/
│   │   ├── styles.css     # Main styles
│   │   └── shop.css       # Shop-specific styles
│   ├── js/
│   │   ├── api.js         # API client library
│   │   ├── main.js        # Common functionality
│   │   ├── home.js        # Homepage scripts
│   │   ├── shop.js        # Shop functionality
│   │   └── product-detail.js # Product page scripts
│   └── images/            # Product and site images
└── README.md              # This file
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products (with filters) |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/settings` | Get public settings (currency, contact) |
| POST | `/api/orders` | Submit a new order |

### Admin Endpoints (requires authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/products` | List all products (including hidden) |
| POST | `/api/admin/products` | Create new product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| POST | `/api/admin/products/:id/images` | Upload product images |
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/:id` | Update order status |
| GET | `/api/admin/settings` | Get all settings |
| PUT | `/api/admin/settings` | Update settings |

### Query Parameters for `/api/products`

- `category` - Filter by category (shampoo, conditioner, mask, serum, styling)
- `hairType` - Filter by hair type (dry, oily, normal, curly, damaged)
- `special` - Filter by special tags (new, bestseller, bio)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search by name or description
- `sort` - Sort by (price-asc, price-desc, newest, rating, popularity)

## Features

### Admin Dashboard

- **Products Management**: Add, edit, delete products with multiple images
- **Orders Management**: View and update order status, add internal notes
- **Settings**: Configure currency, contact info, business settings
- **Statistics**: Dashboard with quick stats overview

### User Features

- **Dynamic Product Catalog**: Products loaded from server
- **Filtering & Sorting**: By category, hair type, price, special tags
- **Search**: Search products by name or description
- **Shopping Cart**: Add to cart with quantity management
- **Order Submission**: Submit orders via form (no online payment)
- **Currency Display**: Admin-configurable currency symbol

## Color Palette

The website uses a sophisticated and elegant color scheme:

- **Deep Plum** (#6B2D5C) - Rich dark accent for premium feel
- **Rose Gold** (#D4A5A5) - Sophisticated rose tone
- **Soft Lavender** (#F5E6F1) - Subtle light backgrounds
- **Dusty Rose** (#C47B9C) - Primary brand color
- **Warm Cream** (#FFF8F3) - Clean background
- **Charcoal** (#2D2D2D) - Text with strong contrast

## Typography

- **Headings**: Playfair Display (elegant serif font)
- **Body Text**: Poppins (modern sans-serif font)

## Features

### Homepage Sections

1. **Header/Navigation**
   - Sticky header with logo
   - Full navigation menu (Home, Shop, School, Driving, Decoration, About, Contact)
   - Search functionality
   - Cart/Order list icon
   - Language toggle (FR/EN)
   - Responsive mobile menu

2. **Hero Section**
   - Full-width banner with gradient background
   - Compelling headline and subtitle
   - Four primary CTAs for main services
   - Smooth scroll indicator

3. **Services Cards**
   - Three highlighted service offerings
   - Hover effects with image zoom
   - Direct links to service pages

4. **Featured Products Carousel**
   - Horizontal scrolling product showcase
   - Product cards with images, ratings, and prices
   - "New" and "Bestseller" badges
   - Add to order list functionality
   - Navigation arrows for easy browsing

5. **Testimonials**
   - Customer reviews with star ratings
   - Profile images and names
   - Elegant card design with hover effects

6. **News & Announcements**
   - Latest updates and events
   - Categorized articles
   - Date badges
   - Read more links

7. **Newsletter Signup**
   - Email subscription form
   - Eye-catching gradient background
   - Form validation

8. **Brand Mission**
   - Company mission statement
   - Partner and certification logos
   - Professional imagery

9. **Footer**
   - Quick links to all pages
   - Contact information (phone, email, address, WhatsApp)
   - Business hours
   - Social media links
   - Legal links (Privacy, Terms, Cookies, Shipping)
   - Copyright information

## Interactive Features

### JavaScript Functionality

- **Mobile Menu Toggle**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Seamless navigation to page sections
- **Product Carousel**: Left/right navigation with smooth scrolling
- **Cart Counter**: Dynamic item count updates
- **Newsletter Validation**: Email format checking
- **Scroll Effects**: Header shadow and scroll-to-top button
- **Intersection Observer**: Fade-in animations for elements as they enter viewport
- **Search Functionality**: Search box with enter key support

## Responsive Design

The website is fully responsive with breakpoints for:

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

### Mobile Optimizations

- Collapsible hamburger menu
- Stacked layouts for better readability
- Touch-friendly button sizes
- Optimized images and spacing
- Full-width CTAs for easier interaction

## CSS Architecture

### Modern CSS Features

- CSS Custom Properties (variables) for maintainability
- Flexbox and Grid for layouts
- **Layered box-shadows for depth and elevation**
- **Multi-layer shadow system (sm, md, lg, xl, 2xl)**
- **Gradient overlays and backgrounds**
- **Backdrop-filter for glassmorphism effects**
- Smooth transitions and animations
- **Button ripple effects**
- **Hover scale transformations**
- Responsive units (rem, %, vh, vw)

### Utility Classes

Pre-built utility classes for common styling needs:
- Text alignment
- Margin/padding helpers
- Responsive visibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

This project is structured for deployment on Railway:

1. The `public/` directory contains all static assets
2. Files are organized for optimal loading performance
3. All paths are relative for easy deployment

## Code Quality

### Comments and Documentation

All code files include comprehensive comments:

- **HTML**: Section markers and element descriptions
- **CSS**: Detailed explanations of styles and their purpose
- **JavaScript**: Function-level documentation and inline comments

### Best Practices

- Semantic HTML5 elements
- Accessible ARIA labels
- SEO-friendly meta tags
- Progressive enhancement
- Mobile-first approach

## Future Enhancements

Based on the wireframe, these pages will be added:

- Shop (product listing and detail pages)
- School (programs and admissions)
- Driving (packages and booking)
- Decoration (portfolio and quote request)
- About page
- Contact page
- Admin dashboard (private)

## No Online Payments

As per requirements, this website does not include online payment processing. All product orders and service requests are submitted via forms that send email notifications to Solea staff, who will contact customers directly.

## Contact Information

- **Phone**: +33 1 23 45 67 89
- **Email**: contact@solea.com
- **WhatsApp**: +33 6 12 34 56 78 (display only, no chat widget)
- **Address**: 123 Rue de la Beauté, Paris

---

**Note**: All images in this version are SVG placeholders. Replace them with actual professional photography for production use.
