// GET /api/status  (header x-admin-key: <ADMIN_KEY>) — who opened, who is coming
const { configured, pipeline, pairs } = require("./_redis");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const key = process.env.ADMIN_KEY;
  if (!key) return res.status(503).json({ error: "ADMIN_KEY not set" });
  if (req.headers["x-admin-key"] !== key) return res.status(401).json({ error: "wrong key" });
  if (!configured()) return res.status(503).json({ error: "storage not set up" });
  try {
    const [count, first, last, rsvp] = await pipeline([
      ["HGETALL", "open_count"],
      ["HGETALL", "open_first"],
      ["HGETALL", "open_last"],
      ["HGETALL", "rsvp"],
    ]);
    const c = pairs(count), f = pairs(first), l = pairs(last), r = pairs(rsvp);
    const guests = {};
    const g = (n) => (guests[n] = guests[n] || { name: n });
    Object.keys(c).forEach((n) => Object.assign(g(n), { opens: Number(c[n]), firstOpen: f[n], lastOpen: l[n] }));
    Object.keys(r).forEach((n) => { try { g(n).rsvp = JSON.parse(r[n]); } catch (_) { /* skip bad row */ } });
    res.status(200).json({ guests: Object.values(guests) });
  } catch (e) {
    res.status(500).json({ error: "could not read" });
  }
};
