# Integración AXSOFIT WORLD — Academia Progresiva

## Decisión aprobada
La versión `AXSOFIT_WORLD_Academia_Progresiva.zip` es la base funcional objetivo para la siguiente generación del proyecto. La arquitectura seleccionada es React 18 + TypeScript + Vite + Three.js / React Three Fiber + Supabase Realtime.

## Protección de la versión actual
La integración se prepara en la rama `integration/academia-progresiva`. La rama `main` y la publicación actual no deben modificarse hasta completar pruebas y revisión.

## Inventario validado del paquete recibido
- `src/App.tsx`, `src/main.tsx`, `src/Avatar.tsx`, `src/ProfilePanel.tsx`, `src/realtime.ts`, `src/types.ts`, `src/style.css`.
- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`.
- Modelo `public/models/axsofit-humanoid-rig.glb` (4,011,688 bytes).
- GLB 2.0 estructuralmente válido; malla con skinning y 20 articulaciones; clips `Caminar_Loop`, `Saludar`, `Celebrar_Salto`.

## Estado de este commit
Este commit establece el punto de integración y la decisión arquitectónica. No copia todavía el código del ZIP ni el binario GLB al repositorio. No representa un despliegue ni una integración terminada.

## Condiciones antes de publicar
1. Incorporar íntegramente el código fuente y el GLB original, sin reconstruir ni sustituir el rig.
2. Configurar `base` de Vite y rutas de activos para el alojamiento elegido.
3. Ejecutar `npm ci` y `npm run build`; corregir cualquier error TypeScript o de compilación.
4. Probar carga del avatar, skinning y los tres clips.
5. Configurar secretos de entorno de Supabase fuera del repositorio. Nunca subir claves privadas.
6. Probar Presence/Broadcast y documentar que el canal actual es público hasta que se apliquen políticas de autorización.
7. Abrir PR contra `main`; no fusionar hasta aprobación y pruebas.

## Reglas de producto
- Las métricas del atleta deben ser reales, fechadas y trazables.
- Los valores RPG de demostración deben identificarse como demostrativos y no mezclarse con mediciones.
- La XP no debe otorgarse desde lógica cliente como autoridad competitiva.
- La progresión de entrenamiento debe responder a evaluación, objetivo, disponibilidad, tolerancia y recuperación; subir de nivel no aumenta automáticamente la carga.
