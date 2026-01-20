/* ==========================================
   PRODUCT DETAIL PAGE - ADDITIONAL JAVASCRIPT
   ==========================================
   
   Loads product data from API and handles
   product detail page interactions
   
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ==================== LOAD PRODUCT FROM API ====================
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    loadProductDetails(productId);
  }

  async function loadProductDetails(id) {
    try {
      const response = await fetch("/api/products/" + id);
      if (!response.ok) {
        console.error("Product not found");
        return;
      }

      const data = await response.json();
      const product = data.product;
      const currencySymbol = data.currency?.symbol || "€";

      if (product) {
        updateProductPage(product, currencySymbol);
        loadRecommendedProducts(product.category, product.id, currencySymbol);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    }
  }

  function updateProductPage(product, currencySymbol) {
    // Update title
    const titleEl = document.querySelector(".product-title");
    if (titleEl) titleEl.textContent = product.name;

    // Update document title
    document.title = product.name + " - Solea";

    // Update breadcrumb
    const breadcrumb = document.getElementById("product-breadcrumb");
    if (breadcrumb) breadcrumb.textContent = product.name;

    // Update main image
    const mainImage = document.getElementById("main-product-image");
    if (mainImage && product.images && product.images.length > 0) {
      mainImage.src = product.images[0];
      mainImage.alt = product.name;
    }

    // Update thumbnails
    const thumbnailGallery = document.querySelector(".thumbnail-gallery");
    if (thumbnailGallery && product.images) {
      thumbnailGallery.innerHTML = product.images
        .map(function (img, index) {
          return (
            '<button class="thumbnail' +
            (index === 0 ? " active" : "") +
            '" data-image="' +
            img +
            '">' +
            '<img src="' +
            img +
            '" alt="Vue ' +
            (index + 1) +
            '">' +
            "</button>"
          );
        })
        .join("");

      setupThumbnailHandlers();
    }

    // Update price
    const priceEl = document.querySelector(".product-price.large");
    if (priceEl)
      priceEl.textContent = product.price.toFixed(2) + currencySymbol;

    // Update description
    const descEl = document.querySelector(".product-short-description p");
    if (descEl)
      descEl.textContent = product.longDescription || product.description || "";

    // Update rating
    const starsEl = document.querySelector(".product-meta .stars");
    if (starsEl) {
      starsEl.textContent =
        "★".repeat(product.rating || 5) + "☆".repeat(5 - (product.rating || 5));
    }

    const reviewCountEl = document.querySelector(".product-meta .rating-count");
    if (reviewCountEl)
      reviewCountEl.textContent = "(" + (product.reviewCount || 0) + " avis)";

    // Update SKU
    const skuEl = document.querySelector(".sku");
    if (skuEl) skuEl.textContent = "SKU: " + (product.sku || "N/A");

    // Update variants
    const variantOptions = document.querySelector(".variant-options");
    if (variantOptions && product.variants && product.variants.length > 0) {
      variantOptions.innerHTML = product.variants
        .map(function (variant, index) {
          return (
            '<button class="variant-btn' +
            (index === 0 ? " active" : "") +
            '" data-variant="' +
            variant.name +
            '" data-price="' +
            variant.price +
            '">' +
            variant.name +
            "</button>"
          );
        })
        .join("");

      // Update price to first variant
      if (priceEl && product.variants[0]) {
        priceEl.textContent =
          product.variants[0].price.toFixed(2) + currencySymbol;
      }

      setupVariantHandlers(currencySymbol);
    }

    // Update badge
    const badgeEl = document.querySelector(".main-image .product-badge");
    if (badgeEl) {
      if (product.special && product.special.length > 0) {
        var badgeLabels = {
          new: "Nouveau",
          bestseller: "Bestseller",
          bio: "Bio",
        };
        badgeEl.textContent =
          badgeLabels[product.special[0]] || product.special[0];
        badgeEl.className = "product-badge " + product.special[0];
        badgeEl.style.display = "inline-block";
      } else {
        badgeEl.style.display = "none";
      }
    }

    // Update benefits
    const benefitsList = document.querySelector("#benefits .benefits-list");
    if (benefitsList && product.benefits && product.benefits.length > 0) {
      benefitsList.innerHTML = product.benefits
        .map(function (benefit) {
          return (
            '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
            benefit +
            "</li>"
          );
        })
        .join("");
    }

    // Update ingredients
    const ingredientsFull = document.querySelector(".ingredients-full");
    if (ingredientsFull && product.ingredients) {
      ingredientsFull.innerHTML =
        "<strong>Composition complète (INCI):</strong><br>" +
        product.ingredients;
    }

    // Update certifications
    const certContainer = document.querySelector(".product-certifications");
    if (
      certContainer &&
      product.certifications &&
      product.certifications.length > 0
    ) {
      certContainer.innerHTML = product.certifications
        .map(function (cert) {
          return '<span class="cert-badge">' + cert + "</span>";
        })
        .join("");
    }

    // Store product data for add to cart
    var addToCartBtn = document.querySelector(".add-to-order");
    if (addToCartBtn) {
      addToCartBtn.dataset.productId = product.id;
      addToCartBtn.dataset.productName = product.name;
      addToCartBtn.dataset.productImage = product.images?.[0] || "";

      addToCartBtn.addEventListener("click", function (e) {
        e.preventDefault();

        var cart = JSON.parse(localStorage.getItem("soleaCart")) || [];
        var quantity = parseInt(
          document.getElementById("quantity")?.value || 1,
        );
        var activeVariant = document.querySelector(".variant-btn.active");
        var price = activeVariant
          ? parseFloat(activeVariant.dataset.price)
          : product.price;
        var variant = activeVariant ? activeVariant.dataset.variant : "";

        var existingItem = cart.find(function (item) {
          return item.id === product.id && item.variant === variant;
        });

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: price,
            image: product.images?.[0] || "images/placeholder.jpg",
            quantity: quantity,
            variant: variant,
          });
        }

        localStorage.setItem("soleaCart", JSON.stringify(cart));

        // Update cart count
        var cartCounts = document.querySelectorAll(".cart-count");
        var totalItems = cart.reduce(function (sum, item) {
          return sum + item.quantity;
        }, 0);
        cartCounts.forEach(function (el) {
          el.textContent = totalItems;
        });

        // Visual feedback
        var originalText = this.innerHTML;
        this.innerHTML = "✓ Ajouté !";
        this.style.backgroundColor = "#28a745";

        var cartIcon = document.querySelector(".cart-icon");
        if (cartIcon) {
          cartIcon.style.transform = "scale(1.3)";
          setTimeout(function () {
            cartIcon.style.transform = "scale(1)";
          }, 300);
        }

        var btn = this;
        setTimeout(function () {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = "";
        }, 2000);
      });
    }
  }

  function setupThumbnailHandlers() {
    var thumbnails = document.querySelectorAll(".thumbnail");
    var mainImage = document.getElementById("main-product-image");

    thumbnails.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var imageUrl = this.dataset.image;
        if (mainImage) mainImage.src = imageUrl;

        thumbnails.forEach(function (t) {
          t.classList.remove("active");
        });
        this.classList.add("active");
      });
    });
  }

  function setupVariantHandlers(currencySymbol) {
    var variantButtons = document.querySelectorAll(".variant-btn");
    var priceEl = document.querySelector(".product-price.large");

    variantButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        variantButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        this.classList.add("active");

        if (priceEl) {
          priceEl.textContent =
            parseFloat(this.dataset.price).toFixed(2) + currencySymbol;
        }
      });
    });
  }

  function loadRecommendedProducts(category, currentProductId, currencySymbol) {
    fetch("/api/products")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var products = data.products || [];
        // Filter: same category, exclude current product, only visible items
        var recommended = products
          .filter(function (p) {
            return (
              p.category === category &&
              p.id !== currentProductId &&
              p.visible !== false
            );
          })
          .slice(0, 4);

        if (recommended.length === 0) {
          // If no products in same category, show any other products
          var altProducts = products
            .filter(function (p) {
              return p.id !== currentProductId && p.visible !== false;
            })
            .slice(0, 4);
          displayRecommendedProducts(altProducts, currencySymbol);
        } else {
          displayRecommendedProducts(recommended, currencySymbol);
        }
      })
      .catch(function (error) {
        console.error("Error loading recommended products:", error);
      });
  }

  function displayRecommendedProducts(products, currencySymbol) {
    var carousel = document.getElementById("recommended-products-carousel");
    if (!carousel) return;

    if (products.length === 0) {
      carousel.innerHTML =
        '<p style="padding: 2rem; text-align: center;">Aucun produit recommandé</p>';
      return;
    }

    carousel.innerHTML = products
      .map(function (product) {
        var images = product.images || [];
        var imageSrc = "/images/placeholder.jpg";

        // Handle both string and object image formats
        if (images.length > 0) {
          if (typeof images[0] === "string") {
            imageSrc = images[0].startsWith("/") ? images[0] : "/" + images[0];
          } else if (typeof images[0] === "object" && images[0].path) {
            imageSrc = images[0].path.startsWith("/")
              ? images[0].path
              : "/" + images[0].path;
          }
        }

        var badgeHtml = "";
        if (product.special && product.special.length > 0) {
          var badgeLabels = {
            new: "Nouveau",
            bestseller: "Bestseller",
            bio: "Bio",
            sale: "Promo",
          };
          badgeHtml =
            '<span class="product-badge ' +
            product.special[0] +
            '">' +
            (badgeLabels[product.special[0]] || product.special[0]) +
            "</span>";
        }

        var stars = "";
        var rating = product.rating || 0;
        stars += "★".repeat(Math.floor(rating));
        if (rating % 1 !== 0) stars += "☆";
        stars += "☆".repeat(5 - Math.ceil(rating));

        return (
          '<div class="product-card" data-product-id="' +
          product.id +
          '">' +
          '<div class="product-image">' +
          '<a href="product-detail.html?id=' +
          product.id +
          '">' +
          '<img src="' +
          imageSrc +
          '" alt="' +
          product.name +
          '" />' +
          "</a>" +
          badgeHtml +
          "</div>" +
          '<div class="product-info">' +
          '<a href="product-detail.html?id=' +
          product.id +
          '">' +
          "<h4>" +
          product.name +
          "</h4>" +
          "</a>" +
          '<div class="product-rating">' +
          '<span class="stars">' +
          stars +
          "</span>" +
          '<span class="rating-count">(' +
          (product.reviewCount || 0) +
          ")</span>" +
          "</div>" +
          '<p class="product-price">' +
          product.price.toFixed(2) +
          currencySymbol +
          "</p>" +
          '<button class="btn btn-small btn-primary add-to-cart-btn" data-product=\'' +
          JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price,
            images: [imageSrc],
          }).replace(/'/g, "&#39;") +
          "'>" +
          "Ajouter à la Liste" +
          "</button>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    // Setup carousel navigation
    setupCarouselNavigation();

    // Setup add to cart buttons for recommended products using the same handler
    setupDynamicAddToCart();
  }

  function setupCarouselNavigation() {
    var container = document.querySelector(".related-products");
    if (!container) return;

    var prevBtn = container.querySelector(".carousel-btn.prev");
    var nextBtn = container.querySelector(".carousel-btn.next");
    var carousel = container.querySelector(".carousel-track");

    if (!carousel) return;

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        carousel.scrollBy({ left: -300, behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        carousel.scrollBy({ left: 300, behavior: "smooth" });
      });
    }
  }

  function setupDynamicAddToCart() {
    document.querySelectorAll(".add-to-cart-btn").forEach(function (button) {
      // Remove existing listeners to avoid duplicates
      var newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    });

    document.querySelectorAll(".add-to-cart-btn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        try {
          var productData = JSON.parse(
            this.dataset.product.replace(/&#39;/g, "'"),
          );

          // Add to cart
          SoleaAPI.addToCart(productData, 1);

          // Visual feedback
          var originalText = this.textContent;
          this.textContent = "Ajouté !";
          this.style.backgroundColor = "#28a745";

          var btn = this;
          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
          }, 2000);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      });
    });
  }

  // ==================== ZOOM ON HOVER FOR MAIN IMAGE ====================
  const mainImage = document.querySelector(".main-image");

  if (mainImage) {
    const img = mainImage.querySelector("img");

    mainImage.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      if (img) {
        img.style.transformOrigin = xPercent + "% " + yPercent + "%";
        img.style.transform = "scale(1.5)";
      }
    });

    mainImage.addEventListener("mouseleave", function () {
      if (img) img.style.transform = "scale(1)";
    });
  }

  // ==================== QUANTITY CONTROLS ====================
  const minusBtn = document.querySelector(".qty-btn.minus");
  const plusBtn = document.querySelector(".qty-btn.plus");
  const quantityInput = document.getElementById("quantity");

  if (minusBtn && plusBtn && quantityInput) {
    minusBtn.addEventListener("click", function () {
      let value = parseInt(quantityInput.value);
      if (value > 1) {
        quantityInput.value = value - 1;
      }
    });

    plusBtn.addEventListener("click", function () {
      let value = parseInt(quantityInput.value);
      const max = parseInt(quantityInput.max) || 10;
      if (value < max) {
        quantityInput.value = value + 1;
      }
    });
  }

  // ==================== PRODUCT TABS ====================
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  if (tabButtons.length > 0) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const tabId = this.dataset.tab;

        tabButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        this.classList.add("active");

        tabPanels.forEach(function (panel) {
          panel.classList.remove("active");
          if (panel.id === tabId) {
            panel.classList.add("active");
          }
        });
      });
    });
  }

  // ==================== FAQ ACCORDION ====================
  const faqQuestions = document.querySelectorAll(".faq-question");

  if (faqQuestions.length > 0) {
    faqQuestions.forEach(function (question) {
      question.addEventListener("click", function () {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach(function (item) {
          item.classList.remove("active");
        });

        if (!isActive) {
          faqItem.classList.add("active");
        }
      });
    });
  }

  // ==================== REVIEW HELPFUL BUTTONS ====================
  const helpfulButtons = document.querySelectorAll(".review-helpful button");

  helpfulButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const currentText = this.textContent;
      const match = currentText.match(/\((\d+)\)/);

      if (match) {
        const count = parseInt(match[1]) + 1;
        this.textContent = "👍 Utile (" + count + ")";
        this.disabled = true;
        this.style.opacity = "0.6";
      }
    });
  });

  // ==================== WISHLIST BUTTON ====================
  const wishlistBtn = document.querySelector(".wishlist");

  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", function () {
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        this.style.color = "#e74c3c";
      } else {
        this.style.color = "";
      }
    });
  }
});
