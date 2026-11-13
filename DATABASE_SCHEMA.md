# AXSOFIT WORLD — Modelo de datos objetivo

Este documento define el contrato lógico objetivo; todavía no representa migraciones aplicadas ni tablas existentes.

## Identidad y jugador
- users: identidad de autenticación (UID externo, estado, fechas).
- player_profiles: nombre público, preferencias, rango derivado y configuración.
- avatars: referencia al activo GLB y configuración cosmética desbloqueada.

## Mediciones
- body_measurements: usuario, fecha, métrica, valor, unidad, método, procedencia y notas.
- body_segments: medición, segmento anatómico, masa magra/grasa y unidad.

## Entrenamiento
- exercise_library: catálogo versionado de ejercicios.
- exercise_sessions: fecha, tipo, duración y notas.
- exercise_sets: sesión, ejercicio, serie, repeticiones, carga, descanso, RIR/RPE.
- strength_records: ejercicio, RM medido/estimado, fórmula, evidencia y fecha.
- training_routines: rutina, días y estado.
- endurance_sessions: modalidad, tiempo, distancia, ritmo, velocidad, FC y desnivel.
- heart_rate_samples / heart_rate_zones: muestras y zonas configurables.
- activity_records: pasos, distancia, calorías y minutos activos.
- recovery_records / sleep_records: recuperación y sueño informados/importados.

## AXCIRCUIT y academia
- axcircuit_events, axcircuit_stations, axcircuit_results.
- training_macrocycles, training_mesocycles, training_microcycles, training_sessions.

## RPG
- missions, mission_progress, xp_transactions, player_levels, player_attributes.
- achievements, player_achievements, leaderboards.

## Multijugador e integraciones
- multiplayer_rooms, player_presence.
- device_connections, device_imports.

## Relaciones y controles

- Todas las entidades privadas contienen user_id/owner_uid.
- FK en cascada solo cuando la eliminación de datos del usuario lo requiera y esté auditada.
- Índices por (user_id, measured_at), (user_id, created_at), ejercicio/fecha y evento/resultado.
- Restricciones de rango y unidad en la capa de dominio y persistencia.
- Rankings públicos nunca incluyen datos corporales o clínicos privados.
- XP se almacena como ledger append-only con clave de idempotencia; no se permite modificar el saldo desde el cliente.

## Estado actual

El prototipo usa rutas Firebase Realtime Database bajo profiles/{uid}, rooms/{roomId}. Este esquema relacional es una especificación futura, no una afirmación de que exista ya en producción.