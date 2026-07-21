// Cart stored in the browser (localStorage).
// Prices are stored in CENTS to avoid floating point issues (matches Stripe's format).

const CART_KEY = 'aroma_conductor_cart';
const SHIPPING_CENTS = 1000; // flat $10 shipping, mirrored server-side in the Netlify function

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

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

// `custom` is optional: structured selections for bespoke scents,
// passed through to Stripe as order metadata at checkout.
function addToCart(id, name, priceInCents, meta, custom) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price: priceInCents, meta: meta || '', quantity: 1, custom: custom || null });
  }
  saveCart(cart);

  const btn = document.activeElement;
  if (btn && btn.classList && btn.classList.contains('btn')) {
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    setTimeout(() => { btn.textContent = original; }, 1200);
  }
}

function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
  if (typeof renderCartPage === 'function') renderCartPage();
}

function updateQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity = Math.max(1, quantity);
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
