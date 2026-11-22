/*
 * Islamic Engagement Invitation: behaviour
 * Edit CONFIG below to set the Google Maps link and the optional nasheed audio file.
 */
/* =========================================================
   CONFIGURATION
   Empty links keep the related controls hidden.
   ========================================================= */
const CONFIG = {
  // Countdown starts at 7:00 PM IST (UTC+05:30).
  eventStartISO: "2026-12-26T19:00:00+05:30",
  // Confirmed Google Maps search link for the venue.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Maharani+Lawns%2C+Opposite+to+GST+Office%2C+Near+Kiran+Bungalow%2C+Tarabai+Park%2C+Kolhapur%2C+416003",
  // Paste a direct link to the nasheed audio file. Leave "" to hide the player.
  nasheedUrl: ""
};

const NAMES = "Mehvish Kadri and Mursaleen Pasha";
const DATE_TEXT = "Saturday, 26 December 2026";
const TIME_TEXT = "After 7 PM";
const VENUE = "Maharani Lawns";
const ADDRESS = "Opposite to GST Office, Near Kiran Bungalow, Tarabai Park, Kolhapur – 416003";

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmall = window.matchMedia("(max-width: 600px)").matches;
function rand(min, max){ return min + Math.random() * (max - min); }

/* ---------- Decorative petals and glints (sparse, skipped for reduced motion) ---------- */
function buildPetals(){
  if (reduceMotion) return;
  const layer = $("petals");
  const count = isSmall ? 8 : 12;
  for (let i = 0; i < count; i++){
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = rand(0, 100) + "%";
    p.style.setProperty("--s", rand(9, 14) + "px");
    p.style.setProperty("--d", rand(18, 30) + "s");
    p.style.setProperty("--dl", -rand(0, 30) + "s");
    p.style.setProperty("--x", rand(-60, 60) + "px");
    layer.appendChild(p);
  }
}
function buildGlints(target, count){
  if (reduceMotion) return;
  for (let i = 0; i < count; i++){
    const g = document.createElement("span");
    g.className = "glint";
    g.style.left = rand(5, 95) + "%";
    g.style.top = rand(5, 95) + "%";
    g.style.setProperty("--dl", -rand(0, 4) + "s");
    target.appendChild(g);
  }
}

/* ---------- Envelope ---------- */
const envBtn = $("envBtn");
const envelope = $("envelope");
let opened = false;

function openEnvelope(){
  if (opened) return;
  opened = true;
  envBtn.classList.add("opening");
  envBtn.disabled = true;

  // Wait for the seal, flap and card animations to finish before fading the overlay.
  const delay = reduceMotion ? 0 : 1650;
  setTimeout(() => {
    envelope.classList.add("fade");
    document.documentElement.classList.remove("locked");
    setTimeout(() => {
      envelope.hidden = true;
      $("main").focus({ preventScroll: true });
    }, reduceMotion ? 0 : 950);
  }, delay);
}
// A native button fires "click" for mouse, touch, Enter and Space.
envBtn.addEventListener("click", openEnvelope);

/* ---------- Countdown (IST based, updates every second) ---------- */
const START = Date.parse(CONFIG.eventStartISO);
const cdCard = $("cdCard");
let timer = null;

function renderCountdown(){
  const diff = START - Date.now();
  if (diff <= 0){
    cdCard.classList.add("is-done");
    $("cdTitle").textContent = "The engagement has begun";
    if (timer) clearInterval(timer);
    return;
  }
  const total = Math.floor(diff / 1000);
  $("cdDays").textContent = String(Math.floor(total / 86400));
  $("cdHours").textContent = String(Math.floor((total % 86400) / 3600));
  $("cdMins").textContent = String(Math.floor((total % 3600) / 60));
  $("cdSecs").textContent = String(total % 60);
}
renderCountdown();
timer = setInterval(renderCountdown, 1000);

/* ---------- Google Maps (map card and directions both open the venue search) ---------- */
if (CONFIG.mapsUrl){
  const dir = $("directionsBtn");
  dir.href = CONFIG.mapsUrl;
  dir.hidden = false;
  const card = $("mapCard");
  card.href = CONFIG.mapsUrl;
  card.hidden = false;
}

/* ---------- WhatsApp sharing (current page URL) ---------- */
$("whatsappBtn").addEventListener("click", () => {
  const message =
    "You are warmly invited to the Engagement Invitation of " + NAMES + ".\n" +
    DATE_TEXT + ", " + TIME_TEXT + "\n" +
    VENUE + ", " + ADDRESS + "\n" +
    window.location.href;
  window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener");
});

/* ---------- Add to calendar (single ICS event) ---------- */
$("calBtn").addEventListener("click", () => {
  // 7:00 PM IST = 13:30 UTC on 26 December 2026
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:engagement-mehvish-mursaleen-20261226@invitation",
    "DTSTAMP:20261122T000000Z",
    "DTSTART:20261226T133000Z",
    "SUMMARY:Engagement of " + NAMES,
    "DESCRIPTION:Engagement Invitation. Time: " + TIME_TEXT + ".",
    "LOCATION:" + VENUE + ", " + ADDRESS,
    "END:VEVENT",
    "END:VCALENDAR"
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "engagement-invitation.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});

/* ---------- Nasheed (manual play and pause only, never autoplay) ---------- */
if (CONFIG.nasheedUrl){
  const btn = $("nasheedBtn");
  const audio = $("nasheedAudio");
  audio.src = CONFIG.nasheedUrl;
  btn.hidden = false;
  const setState = (playing) => {
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Pause nasheed" : "Play nasheed");
    $("icoPlay").hidden = playing;
    $("icoPause").hidden = !playing;
  };
  btn.addEventListener("click", () => {
    if (audio.paused){
      audio.play().then(() => setState(true)).catch(() => setState(false));
    } else {
      audio.pause();
      setState(false);
    }
  });
  // Pause when the visitor leaves the tab.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !audio.paused){
      audio.pause();
      setState(false);
    }
  });
}

/* ---------- Background layout and parallax ----------
   The artwork is laid out at the full screen width, so it is never narrower than
   the page and never stretched. The head and foot stay in place, the repeating
   frame band drifts slightly slower than the text, and each floral cluster moves
   at its own data-speed. Only transforms are animated. */
const ART_RATIO = 1421 / 800;   // artwork height / width
const BAND_RATIO = 171 / 800;   // repeat band height / width
const HEAD_FRACTION = 0.44;     // top part of the artwork, above the repeat band
const FOOT_FRACTION = 0.44;     // bottom part of the artwork, below the repeat band
const BG_SPEED = 0.8;           // the band moves at 80 percent of scroll speed

const bgEl = $("bgGroup");
const headEl = document.querySelector(".bg-head");
const footEl = document.querySelector(".bg-foot");
const midEl = document.querySelector(".bg-mid");
const trackEl = document.querySelector(".bg-track");
const DRIFTS = Array.from(document.querySelectorAll(".drift"));
let bandH = 0;

function layoutBg(){
  const w = document.documentElement.clientWidth;
  const pageH = document.documentElement.scrollHeight;
  const artH = w * ART_RATIO;
  const headH = Math.round(artH * HEAD_FRACTION);
  const footH = Math.round(artH * FOOT_FRACTION);
  bandH = Math.max(1, Math.round(w * BAND_RATIO));
  bgEl.style.height = pageH + "px";
  headEl.style.height = headH + "px";
  footEl.style.height = footH + "px";
  midEl.style.top = headH + "px";
  midEl.style.height = Math.max(0, pageH - headH - footH) + "px";
  // The track is taller than the middle area by one band on each side, so it always covers it.
  trackEl.style.top = (-bandH) + "px";
  trackEl.style.height = (Math.max(0, pageH - headH - footH) + bandH * 2) + "px";
  onScroll();
}

function onScroll(){
  if (reduceMotion) return;
  const y = window.scrollY;
  if (bandH > 0){
    const shift = (y * (1 - BG_SPEED)) % bandH;
    trackEl.style.transform = "translate3d(0," + shift.toFixed(2) + "px,0)";
  }
  for (const d of DRIFTS){
    const sp = parseFloat(d.dataset.speed);
    d.style.transform = "translate3d(0," + (y * (1 - sp)).toFixed(2) + "px,0)";
  }
}

let scrollQueued = false;
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => { onScroll(); scrollQueued = false; });
}, { passive: true });

let resizeQueued = false;
window.addEventListener("resize", () => {
  if (resizeQueued) return;
  resizeQueued = true;
  requestAnimationFrame(() => { layoutBg(); resizeQueued = false; });
});
if ("ResizeObserver" in window){
  new ResizeObserver(() => layoutBg()).observe(document.body);
}
layoutBg();

/* ---------- Decorations: sparkles around the seal, petals, glints ---------- */
buildPetals();
buildGlints(document.querySelector(".hero"), isSmall ? 5 : 8);
