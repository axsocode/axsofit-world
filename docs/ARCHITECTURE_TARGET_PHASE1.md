# AXSOFIT WORLD — Arquitectura objetivo (Fase 1)

Estado: propuesta de arquitectura. No es implementación ni confirma recursos activos en Supabase.
Base auditada: `main` en `e5a3c21f2cf4257186daeea55a46600766af7e19`.
Rama de trabajo: `architecture/phase-1-domain-model`.

## 1. Principios no negociables
- Evolucionar el proyecto React + TypeScript + Vite + Three.js / React Three Fiber existente; no reconstruirlo desde cero.
- Conservar el avatar humanoide GLB, rig, clips, joystick, cámara de tercera persona y escena multijugador.
- Mantener separadas la identidad autenticada, el perfil deportivo, la progresión RPG y la presencia efímera del mundo 3D.
- El cliente nunca es autoridad para XP, desbloqueos, resultados oficiales ni atributos físicos verificados.
- XP, nivel RPG y atributos físicos son conceptos distintos.
- No usar fechas de calendario para desbloqueos.
- No convertir datos clínicos o corporales en datos públicos de ranking.
- Integraciones externas se marcan como no conectadas hasta que exista una conexión real y verificable.

## 2. Capas y módulos de dominio
```
Presentation (React UI)
  ├─ World 3D / Avatar / Camera / Controls
  ├─ Profile / Academy / Training Paths / Skills
  └─ Assessment / Training / Recovery / Competition UI
Application
  ├─ Auth & Player Use Cases
  ├─ Assessment & Training Use Cases
  ├─ Progression / Mission / XP Use Cases
  ├─ Recovery & Competition Use Cases
  └─ Multiplayer & Integration Use Cases
Domain (reglas puras, sin React ni proveedor)
  ├─ Player & Body Metrics
  ├─ Four Training Paths / Level Rules
  ├─ RPG / XP Ledger / Missions / Achievements
  ├─ Assessment / Training / Recovery
  └─ Skills / Competition
Infrastructure
  ├─ Supabase Auth / Postgres / RLS (pendiente de verificar)
  ├─ Supabase Realtime (presencia y eventos efímeros)
  ├─ Device adapters: Polar / MyZone / Health Connect / InBody
  └─ Observability / validation / migrations (futuro)
```

## 3. Módulos propuestos
| Módulo | Responsabilidad | Autoridad |
|---|---|---|
| CORE | IDs, fechas, unidades, errores, eventos y configuración | Dominio |
| AUTH | Sesión e identidad | Proveedor Auth |
| PLAYER | Perfil, preferencias y estado del jugador | Servidor |
| BODY METRICS | Mediciones y procedencia | Servidor; dato privado |
| TRAINING PATHS | Catálogo y reglas de las 4 rutas | Dominio versionado |
| ASSESSMENT ENGINE | Pruebas, protocolos, evidencia y resultados | Validación servidor |
| TRAINING ENGINE | Macro/meso/micro/sesión/ejercicio/serie | Dominio + servidor |
| RPG ENGINE | XP, nivel general, misiones y logros | Servidor |
| SKILL TREE | Requisitos, prerrequisitos y seguridad | Dominio + validación |
| RECOVERY ENGINE | Carga, fatiga, recuperación y alertas no diagnósticas | Dominio |
| COMPETITION HUB | Eventos, inscripciones, intentos y resultados | Servidor |
| MULTIPLAYER | Presencia, salas y sincronización 3D | Realtime efímero |
| INTEGRATIONS | Adaptadores externos y trazabilidad | Por proveedor |
| AVATAR 3D | Presentación, animación y cosmética | Cliente; desbloqueos autorizados por servidor |

## 4. Regla de las cuatro rutas
Rutas:
1. Fuerza e hipertrofia
2. Resistencia
3. Híbrida
4. Destreza y control motor

Cada ruta contiene 100 niveles organizados en 10 mesociclos de 10 niveles. El catálogo de contenidos detallado se conserva como fuente funcional y se versionará por separado.

Al crear el jugador:
- Se asigna una ruta principal recomendada por evaluación.
- El jugador elige una ruta secundaria entre las otras tres.
- Solo esas dos quedan activas.
- Las otras dos se muestran bloqueadas.
- Alcanzar nivel 100 en la ruta principal desbloquea las dos rutas restantes.
- Llegar a nivel 100 en la secundaria no sustituye ni adelanta ese requisito.
- No se borra ni reinicia progreso al desbloquear rutas.
- No hay desbloqueos automáticos por tiempo transcurrido.

La selección inicial, el progreso y los desbloqueos deben ser transacciones validadas por servidor y protegidas contra repetición.

## 5. Modelo de progresión
Mantener separadas estas dimensiones:
- Nivel global del jugador y XP global.
- Nivel y XP de cada ruta.
- Maestría por ejercicio, habilidad o competencia.
- Atributos RPG (0–100).
- Atributos físicos medidos (con protocolo, unidad, fecha y evidencia).
- Logros, misiones y especializaciones.

El XP no acredita fuerza, VO2, velocidad, movilidad, recuperación ni competencia técnica. Un atributo físico solo cambia por una evaluación válida, con procedencia y protocolo.

## 6. Flujo de confianza
1. Cliente solicita una acción (completar misión, registrar sesión, enviar evaluación).
2. API/función confiable autentica al usuario y valida reglas, límites, requisitos y versión del catálogo.
3. Se registra el evento de dominio y, si corresponde, una transacción XP idempotente.
4. El servidor calcula progreso/desbloqueos y persiste el resultado atómicamente.
5. El cliente recibe el estado autorizado y actualiza la UI.
6. Realtime distribuye únicamente los datos de presencia/estado público permitidos.

## 7. Multijugador y avatar
- Mantener Realtime para presencia y movimiento de baja latencia.
- No usar presencia como almacenamiento persistente del perfil.
- No transmitir mediciones corporales, datos clínicos ni credenciales en payloads públicos.
- Validar y limitar payloads; tratar todo estado remoto como no confiable.
- Conservar GLB, nombres de clips y controles actuales salvo cambios posteriores aprobados.
- Un Companion/NPC sería una entidad distinta del avatar humanoide controlado por el jugador.

## 8. Estructura de carpetas objetivo (propuesta)
```
src/
  app/
  core/
  modules/
    auth/
    player/
    body-metrics/
    training-paths/
    assessment/
    training/
    rpg/
    skill-tree/
    recovery/
    competitions/
    multiplayer/
    integrations/
    avatar/
  infrastructure/
    supabase/
    repositories/
    device-adapters/
  shared/
  assets/
```
La migración desde la estructura actual será incremental. No mover archivos en esta fase.

## 9. Decisiones de infraestructura
La aplicación ya usa el SDK de Supabase y Supabase Realtime en el cliente. Por continuidad se propone mantener Supabase como opción preferente, sujeto a inspección autorizada de proyecto, tablas, Auth, RLS, funciones y configuración. La auditoría de código no demuestra que el backend esté configurado o sea seguro.

No crear tablas ni migraciones hasta:
- obtener inventario real del backend;
- comparar el inventario con el modelo lógico;
- resolver duplicidades y nombres;
- acordar privacidad y retención;
- diseñar migraciones versionadas, reversibles y probadas.

## 10. Fuera de alcance de esta fase
- Cambios funcionales en la aplicación.
- Cambios a `main`.
- Merge/cierre de PR existentes.
- SQL, migraciones o escrituras en Supabase.
- Activar integraciones o inventar datos de dispositivos.
- Desplegar a GitHub Pages.

## 11. Criterios de aceptación de Fase 1
- Arquitectura por capas y responsabilidades documentadas.
- Reglas de las cuatro rutas expresadas sin ambigüedad.
- Separación de XP, atributos RPG y capacidades físicas.
- Modelo lógico con relaciones, privacidad e idempotencia.
- Lista de incertidumbres y decisiones pendientes.
- Aprobación del usuario antes de pasar a diseño técnico detallado o implementación.
