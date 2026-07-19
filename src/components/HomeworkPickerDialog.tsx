import { Check, ChevronRight, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  homeworkItemsBySubject,
  type HomeworkItem,
} from '../data/homework'
import {
  completedHomeworkIds,
  subjectFromTemplateId,
} from '../domain/homeworkProgress'
import type { CardTemplate, PlannedCard } from '../domain/types'
import { isDialogBackdropClick } from './dialog'

export type HomeworkSelection = {
  template: CardTemplate
  targetDate?: string
}

type HomeworkPickerDialogProps = {
  selection: HomeworkSelection | null
  cards: PlannedCard[]
  onClose: () => void
  onSelect: (item: HomeworkItem) => void
}

export function HomeworkPickerDialog({
  selection,
  cards,
  onClose,
  onSelect,
}: HomeworkPickerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [showAll, setShowAll] = useState(false)
  const subject = selection
    ? subjectFromTemplateId(selection.template.id)
    : null
  const completedIds = useMemo(() => completedHomeworkIds(cards), [cards])
  const scheduledIds = useMemo(
    () =>
      new Set(
        cards.flatMap((card) =>
          card.homeworkItemId ? [card.homeworkItemId] : [],
        ),
      ),
    [cards],
  )
  const allItems = useMemo(
    () => (subject ? homeworkItemsBySubject(subject) : []),
    [subject],
  )
  const visibleItems = useMemo(
    () =>
      showAll
        ? allItems
        : allItems.filter((item) => !completedIds.has(item.id)),
    [allItems, completedIds, showAll],
  )
  const groups = useMemo(() => {
    const grouped = new Map<string, HomeworkItem[]>()
    for (const item of visibleItems) {
      const key = item.group ?? '宿題'
      grouped.set(key, [...(grouped.get(key) ?? []), item])
    }
    return [...grouped.entries()]
  }, [visibleItems])
  const groupStats = useMemo(() => {
    const stats = new Map<string, { completed: number; total: number }>()
    for (const item of allItems) {
      const key = item.group ?? '宿題'
      const current = stats.get(key) ?? { completed: 0, total: 0 }
      stats.set(key, {
        completed: current.completed + (completedIds.has(item.id) ? 1 : 0),
        total: current.total + 1,
      })
    }
    return stats
  }, [allItems, completedIds])
  const completedCount = allItems.filter((item) =>
    completedIds.has(item.id),
  ).length

  useEffect(() => {
    setShowAll(false)
  }, [selection?.template.id])

  useEffect(() => {
    const dialog = dialogRef.current
    if (selection && dialog && !dialog.open) dialog.showModal()
    if (!selection && dialog?.open) dialog.close()
  }, [selection])

  if (!selection) return null

  return (
    <dialog
      ref={dialogRef}
      className="homework-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (isDialogBackdropClick(event, dialogRef.current)) onClose()
      }}
    >
      <div className="sticky top-0 z-10 bg-white pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">CHOOSE HOMEWORK</p>
            <h2 className="text-lg font-black text-[#442A37]">
              {selection.template.icon} {selection.template.label}の宿題
            </h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="宿題一覧を閉じる"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex justify-between text-[10px] font-black text-[#A3436C]">
              <span>教科の進捗</span>
              <span>{completedCount}/{allItems.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#F6E3EB]">
              <div
                className="h-full rounded-full bg-[#D65E92]"
                style={{
                  width: `${allItems.length === 0 ? 0 : (completedCount / allItems.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-[#EBC8D7] px-3 py-1.5 text-[10px] font-black text-[#A3436C]"
            aria-pressed={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? '未完了だけ' : 'すべて表示'}
          </button>
        </div>
        {selection.targetDate && (
          <p className="mt-2 rounded-lg bg-[#FFF3F8] px-3 py-2 text-center text-[10px] font-bold text-[#A3436C]">
            宿題を選ぶと、この日に追加します
          </p>
        )}
      </div>

      <div className="space-y-2">
        {groups.map(([group, items], groupIndex) => {
          const stats = groupStats.get(group) ?? {
            completed: 0,
            total: items.length,
          }
          return (
            <details
              key={group}
              className="homework-group"
              open={groups.length === 1 || groupIndex === 0}
            >
              <summary>
                <span>{group}</span>
                <span className="ml-auto text-[10px] text-[#A46C84]">
                  {stats.completed}/{stats.total}
                </span>
                <ChevronRight size={16} className="details-chevron" />
              </summary>
              <div className="border-t border-[#F2DCE5]">
                {items.map((item) => {
                  const completed = completedIds.has(item.id)
                  const scheduled = scheduledIds.has(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="homework-row"
                      onClick={() => onSelect(item)}
                    >
                      <span
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${completed ? 'bg-[#D65E92] text-white' : 'bg-[#FFF0F6] text-[#C55585]'}`}
                      >
                        {completed ? <Check size={14} strokeWidth={3} /> : '○'}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <strong className="block truncate text-xs text-[#513542]">
                          {item.title}
                        </strong>
                        <span className="text-[9px] font-bold text-[#A98A98]">
                          {completed
                            ? '⭐ 完了済み'
                            : scheduled
                              ? 'カレンダーに予定あり'
                              : 'まだ予定なし'}
                        </span>
                      </span>
                      <span className="text-[10px] font-black text-[#C04F80]">
                        えらぶ
                      </span>
                    </button>
                  )
                })}
              </div>
            </details>
          )
        })}
        {groups.length === 0 && (
          <div className="rounded-2xl bg-[#FFF5F9] px-4 py-8 text-center">
            <span className="text-3xl">🎉</span>
            <p className="mt-2 text-sm font-black text-[#A3436C]">
              この教科は全部おわったよ！
            </p>
          </div>
        )}
      </div>
    </dialog>
  )
}
