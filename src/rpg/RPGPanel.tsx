import { useState } from "react";
import { createSnapshot, TRAINING_PATHS } from "./progression";
import { awardDemoXp, loadRpgData, resetDemoRpg } from "./demoStore";
import type { RpgSaveData, TrainingPathId } from "./types";
import { AttributePanel } from "./AttributePanel";

export function RPGPanel() {
  const [data, setData] = useState<RpgSaveData>(() => loadRpgData());
  const snapshot = createSnapshot(data);
  const [selectedPath, setSelectedPath] = useState<TrainingPathId>(
    data.assignments.find(item => item.role === "primary")?.pathId ?? "hybrid"
  );
  const [notice, setNotice] = useState("");

  const claimDemoXp = () => {
    if (!snapshot.paths.some(path => path.id === selectedPath && path.unlocked)) return;
    setData(current => awardDemoXp(current, selectedPath, 100));
    setNotice("100 XP de demostración registrados. El nivel de la ruta no cambia.");
  };

  return <section className="tab-content rpg-engine">
    <div className="section-title"><h2>RPG Engine</h2><span className="data-tag">LOCAL DEMO · V2</span></div>
    <div className="rpg-overview">
      <div><small>NIVEL DE ACADEMIA</small><strong>{snapshot.level}</strong></div>
      <div><small>EXPERIENCIA TOTAL</small><strong>{snapshot.totalXp.toLocaleString("es-ES")} <em>XP</em></strong></div>
    </div>
    <p className="rpg-muted">El nivel solo aumenta al aprobar microciclos. Los XP son recompensas y nunca desbloquean niveles ni rutas.</p>

    <div className="subsection">
      <h3>Rutas de entrenamiento</h3>
      <p className="rpg-muted">Dos rutas activas: una principal y una secundaria. Las otras dos se desbloquean cuando la ruta principal alcanza el nivel 100 mediante microciclos aprobados.</p>
      <div className="rpg-path-list">
        {snapshot.paths.map(path => {
          const role = snapshot.assignments.find(item => item.pathId === path.id)?.role;
          return <button type="button" key={path.id} className={`rpg-path-card ${selectedPath === path.id ? "selected" : ""} ${!path.unlocked ? "locked" : ""}`} disabled={!path.unlocked} onClick={() => { setSelectedPath(path.id); setNotice(""); }}>
            <span className="rpg-path-top"><b>{path.name}</b><small>{role === "primary" ? "PRINCIPAL" : role === "secondary" ? "SECUNDARIA" : path.unlocked ? "DESBLOQUEADA" : "BLOQUEADA"}</small></span>
            <span className="rpg-path-description">{path.unlocked ? path.description : "Alcanza nivel 100 validado en la ruta principal para desbloquear esta ruta."}</span>
            <span className="rpg-path-bottom"><b>NIVEL {path.level}</b><span>{path.xp.toLocaleString("es-ES")} XP</span></span>
          </button>;
        })}
      </div>
    </div>

    <div className="subsection">
      <h3>Probar recompensa</h3>
      <label className="rpg-label" htmlFor="rpg-path-select">Asignar XP de prueba a la ruta activa</label>
      <select id="rpg-path-select" value={selectedPath} onChange={event => setSelectedPath(event.target.value as TrainingPathId)}>
        {TRAINING_PATHS.filter(path => snapshot.paths.find(item => item.id === path.id)?.unlocked).map(path => <option key={path.id} value={path.id}>{path.name}</option>)}
      </select>
      <button type="button" className="outline-btn" onClick={claimDemoXp}>＋ Añadir 100 XP de prueba</button>
      {notice && <p className="rpg-notice" role="status">{notice}</p>}
      <p className="disclaimer">Recompensa ficticia para pruebas. No certifica rendimiento, no modifica atributos y no aumenta el nivel de academia.</p>
    </div>

    <AttributePanel />

    <div className="subsection">
      <h3>Últimas transacciones</h3>
      {snapshot.recentTransactions.length === 0
        ? <p className="rpg-muted">Todavía no hay recompensas registradas en esta sesión local.</p>
        : snapshot.recentTransactions.map(item => <div className="data-row" key={item.id}><span>{item.pathId.toUpperCase()} · {item.source === "academy_microcycle" ? "ACADEMIA" : "DEMO"}</span><b>+{item.amount} XP</b></div>)}
    </div>
    <button type="button" className="outline-btn rpg-reset" onClick={() => { setData(resetDemoRpg()); setSelectedPath("hybrid"); setNotice("Datos de demostración restaurados."); }}>Restablecer datos de prueba</button>
    <p className="disclaimer">Persistencia únicamente en este navegador mediante almacenamiento local. No se conecta a Supabase ni sincroniza entre dispositivos.</p>
  </section>;
}
