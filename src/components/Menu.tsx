import type { ComponentType } from 'react'
import { Coffee, CupSoda, Croissant, Leaf, Sandwich, CakeSlice, type LucideProps } from 'lucide-react'
import { MENU, type Dish } from '../data/menu'

// Price board: serif lists on the left, photo highlights on the right.
// Section titles are italic serif over a hand-drawn brush stroke.
const FEATURED = ['Облепиховый чай', 'Голубой латте', 'Домашний Чизкейк', 'Сырники запечённые', 'Английский завтрак']

const ICONS: Record<string, ComponentType<LucideProps>> = {
  'Горячие напитки': Coffee,
  'Десерты': CakeSlice,
  'Завтраки и обеды': Sandwich,
  'Черный кофе': Croissant,
  'Маття': Leaf,
  'Холодные напитки': CupSoda,
}

function split(name: string) {
  const i = name.lastIndexOf(',')
  const tail = i > 0 ? name.slice(i + 1).trim() : ''
  if (/\d/.test(tail)) return { title: name.slice(0, i).trim(), size: tail }
  const m = name.match(/^(.*?)\s*(\d+\s*(?:г|гр\.?|мл))$/)
  return m ? { title: m[1].replace(/,$/, ''), size: m[2] } : { title: name, size: '' }
}

const cleanGroup = (t: string) => t.split(/\s*[|/]\s*/)[0]

function Brush() {
  return (
    <svg className="absolute -bottom-1 left-[-6%] h-[0.55em] w-[112%] text-[var(--gold)] opacity-40" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 15C46 7 92 18 140 11s104-6 156 3c2 3-2 6-6 6-48-6-98-3-148 2S40 24 6 20c-4-1-5-4-2-5z" fill="currentColor" />
    </svg>
  )
}

function GroupTitle({ title }: { title: string }) {
  const name = cleanGroup(title)
  const Icon = ICONS[name] ?? Coffee
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--board-line)] text-[var(--gold)]">
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3 className="relative font-['Cormorant_Garamond',serif] text-[38px] font-semibold italic leading-none text-[var(--board-fg)] mobile:text-[32px]">
        <Brush />
        <span className="relative">{name}</span>
      </h3>
    </div>
  )
}

function Row({ d }: { d: Dish }) {
  const { title, size } = split(d.name)
  return (
    <li title={d.description}>
      <div className="flex items-baseline gap-2">
        <span className="min-w-0 font-['Cormorant_Garamond',serif] text-[21px] font-semibold leading-6 text-[var(--board-fg)]">
          {title}
          {size && <span className="ml-2 whitespace-nowrap font-sans text-[11px] font-normal uppercase tracking-[0.06em] text-[var(--board-muted)]">{size}</span>}
        </span>
        <span className="mb-1.5 flex-1 border-b border-dotted border-[var(--board-line)]" aria-hidden="true" />
        <span className="shrink-0 font-['Cormorant_Garamond',serif] text-[22px] font-semibold text-[var(--gold)] [font-variant-numeric:lining-nums_tabular-nums]">{d.price.replace(/\s*₽/, '')}</span>
      </div>
    </li>
  )
}

export default function Menu() {
  const all = MENU.flatMap(g => g.items)
  const featured = FEATURED.map(f => all.find(d => d.name.startsWith(f))).filter((d): d is Dish => !!d)

  return (
    <section id="menu" aria-labelledby="menu-title" className="menu-board">
      <div className="kraft px-[15px] py-24 mobile:px-[18px] mobile:py-16">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-16 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div>
            <p className="mb-1 font-['Marck_Script',cursive] text-3xl text-[var(--gold)]">кофе · чай · кухня</p>
            <h2 id="menu-title" className="font-['Cormorant_Garamond',serif] text-[96px] font-semibold leading-[85%] text-[var(--board-fg)] mobile:text-[64px]">Меню</h2>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--board-muted)]">цены в рублях</p>
        </div>

        <div className="flex gap-16 md-tablet:flex-col mobile:flex-col">
          <div className="min-w-0 flex-[2] columns-2 gap-14 mobile:columns-1">
            {MENU.map(g => (
              <div key={g.title} className="mb-14 break-inside-avoid">
                <GroupTitle title={g.title} />
                <ul className="flex flex-col gap-3">{g.items.map(d => <Row key={d.name} d={d} />)}</ul>
              </div>
            ))}
          </div>

          <aside aria-label="Хиты Веранды" className="flex-1">
            <p className="mb-8 font-['Marck_Script',cursive] text-[52px] leading-none text-[var(--gold)]">Хиты Веранды</p>
            <ul className="flex flex-col gap-8 mobile:gap-6">
              {featured.map((d, i) => {
                const { title, size } = split(d.name)
                return (
                  <li key={d.name} className={`flex items-center gap-5 ${i % 2 ? 'flex-row-reverse text-right' : ''}`}>
                    <img src={d.image} alt={title} loading="lazy" className="h-28 w-28 shrink-0 rounded-full border-2 border-[var(--gold)] object-cover shadow-[0_8px_20px_rgba(60,35,10,.35)]" />
                    <div className="min-w-0">
                      <p className="font-['Cormorant_Garamond',serif] text-2xl font-semibold italic leading-6 text-[var(--board-fg)]">{title}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-[var(--board-muted)]">{d.description}</p>
                      <p className="mt-2 font-['Cormorant_Garamond',serif] text-[34px] font-semibold leading-none text-[var(--gold)] [font-variant-numeric:lining-nums]">
                        {d.price} <span className="font-sans text-sm font-normal text-[var(--board-muted)]">{size}</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      </div>
      </div>
    </section>
  )
}
