import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AnimationMixer, Group, Mesh, Object3D } from "three";
import type { AnimationClip } from "three";
import type { ChangeEvent } from "react";

type MorphControl = { id: string; meshName: string; name: string; value: number; mesh: Mesh; index: number };

function collectMorphs(root: Object3D): MorphControl[] {
  const result: MorphControl[] = [];
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
    Object.entries(mesh.morphTargetDictionary).forEach(([name, index]) => {
      result.push({ id: mesh.uuid + ":" + index, meshName: mesh.name || "Mesh facial", name, value: mesh.morphTargetInfluences?.[index] ?? 0, mesh, index });
    });
  });
  return result;
}

function FaceScene({ model, controls, clips, playing }: { model: Object3D; controls: MorphControl[]; clips: AnimationClip[]; playing: boolean }) {
  const mixer = useMemo(() => new AnimationMixer(model), [model]);
  const group = useRef<Group>(null);
  useEffect(() => {
    if (!playing || !clips.length) return;
    const action = mixer.clipAction(clips[0]);
    action.reset().play();
    return () => { mixer.stopAllAction(); };
  }, [clips, mixer, playing]);
  useEffect(() => {
    controls.forEach((control) => {
      const influences = control.mesh.morphTargetInfluences;
      if (influences) influences[control.index] = control.value;
    });
  }, [controls]);
  useFrame((_, delta) => {
    mixer.update(Math.min(delta, 0.05));
    if (group.current) group.current.rotation.y = Math.sin(performance.now() * 0.00025) * 0.12;
  });
  return <group ref={group}><primitive object={model} /></group>;
}

const presets: Record<string, (name: string) => number> = {
  neutral: () => 0,
  happy: (n) => /smile|happy|mouthsmile|cheekraise|joy/i.test(n) ? 0.85 : 0,
  surprised: (n) => /surprise|mouthopen|jawopen|browinnerup|eyebrow.*up/i.test(n) ? 0.9 : 0,
  blink: (n) => /blink|eyeclose|eyelidclose/i.test(n) ? 1 : 0,
  focused: (n) => /browdown|angry|squint|frown/i.test(n) ? 0.65 : 0,
  empathetic: (n) => /frown|browinnerup|sad/i.test(n) ? 0.45 : 0,
};

export function FaceLab({ onClose }: { onClose: () => void }) {
  const [model, setModel] = useState<Object3D | null>(null);
  const [clips, setClips] = useState<AnimationClip[]>([]);
  const [morphs, setMorphs] = useState<MorphControl[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [filter, setFilter] = useState("");
  const objectUrl = useRef<string | null>(null);

  useEffect(() => () => { if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  const loadFile = (file: File) => {
    if (!/\.glb$/i.test(file.name)) {
      setError("Selecciona un archivo .glb. Este laboratorio usa el modelo FaceCap en formato GLB.");
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setLoading(true); setError(""); setModel(null); setMorphs([]); setClips([]);
    new GLTFLoader().load(url, (gltf) => {
      const scene = gltf.scene;
      scene.updateMatrixWorld(true);
      const found = collectMorphs(scene);
      setModel(scene); setClips(gltf.animations); setMorphs(found); setFileName(file.name);
      setLoading(false);
      if (!found.length) setError("El GLB se cargó, pero no contiene morph targets faciales detectables.");
    }, undefined, () => { setLoading(false); setError("No se pudo leer el GLB. Comprueba que sea un archivo válido y vuelve a intentarlo."); });
  };

  const setValue = (id: string, value: number) => {
    setMorphs(old => old.map(item => item.id === id ? { ...item, value } : item));
  };
  const applyPreset = (key: keyof typeof presets) => {
    setMorphs(old => old.map(item => ({ ...item, value: presets[key](item.name) })));
  };
  const visible = morphs.filter(item => (item.name + " " + item.meshName).toLowerCase().includes(filter.toLowerCase()));

  return <div className="face-lab-backdrop" role="dialog" aria-modal="true" aria-label="AXSOFIT Face Lab">
    <section className="face-lab">
      <header className="face-lab-header">
        <div><small>AXSOFIT WORLD · EXPERIMENTAL TOOL</small><h2>FACE <span>LAB</span></h2><p>Laboratorio de morph targets faciales · Three.js</p></div>
        <button type="button" className="face-lab-close" onClick={onClose} aria-label="Cerrar Face Lab">×</button>
      </header>
      <div className="face-lab-grid">
        <div className="face-lab-preview">
          <div className="face-lab-preview-title"><b>VISTA 3D</b><span>{model ? "MODELO CARGADO" : "ESPERANDO MODELO"}</span></div>
          <div className="face-lab-canvas">
            {model ? <Canvas camera={{ position: [-1.8, 0.8, 3], fov: 45 }} dpr={[1, 1.5]}>
              <ambientLight intensity={1.1}/><directionalLight position={[3,5,4]} intensity={2}/>
              <hemisphereLight intensity={0.7} groundColor="#222"/>
              <primitive object={model} />
            </Canvas> : <div className="face-lab-empty"><strong>FACE CAP · GLB</strong><p>Carga el archivo facecap.glb del ejemplo de Three.js para explorar sus expresiones.</p></div>}
          </div>
          <div className="face-lab-file">
            <label className="face-lab-upload">CARGAR FACE CAP GLB<input type="file" accept=".glb,model/gltf-binary" onChange={(e: ChangeEvent<HTMLInputElement>) => { const file=e.target.files?.[0]; if(file) loadFile(file); e.currentTarget.value=""; }}/></label>
            <span>{loading ? "Cargando modelo…" : fileName || "No se ha cargado ningún modelo"}</span>
          </div>
          {error && <p className="face-lab-error" role="status">{error}</p>}
        </div>
        <div className="face-lab-controls">
          <div className="face-lab-section-head"><b>PRESETS DE EXPRESIÓN</b><small>0–100%</small></div>
          <div className="face-lab-presets">
            {(["neutral","happy","surprised","blink","focused","empathetic"] as const).map(key=><button key={key} type="button" disabled={!morphs.length} onClick={()=>applyPreset(key)}>{({neutral:"Neutral",happy:"Alegría",surprised:"Sorpresa",blink:"Parpadeo",focused:"Enfoque",empathetic:"Empatía"})[key]}</button>)}
          </div>
          <div className="face-lab-section-head"><b>MORPH TARGETS</b><small>{morphs.length} detectados</small></div>
          <input className="face-lab-search" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Buscar expresión o mesh…"/>
          <div className="face-lab-list">
            {!model && <p className="face-lab-muted">Carga facecap.glb para detectar los controles disponibles.</p>}
            {model && visible.map(item=><div className="face-lab-morph" key={item.id}>
              <div><label title={item.name}>{item.name.replace(/^blendShape1\./,"")}</label><b>{Math.round(item.value*100)}%</b></div>
              <input type="range" min="0" max="1" step="0.01" value={item.value} onChange={e=>setValue(item.id,Number(e.target.value))} aria-label={item.name}/>
              <small>{item.meshName}</small>
            </div>)}
            {model && !visible.length && <p className="face-lab-muted">No hay controles que coincidan con la búsqueda.</p>}
          </div>
          <div className="face-lab-footer">
            <button type="button" disabled={!clips.length} onClick={()=>setPlaying(v=>!v)}>{playing ? "DETENER ANIMACIÓN" : "REPRODUCIR ANIMACIÓN"}</button>
            <span>{clips.length} clips · {morphs.length} morph targets</span>
          </div>
        </div>
      </div>
      <p className="face-lab-note">Los presets aplican coincidencias por nombre; la nomenclatura real depende del GLB. Los deslizadores permiten ajustar cada morph target manualmente.</p>
    </section>
  </div>;
}
