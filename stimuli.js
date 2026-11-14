// Fictional presentation materials. Keep the two review lists equal in length.
const firstPhone = {
  id: "phone-a",
  product: {
    name: "Smartphone A",
    image: "smartphone.jpg",
    imageAlt: "Front view of an unbranded charcoal smartphone",
    specifications: [
      ["Display", "6.5-inch OLED, 2400 × 1080"],
      ["Processor", "Octa-core, up to 2.4 GHz"],
      ["Memory", "8 GB RAM"],
      ["Storage", "128 GB"],
      ["Battery", "4,800 mAh, USB-C charging"],
      ["Cameras", "50 MP rear, 12 MP front"],
      ["Connectivity", "5G, Wi-Fi 6, Bluetooth 5.2"],
    ],
  },
  reviews: {
    positive: [
      "The battery lasted through a full day of calls, browsing, and music.",
      "The screen stayed easy to read when I checked messages outdoors.",
      "Apps opened quickly, and switching between them felt smooth.",
      "The camera captured clear details in daylight.",
      "Calls sounded clear even on a busy street.",
      "The phone felt comfortable to hold in one hand.",
      "The touchscreen responded well to light taps.",
      "The speaker was loud enough for podcasts.",
      "The phone stayed cool while streaming video.",
      "The wireless connection stayed steady at home.",
    ],
    negative: [
      "The battery ran low before evening after a day of calls and browsing.",
      "The screen was hard to read when I checked messages outdoors.",
      "Apps took time to open, and switching between them felt slow.",
      "The camera lost fine details in daylight.",
      "Calls sounded muffled on a busy street.",
      "The phone felt awkward to hold in one hand.",
      "The touchscreen sometimes missed light taps.",
      "The speaker was too quiet for podcasts.",
      "The phone warmed up while streaming video.",
      "The wireless connection sometimes dropped at home.",
    ],
  },
};

// The shared image is a stand-in. Replace each phone's image, specs and review lists together.
const stimuli = [
  firstPhone,
  {
    id: "phone-b", name: "Smartphone B", display: "6.4-inch OLED, 2400 × 1080", battery: "4,700 mAh, USB-C charging",
    pairs: [
      ["The camera focused quickly on moving subjects.", "The camera struggled to focus on moving subjects."],
      ["The battery still had charge after my commute.", "The battery was nearly empty after my commute."],
      ["The screen looked clear when I read in bed.", "The screen looked uneven when I read in bed."],
      ["The side buttons were easy to reach.", "The side buttons were hard to reach."],
      ["Video calls ran smoothly over Wi-Fi.", "Video calls stuttered over Wi-Fi."],
      ["The speakers kept voices easy to understand.", "The speakers made voices sound unclear."],
      ["The phone unlocked quickly with my fingerprint.", "The phone often took two tries to unlock."],
      ["The keyboard kept up when I typed quickly.", "The keyboard lagged when I typed quickly."],
      ["Maps loaded promptly when I was walking.", "Maps loaded slowly when I was walking."],
      ["Photos looked natural under indoor lighting.", "Photos looked washed out under indoor lighting."],
    ],
  },
  {
    id: "phone-c", name: "Smartphone C", display: "6.6-inch OLED, 2400 × 1080", battery: "4,900 mAh, USB-C charging",
    pairs: [
      ["The screen stayed readable from an angle.", "The screen became hard to read from an angle."],
      ["Short charging breaks gave me enough battery.", "Short charging breaks gave me very little battery."],
      ["The phone felt stable when I held it sideways.", "The phone slipped when I held it sideways."],
      ["The camera handled indoor movement well.", "The camera blurred indoor movement easily."],
      ["Music stayed clear through my headphones.", "Music sometimes cut out through my headphones."],
      ["Scrolling through long pages felt smooth.", "Scrolling through long pages felt choppy."],
      ["The microphone picked up my voice clearly.", "The microphone made my voice sound distant."],
      ["The phone responded quickly to swipes.", "The phone sometimes ignored my swipes."],
      ["The screen dimmed enough for nighttime reading.", "The screen felt too bright for nighttime reading."],
      ["Downloads finished quickly over Wi-Fi.", "Downloads took a long time over Wi-Fi."],
    ],
  },
  {
    id: "phone-d", name: "Smartphone D", display: "6.5-inch OLED, 2460 × 1080", battery: "5,000 mAh, USB-C charging",
    pairs: [
      ["The battery lasted through an afternoon of video.", "The battery drained during an afternoon of video."],
      ["The screen text stayed sharp at small sizes.", "The screen text looked soft at small sizes."],
      ["Photos kept detail in dim areas.", "Photos lost detail in dim areas."],
      ["The phone felt balanced during long calls.", "The phone felt heavy during long calls."],
      ["Notifications arrived promptly.", "Notifications sometimes arrived late."],
      ["The screen reacted quickly when I zoomed in.", "The screen hesitated when I zoomed in."],
      ["The camera switched modes smoothly.", "The camera paused when switching modes."],
      ["The phone stayed cool while playing games.", "The phone became warm while playing games."],
      ["Recorded speech was easy to understand.", "Recorded speech sounded muffled."],
      ["The Bluetooth connection stayed steady.", "The Bluetooth connection dropped several times."],
    ],
  },
].map(phone => phone.product ? phone : {
  id: phone.id,
  product: {
    ...firstPhone.product,
    name: phone.name,
    specifications: firstPhone.product.specifications.map(([label, value]) => [
      label, { Display: phone.display, Battery: phone.battery }[label] ?? value,
    ]),
  },
  reviews: {
    positive: phone.pairs.map(([positive]) => positive),
    negative: phone.pairs.map(([, negative]) => negative),
  },
});
