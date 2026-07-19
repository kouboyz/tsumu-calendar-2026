export type CardKind = 'homework' | 'event'

export type CardTemplate = {
  id: string
  label: string
  kind: CardKind
  icon: string
  color: string
  accent: string
}

export type PlannedCard = {
  id: string
  templateId: string
  title: string
  kind: CardKind
  date: string
  completed: boolean
  createdAt: number
}

export type PlannerState = {
  version: 1
  cards: PlannedCard[]
}
