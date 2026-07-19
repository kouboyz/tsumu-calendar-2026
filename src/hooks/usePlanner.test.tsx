import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../domain/storage'
import { usePlanner } from './usePlanner'

describe('usePlanner', () => {
  beforeEach(() => localStorage.clear())

  it('adds a master homework item, moves it, and persists changes', async () => {
    const { result } = renderHook(() => usePlanner())

    act(() => {
      result.current.addCard(
        'homework-math',
        '2026-07-19',
        'math-work-page-36',
      )
    })

    expect(result.current.cards[0]).toMatchObject({
      title: 'ワーク P36',
      homeworkItemId: 'math-work-page-36',
      outcome: 'pending',
    })

    const firstId = result.current.cards[0]!.id
    act(() => result.current.moveCard(firstId, '2026-07-21'))
    expect(result.current.cards[0]!.date).toBe('2026-07-21')

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY)).toContain('math-work-page-36')
    })
  })

  it('records all three mission outcomes', () => {
    const { result } = renderHook(() => usePlanner())
    act(() => result.current.addCard('event-lesson', '2026-07-19'))
    const id = result.current.cards[0]!.id

    act(() => result.current.setOutcome(id, 'incomplete'))
    expect(result.current.cards[0]!.outcome).toBe('incomplete')

    act(() => result.current.setOutcome(id, 'completed'))
    expect(result.current.cards[0]!.outcome).toBe('completed')

    act(() => result.current.setOutcome(id, 'pending'))
    expect(result.current.cards[0]!.outcome).toBe('pending')
  })
})
