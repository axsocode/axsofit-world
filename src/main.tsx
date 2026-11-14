import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

class RootErrorBoundary extends React.Component<React.PropsWithChildren, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error("AXSOFIT WORLD render error:", error); }
  render() {
    if (this.state.failed) return <main className="fatal-screen"><section><b>AXSOFIT WORLD</b><h1>No se pudo iniciar la aplicación</h1><p>Se produjo un error al cargar un módulo o recurso. Comprueba tu conexión y vuelve a intentarlo.</p><button onClick={() => window.location.reload()}>Recargar aplicación</button></section></main>;
    return this.props.children;
  }
}

const root = document.getElementById("root");
if (!root) throw new Error('No se encontró el elemento raíz #root');
ReactDOM.createRoot(root).render(<React.StrictMode><RootErrorBoundary><App /></RootErrorBoundary></React.StrictMode>);
