import { ATTRIBUTE_DEFINITIONS, scoreAttribute, type AttributeId, type AttributeRecord } from "./attributes";
const KEY = "axsofit-world:rpg-attributes:v1";
export function loadAttributes(): AttributeRecord {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(KEY) || "{}") as AttributeRecord; } catch { return {}; }
}
export function saveAssessment(current: AttributeRecord, id: AttributeId, value: number): AttributeRecord {
  const definition = ATTRIBUTE_DEFINITIONS.find(item => item.id === id);
  if (!definition || !Number.isFinite(value) || value <= 0) return current;
  const next: AttributeRecord = {
    ...current,
    [id]: {
      id, value, unit: definition.unit, score: scoreAttribute(id, value),
      recordedAt: new Date().toISOString(), protocol: definition.protocol, status: "user-entered"
    }
  };
  try { if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* local storage unavailable */ }
  return next;
}
export function clearAssessments(): AttributeRecord {
  try { if (typeof window !== "undefined") window.localStorage.removeItem(KEY); } catch { /* local storage unavailable */ }
  return {};
}
