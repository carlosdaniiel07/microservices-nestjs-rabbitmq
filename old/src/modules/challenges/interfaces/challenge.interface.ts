import { Document } from "mongoose";
import { Match } from "src/modules/challenges/interfaces/match.interface";
import { Player } from "src/modules/players/interfaces/player.interface";
import { ChallengeStatus } from "../enums/challenge-status.enum";

export interface Challenge extends Document {
  category: string
  date: Date
  status: ChallengeStatus
  requestDate: Date
  responseDate: Date
  requester: Player
  players: Player[]
  match: Match  
}