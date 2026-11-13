import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat, Object3D } from "three";
import { SkeletonUtils } from "three-stdlib";
import type { ClipName, PlayerState } from "./types";

type Props = { state: PlayerState; local?: boolean; onLoaded?: (clips: string[]) => void };
export function Avatar({ state, local = false, onLoaded }: Props) {
  const gltf = useGLTF("/models/axsofit-humanoid-rig.glb");
  const model = useMemo(() => SkeletonUtils.clone(gltf.scene) as Object3D, [gltf.scene]);
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
  return <group position={state.position} rotation={[0, state.rotation, 0]} scale={1}>
    <primitive object={model} />
    {!local && <mesh position={[0, 1.88, 0]}><sphereGeometry args={[.035, 12, 12]}/><meshBasicMaterial color="#e11d2e"/></mesh>}
  </group>;
}
useGLTF.preload("/models/axsofit-humanoid-rig.glb");