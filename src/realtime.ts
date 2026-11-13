import { createClient, SupabaseClient, RealtimeChannel } from "@supabase/supabase-js";
import type { PlayerState } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export class WorldRealtime {
  client: SupabaseClient | null = null;
  channel: RealtimeChannel | null = null;
  connected = false;
  onPlayer?: (state: PlayerState) => void;
  onPresence?: (ids: string[]) => void;
  readonly playerId = crypto.randomUUID();

  async connect() {
    if (!url || !key) return false;
    this.client = createClient(url, key);
    this.channel = this.client.channel("axsofit-world-room-01", {
      config: { presence: { key: this.playerId }, broadcast: { self: false } }
    });
    this.channel.on("broadcast", { event: "player-state" }, ({ payload }) => {
      const s = payload?.state as PlayerState | undefined;
      if (s && s.playerId !== this.playerId) this.onPlayer?.(s);
    });
    this.channel.on("presence", { event: "sync" }, () => {
      const state = this.channel?.presenceState() ?? {};
      this.onPresence?.(Object.keys(state));
    });
    await new Promise<void>((resolve, reject) => {
      this.channel!.subscribe(async status => {
        if (status === "SUBSCRIBED") {
          this.connected = true;
          await this.channel!.track({ playerId: this.playerId, joinedAt: new Date().toISOString() });
          resolve();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") reject(new Error(status));
      });
    });
    return true;
  }

  async publish(state: PlayerState) {
    if (!this.channel || !this.connected) return;
    await this.channel.send({ type: "broadcast", event: "player-state", payload: { state, sentAt: Date.now() } });
  }

  async disconnect() {
    this.connected = false;
    if (this.channel) await this.channel.unsubscribe();
  }
}