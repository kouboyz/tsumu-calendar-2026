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

  it('selects master homework, schedules it, and records the result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)

    await user.click(screen.getByRole('button', { name: '数学を日付に追加' }))
    const homeworkDialog = screen.getByRole('dialog')
    await user.click(
      within(homeworkDialog).getByRole('button', { name: /ワーク P36/ }),
    )

    const dateDialog = screen.getByRole('dialog')
    await user.click(within(dateDialog).getByRole('button', { name: '月20' }))
    expect(screen.getByText('ワーク P36')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'ワーク P36の結果を記録' }),
    )
    const outcomeDialog = screen.getByRole('dialog')
    await user.click(
      within(outcomeDialog).getByRole('button', { name: '終わった' }),
    )

    expect(
      screen.getByRole('img', { name: 'ワーク P36: 終わった' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('⭐ 終わった')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'ワーク P36を削除' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: '数学の進捗' }),
    ).toHaveAttribute('aria-valuenow', '4')

    await user.click(
      screen.getByRole('button', { name: 'ワーク P36の結果を記録' }),
    )
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: '終わらなかった',
      }),
    )

    expect(
      screen.getByRole('img', { name: 'ワーク P36: 終わらなかった' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('💦 終わらなかった')).not.toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: '数学の進捗' }),
    ).toHaveAttribute('aria-valuenow', '0')
  })
})
