import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, PerspectiveCamera } from "@react-three/drei";
import { Vector3 } from "three";
import { Avatar } from "./Avatar";
import { WorldRealtime } from "./realtime";
import type { ClipName, PlayerState } from "./types";
import { ProfilePanel } from "./ProfilePanel";
import type { ProfileTab } from "./ProfilePanel";

const makeId = () => crypto.randomUUID();
const initial = (id: string, name: string): PlayerState => ({
  playerId: id, name, clip: "Idle", startServerTime: Date.now(), playbackRate: 1,
  loop: false, sequenceId: makeId(), position: [0,0,0], rotation: 0, velocity: [0,0,0]
});


type Stick = { x: number; y: number };
function FollowCamera({ target }: { target: PlayerState }) {
 const { camera } = useThree(); const desired = useRef(new Vector3());
 useFrame(() => {
  const d=4.8;
  desired.current.set(target.position[0]-Math.sin(target.rotation)*d,target.position[1]+2.1,target.position[2]-Math.cos(target.rotation)*d);
  camera.position.lerp(desired.current,0.14);
  camera.lookAt(target.position[0],target.position[1]+1.05,target.position[2]);
 });
 return null;
}
function VirtualJoystick({ stick }: { stick: React.MutableRefObject<Stick> }) {
 const [offset,setOffset]=useState({x:0,y:0}); const base=useRef<HTMLDivElement>(null); const pointer=useRef<number|null>(null);
 const move=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!base.current)return; const r=base.current.getBoundingClientRect(), radius=r.width*.32;
  const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2), len=Math.hypot(dx,dy), scale=len>radius?radius/len:1;
  const x=dx*scale/radius,y=dy*scale/radius; stick.current={x,y}; setOffset({x:dx*scale,y:dy*scale});
 };
 const release=()=>{pointer.current=null;stick.current={x:0,y:0};setOffset({x:0,y:0});};
 return <div className="joystick-hud"><div ref={base} className="joystick-base" aria-label="Joystick virtual de movimiento"
  onPointerDown={e=>{pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);move(e);}}
  onPointerMove={e=>{if(pointer.current===e.pointerId)move(e);}} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>
  <i className="joystick-axis horizontal"/><i className="joystick-axis vertical"/>
  <span className="joystick-knob" style={{transform:"translate(calc(-50% + "+offset.x+"px), calc(-50% + "+offset.y+"px))"}}/>
 </div><small>MOVER</small></div>;
}

function Scene({ local, remotes }: { local: PlayerState; remotes: PlayerState[] }) {
  return <Canvas shadows dpr={[1,1.35]} fallback={<div className="webgl-fallback">Tu navegador no ha podido iniciar WebGL. Puedes seguir usando el perfil y la Academia; prueba Chrome actualizado para activar la vista 3D.</div>}>
    <PerspectiveCamera makeDefault position={[0,2.1,-4.8]} fov={52}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[4,7,5]} intensity={2.1} castShadow/>
    <hemisphereLight intensity={0.65} groundColor="#242424"/>
    <Grid args={[30,30]} cellSize={.5} cellThickness={.5} sectionSize={2} sectionThickness={1} fadeDistance={24} infiniteGrid/>
    <Suspense fallback={null}>
      <Avatar state={local} local/>
      {remotes.map(p => <Avatar key={p.playerId} state={p}/>)}
    </Suspense>
    <FollowCamera target={local}/>
  </Canvas>;
}

export default function App() {
  const rt = useMemo(() => new WorldRealtime(), []);
  const [me,setMe] = useState<PlayerState>(() => initial(rt.playerId, "AXSO Player"));
  const [remotes,setRemotes] = useState<Record<string,PlayerState>>({});
  const [status,setStatus] = useState("DEMO LOCAL");
  const [players,setPlayers] = useState(1);
  const [speed,setSpeed] = useState(1);
  const [profileOpen,setProfileOpen] = useState(false);
  const [selectedProfileTab,setSelectedProfileTab] = useState<ProfileTab>("avatar");
  const radialActions: {id:ProfileTab; label:string; icon:string}[] = [
    {id:"avatar",label:"Avatar",icon:"◉"}, {id:"academy",label:"Academia",icon:"⌂"},
    {id:"body",label:"Composición",icon:"▥"}, {id:"strength",label:"Fuerza",icon:"✚"},
    {id:"cardio",label:"Cardio",icon:"♥"}, {id:"axcircuit",label:"AXcircuit",icon:"◆"}
  ];
  const openProfileTab = (tab:ProfileTab) => { setSelectedProfileTab(tab); setProfileOpen(true); };
  const stick = useRef<Stick>({x:0,y:0});
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

  // Desplazamiento controlado únicamente mediante joystick táctil.

  useEffect(() => {
    let raf=0, last=performance.now();
    const tick=(now:number)=>{
      const dt=Math.min((now-last)/1000,.05); last=now;
      const x=stick.current.x;
      const z=stick.current.y;
      const active=Math.hypot(x,z)>0.12;
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
      <div className="scene"><Scene local={me} remotes={Object.values(remotes)}/><VirtualJoystick stick={stick}/><div className={`radial-actions ${profileOpen ? "expanded" : ""}`} aria-label="Acciones rápidas"><button className="radial-toggle" type="button" aria-label={profileOpen ? "Cerrar acciones" : "Abrir acciones"} aria-expanded={profileOpen} onClick={()=>setProfileOpen(v=>!v)}>{profileOpen ? "×" : "＋"}</button>{radialActions.map((item,index)=><button key={item.id} type="button" className={`radial-action radial-action-${index+1}`} aria-label={item.label} title={item.label} onClick={()=>openProfileTab(item.id)}><span aria-hidden="true">{item.icon}</span><small>{item.label}</small></button>)}</div><div className="scene-tag">TERCERA PERSONA · CÁMARA FIJA</div><div className="scene-foot"><span>172 CM · MESOMORPH</span><span>{players} JUGADOR{players===1?"":"ES"}</span></div></div>
      <div className={`profile-drawer ${profileOpen ? "open" : ""}`} aria-hidden={!profileOpen}><ProfilePanel selectedTab={selectedProfileTab} status={status} players={players} playerId={rt.playerId} remotes={Object.values(remotes)} speed={speed} setSpeed={setSpeed} setClip={setClip} onClose={()=>setProfileOpen(false)}/></div>
    </section>
    <footer>AXSOFIT WORLD <span>·</span> PROTOTIPO INTERACTIVO 0.1</footer>
  </main>;
}