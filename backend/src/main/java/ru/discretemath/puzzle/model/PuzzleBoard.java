package ru.discretemath.puzzle.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public record PuzzleBoard(List<Integer> tiles) {
  public static final int SIZE = 4;
  public static final int CELLS = SIZE * SIZE;
  public static final PuzzleBoard SOLVED = new PuzzleBoard(
      List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0)
  );

  public PuzzleBoard {
    tiles = List.copyOf(tiles);
  }

  public static PuzzleBoard from(List<Integer> tiles) {
    if (tiles == null || tiles.size() != CELLS) {
      throw new IllegalArgumentException("Поле должно содержать ровно 16 чисел");
    }

    Set<Integer> seen = new HashSet<>(tiles);
    if (seen.size() != CELLS) {
      throw new IllegalArgumentException("Каждое число от 0 до 15 должно встречаться один раз");
    }

    for (Integer tile : tiles) {
      if (tile == null || tile < 0 || tile >= CELLS) {
        throw new IllegalArgumentException("Поле может содержать только числа от 0 до 15");
      }
    }

    return new PuzzleBoard(tiles);
  }

  public boolean isSolved() {
    return equals(SOLVED);
  }

  public boolean isSolvable() {
    int inversions = 0;
    for (int i = 0; i < tiles.size(); i++) {
      int left = tiles.get(i);
      if (left == 0) {
        continue;
      }

      for (int j = i + 1; j < tiles.size(); j++) {
        int right = tiles.get(j);
        if (right != 0 && left > right) {
          inversions++;
        }
      }
    }

    int blankRowFromBottom = SIZE - zeroIndex() / SIZE;
    return (inversions + blankRowFromBottom) % 2 == 1;
  }

  public int zeroIndex() {
    return tiles.indexOf(0);
  }

  public PuzzleBoard move(Move move) {
    int zero = zeroIndex();
    int row = zero / SIZE;
    int col = zero % SIZE;
    int nextRow = row + move.rowDelta();
    int nextCol = col + move.colDelta();

    if (nextRow < 0 || nextRow >= SIZE || nextCol < 0 || nextCol >= SIZE) {
      return null;
    }

    int nextIndex = nextRow * SIZE + nextCol;
    List<Integer> nextTiles = new ArrayList<>(tiles);
    nextTiles.set(zero, nextTiles.get(nextIndex));
    nextTiles.set(nextIndex, 0);
    return new PuzzleBoard(nextTiles);
  }
}
