// POST /api/track  {name}  — counts when a guest opens their invitation
const { configured, pipeline, cleanName, body } = require("./_redis");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!configured()) return res.status(503).json({ error: "storage not set up" });
  const name = cleanName(body(req).name);
  if (!name) return res.status(400).json({ error: "name required" });
  const now = new Date().toISOString();
  try {
    await pipeline([
      ["HINCRBY", "open_count", name, 1],
      ["HSETNX", "open_first", name, now],
      ["HSET", "open_last", name, now],
    ]);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "could not save" });
  }
};
