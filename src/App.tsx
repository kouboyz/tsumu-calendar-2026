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
import { DatePickerDialog } from './components/DatePickerDialog'
import { HeroHeader } from './components/HeroHeader'
import { WeekCalendar } from './components/WeekCalendar'
import {
  getInitialWeek,
  progressPercent,
  remainingDays,
  toDateKey,
} from './domain/calendar'
import { templateById } from './domain/templates'
import type { CardTemplate } from './domain/types'
import { usePlanner } from './hooks/usePlanner'

function App() {
  const {
    cards,
    storageError,
    addCard,
    moveCard,
    toggleComplete,
    removeCard,
    resetStorage,
  } = usePlanner()
  const [weekStart, setWeekStart] = useState(() => getInitialWeek())
  const [selectedTemplate, setSelectedTemplate] =
    useState<CardTemplate | null>(null)
  const [activeLabel, setActiveLabel] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  )
  const todayKey = toDateKey(new Date())
  const progress = progressPercent(cards)
  const completed = useMemo(
    () => cards.filter((card) => card.completed).length,
    [cards],
  )

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
      addCard(String(activeData.templateId), date)
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
          progress={progress}
          completed={completed}
          total={cards.length}
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
          <CardPool onSelect={setSelectedTemplate} />
          <WeekCalendar
            weekStart={weekStart}
            cards={cards}
            todayKey={todayKey}
            onWeekChange={setWeekStart}
            onToggle={(cardId) => toggleComplete(cardId, todayKey)}
            onRemove={removeCard}
          />
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
        template={selectedTemplate}
        weekStart={weekStart}
        onClose={() => setSelectedTemplate(null)}
        onAdd={addCard}
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
