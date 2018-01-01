import { Gobang } from "./Gobang";
import { StatusBar, RendererOption } from "./StatusBar";
import { CanvasRenderer } from "./CanvasRenderer";
import { DOMRenderer } from "./DOMRenderer";
import { Renderer } from "./Renderer";
import { CellStatus, Cell } from "./Cell";

const gobang = new Gobang({
  column: 12,
  row: 12
});
const container = document.getElementsByTagName("body")[0];

let renderer: Renderer;

new StatusBar({
  container,
  gobang,
  onRendererChange(option: RendererOption) {
    renderer.teardown();
    createRenderer(option);
  }
});

createRenderer(RendererOption.Canvas);

gobang.subscribe((cell: Cell, prevStatus: CellStatus) => {
  renderer.handleUpdate(cell, prevStatus);
});

function createRenderer(option: RendererOption) {
  switch (option) {
    case RendererOption.Canvas:
      if (CanvasRenderer.isSupported()) {
        renderer = new CanvasRenderer({ container, gobang });
        break;
      }

    case RendererOption.DOM:
      renderer = new DOMRenderer({ container, gobang });
      break;
  }
}
