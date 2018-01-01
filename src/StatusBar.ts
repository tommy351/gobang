import { Gobang, State } from "./Gobang";
import { CellStatus } from "./Cell";

export enum RendererOption {
  Canvas = "canvas",
  DOM = "dom"
}

interface Option {
  value: any;
  label: string;
  selected?: boolean;
}

const PLAYER_TEXT = {
  [CellStatus.Black]: "Black",
  [CellStatus.White]: "White"
};

export class StatusBar {
  private readonly root: HTMLElement;
  private readonly statusDiv: HTMLElement;
  private readonly gobang: Gobang;

  constructor({
    container,
    gobang,
    onRendererChange
  }: {
    container: Node;
    gobang: Gobang;
    onRendererChange: (option: RendererOption) => void;
  }) {
    // Create root element
    this.root = document.createElement("div");
    this.gobang = gobang;
    container.appendChild(this.root);

    // Render select
    createRendererSelect(this.root, onRendererChange);

    // Render status
    this.statusDiv = document.createElement("div");
    this.root.appendChild(this.statusDiv);
    this.renderStatus(gobang.getState());

    gobang.subscribe(this.handleStateChanged);
  }

  private renderStatus(state: State) {
    if (state.winner) {
      const winner = PLAYER_TEXT[state.winner];

      this.statusDiv.innerHTML = `<strong>GAME OVER! Winner is ${winner}</strong>`;
      return;
    }

    this.statusDiv.innerHTML = `Turn: ${PLAYER_TEXT[state.player]}`;
  }

  private handleStateChanged = () => {
    this.renderStatus(this.gobang.getState());
  };
}

function createSelect(
  options: Option[],
  handleChange: (value: any) => void
): HTMLSelectElement {
  const select = document.createElement("select");

  for (let i = 0; i < options.length; i++) {
    const option = document.createElement("option");

    option.innerHTML = options[i].label;
    option.setAttribute("value", options[i].value);
    option.selected = Boolean(options[i].selected);

    select.appendChild(option);
  }

  select.addEventListener("change", () => {
    const option = options[select.selectedIndex];
    handleChange(option ? option.value : undefined);
  });

  return select;
}

function createRendererSelect(
  container: HTMLElement,
  handleChange: (option: RendererOption) => void
) {
  const label = document.createElement("label");

  const span = document.createElement("span");
  span.innerHTML = "Renderer: ";
  label.appendChild(span);

  const select = createSelect(
    [
      { value: RendererOption.Canvas, label: "Canvas" },
      { value: RendererOption.DOM, label: "DOM" }
    ],
    handleChange
  );
  label.appendChild(select);

  container.appendChild(label);
}
