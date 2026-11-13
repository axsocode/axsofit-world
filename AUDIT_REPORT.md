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


## 9. Auditoría del paquete adicional recibido (2026-11-13)

Se recibió y abrió el archivo `AXSOFIT_WORLD_Academia_Progresiva.zip` (1,732,219 bytes). Es un proyecto React/TypeScript/Vite independiente, no una actualización automática del `index.html` que está publicado actualmente.

### Estructura y dependencias

- `src/App.tsx`, `src/Avatar.tsx`, `src/ProfilePanel.tsx`, `src/realtime.ts`, `src/types.ts`, `src/style.css`.
- React 18.3.1, TypeScript 5.7.3, Vite 6.0.7.
- Three.js 0.170.0, React Three Fiber 8.17.10, Drei 9.122.0.
- Supabase JS 2.49.1.
- Script de build: `tsc -b && vite build`.
- `.env.example` define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; no contiene credenciales reales.

### GLB inspeccionado directamente

El archivo `public/models/axsofit-humanoid-rig.glb` existe y se pudo leer su estructura GLB 2.0. Tamaño: 4,011,688 bytes. Contiene una malla, un skin con 20 joints, atributos `JOINTS_0` y `WEIGHTS_0`, y estas tres animaciones exactas:

- `Caminar_Loop` (9 canales)
- `Saludar` (3 canales)
- `Celebrar_Salto` (7 canales)

El esqueleto declara Root, Pelvis, Spine, Chest, Neck, Head, hombros, brazos, antebrazos, manos, muslos, espinillas y pies. Esto verifica estructura de skinning y clips en el GLB; no sustituye una inspección visual de deformaciones en ejecución.

El componente `Avatar.tsx` carga el modelo con `useGLTF`, clona con `SkeletonUtils.clone` de `three-stdlib` y crea un AnimationMixer. La lógica reconoce los nombres de los tres clips.

### Funciones y límites del paquete

- La app React monta una escena R3F y perfil con pestañas.
- Supabase Realtime usa un canal `axsofit-world-room-01` con Presence y Broadcast, pero solo conecta si existen las variables de entorno.
- No se proporcionaron credenciales ni proyecto Supabase configurado; no se verificó conexión real.
- El README declara expresamente valores demo y persistencia pendiente.
- El código muestra valores hardcodeados de composición corporal, RM, cardio, actividad y atributos RPG.
- Las misiones se marcan completadas mediante estado local de React; no se encontró persistencia backend de esas acciones.
- Botones de mediciones, rutinas y sesiones muestran alertas de “siguiente fase”, no guardan registros.
- El componente de perfil muestra nivel 12, 2,450/3,000 XP y otras cifras de demostración.

### Relación con el repositorio publicado

El repositorio GitHub auditado mantiene su aplicación actual basada en HTML/JavaScript, Three.js 0.180.0 y Firebase Realtime Database. El ZIP recibido contiene una segunda implementación React/Vite/TypeScript, Three.js 0.170.0 y un adaptador Supabase. No son el mismo árbol de código ni usan el mismo backend. No se deben mezclar ni desplegar uno sobre otro sin una decisión explícita de arquitectura y un plan de migración.

### Prueba de build

Se intentó ejecutar `npm install --no-audit --no-fund` con Node 22.16.0 y npm 10.9.2 en el entorno de auditoría, pero la instalación agotó el tiempo disponible antes de crear `node_modules`. Por ello no se ejecutó `npm run build` y no se afirma que el build compile.

### Decisiones pendientes para cerrar Fase 1

1. Confirmar si el ZIP React/Vite es la nueva base deseada o un prototipo paralelo.
2. Elegir backend único: mantener Firebase o migrar deliberadamente a Supabase.
3. Inspeccionar las reglas activas de Firebase desde la consola; no están incluidas en el ZIP.
4. Ejecutar el proyecto en navegador con dependencias instaladas para validar deformación, orientación, escalado y reproducción de los clips.
5. No migrar ni borrar la app publicada hasta tener paridad funcional y pruebas de regresión.
