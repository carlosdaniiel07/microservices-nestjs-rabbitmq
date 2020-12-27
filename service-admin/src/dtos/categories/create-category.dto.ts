export interface CreateCategoryDto {
  name: string
  description: string
  events: CreateEventDto[]
}

interface CreateEventDto {
  name: string
  operation: string
  value: number
}