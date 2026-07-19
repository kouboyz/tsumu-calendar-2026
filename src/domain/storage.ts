import {
  homeworkItemsBySubject,
  homeworkItemTitle,
  type HomeworkSubject,
} from '../data/homework'
import type { PlannedCard, PlannerState } from './types'

export const STORAGE_KEY = 'tsumu-calendar:v1'

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

const isVersionOneCard = (value: unknown) => {
  if (!value || typeof value !== 'object') return false
  const card = value as Record<string, unknown>
  return hasCardBase(card) && typeof card.completed === 'boolean'
}

const migrateVersionOneCards = (
  values: unknown[],
): PlannedCard[] => {
  const assignedHomeworkIds = new Set<string>()
  return values.map((value) => {
    const card = value as Record<string, unknown>
    const templateId = card.templateId as string
    const subject = templateId.replace(
      /^homework-/,
      '',
    ) as HomeworkSubject
    const homeworkItems =
      card.kind === 'homework'
        ? homeworkItemsBySubject(subject)
        : []
    const oldSequence = Number(String(card.title).match(/(\d+)$/)?.[1])
    const indexedItem = Number.isInteger(oldSequence)
      ? homeworkItems[oldSequence - 1]
      : undefined
    const homeworkItem =
      indexedItem && !assignedHomeworkIds.has(indexedItem.id)
        ? indexedItem
        : homeworkItems.find((item) => !assignedHomeworkIds.has(item.id))
    if (homeworkItem) assignedHomeworkIds.add(homeworkItem.id)

    return {
      id: card.id as string,
      templateId,
      title: homeworkItem
        ? homeworkItemTitle(homeworkItem)
        : (card.title as string),
      kind: card.kind as PlannedCard['kind'],
      date: card.date as string,
      ...(homeworkItem ? { homeworkItemId: homeworkItem.id } : {}),
      outcome: card.completed ? 'completed' : 'pending',
      createdAt: card.createdAt as number,
    }
  })
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
  if (state.version === 1 && state.cards.every(isVersionOneCard)) {
    return {
      version: 2,
      cards: migrateVersionOneCards(state.cards),
    }
  }
  throw new Error('対応していない保存データです。')
}

export const serializePlannerState = (cards: PlannedCard[]) =>
  JSON.stringify({ version: 2, cards } satisfies PlannerState)
