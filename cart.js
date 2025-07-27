// Cart utility functions using localStorage

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, i) => total + i.qty, 0);
  const cartCountEls = document.querySelectorAll('#cart-count');
  cartCountEls.forEach(el => el.textContent = count);
}

// Shop page: Add to Cart buttons
function setupAddToCart() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: parseFloat(btn.getAttribute('data-price'))
      };
      addToCart(item);
      alert(`Added ${item.name} to cart!`);
    });
  });
}

// Cart page: Render cart
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalDiv = document.getElementById('cart-total');
  if (!cartItemsDiv || !cartTotalDiv) return;

  const cart = getCart();
  cartItemsDiv.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    cartItemsDiv.textContent = 'Your cart is empty.';
    cartTotalDiv.textContent = '';
    return;
  }
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span>
        <strong>${item.name}</strong> - $${item.price.toFixed(2)} 
        <small>(x${item.qty})</small>
      </span>
      <button data-id="${item.id}">Remove</button>
    `;
    itemDiv.querySelector('button').addEventListener('click', () => {
      removeFromCart(item.id);
      renderCart();
    });
    cartItemsDiv.appendChild(itemDiv);
    total += item.price * item.qty;
  });
  cartTotalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  setupAddToCart();
  renderCart();

  // Cart page: Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Checkout is not implemented yet.');
    });
  }
});
