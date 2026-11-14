# MGTHN0116 — Eye Tracking & Decision Making

A presentation prototype for a partial replication of an eye-tracking study on attention to positive and negative online reviews and its association with purchase decisions. The smartphone, specifications, and reviews are fictional presentation materials. The review text was written for the demo.

## Run locally

Keep the files together in one folder. Open `index.html` in a desktop browser for participant view or `researcher.html` for the researcher preview. Both work offline by opening the files directly. No installation or local server is required.

### Participant view

1. Review the image and specifications, then select **Next**.
2. Read the two panels of demo reviews, then select **Next**.
3. Answer **Yes** or **No** to reach the completion screen.

The demo choice lives in JavaScript memory for the current page. Reload the page to start a fresh run.

### Researcher preview

- Use **Preview stage** to jump to any of the three stages.
- Open **Customer reviews** to see the condition labels. Use **Show AOI boundaries** to turn the dashed panel outlines on or off. AOI means area of interest.
- Use **Reverse review positions** to switch which condition appears on each side. The default puts positive reviews on the left.
- Select **Open participant view** to launch a fresh participant run in a separate tab with the selected order. To use a preconfigured participant URL, add `?order=reversed` to `index.html` for the reverse order. The preview controls apply to the researcher tab and newly launched participant runs.
- Select **Reset experiment** to return the researcher tab to Stage 1 and clear its current response. The selected review order and outline preference are retained until reload.

## Modify the stimulus

| File | Purpose |
| --- | --- |
| `stimuli.js` | Phone name, image path and alt text, specification rows, and review lists grouped by condition |
| `smartphone.jpg` | Generated image of a generic smartphone |
| `index.html` and `researcher.html` | Participant and researcher entry points |
| `experiment.js` | Stage flow, in-memory response, rendering, and preview controls |
| `styles.css` | Shared typography, panel sizing, and AOI preview outline |

Edit `stimuli.js` to update the materials. Keep review counts equal and use comparable review lengths and topics across the two lists. When changing the image, update its relative path and alt text. Use a square image for the current layout.

## Demo and study validation

The demo uses one fictional phone, three reviews per condition, manual advancement, and a manually selected review order. It runs entirely in the browser with no timing enforcement, Tobii integration, or experimental data collection.

Before the lab study, select and validate the final phone and review materials. If the study uses four phones with ten reviews per condition per phone, extend the stimulus structure and trial flow, then verify that the full review sets fit at the required display size. Confirm review valence and comparability, define the condition and phone-order assignment procedure, and validate stimulus durations, monitor settings, AOI coordinates, eye-tracker calibration, and event synchronization on the lab setup. The browser preview's dashed outlines illustrate the proposed panel boundaries. The panels have equal dimensions at each viewport width, and their dimensions can change with viewport size or longer review text.

### Demo image provenance

`smartphone.jpg` was created with the built-in image generation tool and resized for local delivery. The generation prompt was:

> Create one realistic studio product photo of a generic unbranded smartphone for a neutral academic eye-tracking demo. Square composition, one upright handset centered, nearly straight-on front view, screen off in even dark graphite, thin matte charcoal frame, pale neutral gray seamless background, diffuse light, very subtle contact shadow. Handset occupies about 78% of image height. No logos, text, UI, props, human hands, dramatic reflections, or signature branded design features.
