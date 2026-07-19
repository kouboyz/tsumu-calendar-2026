import { describe, expect, it } from 'vitest'
import {
  homeworkProgress,
  subjectFromTemplateId,
} from './homeworkProgress'
import type { PlannedCard } from './types'

const mission = (
  id: string,
  homeworkItemId: string,
  outcome: PlannedCard['outcome'],
): PlannedCard => ({
  id,
  templateId: 'homework-math',
  title: 'ワーク',
  kind: 'homework',
  date: '2026-07-19',
  homeworkItemId,
  outcome,
  createdAt: 1,
})

describe('homework progress', () => {
  it('uses master items as the denominator and unique completions as numerator', () => {
    const cards = [
      mission('1', 'math-work-page-36', 'completed'),
      mission('2', 'math-work-page-36', 'completed'),
      mission('3', 'math-work-page-37', 'incomplete'),
    ]
    expect(homeworkProgress(cards, 'math')).toEqual({
      completed: 1,
      total: 23,
      percent: 4,
    })
    expect(homeworkProgress(cards)).toMatchObject({
      completed: 1,
      total: 172,
    })
  })

  it('maps homework templates to master subjects', () => {
    expect(subjectFromTemplateId('homework-home-economics')).toBe(
      'home-economics',
    )
    expect(subjectFromTemplateId('event-trip')).toBeNull()
  })
})
