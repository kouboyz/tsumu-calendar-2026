import { useCallback, useEffect, useRef, useState } from 'react'
import { templateById } from '../domain/templates'
import {
  homeworkItemById,
  homeworkItemTitle,
} from '../data/homework'
import {
  parsePlannerState,
  serializePlannerState,
  STORAGE_KEY,
} from '../domain/storage'
import type { MissionOutcome, PlannedCard } from '../domain/types'

type LoadedState = {
  cards: PlannedCard[]
  error: string | null
}

const loadState = (): LoadedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { cards: parsePlannerState(raw).cards, error: null } : { cards: [], error: null }
  } catch {
    return {
      cards: [],
      error: '保存したデータを読み込めませんでした。リセットしてやり直してください。',
    }
  }
}

const createId = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export function usePlanner() {
  const [{ cards: initialCards, error: initialError }] = useState(loadState)
  const [cards, setCards] = useState(initialCards)
  const [storageError, setStorageError] = useState<string | null>(initialError)
  const canPersist = useRef(!initialError)

  useEffect(() => {
    if (!canPersist.current) return
    try {
      localStorage.setItem(STORAGE_KEY, serializePlannerState(cards))
      setStorageError(null)
    } catch {
      setStorageError('このブラウザでは記録を保存できません。空き容量や設定を確認してください。')
    }
  }, [cards])

  const addCard = useCallback((
    templateId: string,
    date: string,
    homeworkItemId?: string,
  ) => {
    const template = templateById.get(templateId)
    if (!template) return
    const homeworkItem = homeworkItemId
      ? homeworkItemById.get(homeworkItemId)
      : undefined
    if (homeworkItemId && !homeworkItem) return
    setCards((current) => {
      const number =
        template.kind === 'homework' && !homeworkItem
          ? current.filter((card) => card.templateId === templateId).length + 1
          : null
      const card: PlannedCard = {
        id: createId(),
        templateId,
        title: homeworkItem
          ? homeworkItemTitle(homeworkItem)
          : number
            ? `${template.label} ${number}`
            : template.label,
        kind: template.kind,
        date,
        ...(homeworkItem ? { homeworkItemId: homeworkItem.id } : {}),
        outcome: 'pending',
        createdAt: Date.now(),
      }
      return [...current, card]
    })
  }, [])

  const moveCard = useCallback(
    (cardId: string, date: string, beforeCardId?: string) => {
      setCards((current) => {
        const moving = current.find((card) => card.id === cardId)
        if (!moving) return current
        const withoutMoving = current.filter((card) => card.id !== cardId)
        const updated = { ...moving, date }
        if (!beforeCardId) return [...withoutMoving, updated]
        const targetIndex = withoutMoving.findIndex(
          (card) => card.id === beforeCardId,
        )
        if (targetIndex < 0) return [...withoutMoving, updated]
        return [
          ...withoutMoving.slice(0, targetIndex),
          updated,
          ...withoutMoving.slice(targetIndex),
        ]
      })
    },
    [],
  )

  const setOutcome = useCallback((
    cardId: string,
    outcome: MissionOutcome,
  ) => {
    setCards((current) =>
      current.map((card) =>
        card.id === cardId
          ? { ...card, outcome }
          : card,
      ),
    )
  }, [])

  const removeCard = useCallback((cardId: string) => {
    setCards((current) => current.filter((card) => card.id !== cardId))
  }, [])

  const resetStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      canPersist.current = true
      setCards([])
      setStorageError(null)
    } catch {
      setStorageError('保存データをリセットできませんでした。ブラウザの設定を確認してください。')
    }
  }, [])

  return {
    cards,
    storageError,
    addCard,
    moveCard,
    setOutcome,
    removeCard,
    resetStorage,
  }
}
