package ru.discretemath.puzzle.model;

import java.util.List;

public record PuzzleResponse(
    String algorithm,
    boolean solvable,
    List<Move> moves,
    List<List<Integer>> states,
    int visitedCount,
    int depth,
    long elapsedMs,
    String message
) {
}
