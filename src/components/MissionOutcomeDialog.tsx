import { RotateCcw, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { templateById } from '../domain/templates'
import type { MissionOutcome, PlannedCard } from '../domain/types'
import { isDialogBackdropClick } from './dialog'

type MissionOutcomeDialogProps = {
  card: PlannedCard | null
  onClose: () => void
  onSelect: (outcome: MissionOutcome) => void
}

export function MissionOutcomeDialog({
  card,
  onClose,
  onSelect,
}: MissionOutcomeDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (card && dialog && !dialog.open) dialog.showModal()
    if (!card && dialog?.open) dialog.close()
  }, [card])

  if (!card) return null
  const template = templateById.get(card.templateId)
  const title = card.kind === 'event' && template ? template.label : card.title
  const choose = (outcome: MissionOutcome) => {
    onSelect(outcome)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="outcome-dialog"
      onClose={onClose}
      onClick={(event) => {
        if (isDialogBackdropClick(event, dialogRef.current)) onClose()
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">HOW DID IT GO?</p>
          <h2 className="text-lg font-black text-[#442A37]">{title}</h2>
          <p className="mt-1 text-[10px] font-bold text-[#927482]">
            今日の結果をマークしよう
          </p>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="結果選択を閉じる"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="outcome-choice outcome-choice--completed"
          aria-pressed={card.outcome === 'completed'}
          onClick={() => choose('completed')}
        >
          <span aria-hidden="true">⭐</span>
          <strong>終わった</strong>
        </button>
        <button
          type="button"
          className="outcome-choice outcome-choice--incomplete"
          aria-pressed={card.outcome === 'incomplete'}
          onClick={() => choose('incomplete')}
        >
          <span aria-hidden="true">💦</span>
          <strong>終わらなかった</strong>
        </button>
      </div>
      {card.outcome !== 'pending' && (
        <button
          type="button"
          className="mx-auto mt-3 flex items-center gap-1 text-[10px] font-bold text-[#927482]"
          onClick={() => choose('pending')}
        >
          <RotateCcw size={12} /> マークを取り消す
        </button>
      )}
    </dialog>
  )
}
