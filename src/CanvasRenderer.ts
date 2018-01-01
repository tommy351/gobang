import { Renderer } from "./Renderer";
import { Gobang } from "./Gobang";
import { Cell, CellMatrix, CellStatus } from "./Cell";

const CELL_SIZE = 36;

export class CanvasRenderer implements Renderer {
  private readonly root: HTMLElement;
  private readonly gobang: Gobang;
  private readonly context: CanvasRenderingContext2D;

  public static isSupported(): boolean {
    return (window as any).CanvasRenderingContext2D != null;
  }

  constructor({ container, gobang }: { container: Node; gobang: Gobang }) {
    const { column, row } = gobang.getSize();
    const state = gobang.getState();
    const { root, context } = createCanvas(column, row, state.cells);

    this.root = root;
    this.context = context;
    this.gobang = gobang;

    container.appendChild(this.root);
    root.addEventListener("click", this.handleClick);
  }

  public teardown() {
    const parent = this.root.parentNode;

    if (parent) {
      parent.removeChild(this.root);
    }
  }

  public handleUpdate(cell: Cell) {
    drawCell(this.context, cell);
  }

  private handleClick = (e: MouseEvent) => {
    const x = Math.floor((e.pageX - this.root.offsetLeft) / CELL_SIZE);
    const y = Math.floor((e.pageY - this.root.offsetTop) / CELL_SIZE);

    this.gobang.updateCell(x, y);
  };
}

function createCanvas(
  column: number,
  row: number,
  initialState: CellMatrix
): { root: HTMLElement; context: CanvasRenderingContext2D } {
  const root = document.createElement("canvas");
  const context = root.getContext("2d");
  const width = CELL_SIZE * column;
  const height = CELL_SIZE * row;

  if (!context) {
    throw new Error("Context is not supported for this browser");
  }

  root.setAttribute("width", width.toString());
  root.setAttribute("height", height.toString());

  // Render background
  context.fillStyle = "wheat";
  context.fillRect(0, 0, width, height);

  // Render horizontal lines
  const horizontalLine = new Path2D();
  horizontalLine.moveTo(0, CELL_SIZE / 2);
  horizontalLine.lineTo(width, CELL_SIZE / 2);

  context.save();

  for (let i = 0; i < row; i++) {
    context.stroke(horizontalLine);
    context.translate(0, CELL_SIZE);
  }

  context.restore();

  // Render vertical lines
  const verticalLine = new Path2D();
  verticalLine.moveTo(CELL_SIZE / 2, 0);
  verticalLine.lineTo(CELL_SIZE / 2, height);

  context.save();

  for (let i = 0; i < column; i++) {
    context.stroke(verticalLine);
    context.translate(CELL_SIZE, 0);
  }

  context.restore();

  // Render initial state
  for (let x = 0; x < initialState.length; x++) {
    for (let y = 0; y < initialState[x].length; y++) {
      const status = initialState[x][y];

      if (status) {
        drawCell(context, { x, y, status });
      }
    }
  }

  return { root, context };
}

function drawCell(ctx: CanvasRenderingContext2D, { x, y, status }: Cell) {
  switch (status) {
    case CellStatus.Black:
      ctx.fillStyle = "black";
      break;

    case CellStatus.White:
      ctx.fillStyle = "white";
      break;
  }

  const margin = 1;
  const radius = (CELL_SIZE - margin) / 2;

  ctx.beginPath();
  ctx.arc(
    x * CELL_SIZE + radius + margin,
    y * CELL_SIZE + radius + margin,
    radius,
    0,
    Math.PI * 2
  );
  ctx.fill();
}
