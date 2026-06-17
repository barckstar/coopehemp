import { defineRouteConfig } from "@medusajs/admin-sdk"
import { type CSSProperties, useState, useEffect, useCallback } from "react"

export const config = defineRouteConfig({ label: "Blog & Noticias" })

// ─── Types ───────────────────────────────────────────────────────────────────
type BlogPost = {
  id: string; slug: string; cover_image: string | null; gallery: string[]
  category: string; author_name: string; is_published: boolean
  published_at: string | null
  translations: { locale: string; title: string; excerpt: string; content: string }[]
}

// ─── API helper ──────────────────────────────────────────────────────────────
async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`/admin${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
    credentials: "include",
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Error")
  return data
}

// ─── Markdown → HTML preview ─────────────────────────────────────────────────
function mdToHtml(md: string): string {
  if (!md) return ""
  let html = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\r\n/g, "\n")
  html = html.replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, (_m, head, body) => {
    const ths = head.split("|").filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join("")
    const rows = body.trim().split("\n").map((r: string) =>
      "<tr>" + r.split("|").filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join("") + "</tr>"
    ).join("")
    return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`
  })
  html = html
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<oli>$1</oli>")
    .replace(/^---$/gm, "<hr/>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
  html = html.replace(/(<li>.*?<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
  html = html.replace(/(<oli>.*?<\/oli>\n?)+/gs, (m) => `<ol>${m.replace(/<\/?oli>/g, v => v === "<oli>" ? "<li>" : "</li>")}</ol>`)
  html = html.split(/\n{2,}/).map(block => {
    block = block.trim()
    if (!block) return ""
    if (/^<(h[1-3]|ul|ol|table|blockquote|hr)/.test(block)) return block
    return `<p>${block.replace(/\n/g, "<br/>")}</p>`
  }).join("\n")
  return html
}

const PREVIEW_STYLE = `
  body{font-family:system-ui,sans-serif;font-size:15px;line-height:1.7;color:#1f2937;padding:16px;margin:0;background:#fff}
  h1,h2{font-size:1.3rem;font-weight:700;margin:1.2em 0 .4em;padding-bottom:.3em;border-bottom:1px solid #e5e7eb}
  h3{font-size:1.1rem;font-weight:700;margin:1em 0 .3em}
  p{margin:.6em 0}strong{font-weight:700}em{font-style:italic}
  blockquote{border-left:4px solid #16a34a;background:#f0fdf4;padding:8px 14px;margin:12px 0;border-radius:0 8px 8px 0;color:#14532d;font-style:italic}
  ul{padding-left:1.4em;margin:.6em 0}li{margin:.3em 0}ol{padding-left:1.6em;margin:.6em 0}
  code{background:#f3f4f6;color:#16a34a;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:.9em}
  table{width:100%;border-collapse:collapse;font-size:.9em;margin:.8em 0}
  th{background:#14532d;color:#fff;padding:8px 12px;text-align:left;font-size:.75em;text-transform:uppercase}
  td{padding:7px 12px;border-bottom:1px solid #f3f4f6}tr:nth-child(even){background:#f9fafb}
  a{color:#16a34a;text-decoration:underline}hr{border:none;border-top:1px solid #e5e7eb;margin:1.5em 0}
`

// ─── Image with fallback ─────────────────────────────────────────────────────
function ImgOrFallback({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false)
  const fallback = (
    <div style={{ width: 44, height: 44, borderRadius: 6, background: "var(--medusa-bg-subtle, #27272a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📰</div>
  )
  if (!src || failed) return fallback
  return <img src={src} alt="" onError={() => setFailed(true)} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, border: "1px solid var(--medusa-border-base)" }} />
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    slug: "", cover_image: "", gallery: [] as string[],
    category: "", author_name: "", is_published: false,
    title: "", excerpt: "", content: "",
  })

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await apiFetch("/blog")
      setPosts(data.posts); setCount(data.count)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setFormData({ slug: "", cover_image: "", gallery: [], category: "", author_name: "", is_published: false, title: "", excerpt: "", content: "" })
    setShowForm(true)
  }

  function openEdit(post: BlogPost) {
    setEditing(post)
    const t = post.translations?.find(tr => tr.locale === "es") || post.translations?.[0] || { title: "", excerpt: "", content: "" }
    setFormData({
      slug: post.slug, cover_image: post.cover_image || "",
      gallery: post.gallery || [],
      category: post.category, author_name: post.author_name,
      is_published: post.is_published,
      title: t.title, excerpt: t.excerpt, content: t.content,
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este artículo?")) return
    try { await apiFetch(`/blog/${id}`, { method: "DELETE" }); load() }
    catch (e: any) { alert(e.message) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      slug: formData.slug,
      cover_image: formData.cover_image,
      gallery: formData.gallery,
      category: formData.category,
      author_name: formData.author_name,
      is_published: formData.is_published,
      translations: [{ locale: "es", title: formData.title, excerpt: formData.excerpt, content: formData.content }],
    }
    try {
      if (editing) await apiFetch(`/blog/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) })
      else await apiFetch("/blog", { method: "POST", body: JSON.stringify(payload) })
      setShowForm(false); load()
    } catch (e: any) { alert(e.message) }
  }

  // Gallery helpers
  function addGalleryUrl() { setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ""] })) }
  function updateGalleryUrl(i: number, v: string) {
    setFormData(prev => { const g = [...prev.gallery]; g[i] = v; return { ...prev, gallery: g } })
  }
  function removeGalleryUrl(i: number) {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, j) => j !== i) }))
  }

  return (
    <div style={{ padding: "24px", color: "var(--medusa-fg-base)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Blog & Noticias</h1>
          <p style={{ color: "var(--medusa-fg-subtle)", margin: "3px 0 0", fontSize: 13 }}>{count} artículos</p>
        </div>
        <button onClick={openCreate} style={btn("green")}>+ Nuevo artículo</button>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {loading ? <p style={{ color: "var(--medusa-fg-muted)" }}>Cargando...</p> : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "var(--medusa-bg-subtle)", borderBottom: "1px solid var(--medusa-border-base)" }}>
              {["Imagen", "Título", "Categoría", "Autor", "Estado", "Acciones"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map(post => {
              const t = post.translations?.find(tr => tr.locale === "es") || post.translations?.[0]
              return (
                <tr key={post.id} style={{ borderBottom: "1px solid var(--medusa-border-base)" }}>
                  <td style={{ ...tdStyle, width: 56 }}>
                    <ImgOrFallback src={post.cover_image} />
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 500 }}>{t?.title || <span style={{ color: "var(--medusa-fg-muted)", fontStyle: "italic" }}>sin título</span>}</span>
                    <br /><span style={{ fontSize: 11, color: "var(--medusa-fg-muted)" }}>{post.slug}</span>
                  </td>
                  <td style={tdStyle}>{post.category}</td>
                  <td style={tdStyle}>{post.author_name}</td>
                  <td style={tdStyle}>
                    <span style={badge(post.is_published ? "green" : "neutral")}>
                      {post.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(post)} style={btn("blue", true)}>Editar</button>
                    <button onClick={() => handleDelete(post.id)} style={btn("red", true)}>Eliminar</button>
                  </td>
                </tr>
              )
            })}
            {posts.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "var(--medusa-fg-muted)" }}>No hay artículos. ¡Crea el primero!</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{editing ? "Editar artículo" : "Nuevo artículo"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--medusa-fg-subtle)" }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <label style={labelStyle}>Slug *<input style={inputStyle} value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required /></label>
                <label style={labelStyle}>Categoría *<input style={inputStyle} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required /></label>
                <label style={labelStyle}>Autor *<input style={inputStyle} value={formData.author_name} onChange={e => setFormData({ ...formData, author_name: e.target.value })} required /></label>
                <label style={labelStyle}>Imagen de portada (URL)<input style={inputStyle} value={formData.cover_image} onChange={e => setFormData({ ...formData, cover_image: e.target.value })} placeholder="https://..." /></label>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 14 }}>
                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} />
                <span style={{ fontWeight: 500, color: "var(--medusa-fg-base)" }}>Publicar inmediatamente</span>
              </label>

              {/* Gallery */}
              <div style={{ marginBottom: 16, padding: 14, background: "var(--medusa-bg-subtle, #27272a)", borderRadius: 8, border: "1px solid var(--medusa-border-base, #2e2e32)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--medusa-fg-subtle)" }}>
                    GALERÍA ({formData.gallery.filter(Boolean).length} / 8)
                  </span>
                  <button type="button" onClick={addGalleryUrl} disabled={formData.gallery.length >= 8} style={{ ...btn("gray", true), fontSize: 11 }}>
                    + Añadir URL
                  </button>
                </div>
                {formData.gallery.length === 0 && (
                  <p style={{ fontSize: 12, color: "var(--medusa-fg-muted)", margin: 0 }}>Sin imágenes adicionales.</p>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {formData.gallery.map((url, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {url && <img src={url} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, border: "1px solid var(--medusa-border-base)", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />}
                      <input style={{ ...inputStyle, margin: 0, flex: 1 }} value={url} placeholder="https://..." onChange={e => updateGalleryUrl(i, e.target.value)} />
                      <button type="button" onClick={() => removeGalleryUrl(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--medusa-tag-red-text)", fontSize: 16, padding: "0 4px" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content fields */}
              <div style={{ borderTop: "1px solid var(--medusa-border-base)", paddingTop: 16 }}>
                <label style={labelStyle}>Título *
                  <input style={inputStyle} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </label>
                <label style={labelStyle}>Resumen (excerpt)
                  <textarea style={{ ...inputStyle, height: 60, resize: "vertical" }} value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                </label>
                <label style={{ ...labelStyle, marginBottom: 6 }}>
                  Contenido (Markdown)
                  <span style={{ fontSize: 11, color: "var(--medusa-fg-muted)", fontWeight: 400, marginLeft: 8 }}>
                    **negrita**, *cursiva*, ## Títulos, - listas, &gt; citas
                  </span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, height: 340 }}>
                  <textarea
                    style={{ ...inputStyle, height: "100%", resize: "none", fontFamily: "monospace", fontSize: 12, boxSizing: "border-box", margin: 0 }}
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    placeholder={"## Título de sección\n\nTexto del párrafo...\n\n**Negrita**, *cursiva*\n\n- Ítem de lista\n\n> Cita o blockquote"}
                  />
                  <div style={{ border: "1px solid var(--medusa-border-base)", borderRadius: 6, height: "100%", overflowY: "auto", background: "#fff" }}>
                    <div style={{ padding: "4px 8px", borderBottom: "1px solid #e5e7eb", fontSize: 10, color: "#9ca3af", background: "#f9fafb", letterSpacing: ".05em" }}>
                      VISTA PREVIA
                    </div>
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><style>${PREVIEW_STYLE}</style></head><body>${mdToHtml(formData.content)}</body></html>`}
                      style={{ width: "100%", height: "calc(100% - 24px)", border: "none" }}
                      sandbox="allow-same-origin"
                      title="preview"
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--medusa-border-base)" }}>
                <button type="button" onClick={() => setShowForm(false)} style={btn("gray")}>Cancelar</button>
                <button type="submit" style={btn("green")}>{editing ? "Guardar cambios" : "Crear artículo"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const BRAND_GREEN = "#16a34a"

function btn(color: "green" | "gray" | "blue" | "red", small = false): CSSProperties {
  const map: Record<string, [string, string]> = {
    green: [BRAND_GREEN, "#fff"],
    blue:  ["#2563eb", "#fff"],
    red:   ["var(--medusa-tag-red-text, #dc2626)", "#fff"],
    gray:  ["var(--medusa-bg-component)", "var(--medusa-fg-base)"],
  }
  const [bg, fg] = map[color]
  return {
    padding: small ? "4px 10px" : "8px 16px", borderRadius: 6,
    fontSize: small ? 12 : 14, fontWeight: 600, cursor: "pointer",
    background: bg, color: fg,
    border: color === "gray" ? "1px solid var(--medusa-border-base)" : "none",
  }
}

function badge(color: "green" | "neutral" | "blue" | "red"): CSSProperties {
  const map: Record<string, [string, string]> = {
    green:   ["var(--medusa-tag-green-bg)", "var(--medusa-tag-green-text)"],
    blue:    ["var(--medusa-tag-blue-bg)",  "var(--medusa-tag-blue-text)"],
    red:     ["var(--medusa-tag-red-bg)",   "var(--medusa-tag-red-text)"],
    neutral: ["var(--medusa-tag-neutral-bg)", "var(--medusa-tag-neutral-text)"],
  }
  const [bg, fg] = map[color]
  return { display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 500, background: bg, color: fg }
}

const overlayStyle: CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000,
  overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center",
  padding: "24px 16px",
}
const modalStyle: CSSProperties = {
  background: "var(--medusa-bg-component, #1c1c1f)", color: "var(--medusa-fg-base, #f9fafb)",
  borderRadius: 12, padding: 28, width: "min(96vw, 980px)", flexShrink: 0,
  boxShadow: "0 24px 64px rgba(0,0,0,.8)", border: "1px solid var(--medusa-border-base, #2e2e32)",
}
const inputStyle: CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 6,
  border: "1px solid var(--medusa-border-base, #2e2e32)",
  background: "var(--medusa-bg-subtle, #27272a)", color: "var(--medusa-fg-base, #f9fafb)",
  fontSize: 13, marginTop: 4, boxSizing: "border-box",
}
const labelStyle: CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "var(--medusa-fg-subtle)", marginBottom: 10,
}
const tableStyle: CSSProperties = {
  width: "100%", borderCollapse: "collapse", background: "var(--medusa-bg-base)",
  borderRadius: 8, overflow: "hidden", border: "1px solid var(--medusa-border-base)",
}
const thStyle: CSSProperties = {
  padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--medusa-fg-subtle)",
}
const tdStyle: CSSProperties = { padding: "10px 14px", fontSize: 13, color: "var(--medusa-fg-base)" }
const errorBox: CSSProperties = {
  background: "var(--medusa-tag-red-bg)", border: "1px solid var(--medusa-tag-red-text)",
  borderRadius: 8, padding: "10px 14px", color: "var(--medusa-tag-red-text)", marginBottom: 14,
}
