import { useCallback, useState } from "react";
import { COMPANION_GREETING } from "../config";
import { createCompanionReply, moodReply } from "../engine/companionEngine";
import type { CompanionContext, CompanionMessage, Mood } from "../types";

const message = (role: CompanionMessage["role"], text: string): CompanionMessage => ({
  id: crypto.randomUUID(), role, text, createdAt: new Date().toISOString()
});

export function useCompanion(context: CompanionContext = {}) {
  const [messages, setMessages] = useState<CompanionMessage[]>(() => [message("companion", COMPANION_GREETING)]);
  const [mood, setMood] = useState<Mood | null>(null);
  const send = useCallback((text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages(old => [...old, message("user", clean), message("companion", createCompanionReply(clean, context))]);
  }, [context]);
  const checkIn = useCallback((nextMood: Mood) => {
    setMood(nextMood);
    setMessages(old => [...old, message("user", ({energized:"Hoy tengo energía",okay:"Hoy estoy normal",tired:"Hoy estoy cansado",low:"Hoy no me encuentro bien"} as const)[nextMood]), message("companion", moodReply(nextMood))]);
  }, []);
  return { messages, mood, send, checkIn };
}
