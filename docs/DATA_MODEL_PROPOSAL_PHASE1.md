# AXSOFIT WORLD — Modelo lógico de datos propuesto (Fase 1)

Estado: diseño lógico preliminar. No representa tablas existentes, SQL ejecutado ni migraciones aplicadas.
Proveedor preferente sujeto a auditoría: Supabase/PostgreSQL.

## Convenciones
- PK: UUID generado en servidor.
- FK: referencia con integridad referencial.
- Fechas: `timestamptz` en UTC; mostrar localizadas en UI.
- Unidades: almacenar valor y unidad explícita; evitar mezclar unidades.
- Entidades privadas incluyen `user_id` o propietario equivalente.
- Catálogos funcionales versionados.
- Registros críticos append-only o con historial de auditoría.
- Índices y políticas RLS se definirán en el diseño físico, tras inspeccionar el backend real.

## 1. Identidad y jugador
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| user_profiles | user_id (PK/FK Auth), display_name, locale, created_at, updated_at | Datos de cuenta mínimos |
| player_profiles | id, user_id (único), avatar_asset_id, public_handle, preferences, created_at | Perfil de juego |
| avatar_assets | id, asset_key, version, rig_id, status | Catálogo de avatares |
| player_avatar_unlocks | player_id, asset_id, unlocked_at, source | Cosméticos autorizados |

## 2. Catálogo y progreso de rutas
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| training_paths | id, code, name, description, catalog_version, active | Exactamente 4 rutas de producto |
| path_mesocycles | id, path_id, mesocycle_number (1..10), title, catalog_version | 10 mesociclos por ruta |
| path_levels | id, mesocycle_id, level_number (1..10), global_path_level (1..100), content_ref, requirements | 10 niveles por mesociclo |
| player_path_assignments | id, player_id, path_id, role (primary/secondary), status, assigned_at | Dos asignaciones iniciales activas |
| player_path_progress | id, player_id, path_id, level, xp_total, mastery, updated_at | Progreso por ruta |
| path_unlock_events | id, player_id, path_id, trigger_path_id, trigger_level, created_at | Historial de desbloqueos |

Restricciones de dominio:
- Cuatro rutas activas en catálogo, cada una con 100 niveles.
- Por jugador: como máximo una ruta principal y una secundaria activas en el inicio.
- Ruta principal y secundaria deben ser distintas.
- No se asigna tercera/cuarta ruta activa al inicio.
- Las dos rutas restantes se desbloquean únicamente cuando la principal llega a nivel 100.
- La secundaria no puede activar ese desbloqueo.
- El progreso nunca se elimina por un cambio de estado.
- El servidor debe serializar la asignación inicial y el desbloqueo para evitar carreras.

## 3. XP y RPG
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| xp_transactions | id, player_id, amount, source_type, source_id, idempotency_key, rule_version, created_at | Libro mayor inmutable |
| player_xp_balances | player_id, lifetime_xp, current_level, updated_at | Proyección derivada del ledger |
| rpg_attributes | id, code, name, min_value, max_value, formula_version | Catálogo de atributos RPG |
| player_rpg_attributes | player_id, attribute_id, value, updated_at | Valores RPG separados |
| achievements | id, code, title, criteria_version, xp_reward | Catálogo |
| player_achievements | player_id, achievement_id, awarded_at, evidence_ref | Logros concedidos |
| missions | id, code, title, description, requirements, reward_rule, version | Catálogo de misiones |
| mission_progress | id, player_id, mission_id, status, progress_data, completed_at | Estado por jugador |

XP no es evidencia de rendimiento físico. Las transacciones no se editan ni eliminan para corregir saldo; se registran reversos compensatorios con referencia a la transacción original. La clave idempotente impide cobrar dos veces el mismo evento.

## 4. Evaluación y métricas físicas
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| assessment_protocols | id, code, version, objective, instructions, units, safety_notes | Protocolo versionado |
| assessments | id, player_id, protocol_id, started_at, completed_at, assessor_id, status | Evaluación realizada |
| assessment_results | id, assessment_id, metric_code, value, unit, side, quality_flag, evidence_ref | Resultado medido |
| body_measurements | id, player_id, metric_code, value, unit, method, source, measured_at, privacy_level | Composición/medición privada |
| physical_capacities | id, player_id, capacity_code, value, unit, protocol_version, assessment_result_id, verified_at | Capacidad física sustentada |

No inferir diagnósticos. Los protocolos deben incluir criterios de interrupción, contraindicaciones y supervisión cuando proceda. Datos de salud y composición corporal privados por defecto.

## 5. Planificación y entrenamiento
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| training_macrocycles | id, player_id, name, start_date, end_date, objective | Plan global |
| training_mesocycles | id, macrocycle_id, sequence, objective, dates | Bloque |
| training_microcycles | id, mesocycle_id, sequence, objective, dates | Semana/bloque corto |
| training_sessions | id, player_id, microcycle_id, session_type, planned_at, completed_at, status | Sesión |
| exercise_library | id, code, name, category, equipment, instructions, version | Catálogo |
| session_exercises | id, session_id, exercise_id, order_index, target_data | Ejercicios planificados |
| exercise_sets | id, session_exercise_id, set_number, reps, load_value, load_unit, duration_seconds, distance_value, distance_unit, rpe, rir, rest_seconds | Series/intervalos |
| endurance_sessions | id, session_id, modality, duration_seconds, distance, pace, elevation, avg_hr, max_hr | Datos de resistencia |
| heart_rate_samples | id, player_id, session_id, recorded_at, bpm, source_device_id, quality | Muestras |
| strength_records | id, player_id, exercise_id, value, unit, method, estimated, assessment_result_id, recorded_at | Marcas de fuerza |

## 6. Recuperación
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| recovery_records | id, player_id, recorded_at, source, subjective_score, notes | Recuperación informada |
| sleep_records | id, player_id, start_at, end_at, duration_seconds, source_device_id, quality | Sueño importado/informado |
| load_summaries | id, player_id, period_start, period_end, load_method, load_value, source_sessions | Carga agregada |

TRIMP, fatiga y preparación se calcularán solo cuando existan datos suficientes y método declarado. No presentar estimaciones como mediciones clínicas.

## 7. AXCIRCUIT y competiciones
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| axcircuit_events | id, code, title, rules_version, event_date, status | Evento |
| axcircuit_stations | id, event_id, station_code, order_index, standard | Estaciones |
| competitions | id, title, format, rules_version, starts_at, ends_at, status | Competición |
| competition_entries | id, competition_id, player_id, category, status | Inscripción |
| competition_attempts | id, entry_id, station_id, result_value, unit, penalty, judge_id, evidence_ref | Intento |
| competition_results | id, entry_id, score, rank, validated_at, validation_status | Resultado validado |

## 8. Multijugador e integraciones
| Entidad | Campos lógicos principales | Relación / propósito |
|---|---|---|
| multiplayer_rooms | id, room_code, visibility, capacity, status | Sala persistente/configuración |
| device_connections | id, player_id, provider, external_device_id, status, scopes, connected_at | Conexión autorizada |
| device_imports | id, connection_id, external_record_id, record_type, payload_hash, imported_at, status | Importación deduplicable |
| integration_sync_logs | id, connection_id, started_at, finished_at, status, error_code | Auditoría de sincronización |

La presencia y movimiento en tiempo real pueden seguir siendo efímeros en Supabase Realtime; no necesitan duplicarse como registros permanentes de cada frame.

## 9. Privacidad y seguridad propuestas
- RLS deny-by-default para datos privados.
- Un jugador solo lee/escribe sus datos privados; operaciones privilegiadas pasan por funciones servidoras.
- Nunca aceptar del cliente un saldo XP, nivel, resultado oficial o capacidad física como valor autoritativo.
- Rankings muestran solo alias, puntuación y campos expresamente públicos.
- Datos corporales, sueño, FC y recuperación son privados por defecto.
- Tokens de dispositivos y secretos nunca se almacenan en tablas accesibles al cliente.
- Registrar consentimiento, origen y fecha de importación cuando corresponda.
- Definir exportación, retención y borrado conforme a normativa aplicable antes de producción.

## 10. Decisiones pendientes antes del diseño físico
1. Inspeccionar el proyecto Supabase real: tablas, vistas, funciones, triggers, Auth, RLS, buckets y extensiones.
2. Confirmar si `DATABASE_SCHEMA.md` describe solo una intención histórica o si existe una implementación parcial fuera del repo.
3. Definir las fórmulas de XP, nivel global y niveles de ruta.
4. Definir criterios exactos de evaluación y qué perfiles pueden validar pruebas.
5. Definir visibilidad de alias, logros y resultados en rankings.
6. Definir retención, consentimiento y eliminación de datos sensibles.
7. Confirmar la estructura completa de los 400 niveles y contenidos de cada ruta.

## 11. No incluido
Este documento no crea ni altera tablas, políticas, funciones, datos, migraciones ni recursos Supabase. No debe ejecutarse como SQL.
