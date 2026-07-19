export type CardKind = 'homework' | 'event'
export type MissionOutcome = 'pending' | 'completed' | 'incomplete'

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
  homeworkItemId?: string
  outcome: MissionOutcome
  createdAt: number
}

export type PlannerState = {
  version: 2
  cards: PlannedCard[]
}
