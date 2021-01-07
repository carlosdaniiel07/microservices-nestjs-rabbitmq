import { Document } from "mongoose";
import { ChallengeStatus } from "src/enums/challenge-status.enum";
import { Match } from "../matches/match.interface";
import { Player } from "../players/player.interface";

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