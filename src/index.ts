import { Gobang } from "./Gobang";
import { StatusBar } from "./StatusBar";
import { CanvasRenderer } from "./CanvasRenderer";
import { DOMRenderer } from "./DOMRenderer";

const options = {
  column: 12,
  row: 12
};

const gobang = new Gobang(options);
const body = document.getElementsByTagName("body")[0];

new StatusBar({
  container: body,
  gobang
});

if (CanvasRenderer.isSupported()) {
  new CanvasRenderer({
    container: body,
    gobang
  });
} else {
  new DOMRenderer({
    container: body,
    gobang
  });
}
