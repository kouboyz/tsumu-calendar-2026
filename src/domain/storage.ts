import type { PlannedCard, PlannerState } from './types'

export const STORAGE_KEY = 'tsumu-calendar:v1'

const isPlannedCard = (value: unknown): value is PlannedCard => {
  if (!value || typeof value !== 'object') return false
  const card = value as Record<string, unknown>
  return (
    typeof card.id === 'string' &&
    typeof card.templateId === 'string' &&
    typeof card.title === 'string' &&
    (card.kind === 'homework' || card.kind === 'event') &&
    /^\d{4}-\d{2}-\d{2}$/.test(String(card.date)) &&
    typeof card.completed === 'boolean' &&
    typeof card.createdAt === 'number'
  )
}

export const parsePlannerState = (raw: string): PlannerState => {
  const value: unknown = JSON.parse(raw)
  if (!value || typeof value !== 'object') {
    throw new Error('保存データの形式が正しくありません。')
  }
  const state = value as Record<string, unknown>
  if (
    state.version !== 1 ||
    !Array.isArray(state.cards) ||
    !state.cards.every(isPlannedCard)
  ) {
    throw new Error('対応していない保存データです。')
  }
  return { version: 1, cards: state.cards }
}

export const serializePlannerState = (cards: PlannedCard[]) =>
  JSON.stringify({ version: 1, cards } satisfies PlannerState)
