/* Submits the collection sort form as soon as a new order is chosen. */
(() => {
  const form = document.querySelector("[data-sort-form]");
  if (!form) return;
  form.querySelector("[data-sort-submit]")?.classList.add("visually-hidden");
  form.addEventListener("change", () => form.submit());
})();
