# AXSOFIT WORLD — Despliegue

## Despliegue conocido

El proyecto se publica actualmente como sitio estático en GitHub Pages. La URL conocida del prototipo es https://axsocode.github.io/axsofit-world/.

## Configuración

El HTML contiene configuración cliente de Firebase; las claves de configuración web de Firebase no son equivalentes a secretos de servidor, pero las reglas de base de datos deben proteger todos los datos. No añadir service-account keys ni tokens privados al repositorio.

## Build reproducible

No se encontró package.json ni configuración de build en la raíz inspeccionada. No hay un comando npm build que pueda ejecutarse todavía. La incorporación de toolchain se hará en una fase separada para no romper GitHub Pages.

## Lista previa a producción

- Reglas Firebase auditadas y probadas.
- Autenticación permanente y recuperación de cuenta.
- CSP y dependencias fijadas/versionadas.
- Pruebas automatizadas y CI.
- Consentimiento, exportación y borrado RGPD.
- Observabilidad sin registrar datos deportivos sensibles.
- Prueba de carga multiplayer y seguridad.