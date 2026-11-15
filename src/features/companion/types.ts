export type Mood = "energized" | "okay" | "tired" | "low";
export type CompanionRole = "user" | "companion";
export type CompanionMessage = { id: string; role: CompanionRole; text: string; createdAt: string };
export type CompanionContext = { displayName?: string; nextTraining?: { title: string; scheduledAt: string; goal?: string } | null; lastMood?: Mood | null };
