import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import { BUSINESS } from '../config'
import { REVIEWS } from '../data/reviews'
import { MENU } from '../data/menu'

// Card grid and staggered spring reveal adapted from SmoothUI "Stats 1".
const STAGGER_DELAY = 0.1
const VALUE_DELAY_OFFSET = 0.2

const dishes = MENU.flatMap(g => g.items)
const desserts = MENU.find(g => g.title.startsWith('Десерты'))?.items.length ?? 0
const minPrice = Math.min(...dishes.map(d => parseInt(d.price)))

// Only facts the menu itself backs up.
const STATS = [
  { value: '5.0', label: 'рейтинг на Яндекс Картах', description: 'высшая оценка гостей' },
  { value: String(dishes.length), label: 'позиций в меню', description: 'кофе, чай, завтраки и обеды' },
  { value: String(desserts), label: 'десертов', description: 'домашние, есть vegan-варианты' },
  { value: `${minPrice} ₽`, label: 'чай от', description: 'растительное молоко — в любой напиток' },
]

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} className={i <= value ? 'fill-[#A98BFF] text-[#A98BFF]' : 'text-white/20'} aria-hidden="true" />
      ))}
    </div>
  )
}

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 424, behavior: 'smooth' })

  const card = (index: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 30 },
    animate: reduce ? { opacity: 1 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: reduce ? { duration: 0 } : { delay: index * STAGGER_DELAY, duration: 0.6 },
  })
  const cardClass = 'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-[#A98BFF] hover:shadow-[0_10px_40px_rgba(169,139,255,.12)]'
  const glow = <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#A98BFF]/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-[#0B0B0C] py-28 mobile:py-20">
      <div className="mx-auto max-w-[1340px] px-[15px] mobile:px-[18px]">
        <motion.div
          className="mb-16 text-center"
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reduce ? { duration: 0 } : { duration: 0.6 }}
        >
          <h2 id="reviews-title" className="mb-4 text-[64px] font-medium uppercase leading-[90%] tracking-[-2px] mobile:text-[40px]">
            Отзывы<span className="text-[#A98BFF]">.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">За что гости возвращаются на «Веранду»</p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-4 gap-6 md-tablet:grid-cols-2 mobile:grid-cols-1">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...card(i)} className={`${cardClass} text-center`}>
              <motion.div
                className="mb-2 text-5xl font-semibold text-[#A98BFF] mobile:text-4xl"
                initial={reduce ? { scale: 1 } : { scale: 0.5 }}
                animate={reduce || isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={reduce ? { duration: 0 } : { delay: i * STAGGER_DELAY + VALUE_DELAY_OFFSET, duration: 0.8, type: 'spring', stiffness: 200 }}
              >
                {s.value}
              </motion.div>
              <h3 className="mb-2 text-lg font-semibold">{s.label}</h3>
              <p className="text-sm text-white/65">{s.description}</p>
              {glow}
            </motion.div>
          ))}
        </div>

        {REVIEWS.length > 0 && (
          <ul ref={track} className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2">
            {REVIEWS.map((r, i) => (
              <motion.li key={r.author + i} {...card(i + STATS.length)} className={`${cardClass} flex w-[400px] max-w-[85vw] shrink-0 snap-start flex-col gap-4 text-left`}>
                <Quote size={26} className="text-[#A98BFF]/70" aria-hidden="true" />
                <p className="text-[15px] leading-6 text-white/85">{r.text}</p>
                <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A98BFF]/15 font-semibold uppercase text-[#A98BFF]" aria-hidden="true">{r.author.charAt(0)}</span>
                  <div>
                    <p className="font-semibold">{r.author}</p>
                    <div className="flex items-center gap-2"><Stars value={r.rating} />{r.date && <span className="text-xs text-white/45">{r.date}</span>}</div>
                  </div>
                </div>
                {glow}
              </motion.li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex items-center justify-center gap-3">
          {REVIEWS.length > 1 && (
            <button type="button" onClick={() => scroll(-1)} aria-label="Предыдущие отзывы" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition hover:border-[#A98BFF] hover:text-[#A98BFF]"><ArrowLeft size={18} /></button>
          )}
          <a href={`${BUSINESS.yandexUrl}reviews/`} target="_blank" rel="noopener noreferrer" className="cta-fill inline-block rounded-full border border-white px-7 py-3 text-sm font-medium lowercase">
            читать отзывы на яндекс картах
          </a>
          {REVIEWS.length > 1 && (
            <button type="button" onClick={() => scroll(1)} aria-label="Следующие отзывы" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 transition hover:border-[#A98BFF] hover:text-[#A98BFF]"><ArrowRight size={18} /></button>
          )}
        </div>
      </div>
    </section>
  )
}
