import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

const C = {
  bg: "#0b0e18", surface: "#131624", surfaceHigh: "#1c2036",
  border: "#252a45", borderHover: "#3d4470",
  accent: "#4f9cf9", accentSoft: "rgba(79,156,249,0.1)",
  green: "#34d399", greenSoft: "rgba(52,211,153,0.1)",
  amber: "#fbbf24", amberSoft: "rgba(251,191,36,0.1)",
  red: "#f87171", redSoft: "rgba(248,113,113,0.1)",
  purple: "#a78bfa", purpleSoft: "rgba(167,139,250,0.1)",
  text: "#e2e8f0", textSoft: "#94a3b8", textMuted: "#4a5578",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};color:${C.text};font-family:'Outfit',sans-serif;font-size:14px}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
.fade{animation:fade .3s ease}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.card{background:${C.surface};border:1px solid ${C.border};border-radius:14px;transition:all .2s}
.card:hover{border-color:${C.borderHover}}
input,select,textarea{background:${C.surfaceHigh};border:1px solid ${C.border};border-radius:10px;color:${C.text};font-family:'Outfit',sans-serif;font-size:14px;padding:10px 14px;width:100%;outline:none;transition:border .2s}
input:focus,select:focus,textarea:focus{border-color:${C.accent}}
input::placeholder,textarea::placeholder{color:${C.textMuted}}
select option{background:${C.surface}}
label{font-size:12px;font-weight:600;color:${C.textSoft};letter-spacing:.05em;text-transform:uppercase;display:block;margin-bottom:6px}
.btn{border:none;border-radius:10px;cursor:pointer;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;padding:10px 18px;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
.btn-primary{background:${C.accent};color:#fff}.btn-primary:hover{opacity:.9}
.btn-ghost{background:${C.surfaceHigh};color:${C.textSoft}}.btn-ghost:hover{color:${C.text}}
.btn-green{background:${C.greenSoft};color:${C.green};border:1px solid ${C.green}33}
.btn-amber{background:${C.amberSoft};color:${C.amber};border:1px solid ${C.amber}33}
.btn-danger{background:${C.redSoft};color:${C.red};border:1px solid ${C.red}33}
.nav-btn{transition:all .2s;border:none;background:none;cursor:pointer;border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:9px;font-family:'Outfit',sans-serif;font-size:13.5px;font-weight:500;width:100%;color:${C.textSoft};text-align:left}
.nav-btn:hover{background:${C.surfaceHigh};color:${C.text}}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:fade .2s ease}
.tab{border:none;background:none;cursor:pointer;padding:8px 16px;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;transition:all .2s}
`;

function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) { if (!d) return "—"; const [y, m, dd] = d.split("-"); return `${dd}/${m}/${y}`; }

function Spinner() {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
    <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>;
}

function Avatar({ initials, size = 38, color = C.accent }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.32, fontWeight: 700, color, flexShrink: 0, fontFamily: "'Syne',sans-serif" }}>{initials}</div>;
}

function Badge({ label, type }) {
  const map = { activo: [C.green, C.greenSoft], finalizado: [C.textMuted, C.surfaceHigh], cancelado: [C.red, C.redSoft], pendiente: [C.amber, C.amberSoft] };
  const [fg, bg] = map[type] || [C.textSoft, C.surfaceHigh];
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: fg, background: bg }}>{label}</span>;
}

function Field({ label, children }) {
  return <div style={{ marginBottom: 16 }}><label>{label}</label>{children}</div>;
}

function Modal({ title, onClose, children, width = 520 }) {
  return <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="card fade" style={{ width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18 }}>{title}</div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 12px" }}>✕</button>
      </div>
      {children}
    </div>
  </div>;
}

function EmptyState({ msg }) {
  return <div style={{ padding: 40, textAlign: "center", color: C.textMuted, background: C.surface, borderRadius: 14, border: `1px dashed ${C.border}` }}>{msg}</div>;
}

function SectionHead({ title, action }) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800 }}>{title}</div>
    {action}
  </div>;
}

// ── FORMS ──────────────────────────────────────────────────────────────────
function FormPaciente({ kinesiologos, onSave, onClose, initial = null, soloMio = null }) {
  const def = initial || { nombre: "", dni: "", tel: "", obra_social: "", kin_id: soloMio || kinesiologos[0]?.id || "", tratamiento: "", notas: "" };
  const [f, setF] = useState(def);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.nombre.trim() && f.dni.trim() && f.kin_id && f.tratamiento.trim();
  return <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ gridColumn: "1/-1" }}><Field label="Nombre completo"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: María García" /></Field></div>
      <Field label="DNI"><input value={f.dni} onChange={set("dni")} placeholder="Sin puntos" maxLength={8} /></Field>
      <Field label="Teléfono"><input value={f.tel} onChange={set("tel")} placeholder="11-xxxx-xxxx" /></Field>
      <div style={{ gridColumn: "1/-1" }}><Field label="Obra social"><input value={f.obra_social} onChange={set("obra_social")} placeholder="OSDE, Swiss Medical, particular..." /></Field></div>
      <div style={{ gridColumn: "1/-1" }}>
        <Field label="Kinesiólogo asignado">
          {soloMio
            ? <input value={kinesiologos.find(k => k.id == soloMio)?.nombre || ""} disabled style={{ opacity: .6 }} />
            : <select value={f.kin_id} onChange={set("kin_id")}>{kinesiologos.map(k => <option key={k.id} value={k.id}>{k.nombre}</option>)}</select>
          }
        </Field>
      </div>
      <div style={{ gridColumn: "1/-1" }}><Field label="Diagnóstico / Tratamiento"><input value={f.tratamiento} onChange={set("tratamiento")} placeholder="Ej: Rehabilitación rodilla derecha" /></Field></div>
      <div style={{ gridColumn: "1/-1" }}><Field label="Notas adicionales"><textarea value={f.notas} onChange={set("notas")} placeholder="Antecedentes, alergias, indicaciones..." rows={3} style={{ resize: "vertical" }} /></Field></div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .4 }}>{initial ? "✓ Guardar cambios" : "✓ Agregar paciente"}</button>
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
        <option value="">— Seleccioná un paciente —</option>
        {pacientes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
    </Field>
    <Field label="Fecha"><input type="date" value={f.fecha} onChange={set("fecha")} /></Field>
    <Field label="Notas de la sesión"><textarea value={f.notas} onChange={set("notas")} placeholder="Evolución, observaciones..." rows={4} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", background: C.greenSoft, borderRadius: 10, border: `1px solid ${C.green}33` }}>
      <input type="checkbox" id="realizada" checked={f.realizada} onChange={e => setF(p => ({ ...p, realizada: e.target.checked }))} style={{ width: "auto", accentColor: C.green }} />
      <label htmlFor="realizada" style={{ textTransform: "none", fontSize: 13, color: C.green, margin: 0 }}>Sesión realizada</label>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .4 }}>✓ Registrar sesión</button>
    </div>
  </>;
}

function FormEjercicio({ onSave, onClose, initial = null }) {
  const [f, setF] = useState(initial || { nombre: "", series: 3, reps: 10, descripcion: "" });
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const valid = f.nombre.trim();
  return <>
    <Field label="Nombre del ejercicio"><input value={f.nombre} onChange={set("nombre")} placeholder="Ej: Extensión de rodilla" /></Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Field label="Series"><input type="number" value={f.series} onChange={set("series")} min={1} max={10} /></Field>
      <Field label="Repeticiones"><input type="number" value={f.reps} onChange={set("reps")} min={1} max={50} /></Field>
    </div>
    <Field label="Descripción"><textarea value={f.descripcion} onChange={set("descripcion")} placeholder="Cómo realizar el ejercicio..." rows={3} style={{ resize: "vertical" }} /></Field>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
      <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" disabled={!valid} onClick={() => valid && onSave(f)} style={{ opacity: valid ? 1 : .4 }}>{initial ? "✓ Guardar cambios" : "✓ Agregar ejercicio"}</button>
    </div>
  </>;
}

// ── SECRETARIA ─────────────────────────────────────────────────────────────
function SecDashboard({ pacientes, kinesiologos, sesiones }) {
  const hoy = today();
  const sesHoy = sesiones.filter(s => s.fecha === hoy).length;
  return <div className="fade">
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>Panel de control 📋</div>
      <div style={{ color: C.textSoft, fontSize: 13, marginTop: 5 }}>Centro de Kinesiología</div>
    </div>
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 32 }}>
      {[
        { label: "Pacientes activos", val: pacientes.filter(p => p.estado === "activo").length, color: C.accent },
        { label: "Kinesiólogos", val: kinesiologos.length, color: C.green },
        { label: "Sesiones hoy", val: sesHoy, color: C.amber },
        { label: "Total sesiones", val: sesiones.length, color: C.purple },
      ].map(s => <div key={s.label} style={{ flex: 1, minWidth: 130, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
        <div style={{ fontSize: 13, color: C.textSoft, marginTop: 6 }}>{s.label}</div>
      </div>)}
    </div>
    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Resumen por kinesiólogo</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {kinesiologos.map(k => {
        const kPac = pacientes.filter(p => p.kin_id === k.id && p.estado === "activo");
        const kSesHoy = sesiones.filter(s => s.fecha === hoy && kPac.find(p => p.id === s.paciente_id));
        return <div key={k.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar initials={k.avatar} color={k.color} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{k.nombre}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{k.especialidad}</div>
          </div>
          <div style={{ display: "flex", gap: 28, textAlign: "center" }}>
            <div><div style={{ fontSize: 24, fontWeight: 800, color: C.accent, fontFamily: "'Syne',sans-serif" }}>{kPac.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>pacientes</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 800, color: C.green, fontFamily: "'Syne',sans-serif" }}>{kSesHoy.length}</div><div style={{ fontSize: 11, color: C.textMuted }}>sesiones hoy</div></div>
          </div>
        </div>;
      })}
    </div>
  </div>;
}

function SecPacientes({ pacientes, kinesiologos, onAgregar, onEditar, onCambiarEstado }) {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("activo");
  const [busqueda, setBusqueda] = useState("");
  const filtrados = pacientes.filter(p => filtro === "todos" ? true : p.estado === filtro).filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.dni || "").includes(busqueda));
  const kin = id => kinesiologos.find(k => k.id === id);
  return <div className="fade">
    <SectionHead title="Pacientes" action={<button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo paciente</button>} />
    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
      <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="🔍  Buscar por nombre o DNI..." style={{ maxWidth: 280 }} />
      <div style={{ display: "flex", gap: 6 }}>
        {["activo", "finalizado", "todos"].map(f => <button key={f} className="tab" onClick={() => setFiltro(f)} style={{ color: filtro === f ? C.accent : C.textMuted, background: filtro === f ? C.accentSoft : "transparent", textTransform: "capitalize" }}>{f}</button>)}
      </div>
    </div>
    <div className="card" style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
          {["Paciente", "Kinesiólogo", "Tratamiento", "Sesiones", "Estado", "Acciones"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: C.textMuted, letterSpacing: ".06em", textTransform: "uppercase" }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {filtrados.length === 0 && <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: C.textMuted }}>No se encontraron pacientes</td></tr>}
          {filtrados.map((p, i) => {
            const k = kin(p.kin_id);
            return <tr key={p.id} style={{ borderBottom: i < filtrados.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <td style={{ padding: "13px 16px" }}><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: 11, color: C.textMuted }}>DNI {p.dni} · {p.obra_social || "Sin obra social"}</div></td>
              <td style={{ padding: "13px 16px" }}>{k ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar initials={k.avatar} size={26} color={k.color} /><span style={{ fontSize: 13, color: C.textSoft }}>{k.nombre}</span></div> : "—"}</td>
              <td style={{ padding: "13px 16px", fontSize: 13, maxWidth: 200 }}>{p.tratamiento}</td>
              <td style={{ padding: "13px 16px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: C.accent }}>{p.sesiones}</td>
              <td style={{ padding: "13px 16px" }}><Badge label={p.estado} type={p.estado} /></td>
              <td style={{ padding: "13px 16px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditando(p)}>✏️ Editar</button>
                  {p.estado === "activo"
                    ? <button className="btn btn-amber" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "finalizado")}>Finalizar</button>
                    : <button className="btn btn-green" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => onCambiarEstado(p.id, "activo")}>Reactivar</button>}
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    {modal && <Modal title="Nuevo paciente" onClose={() => setModal(false)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregar(f); setModal(false); }} onClose={() => setModal(false)} /></Modal>}
    {editando && <Modal title="Editar paciente" onClose={() => setEditando(null)}><FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditar(editando.id, f); setEditando(null); }} onClose={() => setEditando(null)} initial={editando} /></Modal>}
  </div>;
}

// ── KINESIOLOGO ─────────────────────────────────────────────────────────────
function KinDashboard({ kin, pacientes, sesiones, onNuevaSesion }) {
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id && p.estado === "activo");
  const hoy = today();
  const sesHoy = sesiones.filter(s => s.fecha === hoy && misPacientes.find(p => p.id === s.paciente_id));
  return <div className="fade">
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>Hola, {kin.nombre.split(" ").slice(-1)[0]} 👋</div>
      <div style={{ color: C.textSoft, fontSize: 13, marginTop: 5 }}>{kin.especialidad}</div>
    </div>
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
      {[
        { label: "Mis pacientes", val: misPacientes.length, color: C.accent },
        { label: "Sesiones hoy", val: sesHoy.length, color: C.green },
        { label: "Total sesiones", val: sesiones.filter(s => misPacientes.find(p => p.id === s.paciente_id)).length, color: C.purple },
      ].map(s => <div key={s.label} style={{ flex: 1, minWidth: 130, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif" }}>{s.val}</div>
        <div style={{ fontSize: 13, color: C.textSoft, marginTop: 6 }}>{s.label}</div>
      </div>)}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700 }}>Mis pacientes activos</div>
      <button className="btn btn-primary" onClick={onNuevaSesion}>+ Registrar sesión</button>
    </div>
    {misPacientes.length === 0 ? <EmptyState msg="No tenés pacientes activos aún" /> :
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {misPacientes.map(p => {
          const ultima = sesiones.filter(s => s.paciente_id === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
          return <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={p.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)} size={42} color={kin.color} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{p.tratamiento}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textMuted }}>Última sesión</div>
              <div style={{ fontSize: 13, color: C.textSoft, marginTop: 2 }}>{ultima ? fmtDate(ultima.fecha) : "Sin sesiones"}</div>
            </div>
            <div style={{ textAlign: "center", marginLeft: 12 }}>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: C.accent }}>{p.sesiones}</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>sesiones</div>
            </div>
          </div>;
        })}
      </div>}
  </div>;
}

function KinFichas({ kin, pacientes, sesiones, ejercicios, kinesiologos, onAgregarPaciente, onEditarPaciente, onCambiarEstado, onAgregarSesion, onAgregarEjercicio, onEditarEjercicio, onEliminarEjercicio }) {
  const misPacientes = pacientes.filter(p => p.kin_id === kin.id);
  const [selId, setSelId] = useState(misPacientes[0]?.id || null);
  const [tab, setTab] = useState("info");
  const [modalSes, setModalSes] = useState(false);
  const [modalEj, setModalEj] = useState(false);
  const [modalPac, setModalPac] = useState(false);
  const [editandoPac, setEditandoPac] = useState(false);
  const [editandoEj, setEditandoEj] = useState(null);
  const sel = pacientes.find(p => p.id === selId);
  const misSesiones = sesiones.filter(s => s.paciente_id === selId).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const misEjercicios = ejercicios.filter(e => e.paciente_id === selId);

  return <div className="fade" style={{ display: "flex", gap: 20 }}>
    <div style={{ width: 220, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15 }}>Mis pacientes</div>
        <button className="btn btn-primary" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => setModalPac(true)}>+</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {misPacientes.length === 0 && <div style={{ color: C.textMuted, fontSize: 13 }}>Sin pacientes aún</div>}
        {misPacientes.map(p => <div key={p.id} onClick={() => { setSelId(p.id); setTab("info"); }} style={{ padding: "12px 14px", borderRadius: 12, border: `1px solid ${selId === p.id ? kin.color : C.border}`, background: selId === p.id ? `${kin.color}11` : C.surface, cursor: "pointer", transition: "all .2s" }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: selId === p.id ? kin.color : C.text }}>{p.nombre}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>{p.sesiones} ses. · <Badge label={p.estado} type={p.estado} /></div>
        </div>)}
      </div>
    </div>

    <div style={{ flex: 1 }}>
      {!sel ? <EmptyState msg="Seleccioná un paciente" /> : <>
        <div className="card" style={{ padding: "18px 22px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar initials={sel.nombre.split(" ").map(n => n[0]).join("").slice(0, 2)} size={50} color={kin.color} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 19 }}>{sel.nombre}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>DNI {sel.dni} · {sel.obra_social || "Sin obra social"} · desde {fmtDate(sel.fecha_inicio)}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge label={sel.estado} type={sel.estado} />
            <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setEditandoPac(true)}>✏️ Editar</button>
            {sel.estado === "activo"
              ? <button className="btn btn-amber" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onCambiarEstado(sel.id, "finalizado")}>Finalizar</button>
              : <button className="btn btn-green" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onCambiarEstado(sel.id, "activo")}>Reactivar</button>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["info", "sesiones", "ejercicios"].map(t => <button key={t} className="tab" onClick={() => setTab(t)} style={{ color: tab === t ? kin.color : C.textMuted, background: tab === t ? `${kin.color}15` : "transparent", textTransform: "capitalize" }}>{t}</button>)}
        </div>

        {tab === "info" && <div className="fade card" style={{ padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[["Tratamiento", sel.tratamiento], ["Teléfono", sel.tel || "—"], ["Obra social", sel.obra_social || "—"], ["Sesiones", sel.sesiones], ["Inicio", fmtDate(sel.fecha_inicio)], ["Estado", sel.estado]].map(([l, v]) =>
              <div key={l}><div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{l}</div><div style={{ fontWeight: 500 }}>{v}</div></div>)}
            {sel.notas && <div style={{ gridColumn: "1/-1" }}><div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Notas</div><div style={{ fontSize: 13, color: C.textSoft, background: C.surfaceHigh, padding: "10px 14px", borderRadius: 8 }}>{sel.notas}</div></div>}
          </div>
        </div>}

        {tab === "sesiones" && <div className="fade">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button className="btn btn-primary" onClick={() => setModalSes(true)}>+ Nueva sesión</button></div>
          {misSesiones.length === 0 ? <EmptyState msg="Sin sesiones registradas" /> :
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {misSesiones.map(s => <div key={s.id} className="card" style={{ padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: kin.color, fontSize: 13, minWidth: 88 }}>{fmtDate(s.fecha)}</div>
                <div style={{ flex: 1, fontSize: 13, color: C.textSoft }}>{s.notas || <span style={{ color: C.textMuted, fontStyle: "italic" }}>Sin notas</span>}</div>
                <Badge label={s.realizada ? "Realizada" : "Ausente"} type={s.realizada ? "activo" : "cancelado"} />
              </div>)}
            </div>}
        </div>}

        {tab === "ejercicios" && <div className="fade">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button className="btn btn-primary" onClick={() => setModalEj(true)}>+ Agregar ejercicio</button></div>
          {misEjercicios.length === 0 ? <EmptyState msg="Sin ejercicios asignados" /> :
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {misEjercicios.map(e => <div key={e.id} className="card" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 600 }}>{e.nombre}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.accent, background: C.accentSoft, padding: "3px 10px", borderRadius: 20 }}>{e.series} series</span>
                    <span style={{ fontSize: 12, color: C.green, background: C.greenSoft, padding: "3px 10px", borderRadius: 20 }}>{e.reps} reps</span>
                    <button className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => setEditandoEj(e)}>✏️</button>
                    <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => onEliminarEjercicio(e.id)}>🗑</button>
                  </div>
                </div>
                {e.descripcion && <div style={{ fontSize: 12, color: C.textMuted }}>{e.descripcion}</div>}
              </div>)}
            </div>}
        </div>}
      </>}
    </div>

    {modalSes && <Modal title="Registrar sesión" onClose={() => setModalSes(false)} width={460}>
      <FormSesion pacientes={sel ? [sel] : []} onSave={f => { onAgregarSesion({ ...f, paciente_id: selId }); setModalSes(false); }} onClose={() => setModalSes(false)} />
    </Modal>}
    {modalEj && <Modal title="Nuevo ejercicio" onClose={() => setModalEj(false)} width={460}>
      <FormEjercicio onSave={f => { onAgregarEjercicio({ ...f, paciente_id: selId }); setModalEj(false); }} onClose={() => setModalEj(false)} />
    </Modal>}
    {editandoEj && <Modal title="Editar ejercicio" onClose={() => setEditandoEj(null)} width={460}>
      <FormEjercicio onSave={f => { onEditarEjercicio(editandoEj.id, f); setEditandoEj(null); }} onClose={() => setEditandoEj(null)} initial={editandoEj} />
    </Modal>}
    {modalPac && <Modal title="Agregar paciente" onClose={() => setModalPac(false)}>
      <FormPaciente kinesiologos={kinesiologos} onSave={f => { onAgregarPaciente(f); setModalPac(false); }} onClose={() => setModalPac(false)} soloMio={kin.id} />
    </Modal>}
    {editandoPac && sel && <Modal title="Editar datos del paciente" onClose={() => setEditandoPac(false)}>
      <FormPaciente kinesiologos={kinesiologos} onSave={f => { onEditarPaciente(sel.id, f); setEditandoPac(false); }} onClose={() => setEditandoPac(false)} initial={sel} soloMio={kin.id} />
    </Modal>}
  </div>;
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function Login({ kinesiologos, onLogin }) {
  const [rolSel, setRolSel] = useState(null);
  const [kinSel, setKinSel] = useState(kinesiologos[0]);
  return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
      <div style={{ width: 68, height: 68, background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, borderRadius: 20, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🦴</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, marginBottom: 6 }}>KinesiApp</div>
      <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 36 }}>Seleccioná tu perfil para ingresar</div>
      {!rolSel ? <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[{ rol: "secretaria", icon: "📋", label: "Secretaría / Admin", desc: "Gestión de pacientes, kinesiólogos y reportes" },
          { rol: "kinesiologo", icon: "🩺", label: "Kinesiólogo", desc: "Mis pacientes, fichas, sesiones y ejercicios" }].map(r =>
          <button key={r.rol} onClick={() => setRolSel(r.rol)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, width: "100%", cursor: "pointer", transition: "all .2s" }}>
            <div style={{ width: 46, height: 46, background: r.rol === "secretaria" ? C.accentSoft : C.greenSoft, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.icon}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>{r.label}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{r.desc}</div>
            </div>
          </button>)}
      </div> : rolSel === "secretaria" ? <div className="fade">
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.accentSoft, borderRadius: 12, padding: "14px 18px" }}>
            <span style={{ fontSize: 24 }}>📋</span>
            <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600 }}>Panel de administración</div><div style={{ fontSize: 12, color: C.textMuted }}>Acceso completo</div></div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => onLogin("secretaria", null)}>Entrar →</button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setRolSel(null)}>← Volver</button>
      </div> : <div className="fade">
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: C.textSoft, marginBottom: 14 }}>Seleccioná tu perfil</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {kinesiologos.map(k => <div key={k.id} onClick={() => setKinSel(k)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `1px solid ${kinSel?.id === k.id ? k.color : C.border}`, background: kinSel?.id === k.id ? `${k.color}11` : "transparent", cursor: "pointer", transition: "all .2s" }}>
              <Avatar initials={k.avatar} size={34} color={k.color} />
              <div style={{ textAlign: "left" }}><div style={{ fontWeight: 600, fontSize: 14 }}>{k.nombre}</div><div style={{ fontSize: 12, color: C.textMuted }}>{k.especialidad}</div></div>
              {kinSel?.id === k.id && <div style={{ marginLeft: "auto", color: k.color, fontWeight: 700 }}>✓</div>}
            </div>)}
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14 }} onClick={() => kinSel && onLogin("kinesiologo", kinSel)}>Entrar como {kinSel?.nombre?.split(" ").slice(-1)[0]} →</button>
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setRolSel(null)}>← Volver</button>
      </div>}
    </div>
  </div>;
}

// ── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [kinesiologos, setKinesiologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [sesiones, setSesiones] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  const [view, setView] = useState("home");
  const [modalSesionRapida, setModalSesionRapida] = useState(false);

  // ── CARGAR DATOS ──
  useEffect(() => {
    async function cargar() {
      const [k, p, s, e] = await Promise.all([
        supabase.from("kinesiologos").select("*").order("id"),
        supabase.from("pacientes").select("*").order("nombre"),
        supabase.from("sesiones").select("*").order("fecha", { ascending: false }),
        supabase.from("ejercicios").select("*").order("id"),
      ]);
      setKinesiologos(k.data || []);
      setPacientes(p.data || []);
      setSesiones(s.data || []);
      setEjercicios(e.data || []);
      setLoading(false);
    }
    cargar();
  }, []);

  // ── PACIENTES ──
  const agregarPaciente = async f => {
    const { data } = await supabase.from("pacientes").insert([{ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas, sesiones: 0, estado: "activo", fecha_inicio: today() }]).select().single();
    if (data) setPacientes(prev => [...prev, data]);
  };

  const editarPaciente = async (id, f) => {
    const { data } = await supabase.from("pacientes").update({ nombre: f.nombre, dni: f.dni, tel: f.tel, obra_social: f.obra_social, kin_id: Number(f.kin_id), tratamiento: f.tratamiento, notas: f.notas }).eq("id", id).select().single();
    if (data) setPacientes(prev => prev.map(p => p.id === id ? data : p));
  };

  const cambiarEstadoPaciente = async (id, estado) => {
    await supabase.from("pacientes").update({ estado }).eq("id", id);
    setPacientes(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
  };

  // ── SESIONES ──
  const agregarSesion = async f => {
    const pacienteId = Number(f.paciente_id);
    const { data } = await supabase.from("sesiones").insert([{ paciente_id: pacienteId, fecha: f.fecha, notas: f.notas, realizada: f.realizada }]).select().single();
    if (data) {
      setSesiones(prev => [data, ...prev]);
      if (f.realizada) {
        await supabase.from("pacientes").update({ sesiones: (pacientes.find(p => p.id === pacienteId)?.sesiones || 0) + 1 }).eq("id", pacienteId);
        setPacientes(prev => prev.map(p => p.id === pacienteId ? { ...p, sesiones: p.sesiones + 1 } : p));
      }
    }
  };

  // ── EJERCICIOS ──
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

  const logout = () => { setAuth(null); setView("home"); };

  if (loading) return <><style>{CSS}</style><div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Spinner /></div></>;
  if (!auth) return <><style>{CSS}</style><Login kinesiologos={kinesiologos} onLogin={(rol, kin) => { setAuth({ rol, kin }); setView("home"); }} /></>;

  const accentColor = auth.rol === "secretaria" ? C.accent : auth.kin?.color || C.green;
  const navSec = [{ id: "home", icon: "⚡", label: "Dashboard" }, { id: "pacientes", icon: "👥", label: "Pacientes" }];
  const navKin = [{ id: "home", icon: "⚡", label: "Mi día" }, { id: "fichas", icon: "📁", label: "Fichas" }];
  const nav = auth.rol === "secretaria" ? navSec : navKin;
  const misPacientesKin = auth.rol === "kinesiologo" ? pacientes.filter(p => p.kin_id === auth.kin.id && p.estado === "activo") : [];

  return <>
    <style>{CSS}</style>
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <div style={{ width: 215, background: C.surface, borderRight: `1px solid ${C.border}`, padding: "22px 12px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🦴</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17 }}>KinesiApp</div>
        </div>
        {nav.map(item => <button key={item.id} className="nav-btn" onClick={() => setView(item.id)} style={{ color: view === item.id ? accentColor : C.textSoft, background: view === item.id ? `${accentColor}15` : "transparent" }}><span style={{ fontSize: 15 }}>{item.icon}</span>{item.label}</button>)}
        {auth.rol === "kinesiologo" && <div style={{ marginTop: 14 }}><button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 12.5 }} onClick={() => setModalSesionRapida(true)}>+ Sesión rápida</button></div>}
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, background: C.surfaceHigh, marginBottom: 8 }}>
            <Avatar initials={auth.rol === "secretaria" ? "SC" : auth.kin.avatar} size={30} color={accentColor} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{auth.rol === "secretaria" ? "Secretaría" : auth.kin.nombre.split(" ").slice(-1)[0]}</div>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "capitalize" }}>{auth.rol}</div>
            </div>
          </div>
          <button className="nav-btn" onClick={logout} style={{ color: C.textMuted, fontSize: 12 }}>↩ Cambiar perfil</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {auth.rol === "secretaria" && view === "home" && <SecDashboard pacientes={pacientes} kinesiologos={kinesiologos} sesiones={sesiones} />}
        {auth.rol === "secretaria" && view === "pacientes" && <SecPacientes pacientes={pacientes} kinesiologos={kinesiologos} onAgregar={agregarPaciente} onEditar={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} />}
        {auth.rol === "kinesiologo" && view === "home" && <KinDashboard kin={auth.kin} pacientes={pacientes} sesiones={sesiones} onNuevaSesion={() => setModalSesionRapida(true)} />}
        {auth.rol === "kinesiologo" && view === "fichas" && <KinFichas kin={auth.kin} pacientes={pacientes} sesiones={sesiones} ejercicios={ejercicios} kinesiologos={kinesiologos} onAgregarPaciente={agregarPaciente} onEditarPaciente={editarPaciente} onCambiarEstado={cambiarEstadoPaciente} onAgregarSesion={agregarSesion} onAgregarEjercicio={agregarEjercicio} onEditarEjercicio={editarEjercicio} onEliminarEjercicio={eliminarEjercicio} />}
      </div>
    </div>

    {modalSesionRapida && <Modal title="Registrar sesión del día" onClose={() => setModalSesionRapida(false)} width={460}>
      <FormSesion pacientes={misPacientesKin} onSave={f => { agregarSesion(f); setModalSesionRapida(false); }} onClose={() => setModalSesionRapida(false)} />
    </Modal>}
  </>;
}