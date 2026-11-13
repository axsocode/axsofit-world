# AXSOFIT WORLD — Integraciones deportivas

## Arquitectura

Cada proveedor tendrá un adaptador aislado con autorización, sincronización, normalización, procedencia, fecha de importación y gestión de errores. Registro manual permanece disponible.

## Polar

Pendiente de verificar qué API/SDK y permisos están disponibles para el dispositivo y flujo concreto. No se declara conexión Polar activa.

## Myzone

Pendiente de confirmar API oficial, permisos de cuenta y campos exportables. No se declara conexión Myzone activa.

## InBody

La importación deberá conservar el informe original, fecha, unidad, método y valores segmentales disponibles. No se declara conexión directa activa.

## Google Health Connect

La integración Android requerirá módulo Android, permisos runtime y tipos de datos autorizados. El repositorio web actual no proporciona por sí solo acceso a Health Connect.

## Requisitos comunes

- Consentimiento explícito y revocable.
- Almacenamiento seguro de tokens.
- No inventar endpoints ni credenciales.
- Trazabilidad de fuente y fecha.
- Deduplicación e idempotencia de importaciones.
- Gestión de errores y opción de desconectar proveedor.