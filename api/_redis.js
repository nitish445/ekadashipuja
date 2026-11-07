// Tiny client for Upstash Redis over its REST API (no npm packages needed).
// Works with the env vars that Vercel's Upstash / KV integration adds.
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const configured = () => Boolean(URL_ && TOKEN);

// run several commands in one request: [["HSET", "k", "f", "v"], ...]
async function pipeline(cmds) {
  const r = await fetch(URL_.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  const out = await r.json();
  return out.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}

// Redis HGETALL comes back as [field, value, field, value, ...]
const pairs = (arr) => {
  const o = {};
  for (let i = 0; arr && i < arr.length; i += 2) o[arr[i]] = arr[i + 1];
  return o;
};

const cleanName = (n) => String(n || "").replace(/\s+/g, " ").trim().slice(0, 60);

function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try { return JSON.parse(req.body || "{}"); } catch (_) { return {}; }
}

module.exports = { configured, pipeline, pairs, cleanName, body };
