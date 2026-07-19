import type { CardTemplate } from './types'

const subjects = [
  ['common', '共通', '📚', '#F7D8E6', '#B74477'],
  ['japanese', '国語', '📕', '#FFD9DE', '#D04B61'],
  ['math', '数学', '📐', '#D8E7FF', '#4778C7'],
  ['social', '社会', '🌏', '#FFE4C2', '#C97628'],
  ['science', '理科', '🧪', '#D5F1E2', '#378961'],
  ['english', '英語', '🔤', '#E4DBFF', '#7655C5'],
  ['music', '音楽', '🎵', '#FFE0F1', '#C44E91'],
  ['art', '美術', '🎨', '#FFF0BD', '#B47A17'],
  ['technology', '技術', '⚙️', '#D8EFF3', '#3F7C87'],
  ['home-economics', '家庭', '🧵', '#FFE1D4', '#BD6647'],
] as const

export const homeworkTemplates: CardTemplate[] = subjects.map(
  ([id, label, icon, color, accent]) => ({
    id: `homework-${id}`,
    label,
    icon,
    color,
    accent,
    kind: 'homework',
  }),
)

export const eventTemplates: CardTemplate[] = [
  {
    id: 'event-friends',
    label: '友だち',
    icon: '💞',
    color: '#FFE0F0',
    accent: '#C94384',
    kind: 'event',
  },
  {
    id: 'event-lesson',
    label: '習い事',
    icon: '🌺',
    color: '#FFE3D5',
    accent: '#C65E46',
    kind: 'event',
  },
  {
    id: 'event-trip',
    label: '旅行',
    icon: '🧳',
    color: '#DDF1FF',
    accent: '#377EA7',
    kind: 'event',
  },
  {
    id: 'event-club',
    label: '部活',
    icon: '🏅',
    color: '#FFF0C7',
    accent: '#B47718',
    kind: 'event',
  },
  {
    id: 'event-family',
    label: '家族の日',
    icon: '🏠',
    color: '#DDF4E3',
    accent: '#43865A',
    kind: 'event',
  },
]

export const allTemplates = [...homeworkTemplates, ...eventTemplates]

export const templateById = new Map(
  allTemplates.map((template) => [template.id, template]),
)
