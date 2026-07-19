import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import { templateById } from '../domain/templates'
import type { PlannedCard } from '../domain/types'

type PlannerCardProps = {
  card: PlannedCard
  onSelect: () => void
  onRemove: () => void
}

export function PlannerCard({
  card,
  onSelect,
  onRemove,
}: PlannerCardProps) {
  const template = templateById.get(card.templateId)
  const title =
    card.kind === 'event' && template ? template.label : card.title
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
      className={`planner-card ${card.kind === 'event' ? 'planner-card--event' : ''} ${card.outcome === 'completed' ? 'planner-card--done' : ''} ${card.outcome === 'incomplete' ? 'planner-card--incomplete' : ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label={`${title}を移動`}
        {...listeners}
        {...attributes}
      >
        <GripVertical size={15} />
      </button>
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={onSelect}
        aria-label={`${title}の結果を記録`}
      >
        <span className="block truncate text-[11px] font-extrabold leading-tight text-[var(--card-accent)]">
          {title}
        </span>
        {card.outcome !== 'pending' && (
          <span className="mt-1 block text-[8px] font-black text-[#B74477]">
            {card.outcome === 'completed'
              ? '⭐ 終わった'
              : '💦 終わらなかった'}
          </span>
        )}
      </button>
      <button
        type="button"
        className="remove-button"
        aria-label={`${title}を削除`}
        onClick={onRemove}
      >
        <Trash2 size={12} />
      </button>
    </article>
  )
}
