# AXSOFIT WORLD — Arquitectura objetivo

## Principios

- Preservar el mundo Three.js y el GLB riggeado original.
- Separar UI, dominio, persistencia e integraciones.
- Migrar incrementalmente; no reemplazar el prototipo hasta alcanzar paridad funcional.
- Datos personales y deportivos privados por defecto.
- XP y resultados competitivos verificables y auditables.
- No inferir métricas que el usuario no haya medido.

## Estructura objetivo

```text
src/
  app/                 # composición y rutas
  components/          # UI reutilizable
  features/            # auth, player, body-metrics, strength, endurance,
                       # axcircuit, activity, recovery, rpg, academy,
                       # achievements, multiplayer
  domain/              # entidades, reglas y cálculos puros
  services/            # auth, database, storage
  integrations/        # polar, myzone, inbody, health-connect, imports
  three/               # escena, GLB, animaciones, controles
  styles/
  tests/
docs/adr/
```

## Capas

- Presentación: componentes accesibles y responsive; sin fórmulas de negocio.
- Dominio: modelos, validaciones, fórmulas, periodización y motor RPG puros.
- Aplicación: casos de uso y coordinación.
- Infraestructura: Firebase inicialmente; adaptadores sustituibles.
- Integraciones: adaptador por proveedor, con consentimiento y permisos.
- 3D: escena, GLB, SkeletonUtils, animaciones y sincronización aisladas.

## Transición

La primera transición conserva index.html como punto de entrada. Se documenta y prueba el comportamiento actual; luego se extraen servicios y módulos de dominio. El avatar y el mundo multijugador permanecen operativos.

## Persistencia

El prototipo usa Firebase Realtime Database. La primera etapa conserva este backend para evitar una migración disruptiva. Se versionarán reglas y contratos. Una migración futura a PostgreSQL/Supabase requiere exportación, reconciliación y pruebas RLS.

## Seguridad

- UID autenticado como propietario de datos privados.
- Reglas deny-by-default y pruebas negativas.
- No confiar en XP, niveles, marcas o clasificaciones calculadas solo en cliente.
- Secretos fuera del repositorio.
- Consentimiento granular y revocable para wearables.
- Minimización, exportación y eliminación de datos conforme al RGPD.
- Datos de salud/composición corporal fuera de rankings salvo consentimiento específico.

## Contratos de datos

Cada medición deberá incluir valor, unidad, fecha/hora, método, procedencia y estado de validación. El historial será append-only cuando sea posible; las correcciones se auditan.

XP se registra como transacción inmutable con origen, evidencia, regla aplicada, cantidad y fecha. El saldo se deriva o mantiene como proyección reconciliable.

## Decisiones pendientes

- Mantener Firebase o migrar a PostgreSQL/Supabase.
- Definir autenticación permanente y vinculación de cuentas anónimas.
- Definir retención y exportación.
- Definir límites de frecuencia multiplayer.
- Validar el GLB binario y el rig.
- Incorporar toolchain de build, lint y tests.