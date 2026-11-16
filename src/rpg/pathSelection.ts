import type { PathAssignment, TrainingPathId } from "./types";

export const ALL_TRAINING_PATH_IDS: TrainingPathId[] = [
  "strength",
  "endurance",
  "hybrid",
  "dexterity"
];

export type InitialPathAssessment = {
  athleteId: string;
  completedAt: string;
  scores: Record<TrainingPathId, number>;
  notes?: Partial<Record<TrainingPathId, string>>;
};

export type InitialPathRecommendation = {
  primaryPathId: TrainingPathId;
  score: number;
  tiedPathIds: TrainingPathId[];
};

/**
 * Scores must come from a completed, validated initial assessment.
 * This function does not invent scoring criteria or clinical cut-offs.
 */
export function recommendPrimaryPath(
  assessment: InitialPathAssessment
): InitialPathRecommendation {
  const values = ALL_TRAINING_PATH_IDS.map((pathId) => assessment.scores[pathId]);

  if (!assessment.athleteId.trim()) {
    throw new Error("Falta identificar al atleta.");
  }
  if (!assessment.completedAt || Number.isNaN(Date.parse(assessment.completedAt))) {
    throw new Error("La evaluación inicial debe tener una fecha válida.");
  }
  if (values.some((score) => !Number.isFinite(score) || score < 0 || score > 100)) {
    throw new Error("Cada camino debe tener una puntuación válida entre 0 y 100.");
  }

  const highest = Math.max(...values);
  const tiedPathIds = ALL_TRAINING_PATH_IDS.filter(
    (pathId) => assessment.scores[pathId] === highest
  );

  if (tiedPathIds.length !== 1) {
    throw new Error(
      "La evaluación no determina un único camino principal. Se requiere revisión profesional."
    );
  }

  return {
    primaryPathId: tiedPathIds[0],
    score: highest,
    tiedPathIds
  };
}

/** The primary path is assessment-led; the athlete chooses one different secondary path. */
export function createInitialPathAssignments(
  assessment: InitialPathAssessment,
  secondaryPathId: TrainingPathId
): PathAssignment[] {
  const recommendation = recommendPrimaryPath(assessment);

  if (secondaryPathId === recommendation.primaryPathId) {
    throw new Error("El camino secundario debe ser distinto del principal.");
  }

  return [
    { pathId: recommendation.primaryPathId, role: "primary" },
    { pathId: secondaryPathId, role: "secondary" }
  ];
}

/** Only the two assigned paths are available before primary level 100. */
export function getAvailablePathIds(
  assignments: PathAssignment[],
  primaryPathLevel: number
): TrainingPathId[] {
  const assigned = assignments.map((item) => item.pathId);
  if (assigned.length !== 2 ||
      assignments.filter((item) => item.role === "primary").length !== 1 ||
      assignments.filter((item) => item.role === "secondary").length !== 1) {
    throw new Error("La configuración debe contener un camino principal y uno secundario.");
  }

  if (primaryPathLevel < 100) return assigned;
  return [...ALL_TRAINING_PATH_IDS];
}

export function canSelectSecondaryPath(
  primaryPathId: TrainingPathId,
  secondaryPathId: TrainingPathId
): boolean {
  return ALL_TRAINING_PATH_IDS.includes(primaryPathId) &&
    ALL_TRAINING_PATH_IDS.includes(secondaryPathId) &&
    primaryPathId !== secondaryPathId;
}
