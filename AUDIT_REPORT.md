# AXSOFIT WORLD — Auditoría técnica inicial

Fecha: 2026-11-13. Repositorio: axsocode/axsofit-world. Rama: main.

## Estado observado

- Repositorio público y accesible; rama principal main.
- La aplicación se concentra en index.html, con HTML/CSS y JavaScript como módulo ES.
- Three.js 0.180.0 se importa mediante import map desde CDN.
- GLTFLoader y SkeletonUtils se importan desde módulos de ejemplos de Three.js.
- Firebase 11.10.0 se importa dinámicamente: Authentication y Realtime Database.
- El inicio de sesión actual es anónimo y el UID separa los perfiles.
- Presencia, posiciones, acciones y chat usan Realtime Database.
- Existen cuatro salas: AXSO_GYM, AXSO_ARENA, AXSO_STUDIO y AXSO_SOCIAL.
- El perfil incluye identidad, métricas corporales básicas y registro general de entrenamientos.
- Las pestañas son una primera versión dinámica del DOM; no es todavía una arquitectura React/TypeScript modular.

## Avatar y activos

El código intenta descargar AXSOFIT_WORLD_Prototipo_Multijugador.zip, localizar AXSOFIT_WORLD/public/models/axsofit-humanoid-rig.glb y cargarlo con GLTFLoader. También importa SkeletonUtils para clonar el rig.

Clips requeridos: Caminar_Loop, Saludar y Celebrar_Salto.

Limitación: el código confirma la ruta y el mecanismo de carga, pero esta inspección no ha permitido examinar el contenido binario interno del ZIP ni verificar directamente esqueleto, skinning, jerarquía de huesos o nombres reales de clips. El código comprueba los nombres esperados y dispone de fallback visual. El activo no se declara validado todavía.

## Funciones observadas

| Área | Estado |
|---|---|
| Escenario 3D y controles | Implementación existente |
| Salas, presencia y acciones | Firebase existente |
| Chat compartido | Firebase existente |
| Perfil e identidad | Implementación básica |
| Métricas corporales | Formulario y snapshot en Firebase |
| IMC y TMB | Cálculos locales; TMB Mifflin–St Jeor |
| Registro general de sesiones | Guardado en Firebase y XP básica |
| Historial | Últimas cinco sesiones |
| Fuerza/RM | Interfaz inicial; persistencia no verificada |
| Resistencia | Interfaz inicial; persistencia no verificada |
| AXCIRCUIT | Interfaz inicial; persistencia no verificada |
| Pentagrama | Visual provisional; no es una puntuación calculada |
| Academia, misiones y logros | No verificados como sistemas funcionales |
| Polar/Myzone/InBody/Health Connect | No implementados/verificados |

## Riesgos y deuda técnica

1. Aplicación monolítica: UI, lógica, Firebase y motor 3D están concentrados en un HTML.
2. No se encontraron README.md, package.json, firebase.json, reglas versionadas ni documentación de arquitectura en las rutas raíz consultadas.
3. Dependencias desde CDN; no hay instalación reproducible, build, linter o tests configurados en el repositorio inspeccionado.
4. Autenticación anónima; registro convencional y vinculación de identidad no verificados.
5. XP se actualiza desde el cliente; no hay evidencia de libro mayor transaccional protegido.
6. Métricas corporales se guardan como snapshot; no se verificó historial, método ni procedencia por dato.
7. No hay esquema relacional ni migraciones observadas.
8. Resultados competitivos requieren validación confiable del lado servidor.
9. Pentagrama debe seguir como pendiente hasta disponer de pruebas reales.
10. No se verificaron pruebas automatizadas ni pipeline CI.

## Acciones inmediatas

- Congelar y documentar el comportamiento actual antes de extraer módulos.
- Verificar el ZIP y el GLB real, sus animaciones y su procedencia.
- Versionar reglas Firebase y probar acceso por UID.
- Añadir estructura y pruebas reproducibles sin sustituir el runtime actual de golpe.
- Migrar por módulos manteniendo operativo el mundo 3D.

## Criterio de honestidad técnica

Implementado significa código conectado a persistencia/servicio real y probado. Interfaz significa solo presentación. Pendiente significa no demostrado. Ninguna integración externa se considerará conectada sin documentación oficial, permisos válidos y prueba de extremo a extremo.
