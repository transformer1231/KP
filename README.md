# Islamic Engagement Invitation Website

A static, mobile-first engagement invitation for **Mehvish Kadri & Mursaleen Pasha**.
It has no build step and no server code, so it runs on any static host, including Vercel.

## Features

- Envelope opening reveal (tap, click, Enter or Space; the page unlocks after the card rises out)
- Arabic Bismillah in an ornamental frame
- Live countdown to **Saturday, 26 December 2026, 7:00 PM IST**, switching to a completed-event message afterwards
- Venue card with **Get directions** and map card, both opening the confirmed Google Maps search for Maharani Lawns in a new tab
- **Share on WhatsApp**, which sends the names, date, time, venue and the current page address
- **Add to calendar**, which downloads a single `.ics` event
- Background audio recording playing upon opening the envelope with an elegant floating burgundy-and-gold play/pause control and rotating music icon
- Floral background with parallax scrolling and gentle floating ornaments; reduced-motion settings are respected

## Folder structure

```
├── index.html                  Page structure and content
├── css/
│   └── styles.css              All styling, layout, envelope and animations
├── js/
│   └── main.js                 Behaviour and the CONFIG block (links and audio)
├── assets/
│   ├── audio/                  Background audio recording (.mp4 / .mpeg)
│   ├── images/
│   │   ├── floral-background.jpg   Full floral artwork (top, middle and bottom parts)
│   │   └── floral-band.jpg         Repeating frame band for the middle of the page
│   └── source/
│       └── floral-background-full-size.jpg   Higher-resolution cleaned artwork for future edits
├── package.json                Project metadata and a local-run script
├── vercel.json                 Vercel caching and security headers, clean URLs
├── .gitignore
└── README.md
```

The Arabic Bismillah is real text (Amiri font), not an image. The floral clusters and corner ornaments are inline SVG inside `index.html`, so they need no separate files. The envelope is drawn with CSS, so it has no image assets.

## Fonts

The page loads three Google Fonts from `fonts.googleapis.com`: **Pinyon Script** (names), **Cormorant Garamond** (body text) and **Amiri** (Arabic). The page needs an internet connection to load them. If they cannot load, the browser uses the fallback serif fonts listed in `css/styles.css`.

## Configuration

Open `js/main.js` and edit the `CONFIG` block at the top:

| Setting | Current value | Purpose |
| --- | --- | --- |
| `eventStartISO` | `2026-12-26T19:00:00+05:30` | Countdown target (7:00 PM IST) |
| `mapsUrl` | Confirmed Maharani Lawns search link | Map card and Get directions button |
| `nasheedUrl` | `""` (empty) | Direct link to an audio file. Leave empty to hide the nasheed control |

To add nasheed audio, create a folder `assets/audio/` and place your file in it (for example `nasheed.mp3`), then set `nasheedUrl: "assets/audio/nasheed.mp3"`. Only use audio you have the right to publish.

The names, date, time, venue and address are written in `index.html`. Edit them there if they ever change.

## Run locally

You need Node.js 18 or later (for `npx`). From the project folder:

```bash
npm run dev
```

Then open **http://localhost:3000**. Any static server also works, for example `python3 -m http.server 8000` (then open http://localhost:8000).

Do not open `index.html` by double-clicking it if you want to test everything. Some browsers restrict local files, so use a server.

## Deploy to Vercel

### Option A: from a GitHub repository (recommended)

1. Create a new GitHub repository and upload every file and folder in this project, keeping the folder structure. Do not upload `node_modules` or `.vercel`.
2. Sign in at https://vercel.com with GitHub, then choose **Add New... > Project** and import the repository.
3. Set these options:
   - **Framework Preset:** Other
   - **Build Command:** leave empty
   - **Output Directory:** leave empty (the project root is served)
   - **Install Command:** leave empty
4. Click **Deploy**. Vercel gives you a live address such as `https://your-project.vercel.app`.

Every later push to the repository redeploys automatically.

### Option B: from this folder with the Vercel CLI

```bash
npm install -g vercel
vercel            # first time: answer the prompts; use the defaults
vercel --prod     # publish to the production address
```

## Checklist after deploying

- The envelope opens with a tap or click, and the page scrolls after it opens.
- The countdown is ticking.
- **Get directions** and the map card open Google Maps in a new tab.
- **Share on WhatsApp** opens WhatsApp with the invitation text.
- **Add to calendar** downloads `engagement-invitation.ics`.
- The page has no sideways scrolling on your phone.
