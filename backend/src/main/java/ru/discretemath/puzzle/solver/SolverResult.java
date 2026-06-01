package ru.discretemath.puzzle.solver;

import java.util.List;
import ru.discretemath.puzzle.model.Move;
import ru.discretemath.puzzle.model.PuzzleBoard;

public record SolverResult(
    boolean solved,
    List<Move> moves,
    List<PuzzleBoard> states,
    int visitedCount,
    String message
) {
}
