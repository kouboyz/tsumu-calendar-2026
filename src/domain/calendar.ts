import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { ja } from 'date-fns/locale'

export const VACATION_START = new Date(2026, 6, 18)
export const VACATION_END = new Date(2026, 7, 26)

export const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd')
export const fromDateKey = (key: string) => parseISO(key)

export const isVacationDate = (date: Date) =>
  isWithinInterval(date, { start: VACATION_START, end: VACATION_END })

export const getInitialWeek = (today = new Date()) => {
  const clamped = isBefore(today, VACATION_START)
    ? VACATION_START
    : isAfter(today, VACATION_END)
      ? VACATION_END
      : today
  return startOfWeek(clamped, { weekStartsOn: 0 })
}

export const getWeekDays = (weekStart: Date) =>
  eachDayOfInterval({
    start: startOfWeek(weekStart, { weekStartsOn: 0 }),
    end: endOfWeek(weekStart, { weekStartsOn: 0 }),
  })

export const canMoveWeek = (weekStart: Date, direction: -1 | 1) => {
  const next = addDays(weekStart, direction * 7)
  return direction < 0
    ? !isBefore(endOfWeek(next), VACATION_START)
    : !isAfter(startOfWeek(next), VACATION_END)
}

export const remainingDays = (today = new Date()) => {
  const day = startOfDay(today)
  if (isBefore(day, VACATION_START)) {
    return differenceInCalendarDays(VACATION_END, VACATION_START) + 1
  }
  if (isAfter(day, VACATION_END)) return 0
  return differenceInCalendarDays(VACATION_END, day)
}

export const formatWeekRange = (weekStart: Date) => {
  const end = addDays(weekStart, 6)
  return `${format(weekStart, 'M月d日', { locale: ja })} — ${format(end, 'M月d日', { locale: ja })}`
}

export const isToday = (date: Date, today = new Date()) =>
  isSameDay(date, today)
