package ru.discretemath.puzzle.service;

import java.util.List;
import org.springframework.stereotype.Service;
import ru.discretemath.puzzle.model.Move;
import ru.discretemath.puzzle.model.PuzzleBoard;
import ru.discretemath.puzzle.model.PuzzleRequest;
import ru.discretemath.puzzle.model.PuzzleResponse;
import ru.discretemath.puzzle.solver.PuzzleSolvers;
import ru.discretemath.puzzle.solver.SolverResult;

@Service
public class PuzzleSolverService {
  private static final int DEFAULT_DEPTH_LIMIT = 32;
  private static final int MAX_DEPTH_LIMIT = 80;

  public PuzzleResponse solveWithBfs(PuzzleRequest request) {
    return solve("BFS", request, 0);
  }

  public PuzzleResponse solveWithDfs(PuzzleRequest request) {
    int depthLimit = normalizeDepthLimit(request == null ? null : request.depthLimit());
    return solve("DFS", request, depthLimit);
  }

  private PuzzleResponse solve(String algorithm, PuzzleRequest request, int depthLimit) {
    long startedAt = System.nanoTime();
    try {
      PuzzleBoard board = PuzzleBoard.from(request == null ? null : request.board());
      if (!board.isSolvable()) {
        return response(
            algorithm,
            false,
            List.of(),
            List.of(board.tiles()),
            0,
            0,
            startedAt,
            "Эта конфигурация пятнашек нерешаема"
        );
      }

      SolverResult result = "BFS".equals(algorithm)
          ? PuzzleSolvers.bfs(board)
          : PuzzleSolvers.dfs(board, depthLimit);

      return response(
          algorithm,
          result.solved(),
          result.moves(),
          result.states().stream().map(PuzzleBoard::tiles).toList(),
          result.visitedCount(),
          result.moves().size(),
          startedAt,
          result.message()
      );
    } catch (IllegalArgumentException exception) {
      return response(
          algorithm,
          false,
          List.of(),
          List.of(),
          0,
          0,
          startedAt,
          exception.getMessage()
      );
    }
  }

  private int normalizeDepthLimit(Integer depthLimit) {
    if (depthLimit == null) {
      return DEFAULT_DEPTH_LIMIT;
    }
    return Math.max(0, Math.min(depthLimit, MAX_DEPTH_LIMIT));
  }

  private PuzzleResponse response(
      String algorithm,
      boolean solvable,
      List<Move> moves,
      List<List<Integer>> states,
      int visitedCount,
      int depth,
      long startedAt,
      String message
  ) {
    long elapsedMs = (System.nanoTime() - startedAt) / 1_000_000;
    return new PuzzleResponse(
        algorithm,
        solvable,
        moves,
        states,
        visitedCount,
        depth,
        elapsedMs,
        message
    );
  }
}
