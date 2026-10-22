/* fm-templates-api — tiny D1-backed CRUD for the FM Guidelines template app.
 *
 * Public:  GET  /templates                    all live templates
 * Auth:    POST /auth                         validate a passphrase, returns the editor
 *          POST /templates                    create
 *          PUT  /templates/:id                update
 *          DELETE /templates/:id              soft delete
 *          POST /templates/:id/restore        undelete
 *          GET  /templates/:id/revisions      history for one template
 *          GET  /deleted                      soft-deleted templates
 *
 * Auth is "Authorization: Bearer <passphrase>", checked against editors.token_hash
 * (sha256(salt + passphrase)). Reads are public — the template data is already
 * public on the GitHub Pages site. No patient data ever touches this API.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Max-Age": "86400",
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS },
  });

async function sha256hex(s) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function editorFromAuth(request, env) {
  const m = (request.headers.get("Authorization") || "").match(/^Bearer (.+)$/);
  if (!m) return null;
  const { results } = await env.DB.prepare(
    "SELECT id, name, role, salt, token_hash FROM editors"
  ).all();
  for (const e of results) {
    if ((await sha256hex(e.salt + m[1])) === e.token_hash) {
      return { id: e.id, name: e.name, role: e.role };
    }
  }
  return null;
}

function slugify(title) {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return s || "template";
}

async function freshId(env, title) {
  const base = slugify(title);
  let id = base;
  for (let i = 2; i < 50; i++) {
    const hit = await env.DB.prepare("SELECT 1 FROM templates WHERE id = ?").bind(id).first();
    if (!hit) return id;
    id = base + "-" + i;
  }
  return base + "-" + crypto.randomUUID().slice(0, 8);
}

function validateTemplate(b) {
  if (!b || typeof b !== "object") return "bad JSON body";
  if (typeof b.title !== "string" || !b.title.trim()) return "title is required";
  if (typeof b.body !== "string" || !b.body.trim()) return "body is required";
  for (const k of ["title", "cat", "aliases"]) {
    if (b[k] != null && String(b[k]).length > 500) return k + " is too long";
  }
  if (b.body.length > 100000) return "body is too long";
  return null;
}

const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

function revisionStmt(env, t, action, editor) {
  return env.DB.prepare(
    "INSERT INTO revisions (template_id, action, title, cat, aliases, body, editor) VALUES (?,?,?,?,?,?,?)"
  ).bind(t.id, action, t.title, t.cat, t.aliases, t.body, editor.name);
}

async function getTemplate(env, id, includeDeleted = false) {
  return env.DB.prepare(
    "SELECT id, title, cat, aliases, body, sort, deleted_at, updated_at, updated_by FROM templates WHERE id = ?" +
      (includeDeleted ? "" : " AND deleted_at IS NULL")
  ).bind(id).first();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method;

    if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    try {
      if (method === "GET" && path === "/templates") {
        const { results } = await env.DB.prepare(
          "SELECT id, title, cat, aliases, body, updated_at, updated_by FROM templates WHERE deleted_at IS NULL ORDER BY sort, id"
        ).all();
        return json(results);
      }

      // Everything below requires a valid passphrase.
      const editor = await editorFromAuth(request, env);

      if (method === "POST" && path === "/auth") {
        if (!editor) return json({ error: "invalid passphrase" }, 401);
        return json({ editor });
      }

      if (!editor) return json({ error: "unauthorized" }, 401);

      if (method === "POST" && path === "/templates") {
        const b = await request.json().catch(() => null);
        const err = validateTemplate(b);
        if (err) return json({ error: err }, 400);
        const id = await freshId(env, b.title);
        const t = {
          id,
          title: b.title.trim(),
          cat: (b.cat || "").trim(),
          aliases: (b.aliases || "").trim(),
          body: b.body,
        };
        const maxSort = (await env.DB.prepare("SELECT COALESCE(MAX(sort),0) m FROM templates").first()).m;
        await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO templates (id, title, cat, aliases, body, sort, updated_at, updated_by) VALUES (?,?,?,?,?,?,?,?)"
          ).bind(t.id, t.title, t.cat, t.aliases, t.body, maxSort + 1, now(), editor.name),
          revisionStmt(env, t, "create", editor),
        ]);
        return json(await getTemplate(env, id), 201);
      }

      const one = path.match(/^\/templates\/([^/]+)$/);
      const restore = path.match(/^\/templates\/([^/]+)\/restore$/);
      const revs = path.match(/^\/templates\/([^/]+)\/revisions$/);

      if (method === "PUT" && one) {
        const id = decodeURIComponent(one[1]);
        const existing = await getTemplate(env, id);
        if (!existing) return json({ error: "not found" }, 404);
        const b = await request.json().catch(() => null);
        const err = validateTemplate(b);
        if (err) return json({ error: err }, 400);
        const t = {
          id,
          title: b.title.trim(),
          cat: (b.cat || "").trim(),
          aliases: (b.aliases || "").trim(),
          body: b.body,
        };
        await env.DB.batch([
          env.DB.prepare(
            "UPDATE templates SET title=?, cat=?, aliases=?, body=?, updated_at=?, updated_by=? WHERE id=?"
          ).bind(t.title, t.cat, t.aliases, t.body, now(), editor.name, id),
          revisionStmt(env, t, "update", editor),
        ]);
        return json(await getTemplate(env, id));
      }

      if (method === "DELETE" && one) {
        const id = decodeURIComponent(one[1]);
        const existing = await getTemplate(env, id);
        if (!existing) return json({ error: "not found" }, 404);
        await env.DB.batch([
          env.DB.prepare("UPDATE templates SET deleted_at=?, updated_at=?, updated_by=? WHERE id=?")
            .bind(now(), now(), editor.name, id),
          revisionStmt(env, existing, "delete", editor),
        ]);
        return json({ ok: true, id });
      }

      if (method === "POST" && restore) {
        const id = decodeURIComponent(restore[1]);
        const existing = await getTemplate(env, id, true);
        if (!existing) return json({ error: "not found" }, 404);
        await env.DB.batch([
          env.DB.prepare("UPDATE templates SET deleted_at=NULL, updated_at=?, updated_by=? WHERE id=?")
            .bind(now(), editor.name, id),
          revisionStmt(env, existing, "restore", editor),
        ]);
        return json(await getTemplate(env, id));
      }

      if (method === "GET" && revs) {
        const id = decodeURIComponent(revs[1]);
        const { results } = await env.DB.prepare(
          "SELECT rev, action, title, cat, aliases, body, editor, at FROM revisions WHERE template_id = ? ORDER BY rev DESC LIMIT 100"
        ).bind(id).all();
        return json(results);
      }

      if (method === "GET" && path === "/deleted") {
        const { results } = await env.DB.prepare(
          "SELECT id, title, cat, deleted_at, updated_by FROM templates WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC"
        ).all();
        return json(results);
      }

      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server error: " + (e && e.message) }, 500);
    }
  },
};
