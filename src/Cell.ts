export enum CellStatus {
  Empty,
  Black,
  White
}

export interface Cell {
  x: number;
  y: number;
  status: CellStatus;
}

export type CellMatrix = CellStatus[][];
