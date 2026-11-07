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
- Inside the invitation: a shimmering “आदरणीय … — आपकी प्रतीक्षा रहेगी 🙏” banner.

It is a static site with no build step, so it deploys to Vercel as is.
