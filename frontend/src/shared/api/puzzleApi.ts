import type { Board, SolverResponse } from '../../entities/puzzle/model'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

type SolverRequest = {
  board: Board
  depthLimit?: number
}

async function postSolution(path: string, request: SolverRequest): Promise<SolverResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Сервер решения временно недоступен')
  }

  return response.json() as Promise<SolverResponse>
}

export function solveWithBfs(board: Board) {
  return postSolution('/api/puzzle/solve/bfs', { board })
}

export function solveWithDfs(board: Board, depthLimit: number) {
  return postSolution('/api/puzzle/solve/dfs', { board, depthLimit })
}
