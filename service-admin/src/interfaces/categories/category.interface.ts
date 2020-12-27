import { Document } from "mongoose";
import { Player } from "./../players/player.interface";
import { Event } from "./event.interface";

export interface Category extends Document {
  name: string
  description: string
  events: Event[]
  players: Player[]
}