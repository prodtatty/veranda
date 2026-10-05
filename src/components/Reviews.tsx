import { useRef } from 'react'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import { BUSINESS } from '../config'
import { REVIEWS } from '../data/reviews'

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= value ? 'fill-[#F598F2] text-[#F598F2]' : 'text-white/20'} aria-hidden="true" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: number) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: 'smooth' })
  }

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative overflow-hidden bg-[#0B0B0C] py-28 mobile:py-20">
      <div className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[#F598F2]/[0.07] blur-[120px]" aria-hidden="true" />
      <div className="mx-auto max-w-[1340px] px-[15px] mobile:px-[18px]">
        <div className="mb-12 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <p className="eyebrow mb-4">Яндекс Карты</p>
            <h2 id="reviews-title" className="text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
              Отзывы<span className="text-[#F598F2]">.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {REVIEWS.length > 1 && (
              <>
                <button type="button" onClick={() => scroll(-1)} aria-label="Предыдущие отзывы" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition hover:border-[#F598F2] hover:text-[#F598F2]"><ArrowLeft size={18} /></button>
                <button type="button" onClick={() => scroll(1)} aria-label="Следующие отзывы" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition hover:border-[#F598F2] hover:text-[#F598F2]"><ArrowRight size={18} /></button>
              </>
            )}
            <a href={`${BUSINESS.yandexUrl}reviews/`} target="_blank" rel="noopener noreferrer" className="cta-fill rounded-full border border-white px-5 py-3 text-sm font-medium lowercase">
              все отзывы
            </a>
          </div>
        </div>

        {REVIEWS.length > 0 ? (
          <ul ref={track} className="no-scrollbar -mx-[15px] flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[15px] pb-4 mobile:-mx-[18px] mobile:px-[18px]">
            {REVIEWS.map(r => (
              <li key={r.author + r.text.slice(0, 20)} className="card-dark flex w-[400px] max-w-[85vw] shrink-0 snap-start flex-col gap-5 p-7">
                <Quote size={28} className="text-[#F598F2]/70" aria-hidden="true" />
                <p className="text-[15px] leading-6 text-white/85">{r.text}</p>
                <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F598F2]/15 font-semibold uppercase text-[#F598F2]" aria-hidden="true">{r.author.charAt(0)}</span>
                  <div className="min-w-0">
                    <p className="font-medium">{r.author}</p>
                    <div className="flex items-center gap-2"><Stars value={r.rating} />{r.date && <span className="text-xs text-white/40">{r.date}</span>}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card-dark flex items-center justify-between gap-8 p-10 mobile:flex-col mobile:items-start mobile:p-7">
            <div className="flex items-center gap-5">
              <Quote size={40} className="shrink-0 text-[#F598F2]/70" aria-hidden="true" />
              <p className="max-w-[560px] text-lg leading-7 text-white/80">Гости делятся впечатлениями о «Веранде» на Яндекс Картах. Почитайте отзывы или оставьте свой.</p>
            </div>
            <a href={`${BUSINESS.yandexUrl}reviews/`} target="_blank" rel="noopener noreferrer" className="cta-fill shrink-0 rounded-full border border-white px-6 py-3 text-sm font-medium lowercase">читать отзывы</a>
          </div>
        )}
      </div>
    </section>
  )
}
