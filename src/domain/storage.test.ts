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

  it('rejects malformed or unsupported data', () => {
    expect(() => parsePlannerState('{"version":3,"cards":[]}')).toThrow()
    expect(() => parsePlannerState('{"version":2,"cards":[{}]}')).toThrow()
    expect(() => parsePlannerState('{"version":1,"cards":[]}')).toThrow()
    expect(() => parsePlannerState('not-json')).toThrow()
  })
})
