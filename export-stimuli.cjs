"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

const width = 1024;
const height = 768;
const output = path.resolve(process.argv[2] ?? "stimulus-pngs");
const preview = pathToFileURL(path.join(__dirname, "export.html"));

async function exportStimuli() {
  const browser = await chromium.launch({ executablePath: process.env.MGTHN_BROWSER_PATH });
  try {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(preview.href);
    const phones = await page.evaluate(() => stimuli.map(({ id }) => id));
    const files = [];
    const manifest = { width, height, origin: "top-left", units: "image pixels", screens: [] };

    for (const phone of phones) {
      const layouts = [
        { screen: "product", order: "standard", filename: `${phone}-product.png` },
        { screen: "reviews", order: "standard", filename: `${phone}-reviews-a.png` },
        { screen: "reviews", order: "reversed", filename: `${phone}-reviews-b.png` },
      ];
      for (const { screen, order, filename } of layouts) {
        preview.search = new URLSearchParams({ screen, phone, order });
        await page.goto(preview.href);
        const status = page.locator("[data-fit]");
        await status.waitFor();
        if (await status.getAttribute("data-fit") !== "ok") {
          throw new Error(`${filename}: ${await status.textContent()}`);
        }

        const frame = page.locator(".export-frame");
        const aois = await frame.evaluate((root) => {
          const frameBounds = root.getBoundingClientRect();
          return Array.from(root.querySelectorAll(".review-panel"), (panel, index) => {
            const bounds = panel.getBoundingClientRect();
            return {
              ...reviewOrder()[index],
              x: bounds.x - frameBounds.x,
              y: bounds.y - frameBounds.y,
              width: bounds.width,
              height: bounds.height,
            };
          });
        });

        files.push([filename, await frame.screenshot({ scale: "css" })]);
        manifest.screens.push({ filename, phone, screen, ...(aois.length ? { layout: order, aois } : {}) });
      }
    }

    await fs.mkdir(output, { recursive: true });
    files.push(["manifest.json", `${JSON.stringify(manifest, null, 2)}\n`]);
    for (const [filename, data] of files) await fs.writeFile(path.join(output, filename), data);
    console.log(`Exported ${manifest.screens.length} stimulus images and an AOI reference to ${output}`);
  } finally {
    await browser.close();
  }
}

exportStimuli().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
