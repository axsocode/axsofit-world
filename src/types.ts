export type ClipName = "Caminar_Loop" | "Saludar" | "Celebrar_Salto" | "Idle";
export type PlayerState = {
  playerId: string; name: string; clip: ClipName; startServerTime: number;
  playbackRate: number; loop: boolean; sequenceId: string;
  position: [number, number, number]; rotation: number; velocity: [number, number, number];
};
export type WorldMessage = { type: "state"; state: PlayerState; sentAt: number };