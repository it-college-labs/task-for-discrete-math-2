package ru.discretemath.puzzle.solver;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import ru.discretemath.puzzle.model.Move;
import ru.discretemath.puzzle.model.PuzzleBoard;

public class PuzzleSolvers {
  private static final int BFS_VISIT_LIMIT = 400_000;
  private static final int DFS_VISIT_LIMIT = 200_000;
  private static final Move[] DFS_ORDER = {Move.LEFT, Move.UP, Move.RIGHT, Move.DOWN};

  private PuzzleSolvers() {
  }

  public static SolverResult bfs(PuzzleBoard start) {
    if (start.isSolved()) {
      return solved(start, List.of(), 1);
    }

    Queue<PuzzleBoard> queue = new ArrayDeque<>();
    Map<PuzzleBoard, Step> parent = new HashMap<>();
    queue.add(start);
    parent.put(start, new Step(null, null));

    while (!queue.isEmpty()) {
      PuzzleBoard current = queue.remove();
      if (parent.size() > BFS_VISIT_LIMIT) {
        return new SolverResult(
            false,
            List.of(),
            List.of(start),
            parent.size(),
            "BFS остановлен из-за лимита просмотренных состояний"
        );
      }

      for (Move move : Move.values()) {
        PuzzleBoard next = current.move(move);
        if (next == null || parent.containsKey(next)) {
          continue;
        }

        parent.put(next, new Step(current, move));
        if (next.isSolved()) {
          return reconstruct(next, parent);
        }

        queue.add(next);
      }
    }

    return new SolverResult(false, List.of(), List.of(start), parent.size(), "Решение не найдено");
  }

  public static SolverResult dfs(PuzzleBoard start, int depthLimit) {
    if (start.isSolved()) {
      return solved(start, List.of(), 1);
    }

    SearchCounter counter = new SearchCounter();
    List<Move> path = new ArrayList<>();
    Set<PuzzleBoard> branch = new HashSet<>();
    branch.add(start);

    boolean solved = search(start, depthLimit, path, branch, counter);
    if (!solved) {
      String reason = counter.limitReached
          ? "DFS остановлен из-за лимита просмотренных состояний"
          : "DFS не нашел решение в пределах глубины " + depthLimit;

      return new SolverResult(
          false,
          List.copyOf(path),
          List.of(start),
          counter.visited,
          reason
      );
    }

    return fromMoves(start, path, counter.visited);
  }

  private static boolean search(
      PuzzleBoard current,
      int depthLeft,
      List<Move> path,
      Set<PuzzleBoard> branch,
      SearchCounter counter
  ) {
    counter.visited++;
    if (counter.visited > DFS_VISIT_LIMIT) {
      counter.limitReached = true;
      return false;
    }

    if (current.isSolved()) {
      return true;
    }
    if (depthLeft == 0) {
      return false;
    }

    for (Move move : DFS_ORDER) {
      PuzzleBoard next = current.move(move);
      if (next == null || branch.contains(next)) {
        continue;
      }

      path.add(move);
      branch.add(next);
      if (search(next, depthLeft - 1, path, branch, counter)) {
        return true;
      }
      branch.remove(next);
      path.remove(path.size() - 1);
    }

    return false;
  }

  private static SolverResult reconstruct(PuzzleBoard solved, Map<PuzzleBoard, Step> parent) {
    List<Move> moves = new ArrayList<>();
    List<PuzzleBoard> states = new ArrayList<>();
    PuzzleBoard current = solved;

    while (current != null) {
      states.add(current);
      Step step = parent.get(current);
      if (step != null && step.move() != null) {
        moves.add(step.move());
      }
      current = step == null ? null : step.previous();
    }

    Collections.reverse(moves);
    Collections.reverse(states);
    return new SolverResult(true, moves, states, parent.size(), null);
  }

  private static SolverResult fromMoves(PuzzleBoard start, List<Move> moves, int visitedCount) {
    List<PuzzleBoard> states = new ArrayList<>();
    PuzzleBoard current = start;
    states.add(current);
    for (Move move : moves) {
      current = current.move(move);
      states.add(current);
    }
    return new SolverResult(true, List.copyOf(moves), states, visitedCount, null);
  }

  private static SolverResult solved(PuzzleBoard board, List<Move> moves, int visitedCount) {
    return new SolverResult(true, moves, List.of(board), visitedCount, null);
  }

  private record Step(PuzzleBoard previous, Move move) {
  }

  private static class SearchCounter {
    private int visited;
    private boolean limitReached;
  }
}
