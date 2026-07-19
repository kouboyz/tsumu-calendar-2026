import { describe, expect, it } from 'vitest'
import {
  getInitialWeek,
  getWeekDays,
  remainingDays,
  toDateKey,
} from './calendar'

describe('calendar domain', () => {
  it('clamps the initial week to the fixed vacation', () => {
    expect(toDateKey(getInitialWeek(new Date(2026, 0, 1)))).toBe('2026-07-12')
    expect(toDateKey(getInitialWeek(new Date(2026, 9, 1)))).toBe('2026-08-30')
  })

  it('builds a Sunday-to-Saturday week', () => {
    const days = getWeekDays(new Date(2026, 6, 19)).map(toDateKey)
    expect(days).toEqual([
      '2026-07-19',
      '2026-07-20',
      '2026-07-21',
      '2026-07-22',
      '2026-07-23',
      '2026-07-24',
      '2026-07-25',
    ])
  })

  it('calculates countdown without going below zero', () => {
    expect(remainingDays(new Date(2026, 6, 19))).toBe(43)
    expect(remainingDays(new Date(2026, 7, 31))).toBe(0)
    expect(remainingDays(new Date(2026, 8, 1))).toBe(0)
  })
})
