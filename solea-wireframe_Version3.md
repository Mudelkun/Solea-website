# Visual Wireframe: Solea (Low-Fidelity)
Note: The design should be modern. No online payments. The public site has no user login. Orders and applications are submitted via forms; Solea receives email notifications and will contact users. A private client admin dashboard (username + password) is used to manage products and site content. No live WhatsApp chat; only a WhatsApp contact number will be displayed.

Legend:
- [Component] = UI element or block
- CTA = Call to Action button
- ↑ Fold = Approximate first screen area

---

## Global Layout (Header, Footer, Navigation)

### Desktop
```
+----------------------------------------------------------------------------------+
| [Logo Solea]    [Home] [Shop] [School] [Driving] [Decoration] [About] [Contact] |
|                                   [Search]         [Cart/Order List]   [FR | EN] |
+----------------------------------------------------------------------------------+
                                                          ↑ Fold on most pages
... page content ...
+----------------------------------------------------------------------------------+
| [Quick Links] [Contact Info] [Social Icons] [Newsletter] [Legal/Policies]       |
| Contact Info includes phone and WhatsApp number (no chat widget)                |
+----------------------------------------------------------------------------------+
```

### Mobile
```
+------------------------------------+
| [☰] [Logo Solea]   [Cart/Orders]   |
| [Search]            [FR | EN]      |
+------------------------------------+
... page content ...
+------------------------------------+
| Footer: Links | Contact | Social   |
| Contact shows phone and WhatsApp number (no chat)                               |
+------------------------------------+

Mobile Menu (overlay):
[Home]
[Shop]
[School]
[Driving]
[Decoration]
[About]
[Contact]
[Language FR/EN]
```

---

## Homepage

### Desktop
```
+----------------------------------------------------------------------------------+
|                              [Hero Image/Video]                                  |
|     "Solea — Produits capillaires, école professionnelle, conduite & décoration" |
|     [CTA: Shop Hair Products] [CTA: Explore School] [CTA: Driving] [Decoration]  |
+----------------------------------------------------------------------------------+  ↑ Fold
| [3 Service Cards]                                                                |
|  ┌────────────────────┬─────────────────────┬─────────────────────┐              |
|  | Hair Products      | School (Cosmetics)  | Driving & Decoration|              |
|  | [img] [Shop now]   | [img] [Learn more]  | [img] [Learn more]  |              |
|  └────────────────────┴─────────────────────┴─────────────────────┘              |
+----------------------------------------------------------------------------------+
| [Featured Products Carousel]                                                     |
+----------------------------------------------------------------------------------+
| [Testimonials / Results]                                                         |
+----------------------------------------------------------------------------------+
| [Latest News / Announcements / Enrollment dates]                                 |
+----------------------------------------------------------------------------------+
| [Newsletter Signup]                                                              |
+----------------------------------------------------------------------------------+
| [Brand/Mission + Image] [Partner Logos/Certifications]                           |
+----------------------------------------------------------------------------------+
```

### Mobile
```
+------------------------------------+
| [Hero Image/Video]                 |
| Headline                           |
| [Shop] [School] [Driving] [Deco]   |
+------------------------------------+  ↑ Fold
| [Service Card: Hair Products]      |
| [Service Card: School]             |
| [Service Card: Driving & Deco]     |
+------------------------------------+
| [Featured Products Carousel]       |
+------------------------------------+
| [Testimonials]                     |
+------------------------------------+
| [News / Announcements]             |
+------------------------------------+
| [Newsletter Signup]                |
+------------------------------------+
| [Brand/Mission] [Partners]         |
+------------------------------------+
```

---

## Shop (Hair Products)

### Product Listing (Desktop)
```
+----------------------------------------------------------------------------------+
| [Breadcrumbs]                                                                    |
| [Filters: Category | Hair type | Price | Bestsellers | New]   [Sort: Popularity]|
+----------------------------------------------------------------------------------+  ↑ Fold
| [Grid 3–4 columns: Product Card]                                                 |
| ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐                     |
| | [Image]    | | [Image]    | | [Image]    | | [Image]    |                     |
| | Name       | | Name       | | Name       | | Name       |                     |
| | Price ★★★★ | | Price ★★★★ | | Price ★★★★ | | Price ★★★★ |                     |
| | [Add to Order List]                       [View]         |                     |
| └────────────┘ └────────────┘ └────────────┘ └────────────┘                     |
+----------------------------------------------------------------------------------+
| [Pagination]                                                                      |
+----------------------------------------------------------------------------------+
```

### Product Detail (Desktop)
```
+----------------------------------------------------------------------------------+
| [Breadcrumbs]                                                                    |
| [Gallery: main image + thumbnails]     [Title | Price | ★★★★ | SKU]              |
|                                        [Variants: Size] [Qty] [Add to Order]     |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Tabs: Benefits | Ingredients | Usage | Reviews | FAQs]                          |
+----------------------------------------------------------------------------------+
| [Related Products Carousel]                                                      |
+----------------------------------------------------------------------------------+
```

### Cart & Order Request (Desktop) — No Online Payment
```
+--------------------------------------+  +--------------------------------------+
| Order List (Cart)                    |  | Order Request (Checkout replacement) |
| [Items list with qty, price]         |  | [Summary of selected items]          |
|                                      |  |                                      |
|                                      |  | [Form fields:]                       |
|                                      |  |  - Name                              |
| [CTA: Proceed to Order Request]      |  |  - Phone                             |
+--------------------------------------+  |  - Email                             |
                                           |  - Optional: Notes / Preferred contact|
                                           |  - Optional: Delivery location        |
                                           | [CTA: Send Order Request]            |
                                           +--------------------------------------+
```

### Confirmation
```
+----------------------------------------------------------------------------------+
| "Thank you! Your order request has been sent. Solea will contact you to confirm |
| availability and arrange the next steps."                                        |
+----------------------------------------------------------------------------------+
```

### Mobile
```
Product Listing: single-column cards with top sticky filter button
Product Detail: stacked blocks (Gallery → Title/Price → Add to Order → Tabs)
Order List & Request: single-column; Order summary → Contact form → Send
```

---

## School (Cosmetics)

### School Overview (Desktop)
```
+----------------------------------------------------------------------------------+
| [Hero: School] [CTA: View Programs] [CTA: Request Info]                          |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Intro: Accreditation, Outcomes]                                                 |
+----------------------------------------------------------------------------------+
| [Programs Summary Cards]                                                         |
|  ┌────────────────────┬─────────────────────┬─────────────────────┐              |
|  | Program A          | Program B           | Program C           |              |
|  | Duration | Schedule| Requirements | Fees | [Learn more]        |              |
|  └────────────────────┴─────────────────────┴─────────────────────┘              |
+----------------------------------------------------------------------------------+
| [Faculty Profiles] [Facilities Gallery]                                          |
+----------------------------------------------------------------------------------+
| [Events & Calendar]                                                              |
+----------------------------------------------------------------------------------+
```

### Program Page (Desktop)
```
+----------------------------------------------------------------------------------+
| [Program Title] [CTA: Request Info] [CTA: Download Brochure] [CTA: Book Visit]  |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Curriculum Outline] [Duration & Schedule] [Requirements] [Fees/Scholarships]    |
+----------------------------------------------------------------------------------+
| [Faculty] [Facilities] [FAQs]                                                    |
+----------------------------------------------------------------------------------+
```

### Admissions (Desktop) — No Payment
```
+----------------------------------------------------------------------------------+
| [Admissions Process Steps]                                                       |
| Step 1: Application | Step 2: Documents | Step 3: Interview | Step 4: Decision  |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Online Application Form]                                                        |
|  - Name | Email | Phone | Program of Interest | Message                          |
|  - Optional: upload documents                                                    |
| [CTA: Submit Application]                                                        |
+----------------------------------------------------------------------------------+
| [Deadlines] [Contact Admissions]                                                 |
+----------------------------------------------------------------------------------+

Submission behavior: Sends an email notification to the client; staff will contact the applicant. No payment collected online.
```

### Mobile
```
Stacked layout: Hero → CTAs → Programs cards → Faculty → Facilities → Calendar
Program page: Title → CTAs → Sections (accordion for curriculum/requirements)
Admissions: Steps (vertical) → Form → Deadlines → Contact
```

---

## Driving

### Driving Overview (Desktop)
```
+----------------------------------------------------------------------------------+
| [Hero: Driving] [CTA: Request Lessons] [CTA: View Packages]                      |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Licensing Levels Offered] [Vehicle Types] [Instructor Bios]                     |
+----------------------------------------------------------------------------------+
| [Packages & Pricing]                                                             |
+----------------------------------------------------------------------------------+
| [Request Lessons Form]                                                           |
|  - Name | Email | Phone | Preferred dates/times | Message                        |
|  [CTA: Submit Request]                                                           |
+----------------------------------------------------------------------------------+
| [Requirements: Age, Documents] [FAQ & Safety]                                    |
+----------------------------------------------------------------------------------+

Submission behavior: Sends an email notification to the client; staff will contact the user.
```

### Mobile
```
Hero → CTAs → Licensing Levels → Packages → Request Lessons Form → Requirements → FAQs
```

---

## Decoration

### Decoration Overview (Desktop)
```
+----------------------------------------------------------------------------------+
| [Hero: Decoration] [CTA: Request a Quote] [CTA: View Portfolio]                  |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Service Types: Residential | Commercial | Event]                                |
+----------------------------------------------------------------------------------+
| [Process: Consultation → Design → Execution]                                     |
+----------------------------------------------------------------------------------+
| [Pricing/Packages] (informational)                                               |
+----------------------------------------------------------------------------------+
| [Testimonials]                                                                   |
+----------------------------------------------------------------------------------+
```

### Portfolio/Gallery (Desktop)
```
+----------------------------------------------------------------------------------+
| [Filters: Category/Style] [Grid of Projects: Before/After tiles]                 |
+----------------------------------------------------------------------------------+
| [Case Study Modal/Detail: images, description, results]                          |
+----------------------------------------------------------------------------------+
```

### Quote Request Form (Desktop/Mobile)
```
+----------------------------------------------------------------------------------+
| - Name | Email | Phone | Project type | Budget range | Message                   |
| [CTA: Request a Quote]                                                           |
+----------------------------------------------------------------------------------+

Submission behavior: Sends an email notification to the client; staff will contact the user.
```

---

## About
```
+----------------------------------------------------------------------------------+
| [Hero: Solea Story]                                                              |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Mission & Values]                                                               |
+----------------------------------------------------------------------------------+
| [Team Profiles & Photos]                                                         |
+----------------------------------------------------------------------------------+
| [Facilities / Location(s)]                                                       |
+----------------------------------------------------------------------------------+
```

## Contact
```
+----------------------------------------------------------------------------------+
| [Contact Form: Name | Email | Phone | Topic | Message] [CTA: Send]               |
+----------------------------------------------------------------------------------+  ↑ Fold
| [Email] [Phone] [WhatsApp Number (display only)] [Map] [Hours] [Social Links]    |
+----------------------------------------------------------------------------------+

Submission behavior: Sends an email notification to the client; staff will contact the user.
```

## FAQ / Policies
```
+----------------------------------------------------------------------------------+
| [FAQ Tabs: Shop | School | Driving | Decoration | Orders/Shipping/Returns]       |
+----------------------------------------------------------------------------------+
| [Policies: Shipping | Returns & Exchanges | Privacy | Terms | Cookies]           |
+----------------------------------------------------------------------------------+
```

---

## Client Admin (Private)

### Admin Login (not linked publicly)
```
Route: /admin
+--------------------------------------+
| [Logo Solea]                         |
| [Username]                           |
| [Password]                           |
| [CTA: Sign In]                       |
+--------------------------------------+

Security notes:
- Keep hidden from public navigation.
- Strong password policy; consider IP allowlist.
```

### Admin Dashboard
```
+----------------------------------------------------------------------------------+
| [Sidebar: Products | Orders | School Apps | Driving Requests | Deco Leads | CMS] |
+----------------------------------------------------------------------------------+  ↑ Fold
| Products                                                                         |
|  - List: Name | Price | Stock | Visibility | [Edit] [Delete]                     |
|  - [Add Product]: Title, Description, Price, Category, Variants, Stock           |
|  - [Upload Images]: drag & drop, crop tools                                      |
+----------------------------------------------------------------------------------+
| Orders (Order Requests)                                                          |
|  - List: Customer Name | Contact | Items | Notes | Status [New/In Progress]      |
|  - Detail: item summary, contact info, internal notes                            |
+----------------------------------------------------------------------------------+
| School Applications                                                               |
|  - List: Name | Contact | Program | Date | Status                                 |
|  - Export CSV                                                                     |
+----------------------------------------------------------------------------------+
| Driving Requests                                                                  |
|  - List: Name | Contact | Preferred time | Notes | Status                         |
+----------------------------------------------------------------------------------+
| Decoration Leads                                                                  |
|  - List: Name | Contact | Project type | Budget | Notes | Status                  |
+----------------------------------------------------------------------------------+
| CMS (Content Management)                                                          |
|  - Homepage banners, Testimonials, News posts                                     |
|  - Contact email/phone/WhatsApp number settings                                   |
+----------------------------------------------------------------------------------+
```

---

## Key User Flows (Simplified)

```
HOME → Shop → Product Detail → Order List → Order Request (Form) → Confirmation
HOME → School Overview → Program → Admissions (Form) → Confirmation
HOME → Driving Overview → Packages → Request Lessons (Form) → Confirmation
HOME → Decoration Overview → Portfolio → Request a Quote (Form) → Confirmation
HOME → Contact → Form Submit → Thank You
```

---

## Optional Overlays / Utilities

- [Language Toggle FR/EN] in header
- [Cookie Consent] bottom bar
- [Newsletter Modal] on exit intent

---

## Notes for Client Review
- This wireframe prioritizes modern, clear layouts with form-based requests instead of payments.
- All forms generate email notifications for Solea; staff will reach out to users directly.
- WhatsApp will be presented as a number only (no live chat or floating widget).
- The Admin Dashboard is private and allows content and product management without exposing public logins.