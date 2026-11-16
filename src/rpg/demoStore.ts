import { INITIAL_RPG_DATA, isPathUnlocked } from "./progression";
import type { RpgSaveData, TrainingPathId, XpTransaction } from "./types";

const STORAGE_KEY = "axsofit-world:rpg-demo:v2";

function copyInitial(): RpgSaveData {
  return {
    ...INITIAL_RPG_DATA,
    pathXp: { ...INITIAL_RPG_DATA.pathXp },
    pathLevels: { ...INITIAL_RPG_DATA.pathLevels },
    validatedMicrocycleIds: [],
    assignments: INITIAL_RPG_DATA.assignments.map(item => ({ ...item })),
    transactions: []
  };
}

export function loadRpgData(): RpgSaveData {
  if (typeof window === "undefined") return copyInitial();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RpgSaveData;
      if (
        parsed.version === 2 &&
        parsed.pathXp &&
        parsed.pathLevels &&
        Array.isArray(parsed.validatedMicrocycleIds) &&
        Array.isArray(parsed.assignments) &&
        Array.isArray(parsed.transactions)
      ) return parsed;
    }

    // Deliberate safe migration: legacy XP is retained as points, never converted into levels.
    const legacyRaw = window.localStorage.getItem("axsofit-world:rpg-demo:v1");
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as {
        totalXp?: number;
        pathXp?: Record<TrainingPathId, number>;
        assignments?: RpgSaveData["assignments"];
        transactions?: XpTransaction[];
      };
      const migrated: RpgSaveData = {
        ...copyInitial(),
        totalXp: Math.max(0, Number(legacy.totalXp) || 0),
        pathXp: {
          strength: Math.max(0, Number(legacy.pathXp?.strength) || 0),
          endurance: Math.max(0, Number(legacy.pathXp?.endurance) || 0),
          hybrid: Math.max(0, Number(legacy.pathXp?.hybrid) || 0),
          dexterity: Math.max(0, Number(legacy.pathXp?.dexterity) || 0)
        },
        assignments: Array.isArray(legacy.assignments) ? legacy.assignments : copyInitial().assignments,
        transactions: Array.isArray(legacy.transactions) ? legacy.transactions : []
      };
      return saveRpgData(migrated);
    }
    return copyInitial();
  } catch {
    return copyInitial();
  }
}

export function saveRpgData(data: RpgSaveData): RpgSaveData {
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* Storage may be unavailable. */ }
  }
  return data;
}

/** Demo XP changes reward totals only. It can never increase an academy level. */
export function awardDemoXp(data: RpgSaveData, pathId: TrainingPathId, amount = 100): RpgSaveData {
  if (!isPathUnlocked(pathId, data)) {
    throw new Error("No puedes recibir recompensas en una ruta bloqueada.");
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("La cantidad de XP debe ser positiva.");
  }
  const transaction: XpTransaction = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `demo-${Date.now()}`,
    source: "demo_challenge",
    amount,
    pathId,
    createdAt: new Date().toISOString()
  };
  return saveRpgData({
    ...data,
    totalXp: data.totalXp + amount,
    pathXp: { ...data.pathXp, [pathId]: data.pathXp[pathId] + amount },
    transactions: [...data.transactions, transaction]
  });
}

export function resetDemoRpg(): RpgSaveData {
  return saveRpgData(copyInitial());
}
