const FREE_DELIVERY_LIMIT = 50000;
const DELIVERY_COST = 30000;
const PROMO_CODE = 'SAVE10';
const PROMO_MIN_SUBTOTAL = 20000;
const PROMO_DISCOUNT_RATE = 0.1;

function assertPositiveQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new RangeError('Количество должно быть положительным целым числом');
  }
}

function assertInStock(requested, stock) {
  if (requested > stock) {
    throw new RangeError(`На складе только ${stock} шт.`);
  }
}

function addToCart(cart, product, quantity) {
  assertPositiveQuantity(quantity);
  const existing = cart.find((item) => item.id === product.id);
  const requested = (existing ? existing.quantity : 0) + quantity;
  assertInStock(requested, product.stock);
  if (!existing) return [...cart, { ...product, quantity }];
  return cart.map((item) => (item.id === product.id ? { ...item, quantity: requested } : item));
}

function changeQuantity(cart, productId, quantity) {
  const existing = cart.find((item) => item.id === productId);
  if (!existing) return cart;
  assertPositiveQuantity(quantity);
  assertInStock(quantity, existing.stock);
  return cart.map((item) => (item.id === productId ? { ...item, quantity } : item));
}

function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

function calculateCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateDiscount(subtotal, promoCode) {
  const isPromoApplicable = promoCode === PROMO_CODE && subtotal >= PROMO_MIN_SUBTOTAL;
  return isPromoApplicable ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;
}

function calculateDelivery(subtotal) {
  return subtotal > 0 && subtotal < FREE_DELIVERY_LIMIT ? DELIVERY_COST : 0;
}

function calculateOrderTotal(cart, promoCode) {
  const subtotal = calculateCartSubtotal(cart);
  const discount = calculateDiscount(subtotal, promoCode);
  const delivery = calculateDelivery(subtotal);
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}

const cartApi = { addToCart, changeQuantity, removeFromCart, calculateCartSubtotal, calculateOrderTotal };

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;
