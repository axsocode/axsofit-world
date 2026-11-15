import { INITIAL_RPG_DATA } from "./progression";
import type { RpgSaveData, TrainingPathId, XpTransaction } from "./types";

const STORAGE_KEY = "axsofit-world:rpg-demo:v1";

function copyInitial(): RpgSaveData {
  return {
    ...INITIAL_RPG_DATA,
    pathXp: { ...INITIAL_RPG_DATA.pathXp },
    assignments: INITIAL_RPG_DATA.assignments.map(item => ({ ...item })),
    transactions: []
  };
}

export function loadRpgData(): RpgSaveData {
  if (typeof window === "undefined") return copyInitial();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return copyInitial();
    const parsed = JSON.parse(raw) as RpgSaveData;
    if (parsed.version !== 1 || !parsed.pathXp || !Array.isArray(parsed.assignments)) return copyInitial();
    return parsed;
  } catch {
    return copyInitial();
  }
}

function save(data: RpgSaveData): RpgSaveData {
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Storage may be unavailable. */ }
  }
  return data;
}

export function awardDemoXp(data: RpgSaveData, pathId: TrainingPathId, amount = 100): RpgSaveData {
  const transaction: XpTransaction = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `demo-${Date.now()}`,
    source: "demo_challenge",
    amount,
    pathId,
    createdAt: new Date().toISOString()
  };
  return save({
    ...data,
    totalXp: data.totalXp + amount,
    pathXp: { ...data.pathXp, [pathId]: data.pathXp[pathId] + amount },
    transactions: [...data.transactions, transaction]
  });
}

export function resetDemoRpg(): RpgSaveData {
  return save(copyInitial());
}
