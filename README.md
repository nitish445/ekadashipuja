# एकादशी उद्यापन एवं अखण्ड हरिकीर्तन — Personal Invitations

A copy of the invitation site (https://ekadashipuja.vercel.app/) that can be sent person to person,
with each guest's name shown on the front page in animated golden letters.

## Sending a personal invitation

1. Open **`/create.html`** on the deployed site.
2. Type the guests' names, one per line (e.g. `शर्मा परिवार`, `Sunita Ji`).
3. For each name, tap **WhatsApp** to send the message and link, or copy the link.

The link looks like `https://<your-site>/?i=h1nMJ2qvO2dZjOD738`. The name and language are turned
into a code, so the link doesn't show the name, and once the page opens the address bar is
cleaned to just `https://<your-site>/`. A refresh in the same tab keeps the name.
Old `?guest=Name` links still work. Without a name, the page looks like the original invitation.

## What the guest sees

- First, a full-screen intro: “॥ जय श्री हरि ॥”, “आदरणीय”, then the guest's name appears letter by
  letter in glowing gold with a burst of light, then “आपके लिए एक विशेष निमंत्रण है 🙏”.
  After about 7 seconds (or a tap) it fades into the usual front page.
- Front page: “विशेष आमंत्रण / A personal invitation for”, then the guest's name. Each letter
  rises in with a blur, then a gold shimmer passes over it, with twinkling stars, side ornaments
  and an underline that draws itself.
- Browser tab title starts with the guest's name.
- Inside the invitation: a sealed red envelope addressed “सेवा में, <name>” with a gold ॐ seal.
  Tapping the seal opens the flap, the letter slides out and unfolds, and each line is written
  out by hand (“प्रिय <name>, …”). Golden sparkles follow every tap on the screen, and each card
  gets a gold shine as it scrolls into view. The WhatsApp reply is signed with the guest's name.
- Also inside the invitation: a shimmering “आदरणीय … — आपकी प्रतीक्षा रहेगी 🙏” banner.

It is a static site with no build step, so it deploys to Vercel as is.

## Who opened · RSVP · personal card · day-by-day

- **Who opened**: each personal link reports when it is opened. `create.html` shows ✅/⏳ under every name.
- **RSVP**: guests choose “हाँ / शायद / नहीं”, how many people, and an optional message.
  `create.html` shows totals (how many are coming, how many people) and each reply.
  If storage isn't set up yet, the guest is offered the same reply on WhatsApp instead.
- **Personal card**: a 1080×1920 image with the guest's name for WhatsApp status (share or download).
- **Day by day**: on 19, 20 and 21 Nov (India time) the page shows “आज …”, highlights today in the
  programme and ticks the days already done; after the 21st it shows a thank-you. Preview any day
  with `?today=2026-11-20`.

### One-time setup on Vercel (for “who opened” and RSVP)

1. Vercel → this project → **Storage** → **Create / Connect** → **Upstash for Redis** (free) →
   connect it to this project. Vercel adds the connection settings by itself.
2. Vercel → this project → **Settings → Environment Variables** → add `ADMIN_KEY` with a password
   of your choice. Only people with this password can see the replies.
3. **Redeploy** the project.
4. Open `/create.html`, type the `ADMIN_KEY` in “एडमिन कुंजी” and tap **स्थिति देखें**.

The functions live in `api/` (`track.js`, `rsvp.js`, `status.js`) and need no npm packages.
