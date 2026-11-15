import type { CompanionContext, Mood } from "../types";

export function createCompanionReply(input: string, context: CompanionContext): string {
  const value = input.trim().toLocaleLowerCase("es");
  if (["energized", "con energía", "energia", "bien"].some(token => value.includes(token))) {
    return "¡Me alegra saberlo! Aprovechemos esa energía con cabeza. ¿Quieres revisar tu entrenamiento de hoy?";
  }
  if (["tired", "cansado", "cansada", "fatiga"].some(token => value.includes(token))) {
    return "Gracias por contármelo. Podemos revisar cómo te encuentras y valorar una sesión más suave. Escuchar al cuerpo también es avanzar.";
  }
  if (["low", "mal", "triste", "desanimado", "desanimada"].some(token => value.includes(token))) {
    return "Siento que hoy esté siendo un día difícil. No tienes que demostrar nada; podemos ir paso a paso. ¿Te apetece contarme un poco más?";
  }
  if (value.includes("entrenamiento") || value.includes("sesión") || value.includes("sesion")) {
    if (context.nextTraining) return `Tienes registrada esta sesión: ${context.nextTraining.title}, ${new Date(context.nextTraining.scheduledAt).toLocaleString("es-ES")}.${context.nextTraining.goal ? " Objetivo: " + context.nextTraining.goal + "." : ""}`;
    return "Todavía no tengo una sesión programada en tu perfil. Cuando registres tu planificación podré recordártela.";
  }
  return "Te leo. Cuéntame un poco más y vemos juntos cuál puede ser el siguiente paso.";
}

export function moodReply(mood: Mood): string {
  const replies: Record<Mood, string> = {
    energized: "¡Esa energía se nota! Vamos a aprovecharla sin perder de vista la técnica.",
    okay: "Perfecto, vamos paso a paso. Lo importante es mantener una buena relación con el entrenamiento.",
    tired: "Gracias por avisarme. Podemos revisar la carga prevista y priorizar la recuperación si hace falta.",
    low: "Gracias por confiarme cómo te sientes. Hoy también cuenta cuidarte; no hay presión."
  };
  return replies[mood];
}
