import { describe, expect, it } from 'vitest'
import { eventTemplates } from './templates'

describe('event templates', () => {
  it('provides the requested event choices', () => {
    expect(eventTemplates.map(({ id, label, icon }) => ({ id, label, icon }))).toEqual(
      expect.arrayContaining([
        { id: 'event-friends', label: '友だち', icon: '💞' },
        { id: 'event-lesson', label: '習い事', icon: '🌺' },
      ]),
    )
    expect(eventTemplates.some((template) => template.label === 'お祭り')).toBe(
      false,
    )
  })
})
