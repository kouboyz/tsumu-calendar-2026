import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Check, GripVertical, Trash2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { templateById } from '../domain/templates'
import type { PlannedCard } from '../domain/types'

type PlannerCardProps = {
  card: PlannedCard
  canComplete: boolean
  onToggle: () => void
  onRemove: () => void
}

export function PlannerCard({
  card,
  canComplete,
  onToggle,
  onRemove,
}: PlannerCardProps) {
  const template = templateById.get(card.templateId)
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `card:${card.id}`,
    data: { type: 'card', cardId: card.id, date: card.date },
  })
  const { setNodeRef: setDropRef } = useDroppable({
    id: `target:${card.id}`,
    data: { type: 'card-target', cardId: card.id, date: card.date },
  })
  const setRefs = (node: HTMLElement | null) => {
    setDragRef(node)
    setDropRef(node)
  }
  const style = {
    '--card-bg': template?.color ?? '#F7D8E6',
    '--card-accent': template?.accent ?? '#B74477',
    transform: CSS.Translate.toString(transform),
  } as CSSProperties

  return (
    <article
      ref={setRefs}
      style={style}
      className={`planner-card ${card.kind === 'event' ? 'planner-card--event' : ''} ${card.completed ? 'planner-card--done' : ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label={`${card.title}を移動`}
        {...listeners}
        {...attributes}
      >
        <GripVertical size={15} />
      </button>
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        disabled={!canComplete}
        onClick={onToggle}
        aria-label={
          canComplete
            ? `${card.title}を${card.completed ? '未完了に戻す' : '完了にする'}`
            : `${card.title}（完了チェックは当日だけ）`
        }
      >
        <span className="block truncate text-[11px] font-extrabold leading-tight text-[var(--card-accent)]">
          {card.title}
        </span>
        {card.completed && (
          <span className="mt-1 flex items-center gap-1 text-[9px] font-black text-[#B74477]">
            <Check size={11} strokeWidth={4} /> COMPLETE ★
          </span>
        )}
      </button>
      <button
        type="button"
        className="remove-button"
        aria-label={`${card.title}を削除`}
        onClick={onRemove}
      >
        <Trash2 size={12} />
      </button>
    </article>
  )
}
