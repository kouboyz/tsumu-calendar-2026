import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarPlus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  getWeekDays,
  isVacationDate,
  toDateKey,
} from '../domain/calendar'
import type { HomeworkItem } from '../data/homework'
import type { CardTemplate } from '../domain/types'
import { isDialogBackdropClick } from './dialog'

export type DateSelection = {
  template: CardTemplate
  homeworkItem?: HomeworkItem
}

type DatePickerDialogProps = {
  selection: DateSelection | null
  weekStart: Date
  onClose: () => void
  onAdd: (
    templateId: string,
    date: string,
    homeworkItemId?: string,
  ) => void
}

export function DatePickerDialog({
  selection,
  weekStart,
  onClose,
  onAdd,
}: DatePickerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (selection && dialog && !dialog.open) dialog.showModal()
    if (!selection && dialog?.open) dialog.close()
  }, [selection])

  if (!selection) return null
  const { template, homeworkItem } = selection

  return (
    <dialog
      ref={dialogRef}
      className="date-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (isDialogBackdropClick(event, dialogRef.current)) onClose()
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">ADD TO CALENDAR</p>
          <h2 className="text-lg font-black text-[#442A37]">
            {template.icon} {homeworkItem?.title ?? template.label}をいつやる？
          </h2>
          {homeworkItem?.group && (
            <p className="mt-0.5 text-[10px] font-bold text-[#A46C84]">
              {homeworkItem.group}
            </p>
          )}
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {getWeekDays(weekStart).map((date) => {
          const enabled = isVacationDate(date)
          return (
            <button
              type="button"
              key={toDateKey(date)}
              disabled={!enabled}
              className="date-choice"
              onClick={() => {
                onAdd(template.id, toDateKey(date), homeworkItem?.id)
                onClose()
              }}
            >
              <span className="text-[9px]">{format(date, 'E', { locale: ja })}</span>
              <strong>{format(date, 'd')}</strong>
            </button>
          )
        })}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-[#927482]">
        <CalendarPlus size={12} />
        別の週に追加するときは、先にカレンダーの週を移動してね
      </p>
    </dialog>
  )
}
