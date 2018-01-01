import { Cell, CellStatus, CellMatrix } from "./Cell";

export type Listener = (cell: Cell, prevStatus: CellStatus) => void;
export type DisposeFunction = () => void;
export type Player = CellStatus.Black | CellStatus.White;

export interface Size {
  column: number;
  row: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface State {
  cells: CellMatrix;
  player: Player;
  winner?: Player;
}

export class Gobang {
  private readonly size: Size;
  private readonly cells: CellMatrix = [];
  private readonly listeners: Listener[] = [];
  private player: Player = CellStatus.Black;
  private winner?: Player;

  constructor(size: Size) {
    this.size = size;

    for (let i = 0; i < size.row; i++) {
      this.cells.push([]);

      for (let j = 0; j < size.column; j++) {
        this.cells[i].push(CellStatus.Empty);
      }
    }
  }

  public getState(): State {
    return {
      cells: this.cells,
      player: this.player,
      winner: this.winner
    };
  }

  public getSize(): Size {
    return this.size;
  }

  public updateCell(x: number, y: number) {
    if (this.winner) return;

    const prevStatus = this.cells[x][y];
    if (prevStatus !== CellStatus.Empty) return;

    const status = this.player;
    const cell = {
      x,
      y,
      status
    };

    this.cells[x][y] = status;
    this.winner = this.getWinner(cell);
    this.player = this.getNextPlayer();

    for (const listener of this.listeners) {
      listener(cell, prevStatus);
    }
  }

  public subscribe(listener: Listener): DisposeFunction {
    this.listeners.push(listener);

    return () => {
      for (let i = 0; i < this.listeners.length; i++) {
        if (this.listeners[i] === listener) {
          this.listeners.splice(i, 1);
          return;
        }
      }
    };
  }

  private getWinner({ x, y }: Position): Player | undefined {
    return (
      // Check |
      this.checkSeq(makeSeq(y - 4, y + 4).map(y => ({ x, y }))) ||
      // Check -
      this.checkSeq(makeSeq(x - 4, x + 4).map(x => ({ x, y }))) ||
      // Check /
      this.checkSeq(
        zipPosition(makeSeq(x - 4, x + 4), makeSeq(y - 4, y + 4).reverse())
      ) ||
      // Check \
      this.checkSeq(zipPosition(makeSeq(x - 4, x + 4), makeSeq(y - 4, y + 4)))
    );
  }

  private checkSeq(seq: Position[]): Player | undefined {
    const { column, row } = this.size;
    let arr = seq
      .filter(({ x, y }) => x >= 0 && x < column && y >= 0 && y < row)
      .map(({ x, y }) => this.cells[x][y]);

    arr = trimArray(arr);
    if (arr.length < 5) return;

    let idx = 0;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] !== arr[idx]) {
        idx = i;
      }

      if (i - idx >= 4) {
        return arr[i] as any;
      }
    }

    return;
  }

  private getNextPlayer(): Player {
    if (this.player === CellStatus.Black) {
      return CellStatus.White;
    }

    return CellStatus.Black;
  }
}

function makeSeq(from: number, to: number): number[] {
  const result: number[] = [];

  for (let i = from; i <= to; i++) {
    result.push(i);
  }

  return result;
}

function trimArray<T>(arr: T[]): T[] {
  let start = 0;
  let end = arr.length;

  // Trim left
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      start = i;
      break;
    }
  }

  // Trim right
  for (let i = start; i < arr.length; i++) {
    if (!arr[i]) {
      end = i;
      break;
    }
  }

  return arr.slice(start, end);
}

function zipPosition(arrX: number[], arrY: number[]): Position[] {
  const result: Position[] = [];

  for (let i = 0; i < arrX.length; i++) {
    result.push({ x: arrX[i], y: arrY[i] });
  }

  return result;
}
