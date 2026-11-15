import { useMemo, useState } from "react";
import { ATTRIBUTE_DEFINITIONS, type AttributeId } from "./attributes";
import { clearAssessments, loadAssessmentHistory, saveAssessment, latestAssessment, previousAssessment } from "./attributeStore";
import type { AssessmentHistory } from "./attributeStore";

export function AttributePanel() {
  const [history, setHistory] = useState<AssessmentHistory>(() => loadAssessmentHistory());
  const [values, setValues] = useState<Record<AttributeId, string>>({
    strength: "", endurance: "", recovery: "", speed: "", agility: ""
  });
  const [notes, setNotes] = useState<Record<AttributeId, string>>({
    strength: "", endurance: "", recovery: "", speed: "", agility: ""
  });
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<"all" | AttributeId>("all");

  const save = (id: AttributeId) => {
    const value = Number(values[id].replace(",", "."));
    const definition = ATTRIBUTE_DEFINITIONS.find(item => item.id === id)!;
    if (!values[id].trim() || !Number.isFinite(value) || value <= 0) {
      setNotice("Introduce un resultado numérico válido mayor que cero.");
      return;
    }
    if (value < definition.min || value > definition.max) {
      setNotice(`El valor está fuera de la escala provisional (${definition.min}–${definition.max} ${definition.unit}). Revisa la unidad y el protocolo.`);
      return;
    }
    setHistory(current => saveAssessment(current, id, value, notes[id]));
    setValues(current => ({ ...current, [id]: "" }));
    setNotice("Evaluación añadida al historial local. La puntuación sigue siendo provisional.");
  };

  const filteredHistory = useMemo(() => [...history]
    .filter(item => filter === "all" || item.id === filter)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)), [history, filter]);

  return <div className="subsection rpg-attributes">
    <h3>Atributos físicos · evaluaciones</h3>
    <p className="rpg-muted">Cada prueba crea un registro nuevo. El XP no altera los atributos. Los resultados se guardan solo en este navegador.</p>
    {ATTRIBUTE_DEFINITIONS.map(item => {
      const record = latestAssessment(history, item.id);
      const previous = previousAssessment(history, item.id);
      const change = record && previous ? record.value - previous.value : null;
      const improved = change === null ? null : item.higherIsBetter ? change > 0 : change < 0;
      return <div className="rpg-assessment" key={item.id}>
        <div className="rpg-assessment-heading"><b>{item.name}</b><span>{record ? `${record.score}/100 · PROVISIONAL` : "SIN EVALUAR"}</span></div>
        <div className="rpg-assessment-metric">{item.metric}</div>
        {record && <div className="rpg-assessment-current">Último: <b>{record.value} {record.unit}</b> · {new Date(record.recordedAt).toLocaleDateString("es-ES")}</div>}
        {previous && record && <div className={`rpg-comparison ${improved ? "improved" : change === 0 ? "" : "declined"}`}>Anterior: {previous.value} {previous.unit} · Cambio: {change! > 0 ? "+" : ""}{Number(change!.toFixed(2))} {record.unit} · {change === 0 ? "Sin cambio" : improved ? "Mejora respecto a la prueba anterior" : "Resultado inferior respecto a la prueba anterior"}</div>}
        <label className="rpg-label" htmlFor={`assessment-${item.id}`}>Nuevo resultado ({item.unit})</label>
        <div className="rpg-assessment-entry">
          <input id={`assessment-${item.id}`} type="number" min={item.min} max={item.max} step="any" inputMode="decimal" placeholder={`${item.min}–${item.max}`} value={values[item.id]} onChange={event => setValues(current => ({ ...current, [item.id]: event.target.value }))}/>
          <button type="button" className="outline-btn" onClick={() => save(item.id)}>Guardar</button>
        </div>
        <label className="rpg-label" htmlFor={`note-${item.id}`}>Observación de la prueba (opcional)</label>
        <input className="rpg-note-input" id={`note-${item.id}`} value={notes[item.id]} onChange={event => setNotes(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Ej. superficie, carga, condiciones"/>
        <details><summary>Protocolo y escala</summary><p>{item.protocol}</p><small>Escala interna provisional: {item.min}–{item.max} {item.unit}. No es una norma clínica ni baremo poblacional validado.</small></details>
      </div>;
    })}
    {notice && <p className="rpg-notice" role="status">{notice}</p>}

    <div className="subsection rpg-history">
      <div className="rpg-history-heading"><h3>Historial y evolución</h3><span>{history.length} registros</span></div>
      <div className="history-filters">
        <button type="button" className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>Todos</button>
        {ATTRIBUTE_DEFINITIONS.map(item => <button type="button" key={item.id} className={filter === item.id ? "selected" : ""} onClick={() => setFilter(item.id)}>{item.name}</button>)}
      </div>
      {filteredHistory.length === 0 ? <p className="rpg-muted">Todavía no hay evaluaciones para este filtro.</p> : filteredHistory.slice(0, 30).map((item, index) => {
        const definition = ATTRIBUTE_DEFINITIONS.find(def => def.id === item.id)!;
        return <div className="rpg-history-row" key={`${item.id}-${item.recordedAt}-${index}`}>
          <div><b>{definition.name}</b><small>{new Date(item.recordedAt).toLocaleString("es-ES")} · {item.protocol}</small></div>
          <strong>{item.value} {item.unit}<small>{item.score}/100</small>{item.note && <small>{item.note}</small>}</strong>
        </div>;
      })}
    </div>
    <button type="button" className="outline-btn" onClick={() => { setHistory(clearAssessments()); setNotice("Historial local eliminado."); }}>Borrar historial de evaluaciones</button>
    <p className="disclaimer">Puntuaciones orientativas basadas en escalas internas provisionales. La comparación solo es válida si se mantienen protocolos y condiciones comparables. No es diagnóstico ni certificación. No hay sincronización con Supabase.</p>
  </div>;
}
