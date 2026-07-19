import { describe, expect, it } from 'vitest'
import { parsePlannerState, serializePlannerState } from './storage'
import type { PlannedCard } from './types'

const cards: PlannedCard[] = [
  {
    id: 'card-1',
    templateId: 'homework-math',
    title: 'ワーク P36',
    kind: 'homework',
    date: '2026-07-19',
    homeworkItemId: 'math-work-page-36',
    outcome: 'incomplete',
    createdAt: 1,
  },
]

describe('planner storage', () => {
  it('round-trips a versioned planner state', () => {
    expect(parsePlannerState(serializePlannerState(cards))).toEqual({
      version: 2,
      cards,
    })
  })

  it('migrates completion from version one', () => {
    const oldState = JSON.stringify({
      version: 1,
      cards: [
        {
          id: 'old-card',
          templateId: 'homework-math',
          title: '数学 1',
          kind: 'homework',
          date: '2026-07-19',
          completed: true,
          createdAt: 1,
        },
      ],
    })
    expect(parsePlannerState(oldState).cards[0]).toMatchObject({
      id: 'old-card',
      title: 'ワーク P36',
      homeworkItemId: 'math-work-page-36',
      outcome: 'completed',
    })
  })

  it('rejects malformed or unsupported data', () => {
    expect(() => parsePlannerState('{"version":3,"cards":[]}')).toThrow()
    expect(() => parsePlannerState('{"version":2,"cards":[{}]}')).toThrow()
    expect(() => parsePlannerState('not-json')).toThrow()
  })
})
