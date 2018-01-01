import { Gobang, DisposeFunction, State, Player } from "./Gobang";
import { CellStatus } from "./Cell";

const PLAYER_TEXT = {
  [CellStatus.Black]: "Black",
  [CellStatus.White]: "White"
};

export class StatusBar {
  private readonly root: HTMLElement;
  private readonly gobang: Gobang;
  private readonly dispose: DisposeFunction;

  constructor({ container, gobang }: { container: Node; gobang: Gobang }) {
    this.root = document.createElement("div");
    this.gobang = gobang;
    this.dispose = gobang.subscribe(this.handleStateChanged);

    container.appendChild(this.root);
    this.render(gobang.getState());
  }

  private render(state: State) {
    if (state.winner) {
      const winner = PLAYER_TEXT[state.winner];

      this.root.innerHTML = `<strong>GAME OVER! Winner is ${winner}</strong>`;
      return;
    }

    this.root.innerHTML = `Turn: ${PLAYER_TEXT[state.player]}`;
  }

  private handleStateChanged = () => {
    this.render(this.gobang.getState());
  };
}
