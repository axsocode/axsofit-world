import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AnimationAction, AnimationMixer, Box3, Group, LoopOnce, LoopRepeat, Object3D, Vector3 } from "three";
import { SkeletonUtils } from "three-stdlib";
import type { ClipName, PlayerState } from "./types";

const MODEL_URL = `${import.meta.env.BASE_URL}models/axsofit-humanoid-rig.glb`;

type Props = { state: PlayerState; local?: boolean; onLoaded?: (clips: string[]) => void };

function createUprightModel(model: Object3D) {
  // Detecta si el GLB fue exportado acostado (eje X o Z) y lo convierte
  // al sistema Y-up que utiliza Three.js. La corrección se aplica al
  // contenedor, no al esqueleto, para conservar las animaciones del rig.
  model.updateMatrixWorld(true);
  const sourceBounds = new Box3().setFromObject(model);
  const size = sourceBounds.getSize(new Vector3());
  const wrapper = new Group();

  if (size.x > size.y * 1.15 && size.x >= size.z) {
    wrapper.rotation.z = Math.PI / 2; // +X pasa a +Y
  } else if (size.z > size.y * 1.15 && size.z > size.x) {
    wrapper.rotation.x = -Math.PI / 2; // +Z pasa a +Y
  }

  wrapper.add(model);
  wrapper.updateMatrixWorld(true);
  const uprightBounds = new Box3().setFromObject(wrapper);
  wrapper.position.y -= uprightBounds.min.y;
  wrapper.updateMatrixWorld(true);
  return wrapper;
}

export function Avatar({ state, local = false, onLoaded }: Props) {
  const gltf = useGLTF(MODEL_URL);
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene) as Object3D, [gltf.scene]);
  const uprightModel = useMemo(() => createUprightModel(model), [model]);
  const mixer = useMemo(() => new AnimationMixer(model), [model]);
  const actions = useRef<Record<string, AnimationAction>>({});
  const current = useRef<string>("");
  const lastSeq = useRef("");
  const lastClip = useRef<ClipName>("Idle");

  useEffect(() => {
    const map: Record<string, AnimationAction> = {};
    gltf.animations.forEach(clip => { map[clip.name] = mixer.clipAction(clip); });
    actions.current = map;
    onLoaded?.(gltf.animations.map(a => a.name));
    return () => { mixer.stopAllAction(); };
  }, [gltf.animations, mixer, onLoaded]);

  useEffect(() => {
    const requested = state.clip === "Idle" ? "" : state.clip;
    if (!requested || !actions.current[requested]) {
      Object.values(actions.current).forEach(a => a.fadeOut(.18));
      current.current = "";
      lastClip.current = "Idle";
      return;
    }
    const oneShot = requested !== "Caminar_Loop";
    const changed = requested !== current.current || state.sequenceId !== lastSeq.current;
    if (!changed) return;
    const next = actions.current[requested];
    const prev = actions.current[current.current];
    if (prev && prev !== next) prev.fadeOut(.18);
    next.reset().fadeIn(.18).setEffectiveTimeScale(state.playbackRate);
    next.setLoop(oneShot ? LoopOnce : LoopRepeat, oneShot ? 1 : Infinity);
    next.clampWhenFinished = oneShot;
    if (!local && state.startServerTime) {
      const elapsed = Math.max(0, (Date.now() - state.startServerTime) / 1000);
      next.time = elapsed % Math.max(next.getClip().duration, .001);
    }
    next.play();
    current.current = requested;
    lastSeq.current = state.sequenceId;
    lastClip.current = state.clip;
  }, [state.clip, state.sequenceId, state.startServerTime, state.playbackRate, local]);

  useFrame((_, delta) => mixer.update(Math.min(delta, .05)));
  return <group position={state.position} rotation={[0, state.rotation, 0]}>
    <primitive object={uprightModel} />
    {!local && <mesh position={[0, 1.88, 0]}><sphereGeometry args={[.035, 12, 12]}/><meshBasicMaterial color="#e11d2e"/></mesh>}
  </group>;
}
useGLTF.preload(MODEL_URL);
