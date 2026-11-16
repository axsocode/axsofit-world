import type { TrainingPathId } from "./types";

/**
 * AXSOFIT Academy domain model.
 * Training content is a planning framework, not a medical prescription.
 * Individual loads, exercise selection and targets must come from an athlete assessment.
 */

export type MicrocycleKind = "adaptation" | "development" | "intensification" | "recovery-assessment";
export type SessionStatus = "pending" | "completed" | "validated";
export type AssessmentStatus = "pending" | "passed" | "failed";
export type MissionKind = "training" | "technique" | "habit" | "assessment" | "recovery";

export type LevelMilestone = {
  level: number;
  elapsedWeeks: number;
  label: string;
};

export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 1, elapsedWeeks: 1, label: "Inicio" },
  { level: 3, elapsedWeeks: 2, label: "Primer hábito" },
  { level: 7, elapsedWeeks: 4, label: "Base inicial" },
  { level: 10, elapsedWeeks: 10, label: "Fundamentos" },
  { level: 25, elapsedWeeks: 13, label: "Desarrollo inicial" },
  { level: 35, elapsedWeeks: 26, label: "Consolidación" },
  { level: 55, elapsedWeeks: 35, label: "Rendimiento intermedio" },
  { level: 65, elapsedWeeks: 52, label: "Un año de proceso" },
  { level: 75, elapsedWeeks: 65, label: "Especialización" },
  { level: 85, elapsedWeeks: 78, label: "Rendimiento avanzado" },
  { level: 95, elapsedWeeks: 87, label: "Premaestría" },
  { level: 100, elapsedWeeks: 104, label: "Dominio de ruta" }
];

export type PathCurriculum = {
  pathId: TrainingPathId;
  focus: string;
  primaryOutcomes: string[];
  objectiveMetrics: string[];
  mesocycles: Array<{ id: string; name: string; purpose: string; weeks: number }>;
  microcycleTemplates: Array<{
    kind: MicrocycleKind;
    name: string;
    purpose: string;
    requiredSessionTypes: string[];
    missionKinds: MissionKind[];
  }>;
};

const commonMesocycles = [
  { id: "foundation", name: "Adaptación y fundamentos", purpose: "Aprendizaje técnico, tolerancia al entrenamiento y establecimiento de referencias.", weeks: 4 },
  { id: "build", name: "Desarrollo", purpose: "Progresión individual del estímulo y mejora de capacidades prioritarias.", weeks: 4 },
  { id: "performance", name: "Intensificación específica", purpose: "Consolidación de la capacidad principal sin perder calidad técnica.", weeks: 4 },
  { id: "reassess", name: "Consolidación y evaluación", purpose: "Reducir fatiga, revisar resultados y recalibrar el siguiente bloque.", weeks: 4 }
];

const microcycleTemplates: PathCurriculum["microcycleTemplates"] = [
  { kind: "adaptation", name: "Aprendizaje", purpose: "Practicar patrones y establecer tolerancia y técnica.", requiredSessionTypes: ["Técnica específica", "Base general"], missionKinds: ["technique", "habit"] },
  { kind: "development", name: "Desarrollo", purpose: "Acumular trabajo específico con progresión individual.", requiredSessionTypes: ["Sesión específica A", "Sesión específica B", "Trabajo complementario"], missionKinds: ["training", "technique"] },
  { kind: "intensification", name: "Intensificación", purpose: "Aplicar el estímulo prioritario manteniendo criterios de calidad.", requiredSessionTypes: ["Sesión específica A", "Sesión específica B"], missionKinds: ["training", "assessment"] },
  { kind: "recovery-assessment", name: "Descarga y evaluación", purpose: "Disminuir carga, revisar recuperación y completar evaluación comparable.", requiredSessionTypes: ["Recuperación activa", "Evaluación del microciclo"], missionKinds: ["recovery", "assessment"] }
];

export const PATH_CURRICULA: Record<TrainingPathId, PathCurriculum> = {
  strength: {
    pathId: "strength",
    focus: "Fuerza máxima, hipertrofia, fuerza relativa y dominio técnico de cargas.",
    primaryOutcomes: ["Mejorar fuerza relativa y absoluta", "Dominar patrones básicos de fuerza", "Aumentar capacidad de trabajo manteniendo técnica"],
    objectiveMetrics: ["1RM estimado o prueba submáxima estandarizada", "Carga relativa al peso corporal", "Repeticiones válidas y calidad técnica", "Volumen semanal tolerado"],
    mesocycles: commonMesocycles,
    microcycleTemplates: microcycleTemplates.map((m) => ({ ...m, requiredSessionTypes: m.requiredSessionTypes.map((s) => s.replace("específica", "de fuerza")) }))
  },
  endurance: {
    pathId: "endurance",
    focus: "Base aeróbica, eficiencia, umbral y capacidad cardiovascular.",
    primaryOutcomes: ["Mejorar capacidad aeróbica", "Mejorar economía y control de intensidad", "Desarrollar tolerancia progresiva al trabajo cardiovascular"],
    objectiveMetrics: ["Distancia o tiempo en test estandarizado", "Ritmo a frecuencia cardíaca comparable", "Tiempo por zonas individualizadas", "Carga interna y recuperación"],
    mesocycles: commonMesocycles,
    microcycleTemplates: microcycleTemplates.map((m) => ({ ...m, requiredSessionTypes: m.requiredSessionTypes.map((s) => s.replace("específica", "aeróbica")) }))
  },
  hybrid: {
    pathId: "hybrid",
    focus: "Integración de fuerza, resistencia y capacidad de trabajo híbrida.",
    primaryOutcomes: ["Combinar fuerza y resistencia sin interferencia excesiva", "Mejorar rendimiento en esfuerzos mixtos", "Gestionar transiciones y fatiga"],
    objectiveMetrics: ["Pruebas de fuerza relativa", "Test aeróbico estandarizado", "Tiempo y rendimiento en circuito", "Carga interna y recuperación"],
    mesocycles: commonMesocycles,
    microcycleTemplates: microcycleTemplates.map((m) => ({ ...m, requiredSessionTypes: m.requiredSessionTypes.map((s) => s.replace("específica", "híbrida")) }))
  },
  dexterity: {
    pathId: "dexterity",
    focus: "Coordinación, velocidad, agilidad, equilibrio y control motor.",
    primaryOutcomes: ["Mejorar coordinación y control corporal", "Mejorar aceleración y cambios de dirección", "Desarrollar equilibrio y precisión motriz"],
    objectiveMetrics: ["Sprint en distancia definida", "Test de cambio de dirección", "Prueba de equilibrio y coordinación", "Errores técnicos y consistencia"],
    mesocycles: commonMesocycles,
    microcycleTemplates: microcycleTemplates.map((m) => ({ ...m, requiredSessionTypes: m.requiredSessionTypes.map((s) => s.replace("específica", "de destreza")) }))
  }
};

export type AcademyMission = {
  id: string;
  title: string;
  kind: MissionKind;
  description: string;
  target: { metric: string; operator: ">=" | "<=" | "==" ; value: number; unit: string };
  xpReward: number;
  mandatory: boolean;
};

export type AcademySession = {
  id: string;
  title: string;
  sessionType: string;
  objective: string;
  mandatory: boolean;
  status: SessionStatus;
  completedAt?: string;
  evidence?: Record<string, number | string | boolean>;
};

export type MicrocycleRecord = {
  id: string;
  pathId: TrainingPathId;
  level: number;
  mesocycleIndex: number;
  weekInMesocycle: number;
  kind: MicrocycleKind;
  sessions: AcademySession[];
  missions: AcademyMission[];
  assessment: { status: AssessmentStatus; score?: number; assessedAt?: string };
  passedAt?: string;
  awardedXp: number;
};

export type MicrocycleGate = {
  canPass: boolean;
  mandatorySessionsCompleted: number;
  mandatorySessionsTotal: number;
  mandatorySessionsPercent: number;
  assessmentScore: number | null;
  reasons: string[];
};

export const REQUIRED_SESSION_COMPLETION = 100;
export const REQUIRED_ASSESSMENT_SCORE = 80;

export function evaluateMicrocycleGate(record: MicrocycleRecord): MicrocycleGate {
  const required = record.sessions.filter((s) => s.mandatory);
  const completed = required.filter((s) => s.status === "completed" || s.status === "validated");
  const percent = required.length ? completed.length / required.length * 100 : 0;
  const score = record.assessment.score ?? null;
  const reasons: string[] = [];
  if (percent < REQUIRED_SESSION_COMPLETION) reasons.push("Debes completar el 100 % de las sesiones obligatorias.");
  if (record.assessment.status !== "passed" || score === null || score < REQUIRED_ASSESSMENT_SCORE) {
    reasons.push("Debes aprobar la evaluación con al menos el 80 %.");
  }
  return {
    canPass: reasons.length === 0,
    mandatorySessionsCompleted: completed.length,
    mandatorySessionsTotal: required.length,
    mandatorySessionsPercent: percent,
    assessmentScore: score,
    reasons
  };
}

/** XP is granted only after the microcycle gate passes. XP never unlocks a microcycle. */
export function passMicrocycle(record: MicrocycleRecord, now = new Date().toISOString()): MicrocycleRecord {
  const gate = evaluateMicrocycleGate(record);
  if (!gate.canPass) throw new Error(gate.reasons.join(" "));
  if (record.passedAt) return record;
  const missionXp = record.missions.filter((m) => m.mandatory).reduce((sum, m) => sum + m.xpReward, 0);
  return { ...record, passedAt: now, awardedXp: missionXp };
}

export function canUnlockNextMicrocycle(previous: MicrocycleRecord | null | undefined): boolean {
  return Boolean(previous?.passedAt && evaluateMicrocycleGate(previous).canPass);
}

export function getMilestoneForLevel(level: number): LevelMilestone | undefined {
  return [...LEVEL_MILESTONES].reverse().find((m) => level >= m.level);
}

export function getMicrocycleKind(weekInMesocycle: number): MicrocycleKind {
  if (weekInMesocycle <= 1) return "adaptation";
  if (weekInMesocycle === 2) return "development";
  if (weekInMesocycle === 3) return "intensification";
  return "recovery-assessment";
}
