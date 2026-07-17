// Simple cart stored in the browser (localStorage).
// Prices are stored in CENTS to avoid floating point issues (matches Stripe's format).

const CART_KEY = 'aroma_conductor_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, name, priceInCents, meta) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price: priceInCents, meta: meta || '', quantity: 1 });
  }
  saveCart(cart);

  const btn = document.activeElement;
  if (btn && btn.classList && btn.classList.contains('add-cart')) {
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = original; }, 1200);
  }
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}

function updateQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  document.querySelectorAll('.cart-count').forEach((el) => {
    el.textContent = cartCount();
  });
}

document.addEventListener('DOMContentLoaded', updateCartCount);
