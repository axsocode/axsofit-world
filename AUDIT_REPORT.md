# AXSOFIT WORLD — Auditoría técnica inicial

**Fecha:** 2026-11-13  
**Repositorio:** https://github.com/axsocode/axsofit-world  
**Rama:** main

## 1. Inventario verificado

- Repositorio público y accesible; rama principal main.
- Punto de entrada: `index.html` (aprox. 58 KB en la revisión).
- En la raíz se encuentran documentos Markdown, `index.html`, `AXSOFIT_WORLD_Prototipo_Multijugador.zip` (1,716,574 bytes) y carpeta `assets/assets`.
- En `assets/assets` está `AXSOFIT_Mesomorfo_172cm.obj` (4,140,239 bytes). Un OBJ no contiene por sí solo rigging/esqueleto ni clips de animación.
- No se encontró `package.json`, `firebase.json`, reglas de Realtime Database, ni carpeta `.github` en la raíz consultada.
- No se encontró el GLB como archivo independiente en la ruta de modelos consultada; el ZIP está presente y el código intenta extraer el GLB desde él.

## 2. Arquitectura y dependencias observadas en index.html

- Aplicación monolítica HTML/CSS/JavaScript ES Module.
- Three.js 0.180.0 mediante import map y CDN.
- GLTFLoader y SkeletonUtils desde los módulos de ejemplos de Three.js.
- JSZip 3.10.1 para abrir el ZIP del prototipo en el navegador.
- Firebase 11.10.0: App, Authentication y Realtime Database cargados dinámicamente desde CDN.
- No hay framework React ni TypeScript configurado.
- No hay gestor de paquetes, scripts de build, lint o pruebas configurados.

## 3. Carga del avatar original

El código solicita `./AXSOFIT_WORLD_Prototipo_Multijugador.zip`, busca dentro la ruta `AXSOFIT_WORLD/public/models/axsofit-humanoid-rig.glb`, la carga con GLTFLoader y clona el modelo con SkeletonUtils.

El código comprueba si los clips esperados existen:
- `Caminar_Loop`
- `Saludar`
- `Celebrar_Salto`

Si la carga falla, el código usa un avatar geométrico provisional.

**Pendiente crítico:** aunque el ZIP está presente y el cargador apunta a una ruta interna concreta, no se ha podido leer el binario del ZIP mediante la inspección disponible. Por tanto, no se puede certificar todavía que el GLB esté dentro, ni validar su esqueleto, skinning, huesos o clips. No sustituir el activo ni eliminar el fallback antes de verificar el archivo real.

## 4. Funciones verificadas por lectura del código

| Área | Estado |
|---|---|
| Escenario Three.js, cámara y controles | Implementación en index.html |
| Movimiento local y animaciones | Implementación en index.html |
| Clonado de avatar riggeado | SkeletonUtils está integrado; activo pendiente de validación binaria |
| Salas AXSO_GYM, AXSO_ARENA, AXSO_STUDIO, AXSO_SOCIAL | Implementación Firebase |
| Presencia/posición/acciones | Realtime Database |
| Chat compartido | Realtime Database |
| Autenticación | signInAnonymously |
| Perfil e identidad | Implementación básica |
| Métricas corporales | Snapshot en profiles/{uid}/bodyMetrics |
| IMC y TMB | Cálculos locales; TMB Mifflin–St Jeor |
| Sesiones generales | Guardado en profiles/{uid}/trainings y XP calculada en cliente |
| Fuerza/RM | Formulario visual; no se encontraron listeners de guardado para saveStrengthEntry |
| Rutina de fuerza | Formulario visual; no se encontró listener de guardado |
| Resistencia | Formulario visual; no se encontró listener de guardado |
| AXCIRCUIT | Formulario visual; no se encontró listener de guardado |
| Pentagrama | SVG estático; etiquetas indican “Por medir” |
| Academia, misiones, logros | No implementados/verificados como módulos funcionales |
| Polar, Myzone, InBody, Health Connect | Sin integración implementada/verificada |

## 5. Firebase y seguridad

- Proyecto configurado en cliente: `axsofit-world`.
- Base de datos: instancia Realtime Database en región europe-west1.
- El código autentica anónimamente y guarda datos bajo `profiles/{uid}`.
- Las salas usan `rooms/{roomId}/players` y `rooms/{roomId}/messages`.
- La configuración cliente de Firebase está en el HTML. La API key web de Firebase no debe tratarse como secreto de servidor; la seguridad depende de Authentication, reglas y restricciones del proyecto.
- **No se han inspeccionado las reglas activas de Realtime Database.** No se certifica el aislamiento entre usuarios ni la protección contra escrituras arbitrarias.
- XP y estadísticas se calculan/actualizan desde el cliente; no es un sistema competitivo resistente a manipulación.

## 6. Riesgos y deuda técnica

1. Presentación, dominio, acceso a Firebase y motor 3D concentrados en un único archivo.
2. Dependencias CDN sin lockfile ni build reproducible.
3. No hay pruebas automatizadas ni CI observadas.
4. Autenticación anónima sin flujo de cuenta permanente/vinculación verificado.
5. Las escrituras de XP son client-side y no forman un ledger auditable.
6. Las métricas corporales son un snapshot, sin historial de mediciones verificado.
7. Fuerza, resistencia y AXCIRCUIT contienen formularios, pero no listeners de persistencia en el código inspeccionado.
8. Los rankings/resultados futuros requieren validación de servidor.
9. Pentagrama es ilustrativo, no un resultado deportivo calculado.
10. Las reglas de Firebase son el principal bloqueo para auditar seguridad.

## 7. Acciones de Fase 1

- [x] Inventariar los archivos raíz y activos visibles.
- [x] Revisar el punto de entrada y sus dependencias.
- [x] Localizar el mecanismo de carga del GLB y clonación.
- [x] Distinguir funcionalidades conectadas de interfaces provisionales.
- [x] Documentar arquitectura objetivo, datos, seguridad y roadmap.
- [ ] Validar el contenido del ZIP y el GLB original.
- [ ] Revisar reglas activas de Firebase y probar aislamiento por UID.
- [ ] Preparar toolchain reproducible y pruebas sin romper GitHub Pages.
- [ ] Ejecutar pruebas en navegador real y móvil.

## 8. Criterio de honestidad técnica

“Implementado” significa conectado a persistencia/servicio real y probado. “Interfaz” significa presentación sin persistencia demostrada. “Pendiente” significa no demostrado. No se declarará conectada ninguna integración externa sin documentación oficial, permisos válidos y prueba de extremo a extremo.
