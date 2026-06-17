import { defineRouteConfig } from "@medusajs/admin-sdk"
import { type CSSProperties, useState, useEffect, useCallback } from "react"

export const config = defineRouteConfig({ label: "Newsletter" })

type Subscriber = { id: string; email: string; locale: string; is_active: boolean; created_at: string }
type Campaign = {
  id: string; status: string; sent_at: string | null; recipient_count: number; created_at: string
  translations: { locale: string; subject: string; body_html: string }[]
}

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

export default function NewsletterPage() {
  const [tab, setTab] = useState<"campaigns" | "subscribers">("campaigns")

  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subCount, setSubCount] = useState(0)
  const [subLoading, setSubLoading] = useState(false)

  const loadSubscribers = useCallback(async () => {
    setSubLoading(true)
    try { const d = await apiFetch("/newsletter/subscribers"); setSubscribers(d.subscribers); setSubCount(d.count) }
    catch { } finally { setSubLoading(false) }
  }, [])

  async function deleteSubscriber(id: string) {
    if (!confirm("¿Eliminar este suscriptor?")) return
    try { await apiFetch("/newsletter/subscribers", { method: "DELETE", body: JSON.stringify({ id }) }); loadSubscribers() }
    catch (e: any) { alert(e.message) }
  }

  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campCount, setCampCount] = useState(0)
  const [campLoading, setCampLoading] = useState(false)

  const loadCampaigns = useCallback(async () => {
    setCampLoading(true)
    try { const d = await apiFetch("/newsletter/campaigns"); setCampaigns(d.campaigns); setCampCount(d.count) }
    catch { } finally { setCampLoading(false) }
  }, [])

  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [subject, setSubject] = useState("")
  const [bodyHtml, setBodyHtml] = useState("")
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)

  useEffect(() => {
    if (tab === "subscribers") loadSubscribers()
    else loadCampaigns()
  }, [tab, loadSubscribers, loadCampaigns])

  function openCreate() {
    setEditingCampaign(null); setSubject(""); setBodyHtml(""); setShowForm(true)
  }

  function openEdit(c: Campaign) {
    setEditingCampaign(c)
    const t = c.translations.find(t => t.locale === "es") || c.translations[0] || { subject: "", body_html: "" }
    setSubject(t.subject); setBodyHtml(t.body_html); setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = { translations: [{ locale: "es", subject, body_html: bodyHtml }] }
    try {
      if (editingCampaign) await apiFetch(`/newsletter/campaigns/${editingCampaign.id}`, { method: "PUT", body: JSON.stringify(payload) })
      else await apiFetch("/newsletter/campaigns", { method: "POST", body: JSON.stringify(payload) })
      setShowForm(false); loadCampaigns()
    } catch (e: any) { alert(e.message) }
  }

  async function sendCampaign(id: string) {
    if (!confirm("¿Enviar la campaña ahora a todos los suscriptores activos?")) return
    try { const d = await apiFetch(`/newsletter/campaigns/${id}/send`, { method: "POST" }); alert(d.message); loadCampaigns() }
    catch (e: any) { alert(e.message) }
  }

  async function deleteCampaign(id: string) {
    if (!confirm("¿Eliminar esta campaña?")) return
    try { await apiFetch(`/newsletter/campaigns/${id}`, { method: "DELETE" }); loadCampaigns() }
    catch (e: any) { alert(e.message) }
  }

  const statusColor = (s: string): "green" | "blue" | "red" | "neutral" =>
    s === "sent" ? "green" : s === "sending" ? "blue" : s === "failed" ? "red" : "neutral"
  const statusLabel = (s: string) =>
    s === "draft" ? "Borrador" : s === "sending" ? "Enviando..." : s === "sent" ? "Enviada" : "Error"

  return (
    <div style={{ padding: "24px", color: "var(--medusa-fg-base)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Newsletter</h1>

      {/* Main tabs */}
      <div style={{ display: "flex", marginBottom: 24, borderBottom: "2px solid var(--medusa-border-base)" }}>
        {(["campaigns", "subscribers"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 20px", border: "none", background: "none", cursor: "pointer",
            fontWeight: tab === t ? 700 : 400, fontSize: 15,
            color: tab === t ? "#16a34a" : "var(--medusa-fg-subtle)",
            borderBottom: tab === t ? "2px solid #16a34a" : "2px solid transparent",
            marginBottom: -2,
          }}>
            {t === "campaigns" ? `Campañas (${campCount})` : `Suscriptores (${subCount})`}
          </button>
        ))}
      </div>

      {/* ── Campaigns ─────────────────────────────────────────────────────────── */}
      {tab === "campaigns" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button onClick={openCreate} style={btn("green")}>+ Nueva campaña</button>
          </div>
          {campLoading ? <p style={{ color: "var(--medusa-fg-muted)" }}>Cargando...</p> : (
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "var(--medusa-bg-subtle)", borderBottom: "1px solid var(--medusa-border-base)" }}>
                  {["Asunto", "Estado", "Enviados", "Fecha envío", "Acciones"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => {
                  const t = c.translations.find(t => t.locale === "es") || c.translations[0]
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--medusa-border-base)" }}>
                      <td style={tdStyle}>{t?.subject || "—"}</td>
                      <td style={tdStyle}><span style={badge(statusColor(c.status))}>{statusLabel(c.status)}</span></td>
                      <td style={tdStyle}>{c.recipient_count}</td>
                      <td style={tdStyle}>{c.sent_at ? new Date(c.sent_at).toLocaleString("es-CR") : "—"}</td>
                      <td style={{ ...tdStyle, display: "flex", gap: 6 }}>
                        {c.status === "draft" && (
                          <>
                            <button onClick={() => openEdit(c)} style={btn("blue", true)}>Editar</button>
                            <button onClick={() => sendCampaign(c.id)} style={btn("green", true)}>Enviar</button>
                          </>
                        )}
                        {c.status !== "sending" && (
                          <button onClick={() => deleteCampaign(c.id)} style={btn("red", true)}>Eliminar</button>
                        )}
                        <button onClick={() => setPreviewHtml(t?.body_html || "")} style={btn("gray", true)}>
                          Preview
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {campaigns.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--medusa-fg-muted)" }}>No hay campañas. ¡Crea la primera!</td></tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ── Subscribers ───────────────────────────────────────────────────────── */}
      {tab === "subscribers" && (
        subLoading ? <p style={{ color: "var(--medusa-fg-muted)" }}>Cargando...</p> : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "var(--medusa-bg-subtle)", borderBottom: "1px solid var(--medusa-border-base)" }}>
                {["Email", "Idioma", "Estado", "Suscrito el", "Acciones"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--medusa-border-base)" }}>
                  <td style={tdStyle}>{s.email}</td>
                  <td style={tdStyle}>{s.locale.toUpperCase()}</td>
                  <td style={tdStyle}><span style={badge(s.is_active ? "green" : "neutral")}>{s.is_active ? "Activo" : "Dado de baja"}</span></td>
                  <td style={tdStyle}>{new Date(s.created_at).toLocaleDateString("es-CR")}</td>
                  <td style={tdStyle}><button onClick={() => deleteSubscriber(s.id)} style={btn("red", true)}>Eliminar</button></td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "var(--medusa-fg-muted)" }}>No hay suscriptores aún.</td></tr>
              )}
            </tbody>
          </table>
        )
      )}

      {/* ── Campaign Modal ────────────────────────────────────────────────────── */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{editingCampaign ? "Editar campaña" : "Nueva campaña"}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--medusa-fg-subtle)" }}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: "var(--medusa-fg-muted)", marginTop: 0 }}>
              Usa <code style={{ background: "var(--medusa-bg-subtle, #27272a)", padding: "1px 5px", borderRadius: 4 }}>{"{{unsubscribe_url}}"}</code> en el body para insertar el link de baja.
            </p>
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Asunto (Subject) *
                <input style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)} required />
              </label>
              <label style={labelStyle}>Cuerpo del correo (HTML) *
                <textarea
                  style={{ ...inputStyle, height: 280, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
                  value={bodyHtml}
                  onChange={e => setBodyHtml(e.target.value)}
                  required
                />
              </label>
              <button type="button" onClick={() => setPreviewHtml(bodyHtml)} style={{ ...btn("gray", true), marginBottom: 16 }}>
                Vista previa del email
              </button>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 16, borderTop: "1px solid var(--medusa-border-base)" }}>
                <button type="button" onClick={() => setShowForm(false)} style={btn("gray")}>Cancelar</button>
                <button type="submit" style={btn("green")}>{editingCampaign ? "Guardar cambios" : "Crear campaña"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Preview Modal ─────────────────────────────────────────────────────── */}
      {previewHtml !== null && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "min(95vw, 700px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Vista previa del email</h2>
              <button onClick={() => setPreviewHtml(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--medusa-fg-subtle)" }}>✕</button>
            </div>
            <iframe srcDoc={previewHtml} style={{ width: "100%", height: 480, border: "1px solid var(--medusa-border-base)", borderRadius: 8 }} sandbox="allow-same-origin" title="Email preview" />
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
    green: [BRAND_GREEN, "#fff"], blue: ["#2563eb", "#fff"],
    red: ["var(--medusa-tag-red-text, #dc2626)", "#fff"],
    gray: ["var(--medusa-bg-component)", "var(--medusa-fg-base)"],
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
    green: ["var(--medusa-tag-green-bg)", "var(--medusa-tag-green-text)"],
    blue: ["var(--medusa-tag-blue-bg)", "var(--medusa-tag-blue-text)"],
    red: ["var(--medusa-tag-red-bg)", "var(--medusa-tag-red-text)"],
    neutral: ["var(--medusa-tag-neutral-bg)", "var(--medusa-tag-neutral-text)"],
  }
  const [bg, fg] = map[color]
  return { display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 500, background: bg, color: fg }
}

const overlayStyle: CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1000,
  overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "24px 16px",
}
const modalStyle: CSSProperties = {
  background: "var(--medusa-bg-component, #1c1c1f)", color: "var(--medusa-fg-base, #f9fafb)",
  borderRadius: 12, padding: 28, width: "min(92vw, 780px)", flexShrink: 0,
  boxShadow: "0 24px 64px rgba(0,0,0,.8)", border: "1px solid var(--medusa-border-base, #2e2e32)",
}
const inputStyle: CSSProperties = {
  width: "100%", padding: "8px 10px", borderRadius: 6,
  border: "1px solid var(--medusa-border-base, #2e2e32)",
  background: "var(--medusa-bg-subtle, #27272a)", color: "var(--medusa-fg-base, #f9fafb)",
  fontSize: 14, marginTop: 4, boxSizing: "border-box",
}
const labelStyle: CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--medusa-fg-subtle)", marginBottom: 10 }
const tableStyle: CSSProperties = {
  width: "100%", borderCollapse: "collapse", background: "var(--medusa-bg-base)",
  borderRadius: 8, overflow: "hidden", border: "1px solid var(--medusa-border-base)",
}
const thStyle: CSSProperties = { padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--medusa-fg-subtle)" }
const tdStyle: CSSProperties = { padding: "10px 14px", fontSize: 13, color: "var(--medusa-fg-base)" }
