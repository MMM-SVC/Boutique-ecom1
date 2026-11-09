/*
 * Cart page enhancements: quantity − / + buttons and automatic form
 * submission when a quantity changes (debounced). Without JavaScript the
 * "Update" button still submits the form.
 */
(() => {
  const form = document.querySelector("[data-cart-form]");
  if (!form) return;

  let timer;
  const submitSoon = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      form.setAttribute("aria-busy", "true");
      form.requestSubmit(form.querySelector("[data-cart-update]") ?? undefined);
    }, 500);
  };

  form.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quantity-minus], [data-quantity-plus]");
    if (!button) return;
    const input = button.closest("[data-quantity]").querySelector("input");
    const step = button.hasAttribute("data-quantity-plus") ? 1 : -1;
    input.value = String(Math.max(0, (parseInt(input.value, 10) || 0) + step));
    submitSoon();
  });

  form.addEventListener("change", (event) => {
    if (event.target.matches("[data-quantity] input")) submitSoon();
  });

  form.querySelectorAll("[data-cart-update]").forEach((button) => {
    button.classList.add("visually-hidden");
  });
})();
