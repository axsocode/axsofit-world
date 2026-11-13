# AXSOFIT WORLD — Contratos de API y datos

## Estado actual

El prototipo es una aplicación cliente que accede directamente a Firebase Realtime Database. No se encontró una API HTTP propia ni contratos versionados.

## Rutas Firebase observadas en el código

- profiles/{uid}: identidad, stats y bodyMetrics.
- profiles/{uid}/trainings: registros manuales de sesión.
- rooms/{roomId}/players/{uid}: presencia, posición y acción.
- rooms/{roomId}/messages: mensajes de sala.

Estas rutas describen el código cliente inspeccionado; el acceso efectivo depende de reglas Firebase que aún deben auditarse.

## Contratos futuros

Los casos de uso deberán versionarse y validar entradas en backend para XP, misiones, récords competitivos y rankings. Cada operación de escritura devolverá identificador, fecha y estado persistido; la UI no mostrará éxito antes de confirmar el servidor.