package ru.discretemath.puzzle.model;

import java.util.List;

public record PuzzleRequest(List<Integer> board, Integer depthLimit) {
}
