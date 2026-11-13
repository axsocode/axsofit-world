# AXSOFIT WORLD — Motor RPG

## Principios

- XP recompensa objetivos y constancia saludable, no horas ilimitadas.
- El descanso planificado no rompe rachas.
- Subir de nivel nunca aumenta automáticamente la carga deportiva.
- Una misión se valida contra evidencia registrada y reglas versionadas.
- Cada concesión de XP tiene origen, fecha, regla y clave de idempotencia.

## Modelo propuesto

- Mission: id, nombre, descripción, requisitos, fecha límite opcional y recompensa.
- MissionProgress: estado locked/available/in_progress/completed, progreso y evidencia.
- XPTransaction: id, uid, amount, source_type, source_id, rule_version, created_at, idempotency_key.
- PlayerLevel: nivel derivado del total de transacciones válidas.
- Achievement: regla y versión; PlayerAchievement registra evidencia y fecha.

## Seguridad

La validación final de misiones y emisión de XP debe ejecutarse en backend confiable o función protegida. El cliente solo solicita completar y muestra el resultado devuelto. Las reglas evitan duplicados y reclamaciones sin evidencia.

## Estado

El prototipo dispone de una fórmula XP de cliente para sesiones manuales. No es un motor antifraude y no debe usarse para competición ni recompensas de valor hasta migrar a validación de servidor.