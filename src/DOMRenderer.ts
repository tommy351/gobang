import { Renderer } from "./Renderer";
import { Gobang } from "./Gobang";
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

  constructor({ container, gobang }: { container: Node; gobang: Gobang }) {
    const state = gobang.getState();
    const { column, row } = gobang.getSize();
    const { root, cells } = createElement(column, row, state.cells);
    this.root = root;
    this.cells = cells;
    this.gobang = gobang;

    container.appendChild(root);
    root.addEventListener("click", this.handleClick);
  }

  public teardown(): void {
    const parent = this.root.parentNode;

    if (parent) {
      parent.removeChild(this.root);
    }
  }

  public handleUpdate({ x, y, status }: Cell) {
    const element = this.cells[x][y];
    element.className = getButtonClassName(status);
  }

  private handleClick = (e: MouseEvent) => {
    const { x, y } = (e.target as any).dataset;
    if (!x || !y) return;

    this.gobang.updateCell(+x, +y);
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
