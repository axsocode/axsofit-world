import { useMemo, useState } from "react";
import {
  PATH_CURRICULA,
  evaluateMicrocycleGate,
  passMicrocycle,
  type AcademyMission,
  type AcademySession,
  type MicrocycleRecord
} from "./academy";
import { applyPassedMicrocycle } from "./academyProgression";
import { loadRpgData, saveRpgData } from "./demoStore";
import { createSnapshot } from "./progression";
import type { TrainingPathId } from "./types";

const STORAGE_KEY = "axsofit-world:academy-demo:v1";

function makeRecord(pathId: TrainingPathId, level: number): MicrocycleRecord {
  const curriculum = PATH_CURRICULA[pathId];
  const template = curriculum.microcycleTemplates[0];
  const sessions: AcademySession[] = template.requiredSessionTypes.map((type, index) => ({
    id: `${pathId}-n${level}-session-${index + 1}`,
    title: `Sesión obligatoria ${index + 1}`,
    sessionType: type,
    objective: curriculum.primaryOutcomes[index % curriculum.primaryOutcomes.length],
    mandatory: true,
    status: "pending"
  }));
  const missions: AcademyMission[] = [
    {
      id: `${pathId}-n${level}-mission-technique`,
      title: "Registrar objetivo técnico",
      kind: "technique",
      description: "Completa la tarea técnica asignada y registra una evidencia verificable.",
      target: { metric: "evidencias registradas", operator: ">=", value: 1, unit: "registro" },
      xpReward: 50,
      mandatory: false,
      status: "pending"
    },
    {
      id: `${pathId}-n${level}-mission-habit`,
      title: "Registrar hábito de recuperación",
      kind: "recovery",
      description: "Registra la acción de recuperación indicada en tu planificación.",
      target: { metric: "acciones registradas", operator: ">=", value: 1, unit: "registro" },
      xpReward: 25,
      mandatory: false,
      status: "pending"
    }
  ];
  return {
    id: `${pathId}-level-${level}-microcycle-1`,
    pathId,
    level,
    mesocycleIndex: 0,
    weekInMesocycle: 1,
    kind: template.kind,
    sessions,
    missions,
    assessment: { status: "pending" },
    awardedXp: 0
  };
}

function readRecord(pathId: TrainingPathId, level: number): MicrocycleRecord {
  const fresh = makeRecord(pathId, level);
  if (typeof window === "undefined") return fresh;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const parsed = JSON.parse(raw) as MicrocycleRecord;
    return parsed.id === fresh.id ? parsed : fresh;
  } catch {
    return fresh;
  }
}

function persistRecord(record: MicrocycleRecord) {
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record)); } catch { /* Local storage may be unavailable. */ }
  }
}

export function AcademyPanel() {
  const [rpg, setRpg] = useState(() => loadRpgData());
  const snapshot = createSnapshot(rpg);
  const activePath = rpg.assignments.find(item => item.role === "primary")?.pathId ?? "hybrid";
  const activeLevel = rpg.pathLevels[activePath];
  const [record, setRecord] = useState(() => readRecord(activePath, activeLevel));
  const [notice, setNotice] = useState("");
  const curriculum = PATH_CURRICULA[activePath];
  const gate = useMemo(() => evaluateMicrocycleGate(record), [record]);
  const template = curriculum.microcycleTemplates[0];

  const updateRecord = (next: MicrocycleRecord) => {
    setRecord(next);
    persistRecord(next);
    setNotice("");
  };

  const toggleSession = (sessionId: string, checked: boolean) => {
    updateRecord({
      ...record,
      sessions: record.sessions.map(session => session.id === sessionId
        ? { ...session, status: checked ? "completed" : "pending", completedAt: checked ? new Date().toISOString() : undefined }
        : session)
    });
  };

  const toggleMission = (missionId: string, checked: boolean) => {
    updateRecord({
      ...record,
      missions: record.missions.map(mission => mission.id === missionId
        ? { ...mission, status: checked ? "completed" : "pending", completedAt: checked ? new Date().toISOString() : undefined }
        : mission)
    });
  };

  const updateAssessment = (value: number) => {
    const score = Math.max(0, Math.min(100, value));
    updateRecord({
      ...record,
      assessment: { status: score >= 80 ? "passed" : "failed", score, assessedAt: new Date().toISOString() }
    });
  };

  const approve = () => {
    try {
      const passed = passMicrocycle(record);
      const nextRpg = applyPassedMicrocycle(rpg, passed);
      saveRpgData(nextRpg);
      setRpg(nextRpg);
      setRecord(passed);
      persistRecord(passed);
      setNotice("Microciclo aprobado. Se ha registrado un nivel de Academia y las recompensas de misiones completadas.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No se pudo aprobar el microciclo.");
    }
  };

  return <section className="subsection academy-panel">
    <div className="section-title"><h3>Academia AXSOFIT</h3><span className="data-tag">MVP LOCAL</span></div>
    <p className="rpg-muted">Ruta principal: <b>{curriculum.pathId.toUpperCase()}</b> · Nivel validado: <b>N{activeLevel}</b> · XP total: <b>{snapshot.totalXp}</b></p>
    <p className="rpg-muted">{curriculum.focus}</p>

    <div className="academy-block">
      <h4>Macroproceso y mesociclo</h4>
      <p><b>Macroproceso:</b> Desarrollo de la ruta {curriculum.pathId}.</p>
      <p><b>Mesociclo 1/4:</b> {curriculum.mesocycles[0].name} · {curriculum.mesocycles[0].weeks} semanas.</p>
      <p className="rpg-muted">{curriculum.mesocycles[0].purpose}</p>
      <p><b>Microciclo 1:</b> {template.name}</p>
      <p className="rpg-muted">{template.purpose}</p>
      <small>Plantilla inicial de planificación: no es todavía una prescripción de ejercicios, cargas ni calendario individual.</small>
    </div>

    <div className="academy-block">
      <h4>Sesiones obligatorias</h4>
      <p className="rpg-muted">Completa el 100 % para poder solicitar la aprobación del microciclo.</p>
      {record.sessions.map(session => <label className="academy-check" key={session.id}>
        <input type="checkbox" checked={session.status !== "pending"} disabled={Boolean(record.passedAt)} onChange={event => toggleSession(session.id, event.target.checked)} />
        <span><b>{session.title} · {session.sessionType}</b><small>{session.objective}</small></span>
      </label>)}
      <p><b>{gate.mandatorySessionsCompleted}/{gate.mandatorySessionsTotal}</b> sesiones obligatorias completadas ({Math.round(gate.mandatorySessionsPercent)} %)</p>
    </div>

    <div className="academy-block">
      <h4>Misiones y recompensas</h4>
      {record.missions.map(mission => <label className="academy-check" key={mission.id}>
        <input type="checkbox" checked={mission.status !== "pending"} disabled={Boolean(record.passedAt)} onChange={event => toggleMission(mission.id, event.target.checked)} />
        <span><b>{mission.title} · +{mission.xpReward} XP</b><small>{mission.description}</small></span>
      </label>)}
      <small>El XP de cada misión solo se concede si queda marcada como completada antes de aprobar el microciclo.</small>
    </div>

    <div className="academy-block">
      <h4>Evaluación del microciclo</h4>
      <label className="rpg-label" htmlFor="academy-score">Resultado de evaluación (0–100 %)</label>
      <input id="academy-score" type="number" min="0" max="100" value={record.assessment.score ?? ""} disabled={Boolean(record.passedAt)} placeholder="Introduce la nota" onChange={event => updateAssessment(Number(event.target.value))} />
      <p className="rpg-muted">Requisito de aprobación: mínimo 80 %.</p>
      {gate.reasons.map(reason => <p className="rpg-notice" key={reason}>{reason}</p>)}
      {record.passedAt
        ? <p className="rpg-notice" role="status">Microciclo aprobado el {new Date(record.passedAt).toLocaleDateString("es-ES")}.</p>
        : <button type="button" className="outline-btn" disabled={!gate.canPass} onClick={approve}>Validar microciclo y avanzar nivel</button>}
      {notice && <p className="rpg-notice" role="status">{notice}</p>}
    </div>
    <p className="disclaimer">Demo local: los controles registran auto-reporte del atleta. La validación por entrenador, sincronización y planificación personalizada se implementarán en fases posteriores.</p>
  </section>;
}
