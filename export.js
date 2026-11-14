"use strict";

// Uses the same stimulus data and panel renderer as the browser demonstration.
async function renderExport() {
  const phone = params.get("phone");
  state.trial = phone === null ? 0 : stimuli.findIndex(item => item.id === phone);
  state.compact = params.get("count") === "3";
  const status = element("p", "export-status", "Checking fixed stimulus…");
  status.setAttribute("role", "status");

  if (state.trial === -1) {
    status.dataset.fit = "overflow";
    status.textContent = `Unknown phone: ${phone}`;
    app.replaceChildren(status);
    return;
  }

  const productScreen = params.get("screen") === "product";
  app.replaceChildren(status, stage);
  stage.className = "export-frame";
  stage.append(element("h1", "", productScreen ? "Product information" : "Customer reviews"));
  if (productScreen) renderProduct();
  else renderReviews();

  await document.fonts.ready;
  const productImage = stage.querySelector("img");
  const issues = [];
  if (productImage) {
    try {
      await productImage.decode();
    } catch {
      issues.push("product image could not be loaded");
    }
  }

  const overflows = node => node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth;
  if (overflows(stage)) issues.push("content exceeds the 1024 × 768 image");
  if (productScreen) {
    const product = stage.querySelector(".product-layout");
    if (overflows(product)) issues.push("product details exceed their available area");
  } else {
    for (const { position, valence } of reviewOrder()) {
      const panel = stage.querySelector(`[data-position="${position.toLowerCase()}"]`);
      const reviews = [...panel.querySelectorAll(".review")];
      const expected = state.compact ? 3 : 10;
      if (reviews.length !== expected) issues.push(`${position} AOI needs ${expected} reviews (found ${reviews.length})`);
      if (overflows(panel) || overflows(panel.querySelector(".review-list"))) issues.push(`${position} AOI exceeds its fixed area`);
      for (const [index, review] of reviews.entries()) {
        if (overflows(review)) issues.push(`${position} AOI (${valence}), review ${index + 1} exceeds its row`);
      }
    }
  }

  status.dataset.fit = issues.length ? "overflow" : "ok";
  status.textContent = issues.length
    ? `Export blocked · ${issues.join(" · ")}`
    : `1024 × 768 · ${stimuli[state.trial].product.name} · ${productScreen ? "Product information" : reviewOrder().map(({ position, valence }) => `${position} AOI = ${valence}`).join(" · ")} · Content fits`;
}
