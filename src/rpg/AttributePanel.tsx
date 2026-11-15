import { useState } from "react";
import { ATTRIBUTE_DEFINITIONS, type AttributeId } from "./attributes";
import { clearAssessments, loadAttributes, saveAssessment } from "./attributeStore";
import type { AttributeRecord } from "./attributes";

export function AttributePanel() {
  const [records, setRecords] = useState<AttributeRecord>(() => loadAttributes());
  const [values, setValues] = useState<Record<AttributeId, string>>({
    strength: "", endurance: "", recovery: "", speed: "", agility: ""
  });
  const [notice, setNotice] = useState("");

  const submit = (id: AttributeId) => {
    const value = Number(values[id].replace(",", "."));
    if (!values[id].trim() || !Number.isFinite(value) || value <= 0) {
      setNotice("Introduce un resultado numérico válido mayor que cero.");
      return;
    }
    setRecords(current => saveAssessment(current, id, value));
    setNotice("Evaluación guardada en este dispositivo. Puntuación provisional calculada.");
  };

  return <div className="subsection rpg-attributes">
    <h3>Atributos físicos · evaluaciones</h3>
    <p className="rpg-muted">Los atributos no se compran con XP. Se estiman a partir de pruebas registradas. Sin evaluación no se muestra puntuación.</p>
    {ATTRIBUTE_DEFINITIONS.map(item => {
      const record = records[item.id];
      return <div className="rpg-assessment" key={item.id}>
        <div className="rpg-assessment-heading"><b>{item.name}</b><span>{record ? `${record.score}/100 · PROVISIONAL` : "SIN EVALUAR"}</span></div>
        <div className="rpg-assessment-metric">{item.metric}</div>
        {record && <div className="rpg-assessment-current">Resultado: {record.value} {record.unit} · {new Date(record.recordedAt).toLocaleDateString("es-ES")}</div>}
        <label className="rpg-label" htmlFor={`assessment-${item.id}`}>Nuevo resultado ({item.unit})</label>
        <div className="rpg-assessment-entry">
          <input id={`assessment-${item.id}`} type="number" min="0.01" step="any" inputMode="decimal" placeholder="Introduce resultado" value={values[item.id]} onChange={event => setValues(current => ({ ...current, [item.id]: event.target.value }))}/>
          <button type="button" className="outline-btn" onClick={() => submit(item.id)}>Guardar</button>
        </div>
        <details><summary>Protocolo y escala</summary><p>{item.protocol}</p><small>Escala interna de prototipo: {item.min}–{item.max} {item.unit}. No es una norma clínica ni baremo poblacional validado.</small></details>
      </div>;
    })}
    {notice && <p className="rpg-notice" role="status">{notice}</p>}
    <button type="button" className="outline-btn" onClick={() => { setRecords(clearAssessments()); setNotice("Evaluaciones locales eliminadas."); }}>Borrar evaluaciones locales</button>
    <p className="disclaimer">Las puntuaciones son orientativas y dependen de protocolos y condiciones de medición. No son diagnóstico ni certificación. Los registros se guardan solo en este navegador y no se sincronizan.</p>
  </div>;
}
