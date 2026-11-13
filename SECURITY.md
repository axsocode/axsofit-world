# AXSOFIT WORLD — Seguridad y privacidad

## Estado conocido

La aplicación inicia sesión anónima con Firebase Auth y utiliza el UID para rutas de perfil. Las reglas activas de Firebase no han sido inspeccionadas en esta fase; por tanto, no se certifica todavía el aislamiento de datos.

## Requisitos

1. Denegar por defecto y permitir solo propietario autenticado para datos privados.
2. Validar tipos, tamaños, límites y fechas tanto en cliente como en backend.
3. Limitar frecuencia y tamaño de mensajes/posiciones del multiplayer.
4. No confiar en el cliente para XP, resultados competitivos, desbloqueos o rankings.
5. Mantener tokens y secretos fuera del repositorio y de logs.
6. Consentimiento granular, informado y revocable para cada proveedor externo.
7. Minimizar datos y definir retención, exportación y borrado.
8. No compartir medidas corporales, salud, HRV o sueño en rankings sin consentimiento específico.
9. Cifrado en tránsito y controles del proveedor para datos almacenados.
10. Registrar auditoría de cambios sensibles.

## RGPD

Aplicar privacidad desde el diseño, minimización, limitación de finalidad, control de acceso, transparencia y mecanismos para ejercer derechos. La base jurídica, periodos de conservación y roles de responsable/encargado deben definirse antes de abrir el servicio a usuarios.

## Pendiente de verificación

- Descargar y revisar reglas Realtime Database activas.
- Probar acceso cruzado entre dos UID.
- Revisar presencia/chat para abuso y spam.
- Definir proceso de exportación y borrado.
- Evaluación de impacto si el tratamiento de datos lo requiere.