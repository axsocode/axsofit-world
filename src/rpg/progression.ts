import type { RpgSaveData, RpgSnapshot, TrainingPath, TrainingPathId } from "./types";

export const TRAINING_PATHS: TrainingPath[] = [
  { id: "strength", name: "Fuerza", description: "Fuerza máxima, hipertrofia y dominio de cargas." },
  { id: "endurance", name: "Resistencia", description: "Base aeróbica, umbral y capacidad cardiovascular." },
  { id: "hybrid", name: "Híbrido", description: "Integración de fuerza, resistencia y capacidad de trabajo." },
  { id: "dexterity", name: "Destreza", description: "Coordinación, velocidad, equilibrio y control motor." }
];

export const INITIAL_RPG_DATA: RpgSaveData = {
  version: 1,
  totalXp: 2450,
  pathXp: { strength: 650, endurance: 0, hybrid: 900, dexterity: 0 },
  assignments: [
    { pathId: "hybrid", role: "primary" },
    { pathId: "strength", role: "secondary" }
  ],
  transactions: []
};

// Demo curve: each level requires 1,000 + 250 * (level - 1) XP.
export function xpRequiredForLevel(level: number): number {
  return 1000 + Math.max(0, level - 1) * 250;
}

export function levelFromXp(xp: number): { level: number; into: number; required: number } {
  let remaining = Math.max(0, xp);
  let level = 1;
  while (level < 100) {
    const required = xpRequiredForLevel(level);
    if (remaining < required) return { level, into: remaining, required };
    remaining -= required;
    level += 1;
  }
  return { level: 100, into: 0, required: 0 };
}

export function isPathUnlocked(pathId: TrainingPathId, data: RpgSaveData): boolean {
  if (data.assignments.some(item => item.pathId === pathId)) return true;
  const primary = data.assignments.find(item => item.role === "primary");
  return Boolean(primary && levelFromXp(data.pathXp[primary.pathId]).level >= 100);
}

export function createSnapshot(data: RpgSaveData): RpgSnapshot {
  const global = levelFromXp(data.totalXp);
  return {
    totalXp: data.totalXp,
    level: global.level,
    xpIntoLevel: global.into,
    xpForNextLevel: global.required,
    levelProgress: global.required ? Math.min(100, global.into / global.required * 100) : 100,
    assignments: data.assignments,
    paths: TRAINING_PATHS.map(path => ({
      ...path,
      xp: data.pathXp[path.id],
      level: levelFromXp(data.pathXp[path.id]).level,
      unlocked: isPathUnlocked(path.id, data)
    })),
    recentTransactions: [...data.transactions].slice(-5).reverse()
  };
}
