type Color = "w" | "b";
type PieceType = "p" | "r" | "n" | "b" | "q" | "k";

type Piece = `${Color}${PieceType}`;

type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

type Pos = {
  row: Row;
  col: Col;
};

class Board {
  div: HTMLDivElement;
  squares: HTMLDivElement[][];
  pieces: (Piece | "")[][];

  constructor() {
    // init div and squares
    this.div = document.getElementById("board") as HTMLDivElement;
    this.squares = [];

    for (let row = 0; row < 8; row++) {
      const rowArr = [];

      for (let col = 0; col < 8; col++) {
        const square = document.createElement("div");
        square.className = "square " + ((row + col) % 2 ? "dark" : "light");

        // append square to board
        this.div.appendChild(square);

        // append reference to square in squares
        rowArr.push(square);
      }

      this.squares.push(rowArr);
    }

    // init pieces
    const startPosition: (Piece | "")[][] = [
      ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
      ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
      ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ];

    this.pieces = structuredClone(startPosition);
  }

  setPiece(pos: Pos, piece: Piece | ""): void {
    board.pieces[pos.row][pos.col] = piece;
  }

  getPiece(pos: Pos): Piece | "" {
    return board.pieces[pos.row][pos.col];
  }

  render(pos: Pos) {
    const piece = board.getPiece(pos);
    const square = board.squares[pos.row][pos.col];

    if (piece === "") {
      square.innerHTML = "";
    } else {
      const img = document.createElement("img");
      img.src = `assets/${piece}.svg`;
      img.classList.add("piece");
      square.replaceChildren(img);
    }
  }

  renderAll() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this.render({ row: row as Row, col: col as Col });
      }
    }
  }
}

const board = new Board();

class HeldPiece {
  piece: Piece | "";
  div: HTMLDivElement;
  origin: Pos;

  constructor() {
    this.piece = "";
    this.div = document.getElementById("dragged_piece") as HTMLDivElement;
    this.origin = { row: 0, col: 0 };
  }

  moveToPointer(event: PointerEvent) {
    held.div.style.left = `${event.clientX}px`;
    held.div.style.top = `${event.clientY}px`;
  }
}

const held = new HeldPiece();

// util functions

function getCoords(event: MouseEvent): Pos {
  const squareSize: number = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--square-size",
    ),
  );

  return {
    row: Math.floor(event.clientY / squareSize) as Row,
    col: Math.floor(event.clientX / squareSize) as Col,
  };
}

function inBoard(pos: Pos): boolean {
  return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7;
}

// attach listeners
board.div.addEventListener("pointerdown", (event: PointerEvent) => {
  let pos = getCoords(event);

  if (board.getPiece(pos) === "") {
    return;
  }

  held.piece = board.getPiece(pos);
  held.origin.row = pos.row;
  held.origin.col = pos.col;

  board.setPiece(pos, "");

  board.render(pos);

  held.div.style.display = "block";
  const img = document.createElement("img");
  img.src = `assets/${held.piece}.svg`;
  held.div.replaceChildren(img);

  held.moveToPointer(event);
});

board.div.addEventListener("pointermove", (event: PointerEvent) => {
  if (held.piece === "") return;
  held.moveToPointer(event);
});

document.addEventListener("pointerup", (event: PointerEvent) => {
  let pos = getCoords(event);

  if (held.piece === "") {
    return;
  }

  if (!inBoard(pos)) {
    board.setPiece(held.origin, held.piece);
    board.render(held.origin);
  } else {
    board.setPiece(pos, held.piece);
    board.render(pos);
  }

  held.piece = "";

  held.div.style.display = "none";
});

// render all pieces at the start
board.renderAll();
