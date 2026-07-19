import { describe, expect, it } from 'vitest'
import {
  homeworkItems,
  homeworkItemsBySubject,
  summerRules,
  type HomeworkSubject,
} from './homework'

describe('homework master', () => {
  it('contains every provided homework item by subject', () => {
    const expectedCounts: Record<HomeworkSubject, number> = {
      common: 76,
      japanese: 4,
      math: 23,
      social: 20,
      science: 23,
      english: 19,
      music: 1,
      art: 1,
      technology: 1,
      'home-economics': 4,
    }

    expect(homeworkItems).toHaveLength(172)
    for (const [subject, count] of Object.entries(expectedCounts)) {
      expect(homeworkItemsBySubject(subject as HomeworkSubject)).toHaveLength(
        count,
      )
    }
  })

  it('uses stable unique IDs and stores the four summer rules separately', () => {
    expect(new Set(homeworkItems.map((item) => item.id)).size).toBe(
      homeworkItems.length,
    )
    expect(summerRules).toHaveLength(4)
  })
})
