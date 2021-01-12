import { Document } from "mongoose";

export interface Ranking extends Document {
  challenge: string
  match: string
  category: string
  player: string
  event: string
  operation: string
  points: number
}