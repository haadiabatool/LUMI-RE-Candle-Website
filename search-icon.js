import { allMasterProducts } from './product-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('button[aria-label="Search"]');
  const searchModal = document.getElementById('searchModal');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInputField = document.getElementById('searchInputField');
  const searchResultsGrid = document.getElementById('searchResultsGrid');

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      searchInputField.focus();
    });
  }

  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', () => {
      searchModal.classList.remove('active');
      searchInputField.value = '';
      resetSearchList();
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      resetSearchList();
    }
  });

  function resetSearchList() {
    searchResultsGrid.innerHTML = `<p class="search-placeholder-text">Type a candle name to search...</p>`;
  }

  if (searchInputField) {
    searchInputField.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query === '') {
        resetSearchList();
        return;
      }

      const filtered = allMasterProducts.filter(item => 
        item.name.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        searchResultsGrid.innerHTML = `<p class="search-placeholder-text">No candles found matching "${query}".</p>`;
        return;
      }

      searchResultsGrid.innerHTML = '';
      filtered.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'search-name-item';
        itemEl.textContent = `${item.name} — Rs. ${item.price}`;
        itemEl.style.cssText = "padding: 12px 16px; background: #fff; border: 1px solid rgba(216,167,167,0.3); border-radius: 6px; cursor: pointer; font-family: var(--font-heading, Georgia, serif); color: var(--deep-plum); transition: background 0.2s;";
        
        itemEl.onmouseover = () => itemEl.style.background = "var(--soft-cream, #FFF7EF)";
        itemEl.onmouseout = () => itemEl.style.background = "#fff";

        itemEl.addEventListener('click', () => {
          searchModal.classList.remove('active');
          searchInputField.value = '';
          resetSearchList();

          const targetCard = document.querySelector(`[data-id="${item.id}"]`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.boxShadow = "0 0 15px var(--rosewood)";
            setTimeout(() => targetCard.style.boxShadow = "", 2000);
          } else {
            // Redirect to shop page with Category AND specific Product ID
            window.location.href = `shop.html?category=${item.type}&product=${item.id}`;
          }
        });

        searchResultsGrid.appendChild(itemEl);
      });
    });
  }
});