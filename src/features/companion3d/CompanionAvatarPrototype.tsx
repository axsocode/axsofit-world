import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { CompanionAction, CompanionAvatarProps } from "./types";

/**
 * Lightweight placeholder to validate proportions, palette and expression states.
 * The production character should replace these primitives with a rigged GLB.
 * This component is intentionally not mounted in App.tsx yet.
 */
export function CompanionAvatarPrototype({
  expression = "happy",
  action = "idle",
  scale = 1,
}: CompanionAvatarProps) {
  const root = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const leftEye = useRef<Mesh>(null);
  const rightEye = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (root.current) {
      root.current.position.y = Math.sin(t * 2) * 0.025;
      root.current.rotation.y = Math.sin(t * 0.45) * 0.08;
    }
    if (torso.current) {
      const breath = 1 + Math.sin(t * 2.1) * 0.012;
      torso.current.scale.y = breath;
    }
    // A brief, soft blink. Expression remains deterministic and local.
    const blink = Math.max(0, 1 - Math.abs((t % 4.7) - 0.08) / 0.08);
    const eyeY = Math.max(0.12, 1 - blink * 0.88);
    if (leftEye.current) leftEye.current.scale.y += (eyeY - leftEye.current.scale.y) * Math.min(1, delta * 18);
    if (rightEye.current) rightEye.current.scale.y += (eyeY - rightEye.current.scale.y) * Math.min(1, delta * 18);
  });

  const smile = expression === "happy" || expression === "celebrating" || expression === "empathetic";
  const browTilt = expression === "focused" ? -0.22 : expression === "curious" ? 0.16 : 0;
  const mouthScale = expression === "surprised" ? 0.72 : smile ? 1 : 0.82;
  const mouthY = expression === "surprised" ? 0.02 : -0.12;
  const armRaise = action === "greet" || action === "celebrate" ? 0.38 : 0;

  return (
    <group ref={root} scale={scale} position={[0, 0, 0]}>
      {/* Head: intentionally oversized cartoon proportions */}
      <group position={[0, 1.48, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color="#d99a70" roughness={0.78} />
        </mesh>
        {/* Hair cap and swept fringe */}
        <mesh position={[0, 0.43, -0.03]} scale={[1.02, 0.52, 0.95]} castShadow>
          <sphereGeometry args={[0.53, 24, 20]} />
          <meshStandardMaterial color="#30201c" roughness={0.88} />
        </mesh>
        <mesh position={[0.12, 0.49, 0.34]} rotation={[0.2, 0, -0.24]} scale={[0.58, 0.2, 0.25]} castShadow>
          <sphereGeometry args={[0.48, 20, 16]} />
          <meshStandardMaterial color="#38231e" roughness={0.85} />
        </mesh>
        {/* Eyes */}
        <mesh ref={leftEye} position={[-0.22, 0.08, 0.53]} scale={[1, 1, 0.55]}>
          <sphereGeometry args={[0.105, 20, 20]} />
          <meshStandardMaterial color="#fffaf2" />
        </mesh>
        <mesh ref={rightEye} position={[0.22, 0.08, 0.53]} scale={[1, 1, 0.55]}>
          <sphereGeometry args={[0.105, 20, 20]} />
          <meshStandardMaterial color="#fffaf2" />
        </mesh>
        <mesh position={[-0.22, 0.08, 0.59]}>
          <sphereGeometry args={[0.052, 16, 16]} />
          <meshStandardMaterial color="#40271e" />
        </mesh>
        <mesh position={[0.22, 0.08, 0.59]}>
          <sphereGeometry args={[0.052, 16, 16]} />
          <meshStandardMaterial color="#40271e" />
        </mesh>
        {/* Eyebrows */}
        <mesh position={[-0.22, 0.25, 0.55]} rotation={[0, 0, browTilt]} scale={[0.19, 0.045, 0.045]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#30201c" />
        </mesh>
        <mesh position={[0.22, 0.25, 0.55]} rotation={[0, 0, -browTilt]} scale={[0.19, 0.045, 0.045]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#30201c" />
        </mesh>
        {/* Nose and expression mouth */}
        <mesh position={[0, -0.04, 0.59]} scale={[0.07, 0.09, 0.07]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#c9825e" />
        </mesh>
        <mesh position={[0, mouthY, 0.55]} scale={[0.12 * mouthScale, expression === "surprised" ? 0.13 : 0.035, 0.025]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#54251f" />
        </mesh>
        {/* Ears */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.6, -0.02, 0]} scale={[0.16, 0.2, 0.12]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#d99a70" />
          </mesh>
        ))}
      </group>

      {/* Compact athletic body */}
      <group ref={torso} position={[0, 0.77, 0]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.34, 0.48, 8, 16]} />
          <meshStandardMaterial color="#17191e" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.02, 0.31]} scale={[0.28, 0.37, 0.045]}>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color="#d71920" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.13, 0.35]} scale={[0.12, 0.08, 0.035]}>
          <sphereGeometry args={[1, 16, 12]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
      </group>

      {/* Arms and gloves */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.43, 0.91, 0]} rotation={[0, 0, side * (0.18 + armRaise)]}>
          <mesh position={[side * 0.08, -0.2, 0]} rotation={[0, 0, side * -0.12]} castShadow>
            <capsuleGeometry args={[0.105, 0.34, 6, 12]} />
            <meshStandardMaterial color="#d99a70" roughness={0.78} />
          </mesh>
          <mesh position={[side * 0.1, -0.43, 0.02]} scale={[0.12, 0.13, 0.11]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#d99a70" />
          </mesh>
        </group>
      ))}

      {/* Shorts and legs */}
      <mesh position={[0, 0.34, 0]} scale={[0.35, 0.2, 0.28]} castShadow>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#20232a" />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.17, 0.04, 0]}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.105, 0.32, 6, 12]} />
            <meshStandardMaterial color="#d99a70" roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.43, 0.08]} scale={[0.16, 0.09, 0.25]} castShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#17191e" />
          </mesh>
          <mesh position={[0, -0.4, 0.22]} scale={[0.11, 0.025, 0.035]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color="#d71920" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
