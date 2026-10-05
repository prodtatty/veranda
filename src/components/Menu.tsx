import { MENU, type Dish } from '../data/menu'

// Price-board layout modelled on the owner's reference menu: green board,
// gold type, plain priced lists on the left, photo highlights on the right.
const FEATURED = ['Облепиховый чай', 'Голубой латте', 'Домашний Чизкейк', 'Сырники запечённые', 'Английский завтрак']

function split(name: string) {
  const i = name.lastIndexOf(',')
  const tail = i > 0 ? name.slice(i + 1).trim() : ''
  if (/\d/.test(tail)) return { title: name.slice(0, i).trim(), size: tail }
  const m = name.match(/^(.*?)\s*(\d+\s*(?:г|гр\.?|мл))$/)
  return m ? { title: m[1].replace(/,$/, ''), size: m[2] } : { title: name, size: '' }
}

const cleanGroup = (t: string) => t.split(/\s*[|/]\s*/)[0]

function Row({ d }: { d: Dish }) {
  const { title, size } = split(d.name)
  return (
    <li title={d.description}>
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-[var(--board-fg)]">{title}</span>
        {size && <span className="shrink-0 text-xs text-[var(--board-muted)]">{size}</span>}
        <span className="mb-1 flex-1 border-b border-dotted border-[var(--board-line)]" aria-hidden="true" />
        <span className="shrink-0 font-semibold tabular-nums text-[var(--gold)]">{d.price.replace(/\s*₽/, '')}</span>
      </div>
    </li>
  )
}

export default function Menu() {
  const all = MENU.flatMap(g => g.items)
  const featured = FEATURED.map(f => all.find(d => d.name.startsWith(f))).filter((d): d is Dish => !!d)

  return (
    <section id="menu" aria-labelledby="menu-title" className="menu-board px-[15px] py-24 mobile:px-[18px] mobile:py-16">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-14 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <div><p className="eyebrow mb-4 !text-[var(--gold)]">Кофе · чай · кухня</p>
          <h2 id="menu-title" className="text-[64px] font-semibold uppercase leading-[90%] tracking-[-1px] text-[var(--board-fg)] mobile:text-[44px]">Меню</h2></div>
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--gold)]">цены в рублях · ✦ веранда</p>
        </div>

        <div className="flex gap-14 md-tablet:flex-col mobile:flex-col">
          <div className="min-w-0 flex-[2] columns-2 gap-12 mobile:columns-1">
            {MENU.map(g => (
              <div key={g.title} className="mb-12 break-inside-avoid">
                <h3 className="menu-cat mb-5 text-[26px] font-semibold lowercase leading-7 text-[var(--board-fg)]">{cleanGroup(g.title)}</h3>
                <ul className="flex flex-col gap-2.5">{g.items.map(d => <Row key={d.name} d={d} />)}</ul>
              </div>
            ))}
          </div>

          <aside aria-label="Хиты Веранды" className="flex-1">
            <p className="mb-8 font-serif text-5xl italic text-[var(--gold)]">Хиты Веранды</p>
            <ul className="flex flex-col gap-8 mobile:gap-6">
              {featured.map((d, i) => {
                const { title, size } = split(d.name)
                return (
                  <li key={d.name} className={`flex items-center gap-5 ${i % 2 ? 'flex-row-reverse text-right' : ''}`}>
                    <img src={d.image} alt={title} loading="lazy" className="h-28 w-28 shrink-0 rounded-full object-cover shadow-[0_10px_30px_rgba(0,0,0,.45)] border-2 border-[var(--gold)]" />
                    <div className="min-w-0">
                      <p className="text-base font-semibold uppercase tracking-[0.04em] text-[var(--gold)]">{title}</p>
                      <p className="mt-1 text-[12px] leading-4 text-[var(--board-muted)] line-clamp-3">{d.description}</p>
                      <p className="mt-2 text-3xl font-semibold text-[var(--gold)]">
                        {d.price.replace(/\s*₽/, 'р')} <span className="text-sm font-normal">{size}</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
