import { allMasterProducts } from './product-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const collectionsData = {
    scented: {
      title: "Scented Candles Collection",
      bannerImg: "assets/scent-candle-5.jpeg",
      desc: "Immerse your living room in calming aromas poured with natural essential oils.",
      products: allMasterProducts.filter(item => item.type === 'scented')
    },
    decorative: {
      title: "Decorative Candles Collection",
      bannerImg: "assets/flower-candle-7.jpeg",
      desc: "Artisanal hand-molded candle sculptures to elevate your interior aesthetics.",
      products: allMasterProducts.filter(item => item.type === 'decorative')
    },
    luxury: {
      title: "Luxury Candles Collection",
      bannerImg: "assets/candle-19.jpeg",
      desc: "Opulent brass and ceramic vessel candles filled with rare fragrance blends.",
      products: allMasterProducts.filter(item => item.type === 'luxury')
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const categoryKey = urlParams.get('category') || 'scented';
  const targetProductId = urlParams.get('product');

  const currentCategoryData = collectionsData[categoryKey] || collectionsData.scented;

  const categoryHeroImg = document.getElementById('categoryHeroImg');
  const categoryTitle = document.getElementById('categoryTitle');
  const categoryDesc = document.getElementById('categoryDesc');
  const exploreProductsGrid = document.getElementById('exploreProductsGrid');
  
  const typeCheckboxes = document.querySelectorAll('.filter-type');
  const priceCheckboxes = document.querySelectorAll('.filter-price');
  const btnResetFilters = document.getElementById('btnResetFilters');

  if (categoryHeroImg) categoryHeroImg.src = currentCategoryData.bannerImg;
  if (categoryTitle) categoryTitle.textContent = currentCategoryData.title;
  if (categoryDesc) categoryDesc.textContent = currentCategoryData.desc;

  let activeProducts = currentCategoryData.products;
  if (targetProductId) {
    activeProducts = activeProducts.filter(item => item.id === targetProductId);
  }

  function updateHeaderBagCount() {
    let cart = JSON.parse(localStorage.getItem('lumiere_cart')) || [];
    const bagCount = document.querySelector('.bag-count');
    if (bagCount) bagCount.textContent = cart.length;
  }

  function attachEventListeners() {
    updateHeaderBagCount();

    // Shop Card Click to Detail Page
    document.querySelectorAll('.explore-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.wishlist-btn') && !e.target.closest('.btn-explore-add-cart')) {
          const productId = card.dataset.id;
          window.location.href = `product.html?id=${productId}`;
        }
      });
    });

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const card = btn.closest('.explore-card');
      const productId = card.dataset.id;
      let wishlist = JSON.parse(localStorage.getItem('lumiere_wishlist')) || [];
      if (wishlist.some(item => item.id === productId)) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        btn.classList.toggle('active');
        
        const product = {
          id: card.dataset.id,
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

    document.querySelectorAll('.btn-explore-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const card = btn.closest('.explore-card');
        const product = {
          id: card.dataset.id,
          name: card.dataset.name,
          price: card.dataset.price,
          img: card.dataset.img
        };

        let cart = JSON.parse(localStorage.getItem('lumiere_cart')) || [];
        cart.push(product);
        localStorage.setItem('lumiere_cart', JSON.stringify(cart));
        updateHeaderBagCount();

        const originalText = btn.textContent;
        btn.textContent = "Added ✓";
        btn.style.backgroundColor = "var(--deep-plum)";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = "";
        }, 1200);
      });
    });
  }

  function renderProducts(list) {
    if (!exploreProductsGrid) return;
    exploreProductsGrid.innerHTML = '';
    
    if (list.length === 0) {
      exploreProductsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--rosewood); padding: 3rem;">No products match your criteria.</p>`;
      return;
    }

    list.forEach(item => {
      const cardHTML = `
        <div class="explore-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}" style="cursor: pointer;">
          <div class="explore-card-img-wrapper">
            <button class="wishlist-btn" aria-label="Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <img src="${item.img}" alt="${item.name}">
          </div>
          <div class="explore-card-body">
            <h4 class="explore-card-title">${item.name}</h4>
            <p class="explore-card-desc">${item.desc}</p>
            <div class="explore-card-footer">
              <span class="explore-card-price">Rs. ${item.price}</span>
              <button class="btn-explore-add-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
      exploreProductsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    attachEventListeners();
  }

  renderProducts(activeProducts);

  function applyFilters() {
    const selectedTypes = Array.from(typeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    const selectedPrices = Array.from(priceCheckboxes).filter(cb => cb.checked).map(cb => cb.value);

    let baseList = currentCategoryData.products;

    let filtered = baseList.filter(item => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
      
      let matchesPrice = true;
      if (selectedPrices.length > 0) {
        matchesPrice = selectedPrices.some(range => {
          if (range === 'under-1800') return item.numericPrice < 1800;
          if (range === '1800-2200') return item.numericPrice >= 1800 && item.numericPrice <= 2200;
          if (range === 'above-2200') return item.numericPrice > 2200;
          return false;
        });
      }
      return matchesType && matchesPrice;
    });

    renderProducts(filtered);
  }

  typeCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
  priceCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      typeCheckboxes.forEach(cb => cb.checked = true);
      priceCheckboxes.forEach(cb => cb.checked = false);
      renderProducts(currentCategoryData.products);
    });
  }
});