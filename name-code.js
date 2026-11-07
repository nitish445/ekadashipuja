// Turns a guest's name into a short code for the link (and back), so the link
// reads like  …/?i=h1Xk3f…  instead of showing  ?guest=शर्मा परिवार.
// Format: [h|e = language][1 = compact Devanagari/ASCII, 0 = UTF-8] + base64url(scrambled bytes)
window.NameCode = (() => {
  const mask = (bytes) => bytes.map((b, i) => b ^ ((i * 73 + 41) & 0xff));
  const toB64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const fromB64 = (s) => [...atob(s.replace(/-/g, "+").replace(/_/g, "/"))].map((c) => c.charCodeAt(0));

  function encode(name, lang) {
    const bytes = [];
    let compact = true;
    for (const ch of name) {
      const c = ch.codePointAt(0);
      if (c < 0x80) bytes.push(c);
      else if (c >= 0x900 && c <= 0x97f) bytes.push(0x80 + c - 0x900); // Devanagari in one byte
      else { compact = false; break; }
    }
    const data = compact ? bytes : [...new TextEncoder().encode(name)];
    return (lang === "en" ? "e" : "h") + (compact ? "1" : "0") + toB64(mask(data));
  }

  function decode(code) {
    try {
      const m = /^([he])([01])([A-Za-z0-9_-]+)$/.exec(code || "");
      if (!m) return null;
      const data = mask(fromB64(m[3]));
      const name = m[2] === "1"
        ? data.map((b) => String.fromCodePoint(b < 0x80 ? b : 0x900 + b - 0x80)).join("")
        : new TextDecoder().decode(new Uint8Array(data));
      return { name, lang: m[1] === "e" ? "en" : "hi" };
    } catch (_) {
      return null;
    }
  }

  return { encode, decode };
})();
