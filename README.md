# AXSOFIT WORLD — The Fitness RPG Universe

AXSOFIT WORLD combina un mundo virtual 3D multijugador con seguimiento deportivo, entrenamiento y progresión RPG. Este repositorio contiene actualmente un prototipo web estático basado en Three.js y Firebase Realtime Database.

## Estado del proyecto

La aplicación funcional existente se encuentra en `index.html`. Incluye escenario 3D, salas, chat, presencia, acciones de avatar, perfil básico, mediciones corporales iniciales y registro manual de sesiones. Consulta [AUDIT_REPORT.md](AUDIT_REPORT.md) para el diagnóstico y sus límites.

La arquitectura y el plan de evolución están descritos en [ARCHITECTURE.md](ARCHITECTURE.md) y [ROADMAP.md](ROADMAP.md). La documentación distingue las funciones implementadas de las interfaces provisionales y las capacidades pendientes.

## Ejecutar el prototipo

La versión actual está publicada en GitHub Pages: https://axsocode.github.io/axsofit-world/

El prototipo importa Three.js y Firebase desde CDN. No se ha encontrado todavía un `package.json` ni un proceso de build local reproducible. Para desarrollo local, sirve el repositorio con un servidor HTTP estático; no abras `index.html` mediante `file://`, porque los módulos ES y las cargas de activos requieren HTTP/HTTPS.

## Avatar original

El cargador actual espera el archivo `AXSOFIT_WORLD_Prototipo_Multijugador.zip` en la raíz y busca dentro `AXSOFIT_WORLD/public/models/axsofit-humanoid-rig.glb`. No sustituyas el GLB original ni elimines su rigging o clips. La inspección binaria del archivo y la validación de animaciones siguen pendientes.

## Firebase

La aplicación usa Firebase Authentication anónima y Realtime Database. Las rutas observadas se documentan en [API_DOCUMENTATION.md](API_DOCUMENTATION.md). Antes de abrir el proyecto a usuarios, revisa las reglas, verifica el aislamiento entre UID y establece un flujo de vinculación de cuentas.

## Documentación

- [Auditoría técnica](AUDIT_REPORT.md)
- [Arquitectura](ARCHITECTURE.md)
- [Modelo de datos objetivo](DATABASE_SCHEMA.md)
- [Contratos y rutas actuales](API_DOCUMENTATION.md)
- [Motor RPG](RPG_ENGINE.md)
- [Periodización](TRAINING_PERIODIZATION.md)
- [Multijugador](MULTIPLAYER.md)
- [Integraciones deportivas](DEVICE_INTEGRATIONS.md)
- [Seguridad y privacidad](SECURITY.md)
- [Despliegue](DEPLOYMENT.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)

## Principios de desarrollo

- Preservar los activos y funciones existentes.
- No mostrar datos ficticios como mediciones reales.
- No declarar una integración conectada sin prueba real.
- No considerar una UI como funcional si no persiste y valida datos.
- No otorgar XP competitiva desde lógica cliente no confiable.
- No aumentar la carga deportiva automáticamente por subir de nivel.
