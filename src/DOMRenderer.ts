import { Renderer } from "./Renderer";
import { Gobang, DisposeFunction } from "./Gobang";
import { CellStatus, Cell, CellMatrix } from "./Cell";
import * as styles from "./DOMRenderer.css";

const BUTTON_CLASS = {
  [CellStatus.Empty]: styles.empty,
  [CellStatus.White]: styles.white,
  [CellStatus.Black]: styles.black
};

export class DOMRenderer implements Renderer {
  private readonly root: HTMLElement;
  private readonly cells: HTMLElement[][];
  private readonly gobang: Gobang;
  private readonly dispose: DisposeFunction;

  constructor({
    container,
    column,
    row,
    gobang
  }: {
    container: Node;
    column: number;
    row: number;
    gobang: Gobang;
  }) {
    const state = gobang.getState();
    const { root, cells } = createElement(column, row, state.cells);
    this.root = root;
    this.cells = cells;
    this.gobang = gobang;
    this.dispose = gobang.subscribe(this.handleStateChanged);

    container.appendChild(root);
    root.addEventListener("click", this.handleClick);
  }

  public teardown(): void {
    const parent = this.root.parentNode;

    if (parent) {
      parent.removeChild(this.root);
    }

    this.dispose();
  }

  private handleClick = (e: MouseEvent) => {
    const { x, y } = (e.target as any).dataset;
    if (!x || !y) return;

    this.gobang.updateCell(+x, +y);
  };

  private handleStateChanged = (
    { x, y, status }: Cell,
    prevStatus: CellStatus
  ) => {
    const element = this.cells[x][y];
    element.className = getButtonClassName(status);
  };
}

function createElement(
  column: number,
  row: number,
  initialState: CellMatrix
): { root: HTMLElement; cells: HTMLElement[][] } {
  const root = document.createElement("div");
  const cells: HTMLElement[][] = [];

  for (let i = 0; i < column; i++) {
    cells.push([]);
  }

  for (let y = 0; y < row; y++) {
    const rowElement = document.createElement("div");
    rowElement.className = styles.row;

    for (let x = 0; x < column; x++) {
      const button = document.createElement("button");
      button.dataset.x = x.toString();
      button.dataset.y = y.toString();
      button.className = getButtonClassName(initialState[x][y]);

      rowElement.appendChild(button);
      cells[x].push(button);
    }

    root.appendChild(rowElement);
  }

  return { root, cells };
}

function getButtonClassName(status: CellStatus) {
  return BUTTON_CLASS[status];
}
