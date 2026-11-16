import { evaluateMicrocycleGate, type MicrocycleRecord } from "./academy";
import { isPathUnlocked } from "./progression";
import type { RpgSaveData, XpTransaction } from "./types";

/**
 * Only a genuinely passed microcycle can grant one academy level.
 * The microcycle ID is recorded so the same assessment cannot be replayed for levels or XP.
 */
export function applyPassedMicrocycle(
  data: RpgSaveData,
  record: MicrocycleRecord
): RpgSaveData {
  const gate = evaluateMicrocycleGate(record);
  if (!record.passedAt || !gate.canPass) {
    throw new Error("El microciclo no está aprobado. No se concede nivel ni XP.");
  }
  if (!record.id.trim()) {
    throw new Error("El microciclo necesita un identificador único.");
  }
  if (data.validatedMicrocycleIds.includes(record.id)) {
    throw new Error("Este microciclo ya fue contabilizado.");
  }
  if (!isPathUnlocked(record.pathId, data)) {
    throw new Error("No puedes progresar en una ruta bloqueada.");
  }
  if (record.level !== data.pathLevels[record.pathId]) {
    throw new Error("El nivel del microciclo no coincide con el nivel actual de la ruta.");
  }
  if (data.pathLevels[record.pathId] >= 100) {
    throw new Error("Esta ruta ya alcanzó el nivel máximo.");
  }

  const xp = Math.max(0, record.awardedXp);
  const transaction: XpTransaction | null = xp > 0 ? {
    id: `academy-${record.id}`,
    source: "academy_microcycle",
    amount: xp,
    pathId: record.pathId,
    createdAt: record.passedAt
  } : null;

  return {
    ...data,
    totalXp: data.totalXp + xp,
    pathXp: { ...data.pathXp, [record.pathId]: data.pathXp[record.pathId] + xp },
    pathLevels: { ...data.pathLevels, [record.pathId]: data.pathLevels[record.pathId] + 1 },
    validatedMicrocycleIds: [...data.validatedMicrocycleIds, record.id],
    transactions: transaction ? [...data.transactions, transaction] : data.transactions
  };
}
