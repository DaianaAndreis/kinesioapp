import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const C = {
  bg: "#f8fafc", surface: "#ffffff", surfaceHigh: "#f1f5f9",
  border: "#e2e8f0", borderHover: "#cbd5e1",
  accent: "#2563eb", accentSoft: "rgba(37,99,235,0.08)",
  accentHover: "#1d4ed8",
  green: "#059669", greenSoft: "rgba(5,150,105,0.08)",
  amber: "#d97706", amberSoft: "rgba(217,119,6,0.08)",
  red: "#dc2626", redSoft: "rgba(220,38,38,0.08)",
  purple: "#7c3aed",
  text: "#0f172a", textSoft: "#475569", textMuted: "#94a3b8",
  sidebar: "#1e293b", sidebarText: "#cbd5e1",
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
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
input,select,textarea{background:${C.surfaceHigh};border:1.5px solid ${C.border};border-radius:10px;color:${C.text};font-family:'Plus Jakarta Sans',sans-serif;font-size:16px;padding:12px 14px;width:100%;outline:none;transition:all .2s}
input:focus,select:focus,textarea:focus{border-color:${C.accent};background:${C.surface};box-shadow:0 0 0 3px rgba(37,99,235,0.08)}
input::placeholder,textarea::placeholder{color:${C.textMuted}}
input:disabled{opacity:.6;cursor:not-allowed}
select option{background:${C.surface};color:${C.text}}
label{font-size:12px;font-weight:600;color:${C.textSoft};letter-spacing:.04em;display:block;margin-bottom:6px}
.btn{border:none;border-radius:10px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;font-size:14px;padding:11px 18px;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;-webkit-tap-highlight-color:transparent}
.btn-primary{background:${C.accent};color:#fff}.btn-primary:hover{background:${C.accentHover}}
.btn-ghost{background:transparent;color:${C.textSoft};border:1.5px solid ${C.border}}.btn-ghost:hover{background:${C.surfaceHigh};color:${C.text}}
.btn-green{background:${C.greenSoft};color:${C.green};border:1.5px solid rgba(5,150,105,0.2)}
.btn-amber{background:${C.amberSoft};color:${C.amber};border:1.5px solid rgba(217,119,6,0.2)}
.btn-danger{background:${C.redSoft};color:${C.red};border:1.5px solid rgba(220,38,38,0.2)}
.nav-item{transition:all .2s;border:none;background:none;cursor:pointer;border-radius:10px;padding:12px 14px;display:flex;align-items:center;gap:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:500;width:100%;color:${C.sidebarText};text-align:left;-webkit-tap-highlight-color:transparent}
.nav-item:hover{background:rgba(255,255,255,0.08)}
.nav-item.active{background:${C.accent};color:#fff;font-weight:600}
.modal-bg{position:fixed;inset:0;background:rgba(15,23,42,0.6);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center;z-index:1000;animation:fade .2s ease}
.modal-box{background:${C.surface};border-radius:20px 20px 0 0;width:100%;max-width:100%;max-height:92vh;overflow-y:auto;padding:24px 20px;animation:slideUp .3s ease}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.tab-btn{border:none;background:none;cursor:pointer;padding:9px 16px;border-radius:8px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;font-weight:500;transition:all .2s;color:${C.textMuted};-webkit-tap-highlight-color:transparent}
.tab-btn.active{background:rgba(37,99,235,0.08);color:${C.accent};font-weight:600}
.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199}
.overlay.show{display:block}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:${C.sidebar};color:#fff;position:sticky;top:0;z-index:100;flex-shrink:0}
.badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;white-space:nowrap}
@media(min-width:769px){
  #sidebar{position:fixed;left:0;top:0;bottom:0;width:220px;z-index:200}
  .main-wrap{margin-left:220px}
  .topbar{display:none}
  .overlay{display:none !important}
  #sidebar{transform:none !important}
  .modal-bg{align-items:center}
  .modal-box{border-radius:16px;max-width:540px;max-height:90vh}
  .modal-box.w460{max-width:460px}
  input,select,textarea{font-size:14px;padding:10px 14px}
  .btn{font-size:13.5px;padding:10px 18px}
}
@media(max-width:768px){
  #sidebar{position:fixed;top:0;bottom:0;left:-280px;width:280px;z-index:200;transition:left .3s ease;overflow-y:auto}
  #sidebar.open{left:0;box-shadow:4px 0 24px rgba(0,0,0,0.25)}
  .main-wrap{margin-left:0}
  .pac-table{display:none}
  .pac-cards{display:flex !important}
  .hide-mobile{display:none !important}
  .stats-grid{grid-template-columns:1fr 1fr !important}
  .two-col{grid-template-columns:1fr !important}
  .page-pad{padding:16px !important}
  .fichas-wrap{flex-direction:column !important}
  .fichas-list{width:100% !important}
}
`;

function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { if (!d) return "—"; const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; }
function fmtTime(ts) { if (!ts) return ""; return new Date(ts).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }); }
function getInitials(n) { return n?.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase() || "?"; }
const KIN_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2"];
function kinColor(id) { return KIN_COLORS[(id - 1) % KIN_COLORS.length] || C.accent; }

function Spinner() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
    <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
  </div>;
}

function Avatar({ nombre, size = 38, color = C.accent }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}35`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, color, flexShrink: 0 }}>{getInitials(nombre)}</div>;
}

function Badge({ label, type }) {
  const map = {
    activo: [C.green, "rgba(5,150,105,0.1)"],
    finalizado: [C.textMuted, C.surfaceHigh],
    confirmado: [C.accent, "rgba(37,99,235,0.1)"],
    pendiente: [C.amber, "rgba(217,119,6,0.1)"],
    cancelado: [C.red, "rgba(220,38,38,0.1)"],
    aprobado: [C.green, "rgba(5,150,105,0.1)"],
    rechazado: [C.red, "rgba(220,38,38,0.1)"],
  };
  const [fg, bg] = map[type] || [C.textMuted, C.surfaceHigh];
  return <span className="badge" style={{ color: fg, background: bg, border: `1px solid ${fg}25` }}>{label}</span>;
}

function Field({ label, children }) {
  return <div style={{ marginBottom: 16 }}><label>{label}</label>{children}</div>;
}

function Modal({ title, onClose, children, wide }) {
  return <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal-box${wide ? "" : " w460"} fade`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 17 }}>{title}</div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

function ModalConfirm({ msg, onConfirm, onClose }) {
  return <Modal title="Confirmar" onClose={onClose}>
    <p style={{ color: C.textSoft, marginBottom: 24, lineHeight: 1.6 }}>{msg}</p>
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => { onConfirm(); onClose(); }}>Eliminar</button>
    </div>
  </Modal>;
}

function Empty({ msg, icon = "📭" }) {
  return <div style={{ padding: "40px 24px", textAlign: "center", color: C.textMuted, background: C.surface, borderRadius: 16, border: `1.5px dashed ${C.border}` }}>
    <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
    <div>{msg}</div>
  </div>;
}

function PageHeader({ title, subtitle, action }) {
  return <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 800 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{subtitle}</p>}
    </div>
    {action}
  </div>;
}

// ── FORMS ──────────────────────────────────────────────────────────────────
function FormPaciente({ kinesiologos, onSave, onClose, initial = null, fixedKinId = null }) {
  const [f, setF] = useState(initial || { nombre: "", dni: "", tel: "", obra_social: "", num_afiliado: "", tipo_cobertura: "obra_social", kin_id: fixedKinId || kinesiologos[0]?.id || "", tratamiento: "", notas: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.nombre.trim() && f.dni.trim() && f.kin_id && f.tratamiento.trim();
  return <>
    <Field label="Nombre completo"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: María García" /></Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
      <Field label="DNI"><input value={f.dni} onChange={set("dni")} placeholder="Sin puntos" maxLength={8} /></Field>
      <Field label="Teléfono"><input value={f.tel} onChange={set("tel")} placeholder="11-xxxx-xxxx" /></Field>
    </div>
    <Field label="Tipo de cobertura">
      <select value={f.tipo_cobertura} onChange={set("tipo_cobertura")}>
        <option value="obra_social">Obra Social</option>
        <option value="prepaga">Prepaga</option>
        <option value="particular">Particular</option>
      </select>
    </Field>
    {f.tipo_cobertura !== "particular" && <>
      <Field label="Nombre obra social / prepaga"><input value={f.obra_social} onChange={set("obra_social")} placeholder="OSDE, Swiss Medical..." /></Field>
      <Field label="Número de afiliado"><input value={f.num_afiliado} onChange={set("num_afiliado")} placeholder="Ej: 123456789" /></Field>
    </>}
    <Field label="Kinesiólogo asignado">
      {fixedKinId
        ? <input value={kinesiologos.find(k => k.id == fixedKinId)?.nombre || ""} disabled />
        : <select value={f.kin_id} onChange={set("kin_id")}>{kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}</select>}
    </Field>
    <Field label="Diagnóstico / Tratamiento"><input value={f.tratamiento} onChange={set("tratamiento")} placeholder="Ej: Rehabilitación rodilla derecha" /></Field>
    <Field label="Notas adicionales"><textarea value={f.notas} onChange={set("notas")} placeholder="Antecedentes, indicaciones..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ flex: 2, opacity: valid ? 1 : .45 }}>{initial ? "Guardar cambios" : "Agregar paciente"}</button>
    </div>
  </>;
}

function FormKinesiologo({ onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { nombre: "", especialidad: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.nombre.trim() && f.especialidad.trim();
  return <>
    <Field label="Nombre completo"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: Dra. María García" /></Field>
    <Field label="Especialidad"><input value={f.especialidad} onChange={set("especialidad")} placeholder="Ej: Traumatología..." /></Field>
    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ flex: 2, opacity: valid ? 1 : .45 }}>{initial ? "Guardar" : "Agregar"}</button>
    </div>
  </>;
}

function FormTurno({ pacientes, kinesiologos, onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { paciente_id: pacientes[0]?.id || "", kin_id: kinesiologos[0]?.id || "", fecha: today(), hora: "09:00", duracion: 45, notas: "", estado: "pendiente" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.paciente_id && f.kin_id && f.fecha && f.hora;
  const horas = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];
  return <>
    <Field label="Paciente">
      <select value={f.paciente_id} onChange={set("paciente_id")}>
        <option value="">— Seleccioná —</option>
        {pacientes.filter(p => p.estado === "activo").map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
    </Field>
    <Field label="Kinesiólogo">
      <select value={f.kin_id} onChange={set("kin_id")}>{kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}</select>
    </Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
      <Field label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Field>
      <Field label="Hora"><select value={f.hora} onChange={set("hora")}>{horas.map(h => <option key={h} value={h}>{h}</option>)}</select></Field>
      <Field label="Duración (min)"><input type="number" value={f.duracion} onChange={set("duracion")} min={15} max={120} step={15} /></Field>
      <Field label="Estado">
        <select value={f.estado} onChange={set("estado")}>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </Field>
    </div>
    <Field label="Notas"><textarea value={f.notas} onChange={set("notas")} placeholder="Observaciones..." rows={2} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ flex: 2, opacity: valid ? 1 : .45 }}>{initial ? "Guardar" : "Crear turno"}</button>
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
    <Field label="Notas"><textarea value={f.notas} onChange={set("notas")} placeholder="Evolución, observaciones..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.greenSoft, borderRadius: 10, border: `1px solid rgba(5,150,105,0.2)`, marginBottom: 20 }}>
      <input type="checkbox" id="real" checked={f.realizada} onChange={e => setF(p => ({ ...p, realizada: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.green }} />
      <label htmlFor="real" style={{ textTransform: "none", fontSize: 14, color: C.green, margin: 0, fontWeight: 600 }}>✓ Marcar como realizada</label>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ flex: 2, opacity: valid ? 1 : .45 }}>Registrar sesión</button>
    </div>
  </>;
}

function FormEditSesion({ sesion, onSave, onClose }) {
  const [f, setF] = useState({ fecha: sesion.fecha, notas: sesion.notas || "", realizada: sesion.realizada });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return <>
    <Field label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Field>
    <Field label="Notas"><textarea value={f.notas} onChange={set("notas")} placeholder="Evolución..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.greenSoft, borderRadius: 10, border: `1px solid rgba(5,150,105,0.2)`, marginBottom: 20 }}>
      <input type="checkbox" id="realizada-edit" checked={f.realizada} onChange={e => setF(p => ({ ...p, realizada: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.green }} />
      <label htmlFor="realizada-edit" style={{ textTransform: "none", fontSize: 14, color: C.green, margin: 0, fontWeight: 600 }}>✓ Marcar como realizada</label>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" onClick={() => onSave(f)} style={{ flex: 2 }}>Guardar cambios</button>
    </div>
  </>;
}

function FormEjercicio({ onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { nombre: "", series: 3, reps: 10, descripcion: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  return <>
    <Field label="Nombre del ejercicio"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: Extensión de rodilla" /></Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
      <Field label="Series"><input type="number" value={f.series} onChange={set("series")} min={1} max={10} /></Field>
      <Field label="Repeticiones"><input type="number" value={f.reps} onChange={set("reps")} min={1} max={50} /></Field>
    </div>
    <Field label="Descripción"><textarea value={f.descripcion} onChange={set("descripcion")} placeholder="Instrucciones..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancelar</button>
      <button className="btn btn-primary" disabled={!f.nombre.trim()} onClick={() => f.nombre.trim() && onSave(f)} style={{ flex: 2, opacity: f.nombre.trim() ? 1 : .45 }}>{initial ? "Guardar" : "Agregar"}</button>
    </div>
  </>;
}

// ── PACIENTE VIEWS ─────────────────────────────────────────────────────────
function PacDashboard({ paciente, kinesiologos, sesiones, ejercicios, solicitudes }) {
  const kin = kinesiologos.find(k => k.id === paciente.kin_id);
  const col = kinColor(paciente.kin_id);
  const misSesiones = sesiones.filter(s => s.paciente_id === paciente.id);
  const sesRealizadas = misSesiones.filter(s => s.realizada).length;
  const sesPendientes = misSesiones.filter(s => !s.realizada).length;
  const misEjercicios = ejercicios.filter(e => e.paciente_id === paciente.id);
  const cobertura = { obra_social: "Obra Social", prepaga: "Prepaga", particular: "Particular" };

  return <div className="fade">
    <PageHeader title={`Hola, ${paciente.nombre.split(" ")[0]} 👋`} subtitle="Tu espacio de seguimiento" />

    {/* Kinesiólogo asignado */}
    {kin && <div className="card" style={{ padding: "18px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
      <Avatar nombre={kin.nombre} size={52} color={col} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginBottom: 4 }}>Tu kinesiólogo</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{kin.nombre}</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>{kin.especialidad}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Tratamiento</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.textSoft, maxWidth: 160, textAlign: "right" }}>{paciente.tratamiento}</div>
      </div>
    </div>}

    {/* Stats */}
    <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
      {[
        { label: "Sesiones realizadas", val: sesRealizadas, color: C.green, icon: "✅" },
        { label: "Sesiones pendientes", val: sesPendientes, color: C.amber, icon: "⏳" },
        { label: "Ejercicios asignados", val: misEjercicios.length, color: C.accent, icon: "💪" },
      ].map(s => <div key={s.label} className="card" style={{ padding: "16px" }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
      </div>)}
    </div>

    {/* Cobertura */}
    <div className="card" style={{ padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>🏥 Mi cobertura</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="two-col">
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontWeight: 600 }}>Tipo</div>
          <div style={{ fontWeight: 500 }}>{cobertura[paciente.tipo_cobertura] || "—"}</div>
        </div>
        {paciente.tipo_cobertura !== "particular" && <>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontWeight: 600 }}>Obra social / Prepaga</div>
            <div style={{ fontWeight: 500 }}>{paciente.obra_social || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontWeight: 600 }}>Nº Afiliado</div>
            <div style={{ fontWeight: 500 }}>{paciente.num_afiliado || "—"}</div>
          </div>
        </>}
      </div>
    </div>

    {/* Últimas sesiones */}
    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Últimas sesiones</div>
    {misSesiones.length === 0 ? <Empty msg="Sin sesiones registradas" icon="📋" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {misSesiones.slice(0, 4).map(s => <div key={s.id} className="card" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 700, color: col, fontSize: 13, minWidth: 88 }}>{fmtDate(s.fecha)}</div>
          <div style={{ flex: 1, fontSize: 13, color: C.textSoft }}>{s.notas || <span style={{ fontStyle: "italic", color: C.textMuted }}>Sin notas</span>}</div>
          <Badge label={s.realizada ? "Realizada" : "Pendiente"} type={s.realizada ? "activo" : "pendiente"} />
        </div>)}
      </div>}
  </div>;
}

function PacEjercicios({ paciente, ejercicios }) {
  const misEjercicios = ejercicios.filter(e => e.paciente_id === paciente.id);
  return <div className="fade">
    <PageHeader title="Mis ejercicios" subtitle="Asignados por tu kinesiólogo" />
    {misEjercicios.length === 0 ? <Empty msg="Sin ejercicios asignados aún" icon="💪" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {misEjercicios.map(e => <div key={e.id} className="card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: e.descripcion ? 10 : 0, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{e.nombre}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.accent, background: C.accentSoft, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{e.series} series</span>
              <span style={{ fontSize: 12, color: C.green, background: C.greenSoft, padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>{e.reps} reps</span>
            </div>
          </div>
          {e.descripcion && <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.5 }}>{e.descripcion}</div>}
        </div>)}
      </div>}
  </div>;
}

function PacTurnos({ paciente, kinesiologos, solicitudes, setSolicitudes }) {
  const [modal, setModal] = useState(false);
  const kin = kinesiologos.find(k => k.id === paciente.kin_id);
  const col = kinColor(paciente.kin_id);
  const horas = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"];
  const [f, setF] = useState({ fecha: today(), hora: "09:00", notas: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const misSolicitudes = solicitudes.filter(s => s.paciente_id === paciente.id).sort((a, b) => b.created_at?.localeCompare(a.created_at));

  const enviarSolicitud = async () => {
    const { data } = await supabase.from("solicitudes_turno").insert([{
      paciente_id: paciente.id, kin_id: paciente.kin_id,
      fecha: f.fecha, hora: f.hora, notas: f.notas, estado: "pendiente"
    }]).select().single();
    if (data) { setSolicitudes(prev => [data, ...prev]); setModal(false); setF({ fecha: today(), hora: "09:00", notas: "" }); }
  };

  return <div className="fade">
    <PageHeader title="Mis turnos" subtitle="Solicitudes y estado" action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Solicitar turno</button>} />
    {misSolicitudes.length === 0 ? <Empty msg="No tenés solicitudes de turno" icon="📅" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {misSolicitudes.map(s => <div key={s.id} className="card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: s.notas ? 10 : 0 }}>
            <div style={{ fontWeight: 800, color: C.accent, fontSize: 15, minWidth: 50 }}>{s.hora}</div>
            {kin && <Avatar nombre={kin.nombre} size={34} color={col} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{fmtDate(s.fecha)}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{kin?.nombre}</div>
            </div>
            <Badge label={s.estado} type={s.estado} />
          </div>
          {s.notas && <div style={{ fontSize: 13, color: C.textSoft, paddingLeft: 4 }}>{s.notas}</div>}
        </div>)}
      </div>}
    {modal && <Modal title="Solicitar turno" onClose={() => setModal(false)}>
      <div style={{ background: C.accentSoft, border: `1px solid rgba(37,99,235,0.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, fontSize: 13, color: C.accent }}>
        ℹ️ Tu solicitud será revisada por la secretaría y te notificarán la confirmación.
      </div>
      <Field label="Fecha preferida"><input type="date" value={f.fecha} onChange={set("fecha")} min={today()} /></Field>
      <Field label="Hora preferida"><select value={f.hora} onChange={set("hora")}>{horas.map(h => <option key={h} value={h}>{h}</option>)}</select></Field>
      <Field label="Notas adicionales"><textarea value={f.notas} onChange={set("notas")} placeholder="Aclaraciones, preferencias..." rows={3} style={{ resize: "vertical" }} /></Field>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-ghost" onClick={() => setModal(false)} style={{ flex: 1 }}>Cancelar</button>
        <button className="btn btn-primary" onClick={enviarSolicitud} style={{ flex: 2 }}>Enviar solicitud</button>
      </div>
    </Modal>}
  </div>;
}

function PacPerfil({ paciente, onActualizar }) {
  const [f, setF] = useState({ obra_social: paciente.obra_social || "", num_afiliado: paciente.num_afiliado || "", tipo_cobertura: paciente.tipo_cobertura || "obra_social", tel: paciente.tel || "" });
  const [guardado, setGuardado] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const guardar = async () => {
    await onActualizar(f);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  return <div className="fade">
    <PageHeader title="Mi perfil" subtitle="Actualizá tus datos" />
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        <Avatar nombre={paciente.nombre} size={56} color={C.accent} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{paciente.nombre}</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>DNI {paciente.dni}</div>
        </div>
      </div>
      <Field label="Teléfono"><input value={f.tel} onChange={set("tel")} placeholder="11-xxxx-xxxx" /></Field>
      <Field label="Tipo de cobertura">
        <select value={f.tipo_cobertura} onChange={set("tipo_cobertura")}>
          <option value="obra_social">Obra Social</option>
          <option value="prepaga">Prepaga</option>
          <option value="particular">Particular</option>
        </select>
      </Field>
      {f.tipo_cobertura !== "particular" && <>
        <Field label="Nombre obra social / prepaga"><input value={f.obra_social} onChange={set("obra_social")} placeholder="OSDE, Swiss Medical..." /></Field>
        <Field label="Número de afiliado"><input value={f.num_afiliado} onChange={set("num_afiliado")} placeholder="Ej: 123456789" /></Field>
      </>}
      <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={guardar}>
        {guardado ? "✓ Guardado" : "Guardar cambios"}
      </button>
    </div>
  </div>;
}

function PacChat({ paciente, mensajes, setMensajes }) {
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);
  const misMensajes = mensajes.filter(m => m.paciente_id === paciente.id).sort((a, b) => a.created_at?.localeCompare(b.created_at));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [misMensajes.length]);

  const enviar = async () => {
    if (!texto.trim()) return;
    const { data } = await supabase.from("mensajes").insert([{ paciente_id: paciente.id, remitente: "paciente", texto: texto.trim(), leido: false }]).select().single();
    if (data) { setMensajes(prev => [...prev, data]); setTexto(""); }
  };

  return <div className="fade" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
    <PageHeader title="Mensajes" subtitle="Comunicación con secretaría" />
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, paddingRight: 4 }}>
      {misMensajes.length === 0 && <div style={{ textAlign: "center", color: C.textMuted, padding: 40, fontSize: 14 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
        Enviá un mensaje a la secretaría
      </div>}
      {misMensajes.map(m => {
        const esMio = m.remitente === "paciente";
        return <div key={m.id} style={{ display: "flex", justifyContent: esMio ? "flex-end" : "flex-start" }}>
          <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: esMio ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: esMio ? C.accent : C.surface, color: esMio ? "#fff" : C.text, fontSize: 14, lineHeight: 1.5, border: esMio ? "none" : `1px solid ${C.border}`, boxShadow: C.shadow }}>
            <div>{m.texto}</div>
            <div style={{ fontSize: 10, marginTop: 4, opacity: .65, textAlign: "right" }}>{fmtTime(m.created_at)}</div>
          </div>
        </div>;
      })}
      <div ref={bottomRef} />
    </div>
    <div style={{ display: "flex", gap: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
      <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribí tu mensaje..." onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviar()} style={{ flex: 1 }} />
      <button className="btn btn-primary" onClick={enviar} style={{ padding: "11px 18px" }}>Enviar</button>
    </div>
  </div>;
}

// ── SECRETARIA — SOLICITUDES ────────────────────────────────────────────────
function SecSolicitudes({ solicitudes, setSolicitudes, pacientes, kinesiologos, turnos, setTurnos }) {
  const pendientes = solicitudes.filter(s => s.estado === "pendiente");

  const aprobar = async (sol) => {
    await supabase.from("solicitudes_turno").update({ estado: "aprobado" }).eq("id", sol.id);
    setSolicitudes(prev => prev.map(s => s.id === sol.id ? { ...s, estado: "aprobado" } : s));
    const { data } = await supabase.from("turnos").insert([{ paciente_id: sol.paciente_id, kin_id: sol.kin_id, fecha: sol.fecha, hora: sol.hora, duracion: 45, estado: "confirmado", notas: sol.notas || "" }]).select().single();
    if (data) setTurnos(prev => [...prev, data]);
  };

  const rechazar = async (id) => {
    await supabase.from("solicitudes_turno").update({ estado: "rechazado" }).eq("id", id);
    setSolicitudes(prev => prev.map(s => s.id === id ? { ...s, estado: "rechazado" } : s));
  };

  return <div className="fade">
    <PageHeader title="Solicitudes de turno" subtitle={`${pendientes.length} pendientes de revisión`} />
    {solicitudes.length === 0 ? <Empty msg="Sin solicitudes" icon="📋" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {solicitudes.sort((a, b) => b.created_at?.localeCompare(a.created_at)).map(s => {
          const pac = pacientes.find(p => p.id === s.paciente_id);
          const kin = kinesiologos.find(k => k.id === s.kin_id);
          const col = kinColor(s.kin_id);
          return <div key={s.id} className="card" style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar nombre={pac?.nombre || "?"} size={40} color={col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{pac?.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{kin?.nombre} · {fmtDate(s.fecha)} {s.hora}</div>
              </div>
              <Badge label={s.estado} type={s.estado} />
            </div>
            {s.notas && <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 12, padding: "8px 12px", background: C.surfaceHigh, borderRadius: 8 }}>{s.notas}</div>}
            {s.estado === "pendiente" && <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => rechazar(s.id)}>✕ Rechazar</button>
              <button className="btn btn-green" style={{ flex: 2 }} onClick={() => aprobar(s)}>✓ Aprobar y crear turno</button>
            </div>}
          </div>;
        })}
      </div>}
  </div>;
}

function SecChat({ mensajes, setMensajes, pacientes }) {
  const [selPacId, setSelPacId] = useState(null);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);
  const pacientesConMensajes = [...new Set(mensajes.map(m => m.paciente_id))];
  const selPac = pacientes.find(p => p.id === selPacId);
  const conv = mensajes.filter(m => m.paciente_id === selPacId).sort((a, b) => a.created_at?.localeCompare(b.created_at));
  const noLeidos = (pid) => mensajes.filter(m => m.paciente_id === pid && m.remitente === "paciente" && !m.leido).length;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conv.length]);

  const enviar = async () => {
    if (!texto.trim() || !selPacId) return;
    const { data } = await supabase.from("mensajes").insert([{ paciente_id: selPacId, remitente: "secretaria", texto: texto.trim(), leido: true }]).select().single();
    if (data) { setMensajes(prev => [...prev, data]); setTexto(""); }
  };

  const marcarLeidos = async (pid) => {
    await supabase.from("mensajes").update({ leido: true }).eq("paciente_id", pid).eq("remitente", "paciente");
    setMensajes(prev => prev.map(m => m.paciente_id === pid && m.remitente === "paciente" ? { ...m, leido: true } : m));
  };

  return <div className="fade" style={{ display: "flex", gap: 16, height: "calc(100vh - 160px)" }}>
    {/* Lista pacientes */}
    <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Conversaciones</div>
      {pacientesConMensajes.length === 0 && <div style={{ color: C.textMuted, fontSize: 13 }}>Sin mensajes aún</div>}
      {pacientes.filter(p => pacientesConMensajes.includes(p.id) || true).map(p => {
        const nl = noLeidos(p.id);
        return <div key={p.id} onClick={() => { setSelPacId(p.id); marcarLeidos(p.id); }} style={{ padding: "11px 13px", borderRadius: 12, border: `1.5px solid ${selPacId === p.id ? C.accent : C.border}`, background: selPacId === p.id ? C.accentSoft : C.surface, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar nombre={p.nombre} size={32} color={kinColor(p.kin_id)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nombre}</div>
          </div>
          {nl > 0 && <div style={{ background: C.accent, color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{nl}</div>}
        </div>;
      })}
    </div>

    {/* Chat */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {!selPac ? <Empty msg="Seleccioná un paciente para ver la conversación" icon="💬" /> : <>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "12px 16px", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
          <Avatar nombre={selPac.nombre} size={36} color={kinColor(selPac.kin_id)} />
          <div style={{ fontWeight: 700 }}>{selPac.nombre}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {conv.length === 0 && <div style={{ textAlign: "center", color: C.textMuted, padding: 32 }}>Sin mensajes aún</div>}
          {conv.map(m => {
            const esSec = m.remitente === "secretaria";
            return <div key={m.id} style={{ display: "flex", justifyContent: esSec ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: esSec ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: esSec ? C.accent : C.surface, color: esSec ? "#fff" : C.text, fontSize: 14, lineHeight: 1.5, border: esSec ? "none" : `1px solid ${C.border}`, boxShadow: C.shadow }}>
                <div style={{ fontSize: 10, marginBottom: 4, opacity: .65 }}>{esSec ? "Secretaría" : selPac.nombre}</div>
                <div>{m.texto}</div>
                <div style={{ fontSize: 10, marginTop: 4, opacity: .65, textAlign: "right" }}>{fmtTime(m.created_at)}</div>
              </div>
            </div>;
          })}
          <div ref={bottomRef} />
        </div>
        <div style={{ display: "flex", gap: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribí tu respuesta..." onKeyDown={e => e.key === "Enter" && enviar()} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={enviar} style={{ padding: "11px 18px" }}>Enviar</button>
        </div>
      </>}
    </div>
  </div>;
}

// ── SECRETARIA VIEWS ───────────────────────────────────────────────────────
function SecDashboard({ pacientes, kinesiologos, sesiones, turnos, solicitudes, mensajes }) {
  const hoy = today();
  const sesHoy = sesiones.filter(s => s.fecha === hoy).length;
  const turnosFuturos = turnos.filter(t => t.fecha >= hoy).length;
  const solPendientes = solicitudes.filter(s => s.estado === "pendiente").length;
  const msgNoLeidos = mensajes.filter(m => m.remitente === "paciente" && !m.leido).length;
  return <div className="fade">
    <PageHeader title="Dashboard" subtitle={fmtDate(hoy)} />
    <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
      {[
        { label: "Pacientes activos", val: pacientes.filter(p => p.estado === "activo").length, color: C.accent, icon: "👥" },
        { label: "Sesiones hoy", val: sesHoy, color: C.green, icon: "⚡" },
        { label: "Turnos agendados", val: turnosFuturos, color: C.purple, icon: "📅" },
        { label: "Solicitudes pendientes", val: solPendientes, color: C.amber, icon: "🔔" },
      ].map(s => <div key={s.label} className="card" style={{ padding: "16px" }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.val}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
      </div>)}
    </div>
    <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Turnos de hoy</div>
        {turnos.filter(t => t.fecha === hoy).length === 0 ? <Empty msg="Sin turnos hoy" icon="📅" /> :
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {turnos.filter(t => t.fecha === hoy).sort((a, b) => a.hora.localeCompare(b.hora)).slice(0, 5).map(t => {
              const pac = pacientes.find(p => p.id === t.paciente_id);
              const kin = kinesiologos.find(k => k.id === t.kin_id);
              return <div key={t.id} className="card" style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 14, minWidth: 46 }}>{t.hora}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{pac?.nombre}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{kin?.nombre}</div>
                </div>
                <Badge label={t.estado} type={t.estado} />
              </div>;
            })}
          </div>}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Por kinesiólogo</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {kinesiologos.map(k => {
            const kPac = pacientes.filter(p => p.kin_id === k.id && p.estado === "activo");
            const kSesHoy = sesiones.filter(s => s.fecha === hoy && kPac.find(p => p.id === s.paciente_id));
            const col = kinColor(k.id);
            return <div key={k.id} className="card" style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar nombre={k.nombre} size={34} color={col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{k.nombre}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{k.especialidad}</div>
              </div>
              <div style={{ display: "flex", gap: 12, textAlign: "center" }}>
                <div><div style={{ fontWeight: 800, fontSize: 15, color: C.accent }}>{kPac.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>pac.</div></div>
                <div><div style={{ fontWeight: 800, fontSize: 15, color: C.green }}>{kSesHoy.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>ses.</div></div>
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
    <PageHeader title="Pacientes" subtitle={`${pacientes.filter(p => p.estado === "activo").length} activos`} action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo</button>} />
    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍  Buscar..." style={{ flex: 1, minWidth: 140 }} />
      <div style={{ display: "flex", gap: 4, background: C.surfaceHigh, borderRadius: 10, padding: 4 }}>
        {["activo", "finalizado", "todos"].map(f => <button key={f} className={`tab-btn ${filtro === f ? "active" : ""}`} onClick={() => setFiltro(f)} style={{ textTransform: "capitalize", padding: "7px 10px" }}>{f}</button>)}
      </div>
    </div>
    <div className="card pac-table" style={{ overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: C.surfaceHigh }}>
            {["Paciente", "Kinesiólogo", "Cobertura", "Ses.", "Estado", ""].map(h => <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtrados.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.textMuted }}>No se encontraron pacientes</td></tr>}
            {filtrados.map(p => {
              const k = kinesiologos.find(k => k.id === p.kin_id);
              const col = kinColor(p.kin_id);
              const cob = { obra_social: "OS", prepaga: "Prepaga", particular: "Particular" };
              return <tr key={p.id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar nombre={p.nombre} size={32} color={col} />
                    <div><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: 11, color: C.textMuted }}>DNI {p.dni}</div></div>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: C.textSoft }}>{k?.nombre || "—"}</td>
                <td style={{ padding: "12px 14px", fontSize: 13 }}>{cob[p.tipo_cobertura] || "—"}{p.obra_social ? ` · ${p.obra_social}` : ""}</td>
                <td style={{ padding: "12px 14px", fontWeight: 800, fontSize: 17, color: C.accent, textAlign: "center" }}>{p.sesiones}</td>
                <td style={{ padding: "12px 14px" }}><Badge label={p.estado} type={p.estado} /></td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" style={{ padding: "5px 9px", fontSize: 12 }} onClick={() => setEditando(p)}>✏️</button>
                    {p.estado === "activo"
                      ? <button className="btn btn-amber" style={{ padding: "5px 9px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "finalizado")}>Finalizar</button>
                      : <button className="btn btn-green" style={{ padding: "5px 9px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "activo")}>Reactivar</button>}
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
    <div className="pac-cards" style={{ display: "none", flexDirection: "column", gap: 10 }}>
      {filtrados.length === 0 && <Empty msg="No se encontraron pacientes" />}
      {filtrados.map(p => {
        const k = kinesiologos.find(k => k.id === p.kin_id);
        const col = kinColor(p.kin_id);
        return <div key={p.id} className="card" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <Avatar nombre={p.nombre} size={42} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>DNI {p.dni}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: C.accent }}>{p.sesiones}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>sesiones</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 6 }}>{p.tratamiento}</div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>{k?.nombre} · {p.obra_social || "Particular"}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge label={p.estado} type={p.estado} />
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => setEditando(p)}>✏️</button>
              {p.estado === "activo"
                ? <button className="btn btn-amber" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => onCambiarEstado(p.id, "finalizado")}>Finalizar</button>
                : <button className="btn btn-green" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => onCambiarEstado(p.id, "activo")}>Reactivar</button>}
            </div>
          </div>
        </div>;
      })}
    </div>
    {modal && <Modal title="Nuevo paciente" onClose={() => setModal(false)} wide><FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar paciente" onClose={() => setEditando(null)} wide><FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
  </div>;
}

function SecKinesiologos({ kinesiologos, pacientes, sesiones, onAgregar, onEditar, onEliminar }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmando, setConfirmando] = useState(null);
  return <div className="fade">
    <PageHeader title="Kinesiólogos" subtitle={`${kinesiologos.length} profesionales`} action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo</button>} />
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {kinesiologos.length === 0 && <Empty msg="Sin kinesiólogos" icon="🩺" />}
      {kinesiologos.map(k => {
        const kPac = pacientes.filter(p => p.kin_id === k.id && p.estado === "activo");
        const kSes = sesiones.filter(s => kPac.find(p => p.id === s.paciente_id));
        const col = kinColor(k.id);
        return <div key={k.id} className="card" style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Avatar nombre={k.nombre} size={48} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{k.nombre}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{k.especialidad}</div>
            </div>
            <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
              <div><div style={{ fontWeight: 800, fontSize: 22, color: C.accent }}>{kPac.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>pacientes</div></div>
              <div><div style={{ fontWeight: 800, fontSize: 22, color: C.green }}>{kSes.length}</div><div style={{ fontSize: 10, color: C.textMuted }}>sesiones</div></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditando(k)}>✏️ Editar</button>
            <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setConfirmando(k)}>🗑 Eliminar</button>
          </div>
        </div>;
      })}
    </div>
    {modal && <Modal title="Nuevo kinesiólogo" onClose={() => setModal(false)}><FormKinesiologo onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar kinesiólogo" onClose={() => setEditando(null)}><FormKinesiologo onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
    {confirmando && <ModalConfirm msg={`¿Eliminar a ${confirmando.nombre}?`} onConfirm={() => onEliminar(confirmando.id)} onClose={() => setConfirmando(null)} />}
  </div>;
}

function SecTurnos({ turnos, pacientes, kinesiologos, onAgregar, onEditar, onEliminar }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmando, setConfirmando] = useState(null);
  const [fecha, setFecha] = useState(today());
  const [filtroKin, setFiltroKin] = useState("todos");
  const filtrados = turnos.filter(t => t.fecha === fecha && (filtroKin === "todos" || t.kin_id == filtroKin)).sort((a, b) => a.hora.localeCompare(b.hora));
  return <div className="fade">
    <PageHeader title="Agenda" action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo</button>} />
    <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
      <select value={filtroKin} onChange={e => setFiltroKin(e.target.value)} style={{ flex: 1, minWidth: 140 }}>
        <option value="todos">Todos</option>
        {kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}
      </select>
    </div>
    {filtrados.length === 0 ? <Empty msg="Sin turnos para esta fecha" icon="📅" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtrados.map(t => {
          const pac = pacientes.find(p => p.id === t.paciente_id);
          const kin = kinesiologos.find(k => k.id === t.kin_id);
          const col = kinColor(t.kin_id);
          return <div key={t.id} className="card" style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontWeight: 800, color: C.accent, fontSize: 16, minWidth: 50 }}>{t.hora}</div>
              <Avatar nombre={pac?.nombre || "?"} size={34} color={col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{pac?.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{kin?.nombre} · {t.duracion} min</div>
              </div>
              <Badge label={t.estado} type={t.estado} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditando(t)}>✏️ Editar</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setConfirmando(t)}>🗑 Eliminar</button>
            </div>
          </div>;
        })}
      </div>}
    {modal && <Modal title="Nuevo turno" onClose={() => setModal(false)} wide><FormTurno pacientes={pacientes} kinesiologos={kinesiologos} onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar turno" onClose={() => setEditando(null)} wide><FormTurno pacientes={pacientes} kinesiologos={kinesiologos} onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
    {confirmando && <ModalConfirm msg="¿Eliminar este turno?" onConfirm={() => onEliminar(confirmando.id)} onClose={() => setConfirmando(null)} />}
  </div>;
}

// ── KINESIOLOGO VIEWS ──────────────────────────────────────────────────────
function KinHoy({ kin, pacientes, sesiones, turnos, onNuevaSesion }) {
  const hoy = today();
  const col = kinColor(kin.id);
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id && p.estado === "activo");
  const misTurnos = turnos.filter(t => t.kin_id === kin.id && t.fecha === hoy).sort((a, b) => a.hora.localeCompare(b.hora));
  const misSesHoy = sesiones.filter(s => s.fecha === hoy && misPacientes.find(p => p.id === s.paciente_id));
  const turnosFuturos = turnos.filter(t => t.kin_id === kin.id && t.fecha >= hoy).length;
  return <div className="fade">
    <PageHeader title={`Hola, ${kin.nombre.split(" ").slice(-1)[0]} 👋`} subtitle={kin.especialidad} action={<button className="btn btn-primary" onClick={onNuevaSesion}>+ Sesión</button>} />
    <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
      {[
        { label: "Mis pacientes", val: misPacientes.length, color: col, icon: "👥" },
        { label: "Sesiones hoy", val: misSesHoy.length, color: C.green, icon: "⚡" },
        { label: "Turnos agendados", val: turnosFuturos, color: C.purple, icon: "📅" },
      ].map(s => <div key={s.label} className="card" style={{ padding: "16px" }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.val}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
      </div>)}
    </div>
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Mis turnos de hoy</div>
    {misTurnos.length === 0 ? <Empty msg="Sin turnos para hoy" icon="📅" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {misTurnos.map(t => {
          const pac = pacientes.find(p => p.id === t.paciente_id);
          return <div key={t.id} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontWeight: 800, color: col, fontSize: 16, minWidth: 50 }}>{t.hora}</div>
            <Avatar nombre={pac?.nombre || "?"} size={36} color={col} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{pac?.nombre}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{pac?.tratamiento}</div>
            </div>
            <Badge label={t.estado} type={t.estado} />
          </div>;
        })}
      </div>}
  </div>;
}

function KinFichas({ kin, pacientes, setPacientes, sesiones, setSesiones, ejercicios, kinesiologos, onAgregarPaciente, onEditarPaciente, onCambiarEstado, onAgregarSesion, onAgregarEjercicio, onEditarEjercicio, onEliminarEjercicio }) {
  const col = kinColor(kin.id);
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id);
  const [selId, setSelId] = useState(misPacientes[0]?.id || null);
  const [tab, setTab] = useState("info");
  const [modalSes, setModalSes] = useState(false);
  const [modalEj, setModalEj] = useState(false);
  const [modalPac, setModalPac] = useState(false);
  const [editPac, setEditPac] = useState(false);
  const [editEj, setEditEj] = useState(null);
  const [editandoSesion, setEditandoSesion] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const sel = pacientes.find(p => p.id === selId);
  const misSesiones = sesiones.filter(s => s.paciente_id === selId).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const misEjercicios = ejercicios.filter(e => e.paciente_id === selId);
  const pacFiltrados = misPacientes.filter(p => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  const guardarSesion = async f => {
    const eraRealizada = editandoSesion.realizada;
    const { data } = await supabase.from("sesiones").update({ fecha: f.fecha, notas: f.notas, realizada: f.realizada }).eq("id", editandoSesion.id).select().single();
    if (data) {
      setSesiones(prev => prev.map(s => s.id === editandoSesion.id ? data : s));
      if (f.realizada && !eraRealizada) {
        await supabase.from("pacientes").update({ sesiones: (sel?.sesiones || 0) + 1 }).eq("id", selId);
        setPacientes(prev => prev.map(p => p.id === selId ? { ...p, sesiones: p.sesiones + 1 } : p));
      }
      if (!f.realizada && eraRealizada) {
        await supabase.from("pacientes").update({ sesiones: Math.max((sel?.sesiones || 1) - 1, 0) }).eq("id", selId);
        setPacientes(prev => prev.map(p => p.id === selId ? { ...p, sesiones: Math.max(p.sesiones - 1, 0) } : p));
      }
    }
    setEditandoSesion(null);
  };

  return <div className="fade">
    <div className="fichas-wrap" style={{ display: "flex", gap: 20 }}>
      <div className="fichas-list" style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..." style={{ flex: 1, fontSize: 13 }} />
          <button className="btn btn-primary" style={{ padding: "10px 12px" }} onClick={() => setModalPac(true)}>+</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pacFiltrados.length === 0 && <div style={{ color: C.textMuted, fontSize: 13 }}>Sin pacientes</div>}
          {pacFiltrados.map(p => <div key={p.id} onClick={() => { setSelId(p.id); setTab("info"); }} style={{ padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selId === p.id ? col : C.border}`, background: selId === p.id ? `${col}08` : C.surface, cursor: "pointer", transition: "all .2s" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: selId === p.id ? col : C.text }}>{p.nombre}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4, display: "flex", gap: 6, alignItems: "center" }}>{p.sesiones} ses · <Badge label={p.estado} type={p.estado} /></div>
          </div>)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {!sel ? <Empty msg="Seleccioná un paciente" icon="👤" /> : <>
          <div className="card" style={{ padding: "16px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Avatar nombre={sel.nombre} size={48} color={col} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{sel.nombre}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>DNI {sel.dni} · {sel.obra_social || "Particular"}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>desde {fmtDate(sel.fecha_inicio)}</div>
              </div>
              <Badge label={sel.estado} type={sel.estado} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => setEditPac(true)}>✏️ Editar</button>
              {sel.estado === "activo"
                ? <button className="btn btn-amber" style={{ flex: 1, fontSize: 13 }} onClick={() => onCambiarEstado(sel.id, "finalizado")}>Finalizar</button>
                : <button className="btn btn-green" style={{ flex: 1, fontSize: 13 }} onClick={() => onCambiarEstado(sel.id, "activo")}>Reactivar</button>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 14, background: C.surfaceHigh, borderRadius: 10, padding: 4 }}>
            {["info", "sesiones", "ejercicios"].map(t => <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize", flex: 1 }}>{t}</button>)}
          </div>
          {tab === "info" && <div className="fade card" style={{ padding: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[["Tratamiento", sel.tratamiento, "1/-1"], ["Teléfono", sel.tel || "—"], ["Cobertura", sel.tipo_cobertura || "—"], ["Obra social", sel.obra_social || "—"], ["Nº Afiliado", sel.num_afiliado || "—"], ["Sesiones", sel.sesiones]].map(([l, v, gc]) =>
                <div key={l} style={{ gridColumn: gc }}>
                  <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontWeight: 600 }}>{l}</div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{v}</div>
                </div>)}
              {sel.notas && <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4, fontWeight: 600 }}>Notas</div>
                <div style={{ fontSize: 13, color: C.textSoft, background: C.surfaceHigh, padding: "10px 12px", borderRadius: 8 }}>{sel.notas}</div>
              </div>}
            </div>
          </div>}
          {tab === "sesiones" && <div className="fade">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}><button className="btn btn-primary" onClick={() => setModalSes(true)}>+ Nueva</button></div>
            {misSesiones.length === 0 ? <Empty msg="Sin sesiones" icon="📋" /> :
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {misSesiones.map(s => <div key={s.id} className="card" style={{ padding: "13px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: s.notas ? 6 : 0 }}>
                    <div style={{ fontWeight: 700, color: col, fontSize: 13 }}>{fmtDate(s.fecha)}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <Badge label={s.realizada ? "Realizada" : "Pendiente"} type={s.realizada ? "activo" : "pendiente"} />
                      <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setEditandoSesion(s)}>✏️</button>
                    </div>
                  </div>
                  {s.notas && <div style={{ fontSize: 13, color: C.textSoft }}>{s.notas}</div>}
                </div>)}
              </div>}
          </div>}
          {tab === "ejercicios" && <div className="fade">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}><button className="btn btn-primary" onClick={() => setModalEj(true)}>+ Agregar</button></div>
            {misEjercicios.length === 0 ? <Empty msg="Sin ejercicios" icon="💪" /> :
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {misEjercicios.map(e => <div key={e.id} className="card" style={{ padding: "13px 15px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: e.descripcion ? 8 : 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{e.nombre}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: C.accent, background: C.accentSoft, padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>{e.series}×{e.reps}</span>
                      <button className="btn btn-ghost" style={{ padding: "4px 7px" }} onClick={() => setEditEj(e)}>✏️</button>
                      <button className="btn btn-danger" style={{ padding: "4px 7px" }} onClick={() => onEliminarEjercicio(e.id)}>🗑</button>
                    </div>
                  </div>
                  {e.descripcion && <div style={{ fontSize: 12, color: C.textMuted }}>{e.descripcion}</div>}
                </div>)}
              </div>}
          </div>}
        </>}
      </div>
    </div>
    {modalSes && <Modal title="Registrar sesión" onClose={() => setModalSes(false)}><FormSesion pacientes={sel ? [sel] : []} onSave={f => { onAgregarSesion({ ...f, paciente_id: selId }); setModalSes(false); }} onClose={() => setModalSes(false)} /></Modal>}
    {editandoSesion && <Modal title="Editar sesión" onClose={() => setEditandoSesion(null)}><FormEditSesion sesion={editandoSesion} onSave={guardarSesion} onClose={() => setEditandoSesion(null)} /></Modal>}
    {modalEj && <Modal title="Nuevo ejercicio" onClose={() => setModalEj(false)}><FormEjercicio onSave={f => { onAgregarEjercicio({ ...f, paciente_id: selId }); setModalEj(false); }} onClose={() => setModalEj(false)} /></Modal>}
    {editEj && <Modal title="Editar ejercicio" onClose={() => setEditEj(null)}><FormEjercicio onSave={f => { onEditarEjercicio(editEj.id, f); setEditEj(null); }} onClose={() => setEditEj(null)} initial={editEj} /></Modal>}
    {modalPac && <Modal title="Agregar paciente" onClose={() => setModalPac(false)} wide><FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregarPaciente(f); setModalPac(false); }} onClose={() => setModalPac(false)} fixedKinId={kin.id} /></Modal>}
    {editPac && sel && <Modal title="Editar paciente" onClose={() => setEditPac(false)} wide><FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditarPaciente(sel.id, f); setEditPac(false); }} onClose={() => setEditPac(false)} initial={sel} fixedKinId={kin.id} /></Modal>}
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
    const { data, error: err } = await supabase.from("usuarios").select("*, kinesiologos(*), pacientes(*)").eq("email", email.trim().toLowerCase()).eq("password", password).eq("activo", true).single();
    setLoading(false);
    if (err || !data) { setError("Email o contraseña incorrectos"); return; }
    onLogin(data);
  };
  return <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
    <div style={{ maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, borderRadius: 22, margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 8px 32px rgba(37,99,235,0.2)" }}>🦴</div>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>KinesioApp</h1>
        <p style={{ color: C.textMuted, fontSize: 14, marginTop: 6 }}>Centro de Kinesiología</p>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <Field label="Email"><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" onKeyDown={e => e.key === "Enter" && handleLogin()} /></Field>
        <Field label="Contraseña"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} /></Field>
        {error && <div style={{ background: C.redSoft, color: C.red, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 16, border: `1px solid rgba(220,38,38,0.2)` }}>⚠️ {error}</div>}
        <button className="btn btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }} onClick={handleLogin} disabled={loading}>{loading ? "Ingresando..." : "Ingresar →"}</button>
        <div style={{ marginTop: 18, padding: 14, background: C.surfaceHigh, borderRadius: 10, fontSize: 12, color: C.textMuted, lineHeight: 1.9 }}>
          <div style={{ fontWeight: 600, marginBottom: 4, color: C.textSoft }}>Accesos de prueba:</div>
          <div>📋 secretaria@kinesio.com / 1234</div>
          <div>🩺 laura@kinesio.com / 1234</div>
          <div>🏥 roberto@paciente.com / 1234</div>
          <div>🏥 ana@paciente.com / 1234</div>
        </div>
      </div>
    </div>
  </div>;
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ auth, view, setView, onLogout, isOpen, onClose, badgeSolicitudes, badgeMensajes }) {
  const isPac = auth.rol === "paciente";
  const isKin = auth.rol === "kinesiologo";
  const col = isKin ? kinColor(auth.kin_id) : isPac ? C.green : C.accent;

  const navSec = [
    { id: "home", icon: "⚡", label: "Dashboard" },
    { id: "pacientes", icon: "👥", label: "Pacientes" },
    { id: "kinesiologos", icon: "🩺", label: "Kinesiólogos" },
    { id: "turnos", icon: "📅", label: "Agenda" },
    { id: "solicitudes", icon: "🔔", label: "Solicitudes", badge: badgeSolicitudes },
    { id: "chat", icon: "💬", label: "Mensajes", badge: badgeMensajes },
  ];
  const navKin = [
    { id: "home", icon: "⚡", label: "Mi día" },
    { id: "fichas", icon: "📁", label: "Fichas" },
  ];
  const navPac = [
    { id: "home", icon: "⚡", label: "Mi espacio" },
    { id: "ejercicios", icon: "💪", label: "Ejercicios" },
    { id: "turnos", icon: "📅", label: "Mis turnos" },
    { id: "chat", icon: "💬", label: "Mensajes" },
    { id: "perfil", icon: "👤", label: "Mi perfil" },
  ];
  const nav = isPac ? navPac : isKin ? navKin : navSec;

  return <>
    <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
    <div id="sidebar" className={isOpen ? "open" : ""} style={{ background: C.sidebar, padding: "24px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${C.accent}, #7c3aed)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🦴</div>
          <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>KinesioApp</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.sidebarText, cursor: "pointer", fontSize: 20, padding: "4px 6px" }}>✕</button>
      </div>
      {nav.map(item => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => { setView(item.id); onClose(); }} style={{ position: "relative" }}>
        <span style={{ fontSize: 18 }}>{item.icon}</span>
        {item.label}
        {item.badge > 0 && <span style={{ marginLeft: "auto", background: C.red, color: "#fff", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{item.badge}</span>}
      </button>)}
      <div style={{ marginTop: "auto", paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.07)", marginBottom: 8 }}>
          <Avatar nombre={auth.nombre} size={34} color={col} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{auth.nombre}</div>
            <div style={{ fontSize: 11, color: C.sidebarText, textTransform: "capitalize" }}>{auth.rol}</div>
          </div>
        </div>
        <button className="nav-item" onClick={onLogout} style={{ color: "#94a3b8", fontSize: 13 }}>↩ Cerrar sesión</button>
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
  const [solicitudes, setSolicitudes] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(() => {
    try { const s = localStorage.getItem("kinesioapp_auth"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalSesRapida, setModalSesRapida] = useState(false);

  useEffect(() => {
    async function cargar() {
      const [k, p, s, e, t, sol, msg] = await Promise.all([
        supabase.from("kinesiologos").select("*").order("id"),
        supabase.from("pacientes").select("*").order("nombre"),
        supabase.from("sesiones").select("*").order("fecha", { ascending: false }),
        supabase.from("ejercicios").select("*").order("id"),
        supabase.from("turnos").select("*").order("fecha").order("hora"),
        supabase.from("solicitudes_turno").select("*").order("created_at", { ascending: false }),
        supabase.from("mensajes").select("*").order("created_at"),
      ]);
      setKinesiologos(k.data || []);
      setPacientes(p.data || []);
      setSesiones(s.data || []);
      setEjercicios(e.data || []);
      setTurnos(t.data || []);
      setSolicitudes(sol.data || []);
      setMensajes(msg.data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  const agregarPaciente = async f => {
    const { data } = await supabase.from("pacientes").insert([{ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, num_afiliado: f.num_afiliado, tipo_cobertura: f.tipo_cobertura, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas, sesiones: 0, estado: "activo", fecha_inicio: today() }]).select().single();
    if (data) setPacientes(prev => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
  };
  const editarPaciente = async (id, f) => {
    const { data } = await supabase.from("pacientes").update({ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, num_afiliado: f.num_afiliado, tipo_cobertura: f.tipo_cobertura, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas }).eq("id", id).select().single();
    if (data) setPacientes(prev => prev.map(p => p.id === id ? data : p));
  };
  const cambiarEstadoPaciente = async (id, estado) => {
    await supabase.from("pacientes").update({ estado }).eq("id", id);
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };
  const agregarKinesiologo = async f => {
    const avatar = f.nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const { data } = await supabase.from("kinesiologos").insert([{ nombre: f.nombre, especialidad: f.especialidad, avatar, color: C.accent }]).select().single();
    if (data) setKinesiologos(prev => [...prev, data]);
  };
  const editarKinesiologo = async (id, f) => {
    const { data } = await supabase.from("kinesiologos").update({ nombre: f.nombre, especialidad: f.especialidad }).eq("id", id).select().single();
    if (data) setKinesiologos(prev => prev.map(k => k.id === id ? data : k));
  };
  const eliminarKinesiologo = async id => {
    await supabase.from("kinesiologos").delete().eq("id", id);
    setKinesiologos(prev => prev.filter(k => k.id !== id));
  };
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
  const actualizarPerfil = async (f) => {
    if (!pacienteActual) return;
    const { data } = await supabase.from("pacientes").update({ tel: f.tel, obra_social: f.obra_social, num_afiliado: f.num_afiliado, tipo_cobertura: f.tipo_cobertura }).eq("id", pacienteActual.id).select().single();
    if (data) setPacientes(prev => prev.map(p => p.id === data.id ? data : p));
  };

  const logout = () => {
    localStorage.removeItem("kinesioapp_auth");
    setAuth(null); setView("home"); setSidebarOpen(false);
  };

  const kin = auth?.rol === "kinesiologo" ? kinesiologos.find(k => k.id === auth.kin_id) : null;
  const pacienteActual = auth?.rol === "paciente" ? pacientes.find(p => p.id === auth.paciente_id) : null;
  const misPacientesKin = kin ? pacientes.filter(p => p.kin_id === kin.id && p.estado === "activo") : [];
  const badgeSolicitudes = solicitudes.filter(s => s.estado === "pendiente").length;
  const badgeMensajes = mensajes.filter(m => m.remitente === "paciente" && !m.leido).length;

  if (loading) return <><style>{CSS}</style><div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div></>;
  if (!auth) return <><style>{CSS}</style><Login onLogin={u => { localStorage.setItem("kinesioapp_auth", JSON.stringify(u)); setAuth(u); setView("home"); }} /></>;

  return <>
    <style>{CSS}</style>
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar auth={auth} view={view} setView={setView} onLogout={logout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} badgeSolicitudes={badgeSolicitudes} badgeMensajes={badgeMensajes} />
      <div className="main-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 26, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>☰</button>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 17 }}>🦴 KinesioApp</div>
          <div style={{ width: 36 }} />
        </div>
        <div className="page-pad" style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {/* SECRETARIA */}
          {auth.rol === "secretaria" && view === "home" && <SecDashboard pacientes={pacientes} kinesiologos={kinesiologos} sesiones={sesiones} turnos={turnos} solicitudes={solicitudes} mensajes={mensajes} />}
          {auth.rol === "secretaria" && view === "pacientes" && <SecPacientes pacientes={pacientes} kinesiologos={kinesiologos} onAgregar={agregarPaciente} onEditar={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} />}
          {auth.rol === "secretaria" && view === "kinesiologos" && <SecKinesiologos kinesiologos={kinesiologos} pacientes={pacientes} sesiones={sesiones} onAgregar={agregarKinesiologo} onEditar={editarKinesiologo} onEliminar={eliminarKinesiologo} />}
          {auth.rol === "secretaria" && view === "turnos" && <SecTurnos turnos={turnos} pacientes={pacientes} kinesiologos={kinesiologos} onAgregar={agregarTurno} onEditar={editarTurno} onEliminar={eliminarTurno} />}
          {auth.rol === "secretaria" && view === "solicitudes" && <SecSolicitudes solicitudes={solicitudes} setSolicitudes={setSolicitudes} pacientes={pacientes} kinesiologos={kinesiologos} turnos={turnos} setTurnos={setTurnos} />}
          {auth.rol === "secretaria" && view === "chat" && <SecChat mensajes={mensajes} setMensajes={setMensajes} pacientes={pacientes} />}
          {/* KINESIOLOGO */}
          {auth.rol === "kinesiologo" && kin && view === "home" && <KinHoy kin={kin} pacientes={pacientes} sesiones={sesiones} turnos={turnos} onNuevaSesion={() => setModalSesRapida(true)} />}
          {auth.rol === "kinesiologo" && kin && view === "fichas" && <KinFichas kin={kin} pacientes={pacientes} setPacientes={setPacientes} sesiones={sesiones} setSesiones={setSesiones} ejercicios={ejercicios} kinesiologos={kinesiologos} onAgregarPaciente={agregarPaciente} onEditarPaciente={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} onAgregarSesion={agregarSesion} onAgregarEjercicio={agregarEjercicio} onEditarEjercicio={editarEjercicio} onEliminarEjercicio={eliminarEjercicio} />}
          {/* PACIENTE */}
          {auth.rol === "paciente" && pacienteActual && view === "home" && <PacDashboard paciente={pacienteActual} kinesiologos={kinesiologos} sesiones={sesiones} ejercicios={ejercicios} solicitudes={solicitudes} />}
          {auth.rol === "paciente" && pacienteActual && view === "ejercicios" && <PacEjercicios paciente={pacienteActual} ejercicios={ejercicios} />}
          {auth.rol === "paciente" && pacienteActual && view === "turnos" && <PacTurnos paciente={pacienteActual} kinesiologos={kinesiologos} solicitudes={solicitudes} setSolicitudes={setSolicitudes} />}
          {auth.rol === "paciente" && pacienteActual && view === "chat" && <PacChat paciente={pacienteActual} mensajes={mensajes} setMensajes={setMensajes} />}
          {auth.rol === "paciente" && pacienteActual && view === "perfil" && <PacPerfil paciente={pacienteActual} onActualizar={actualizarPerfil} />}
        </div>
      </div>
    </div>
    {modalSesRapida && <Modal title="Registrar sesión" onClose={() => setModalSesRapida(false)}>
      <FormSesion pacientes={misPacientesKin} onSave={f => { agregarSesion(f); setModalSesRapida(false); }} onClose={() => setModalSesRapida(false)} />
    </Modal>}
  </>;
}