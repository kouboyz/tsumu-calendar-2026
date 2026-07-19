import type { PlannedCard, PlannerState } from './types'

export const STORAGE_KEY = 'tsumu-calendar:v2'

const hasCardBase = (card: Record<string, unknown>) =>
  typeof card.id === 'string' &&
  typeof card.templateId === 'string' &&
  typeof card.title === 'string' &&
  (card.kind === 'homework' || card.kind === 'event') &&
  /^\d{4}-\d{2}-\d{2}$/.test(String(card.date)) &&
  typeof card.createdAt === 'number'

const isPlannedCard = (value: unknown): value is PlannedCard => {
  if (!value || typeof value !== 'object') return false
  const card = value as Record<string, unknown>
  return (
    hasCardBase(card) &&
    (card.homeworkItemId === undefined ||
      typeof card.homeworkItemId === 'string') &&
    (card.outcome === 'pending' ||
      card.outcome === 'completed' ||
      card.outcome === 'incomplete')
  )
}

export const parsePlannerState = (raw: string): PlannerState => {
  const value: unknown = JSON.parse(raw)
  if (!value || typeof value !== 'object') {
    throw new Error('保存データの形式が正しくありません。')
  }
  const state = value as Record<string, unknown>
  if (!Array.isArray(state.cards)) {
    throw new Error('対応していない保存データです。')
  }
  if (state.version === 2 && state.cards.every(isPlannedCard)) {
    return { version: 2, cards: state.cards }
  }
  throw new Error('対応していない保存データです。')
}

export const serializePlannerState = (cards: PlannedCard[]) =>
  JSON.stringify({ version: 2, cards } satisfies PlannerState)
