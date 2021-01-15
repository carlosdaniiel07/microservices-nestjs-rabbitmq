export interface GetRankingDto {
  player: string
  position?: number
  points: number
  history: { wins: number, defeats: number }
}