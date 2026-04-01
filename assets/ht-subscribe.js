// assets/ht-subscribe.js
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.shopify_subscriptions_app_block');
  if (!blocks.length) return;

  // Helper: read current multiplier from the Pack Size buttons
  function getMultiplier() {
    const active = document.querySelector('[data-ht-packsize] .ht-packsize-option.is-active');
    if (!active) return 1;
    const val = parseInt(active.getAttribute('data-multiplier'), 10);
    return isNaN(val) ? 1 : val;
  }

  // Helper: "$16.00 USD" -> 1600
  function parsePrice(str) {
    if (!str) return null;
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return null;
    return Math.round(num * 100);
  }

  // Helper: 1600 -> "$16.00 USD"
  function formatPrice(cents) {
    return '$' + (cents / 100).toFixed(2) + ' USD';
  }

  blocks.forEach((block) => {
    const oneTimeInput = block.querySelector('input[data-radio-type="one_time_purchase"]');
    const oneTimeRow = oneTimeInput?.closest('.shopify_subscriptions_purchase_option_wrapper');
    const oneTimePriceEl = oneTimeRow?.querySelector('.shopify_subscriptions_in_widget_price');

    const subPriceEl = block.querySelector('.allocation_price');

    if (!oneTimePriceEl || !subPriceEl) return;

    // Store the base (single-unit) prices
    const baseOneCents = parsePrice(oneTimePriceEl.textContent);
    const baseSubCents = parsePrice(subPriceEl.textContent);

    if (baseOneCents == null || baseSubCents == null) return;

    function updatePrices() {
      const mult = getMultiplier();
      oneTimePriceEl.textContent = formatPrice(baseOneCents * mult);
      subPriceEl.textContent = formatPrice(baseSubCents * mult);
    }

    // Initial render
    updatePrices();

    // Recalculate whenever pack size buttons are clicked
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-ht-packsize] .ht-packsize-option');
      if (!btn) return;
      // Let the pack script flip the .is-active class first
      setTimeout(updatePrices, 0);
    });
  });
});
