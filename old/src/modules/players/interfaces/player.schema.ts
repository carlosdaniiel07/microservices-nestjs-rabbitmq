import { Schema } from 'mongoose'

export const PlayerSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  ranking: String,
  position: Number,
  photo: String,
}, {
  timestamps: true,
  collection: 'players'
})