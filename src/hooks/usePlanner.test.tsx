import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../domain/storage'
import { usePlanner } from './usePlanner'

describe('usePlanner', () => {
  beforeEach(() => localStorage.clear())

  it('adds numbered homework, moves it, and persists changes', async () => {
    const { result } = renderHook(() => usePlanner())

    act(() => {
      result.current.addCard('homework-math', '2026-07-19')
      result.current.addCard('homework-math', '2026-07-20')
    })

    expect(result.current.cards.map((card) => card.title)).toEqual([
      '数学 1',
      '数学 2',
    ])

    const firstId = result.current.cards[0]!.id
    act(() => result.current.moveCard(firstId, '2026-07-21'))
    expect(result.current.cards.find((card) => card.id === firstId)?.date).toBe(
      '2026-07-21',
    )

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY)).toContain('数学 1')
    })
  })

  it('only toggles completion for a card on today', () => {
    const { result } = renderHook(() => usePlanner())
    act(() => result.current.addCard('event-festival', '2026-07-19'))
    const id = result.current.cards[0]!.id

    act(() => result.current.toggleComplete(id, '2026-07-20'))
    expect(result.current.cards[0]!.completed).toBe(false)

    act(() => result.current.toggleComplete(id, '2026-07-19'))
    expect(result.current.cards[0]!.completed).toBe(true)
  })
})
