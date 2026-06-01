package ru.discretemath.puzzle.model;

public enum Move {
  UP(-1, 0),
  RIGHT(0, 1),
  DOWN(1, 0),
  LEFT(0, -1);

  private final int rowDelta;
  private final int colDelta;

  Move(int rowDelta, int colDelta) {
    this.rowDelta = rowDelta;
    this.colDelta = colDelta;
  }

  public int rowDelta() {
    return rowDelta;
  }

  public int colDelta() {
    return colDelta;
  }
}
