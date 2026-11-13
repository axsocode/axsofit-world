# AXSOFIT WORLD — Multijugador

## Estado del prototipo

Firebase Realtime Database sincroniza presencia/posiciones, acciones y mensajes por sala. Se han definido cuatro salas. Las acciones SALUDAR y CELEBRAR se transmiten mediante campos de acción y marcas temporales.

## Avatar

La carga del modelo intenta extraer axsofit-humanoid-rig.glb del ZIP de prototipo y utiliza GLTFLoader/SkeletonUtils. Se debe conservar el GLB original y probar sus clips Caminar_Loop, Saludar y Celebrar_Salto antes de cualquier refactor.

## Próximas mejoras

- Interpolación y reconciliación de posición remota.
- Control de frecuencia de publicación y validación de rangos.
- Limpieza fiable de presencia y desconexión.
- Estado inicial, secuencia temporal y tolerancia a paquetes perdidos.
- Validación del servidor para resultados de retos.
- Pruebas de concurrencia con múltiples UID.