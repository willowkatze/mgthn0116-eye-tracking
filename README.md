# MGTHN0116 — Eye Tracking & Decision Making

A presentation prototype for a partial replication of [Chen et al. (2022)](https://doi.org/10.3389/fpsyg.2022.865702). The four phones, specifications, and reviews are fictional placeholders. The phones share one stand-in image. The review text was written for the demo.

## Run locally

Keep the files together in one folder. Open `index.html` in a desktop browser for participant view or `researcher.html` for the researcher preview. Both work offline by opening the files directly. No installation or local server is required.

### Participant view

1. Select **Start four-trial demo**. A centered fixation cross appears for 5 seconds, followed by product information for 8 seconds.
2. Read the current phone’s two review panels at your own pace. Select **Continue to decision** when ready.
3. Answer **Yes** or **No** to “Are you willing to buy this phone?” That response ends the current trial, and the next trial starts at fixation. The completion screen appears after the fourth decision.

The four responses live only in JavaScript memory for the current page. Reload the page to start a fresh run.

### Researcher preview

- On **Session overview**, select a phone and **Run one timed trial** for a complete walkthrough, or **Start four-trial demo** for the full sequence.
- Use **Preview phone** and **Preview stage** to inspect any placeholder trial without waiting for the timer. Selecting a stage ends the active timed run.
- Under **Customer reviews**, dashed outlines mark the two areas of interest (AOIs). The Left and Right labels identify physical positions. The positive and negative labels identify review valence. Layout A puts positive on the left. Layout B puts negative on the left. The two layouts exchange content while retaining the same physical panels.
- **Reviews per panel** defaults to ten. The three-review option shortens researcher runs only. Open **Check the fixed 1024 × 768 review stimulus** for a fit check of the selected phone, layout and count. The fit report names rows that exceed their allotted space.
- **Open participant view** starts a fresh four-trial demo with the selected layout. `index.html?order=reversed` starts with Layout B selected. The selected layout carries through the full run.
- **Reset experiment** returns to the overview and clears responses. Layout, review count and outline preferences stay selected until reload.

## Modify the stimulus

| File | Purpose |
| --- | --- |
| `stimuli.js` | Four stable phone IDs, images and alt text, specification rows, and review text by valence |
| `smartphone.jpg` | Generated image of a generic smartphone |
| `index.html` and `researcher.html` | Participant and researcher entry points |
| `experiment.js` | Stage flow, in-memory response, rendering, and preview controls |
| `styles.css` | Shared typography, panel sizing, and AOI preview outline |
| `export.html`, `export.css`, `export.js` | Standalone fixed-resolution preview and fit check, using the shared stimulus renderer |
| `export-stimuli.cjs` | Optional PNG batch export and AOI reference |

Edit `stimuli.js` after the team approves the materials. The normalized `stimuli` array contains entries with a unique `id`, a `product` object and a `reviews` object with `positive` and `negative` arrays. Phone B through D currently use a shortcut that derives specifications from Phone A and keeps opposed review topics paired. Replace these entries with full `product` and `reviews` objects when ready. Use ten short reviews per condition and comparable lengths and topics. Update image paths and alt text for each phone. Use square images for the current product layout.

## Original procedure and demo choices

- **Chen et al.** Four trials with different phones and reviews in randomized order, 5-second fixation shown in Figure 3, 8-second product viewing, self-paced review viewing with keyboard advancement, and a purchase decision for each phone. Each review image had ten reviews per valence in two equal AOIs. Half the participants saw positive reviews at left, and half saw them at right. The lab used a 1024 × 768 display and an EyeLink 1000.
- **Presentation adaptation.** The demo uses fixed A–D phone order, manually selected participant-level layouts, fictional materials, and clickable review advancement and response buttons. The question uses the team’s requested English wording. Browser timers are approximate. The published stimulus example in Figure 2B shows Chinese positive and negative headings immediately above the review columns. Our demo deliberately omits those headings from the participant and export surfaces. Researcher annotations display position and valence. Confirm the final heading treatment in the replication protocol.
- **Future lab study.** The website collects no gaze, calibration, trial timing, or persistent response data. Confirm the final materials and valence ratings, order and counterbalance allocation, screen settings, AOI placement, response method, and stimulus timing on the actual lab setup.

## Optional fixed-resolution stimulus export

From the project folder with Node.js installed, run:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node export-stimuli.cjs ./stimulus-pngs
```

The workflow creates one product PNG and two review PNGs per phone at **1024 × 768**. Review images use two **452 × 574** pixel AOIs, a fixed 17 px font, and ten equally spaced review rows. The workflow checks that all rows fit and stops before writing the batch if any screen fails. Shorten or revise the flagged wording, then check both layouts again. The PNGs contain the stimulus surface only. The browser preview's fit report and researcher annotations sit outside that surface.

`manifest.json` gives image-relative coordinates from the top-left, physical position, and valence for each review PNG. Import the PNGs as image stimuli in a screen-based [Tobii Pro Lab project](https://www.tobii.com/products/software/behavior-research-software/tobii-pro-lab/screen-based-eye-tracking-studies). Use the JSON as a reference when creating AOIs in Pro Lab. Confirm final resolution, scaling, placement, timing and advancement there. If the lab uses a different resolution, update the fixed layout and export viewport together, recheck typography and overflow, and regenerate the coordinates. The workflow has been checked with placeholder content in Chromium. Final stimuli and Pro Lab setup require validation by the study team.

### Demo image provenance

`smartphone.jpg` was created with the built-in image generation tool and resized for local delivery. The generation prompt was:

> Create one realistic studio product photo of a generic unbranded smartphone for a neutral academic eye-tracking demo. Square composition, one upright handset centered, nearly straight-on front view, screen off in even dark graphite, thin matte charcoal frame, pale neutral gray seamless background, diffuse light, very subtle contact shadow. Handset occupies about 78% of image height. No logos, text, UI, props, human hands, dramatic reflections, or signature branded design features.
