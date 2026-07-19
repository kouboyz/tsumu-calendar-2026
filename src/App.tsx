import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { AlertTriangle, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CardPool } from './components/CardPool'
import {
  DatePickerDialog,
  type DateSelection,
} from './components/DatePickerDialog'
import { HeroHeader } from './components/HeroHeader'
import {
  HomeworkPickerDialog,
  type HomeworkSelection,
} from './components/HomeworkPickerDialog'
import { MissionOutcomeDialog } from './components/MissionOutcomeDialog'
import { SummerRules } from './components/SummerRules'
import { WeekCalendar } from './components/WeekCalendar'
import {
  getInitialWeek,
  remainingDays,
} from './domain/calendar'
import { homeworkProgress } from './domain/homeworkProgress'
import { templateById } from './domain/templates'
import type { CardTemplate, PlannedCard } from './domain/types'
import { usePlanner } from './hooks/usePlanner'

function App() {
  const {
    cards,
    storageError,
    addCard,
    moveCard,
    setOutcome,
    removeCard,
    resetStorage,
  } = usePlanner()
  const [weekStart, setWeekStart] = useState(() => getInitialWeek())
  const [dateSelection, setDateSelection] =
    useState<DateSelection | null>(null)
  const [homeworkSelection, setHomeworkSelection] =
    useState<HomeworkSelection | null>(null)
  const [outcomeCard, setOutcomeCard] = useState<PlannedCard | null>(null)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  )
  const homework = useMemo(() => homeworkProgress(cards), [cards])

  const selectTemplate = (template: CardTemplate) => {
    if (template.kind === 'homework') {
      setHomeworkSelection({ template })
    } else {
      setDateSelection({ template })
    }
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current
    if (data?.type === 'template') {
      setActiveLabel(templateById.get(String(data.templateId))?.label ?? null)
    } else if (data?.type === 'card') {
      setActiveLabel(
        cards.find((card) => card.id === data.cardId)?.title ?? null,
      )
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveLabel(null)
    if (!over) return
    const activeData = active.data.current
    const overData = over.data.current
    if (!activeData || !overData) return
    const date =
      overData.type === 'day' || overData.type === 'card-target'
        ? String(overData.date)
        : null
    if (!date) return
    if (activeData.type === 'template') {
      const template = templateById.get(String(activeData.templateId))
      if (!template) return
      if (template.kind === 'homework') {
        setHomeworkSelection({ template, targetDate: date })
      } else {
        addCard(template.id, date)
      }
    } else if (activeData.type === 'card') {
      moveCard(
        String(activeData.cardId),
        date,
        overData.type === 'card-target' ? String(overData.cardId) : undefined,
      )
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveLabel(null)}
      onDragEnd={handleDragEnd}
    >
      <main className="mx-auto min-h-screen w-full max-w-3xl px-3 py-3 sm:px-6 sm:py-6">
        <HeroHeader
          daysLeft={remainingDays()}
          progress={homework.percent}
          completed={homework.completed}
          total={homework.total}
        />
        {storageError && (
          <div role="alert" className="error-banner">
            <AlertTriangle size={18} className="shrink-0" />
            <p className="flex-1">{storageError}</p>
            <button type="button" onClick={resetStorage}>
              リセット
            </button>
          </div>
        )}
        <div className="mt-4 space-y-4">
          <CardPool cards={cards} onSelect={selectTemplate} />
          <WeekCalendar
            weekStart={weekStart}
            cards={cards}
            onWeekChange={setWeekStart}
            onSelect={setOutcomeCard}
            onRemove={removeCard}
          />
          <SummerRules />
        </div>
        <footer className="py-6 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-black text-[#D65E92]">
            <Sparkles size={14} />
            MY SUMMER, MY STORY
            <Sparkles size={14} />
          </p>
          <p className="mt-1 text-[9px] font-medium text-[#A98A98]">
            記録はこのブラウザの中だけに保存されます
          </p>
        </footer>
      </main>
      <DatePickerDialog
        selection={dateSelection}
        weekStart={weekStart}
        onClose={() => setDateSelection(null)}
        onAdd={addCard}
      />
      <HomeworkPickerDialog
        selection={homeworkSelection}
        cards={cards}
        onClose={() => setHomeworkSelection(null)}
        onSelect={(item) => {
          const selection = homeworkSelection
          if (!selection) return
          if (selection.targetDate) {
            addCard(selection.template.id, selection.targetDate, item.id)
          } else {
            setDateSelection({
              template: selection.template,
              homeworkItem: item,
            })
          }
          setHomeworkSelection(null)
        }}
      />
      <MissionOutcomeDialog
        card={outcomeCard}
        onClose={() => setOutcomeCard(null)}
        onSelect={(outcome) => {
          if (outcomeCard) setOutcome(outcomeCard.id, outcome)
        }}
      />
      <DragOverlay>
        {activeLabel && (
          <div className="rounded-xl border-2 border-[#D65E92] bg-white px-4 py-3 text-xs font-black text-[#A43E6A] shadow-xl">
            {activeLabel}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default App
