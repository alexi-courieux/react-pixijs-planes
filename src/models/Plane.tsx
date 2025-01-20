import Position from "./Position.tsx";
import Airport from "./Airport.tsx";

export default interface Plane {
  id: string;
  pos: Position;
  rot: number;
  spd: number;
  dep: Airport;
  arr: Airport;
  targetAlt: number;
  targetSpd: number;

  hasArrived?: boolean;
}