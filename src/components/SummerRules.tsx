import { Heart } from 'lucide-react'
import { summerRules } from '../data/homework'

export function SummerRules() {
  return (
    <section aria-labelledby="summer-rules-title" className="section-card">
      <div className="text-center">
        <p className="eyebrow">SUMMER PROMISE</p>
        <h2 id="summer-rules-title" className="section-title">
          夏休みの心得
        </h2>
        <p className="mt-1 text-[10px] font-medium text-[#927482]">
          元気に過ごすための4つのお約束
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {summerRules.map((rule) => (
          <div
            key={rule.text}
            className="rounded-2xl border border-[#F1D4E0] bg-[#FFF7FA] px-2 py-3 text-center"
          >
            <span className="text-2xl" aria-hidden="true">
              {rule.icon}
            </span>
            <strong className="mt-1 block text-[11px] leading-snug text-[#8F3D62]">
              {rule.text}
            </strong>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-[#D65E92]">
        <Heart size={12} fill="currentColor" /> 毎日を大切に楽しもう！
      </p>
    </section>
  )
}
