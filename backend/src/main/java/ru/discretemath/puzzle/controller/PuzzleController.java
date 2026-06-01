package ru.discretemath.puzzle.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.discretemath.puzzle.model.PuzzleRequest;
import ru.discretemath.puzzle.model.PuzzleResponse;
import ru.discretemath.puzzle.service.PuzzleSolverService;

@RestController
@RequestMapping("/api/puzzle")
@CrossOrigin(origins = "*")
public class PuzzleController {
  private final PuzzleSolverService solverService;

  public PuzzleController(PuzzleSolverService solverService) {
    this.solverService = solverService;
  }

  @PostMapping("/solve/bfs")
  public PuzzleResponse solveWithBfs(@RequestBody PuzzleRequest request) {
    return solverService.solveWithBfs(request);
  }

  @PostMapping("/solve/dfs")
  public PuzzleResponse solveWithDfs(@RequestBody PuzzleRequest request) {
    return solverService.solveWithDfs(request);
  }
}
