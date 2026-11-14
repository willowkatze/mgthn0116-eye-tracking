# Team handoff · Eye Tracking & Decision Making

## 1. What I have been working on

I built an interactive demo for our MGTHN0116 presentation so we can walk through the screens a participant would see. My parts of the presentation are **Stimuli & IV Manipulation** and **Analysis Plan**. The demo connects those two parts by showing the review layout and where we would measure attention in our partial replication with methodological adaptations. We are adapting a study of online reviews, visual attention and purchase decisions. [Chen et al. (2022)](https://doi.org/10.3389/fpsyg.2022.865702)

The prototype simulates the experimental task. The Yes/No buttons record a choice for that demo run, and the laboratory study is still in preparation.

## 2. Why I built a custom interface

A custom layout lets us show the same amount and format of information for each phone. We can hide brand names and prices so they are less likely to steer purchase decisions, keep the text formatting consistent, and show positive and negative reviews in equally sized panels.

We can also swap the two panels. In the lab, **counterbalancing** would mean assigning participants to both layouts so that each review type appears on both sides across the sample. That helps us account for any tendency to look left or right first. The panel borders give us clear **areas of interest (AOIs)**, meaning the two regions of the screen where we would measure gaze.

## 3. What participants would actually do

Each of the four trials is a separate decision about one smartphone.

1. Look at a cross in the centre of the screen for **5 seconds**.
2. View that phone’s specifications for **8 seconds**.
3. Read the positive and negative customer reviews at their own pace, then continue to the decision screen.
4. Answer **Yes** or **No** to whether they would buy that phone.

Participants give one answer per phone and may say Yes to several phones or to none. The demo runs the phones in a fixed order and uses browser timers. We still need to agree on the lab order and check the timing on the lab setup.

## 4. What the prototype can currently demonstrate

| Feature | What you can try |
| --- | --- |
| Four-trial demo | Start the session, go through four separate Yes/No decisions and reach the completion screen. |
| Researcher Preview | Jump to a phone or stage, run one timed trial, or start the full demo. |
| Review layouts and AOIs | Switch between Layout A (positive left) and Layout B (negative left), show the dashed panel boundaries, and preview ten reviews per panel. The preview also has a shorter three-review option. |
| Fixed-size stimuli | Open the **1024 × 768** preview to check whether the selected reviews fit. A separate export in the repository produces PNGs of the product screen and both review layouts for each phone. |

## 5. What is still placeholder content

The four phone profiles, specifications and reviews are fictional, and the phones share a generic image. We still need to choose four real smartphones and collect and validate **80 English-language reviews**, ten positive and ten negative per phone. Once we have those materials, we can check that the wording fits and that the screens remain comparable.

## 6. How this connects to our hypotheses

- **H1:** Negative reviews receive more visual attention than positive reviews. We would compare attention in the two review areas.
- **H2:** Greater attention to negative reviews is associated with a lower likelihood of purchasing the product. We would relate the attention measured in the negative review area to each phone’s Yes/No decision.

Gaze data will come from the real Tobii setup. H2 concerns an association between measured attention and the purchase decision.

## 7. What we still need to decide together

The demo already gives us four separate trials, two review layouts and a Yes/No response per phone to review. We still need to agree on the lab protocol and materials.

- [ ] Choose four similar smartphones.
- [ ] Select ten positive and ten negative English-language reviews per phone.
- [ ] Decide whether to run a brief independent sentiment pretest.
- [ ] Confirm the participant-facing review headings. The current demo omits positive and negative headings on the participant screen.
- [ ] Confirm the lab display and Tobii configuration.
- [ ] Agree on the trial order and how we will assign participants to layouts A and B.
- [ ] Confirm the data analysis plan, including how we will measure visual attention.

## 8. What I need from the team

Once we agree on the phone models and review materials, I can replace the placeholders and help prepare the standardized screens. Let’s agree on the study design together before treating those screens as final experimental materials.

## 9. How to view the demo

- Select **Start four-trial demo** to try the session as a participant. [Participant View](https://willowkatze.github.io/mgthn0116-eye-tracking/)
- Start here for our team discussion. Choose a phone and stage, switch layout A/B, and show the AOI boundaries. Choose **Run one timed trial** to see how the stages fit together. [Researcher Preview](https://willowkatze.github.io/mgthn0116-eye-tracking/researcher.html)
