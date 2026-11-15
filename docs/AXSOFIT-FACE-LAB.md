# AXSOFIT FACE LAB — Technical brief

## Goal
Integrate a standalone facial morph-target workbench into AXSOFIT WORLD without changing the current player avatar, player controls, camera, radial menu, companion chat, or Supabase multiplayer behavior.

## Source basis
The supplied Three.js example loads `models/gltf/facecap.glb`, selects the first scene child, reads `mesh_2`, enumerates `morphTargetDictionary`, controls `morphTargetInfluences`, and optionally plays the first embedded animation with `AnimationMixer`.

## Implementation in this branch
- New module: `src/features/face-lab/FaceLab.tsx`.
- Entry point: FACE LAB button in the app top bar.
- Presentation: modal overlay; game scene remains mounted underneath.
- Asset input: local GLB file picker, because the supplied HTML is a loader example and does not contain the GLB binary.
- Detection: traverses all meshes instead of assuming the morph mesh is always named `mesh_2`.
- Controls: per-morph slider, search, percentage display and heuristic presets for neutral, happy, surprised, blink, focused and empathetic.
- Animation: plays the first embedded clip when requested.
- No webcam or live Face Cap capture is implemented.

## Safety / project boundaries
- No changes to `src/Avatar.tsx` or the existing player model.
- No new dependencies.
- No changes to Supabase, multiplayer, joystick or camera behavior.
- `main` is not modified. Changes are isolated in `feature/axsofit-face-lab`.

## Known limitations
- Preset mapping is heuristic and depends on the morph target names in the actual GLB.
- The exact FaceCap GLB must be supplied by the user; it is not embedded in the HTML sample.
- The preview currently relies on the model's authored origin, orientation and scale.
- The first embedded animation is played as a single clip; no clip selector or facial capture pipeline yet.
- CI build does not validate visual rendering or mobile GPU performance.
