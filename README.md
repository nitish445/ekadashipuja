# एकादशी उद्यापन एवं अखण्ड हरिकीर्तन — Personal Invitations

A copy of the invitation site (https://ekadashipuja.vercel.app/) that can be sent person to person,
with each guest's name shown on the front page in animated golden letters.

## Sending a personal invitation

1. Open **`/create.html`** on the deployed site.
2. Type the guests' names, one per line (e.g. `शर्मा परिवार`, `Sunita Ji`).
3. For each name, tap **WhatsApp** to send the message and link, or copy the link.

The link looks like `https://<your-site>/?guest=शर्मा%20परिवार` (add `&lang=en` for English).
`?to=` and `?name=` work too. Without a name, the page looks like the original invitation.

## What the guest sees

- Front page: “विशेष आमंत्रण / A personal invitation for”, then the guest's name. Each letter
  rises in with a blur, then a gold shimmer passes over it, with twinkling stars, side ornaments
  and an underline that draws itself.
- Browser tab title starts with the guest's name.
- Inside the invitation: a shimmering “आदरणीय … — आपकी प्रतीक्षा रहेगी 🙏” banner.

It is a static site with no build step, so it deploys to Vercel as is.
