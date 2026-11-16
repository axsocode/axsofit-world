import { ATTRIBUTE_DEFINITIONS, scoreAttribute, type AttributeId, type AttributeAssessment } from "./attributes";

const KEY = "axsofit-world:rpg-assessment-history:v1";
export type AssessmentHistory = AttributeAssessment[];

function readStored(): AssessmentHistory {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    if (Array.isArray(parsed)) return parsed.filter(item =>
      item && ATTRIBUTE_DEFINITIONS.some(def => def.id === item.id) &&
      Number.isFinite(item.value) && Number.isFinite(item.score) && typeof item.recordedAt === "string"
    ) as AssessmentHistory;
    return [];
  } catch { return []; }
}

function persist(history: AssessmentHistory): AssessmentHistory {
  try { if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(history)); } catch { /* Local storage unavailable. */ }
  return history;
}

export function loadAssessmentHistory(): AssessmentHistory { return readStored(); }

export function saveAssessment(history: AssessmentHistory, id: AttributeId, value: number, note = ""): AssessmentHistory {
  const definition = ATTRIBUTE_DEFINITIONS.find(item => item.id === id);
  if (!definition || !Number.isFinite(value) || value < definition.min || value > definition.max) return history;
  const record: AttributeAssessment = {
    id, value, unit: definition.unit, score: scoreAttribute(id, value),
    recordedAt: new Date().toISOString(), protocol: definition.protocol, status: "user-entered", note: note.trim() || undefined
  };
  return persist([...history, record]);
}

export function clearAssessments(): AssessmentHistory { return persist([]); }

export function latestAssessment(history: AssessmentHistory, id: AttributeId): AttributeAssessment | undefined {
  return history.filter(item => item.id === id).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0];
}

export function previousAssessment(history: AssessmentHistory, id: AttributeId): AttributeAssessment | undefined {
  return history.filter(item => item.id === id).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[1];
}
