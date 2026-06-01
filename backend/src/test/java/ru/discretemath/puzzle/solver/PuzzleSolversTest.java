package ru.discretemath.puzzle.solver;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;
import org.junit.jupiter.api.Test;
import ru.discretemath.puzzle.model.Move;
import ru.discretemath.puzzle.model.PuzzleBoard;

class PuzzleSolversTest {
  @Test
  void bfsReturnsEmptyPathForSolvedBoard() {
    SolverResult result = PuzzleSolvers.bfs(PuzzleBoard.SOLVED);

    assertThat(result.solved()).isTrue();
    assertThat(result.moves()).isEmpty();
    assertThat(result.states()).containsExactly(PuzzleBoard.SOLVED);
  }

  @Test
  void bfsFindsShortestPathForOneMoveBoard() {
    PuzzleBoard board = PuzzleBoard.from(
        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15)
    );

    SolverResult result = PuzzleSolvers.bfs(board);

    assertThat(result.solved()).isTrue();
    assertThat(result.moves()).containsExactly(Move.RIGHT);
    assertThat(result.states()).last().isEqualTo(PuzzleBoard.SOLVED);
  }

  @Test
  void dfsRespectsDepthLimit() {
    PuzzleBoard board = PuzzleBoard.from(
        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15)
    );

    SolverResult result = PuzzleSolvers.dfs(board, 0);

    assertThat(result.solved()).isFalse();
    assertThat(result.message()).contains("глубины 0");
  }

  @Test
  void boardRejectsInvalidInput() {
    assertThatThrownBy(() -> PuzzleBoard.from(List.of(1, 1, 2)))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void boardDetectsUnsolvableState() {
    PuzzleBoard board = PuzzleBoard.from(
        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0)
    );

    assertThat(board.isSolvable()).isFalse();
  }
}
