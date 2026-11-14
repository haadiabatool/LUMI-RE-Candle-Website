document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('is-active');
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !mobileToggle.contains(event.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('is-active');
      }
    });
  }
});

// Carousel Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;

    const updateSlider = () => {
      const card = track.querySelector('.product-card');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      
      const moveDistance = (cardWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${moveDistance}px)`;

      const totalCards = track.querySelectorAll('.product-card').length;
      let visibleCards = 4;

      if (window.innerWidth <= 500) visibleCards = 1;
      else if (window.innerWidth <= 768) visibleCards = 2;
      else if (window.innerWidth <= 1200) visibleCards = 3;

      const maxIndex = totalCards - visibleCards;

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    };

    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateSlider();
    });

    window.addEventListener('resize', updateSlider);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  function updateHeaderCounts() {
    let cart = JSON.parse(localStorage.getItem('lumiere_cart')) || [];
    const bagCount = document.querySelector('.bag-count');
    if (bagCount) {
      bagCount.textContent = cart.length;
    }
  }

  updateHeaderCounts();

  // Bestsellers Card Click to Detail Page
  document.querySelectorAll('.bestsellers-section .product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.wishlist-btn') && !e.target.closest('.btn-add-cart')) {
        const productId = card.dataset.id;
        window.location.href = `product.html?id=${productId}`;
      }
    });
  });

  // Bestsellers Wishlist Heart Toggle
  const bestsellersWishlistBtns = document.querySelectorAll('.bestsellers-section .wishlist-btn');
  
  bestsellersWishlistBtns.forEach(btn => {
    const card = btn.closest('.product-card');
    const productId = card.dataset.id;

    let wishlist = JSON.parse(localStorage.getItem('lumiere_wishlist')) || [];
    if (wishlist.some(item => item.id === productId)) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click redirect
      e.preventDefault();
      btn.classList.toggle('active');

      const product = {
        id: productId,
        name: card.dataset.name,
        price: card.dataset.price,
        img: card.dataset.img
      };

      let currentWishlist = JSON.parse(localStorage.getItem('lumiere_wishlist')) || [];
      const exists = currentWishlist.some(item => item.id === product.id);

      if (btn.classList.contains('active')) {
        if (!exists) currentWishlist.push(product);
      } else {
        currentWishlist = currentWishlist.filter(item => item.id !== product.id);
      }
      localStorage.setItem('lumiere_wishlist', JSON.stringify(currentWishlist));
    });
  });

  // Bestsellers Add to Cart
  const bestsellersAddToCartBtns = document.querySelectorAll('.bestsellers-section .btn-add-cart');

  bestsellersAddToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click redirect
      e.preventDefault();
      const card = btn.closest('.product-card');
      
      const product = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: card.dataset.price,
        img: card.dataset.img
      };

      let cart = JSON.parse(localStorage.getItem('lumiere_cart')) || [];
      cart.push(product);
      localStorage.setItem('lumiere_cart', JSON.stringify(cart));
      
      updateHeaderCounts();

      const originalText = btn.textContent;
      btn.textContent = "Added ✓";
      btn.style.backgroundColor = "var(--deep-plum)";
      btn.style.color = "var(--soft-cream)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1200);
    });
  });
});