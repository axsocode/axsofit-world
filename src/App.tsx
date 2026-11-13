import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { WorldRealtime } from "./realtime";
import type { ClipName, PlayerState } from "./types";
import { ProfilePanel } from "./ProfilePanel";

const makeId = () => crypto.randomUUID();
const initial = (id: string, name: string): PlayerState => ({
  playerId: id, name, clip: "Idle", startServerTime: Date.now(), playbackRate: 1,
  loop: false, sequenceId: makeId(), position: [0,0,0], rotation: 0, velocity: [0,0,0]
});

function Scene({ local, remotes }: { local: PlayerState; remotes: PlayerState[] }) {
  return <Canvas shadows dpr={[1,1.8]}>
    <PerspectiveCamera makeDefault position={[3.8,2.5,5.5]} fov={42}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[4,7,5]} intensity={2.1} castShadow/>
    <Environment preset="city"/>
    <Grid args={[30,30]} cellSize={.5} cellThickness={.5} sectionSize={2} sectionThickness={1} fadeDistance={24} infiniteGrid/>
    <Avatar state={local} local/>
    {remotes.map(p => <Avatar key={p.playerId} state={p}/>)}
    <OrbitControls target={[0,1,0]} minDistance={2.5} maxDistance={12} maxPolarAngle={Math.PI*.49}/>
  </Canvas>;
}

export default function App() {
  const rt = useMemo(() => new WorldRealtime(), []);
  const [me,setMe] = useState<PlayerState>(() => initial(rt.playerId, "AXSO Player"));
  const [remotes,setRemotes] = useState<Record<string,PlayerState>>({});
  const [status,setStatus] = useState("DEMO LOCAL");
  const [players,setPlayers] = useState(1);
  const [speed,setSpeed] = useState(1);
  const [moving,setMoving] = useState(false);
  const keys = useRef<Record<string,boolean>>({});
  const lastBroadcast = useRef(0);
  const seq = useCallback(() => makeId(), []);

  useEffect(() => {
    rt.onPlayer = s => setRemotes(old => ({...old,[s.playerId]:s}));
    rt.onPresence = ids => setPlayers(Math.max(1,ids.length));
    rt.connect().then(ok => setStatus(ok ? "ONLINE · MULTIJUGADOR" : "DEMO LOCAL"))
      .catch(() => setStatus("SIN CONEXIÓN · DEMO LOCAL"));
    return () => { rt.disconnect(); };
  }, [rt]);

  const setClip = useCallback((clip: ClipName) => {
    setMe(prev => ({...prev, clip, loop: clip === "Caminar_Loop",
      startServerTime: Date.now(), sequenceId: seq(), playbackRate: speed}));
  }, [seq,speed]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k=e.key.toLowerCase();
      if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(k)) e.preventDefault();
      keys.current[k]=true;
      if (k==="h") setClip("Saludar");
      if (k==="c") setClip("Celebrar_Salto");
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()]=false; };
    window.addEventListener("keydown",down); window.addEventListener("keyup",up);
    return () => { window.removeEventListener("keydown",down); window.removeEventListener("keyup",up); };
  }, [setClip]);

  useEffect(() => {
    let raf=0, last=performance.now();
    const tick=(now:number)=>{
      const dt=Math.min((now-last)/1000,.05); last=now;
      const k=keys.current;
      const x=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0);
      const z=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0);
      const active=!!(x||z);
      setMoving(old => old!==active ? active : old);
      if (active) {
        setMe(prev=>{
          const mag=Math.hypot(x,z)||1, vx=x/mag, vz=z/mag;
          const angle=Math.atan2(vx,vz);
          return {...prev,position:[prev.position[0]+vx*2.0*dt,0,prev.position[2]+vz*2.0*dt],
            rotation:angle,velocity:[vx*2,0,vz*2],
            clip: prev.clip==="Saludar"||prev.clip==="Celebrar_Salto" ? prev.clip : "Caminar_Loop",
            loop:true, playbackRate:speed};
        });
      } else {
        setMe(prev => prev.clip==="Caminar_Loop" ? {...prev,clip:"Idle",loop:false,velocity:[0,0,0],sequenceId:seq()} : prev);
      }
      if (now-lastBroadcast.current>80) {
        lastBroadcast.current=now;
        rt.publish({...me, playbackRate:speed});
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick); return ()=>cancelAnimationFrame(raf);
  }, [rt,me,speed,seq]);

  const action=(clip:ClipName)=>setClip(clip);
  return <main className="app">
    <header className="topbar"><div className="brand"><span className="mark">AX</span><div><b>AXSOFIT WORLD</b><small>HUMAN PERFORMANCE · AVATAR LAB</small></div></div><div className="status"><i className={status.startsWith("ONLINE")?"online":""}/>{status}</div></header>
    <section className="workspace">
      <div className="scene"><Scene local={me} remotes={Object.values(remotes)}/><div className="scene-tag">AVATAR VIEW · 3D</div><div className="scene-foot"><span>172 CM · MESOMORPH</span><span>{players} JUGADOR{players===1?"":"ES"}</span></div></div>
      <ProfilePanel status={status} players={players} playerId={rt.playerId} remotes={Object.values(remotes)} moving={moving} speed={speed} setSpeed={setSpeed} setClip={setClip} setMoving={setMoving} keys={keys} reset={()=>setMe(p=>({...p,position:[0,0,0] as [number,number,number],rotation:0,clip:"Idle",sequenceId:seq()}))}/>
    </section>
    <footer>AXSOFIT WORLD <span>·</span> PROTOTIPO INTERACTIVO 0.1</footer>
  </main>;
}