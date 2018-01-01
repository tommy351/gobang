import { Gobang } from "./Gobang";
import { StatusBar } from "./StatusBar";
import { CanvasRenderer } from "./CanvasRenderer";
import { DOMRenderer } from "./DOMRenderer";
import { Renderer } from "./Renderer";
import { CellStatus, Cell } from "./Cell";

const gobang = new Gobang({
  column: 12,
  row: 12
});
const container = document.getElementsByTagName("body")[0];

new StatusBar({ container, gobang });

let renderer: Renderer;

if (CanvasRenderer.isSupported()) {
  renderer = new CanvasRenderer({ container, gobang });
} else {
  renderer = new DOMRenderer({ container, gobang });
}

gobang.subscribe((cell: Cell, prevStatus: CellStatus) => {
  renderer.handleUpdate(cell, prevStatus);
});
