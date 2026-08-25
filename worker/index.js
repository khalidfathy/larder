/**
 * Larder Worker — serves the static site (public/) and a tiny sync API.
 *
 * Sync model: the client holds a private "sync code" (a long random string).
 * Data is stored in KV under a key derived from SHA-256(code), so the raw code
 * is never stored. Anyone presenting the correct code can read/write that record
 * — which is the whole point (it links a person's own devices). Keep it private.
 */

const MAX_BODY = 3_000_000; // ~3 MB cap on a stored state blob

function json(obj, status = 200, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, extra || {}),
  });
}

async function keyFor(code) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return "st_" + hex;
}

async function handleApi(request, env, url) {
  if (url.pathname !== "/api/state") return json({ error: "not_found" }, 404);
  if (!env.SYNC_KV) return json({ error: "sync_unavailable" }, 503);

  const code = request.headers.get("x-sync-code") || "";
  if (code.length < 8 || code.length > 200) return json({ error: "bad_code" }, 400);
  const key = await keyFor(code);

  if (request.method === "GET") {
    const val = await env.SYNC_KV.get(key);
    if (!val) return json({ data: null, updatedAt: null });
    return new Response(val, { status: 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }

  if (request.method === "PUT" || request.method === "POST") {
    const body = await request.text();
    if (body.length > MAX_BODY) return json({ error: "too_large" }, 413);
    let parsed;
    try { parsed = JSON.parse(body); } catch (e) { return json({ error: "bad_json" }, 400); }
    const data = (parsed && Object.prototype.hasOwnProperty.call(parsed, "data")) ? parsed.data : parsed;
    const record = JSON.stringify({ data, updatedAt: new Date().toISOString() });
    await env.SYNC_KV.put(key, record);
    return json({ ok: true, updatedAt: JSON.parse(record).updatedAt });
  }

  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  return json({ error: "method_not_allowed" }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    // Everything else is the static site.
    return env.ASSETS.fetch(request);
  },
};
