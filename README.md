# Solea Website

A modern, responsive website for Solea - offering professional hair products, cosmetics school, driving school, and decoration services.

## Project Structure

```
Solea-website/
├── public/                 # Public directory for Railway deployment
│   ├── index.html         # Main homepage
│   ├── css/
│   │   └── styles.css     # Modern CSS styling with custom color palette
│   ├── js/
│   │   └── main.js        # Interactive JavaScript functionality
│   └── images/            # Placeholder images for all sections
├── solea-wireframe_Version3.md  # Design wireframe reference
└── README.md              # This file
```

## Color Palette

The website uses a sophisticated color scheme:

- **Soft Blush** (#ffe5ec) - Light backgrounds and subtle accents
- **Cotton Candy** (#ff8fab) - Primary brand color for buttons and highlights
- **Cherry Blossom** (#ffb3c6) - Body text and borders
- **Petal Rouge** (#fb6f92) - Dark accents and headings
- **Pastel Pink** (#ffc2d1) - Secondary backgrounds and cards

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
- Smooth transitions and animations
- Box-shadow and gradients for depth
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
