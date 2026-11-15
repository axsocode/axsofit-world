import { FormEvent, useState } from "react";
import { COMPANION_NAME } from "../config";
import { useCompanion } from "../hooks/useCompanion";
import type { Mood } from "../types";

const moods: {id:Mood; label:string; icon:string}[] = [
  {id:"energized",label:"Con energía",icon:"☀"}, {id:"okay",label:"Normal",icon:"◐"},
  {id:"tired",label:"Cansado",icon:"☁"}, {id:"low",label:"No estoy bien",icon:"♡"}
];

export function CompanionBubble() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const {messages,send,checkIn} = useCompanion();
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); send(draft); setDraft(""); };
  return <section className={`companion-widget ${open ? "is-open" : ""}`} aria-label="AXSOFIT Companion">
    {!open ? <button className="companion-launcher" onClick={()=>setOpen(true)} aria-label="Abrir AXSOFIT Companion"><span className="companion-orb">AX</span><span><b>Tu compañero</b><small>Estoy aquí para acompañarte</small></span><i>●</i></button> :
    <div className="companion-card">
      <header className="companion-header"><span className="companion-orb">AX</span><div><b>{COMPANION_NAME}</b><small>Tu compañero virtual</small></div><button onClick={()=>setOpen(false)} aria-label="Cerrar conversación">×</button></header>
      <div className="companion-messages" aria-live="polite">{messages.map(item=><div key={item.id} className={`companion-message ${item.role}`}>{item.text}</div>)}</div>
      <div className="companion-mood"><small>¿CÓMO TE SIENTES HOY?</small><div>{moods.map(item=><button key={item.id} onClick={()=>checkIn(item.id)} title={item.label}>{item.icon} <span>{item.label}</span></button>)}</div></div>
      <form className="companion-input" onSubmit={submit}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Escríbeme..." aria-label="Mensaje para tu compañero" maxLength={500}/><button type="submit" disabled={!draft.trim()}>Enviar</button></form>
      <small className="companion-disclaimer">Compañero de apoyo, no sustituye el criterio de profesionales.</small>
    </div>}
  </section>;
}
