import { Cell, CellStatus } from "./Cell";

export interface Renderer {
  handleUpdate(cell: Cell, prevStatus: CellStatus): void;
  teardown(): void;
}
