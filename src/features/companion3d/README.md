# AXSOFIT COMPANION — 3D Avatar Prototype

## Approved art direction
- New character; do not reuse or overwrite the existing humanoid player avatar.
- Friendly stylized animated-film look (Pixar-like direction, without copying a specific character).
- Cartoon proportions: oversized expressive head, compact athletic body, readable silhouette.
- AXSOFIT palette: charcoal/black, red accents, warm skin tones.
- Companion personality: warm, respectful, positive and non-judgmental.

## Prototype status
`CompanionAvatarPrototype.tsx` is an isolated procedural Three.js/R3F blockout. It validates proportions, colors, basic facial states, idle breathing, blinking and a small greeting/celebration arm pose. It is intentionally not imported by `App.tsx`, not mounted in the live scene and not a production-quality character asset.

## Target production asset
Create the final character in Blender and export a GLB (glTF 2.0):
- One optimized skinned mesh, preferably under 30k triangles for the first mobile target.
- Separate material slots for skin, hair, clothing, shoes and details.
- Humanoid body rig compatible with Three.js animation mixer.
- Facial shape keys / morph targets: blinkLeft, blinkRight, smile, frown, browUp, browDown, mouthOpen, mouthWide, cheekRaise.
- Animation clips: Idle_Breathing, Blink, Greet, Explain, Motivate, Listen, Celebrate, Think.
- Consistent forward axis and feet at ground origin; apply transforms before export.
- Keep the GLB self-contained and test it on Android Chrome before replacing any live player model.

## Runtime architecture
1. **Asset layer** — `public/models/companion/axsofit-companion.glb`; loaded lazily with `useGLTF`.
2. **Avatar renderer** — R3F component owns model clone, AnimationMixer and morph-target controls.
3. **Expression controller** — maps typed `CompanionExpression` states to facial morph weights; blends transitions instead of snapping.
4. **Action controller** — maps typed `CompanionAction` states to animation clips; supports interruption and return to idle.
5. **Companion state** — receives mood, conversation and training context from the existing companion feature; no duplicate source of truth.
6. **UI layer** — chat bubble and controls remain DOM/CSS overlays, outside the WebGL Canvas.
7. **Integration boundary** — mount only after a separate review and explicit approval. Preserve player controls, camera, radial menu, ProfilePanel and Supabase Realtime.

## Expression map
- happy: smile + cheekRaise + soft brow
- curious: browUp + slight head tilt
- focused: browDown + mouth neutral
- empathetic: soft brow + slight frown + listening pose
- celebrating: wide smile + celebrate clip
- surprised: browUp + mouthOpen

## Performance and accessibility
- Target 30–60 FPS on mid-range Android; use one material atlas where practical.
- Limit real-time shadows, use compressed textures (KTX2) only after build support is added.
- Respect reduced-motion preferences; provide a static/idle fallback.
- Keep chat text accessible in DOM; do not put essential text inside the 3D canvas.

## Privacy and AI boundary
The 3D avatar only renders state supplied by the app. It does not itself infer mood, access sensors, or provide generative AI. Connect it to the companion engine/backend through typed events; never ship model API secrets in the browser.

## Acceptance checklist
- [ ] GLB loads without console errors.
- [ ] All facial morph targets blend smoothly.
- [ ] Idle and action clips transition without foot sliding.
- [ ] Avatar scale, facing and ground alignment match the game world.
- [ ] Mobile touch controls remain unobstructed.
- [ ] Android Chrome performance checked on a real device.
- [ ] No changes to existing avatar or multiplayer code until approved.
