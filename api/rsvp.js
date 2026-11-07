// POST /api/rsvp  {name, status: yes|maybe|no, people, note}
const { configured, pipeline, cleanName, body } = require("./_redis");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!configured()) return res.status(503).json({ error: "storage not set up" });
  const b = body(req);
  const name = cleanName(b.name);
  const status = ["yes", "maybe", "no"].includes(b.status) ? b.status : null;
  if (!name || !status) return res.status(400).json({ error: "name and status required" });
  const people = status === "no" ? 0 : Math.min(50, Math.max(1, parseInt(b.people, 10) || 1));
  const note = String(b.note || "").trim().slice(0, 300);
  const entry = { status, people, note, at: new Date().toISOString() };
  try {
    await pipeline([["HSET", "rsvp", name, JSON.stringify(entry)]]);
    res.status(200).json({ ok: true, entry });
  } catch (e) {
    res.status(500).json({ error: "could not save" });
  }
};
