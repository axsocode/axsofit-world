# AXSOFIT AI COMPANION — MVP 0.1

## Identidad
- Nombre visible provisional: AXSOFIT COMPANION (nombre personalizado de producto, sin nombre humano adicional).
- Personalidad: companion; cercano, respetuoso, positivo y no juzgador.
- Canal: texto.
- Saludo: "¡Qué bueno verte por aquí! ¿Cómo te encuentras hoy?"

## Alcance implementado
- Widget HTML superpuesto a la escena, independiente del Canvas 3D.
- Burbuja plegable, conversación de texto y respuestas rápidas de estado de ánimo.
- Motor local de respuestas de demostración.
- Mensaje honesto cuando no existe una sesión programada.

## Límites actuales
Este MVP NO está conectado todavía a un modelo de lenguaje, autenticación, agenda real ni almacenamiento persistente. Las respuestas se generan mediante reglas locales. No afirmar que existe memoria persistente ni recordatorios push.
El contexto de entrenamiento está tipado para conectar más adelante con una fuente real y validada.

## Arquitectura objetivo
UI (CompanionBubble) -> hook (useCompanion) -> engine/context builder -> API backend segura -> proveedor LLM.
El backend debe validar identidad, autorización, límites y datos permitidos. Las claves privadas nunca deben exponerse en variables VITE ni en el bundle del navegador.
Persistencia futura: perfil/consentimiento, check-ins voluntarios y resúmenes mínimos de conversación; definir retención y borrado antes de habilitarla.

## Integridad
No modificar avatar, cámara, joystick, menú radial, ProfilePanel ni canal Supabase Realtime. La burbuja es DOM/CSS superpuesto a la escena.
