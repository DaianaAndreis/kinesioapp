import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ── THEME ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#f8fafc", surface: "#ffffff", surfaceHigh: "#f1f5f9",
  border: "#e2e8f0", borderHover: "#cbd5e1",
  accent: "#2563eb", accentSoft: "rgba(37,99,235,0.08)",
  accentHover: "#1d4ed8",
  green: "#059669", greenSoft: "rgba(5,150,105,0.08)",
  amber: "#d97706", amberSoft: "rgba(217,119,6,0.08)",
  red: "#dc2626", redSoft: "rgba(220,38,38,0.08)",
  purple: "#7c3aed", purpleSoft: "rgba(124,58,237,0.08)",
  text: "#0f172a", textSoft: "#475569", textMuted: "#94a3b8",
  sidebar: "#1e293b", sidebarText: "#cbd5e1", sidebarActive: "#2563eb",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:${C.bg};color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
.fade{animation:fade .25s ease}
@keyframes fade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.card{background:${C.surface};border:1px solid ${C.border};border-radius:16px;box-shadow:${C.shadow}}
input,select,textarea{background:${C.surfaceHigh};border:1.5px solid ${C.border};border-radius:10px;color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:all .2s}
input:focus,select:focus,textarea:focus{border-color:${C.accent};background:${C.surface};box-shadow:0 0 0 3px ${C.accentSoft}}
input::placeholder,textarea::placeholder{color:${C.textMuted}}
select option{background:${C.surface};color:${C.text}}
label{font-size:12px;font-weight:600;color:${C.textSoft};letter-spacing:.04em;display:block;margin-bottom:6px}
.btn{border:none;border-radius:10px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:13.5px;padding:10px 18px;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap}
.btn-primary{background:${C.accent};color:#fff;box-shadow:0 1px 2px rgba(37,99,235,0.3)}.btn-primary:hover{background:${C.accentHover};transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,0.3)}
.btn-ghost{background:transparent;color:${C.textSoft};border:1.5px solid ${C.border}}.btn-ghost:hover{background:${C.surfaceHigh};color:${C.text};border-color:${C.borderHover}}
.btn-green{background:${C.greenSoft};color:${C.green};border:1.5px solid rgba(5,150,105,0.2)}.btn-green:hover{background:rgba(5,150,105,0.15)}
.btn-amber{background:${C.amberSoft};color:${C.amber};border:1.5px solid rgba(217,119,6,0.2)}.btn-amber:hover{background:rgba(217,119,6,0.15)}
.btn-danger{background:${C.redSoft};color:${C.red};border:1.5px solid rgba(220,38,38,0.2)}.btn-danger:hover{background:rgba(220,38,38,0.15)}
.nav-item{transition:all .2s;border:none;background:none;cursor:pointer;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;font-weight:500;width:100%;color:${C.sidebarText};text-align:left}
.nav-item:hover{background:rgba(255,255,255,0.08)}
.nav-item.active{background:${C.accent};color:#fff;font-weight:600}
.modal-bg{position:fixed;inset:0;background:rgba(15,23,42,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;animation:fade .2s ease}
.tab-btn{border:none;background:none;cursor:pointer;padding:8px 16px;border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;transition:all .2s;color:${C.textMuted}}
.tab-btn.active{background:${C.accentSoft};color:${C.accent};font-weight:600}
.table-row{transition:background .15s}
.table-row:hover{background:${C.surfaceHigh}}
@media(max-width:768px){
  .sidebar{position:fixed;left:-240px;top:0;bottom:0;z-index:200;transition:left .3s ease}
  .sidebar.open{left:0;box-shadow:4px 0 20px rgba(0,0,0,0.15)}
  .main-content{margin-left:0 !important;padding:16px !important}
  .hide-mobile{display:none !important}
  .mobile-header{display:flex !important}
  .stats-grid{grid-template-columns:1fr 1fr !important}
  .form-grid{grid-template-columns:1fr !important}
}
.mobile-header{display:none;align-items:center;justify-content:space-between;padding:14px 16px;background:${C.sidebar};color:#fff;position:sticky;top:0;z-index:100}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:199}
.overlay.show{display:block}
`;

// ── UTILS ──────────────────────────────────────────────────────────────────
function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { if (!d) return "—"; const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; }
function initials(nombre) { return nombre?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"; }

const KIN_COLORS = { 1: "#2563eb", 2: "#7c3aed", 3: "#059669", 4: "#d97706", 5: "#dc2626" };
function kinColor(id) { return KIN_COLORS[id] || C.accent; }

// ── BASE COMPONENTS ────────────────────────────────────────────────────────
function Spinner({ size = 32 }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
    <div style={{ width: size, height: size, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
  </div>;
}

function Avatar({ nombre, size = 38, color = C.accent }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, color, flexShrink: 0 }}>{initials(nombre)}</div>;
}

function Badge({ label, type }) {
  const map = {
    activo: [C.green, C.greenSoft, "rgba(5,150,105,0.15)"],
    finalizado: [C.textMuted, C.surfaceHigh, C.border],
    confirmado: [C.accent, C.accentSoft, "rgba(37,99,235,0.15)"],
    pendiente: [C.amber, C.amberSoft, "rgba(217,119,6,0.15)"],
    cancelado: [C.red, C.redSoft, "rgba(220,38,38,0.15)"],
  };
  const [fg, bg] = map[type] || [C.textMuted, C.surfaceHigh];
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11.5, fontWeight: 600, color: fg, background: bg, border: `1px solid ${fg}25` }}>{label}</span>;
}

function Field({ label, children, col }) {
  return <div style={{ marginBottom: 16, gridColumn: col }}><label>{label}</label>{children}</div>;
}

function Modal({ title, onClose, children, width = 540 }) {
  return <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="card fade" style={{ width: "100%", maxWidth: width, maxHeight: "92vh", overflowY: "auto", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>{title}</div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 12px", fontSize: 16 }}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

function Empty({ msg, icon = "📭" }) {
  return <div style={{ padding: "48px 24px", textAlign: "center", color: C.textMuted, background: C.surface, borderRadius: 16, border: `1.5px dashed ${C.border}` }}>
    <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 14 }}>{msg}</div>
  </div>;
}

function PageHeader({ title, subtitle, action }) {
  return <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{subtitle}</p>}
    </div>
    {action}
  </div>;
}

// ── FORMS ──────────────────────────────────────────────────────────────────
function FormPaciente({ kinesiologos, onSave, onClose, initial = null, fixedKinId = null }) {
  const [f, setF] = useState(initial || { nombre: "", dni: "", tel: "", obra_social: "", kin_id: fixedKinId || kinesiologos[0]?.id || "", tratamiento: "", notas: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.nombre.trim() && f.dni.trim() && f.kin_id && f.tratamiento.trim();
  return <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }} className="form-grid">
      <Field label="Nombre completo" col="1 / -1"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: María García" /></Field>
      <Field label="DNI"><input value={f.dni} onChange={set("dni")} placeholder="Sin puntos" maxLength={8} /></Field>
      <Field label="Teléfono"><input value={f.tel} onChange={set("tel")} placeholder="11-xxxx-xxxx" /></Field>
      <Field label="Obra social" col="1 / -1"><input value={f.obra_social} onChange={set("obra_social")} placeholder="OSDE, Swiss Medical, particular..." /></Field>
      <Field label="Kinesiólogo asignado" col="1 / -1">
        {fixedKinId
          ? <input value={kinesiologos.find(k => k.id == fixedKinId)?.nombre || ""} disabled style={{ opacity: .6 }} />
          : <select value={f.kin_id} onChange={set("kin_id")}>{kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}</select>}
      </Field>
      <Field label="Diagnóstico / Tratamiento" col="1 / -1"><input value={f.tratamiento} onChange={set("tratamiento")} placeholder="Ej: Rehabilitación rodilla derecha" /></Field>
      <Field label="Notas adicionales" col="1 / -1"><textarea value={f.notas} onChange={set("notas")} placeholder="Antecedentes, indicaciones..." rows={3} style={{ resize: "vertical" }} /></Field>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .45 }}>{initial ? "Guardar cambios" : "Agregar paciente"}</button>
    </div>
  </>;
}

function FormTurno({ pacientes, kinesiologos, onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { paciente_id: pacientes[0]?.id || "", kin_id: kinesiologos[0]?.id || "", fecha: today(), hora: "09:00", duracion: 45, notas: "", estado: "pendiente" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.paciente_id && f.kin_id && f.fecha && f.hora;
  const horas = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];
  return <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }} className="form-grid">
      <Field label="Paciente" col="1 / -1">
        <select value={f.paciente_id} onChange={set("paciente_id")}>
          <option value="">— Seleccioná un paciente —</option>
          {pacientes.filter(p => p.estado === "activo").map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </Field>
      <Field label="Kinesiólogo" col="1 / -1">
        <select value={f.kin_id} onChange={set("kin_id")}>{kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}</select>
      </Field>
      <Field label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Field>
      <Field label="Hora">
        <select value={f.hora} onChange={set("hora")}>{horas.map(h => <option key={h} value={h}>{h}</option>)}</select>
      </Field>
      <Field label="Duración (min)"><input type="number" value={f.duracion} onChange={set("duracion")} min={15} max={120} step={15} /></Field>
      <Field label="Estado">
        <select value={f.estado} onChange={set("estado")}>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </Field>
      <Field label="Notas" col="1 / -1"><textarea value={f.notas} onChange={set("notas")} placeholder="Observaciones del turno..." rows={2} style={{ resize: "vertical" }} /></Field>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .45 }}>{initial ? "Guardar cambios" : "Crear turno"}</button>
    </div>
  </>;
}

function FormSesion({ pacientes, onSave, onClose }) {
  const [f, setF] = useState({ paciente_id: pacientes[0]?.id || "", fecha: today(), notas: "", realizada: true });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.paciente_id && f.fecha;
  return <>
    <Field label="Paciente">
      <select value={f.paciente_id} onChange={set("paciente_id")}>
        <option value="">— Seleccioná —</option>
        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
    </Field>
    <Field label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Field>
    <Field label="Notas"><textarea value={f.notas} onChange={set("notas")} placeholder="Evolución, observaciones..." rows={4} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.greenSoft, borderRadius: 10, border: `1px solid rgba(5,150,105,0.2)`, marginBottom: 20 }}>
      <input type="checkbox" id="real" checked={f.realizada} onChange={e => setF(p => ({ ...p, realizada: e.target.checked }))} style={{ width: "auto", accentColor: C.green, width: 16, height: 16 }} />
      <label htmlFor="real" style={{ textTransform: "none", fontSize: 13.5, color: C.green, margin: 0, fontWeight: 600 }}>✓ Sesión realizada</label>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .45 }}>Registrar sesión</button>
    </div>
  </>;
}

function FormEjercicio({ onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { nombre: "", series: 3, reps: 10, descripcion: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return <>
    <Field label="Nombre del ejercicio"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: Extensión de rodilla" /></Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Field label="Series"><input type="number" value={f.series} onChange={set("series")} min={1} max={10} /></Field>
      <Field label="Repeticiones"><input type="number" value={f.reps} onChange={set("reps")} min={1} max={50} /></Field>
    </div>
    <Field label="Descripción"><textarea value={f.descripcion} onChange={set("descripcion")} placeholder="Instrucciones..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!f.nombre.trim()} onClick={() => f.nombre.trim() && onSave(f)} style={{ opacity: f.nombre.trim() ? 1 : .45 }}>{initial ? "Guardar" : "Agregar"}</button>
    </div>
  </>;
}

// ── SECRETARIA VIEWS ───────────────────────────────────────────────────────
function SecDashboard({ pacientes, kinesiologos, sesiones, turnos }) {
  const hoy = today();
  const turnosHoy = turnos.filter(t => t.fecha === hoy);
  const sesHoy = sesiones.filter(s => s.fecha === hoy);
  return <div className="fade">
    <PageHeader title="Dashboard" subtitle={`Hoy ${fmtDate(hoy)} · Centro de Kinesiología`} />
    <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
      {[
        { label: "Pacientes activos", val: pacientes.filter(p => p.estado === "activo").length, color: C.accent, icon: "👥" },
        { label: "Turnos hoy", val: turnosHoy.length, color: C.green, icon: "📅" },
        { label: "Sesiones hoy", val: sesHoy.length, color: C.purple, icon: "⚡" },
        { label: "Kinesiólogos", val: kinesiologos.length, color: C.amber, icon: "🩺" },
      ].map(s => <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.val}</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
      </div>)}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: C.text }}>Turnos de hoy</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {turnosHoy.length === 0 ? <Empty msg="Sin turnos para hoy" icon="📅" /> :
            turnosHoy.slice(0, 5).map(t => {
              const pac = pacientes.find(p => p.id === t.paciente_id);
              const kin = kinesiologos.find(k => k.id === t.kin_id);
              return <div key={t.id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 15, minWidth: 50 }}>{t.hora}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{pac?.nombre || "—"}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{kin?.nombre || "—"}</div>
                </div>
                <Badge label={t.estado} type={t.estado} />
              </div>;
            })}
        </div>
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: C.text }}>Por kinesiólogo</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {kinesiologos.map(k => {
            const kPac = pacientes.filter(p => p.kin_id === k.id && p.estado === "activo");
            const kTurnos = turnosHoy.filter(t => t.kin_id === k.id);
            const col = kinColor(k.id);
            return <div key={k.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar nombre={k.nombre} size={40} color={col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{k.nombre}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{k.especialidad}</div>
              </div>
              <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
                <div><div style={{ fontWeight: 800, fontSize: 18, color: C.accent }}>{kPac.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>pacientes</div></div>
                <div><div style={{ fontWeight: 800, fontSize: 18, color: C.green }}>{kTurnos.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>turnos hoy</div></div>
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>
  </div>;
}

function SecPacientes({ pacientes, kinesiologos, onAgregar, onEditar, onCambiarEstado }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("activo");
  const [busqueda, setBusqueda] = useState("");
  const filtrados = pacientes.filter(p => filtro === "todos" || p.estado === filtro).filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || p.dni?.includes(busqueda));
  return <div className="fade">
    <PageHeader title="Pacientes" subtitle={`${pacientes.filter(p => p.estado === "activo").length} activos`} action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo paciente</button>} />
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍  Buscar por nombre o DNI..." style={{ maxWidth: 260, flex: 1 }} />
      <div style={{ display: "flex", gap: 4, background: C.surfaceHigh, borderRadius: 10, padding: 4 }}>
        {["activo", "finalizado", "todos"].map(f => <button key={f} className={`tab-btn ${filtro === f ? "active" : ""}`} onClick={() => setFiltro(f)} style={{ textTransform: "capitalize" }}>{f}</button>)}
      </div>
    </div>
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: C.surfaceHigh }}>
            {["Paciente", "Kinesiólogo", "Tratamiento", "Sesiones", "Estado", ""].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.textMuted }}>No se encontraron pacientes</td></tr>}
            {filtrados.map((p, i) => {
              const k = kinesiologos.find(k => k.id === p.kin_id);
              const col = kinColor(p.kin_id);
              return <tr key={p.id} className="table-row" style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar nombre={p.nombre} size={34} color={col} />
                    <div><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: 11, color: C.textMuted }}>DNI {p.dni}</div></div>
                  </div>
                </td>
                <td style={{ padding: "13px 16px", fontSize: 13, color: C.textSoft, whiteSpace: "nowrap" }}>{k?.nombre || "—"}</td>
                <td style={{ padding: "13px 16px", fontSize: 13, maxWidth: 180 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.tratamiento}</div></td>
                <td style={{ padding: "13px 16px", fontWeight: 800, fontSize: 18, color: C.accent, textAlign: "center" }}>{p.sesiones}</td>
                <td style={{ padding: "13px 16px" }}><Badge label={p.estado} type={p.estado} /></td>
                <td style={{ padding: "13px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditando(p)}>✏️</button>
                    {p.estado === "activo" ? <button className="btn btn-amber" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "finalizado")}>Finalizar</button>
                      : <button className="btn btn-green" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "activo")}>Reactivar</button>}
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
    {modal && <Modal title="Nuevo paciente" onClose={() => setModal(false)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar paciente" onClose={() => setEditando(null)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
  </div>;
}

function SecKinesiologos({ kinesiologos, pacientes, sesiones }) {
  return <div className="fade">
    <PageHeader title="Kinesiólogos" subtitle={`${kinesiologos.length} profesionales`} />
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {kinesiologos.map(k => {
        const kPac = pacientes.filter(p => p.kin_id === k.id && p.estado === "activo");
        const kSes = sesiones.filter(s => kPac.find(p => p.id === s.paciente_id));
        const col = kinColor(k.id);
        return <div key={k.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Avatar nombre={k.nombre} size={52} color={col} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{k.nombre}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{k.especialidad}</div>
          </div>
          <div style={{ display: "flex", gap: 24, textAlign: "center" }}>
            <div><div style={{ fontWeight: 800, fontSize: 24, color: C.accent }}>{kPac.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>pacientes</div></div>
            <div><div style={{ fontWeight: 800, fontSize: 24, color: C.green }}>{kSes.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>sesiones</div></div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function SecTurnos({ turnos, pacientes, kinesiologos, onAgregar, onEditar, onEliminar }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [fecha, setFecha] = useState(today());
  const [filtroKin, setFiltroKin] = useState("todos");
  const turnosFiltrados = turnos.filter(t => t.fecha === fecha && (filtroKin === "todos" || t.kin_id == filtroKin)).sort((a, b) => a.hora.localeCompare(b.hora));
  return <div className="fade">
    <PageHeader title="Agenda de turnos" action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo turno</button>} />
    <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ maxWidth: 180 }} />
      <select value={filtroKin} onChange={e => setFiltroKin(e.target.value)} style={{ maxWidth: 220 }}>
        <option value="todos">Todos los kinesiólogos</option>
        {kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}
      </select>
    </div>
    {turnosFiltrados.length === 0 ? <Empty msg="Sin turnos para esta fecha" icon="📅" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {turnosFiltrados.map(t => {
          const pac = pacientes.find(p => p.id === t.paciente_id);
          const kin = kinesiologos.find(k => k.id === t.kin_id);
          const col = kinColor(t.kin_id);
          return <div key={t.id} className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 800, color: C.accent, fontSize: 16, minWidth: 54 }}>{t.hora}</div>
            <Avatar nombre={pac?.nombre || "?"} size={36} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{pac?.nombre || "—"}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{kin?.nombre} · {t.duracion} min</div>
            </div>
            <Badge label={t.estado} type={t.estado} />
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditando(t)}>✏️</button>
              <button className="btn btn-danger" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onEliminar(t.id)}>🗑</button>
            </div>
          </div>;
        })}
      </div>}
    {modal && <Modal title="Nuevo turno" onClose={() => setModal(false)}><FormTurno pacientes={pacientes} kinesiologos={kinesiologos} onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar turno" onClose={() => setEditando(null)}><FormTurno pacientes={pacientes} kinesiologos={kinesiologos} onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
  </div>;
}

// ── KINESIOLOGO VIEWS ──────────────────────────────────────────────────────
function KinHoy({ kin, pacientes, sesiones, turnos, onNuevaSesion }) {
  const hoy = today();
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id && p.estado === "activo");
  const misTurnosHoy = turnos.filter(t => t.kin_id === kin.id && t.fecha === hoy).sort((a, b) => a.hora.localeCompare(b.hora));
  const misSesHoy = sesiones.filter(s => s.fecha === hoy && misPacientes.find(p => p.id === s.paciente_id));
  const col = kinColor(kin.id);
  return <div className="fade">
    <PageHeader title={`Hola, ${kin.nombre.split(" ").slice(-1)[0]} 👋`} subtitle={kin.especialidad} action={<button className="btn btn-primary" onClick={onNuevaSesion}>+ Registrar sesión</button>} />
    <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
      {[
        { label: "Mis pacientes", val: misPacientes.length, color: col, icon: "👥" },
        { label: "Turnos hoy", val: misTurnosHoy.length, color: C.green, icon: "📅" },
        { label: "Sesiones hoy", val: misSesHoy.length, color: C.purple, icon: "⚡" },
      ].map(s => <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
      </div>)}
    </div>
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Turnos de hoy</div>
    {misTurnosHoy.length === 0 ? <Empty msg="Sin turnos para hoy" icon="📅" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {misTurnosHoy.map(t => {
          const pac = pacientes.find(p => p.id === t.paciente_id);
          return <div key={t.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontWeight: 800, color: col, fontSize: 16, minWidth: 54 }}>{t.hora}</div>
            <Avatar nombre={pac?.nombre || "?"} size={36} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{pac?.nombre || "—"}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{pac?.tratamiento}</div>
            </div>
            <Badge label={t.estado} type={t.estado} />
          </div>;
        })}
      </div>}
  </div>;
}

function KinFichas({ kin, pacientes, setPacientes, sesiones, setSesiones, ejercicios, setEjercicios, kinesiologos, onAgregarPaciente, onEditarPaciente, onCambiarEstado, onAgregarSesion, onAgregarEjercicio, onEditarEjercicio, onEliminarEjercicio }) {
  const col = kinColor(kin.id);
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id);
  const [selId, setSelId] = useState(misPacientes[0]?.id || null);
  const [tab, setTab] = useState("info");
  const [modalSes, setModalSes] = useState(false);
  const [modalEj, setModalEj] = useState(false);
  const [modalPac, setModalPac] = useState(false);
  const [editPac, setEditPac] = useState(false);
  const [editEj, setEditEj] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const sel = pacientes.find(p => p.id === selId);
  const misSesiones = sesiones.filter(s => s.paciente_id === selId).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const misEjercicios = ejercicios.filter(e => e.paciente_id === selId);
  const pacFiltrados = misPacientes.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  return <div className="fade" style={{ display: "flex", gap: 20, height: "100%" }}>
    <div style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..." style={{ flex: 1, fontSize: 13 }} />
        <button className="btn btn-primary" style={{ padding: "10px 12px", flexShrink: 0 }} onClick={() => setModalPac(true)}>+</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }}>
        {pacFiltrados.length === 0 && <div style={{ color: C.textMuted, fontSize: 13, padding: "8px 0" }}>Sin pacientes</div>}
        {pacFiltrados.map(p => <div key={p.id} onClick={() => { setSelId(p.id); setTab("info"); }} style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selId === p.id ? col : C.border}`, background: selId === p.id ? `${col}08` : C.surface, cursor: "pointer", transition: "all .2s", boxShadow: selId === p.id ? `0 0 0 3px ${col}15` : "none" }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: selId === p.id ? col : C.text }}>{p.nombre}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>{p.sesiones} ses · <Badge label={p.estado} type={p.estado} /></div>
        </div>)}
      </div>
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      {!sel ? <Empty msg="Seleccioná un paciente" icon="👤" /> : <>
        <div className="card" style={{ padding: "18px 22px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <Avatar nombre={sel.nombre} size={52} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{sel.nombre}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>DNI {sel.dni} · {sel.obra_social || "Sin obra social"} · desde {fmtDate(sel.fecha_inicio)}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Badge label={sel.estado} type={sel.estado} />
              <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setEditPac(true)}>✏️ Editar</button>
              {sel.estado === "activo"
                ? <button className="btn btn-amber" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onCambiarEstado(sel.id, "finalizado")}>Finalizar</button>
                : <button className="btn btn-green" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onCambiarEstado(sel.id, "activo")}>Reactivar</button>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: C.surfaceHigh, borderRadius: 10, padding: 4, width: "fit-content" }}>
          {["info", "sesiones", "ejercicios"].map(t => <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>)}
        </div>

        {tab === "info" && <div className="fade card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="form-grid">
            {[["Tratamiento", sel.tratamiento], ["Teléfono", sel.tel || "—"], ["Obra social", sel.obra_social || "—"], ["Sesiones realizadas", sel.sesiones], ["Fecha de inicio", fmtDate(sel.fecha_inicio)], ["Estado", sel.estado]].map(([l, v]) =>
              <div key={l}><div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5, fontWeight: 600 }}>{l}</div><div style={{ fontWeight: 500 }}>{v}</div></div>)}
            {sel.notas && <div style={{ gridColumn: "1/-1" }}>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5, fontWeight: 600 }}>Notas</div>
              <div style={{ fontSize: 13, color: C.textSoft, background: C.surfaceHigh, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}` }}>{sel.notas}</div>
            </div>}
          </div>
        </div>}

        {tab === "sesiones" && <div className="fade">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button className="btn btn-primary" onClick={() => setModalSes(true)}>+ Nueva sesión</button></div>
          {misSesiones.length === 0 ? <Empty msg="Sin sesiones registradas" icon="📋" /> :
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {misSesiones.map(s => <div key={s.id} className="card" style={{ padding: "14px 18px", display: "flex", gap: 14 }}>
                <div style={{ fontWeight: 700, color: col, fontSize: 13, minWidth: 88, paddingTop: 1 }}>{fmtDate(s.fecha)}</div>
                <div style={{ flex: 1, fontSize: 13, color: C.textSoft }}>{s.notas || <span style={{ color: C.textMuted, fontStyle: "italic" }}>Sin notas</span>}</div>
                <Badge label={s.realizada ? "Realizada" : "Ausente"} type={s.realizada ? "activo" : "cancelado"} />
              </div>)}
            </div>}
        </div>}

        {tab === "ejercicios" && <div className="fade">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button className="btn btn-primary" onClick={() => setModalEj(true)}>+ Agregar ejercicio</button></div>
          {misEjercicios.length === 0 ? <Empty msg="Sin ejercicios asignados" icon="💪" /> :
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {misEjercicios.map(e => <div key={e.id} className="card" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontWeight: 600 }}>{e.nombre}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.accent, background: C.accentSoft, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{e.series} series</span>
                    <span style={{ fontSize: 12, color: C.green, background: C.greenSoft, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{e.reps} reps</span>
                    <button className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => setEditEj(e)}>✏️</button>
                    <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => onEliminarEjercicio(e.id)}>🗑</button>
                  </div>
                </div>
                {e.descripcion && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>{e.descripcion}</div>}
              </div>)}
            </div>}
        </div>}
      </>}
    </div>

    {modalSes && <Modal title="Registrar sesión" onClose={() => setModalSes(false)} width={460}><FormSesion pacientes={sel ? [sel] : []} onSave={f => { onAgregarSesion({ ...f, paciente_id: selId }); setModalSes(false); }} onClose={() => setModalSes(false)} /></Modal>}
    {modalEj && <Modal title="Nuevo ejercicio" onClose={() => setModalEj(false)} width={460}><FormEjercicio onSave={f => { onAgregarEjercicio({ ...f, paciente_id: selId }); setModalEj(false); }} onClose={() => setModalEj(false)} /></Modal>}
    {editEj && <Modal title="Editar ejercicio" onClose={() => setEditEj(null)} width={460}><FormEjercicio onSave={f => { onEditarEjercicio(editEj.id, f); setEditEj(null); }} onClose={() => setEditEj(null)} initial={editEj} /></Modal>}
    {modalPac && <Modal title="Agregar paciente" onClose={() => setModalPac(false)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregarPaciente(f); setModalPac(false); }} onClose={() => setModalPac(false)} fixedKinId={kin.id} /></Modal>}
    {editPac && sel && <Modal title="Editar paciente" onClose={() => setEditPac(false)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditarPaciente(sel.id, f); setEditPac(false); }} onClose={() => setEditPac(false)} initial={sel} fixedKinId={kin.id} /></Modal>}
  </div>;
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError("Completá todos los campos"); return; }
    setLoading(true); setError("");
    const { data, error: err } = await supabase.from("usuarios").select("*, kinesiologos(*)").eq("email", email.trim().toLowerCase()).eq("password", password).eq("activo", true).single();
    setLoading(false);
    if (err || !data) { setError("Email o contraseña incorrectos"); return; }
    onLogin(data);
  };

  return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, borderRadius: 22, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 8px 32px rgba(37,99,235,0.25)" }}>🦴</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text }}>KinesiApp</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 6 }}>Centro de Kinesiología</p>
      </div>
      <div className="card" style={{ padding: 32 }}>
        <Field label="Email">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        <Field label="Contraseña">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        {error && <div style={{ background: C.redSoft, color: C.red, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16, border: `1px solid rgba(220,38,38,0.2)` }}>⚠️ {error}</div>}
        <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, marginTop: 4 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar →"}
        </button>
        <div style={{ marginTop: 20, padding: "14px", background: C.surfaceHigh, borderRadius: 10, fontSize: 12, color: C.textMuted }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: C.textSoft }}>Accesos de prueba:</div>
          <div>📋 secretaria@kinesio.com / 1234</div>
          <div>🩺 laura@kinesio.com / 1234</div>
          <div>🩺 martin@kinesio.com / 1234</div>
        </div>
      </div>
    </div>
  </div>;
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ auth, view, setView, onLogout, isOpen, onClose }) {
  const isKin = auth.rol === "kinesiologo";
  const col = isKin ? kinColor(auth.kin_id) : C.accent;
  const navSec = [
    { id: "home", icon: "⚡", label: "Dashboard" },
    { id: "pacientes", icon: "👥", label: "Pacientes" },
    { id: "kinesiologos", icon: "🩺", label: "Kinesiólogos" },
    { id: "turnos", icon: "📅", label: "Agenda" },
  ];
  const navKin = [
    { id: "home", icon: "⚡", label: "Mi día" },
    { id: "fichas", icon: "📁", label: "Fichas" },
  ];
  const nav = isKin ? navKin : navSec;

  return <>
    <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
    <div className="sidebar" style={{ width: 220, background: C.sidebar, padding: "22px 12px", display: "flex", flexDirection: "column", gap: 4, position: "fixed", top: 0, bottom: 0, left: isOpen ? 0 : -240, zIndex: 200, transition: "left .3s ease", overflowY: "auto" }}
      id="sidebar">
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🦴</div>
        <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>KinesiApp</div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: C.sidebarText, cursor: "pointer", fontSize: 18, padding: "2px 6px", display: "none" }} id="close-sidebar">✕</button>
      </div>
      {nav.map(item => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => { setView(item.id); onClose(); }}>
        <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
      </button>)}
      <div style={{ marginTop: "auto", paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.07)", marginBottom: 8 }}>
          <Avatar nombre={auth.nombre} size={32} color={col} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{auth.nombre}</div>
            <div style={{ fontSize: 10, color: C.sidebarText, textTransform: "capitalize" }}>{auth.rol}</div>
          </div>
        </div>
        <button className="nav-item" onClick={onLogout} style={{ color: C.textMuted, fontSize: 12 }}>↩ Cerrar sesión</button>
      </div>
    </div>
  </>;
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
export default function App() {
  const [kinesiologos, setKinesiologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalSesRapida, setModalSesRapida] = useState(false);

  useEffect(() => {
    async function cargar() {
      const [k, p, s, e, t] = await Promise.all([
        supabase.from("kinesiologos").select("*").order("id"),
        supabase.from("pacientes").select("*").order("nombre"),
        supabase.from("sesiones").select("*").order("fecha", { ascending: false }),
        supabase.from("ejercicios").select("*").order("id"),
        supabase.from("turnos").select("*").order("fecha").order("hora"),
      ]);
      setKinesiologos(k.data || []);
      setPacientes(p.data || []);
      setSesiones(s.data || []);
      setEjercicios(e.data || []);
      setTurnos(t.data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  // PACIENTES
  const agregarPaciente = async f => {
    const { data } = await supabase.from("pacientes").insert([{ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas, sesiones: 0, estado: "activo", fecha_inicio: today() }]).select().single();
    if (data) setPacientes(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
  };
  const editarPaciente = async (id, f) => {
    const { data } = await supabase.from("pacientes").update({ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas }).eq("id", id).select().single();
    if (data) setPacientes(prev => prev.map(p => p.id === id ? data : p));
  };
  const cambiarEstadoPaciente = async (id, estado) => {
    await supabase.from("pacientes").update({ estado }).eq("id", id);
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };

  // SESIONES
  const agregarSesion = async f => {
    const pid = Number(f.paciente_id);
    const { data } = await supabase.from("sesiones").insert([{ paciente_id: pid, fecha: f.fecha, notas: f.notas, realizada: f.realizada }]).select().single();
    if (data) {
      setSesiones(prev => [data, ...prev]);
      if (f.realizada) {
        const pac = pacientes.find(p => p.id === pid);
        await supabase.from("pacientes").update({ sesiones: (pac?.sesiones || 0) + 1 }).eq("id", pid);
        setPacientes(prev => prev.map(p => p.id === pid ? { ...p, sesiones: p.sesiones + 1 } : p));
      }
    }
  };

  // EJERCICIOS
  const agregarEjercicio = async f => {
    const { data } = await supabase.from("ejercicios").insert([{ paciente_id: f.paciente_id, nombre: f.nombre, series: Number(f.series), reps: Number(f.reps), descripcion: f.descripcion }]).select().single();
    if (data) setEjercicios(prev => [...prev, data]);
  };
  const editarEjercicio = async (id, f) => {
    const { data } = await supabase.from("ejercicios").update({ nombre: f.nombre, series: Number(f.series), reps: Number(f.reps), descripcion: f.descripcion }).eq("id", id).select().single();
    if (data) setEjercicios(prev => prev.map(e => e.id === id ? data : e));
  };
  const eliminarEjercicio = async id => {
    await supabase.from("ejercicios").delete().eq("id", id);
    setEjercicios(prev => prev.filter(e => e.id !== id));
  };

  // TURNOS
  const agregarTurno = async f => {
    const { data } = await supabase.from("turnos").insert([{ paciente_id: Number(f.paciente_id), kin_id: Number(f.kin_id), fecha: f.fecha, hora: f.hora, duracion: Number(f.duracion), estado: f.estado, notas: f.notas }]).select().single();
    if (data) setTurnos(prev => [...prev, data]);
  };
  const editarTurno = async (id, f) => {
    const { data } = await supabase.from("turnos").update({ paciente_id: Number(f.paciente_id), kin_id: Number(f.kin_id), fecha: f.fecha, hora: f.hora, duracion: Number(f.duracion), estado: f.estado, notas: f.notas }).eq("id", id).select().single();
    if (data) setTurnos(prev => prev.map(t => t.id === id ? data : t));
  };
  const eliminarTurno = async id => {
    await supabase.from("turnos").delete().eq("id", id);
    setTurnos(prev => prev.filter(t => t.id !== id));
  };

  const logout = () => { setAuth(null); setView("home"); };

  const kin = auth?.rol === "kinesiologo" ? kinesiologos.find(k => k.id === auth.kin_id) : null;
  const misPacientesKin = kin ? pacientes.filter(p => p.kin_id === kin.id && p.estado === "activo") : [];

  if (loading) return <><style>{CSS}</style><div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div></>;
  if (!auth) return <><style>{CSS}</style><Login onLogin={u => { setAuth(u); setView("home"); }} /></>;

  return <>
    <style>{CSS}</style>
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar auth={auth} view={view} setView={setView} onLogout={logout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content" style={{ flex: 1, marginLeft: 220, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: "4px 8px" }}>☰</button>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>🦴 KinesiApp</div>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {auth.rol === "secretaria" && view === "home" && <SecDashboard pacientes={pacientes} kinesiologos={kinesiologos} sesiones={sesiones} turnos={turnos} />}
          {auth.rol === "secretaria" && view === "pacientes" && <SecPacientes pacientes={pacientes} kinesiologos={kinesiologos} onAgregar={agregarPaciente} onEditar={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} />}
          {auth.rol === "secretaria" && view === "kinesiologos" && <SecKinesiologos kinesiologos={kinesiologos} pacientes={pacientes} sesiones={sesiones} />}
          {auth.rol === "secretaria" && view === "turnos" && <SecTurnos turnos={turnos} pacientes={pacientes} kinesiologos={kinesiologos} onAgregar={agregarTurno} onEditar={editarTurno} onEliminar={eliminarTurno} />}
          {auth.rol === "kinesiologo" && kin && view === "home" && <KinHoy kin={kin} pacientes={pacientes} sesiones={sesiones} turnos={turnos} onNuevaSesion={() => setModalSesRapida(true)} />}
          {auth.rol === "kinesiologo" && kin && view === "fichas" && <KinFichas kin={kin} pacientes={pacientes} setPacientes={setPacientes} sesiones={sesiones} setSesiones={setSesiones} ejercicios={ejercicios} setEjercicios={setEjercicios} kinesiologos={kinesiologos} onAgregarPaciente={agregarPaciente} onEditarPaciente={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} onAgregarSesion={agregarSesion} onAgregarEjercicio={agregarEjercicio} onEditarEjercicio={editarEjercicio} onEliminarEjercicio={eliminarEjercicio} />}
        </div>
      </div>
    </div>

    {modalSesRapida && <Modal title="Registrar sesión" onClose={() => setModalSesRapida(false)} width={460}>
      <FormSesion pacientes={misPacientesKin} onSave={f => { agregarSesion(f); setModalSesRapida(false); }} onClose={() => setModalSesRapida(false)} />
    </Modal>}
  </>;
}