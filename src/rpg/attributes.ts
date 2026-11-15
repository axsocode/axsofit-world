export type AttributeId = "strength" | "endurance" | "recovery" | "speed" | "agility";
export type AttributeAssessment = {
  id: AttributeId;
  value: number;
  unit: string;
  score: number;
  recordedAt: string;
  protocol: string;
  status: "demo" | "user-entered";
};
export const ATTRIBUTE_DEFINITIONS: Array<{
  id: AttributeId; name: string; metric: string; unit: string; protocol: string; min: number; max: number; higherIsBetter: boolean;
}> = [
  { id: "strength", name: "Fuerza", metric: "Sentadilla 1RM relativo", unit: "× peso corporal", protocol: "1RM validado o estimación submáxima documentada; dividir kg de 1RM entre peso corporal en kg.", min: 0.5, max: 2, higherIsBetter: true },
  { id: "endurance", name: "Resistencia", metric: "Test de Cooper", unit: "metros", protocol: "Distancia recorrida en 12 minutos en condiciones comparables.", min: 1000, max: 3500, higherIsBetter: true },
  { id: "recovery", name: "Recuperación", metric: "Recuperación de FC a 1 min", unit: "lpm", protocol: "FC al finalizar el esfuerzo menos FC exactamente 60 s después; repetir con el mismo protocolo.", min: 0, max: 40, higherIsBetter: true },
  { id: "speed", name: "Velocidad", metric: "Sprint de 20 m", unit: "segundos", protocol: "Tiempo de sprint de 20 m con salida y cronometraje estandarizados.", min: 2.5, max: 6, higherIsBetter: false },
  { id: "agility", name: "Agilidad", metric: "Shuttle 5-10-5", unit: "segundos", protocol: "Tiempo total en test 5-10-5 con recorrido, superficie y giro estandarizados.", min: 4, max: 20, higherIsBetter: false }
];
// Prototype-only linear normalization. These bands are not validated population norms or clinical cut-offs.
export function scoreAttribute(id: AttributeId, value: number): number {
  const definition = ATTRIBUTE_DEFINITIONS.find(item => item.id === id);
  if (!definition || !Number.isFinite(value)) return 0;
  const raw = (value - definition.min) / (definition.max - definition.min);
  const normalized = definition.higherIsBetter ? raw : 1 - raw;
  return Math.round(Math.max(0, Math.min(1, normalized)) * 100);
}
export function attributeLevel(score: number): number {
  return Math.max(1, Math.min(100, Math.round(score)));
}
