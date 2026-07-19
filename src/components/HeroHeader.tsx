import { Sparkles } from 'lucide-react'
import hero from '../assets/girls2/hero.webp'
import logo from '../assets/girls2/logo.webp'

type HeroHeaderProps = {
  daysLeft: number
  progress: number
  completed: number
  total: number
}

export function HeroHeader({
  daysLeft,
  progress,
  completed,
  total,
}: HeroHeaderProps) {
  return (
    <header className="hero-card">
      <img
        src={hero}
        alt="Girls²のメンバー"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#351326]/90 via-transparent to-white/15" />
      <img
        src={logo}
        alt="Girls²"
        className="absolute left-4 top-4 w-28 drop-shadow-[0_2px_8px_rgba(255,255,255,.9)] sm:w-36"
      />
      <div className="absolute inset-x-4 bottom-4 text-white">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1 text-xs font-bold tracking-wide">
              <Sparkles size={14} fill="currentColor" />
              2026 SUMMER MISSION
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight drop-shadow sm:text-3xl">
              夏休み 残り<span className="mx-1 text-4xl text-[#FFB9D7]">{daysLeft}</span>日！
            </h1>
          </div>
          <span className="rounded-full border border-white/70 bg-white/20 px-3 py-1 text-sm font-black backdrop-blur">
            {progress}%
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full border border-white/60 bg-white/35"
          role="progressbar"
          aria-label="夏休みの予定達成度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="progress-fill h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-right text-[10px] font-bold">
          {total === 0 ? '予定を入れてスタートしよう！' : `${completed} / ${total} ミッションクリア`}
        </p>
      </div>
    </header>
  )
}
