"use strict";

const stages = ["Product information", "Customer reviews", "Purchase decision"];
const researcherMode = document.body.dataset.mode === "researcher";
const state = {
  stage: 0,
  choice: null,
  reversed: new URLSearchParams(window.location.search).get("order") === "reversed",
  showBoundaries: true,
};

const app = document.querySelector("#app");
app.innerHTML = `
  <header class="masthead">
    <div class="shell masthead-content">
      <div class="study-identity">
        <span class="course">MGTHN0116</span>
        <span class="study-name">Eye Tracking &amp; Decision Making</span>
      </div>
      ${researcherMode ? '<span class="mode">Researcher preview</span>' : ""}
    </div>
  </header>
  <main class="shell">
    <ol class="progress" aria-label="Experiment stages"></ol>
    <div id="stage"></div>
    ${researcherMode ? `
      <aside class="researcher" aria-labelledby="researcher-title">
        <div class="researcher-top">
          <h2 id="researcher-title">Preview controls</h2>
          <a id="participant-link" href="index.html" target="_blank" rel="noopener">Open participant view</a>
        </div>
        <div class="researcher-controls">
          <label class="stage-picker">Preview stage <select id="preview-stage"></select></label>
          <label><input type="checkbox" id="reverse-order"> Reverse review positions</label>
          <label><input type="checkbox" id="show-boundaries" checked> Show AOI boundaries</label>
          <button class="button small" type="button" id="reset">Reset experiment</button>
        </div>
        <p id="review-order" aria-live="polite"></p>
      </aside>` : ""}
  </main>
`;

const stage = document.querySelector("#stage");
const progress = document.querySelector(".progress");

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function renderProduct() {
  const { product } = stimulus;
  const layout = element("div", "product-layout");
  const figure = element("figure", "product-figure");
  const image = element("img");
  image.src = product.image;
  image.alt = product.imageAlt;
  image.width = 640;
  image.height = 640;
  figure.append(image);

  const details = element("div", "product-details");
  const specs = element("dl", "specs");
  for (const [label, value] of product.specifications) {
    const row = element("div", "spec-row");
    row.append(element("dt", "", label), element("dd", "", value));
    specs.append(row);
  }
  details.append(element("h2", "", product.name), specs);
  layout.append(figure, details);
  stage.append(layout);
}

function reviewOrder() {
  return state.reversed ? ["negative", "positive"] : ["positive", "negative"];
}

function renderReviews() {
  const panels = element("div", "review-layout");
  for (const [index, condition] of reviewOrder().entries()) {
    const panel = element("section", "review-panel");
    panel.setAttribute("aria-label", `Review panel ${index + 1}`);
    if (researcherMode) {
      panel.append(element("span", "condition", `${condition} reviews`));
      panel.classList.toggle("show-boundary", state.showBoundaries);
    }

    const reviews = element("ol", "review-list");
    for (const review of stimulus.reviews[condition]) {
      reviews.append(element("li", "review", review));
    }
    panel.append(reviews);
    panels.append(panel);
  }
  stage.append(panels);
}

function addAction(container, label, onClick, primary = false) {
  const button = element("button", primary ? "button primary" : "button", label);
  button.type = "button";
  button.addEventListener("click", onClick);
  container.append(button);
}

function changeStage(index) {
  state.stage = index;
  state.choice = null;
  render(true);
}

function render(focusHeading = false) {
  const complete = state.choice !== null;
  progress.replaceChildren(...stages.map((label, index) => {
    const step = element("li", "step");
    if (index === state.stage && !complete) step.setAttribute("aria-current", "step");
    const number = element("span", "step-number", String(index + 1));
    number.setAttribute("aria-hidden", "true");
    step.append(number, element("span", "", label));
    return step;
  }));
  stage.replaceChildren();

  const heading = element("h1", "", complete ? "Demo complete" : stages[state.stage]);
  heading.tabIndex = -1;
  const intro = element("div", !complete && state.stage === 1 ? "stage-intro reviews-intro" : "stage-intro");
  intro.append(heading);
  stage.append(intro);

  if (complete) {
    intro.append(element("p", "", "Thank you for completing the demo."));
  } else if (state.stage === 0) {
    intro.append(element("p", "", "Review the smartphone specifications below."));
    renderProduct();
  } else if (state.stage === 1) {
    intro.append(element("p", "", "The panels below contain fictional demo reviews."));
    renderReviews();
  } else {
    const decision = element("div", "decision");
    decision.append(element("h2", "", "Would you consider purchasing this smartphone?"));
    const choices = element("div", "choice-buttons");
    for (const choice of ["Yes", "No"]) {
      addAction(choices, choice, () => {
        state.choice = choice;
        render(true);
      });
    }
    decision.append(choices);
    stage.append(decision);
  }

  if (!complete && state.stage < 2) {
    const actions = element("div", "stage-actions");
    addAction(actions, "Next", () => changeStage(state.stage + 1), true);
    stage.append(actions);
  }

  if (researcherMode) updateResearcherControls();
  if (focusHeading) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function updateResearcherControls() {
  const [left, right] = reviewOrder();
  document.querySelector("#review-order").textContent = `Demo order · ${left} on the left · ${right} on the right`;
  document.querySelector("#participant-link").href = state.reversed ? "index.html?order=reversed" : "index.html";
  document.querySelector("#preview-stage").value = String(state.stage);
}

if (researcherMode) {
  const picker = document.querySelector("#preview-stage");
  for (const [index, label] of stages.entries()) {
    const option = element("option", "", label);
    option.value = String(index);
    picker.append(option);
  }
  picker.addEventListener("change", () => changeStage(Number(picker.value)));

  const reverse = document.querySelector("#reverse-order");
  reverse.checked = state.reversed;
  reverse.addEventListener("change", () => {
    state.reversed = reverse.checked;
    render();
  });

  const boundaries = document.querySelector("#show-boundaries");
  boundaries.addEventListener("change", () => {
    state.showBoundaries = boundaries.checked;
    render();
  });

  document.querySelector("#reset").addEventListener("click", () => changeStage(0));
}

render();
