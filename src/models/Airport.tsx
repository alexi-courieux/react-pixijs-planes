import Position from "./Position.tsx";

export default interface Airport {
  pos: Position;
  normalizedPos?: { h: number, v: number };
  code: string;
  name: string;
}