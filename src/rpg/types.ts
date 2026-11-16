export type TrainingPathId = "strength" | "endurance" | "hybrid" | "dexterity";
export type PathRole = "primary" | "secondary";

export type TrainingPath = {
  id: TrainingPathId;
  name: string;
  description: string;
};

export type PathAssignment = {
  pathId: TrainingPathId;
  role: PathRole;
};

export type XpTransaction = {
  id: string;
  source: "demo_challenge" | "academy_microcycle";
  amount: number;
  pathId: TrainingPathId;
  createdAt: string;
};

export type RpgSaveData = {
  version: 2;
  totalXp: number;
  pathXp: Record<TrainingPathId, number>;
  /** Validated academy level. XP is deliberately not used to calculate this value. */
  pathLevels: Record<TrainingPathId, number>;
  /** Prevents the same passed microcycle from granting a level twice. */
  validatedMicrocycleIds: string[];
  assignments: PathAssignment[];
  transactions: XpTransaction[];
};

export type RpgSnapshot = {
  totalXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  levelProgress: number;
  assignments: PathAssignment[];
  paths: Array<TrainingPath & { xp: number; level: number; unlocked: boolean }>;
  recentTransactions: XpTransaction[];
};
