export type HomeworkSubject =
  | 'common'
  | 'japanese'
  | 'math'
  | 'social'
  | 'science'
  | 'english'
  | 'music'
  | 'art'
  | 'technology'
  | 'home-economics'

export type HomeworkItem = {
  id: string
  subject: HomeworkSubject
  title: string
  group?: string
}

const numberedItems = (
  subject: HomeworkSubject,
  idPrefix: string,
  titlePrefix: string,
  numbers: readonly number[],
  group?: string,
): HomeworkItem[] =>
  numbers.map((number) => {
    const separator = titlePrefix.endsWith('P') ? '' : ' '
    return {
      id: `${subject}-${idPrefix}-${String(number).padStart(2, '0')}`,
      subject,
      title: `${titlePrefix}${separator}${number}`,
      ...(group ? { group } : {}),
    }
  })

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

const summerLifeItems = [
  ['japanese', '国語', 14],
  ['math', '数学', 17],
  ['history', '歴史', 9],
  ['geography', '地理', 8],
  ['science', '理科', 16],
  ['english', '英語', 11],
] as const

const commonHomework: HomeworkItem[] = [
  ...summerLifeItems.flatMap(([id, label, count]) =>
    range(1, count).map((number) => ({
      id: `common-summer-life-${id}-${String(number).padStart(2, '0')}`,
      subject: 'common' as const,
      title: String(number),
      group: `夏の生活・${label}`,
    })),
  ),
  {
    id: 'common-test-study-plan',
    subject: 'common',
    title: 'テスト勉強計画表の作成',
  },
]

export const homeworkItems: readonly HomeworkItem[] = [
  ...commonHomework,
  {
    id: 'japanese-human-rights-essay',
    subject: 'japanese',
    title: '人権作文',
  },
  {
    id: 'japanese-kanji-notebook',
    subject: 'japanese',
    title: '漢字帳',
  },
  ...numberedItems('japanese', 'work-page', 'ワーク P', [18, 30]),
  ...numberedItems('math', 'work-page', 'ワーク P', range(36, 57)),
  {
    id: 'math-calculation-masters',
    subject: 'math',
    title: '計算マスターズ',
  },
  ...numberedItems('social', 'work-page', 'ワーク P', range(20, 39)),
  ...numberedItems(
    'science',
    'work-page',
    'ワーク P',
    [...range(2, 21), 50, 51],
  ),
  {
    id: 'science-booklet',
    subject: 'science',
    title: '冊子',
  },
  ...numberedItems('english', 'work-page', 'ワーク P', range(24, 41)),
  {
    id: 'english-do-your-best-print',
    subject: 'english',
    title: '頑張ろうプリント',
  },
  {
    id: 'music-singing-practice',
    subject: 'music',
    title: '歌の練習',
  },
  {
    id: 'art-bright-election-poster',
    subject: 'art',
    title: '明るい選挙ポスター',
  },
  {
    id: 'technology-news-report',
    subject: 'technology',
    title: '技術のニュースに関するレポート',
  },
  ...numberedItems(
    'home-economics',
    'work-page',
    'ワーク P',
    range(57, 60),
  ),
]

export const summerRules = [
  { icon: '⏰', text: '8時までに起きる' },
  { icon: '🍚', text: '3食しっかり食べる' },
  { icon: '🌙', text: '夜ふかししない' },
  { icon: '☀️', text: '外に出かける' },
] as const

export const homeworkItemsBySubject = (subject: HomeworkSubject) =>
  homeworkItems.filter((item) => item.subject === subject)

export const homeworkItemById = new Map(
  homeworkItems.map((item) => [item.id, item]),
)

export const homeworkItemTitle = (item: HomeworkItem) =>
  item.group ? `${item.group} ${item.title}` : item.title
