"use strict";

const stages = ["Fixation", "Product information", "Customer reviews", "Purchase decision"];
const durations = [5000, 8000];
const positionNames = ["Left", "Right"];
const params = new URLSearchParams(window.location.search);
const researcherMode = document.body.dataset.mode === "researcher";
const exportMode = document.body.dataset.mode === "export";
const state = {
  stage: -1,
  trial: 0,
  trialLimit: stimuli.length,
  responses: [],
  playing: false,
  reversed: params.get("order") === "reversed",
  showBoundaries: true,
  compact: false,
};
let timer;

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
          <label>Preview phone <select id="preview-trial"></select></label>
          <label>Preview stage <select id="preview-stage"><option value="-1">Session overview</option></select></label>
          <label>Review layout <select id="review-layout"><option value="standard">A · Positive left</option><option value="reversed">B · Negative left</option></select></label>
          <label><input type="checkbox" id="show-boundaries" checked> Show AOI boundaries</label>
          <label>Reviews per panel <select id="review-count"><option value="10">10</option><option value="3">3 (short demo)</option></select></label>
          <button class="button small" type="button" id="reset">Reset experiment</button>
        </div>
        <p id="review-order" aria-live="polite"></p>
        <p class="research-note"><a id="static-link" target="_blank" rel="noopener">Check the fixed 1024 × 768 review stimulus</a></p>
        <details class="research-note">
          <summary>Study procedure and demo adaptations</summary>
          <p>Chen et al. used four separate phone trials in randomized order, 5-second fixation, 8-second product viewing, self-paced reviews, and one purchase response per phone. Ten reviews occupied each of two equal areas of interest (AOIs), with valence swapped between participant groups.</p>
          <p>This web demo uses a fixed phone order, fictional stimuli, manually selected layouts and buttons. Figure 2B shows Chinese positive and negative headings above the review columns. We omit those headings from the participant stimuli and show them as researcher annotations. Browser timing is illustrative. The demo collects no gaze data. <a href="https://doi.org/10.3389/fpsyg.2022.865702" target="_blank" rel="noopener">Chen et al. (2022)</a></p>
        </details>
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
  const { product } = stimuli[state.trial];
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
  const valences = state.reversed ? ["negative", "positive"] : ["positive", "negative"];
  return positionNames.map((position, index) => ({ position, valence: valences[index] }));
}

function renderReviews() {
  const panels = element("div", "review-layout");
  for (const { position, valence } of reviewOrder()) {
    const panel = element("section", "review-panel");
    panel.setAttribute("aria-label", `${position} review panel`);
    panel.dataset.position = position.toLowerCase();
    if (researcherMode) {
      panel.append(element("span", "condition", `${position} AOI · ${valence} reviews`));
      panel.classList.toggle("show-boundary", state.showBoundaries);
    }

    const reviews = element("ol", "review-list");
    const entries = stimuli[state.trial].reviews[valence];
    for (const review of state.compact ? entries.slice(0, 3) : entries) {
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
  window.clearTimeout(timer);
  state.stage = index;
  render(true);
  if (state.playing && index >= 0 && index < durations.length) {
    timer = window.setTimeout(() => changeStage(index + 1), durations[index]);
  }
}

function startSession(trialLimit) {
  state.trial = trialLimit === 1 ? Number(document.querySelector("#preview-trial").value) : 0;
  state.trialLimit = trialLimit;
  state.responses = [];
  state.playing = true;
  changeStage(0);
}

function recordResponse(choice) {
  if (!state.playing) {
    changeStage(4);
    return;
  }

  state.responses.push({ phone: stimuli[state.trial].id, choice });
  if (state.responses.length === state.trialLimit) {
    state.playing = false;
    changeStage(4);
    return;
  }
  state.trial += 1;
  changeStage(0);
}

function renderOverview(intro) {
  intro.append(element("p", "", "You will view four smartphones, one at a time. After reading each phone’s reviews, decide whether you would buy that phone."));
  intro.append(element("p", "", "This presentation uses fictional demo materials."));
  const actions = element("div", "stage-actions overview-actions");
  addAction(actions, "Start four-trial demo", () => startSession(stimuli.length), true);
  if (researcherMode) addAction(actions, "Run one timed trial", () => startSession(1));
  stage.append(actions);
}

function render(focusHeading = false) {
  const { stage: index } = state;
  const complete = index === stages.length;
  const fixationOnly = index === 0 && !researcherMode;
  document.body.classList.toggle("fixation-only", fixationOnly);
  progress.replaceChildren(...stages.map((label, index) => {
    const step = element("li", "step");
    if (index === state.stage && !complete) step.setAttribute("aria-current", "step");
    const number = element("span", "step-number", String(index + 1));
    number.setAttribute("aria-hidden", "true");
    step.append(number, element("span", "", label));
    return step;
  }));
  stage.replaceChildren();

  const heading = element("h1", fixationOnly ? "visually-hidden" : "", complete ? "Demo complete" : stages[index] ?? "Smartphone purchase decisions");
  heading.tabIndex = -1;
  const intro = element("div", index === 2 ? "stage-intro reviews-intro" : "stage-intro");
  if (index >= 0 && !complete && !fixationOnly) {
    intro.append(element("p", "trial-label", `Trial ${state.trial + 1} of ${stimuli.length}`));
  }
  intro.append(heading);
  stage.append(intro);

  if (complete) {
    const count = state.responses.length;
    intro.append(element("p", "", count === stimuli.length ? "You completed all four purchase decisions." : count === 1 ? "You completed one smartphone trial." : "You reached the end of this trial preview."));
  } else if (index === -1) {
    renderOverview(intro);
  } else if (index === 0) {
    if (researcherMode) intro.append(element("p", "", "5 seconds in a timed run"));
    const field = element("div", "fixation-field");
    field.setAttribute("aria-hidden", "true");
    field.append(element("span", "fixation-cross"));
    stage.append(field);
  } else if (index === 1) {
    intro.append(element("p", "", researcherMode ? "8 seconds in a timed run" : "Review the smartphone specifications below."));
    renderProduct();
  } else if (index === 2) {
    intro.append(element("p", "", "The panels below contain fictional demo reviews."));
    renderReviews();
    if (researcherMode) stage.append(element("p", "fit-status", "Check the fixed-resolution preview for text that exceeds the image area."));
  } else {
    const decision = element("div", "decision");
    decision.append(element("h2", "", "Are you willing to buy this phone?"));
    const choices = element("div", "choice-buttons");
    for (const choice of ["Yes", "No"]) {
      addAction(choices, choice, () => recordResponse(choice));
    }
    decision.append(choices);
    stage.append(decision);
  }

  if (index === 2 || (index >= 0 && index < 2 && researcherMode && !state.playing)) {
    const actions = element("div", "stage-actions");
    addAction(actions, index === 2 ? "Continue to decision" : "Next", () => changeStage(index + 1), true);
    stage.append(actions);
  }

  if (researcherMode) updateResearcherControls();
  if (focusHeading) {
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function updateResearcherControls() {
  const order = state.reversed ? "reversed" : "standard";
  document.querySelector("#review-order").textContent = reviewOrder().map(({ position, valence }) => `${position} AOI = ${valence}`).join(" · ");
  document.querySelector("#participant-link").href = state.reversed ? "index.html?order=reversed" : "index.html";
  document.querySelector("#static-link").href = `export.html?screen=reviews&phone=${stimuli[state.trial].id}&order=${order}${state.compact ? "&count=3" : ""}`;
  document.querySelector("#preview-trial").value = String(state.trial);
  document.querySelector("#preview-trial").disabled = state.playing;
  document.querySelector("#review-layout").disabled = state.playing;
  document.querySelector("#review-count").disabled = state.playing;
  document.querySelector("#preview-stage").value = String(state.stage);
}

if (researcherMode) {
  const picker = document.querySelector("#preview-stage");
  for (const [index, label] of stages.entries()) {
    const option = element("option", "", label);
    option.value = String(index);
    picker.append(option);
  }
  const done = element("option", "", "Demo complete");
  done.value = String(stages.length);
  done.disabled = true;
  picker.append(done);
  picker.addEventListener("change", () => {
    state.playing = false;
    state.responses = [];
    changeStage(Number(picker.value));
  });

  const trialPicker = document.querySelector("#preview-trial");
  for (const [index, { product }] of stimuli.entries()) {
    const option = element("option", "", `${index + 1} · ${product.name}`);
    option.value = String(index);
    trialPicker.append(option);
  }
  trialPicker.addEventListener("change", () => {
    state.trial = Number(trialPicker.value);
    if (state.stage === stages.length) changeStage(0);
    else render();
  });

  const reverse = document.querySelector("#review-layout");
  reverse.value = state.reversed ? "reversed" : "standard";
  reverse.addEventListener("change", () => {
    state.reversed = reverse.value === "reversed";
    render();
  });

  const reviewCount = document.querySelector("#review-count");
  reviewCount.addEventListener("change", () => {
    state.compact = reviewCount.value === "3";
    render();
  });

  const boundaries = document.querySelector("#show-boundaries");
  boundaries.addEventListener("change", () => {
    state.showBoundaries = boundaries.checked;
    render();
  });

  document.querySelector("#reset").addEventListener("click", () => {
    state.playing = false;
    state.trial = 0;
    state.responses = [];
    changeStage(-1);
  });
}

if (exportMode) renderExport();
else render();
