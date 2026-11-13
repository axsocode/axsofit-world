# AXSOFIT WORLD — Academia Progresiva

La aplicación React/TypeScript de Academia Progresiva se recibió en el archivo `AXSOFIT_WORLD_Academia_Progresiva.zip`.

**Estado:** paquete inspeccionado; integración con la rama de producción aún pendiente. Consulta [INTEGRATION_STATUS.md](../INTEGRATION_STATUS.md) para el estado real y los criterios de aceptación.

## Arquitectura objetivo
- React 18 + TypeScript + Vite
- Three.js + React Three Fiber
- Supabase Realtime para presencia y broadcast
- GLB original con skinning y animaciones

## Configuración local prevista
Requiere Node.js 20 o superior. Una vez incorporado el código fuente completo:
1. Copiar `.env.example` a `.env`.
2. Definir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Ejecutar `npm ci`.
4. Ejecutar `npm run dev`.

No añadas secretos al repositorio. La clave anon/public de Supabase no sustituye las políticas de autorización y seguridad.
