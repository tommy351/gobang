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
    // Do nothing if there's a winner
    if (this.winner) return;

    // Do nothing if the cell is not empty
    const prevStatus = this.cells[x][y];
    if (prevStatus !== CellStatus.Empty) return;

    const status = this.player;
    const cell = {
      x,
      y,
      status
    };

    // Update the state
    this.cells[x][y] = status;
    this.winner = this.getWinner(cell);
    this.player = this.getNextPlayer();

    // Emit to listeners
    for (const listener of this.listeners) {
      listener(cell, prevStatus);
    }
  }

  public subscribe(listener: Listener): DisposeFunction {
    this.listeners.push(listener);

    // Return a function for disposing
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
    const rangeX = range(x - 4, x + 4);
    const rangeY = range(y - 4, y + 4);

    return (
      // Check |
      this.checkRange(rangeY.map(y => ({ x, y }))) ||
      // Check -
      this.checkRange(rangeX.map(x => ({ x, y }))) ||
      // Check /
      this.checkRange(zip(rangeX, reverse(rangeY))) ||
      // Check \
      this.checkRange(zip(rangeX, rangeY))
    );
  }

  private checkRange(range: Position[]): Player | undefined {
    const { column, row } = this.size;
    const arr = range
      // Filter out-of-range elements
      .filter(({ x, y }) => x >= 0 && x < column && y >= 0 && y < row)
      // Get the cell status
      .map(({ x, y }) => this.cells[x][y]);

    // Find the chunk with 5 continous elements
    const chunks = chunkByDiff(arr).filter(
      chunk => chunk[0] && chunk.length >= 5
    );

    if (chunks.length) {
      return chunks[0][0] as Player;
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

function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];

  if (start > end) {
    for (let i = start; i >= end; i += step) {
      result.push(i);
    }

    return result;
  }

  for (let i = start; i <= end; i += step) {
    result.push(i);
  }

  return result;
}

function zip(x: number[], y: number[]): Position[] {
  return x.map((x, i) => ({ x, y: y[i] }));
}

function reverse<T>(arr: T[]): T[] {
  return arr.slice().reverse();
}

function chunkByDiff<T>(arr: T[]): T[][] {
  return arr.reduce(
    (acc, element) => {
      const lastGroup = acc[acc.length - 1];

      if (lastGroup && lastGroup[0] === element) {
        lastGroup.push(element);
      } else {
        acc.push([element]);
      }

      return acc;
    },
    [] as T[][]
  );
}
