import { Document } from 'mongoose'

export interface Player extends Document {
  name: string
  email: string
  phone: string
  ranking: string
  position: number
  photo: string
}