import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date(2026, 6, 19, 10))
  })

  afterEach(() => vi.useRealTimers())

  it('adds a homework card by tapping and completes today’s card', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)

    await user.click(screen.getByRole('button', { name: '数学を日付に追加' }))
    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: '日19' }))

    expect(screen.getByText('数学 1')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', { name: '数学 1を完了にする' }),
    )
    expect(screen.getByText('COMPLETE ★')).toBeInTheDocument()
  })
})
