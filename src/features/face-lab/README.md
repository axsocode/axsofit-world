# AXSOFIT FACE LAB

Interactive morph-target inspection tool integrated into the AXSOFIT WORLD experimental branch.

## Use
1. Open AXSOFIT WORLD on the experimental branch.
2. Select **FACE LAB** in the top bar.
3. Upload the FaceCap `.glb` model file from the Three.js face morph-target example.
4. Inspect the detected morph targets, search by name, move sliders, or apply heuristic expression presets.
5. If the GLB contains animation clips, use the animation button to play the first clip.

## Important asset note
The HTML example supplied for this feature references `models/gltf/facecap.glb`, but it does not include the binary model. This branch does not download or redistribute that asset. Upload the GLB locally through the file picker. A successful load with no morph targets will be reported separately from a load error.

## Technical behavior
- Uses Three.js `GLTFLoader` to load a user-selected GLB.
- Traverses all meshes and reads `morphTargetDictionary` and `morphTargetInfluences`.
- Creates a slider for each detected morph target.
- Provides heuristic presets based on morph target names; actual naming is asset-dependent.
- Uses `AnimationMixer` to play the first embedded animation clip.
- The selected file is held as a browser object URL and revoked when replaced or when the component unmounts.
- No model is uploaded to a server and no face/camera capture is performed.

## Boundaries
- Experimental tool only; it does not replace the player's GLB or the Companion avatar.
- It is opened as a modal over the existing game, preserving the current scene and multiplayer components.
- It does not use webcam tracking, Face Cap live capture, voice, or generative AI.
- Mobile visual performance and the exact FaceCap asset still require manual testing.
