import { Document } from "mongoose";
import { Player } from "src/modules/players/interfaces/player.interface";
import { MatchResult } from "./match-result.interface";

export interface Match extends Document {
  category: string
  date: Date
  winner: Player
  results: MatchResult[]
  players: Player[]
}