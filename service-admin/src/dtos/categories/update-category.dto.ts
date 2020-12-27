export interface UpdateCategoryDto {
  description: string
  events: UpdateEventDto[]
}

interface UpdateEventDto {
  _id: string
  name: string
  operation: string
  value: number
}