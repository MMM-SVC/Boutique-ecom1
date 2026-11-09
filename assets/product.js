/*
 * Product page enhancements:
 * - swaps the native variant <select> for option "pills" and keeps the
 *   hidden select, price, add-to-cart button and URL in sync;
 * - wires the quantity − / + buttons.
 * Without JavaScript the native select and number input still work.
 */
(() => {
  const root = document.querySelector("[data-product]");
  if (!root) return;

  const quantity = root.querySelector("[data-quantity]");
  if (quantity) {
    const input = quantity.querySelector("input");
    quantity.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const step = button.hasAttribute("data-quantity-plus") ? 1 : -1;
      const next = Math.max(1, (parseInt(input.value, 10) || 1) + step);
      input.value = String(next);
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  const dataElement = root.querySelector("[data-product-json]");
  const picker = root.querySelector("[data-variant-picker]");
  const select = root.querySelector("[data-variant-select]");
  if (!dataElement || !picker || !select) return;

  const data = JSON.parse(dataElement.textContent);
  const priceContainer = root.querySelector("[data-price]");
  const button = root.querySelector("[data-add-to-cart]");
  const selectWrapper = root.querySelector("[data-variant-select-wrapper]");

  picker.hidden = false;
  selectWrapper?.classList.add("visually-hidden");

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

  function selectedOptions() {
    return Array.from(picker.querySelectorAll("fieldset")).map((fieldset) => {
      const checked = fieldset.querySelector("input:checked");
      return checked ? checked.value : null;
    });
  }

  function renderPrice(variant) {
    if (!priceContainer) return;
    const onSale = Boolean(variant.compareHtml);
    priceContainer.innerHTML = `
      <div class="price price--large${onSale ? " price--sale" : ""}">
        ${onSale ? `<span class="visually-hidden">${escapeHtml(data.labels.salePrice)}</span>` : ""}
        <span class="price__current">${variant.priceHtml}</span>
        ${
          onSale
            ? `<span class="visually-hidden">${escapeHtml(data.labels.regularPrice)}</span><s class="price__compare">${variant.compareHtml}</s>`
            : ""
        }
      </div>`;
  }

  function update() {
    const options = selectedOptions();

    picker.querySelectorAll("fieldset").forEach((fieldset, index) => {
      const label = fieldset.querySelector("[data-selected-value]");
      if (label) label.textContent = options[index] ?? "";
    });

    const variant = data.variants.find((candidate) =>
      candidate.options.every((value, index) => value === options[index]),
    );

    if (!variant) {
      button.disabled = true;
      button.textContent = data.labels.unavailable;
      return;
    }

    select.value = String(variant.id);
    button.disabled = !variant.available;
    button.textContent = variant.available ? data.labels.addToCart : data.labels.soldOut;
    renderPrice(variant);

    const url = new URL(window.location.href);
    url.searchParams.set("variant", variant.id);
    window.history.replaceState({}, "", url);
  }

  picker.addEventListener("change", update);
})();
