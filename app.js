(() => {
  // Puja starts 19 Nov 2026 (IST)
  const START = new Date("2026-11-19T00:00:00+05:30");
  const PHONE = "919572774629";
  const TITLE = "एकादशी उद्यापन एवं अखण्ड हरिकीर्तन";

  const $ = (id) => document.getElementById(id);
  const gate = $("gate");
  const song = $("song");
  const musicBtn = $("musicBtn");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ?capture=pdf | ?capture=video is used only when generating the PDF / video
  const capture = new URLSearchParams(location.search).get("capture");
  if (capture) document.body.classList.add("capture", "capture-" + capture);

  else document.body.classList.add("locked");

  // ----- Language (हिंदी / English) -----
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage blocked */ } },
  };
  // ----- Personal invitation -----
  // New links: ?i=<code> (name hidden). Old links: ?guest= / ?to= / ?name= still work.
  const qs = new URLSearchParams(location.search);
  const sess = {
    get(k) { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (_) { /* storage blocked */ } },
  };
  let invite = qs.get("i") && window.NameCode ? NameCode.decode(qs.get("i")) : null;
  if (!invite && (qs.get("guest") || qs.get("to") || qs.get("name"))) invite = { name: qs.get("guest") || qs.get("to") || qs.get("name"), lang: qs.get("lang") };
  if (invite) sess.set("invite", JSON.stringify(invite));
  else if (!capture) { try { invite = JSON.parse(sess.get("invite")); } catch (_) { invite = null; } } // keeps the name after a refresh
  const guest = ((invite && invite.name) || "").replace(/\s+/g, " ").trim().slice(0, 60);
  // hide the code / name from the address bar once read
  if (guest && !capture && (qs.has("i") || qs.has("guest") || qs.has("to") || qs.has("name"))) {
    try { history.replaceState(null, "", location.pathname + location.hash); } catch (_) { /* ignore */ }
  }

  const urlLang = qs.get("lang") || (invite && invite.lang);
  let lang = urlLang === "en" || urlLang === "hi" ? urlLang : capture ? "hi" : store.get("lang") === "en" ? "en" : "hi";
  const T = (hi, en) => (lang === "en" ? en : hi);
  function setLabel(el, hi, en) {
    el.dataset.hi = hi;
    el.dataset.en = en;
    el.innerHTML = T(hi, en);
  }

  // split into letters without breaking Devanagari conjuncts / matras
  function graphemes(str) {
    if (window.Intl && Intl.Segmenter) return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(str)].map((x) => x.segment);
    return str.match(/\S[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963\u200C\u200D]*(?:\u094D\S[\u0900-\u0903\u093A-\u094F\u0951-\u0957]*)*|\s/g) || [str];
  }
  function fillName(box) {
    box.textContent = "";
    box.setAttribute("aria-label", guest);
    // keep words together so a long name wraps between words only
    let i = 0;
    guest.split(" ").forEach((word, w) => {
      if (w) box.appendChild(document.createTextNode(" "));
      const wEl = document.createElement("span");
      wEl.className = "w";
      wEl.setAttribute("aria-hidden", "true");
      graphemes(word).forEach((ch) => {
        const c = document.createElement("span");
        c.className = "ch";
        c.textContent = ch;
        c.style.setProperty("--i", i++);
        wEl.appendChild(c);
      });
      box.appendChild(wEl);
    });
    box.style.setProperty("--n", i);
    // shrink very long names so they stay on one or two lines
    // (Latin letters are wider than Devanagari ones)
    const len = guest.length * (/[a-z]/i.test(guest) ? 1.3 : 1);
    box.classList.toggle("long", len > 16);
    box.classList.toggle("xlong", len > 28);
  }
  function addStars(box, n, delay) {
    if (reduceMotion) return;
    for (let k = 0; k < n; k++) {
      const s = document.createElement("span");
      s.className = "nstar";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = delay + Math.random() * 3 + "s";
      s.style.animationDuration = 1.6 + Math.random() * 1.8 + "s";
      s.style.setProperty("--k", 0.5 + Math.random() * 0.8);
      box.appendChild(s);
    }
  }
  function renderGuest() {
    // the sealed letter is addressed to the guest (or to everyone)
    $("envName").textContent = guest || T("समस्त स्वजन", "Family & Friends");
    $("letterTo").textContent = guest ? T(`प्रिय ${guest},`, `Dear ${guest},`) : T("प्रिय स्वजन,", "Dear family & friends,");
    if (!guest) return;
    $("guestLine").textContent = T(`आदरणीय ${guest} — आपकी प्रतीक्षा रहेगी 🙏`, `Dear ${guest} — we look forward to welcoming you 🙏`);
  }
  if (guest) {
    document.body.classList.add("has-guest");
    fillName($("gateName"));
    renderGuest();
    $("guestLine").hidden = false;
    addStars($("nameSparks"), 14, 1.2);
  }

  // ----- Name intro: the guest's name alone on screen, then the temple doors -----
  const intro = $("intro");
  if (guest && !capture) {
    fillName($("introName"));
    addStars($("introStars"), 22, 0.8);
    intro.hidden = false;
    document.body.classList.add("intro-on");
    // petals of light bursting out of the name
    if (!reduceMotion) {
      const burst = $("introBurst");
      for (let k = 0; k < 28; k++) {
        const r = document.createElement("span");
        r.style.setProperty("--a", (360 / 28) * k + "deg");
        r.style.setProperty("--d", 0.9 + Math.random() * 0.8);
        burst.appendChild(r);
      }
    }
    const n = $("introName").style.getPropertyValue("--n") | 0;
    intro.style.setProperty("--n", n);
    let ended = false;
    const endIntro = () => {
      if (ended) return;
      ended = true;
      intro.classList.add("out");
      document.body.classList.remove("intro-on");
      // the front page's own name animation starts now
      setTimeout(() => { $("gateGuest").hidden = false; }, 350);
      setTimeout(() => intro.remove(), 1600);
    };
    intro.addEventListener("click", () => { bell(700, 0.3); endIntro(); });
    setTimeout(endIntro, reduceMotion ? 4000 : 6500 + n * 90);
  } else {
    intro.remove();
    if (guest) $("gateGuest").hidden = false;
  }

  // ----- Mandalas (drawn in SVG) -----
  function petal(r1, r2, w) {
    const m = (r1 + r2) / 2;
    return `M0,${-r1} C${w},${-m - (r1 - r2) * 0.2} ${w},${-m + (r1 - r2) * 0.2} 0,${-r2} C${-w},${-m + (r1 - r2) * 0.2} ${-w},${-m - (r1 - r2) * 0.2} 0,${-r1}Z`;
  }
  function ring(n, d, extra = "") {
    let s = "";
    for (let i = 0; i < n; i++) s += `<path d="${d}" transform="rotate(${(360 / n) * i})" ${extra}/>`;
    return s;
  }
  function dots(n, r, size) {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n;
      s += `<circle cx="${(Math.sin(a) * r).toFixed(2)}" cy="${(-Math.cos(a) * r).toFixed(2)}" r="${size}"/>`;
    }
    return s;
  }
  document.querySelectorAll("svg[data-mandala]").forEach((svg) => {
    const kind = svg.dataset.mandala;
    const outer = kind === "small" ? 12 : 24;
    svg.innerHTML = `
      <g fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.1">
        <circle r="98" fill="none"/>
        ${ring(outer, petal(97, 62, kind === "small" ? 16 : 9))}
        <circle r="62" fill="none"/>
        ${ring(16, petal(60, 30, 11))}
        <circle r="30" fill="none"/>
        ${ring(8, petal(29, 8, 6))}
      </g>
      <g fill="currentColor">${dots(outer * 2, 80, 1.6)}${dots(32, 45, 1.3)}<circle r="4"/></g>`;
  });

  // ----- Toran: marigold garland with mango leaves -----
  function buildToran(toran) {
    const W = toran.clientWidth;
    const segs = Math.max(4, Math.round(W / 72));
    const sw = W / segs;
    let html = '<div class="rope"></div>';
    for (let s = 0; s < segs; s++) {
      const x0 = s * sw;
      // drooping swag of flowers
      for (let k = 0; k <= 8; k++) {
        const x = x0 + (sw * k) / 8;
        const y = 12 + 24 * Math.sin((Math.PI * k) / 8);
        html += `<span class="fl${k % 2 ? " y" : ""}" style="left:${x}px;top:${y}px"></span>`;
      }
      // mango leaf under the swag
      html += `<span class="lf" style="left:${x0 + sw / 2}px;top:${44}px"></span>`;
      // hanging strand at the joint
      if (s > 0) {
        const len = s % 2 ? 5 : 3;
        let strand = "";
        for (let j = 0; j < len; j++) strand += `<span class="fl${j % 2 ? "" : " y"}" style="left:0;top:${22 + j * 15}px"></span>`;
        strand += `<span class="bead" style="left:0;top:${22 + len * 15}px"></span>`;
        html += `<div class="strand" style="left:${x0}px;animation-delay:${-s * 0.7}s">${strand}</div>`;
      }
    }
    toran.innerHTML = html;
  }
  const torans = [$("toran"), $("gateToran")];
  const buildAll = () => torans.forEach((t) => t && t.isConnected && buildToran(t));
  buildAll();
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildAll, 150); });

  // glowing lanterns floating up on the landing page
  if (!reduceMotion && $("lanterns")) {
    for (let i = 0; i < 14; i++) {
      const l = document.createElement("span");
      l.className = "lantern";
      const dur = 11 + Math.random() * 10;
      const near = Math.random() < 0.35;
      l.style.left = 4 + Math.random() * 92 + "%";
      l.style.animationDuration = (near ? dur * 0.8 : dur) + "s";
      l.style.animationDelay = -Math.random() * dur + "s";
      l.style.setProperty("--s", near ? 1.2 + Math.random() * 0.4 : 0.5 + Math.random() * 0.4);
      l.style.setProperty("--o", near ? 0.95 : 0.55);
      l.style.setProperty("--sway", Math.random() * 60 - 30 + "px");
      if (!near) l.style.filter = "blur(1px)";
      $("lanterns").appendChild(l);
    }
  }

  // golden sparkles drifting over the landing page
  if (!reduceMotion && $("gateSparks")) {
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const dur = 6 + Math.random() * 6;
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = -Math.random() * dur + "s";
      s.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      $("gateSparks").appendChild(s);
    }
  }

  // ----- Temple bell sound (synthesised) -----
  let actx;
  function bell(base = 660, vol = 0.35) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime;
      const out = actx.createGain();
      out.gain.value = vol;
      out.connect(actx.destination);
      [[0.5, 0.5, 4], [1, 1, 3.2], [1.19, 0.5, 2.6], [1.56, 0.35, 2], [2, 0.4, 1.8], [2.74, 0.22, 1.2], [3.76, 0.14, 0.8], [5.4, 0.08, 0.5]]
        .forEach(([ratio, amp, decay]) => {
          const o = actx.createOscillator();
          const g = actx.createGain();
          o.type = "sine";
          o.frequency.value = base * ratio * (1 + (Math.random() - 0.5) * 0.004);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(amp, t + 0.005);
          g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
          o.connect(g).connect(out);
          o.start(t);
          o.stop(t + decay + 0.1);
        });
    } catch (_) { /* audio not available */ }
  }
  document.querySelectorAll(".bell").forEach((b, i) => {
    b.addEventListener("click", () => {
      bell(i ? 740 : 620);
      b.classList.remove("ring");
      void b.offsetWidth;
      b.classList.add("ring");
      burstPetals(8);
    });
    b.addEventListener("animationend", (e) => { if (e.animationName === "ring") b.classList.remove("ring"); });
  });

  // ----- Music -----
  song.volume = 0.8;
  const setMusicUi = () => musicBtn.classList.toggle("paused", song.paused);
  const playSong = () => song.play().then(setMusicUi).catch(setMusicUi);
  musicBtn.addEventListener("click", () => {
    if (song.paused) playSong();
    else song.pause();
  });
  song.addEventListener("pause", setMusicUi);
  song.addEventListener("play", setMusicUi);

  // ----- Open the temple doors -----
  $("openBtn").addEventListener("click", () => {
    bell(620, 0.4);
    setTimeout(() => bell(740, 0.3), 450);
    playSong();
    gate.classList.add("open");
    musicBtn.hidden = false;
    setTimeout(() => {
      document.body.classList.remove("locked");
      observeReveals();
      burstPetals(30);
    }, 700);
    setTimeout(() => gate.remove(), 1900);
    if (!reduceMotion) setInterval(() => burstPetals(2), 1600);
  });

  // ----- Petals -----
  const petalBox = $("petals");
  const colors = ["#ff7a1a", "#ffb000", "#ffd23f", "#e63b2e", "#ff9f1c", "#f25c54"];
  function burstPetals(n) {
    if (reduceMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const size = 10 + Math.random() * 10;
      const dur = 6 + Math.random() * 6;
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = size + "px";
      p.style.height = size * 1.3 + "px";
      p.style.background = colors[(Math.random() * colors.length) | 0];
      p.style.animationDuration = dur + "s";
      p.style.animationDelay = Math.random() * (n > 10 ? 2 : 1) + "s";
      p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
      petalBox.appendChild(p);
      setTimeout(() => p.remove(), (dur + 3) * 1000);
    }
  }

  // ----- Golden sparkles floating up -----
  if (!reduceMotion && capture !== "pdf") {
    const sp = $("sparkles");
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      const dur = 9 + Math.random() * 10;
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = -Math.random() * dur + "s";
      s.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      const k = 0.6 + Math.random() * 0.8;
      s.style.transform = `scale(${k})`;
      sp.appendChild(s);
    }
  }

  // ----- Reveal on scroll -----
  function observeReveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  // ----- Sealed letter: tap the seal, the envelope opens and the letter unfolds -----
  const envelope = $("envelope");
  document.querySelectorAll("#letterCard .lt-line").forEach((l, i) => l.style.setProperty("--d", 0.7 + i * 0.75 + "s"));
  function showLetter() {
    envelope.hidden = true;
    $("letterHint").hidden = true;
    $("letterCard").hidden = false;
  }
  function openLetter() {
    if (envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    bell(880, 0.25);
    setTimeout(() => burstPetals(18), 600);
    setTimeout(showLetter, reduceMotion ? 300 : 1900);
  }
  if (capture) showLetter();
  envelope.addEventListener("click", openLetter);
  envelope.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLetter(); } });

  // ----- Golden sparkles wherever the screen is touched -----
  if (!reduceMotion && !capture) {
    const fx = $("touchFx");
    document.addEventListener("pointerdown", (e) => {
      if (document.body.classList.contains("locked")) return;
      for (let k = 0; k < 9; k++) {
        const s = document.createElement("span");
        const a = (Math.PI * 2 * k) / 9 + Math.random() * 0.5;
        const d = 26 + Math.random() * 34;
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.setProperty("--x", Math.cos(a) * d + "px");
        s.style.setProperty("--y", Math.sin(a) * d + "px");
        s.style.background = k % 3 ? "#ffd970" : "#ff9f1c";
        fx.appendChild(s);
        setTimeout(() => s.remove(), 800);
      }
    }, { passive: true });
  }

  // ----- Conch (shankh) sound, synthesised -----
  function shankh(dur = 2.6, vol = 0.32) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime;
      const out = actx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(vol, t + 0.45);
      out.gain.setValueAtTime(vol, t + dur - 0.6);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const lp = actx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = 1700; lp.Q.value = 2.5;
      const peak = actx.createBiquadFilter();
      peak.type = "peaking"; peak.frequency.value = 900; peak.gain.value = 9; peak.Q.value = 2;
      lp.connect(peak).connect(out).connect(actx.destination);
      const vib = actx.createOscillator();
      const vibAmt = actx.createGain();
      vib.frequency.value = 5.2; vibAmt.gain.value = 2.2;
      vib.connect(vibAmt);
      [[1, "sawtooth", 0.55], [2, "sawtooth", 0.18], [3, "triangle", 0.12]].forEach(([mul, type, amp]) => {
        const o = actx.createOscillator();
        const g = actx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(205 * mul, t);
        o.frequency.exponentialRampToValueAtTime(233 * mul, t + 0.5);
        vibAmt.connect(o.frequency);
        g.gain.value = amp;
        o.connect(g).connect(lp);
        o.start(t); o.stop(t + dur + 0.05);
      });
      // breath noise
      const len = Math.floor(actx.sampleRate * dur);
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const n = actx.createBufferSource();
      const bp = actx.createBiquadFilter();
      const ng = actx.createGain();
      n.buffer = buf; bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 1.2; ng.gain.value = 0.05;
      n.connect(bp).connect(ng).connect(out);
      n.start(t);
      vib.start(t); vib.stop(t + dur + 0.05);
    } catch (_) { /* audio not available */ }
  }

  // ----- Virtual Aarti -----
  const wrap = document.querySelector(".art-wrap");
  const thali = $("thali");
  const offerings = $("offerings");
  const aartiBtn = $("aartiBtn");
  const toast = $("toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }
  function ringBells() {
    document.querySelectorAll(".bell").forEach((b) => {
      b.classList.remove("ring"); void b.offsetWidth; b.classList.add("ring");
    });
  }
  // Traditional order: 4 circles at the feet, 2 at the navel, 1 at the face, then 3 around the whole body.
  // Values are fractions of the picture's width/height.
  const AARTI_PATH = [
    { cx: 0.5, cy: 0.84, rx: 0.13, ry: 0.06, turns: 4, dur: 3.2 },
    { cx: 0.5, cy: 0.52, rx: 0.12, ry: 0.06, turns: 2, dur: 1.8 },
    { cx: 0.5, cy: 0.25, rx: 0.11, ry: 0.06, turns: 1, dur: 1.1 },
    { cx: 0.5, cy: 0.5, rx: 0.36, ry: 0.36, turns: 3, dur: 4.8 },
  ];
  const MOVE = 0.45; // seconds to glide between stages
  const aartiTotal = AARTI_PATH.reduce((s, p) => s + p.dur + MOVE, 0);
  const ptOn = (p, frac) => {
    const a = frac * p.turns * Math.PI * 2; // clockwise from the bottom
    return [p.cx - Math.sin(a) * p.rx, p.cy + Math.cos(a) * p.ry];
  };
  function aartiPos(t) {
    let prev = [0.5, 1.05];
    for (const p of AARTI_PATH) {
      const start = ptOn(p, 0);
      if (t < MOVE) {
        const k = t / MOVE, e = k * k * (3 - 2 * k);
        return [prev[0] + (start[0] - prev[0]) * e, prev[1] + (start[1] - prev[1]) * e];
      }
      t -= MOVE;
      if (t < p.dur) return ptOn(p, t / p.dur);
      t -= p.dur;
      prev = ptOn(p, 1);
    }
    return prev;
  }
  let aartiRunning = false;
  let aartiLoop = false;   // lyrics open: keep circling until stopped
  let aartiStop = false;
  const lyricsBtn = $("lyricsBtn");
  const lyrics = $("aartiLyrics");
  const AARTI_HI = "🪔 आरती करें", AARTI_EN = "🪔 Perform Aarti";
  lyricsBtn.addEventListener("click", () => {
    const open = lyrics.hidden;
    lyrics.hidden = !open;
    lyricsBtn.setAttribute("aria-expanded", String(open));
    aartiLoop = open;
    if (open) {
      lyrics.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      if (!aartiRunning) aartiBtn.click();
    }
  });
  aartiBtn.addEventListener("click", () => {
    if (aartiRunning) {
      // running in sing-along mode: this button stops it
      if (aartiLoop) { aartiStop = true; aartiBtn.disabled = true; }
      return;
    }
    aartiRunning = true;
    aartiStop = false;
    if (aartiLoop) setLabel(aartiBtn, "⏹ आरती रोकें", "⏹ Stop Aarti");
    else aartiBtn.disabled = true;
    const prevVol = song.volume;
    song.volume = Math.min(prevVol, 0.3);
    shankh();
    thali.classList.add("on");
    let t0 = performance.now();
    let lastSpark = 0, lastBell = 0, bellNo = 0;
    function step(now) {
      const t = (now - t0) / 1000;
      const r = wrap.getBoundingClientRect();
      const [fx, fy] = aartiPos(Math.min(t, aartiTotal));
      const x = fx * r.width, y = fy * r.height;
      thali.style.transform = `translate(${x - 55}px, ${y - 55}px)`;
      if (now - lastSpark > 35) {
        lastSpark = now;
        const s = document.createElement("i");
        s.className = "aarti-spark";
        s.style.left = x + (Math.random() * 12 - 6) + "px";
        s.style.top = y - 22 + (Math.random() * 10 - 5) + "px";
        offerings.appendChild(s);
        setTimeout(() => s.remove(), 1650);
      }
      if (t > 1.2 && t - lastBell > (aartiLoop ? 1.1 : 0.55) && t < aartiTotal) {
        lastBell = t;
        bell(bellNo++ % 2 ? 1180 : 990, 0.16);
        if (bellNo % 3 === 0) ringBells();
      }
      if (t < aartiTotal + 0.3) requestAnimationFrame(step);
      else if (aartiLoop && !aartiStop) {
        // another round of the aarti
        t0 = now; lastBell = 0;
        requestAnimationFrame(step);
      } else {
        thali.classList.remove("on");
        shankh(2, 0.25);
        burstPetals(20);
        showToast(T("🙏 आरती सम्पन्न — जय श्री हरि!", "🙏 Aarti complete — Jai Shri Hari!"));
        setTimeout(() => {
          song.volume = prevVol;
          aartiRunning = false;
          aartiBtn.disabled = false;
          setLabel(aartiBtn, AARTI_HI, AARTI_EN);
        }, 1200);
      }
    }
    requestAnimationFrame(step);
  });

  // ----- Pushpanjali (flower offering) -----
  const FLOWERS = ["marigold", "marigold y", "rose", "marigold", "rose", "emoji"];
  const EMOJI = ["🌸", "🌺", "🌼", "🪷"];
  let lastPushpToast = 0;
  function pushpanjali(n = 22) {
    const r = wrap.getBoundingClientRect();
    if (offerings.childElementCount > 160) return;
    bell(1320, 0.12);
    for (let i = 0; i < n; i++) {
      const f = document.createElement("span");
      const kind = FLOWERS[(Math.random() * FLOWERS.length) | 0];
      f.className = "offer " + kind;
      if (kind === "emoji") f.textContent = EMOJI[(Math.random() * EMOJI.length) | 0];
      const x0 = r.width * (0.25 + Math.random() * 0.5);
      const x1 = x0 + (Math.random() * 80 - 40);
      // land around the lap and feet
      const y1 = r.height * (0.62 + Math.random() * 0.3);
      f.style.setProperty("--x0", x0 + "px");
      f.style.setProperty("--x1", x1 + "px");
      f.style.setProperty("--y1", y1 + "px");
      f.style.setProperty("--rot", Math.random() * 540 - 270 + "deg");
      f.style.setProperty("--dur", 1.3 + Math.random() * 0.9 + "s");
      f.style.setProperty("--stay", 2.6 + Math.random() * 1.2 + "s");
      f.style.animationDelay = Math.random() * 0.6 + "s, " + (2.6 + Math.random() * 1.2) + "s";
      offerings.appendChild(f);
      setTimeout(() => f.remove(), 5200);
    }
    if (Date.now() - lastPushpToast > 4000) {
      lastPushpToast = Date.now();
      showToast(T("🌸 पुष्पांजलि अर्पित — जय श्री हरि 🙏", "🌸 Flowers offered — Jai Shri Hari 🙏"));
    }
  }
  $("pushpBtn").addEventListener("click", () => pushpanjali(26));
  $("deity").addEventListener("click", () => pushpanjali(12));

  // ----- Countdown -----
  const pad = (n) => String(n).padStart(2, "0");
  let timer;
  function tick() {
    const diff = START - Date.now();
    if (diff <= 0) {
      $("countdown").hidden = true;
      $("cdDone").hidden = false;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    $("cdD").textContent = Math.floor(s / 86400);
    $("cdH").textContent = pad(Math.floor((s % 86400) / 3600));
    $("cdM").textContent = pad(Math.floor((s % 3600) / 60));
    $("cdS").textContent = pad(s % 60);
  }
  if (capture) {
    // A saved file can't count down, so show the three dates instead
    const cd = $("countdown");
    cd.classList.add("static");
    cd.innerHTML = "<div><span>19</span><small>गुरुवार</small></div><div><span>20</span><small>शुक्रवार</small></div><div><span>21</span><small>शनिवार</small></div>";
    cd.closest(".card").querySelector("h2").textContent = "पावन तिथियाँ";
    cd.parentElement.querySelector(".cd-sub").textContent = "नवंबर 2026";
    if (capture === "pdf") {
      gate.remove();
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
    }
  } else {
    tick();
    timer = setInterval(tick, 1000);
  }

  // ----- Links -----
  const details =
    "19 नवंबर – वेदी निर्माण एवं अखण्ड हरिकीर्तन\n" +
    "20 नवंबर – वेदी आवाहन पूजन एवं एकादशी महात्मकथा\n" +
    "21 नवंबर – वेदी पूजन, हवन पूर्णाहुति एवं हरिनाम अमृत भोज (1 बजे से)\n" +
    "संपर्क: +91 95727 74629, +91 98010 36864";
  $("calBtn").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(TITLE) +
    "&dates=20261119/20261122" +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent("ग्राम मुर्हीं");

  const TITLE_EN = "Ekadashi Udyapan & Akhand Harikirtan";
  function setReplyLink() {
    $("waBtn").href =
      `https://wa.me/${PHONE}?text=` +
      encodeURIComponent(T(
        `जय श्री हरि 🙏\n${TITLE} के निमंत्रण के लिए धन्यवाद। हम अवश्य उपस्थित होंगे।` + (guest ? `\n\n— ${guest}` : ""),
        `Jai Shri Hari 🙏\nThank you for the invitation to the ${TITLE_EN}. We will surely be there.` + (guest ? `\n\n— ${guest}` : "")
      ));
  }

  $("shareBtn").addEventListener("click", async () => {
    const url = location.href.split("?")[0];
    const text = T(
      `🪔 सादर आमंत्रण 🪔\n${TITLE}\n19–21 नवंबर 2026 · ग्राम मुर्हीं`,
      `🪔 You are invited 🪔\n${TITLE_EN}\n19–21 November 2026 · Village Murhi`
    );
    if (navigator.share) {
      try { await navigator.share({ title: TITLE, text, url }); } catch (_) { /* cancelled */ }
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank");
    }
  });

  // ----- Jap mala (108 beads) -----
  const BEADS = 108;
  const malaRing = $("malaRing");
  const malaBtn = $("mala");
  if (malaRing && malaBtn) {
    const NS = "http://www.w3.org/2000/svg";
    const beads = [];
    for (let i = 0; i < BEADS; i++) {
      const a = (i / BEADS) * Math.PI * 2;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", (Math.sin(a) * 92).toFixed(2));
      c.setAttribute("cy", (-Math.cos(a) * 92).toFixed(2));
      c.setAttribute("r", "2.55");
      c.setAttribute("stroke", "#7a4a02");
      c.setAttribute("stroke-width", ".5");
      malaRing.appendChild(c);
      beads.push(c);
    }
    let total = parseInt(store.get("japTotal") || "0", 10) || 0;
    let doneFlash = false;
    const countEl = $("malaCount"), roundsEl = $("malaRounds"), totalEl = $("malaTotal"), mantraEl = $("malaMantra");
    function paint() {
      const n = doneFlash ? BEADS : total % BEADS;
      beads.forEach((b, i) => {
        b.setAttribute("fill", i < n ? "url(#beadDone)" : "url(#beadGold)");
        b.classList.toggle("cur", i === total % BEADS);
        b.setAttribute("r", i === total % BEADS ? "3.6" : "2.55");
      });
      // turn the mala so the next bead sits under the pointer
      malaRing.style.transform = `rotate(${-(total * 360) / BEADS}deg)`;
      countEl.textContent = doneFlash ? BEADS : total % BEADS;
      roundsEl.textContent = Math.floor(total / BEADS);
      totalEl.textContent = total;
    }
    function chant() {
      total++;
      store.set("japTotal", String(total));
      const om = document.createElement("span");
      om.className = "om-float";
      om.textContent = "ॐ";
      om.style.setProperty("--dx", Math.random() * 60 - 30 + "px");
      malaBtn.appendChild(om);
      setTimeout(() => om.remove(), 1250);
      mantraEl.classList.remove("pop"); void mantraEl.offsetWidth; mantraEl.classList.add("pop");
      setTimeout(() => mantraEl.classList.remove("pop"), 160);
      if (total % BEADS === 0) {
        doneFlash = true;
        malaBtn.classList.remove("done"); void malaBtn.offsetWidth; malaBtn.classList.add("done");
        bell(620, 0.35);
        setTimeout(() => bell(740, 0.28), 380);
        ringBells();
        burstPetals(18);
        showToast(T(`🙏 एक माला पूर्ण — जय श्री हरि! (${total / BEADS})`, `🙏 One mala complete — Jai Shri Hari! (${total / BEADS})`));
        setTimeout(() => { doneFlash = false; paint(); }, 1100);
      } else {
        bell(1760, 0.045); // soft bead click
      }
      paint();
    }
    malaBtn.addEventListener("click", chant);
    $("malaReset").addEventListener("click", () => {
      total = 0;
      store.set("japTotal", "0");
      paint();
    });
    paint();
  }

  // ----- Deep jalayen (11 diyas) -----
  const dps = [...document.querySelectorAll("#deepmala .dp")];
  const diyaBtn = $("diyaBtn");
  if (dps.length && diyaBtn) {
    const DIYAS = dps.length;
    let lit = Math.min(DIYAS, parseInt(store.get("diyaLit") || "0", 10) || 0);
    let diyaTotal = parseInt(store.get("diyaTotal") || "0", 10) || 0;
    function paintDiyas() {
      dps.forEach((d, i) => d.classList.toggle("lit", i < lit));
      $("deepmala").classList.toggle("full", lit >= DIYAS);
      $("dpCount").textContent = lit;
      $("dpTotal").textContent = diyaTotal;
      if (lit >= DIYAS) setLabel(diyaBtn, "🔁 नई दीपमाला सजाएँ", "🔁 Light a New Deepmala");
      else setLabel(diyaBtn, "🪔 दीप जलाएँ", "🪔 Light a Diya");
    }
    function lightDiya() {
      if (lit >= DIYAS) { // start a fresh deepmala
        lit = 0;
        store.set("diyaLit", "0");
        paintDiyas();
        return;
      }
      lit++;
      diyaTotal++;
      store.set("diyaLit", String(lit));
      store.set("diyaTotal", String(diyaTotal));
      paintDiyas();
      if (lit >= DIYAS) {
        bell(620, 0.3);
        setTimeout(() => bell(740, 0.25), 380);
        ringBells();
        burstPetals(22);
        showToast(T("✨ दीपमाला पूर्ण — जय श्री हरि! 🙏", "✨ Deepmala complete — Jai Shri Hari! 🙏"));
      } else {
        bell(1320, 0.1);
        showToast(T("🪔 आपने दीप प्रज्वलित किया 🙏", "🪔 You lit a diya 🙏"));
      }
    }
    diyaBtn.addEventListener("click", lightDiya);
    dps.forEach((d) => d.addEventListener("click", () => { if (!d.classList.contains("lit")) lightDiya(); }));
    paintDiyas();
  }

  // ----- Tell the host this guest opened the invitation (once per visit) -----
  if (guest && !capture && !sess.get("tracked")) {
    sess.set("tracked", "1");
    fetch("api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: guest }),
      keepalive: true,
    }).catch(() => { /* offline or storage not set up */ });
  }

  // ----- Day-by-day: before / during (19, 20, 21 Nov) / after the ceremony -----
  // Preview any day with ?today=2026-11-20
  const DAYS = [
    { date: "2026-11-19", hi: ["प्रथम दिवस · गुरुवार", "वेदी निर्माण एवं अखण्ड हरिकीर्तन"], en: ["Day 1 · Thursday", "Vedi Nirman & Akhand Harikirtan"] },
    { date: "2026-11-20", hi: ["द्वितीय दिवस · शुक्रवार", "वेदी आवाहन पूजन एवं एकादशी महात्मकथा"], en: ["Day 2 · Friday", "Vedi Avahan Pujan & Ekadashi Mahatma Katha"] },
    { date: "2026-11-21", hi: ["तृतीय दिवस · शनिवार", "वेदी पूजन, हवन पूर्णाहुति एवं हरिनाम अमृत भोज (1 बजे से)"], en: ["Day 3 · Saturday", "Vedi Pujan, Havan Purnahuti & Harinam Amrit Bhoj (from 1 PM)"] },
  ];
  const todayIST = () => {
    const t = qs.get("today");
    if (t && /^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
    return new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);
  };
  // "before" | 0 | 1 | 2 | "after"
  function phase() {
    const d = todayIST();
    if (d < DAYS[0].date) return "before";
    if (d > DAYS[2].date) return "after";
    return DAYS.findIndex((x) => x.date === d);
  }
  let shownPhase = null;
  function renderDay() {
    const ph = capture ? "before" : phase();
    shownPhase = ph;
    const strip = $("todayStrip"), gt = $("gateToday"), box = $("todayBox");
    const items = document.querySelectorAll("#timeline li");
    items.forEach((li, i) => {
      li.classList.toggle("today", ph === i);
      li.classList.toggle("done", ph === "after" || (typeof ph === "number" && i < ph));
    });
    if (ph === "before") {
      strip.hidden = true; if (gt) gt.hidden = true; box.hidden = true;
      return;
    }
    clearInterval(timer);
    $("countdown").hidden = true;
    $("cdDone").hidden = true;
    $("rsvpCard").hidden = ph === "after";
    box.hidden = false;
    strip.hidden = false;
    if (ph === "after") {
      const msg = T("🙏 पावन अनुष्ठान सम्पन्न हुआ", "🙏 The sacred ceremony is complete");
      strip.innerHTML = `<b>${msg}</b><span>${T("आपकी उपस्थिति एवं शुभकामनाओं के लिए हृदय से धन्यवाद", "Heartfelt thanks for your presence and blessings")}</span>`;
      setLabel($("cdTitle"), "अनुष्ठान सम्पन्न", "Ceremony Complete");
      box.innerHTML = `<p class="tb-done">${T("भगवान श्री हरि विष्णु की कृपा से तीनों दिवस का अनुष्ठान सकुशल सम्पन्न हुआ। आपकी उपस्थिति और आशीर्वाद के लिए धन्यवाद। जय श्री हरि!", "By the grace of Bhagwan Shri Hari Vishnu, all three days were completed successfully. Thank you for your presence and blessings. Jai Shri Hari!")}</p>`;
      if (gt) { gt.hidden = false; gt.textContent = msg; }
    } else {
      const d = DAYS[ph], next = DAYS[ph + 1];
      const L = (x) => (lang === "en" ? x.en : x.hi);
      strip.innerHTML = `<b><i class="live"></i>${T("आज", "Today")}: ${L(d)[0]}</b><span>${L(d)[1]}</span>`;
      setLabel($("cdTitle"), "आज का कार्यक्रम", "Today's Programme");
      box.innerHTML =
        `<p class="tb-badge"><i class="live"></i>${T("अनुष्ठान जारी है", "Ceremony in progress")}</p>` +
        `<p class="tb-day">${L(d)[0]}</p><p class="tb-what">${L(d)[1]}</p>` +
        (next ? `<p class="tb-next">${T("कल", "Tomorrow")}: ${L(next)[1]}</p>` : `<p class="tb-next">${T("आज अंतिम दिवस है — हरिनाम अमृत भोज में अवश्य पधारें 🙏", "Today is the final day — please join the Harinam Amrit Bhoj 🙏")}</p>`);
      if (gt) { gt.hidden = false; gt.innerHTML = `<i class="live"></i>${T("आज", "Today")}: ${L(d)[1]}`; }
    }
  }
  // move to the next day by itself if the page stays open over midnight
  setInterval(() => { if (!capture && phase() !== shownPhase) renderDay(); }, 60000);

  // ----- RSVP: will you come? -----
  const RSVP_TEXT = {
    yes: (n) => T(`धन्यवाद! 🙏 आपकी प्रतीक्षा रहेगी — ${n} ${n > 1 ? "लोग" : "व्यक्ति"}`, `Thank you! 🙏 We look forward to welcoming you — ${n} ${n > 1 ? "people" : "person"}`),
    maybe: () => T("धन्यवाद! 🙏 आशा है आप अवश्य आ पाएँगे", "Thank you! 🙏 We hope you can make it"),
    no: () => T("कोई बात नहीं 🙏 आपकी शुभकामनाएँ हमारे साथ हैं", "No worries 🙏 Your good wishes are with us"),
  };
  let rsvpStatus = null, people = 1;
  let saved = (() => { try { return JSON.parse(store.get("rsvp")); } catch (_) { return null; } })();
  $("rsvpName").value = (saved && saved.name) || guest;
  function setStatus(st) {
    rsvpStatus = st;
    document.querySelectorAll(".rc").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.status === st)));
    $("rsvpPeople").classList.toggle("off", st === "no");
  }
  function setPeople(n) { people = Math.min(50, Math.max(1, n)); $("pplCount").textContent = people; }
  if (saved) { setStatus(saved.status); setPeople(saved.people || 1); $("rsvpNote").value = saved.note || ""; }
  function showRsvpDone(entry) {
    $("rsvpForm").hidden = true;
    $("rsvpDone").hidden = false;
    $("rsvpThanks").textContent = RSVP_TEXT[entry.status](entry.people);
  }
  function renderRsvpText() {
    $("rsvpNote").placeholder = T("कोई संदेश या शुभकामना (वैकल्पिक)", "A message or blessing (optional)");
    if (!$("rsvpDone").hidden && saved) $("rsvpThanks").textContent = RSVP_TEXT[saved.status](saved.people);
  }
  if (saved) showRsvpDone(saved);
  document.querySelectorAll(".rc").forEach((b) => b.addEventListener("click", () => setStatus(b.dataset.status)));
  $("pplMinus").addEventListener("click", () => setPeople(people - 1));
  $("pplPlus").addEventListener("click", () => setPeople(people + 1));
  $("rsvpEdit").addEventListener("click", () => { $("rsvpDone").hidden = true; $("rsvpForm").hidden = false; });
  $("rsvpForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("rsvpMsg");
    const name = $("rsvpName").value.replace(/\s+/g, " ").trim();
    if (!name) { msg.textContent = T("कृपया अपना नाम लिखें", "Please write your name"); $("rsvpName").focus(); return; }
    if (!rsvpStatus) { msg.textContent = T("कृपया ऊपर से एक उत्तर चुनें", "Please choose a reply above"); return; }
    const entry = { name, status: rsvpStatus, people: rsvpStatus === "no" ? 0 : people, note: $("rsvpNote").value.trim() };
    $("rsvpSend").disabled = true;
    msg.textContent = T("भेजा जा रहा है…", "Sending…");
    try {
      const r = await fetch("api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry) });
      if (!r.ok) throw new Error(r.status);
      store.set("rsvp", JSON.stringify(entry));
      saved = entry;
      msg.textContent = "";
      showRsvpDone(entry);
      if (entry.status !== "no") { bell(700, 0.3); burstPetals(24); }
    } catch (_) {
      // storage not set up or offline: send the same reply on WhatsApp instead
      const label = { yes: T("हाँ, हम आएँगे", "Yes, we will come"), maybe: T("शायद", "Maybe"), no: T("नहीं आ पाएँगे", "Can't make it") }[entry.status];
      const text = `${T("जय श्री हरि 🙏", "Jai Shri Hari 🙏")}\n${TITLE}\n\n${T("नाम", "Name")}: ${name}\n${T("उत्तर", "Reply")}: ${label}` +
        (entry.people ? `\n${T("लोग", "People")}: ${entry.people}` : "") + (entry.note ? `\n${entry.note}` : "");
      msg.innerHTML = "";
      const a = document.createElement("a");
      a.className = "btn btn-red";
      a.target = "_blank"; a.rel = "noopener";
      a.href = `https://wa.me/${PHONE}?text=` + encodeURIComponent(text);
      a.textContent = T("💬 WhatsApp पर उत्तर भेजें", "💬 Send reply on WhatsApp");
      msg.append(T("उत्तर सहेजा नहीं जा सका। कृपया WhatsApp से भेजें:", "Couldn't save the reply. Please send it on WhatsApp:"), document.createElement("br"), a);
    } finally {
      $("rsvpSend").disabled = false;
    }
  });

  // ----- Personal card (image with the guest's name) for WhatsApp status -----
  const cardName = $("cardName");
  cardName.value = guest || store.get("cardName") || "";
  let cardBlob = null, cardTimer, cardBusy = 0;
  const vishnuImg = new Image();
  vishnuImg.src = "assets/vishnu.webp";
  const imgReady = new Promise((r) => { vishnuImg.onload = r; vishnuImg.onerror = r; });
  function fitText(ctx, text, maxW, size, font) {
    let s = size;
    ctx.font = `${s}px ${font}`;
    while (ctx.measureText(text).width > maxW && s > 30) { s -= 2; ctx.font = `${s}px ${font}`; }
    return s;
  }
  async function drawCard() {
    const job = ++cardBusy;
    try { await Promise.all([document.fonts.load('60px "Yatra One"'), document.fonts.load('40px "Kalam"'), document.fonts.load('600 40px "Poppins"')]); } catch (_) { /* fallback fonts */ }
    await imgReady;
    if (job !== cardBusy) return; // a newer name was typed
    const W = 1080, H = 1920, cx = 540, cy = 700;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d");
    // background
    let g = c.createRadialGradient(cx, cy, 50, cx, cy, 1300);
    g.addColorStop(0, "#a8301a"); g.addColorStop(0.35, "#6b0f0a"); g.addColorStop(0.75, "#2a0402"); g.addColorStop(1, "#140100");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // light rays
    c.save(); c.translate(cx, cy);
    for (let i = 0; i < 60; i++) {
      c.rotate((Math.PI * 2) / 60);
      c.beginPath(); c.moveTo(0, 0); c.lineTo(-22, -1400); c.lineTo(22, -1400); c.closePath();
      c.fillStyle = "rgba(255, 205, 110, 0.05)"; c.fill();
    }
    c.restore();
    // marigold toran
    for (let x = -20; x < W + 40; x += 34) {
      const y = 34 + 20 * Math.abs(Math.sin((x / W) * Math.PI * 3));
      c.beginPath(); c.arc(x, y, 20, 0, Math.PI * 2);
      c.fillStyle = (x / 34) % 2 ? "#ffb000" : "#ff7a1a"; c.fill();
      c.beginPath(); c.arc(x, y, 6, 0, Math.PI * 2); c.fillStyle = "#c93420"; c.fill();
    }
    [120, 380, 700, 960].forEach((x, k) => {
      for (let j = 0; j < (k % 2 ? 3 : 5); j++) {
        c.beginPath(); c.arc(x, 90 + j * 34, 16, 0, Math.PI * 2);
        c.fillStyle = j % 2 ? "#ffb000" : "#ff7a1a"; c.fill();
      }
    });
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillStyle = "#ffd970"; c.font = '52px "Yatra One"';
    c.fillText("॥ श्री गणेशाय नमः ॥", cx, 300);
    // glow + medallion
    g = c.createRadialGradient(cx, cy, 200, cx, cy, 460);
    g.addColorStop(0, "rgba(255, 220, 130, 0.55)"); g.addColorStop(1, "rgba(255, 170, 60, 0)");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 460, 0, Math.PI * 2); c.fill();
    const R = 250;
    g = c.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    g.addColorStop(0, "#a86b05"); g.addColorStop(0.3, "#ffd970"); g.addColorStop(0.55, "#e9a417"); g.addColorStop(0.7, "#fff1b8"); g.addColorStop(1, "#b77a08");
    c.fillStyle = "#4e0a05"; c.beginPath(); c.arc(cx, cy, R + 22, 0, Math.PI * 2); c.fill();
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R + 14, 0, Math.PI * 2); c.fill();
    c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
    g = c.createRadialGradient(cx, cy - 80, 20, cx, cy, R);
    g.addColorStop(0, "#fff6d8"); g.addColorStop(0.45, "#ffd58f"); g.addColorStop(1, "#f39a3d");
    c.fillStyle = g; c.fillRect(cx - R, cy - R, R * 2, R * 2);
    if (vishnuImg.naturalWidth) {
      const iw = R * 2 * 1.16, ih = iw * (vishnuImg.naturalHeight / vishnuImg.naturalWidth);
      c.drawImage(vishnuImg, cx - iw / 2, cy - R + R * 2 * 0.04, iw, ih);
    }
    c.restore();
    // name
    const name = cardName.value.replace(/\s+/g, " ").trim();
    c.fillStyle = "#fff7e8"; c.font = '50px "Yatra One"';
    c.fillText(name ? T("विशेष अतिथि", "Special Guest") : T("सादर आमंत्रण", "You are invited"), cx, 1050);
    if (name) {
      const s = fitText(c, name, 960, 120, '"Yatra One"');
      g = c.createLinearGradient(cx - 450, 0, cx + 450, 0);
      g.addColorStop(0, "#b77a08"); g.addColorStop(0.3, "#ffd970"); g.addColorStop(0.5, "#fff6d2"); g.addColorStop(0.7, "#e9a417"); g.addColorStop(1, "#b77a08");
      c.shadowColor = "rgba(255, 190, 60, 0.6)"; c.shadowBlur = 30;
      c.fillStyle = g; c.font = `${s}px "Yatra One"`;
      c.fillText(name, cx, 1160);
      c.shadowBlur = 0;
    }
    // divider
    g = c.createLinearGradient(140, 0, 940, 0);
    g.addColorStop(0, "rgba(233,164,23,0)"); g.addColorStop(0.5, "#ffd970"); g.addColorStop(1, "rgba(233,164,23,0)");
    c.fillStyle = g; c.fillRect(140, 1250, 800, 3);
    c.fillStyle = "#e9a417"; c.beginPath(); c.arc(cx, 1251, 9, 0, Math.PI * 2); c.fill();
    // ceremony
    c.fillStyle = "#fff7e8"; c.font = '72px "Yatra One"';
    c.fillText(T("एकादशी उद्यापन एवं", "Ekadashi Udyapan &"), cx, 1350);
    c.fillText(T("अखण्ड हरिकीर्तन", "Akhand Harikirtan"), cx, 1450);
    // date pill
    const dt = T("19 – 21 नवंबर 2026  ✦  ग्राम मुर्हीं", "19 – 21 November 2026  ✦  Village Murhi");
    c.font = '600 42px "Poppins", "Kalam"';
    const pw = c.measureText(dt).width + 90;
    c.beginPath(); c.roundRect ? c.roundRect(cx - pw / 2, 1520, pw, 90, 45) : c.rect(cx - pw / 2, 1520, pw, 90);
    c.fillStyle = "rgba(30, 2, 0, 0.5)"; c.fill();
    c.strokeStyle = "rgba(233, 164, 23, 0.8)"; c.lineWidth = 3; c.stroke();
    c.fillStyle = "#ffd970"; c.fillText(dt, cx, 1567);
    c.fillStyle = "#fff7e8"; c.font = '46px "Kalam"';
    c.fillText(T("आप भी सपरिवार सादर आमंत्रित हैं", "You and your family are warmly invited"), cx, 1680);
    // golden ledge with diyas
    g = c.createLinearGradient(0, 1780, 0, H);
    g.addColorStop(0, "#ffd970"); g.addColorStop(0.08, "#e9a417"); g.addColorStop(0.12, "#6b0f0a"); g.addColorStop(1, "#2a0402");
    c.fillStyle = g; c.fillRect(0, 1780, W, H - 1780);
    [150, 330, 750, 930].forEach((x) => {
      c.fillStyle = "#c2551d"; c.beginPath(); c.ellipse(x, 1782, 62, 34, 0, 0, Math.PI); c.fill();
      const f = c.createRadialGradient(x, 1745, 2, x, 1745, 40);
      f.addColorStop(0, "#fffbe0"); f.addColorStop(0.4, "#ffc94a"); f.addColorStop(1, "rgba(255, 120, 20, 0)");
      c.fillStyle = f; c.beginPath(); c.ellipse(x, 1740, 18, 40, 0, 0, Math.PI * 2); c.fill();
    });
    c.fillStyle = "#ffd970"; c.font = '46px "Yatra One"';
    c.fillText("शुभ  ✦  लाभ", cx, 1850);
    c.fillStyle = "rgba(255, 247, 232, 0.6)"; c.font = '28px "Poppins"';
    c.fillText(location.host || "ekadashipuja.vercel.app", cx, 1898);

    cv.toBlob((b) => {
      if (job !== cardBusy || !b) return;
      cardBlob = b;
      const old = $("cardImg").src;
      $("cardImg").src = URL.createObjectURL(b);
      if (old.startsWith("blob:")) URL.revokeObjectURL(old);
      $("cardLoading").hidden = true;
    }, "image/jpeg", 0.9);
  }
  const cardFile = () => new File([cardBlob], `Ekadashi-Nimantran-${(cardName.value.trim() || "card").replace(/[^\p{L}\p{N}]+/gu, "-")}.jpg`, { type: "image/jpeg" });
  function saveCard() {
    if (!cardBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(cardBlob);
    a.download = cardFile().name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  $("cardSave").addEventListener("click", saveCard);
  $("cardShare").addEventListener("click", async () => {
    if (!cardBlob) return;
    const file = cardFile();
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: `🪔 ${TITLE} · 19–21 नवंबर 2026 · ग्राम मुर्हीं` }); } catch (_) { /* cancelled */ }
    } else {
      saveCard();
      showToast(T("कार्ड डाउनलोड हो गया — अब इसे WhatsApp स्टेटस पर लगाएँ 🙏", "Card downloaded — now add it to your WhatsApp status 🙏"));
    }
  });
  cardName.addEventListener("input", () => {
    store.set("cardName", cardName.value);
    clearTimeout(cardTimer);
    cardTimer = setTimeout(drawCard, 350);
  });
  // draw it once the card is near the screen (saves work for people who never scroll there)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); drawCard(); } }, { rootMargin: "600px" });
    io.observe($("photoCard"));
  } else drawCard();

  // ----- Apply language -----
  function applyLang() {
    document.documentElement.lang = lang;
    document.body.classList.toggle("en", lang === "en");
    document.querySelectorAll("[data-en]").forEach((el) => {
      if (el.dataset.hi === undefined) el.dataset.hi = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.hi;
    });
    document.querySelectorAll("[data-en-label]").forEach((el) => {
      if (el.dataset.hiLabel === undefined) el.dataset.hiLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enLabel : el.dataset.hiLabel);
    });
    document.title = (guest ? guest + " · " : "") + T(
      "सादर आमंत्रण · एकादशी उद्यापन एवं अखण्ड हरिकीर्तन",
      "You Are Invited · Ekadashi Udyapan & Akhand Harikirtan"
    );
    document.querySelectorAll("#langSwitch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    renderGuest();
    setReplyLink();
    renderDay();
    renderRsvpText();
    if (cardBlob) drawCard();
  }
  document.querySelectorAll("#langSwitch button").forEach((b) =>
    b.addEventListener("click", () => {
      if (lang === b.dataset.lang) return;
      lang = b.dataset.lang;
      store.set("lang", lang);
      applyLang();
    })
  );
  applyLang();

  // tuck the language switch away while scrolling down, bring it back on scroll up
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    $("langSwitch").classList.toggle("tucked", y > 140 && y > lastY);
    lastY = y;
  }, { passive: true });
})();
