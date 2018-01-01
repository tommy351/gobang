import { DOMRenderer } from "./DOMRenderer";
import { Gobang } from "./Gobang";
import { StatusBar } from "./StatusBar";

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

new DOMRenderer({
  ...options,
  container: body,
  gobang
});
