import type { RpgSaveData, RpgSnapshot, TrainingPath, TrainingPathId } from "./types";

export const TRAINING_PATHS: TrainingPath[] = [
  { id: "strength", name: "Fuerza", description: "Fuerza máxima, hipertrofia y dominio de cargas." },
  { id: "endurance", name: "Resistencia", description: "Base aeróbica, umbral y capacidad cardiovascular." },
  { id: "hybrid", name: "Híbrido", description: "Integración de fuerza, resistencia y capacidad de trabajo." },
  { id: "dexterity", name: "Destreza", description: "Coordinación, velocidad, equilibrio y control motor." }
];

export const INITIAL_RPG_DATA: RpgSaveData = {
  version: 2,
  totalXp: 0,
  pathXp: { strength: 0, endurance: 0, hybrid: 0, dexterity: 0 },
  pathLevels: { strength: 1, endurance: 1, hybrid: 1, dexterity: 1 },
  validatedMicrocycleIds: [],
  assignments: [
    { pathId: "hybrid", role: "primary" },
    { pathId: "strength", role: "secondary" }
  ],
  transactions: []
};

/** XP is a reward currency only. It does not determine academy levels. */
export function xpRequiredForLevel(_level: number): number {
  return 0;
}

export function levelFromXp(_xp: number): { level: number; into: number; required: number } {
  return { level: 1, into: 0, required: 0 };
}

export function isPathUnlocked(pathId: TrainingPathId, data: RpgSaveData): boolean {
  if (data.assignments.some(item => item.pathId === pathId)) return true;
  const primary = data.assignments.find(item => item.role === "primary");
  return Boolean(primary && data.pathLevels[primary.pathId] >= 100);
}

export function createSnapshot(data: RpgSaveData): RpgSnapshot {
  const primary = data.assignments.find(item => item.role === "primary");
  const globalLevel = primary ? data.pathLevels[primary.pathId] : 1;
  return {
    totalXp: data.totalXp,
    level: globalLevel,
    xpIntoLevel: 0,
    xpForNextLevel: 0,
    levelProgress: 0,
    assignments: data.assignments,
    paths: TRAINING_PATHS.map(path => ({
      ...path,
      xp: data.pathXp[path.id],
      level: data.pathLevels[path.id],
      unlocked: isPathUnlocked(path.id, data)
    })),
    recentTransactions: [...data.transactions].slice(-5).reverse()
  };
}
