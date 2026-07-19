import {
  homeworkItems,
  homeworkItemsBySubject,
  type HomeworkSubject,
} from '../data/homework'
import type { PlannedCard } from './types'

export const subjectFromTemplateId = (
  templateId: string,
): HomeworkSubject | null => {
  const subject = templateId.replace(/^homework-/, '') as HomeworkSubject
  return homeworkItems.some((item) => item.subject === subject)
    ? subject
    : null
}

export const completedHomeworkIds = (cards: PlannedCard[]) =>
  new Set(
    cards.flatMap((card) =>
      card.homeworkItemId && card.outcome === 'completed'
        ? [card.homeworkItemId]
        : [],
    ),
  )

export const homeworkProgress = (
  cards: PlannedCard[],
  subject?: HomeworkSubject,
) => {
  const items = subject ? homeworkItemsBySubject(subject) : homeworkItems
  const completedIds = completedHomeworkIds(cards)
  const completed = items.filter((item) => completedIds.has(item.id)).length
  return {
    completed,
    total: items.length,
    percent:
      items.length === 0 ? 0 : Math.round((completed / items.length) * 100),
  }
}
