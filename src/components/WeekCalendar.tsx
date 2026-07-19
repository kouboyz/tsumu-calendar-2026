import { useDroppable } from '@dnd-kit/core'
import { addDays, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import { useRef } from 'react'
import {
  canMoveWeek,
  formatWeekRange,
  getWeekDays,
  isToday,
  isVacationDate,
  toDateKey,
} from '../domain/calendar'
import type { PlannedCard } from '../domain/types'
import { PlannerCard } from './PlannerCard'

type DayColumnProps = {
  date: Date
  cards: PlannedCard[]
  onSelect: (card: PlannedCard) => void
  onRemove: (cardId: string) => void
}

function DayColumn({
  date,
  cards,
  onSelect,
  onRemove,
}: DayColumnProps) {
  const dateKey = toDateKey(date)
  const enabled = isVacationDate(date)
  const today = isToday(date)
  const { setNodeRef, isOver } = useDroppable({
    id: `day:${dateKey}`,
    disabled: !enabled,
    data: { type: 'day', date: dateKey },
  })

  return (
    <div
      ref={setNodeRef}
      className={`day-column ${today ? 'day-column--today' : ''} ${!enabled ? 'day-column--disabled' : ''} ${isOver ? 'day-column--over' : ''}`}
    >
      <div className="day-heading">
        <span>{format(date, 'E', { locale: ja })}</span>
        <strong>{format(date, 'd')}</strong>
        {today && <em>TODAY</em>}
      </div>
      <div className="min-h-20 space-y-1.5 p-1">
        {enabled && cards.length === 0 && (
          <span className="drop-hint">＋</span>
        )}
        {cards.map((card) => (
          <PlannerCard
            key={card.id}
            card={card}
            onSelect={() => onSelect(card)}
            onRemove={() => onRemove(card.id)}
          />
        ))}
      </div>
    </div>
  )
}

type WeekCalendarProps = {
  weekStart: Date
  cards: PlannedCard[]
  onWeekChange: (date: Date) => void
  onSelect: (card: PlannedCard) => void
  onRemove: (cardId: string) => void
}

export function WeekCalendar({
  weekStart,
  cards,
  onWeekChange,
  onSelect,
  onRemove,
}: WeekCalendarProps) {
  const touchStart = useRef<number | null>(null)
  const previousEnabled = canMoveWeek(weekStart, -1)
  const nextEnabled = canMoveWeek(weekStart, 1)
  const moveWeek = (direction: -1 | 1) => {
    if (canMoveWeek(weekStart, direction)) {
      onWeekChange(addDays(weekStart, direction * 7))
    }
  }

  return (
    <section
      aria-labelledby="calendar-title"
      className="section-card"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const end = event.changedTouches[0]?.clientX
        touchStart.current = null
        if (start == null || end == null || Math.abs(end - start) < 70) return
        moveWeek(end < start ? 1 : -1)
      }}
    >
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="eyebrow">MY CALENDAR</p>
          <h2 id="calendar-title" className="section-title">
            今週のミッション
          </h2>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-bold text-[#927482]">
          <MoveHorizontal size={13} /> スワイプで週移動
        </span>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="week-button"
          disabled={!previousEnabled}
          onClick={() => moveWeek(-1)}
          aria-label="前の週"
        >
          <ChevronLeft size={20} />
        </button>
        <strong className="text-sm font-black text-[#442A37]">
          {formatWeekRange(weekStart)}
        </strong>
        <button
          type="button"
          className="week-button"
          disabled={!nextEnabled}
          onClick={() => moveWeek(1)}
          aria-label="次の週"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendar-grid">
        {getWeekDays(weekStart).map((date) => {
          const dateKey = toDateKey(date)
          return (
            <DayColumn
              key={dateKey}
              date={date}
              cards={cards.filter((card) => card.date === dateKey)}
              onSelect={onSelect}
              onRemove={onRemove}
            />
          )
        })}
      </div>
      <p className="mt-3 rounded-xl bg-[#FFF3F8] px-3 py-2 text-center text-[10px] font-bold text-[#A3436C]">
        カードをタップして ⭐ 終わった／💦 終わらなかった を記録
      </p>
    </section>
  )
}
