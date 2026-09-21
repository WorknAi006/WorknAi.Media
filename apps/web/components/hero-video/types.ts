export interface OrbitingProject {
  id: "online-go" | "gologix" | "pg-info" | "worknai";
  name: string;
  icon: string;
  color: string;
  glowColor: string;
  orbitRadiusX: number;
  orbitRadiusY: number;
  tiltAngle: number;
  speed: number;
}

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export interface NetworkNode {
  lat: number;
  lon: number;
  size: number;
  label?: string;
  pulsePhase: number;
}
