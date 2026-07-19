import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { CalendarPlus, GripVertical, PartyPopper } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import {
  homeworkProgress,
  subjectFromTemplateId,
} from '../domain/homeworkProgress'
import {
  eventTemplates,
  homeworkTemplates,
} from '../domain/templates'
import type {
  CardKind,
  CardTemplate,
  PlannedCard,
} from '../domain/types'

type PoolCardProps = {
  template: CardTemplate
  progress?: {
    completed: number
    total: number
    percent: number
  }
  onSelect: (template: CardTemplate) => void
}

function PoolCard({ template, progress, onSelect }: PoolCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `template:${template.id}`,
      data: { type: 'template', templateId: template.id },
    })
  const style = {
    '--card-bg': template.color,
    '--card-accent': template.accent,
    transform: CSS.Translate.toString(transform),
  } as CSSProperties

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`pool-card ${template.kind === 'event' ? 'pool-card--event' : ''} ${isDragging ? 'opacity-40' : ''}`}
    >
      <button
        type="button"
        className="absolute right-1 top-1 rounded-full p-1 text-[var(--card-accent)]"
        aria-label={`${template.label}をドラッグ`}
        {...listeners}
        {...attributes}
      >
        <GripVertical size={16} />
      </button>
      <button
        type="button"
        className="flex h-full w-full flex-col items-start justify-end text-left"
        onClick={() => onSelect(template)}
        aria-label={`${template.label}を日付に追加`}
      >
        <span className="mb-auto text-2xl" aria-hidden="true">
          {template.icon}
        </span>
        <strong className="mt-2 block max-w-full text-xs leading-tight text-[var(--card-accent)]">
          {template.label}
        </strong>
        {progress ? (
          <span className="mt-1 block w-full">
            <span className="flex justify-between text-[8px] font-black text-[var(--card-accent)]">
              <span>進捗</span>
              <span>{progress.completed}/{progress.total}</span>
            </span>
            <span
              className="mt-0.5 block h-1.5 overflow-hidden rounded-full bg-white/65"
              role="progressbar"
              aria-label={`${template.label}の進捗`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
            >
              <span
                className="block h-full rounded-full bg-[var(--card-accent)] transition-[width]"
                style={{ width: `${progress.percent}%` }}
              />
            </span>
          </span>
        ) : (
          <span className="mt-1 flex items-center gap-1 text-[9px] font-bold text-[var(--card-accent)]/70">
            <CalendarPlus size={11} />
            タップで追加
          </span>
        )}
      </button>
    </article>
  )
}

type CardPoolProps = {
  cards: PlannedCard[]
  onSelect: (template: CardTemplate) => void
}

export function CardPool({ cards, onSelect }: CardPoolProps) {
  const [tab, setTab] = useState<CardKind>('homework')
  const templates = tab === 'homework' ? homeworkTemplates : eventTemplates
  const progressFor = (template: CardTemplate) => {
    const subject = subjectFromTemplateId(template.id)
    return subject ? homeworkProgress(cards, subject) : undefined
  }

  return (
    <section aria-labelledby="pool-title" className="section-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">CARD POOL</p>
          <h2 id="pool-title" className="section-title">
            予定カードをえらぼう
          </h2>
        </div>
        <span className="hidden items-center gap-1 text-[10px] font-bold text-[#927482] sm:flex">
          <GripVertical size={13} /> カレンダーへドラッグ
        </span>
      </div>
      <div className="mb-3 grid grid-cols-2 rounded-xl bg-[#F8EDF2] p-1">
        <button
          type="button"
          className={`tab-button ${tab === 'homework' ? 'tab-button--active' : ''}`}
          aria-pressed={tab === 'homework'}
          onClick={() => setTab('homework')}
        >
          📚 夏休みの宿題
        </button>
        <button
          type="button"
          className={`tab-button ${tab === 'event' ? 'tab-button--active' : ''}`}
          aria-pressed={tab === 'event'}
          onClick={() => setTab('event')}
        >
          <PartyPopper size={14} /> イベント
        </button>
      </div>
      <div className="card-scroll" role="list">
        {templates.map((template) => (
          <div role="listitem" key={template.id}>
            <PoolCard
              template={template}
              progress={
                template.kind === 'homework' ? progressFor(template) : undefined
              }
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] font-medium text-[#927482]">
        同じカードを何回でも追加できるよ
      </p>
    </section>
  )
}
