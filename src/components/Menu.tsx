import { MENU, type Dish, type MenuGroup } from '../data/menu'

// A single landscape printed sheet: thin "МЕНЮ" title, black ribbon labels, two columns
// of priced dishes and a strip of captioned photos along the bottom.
const PHOTOS = ['Английский завтрак', 'Домашний Чизкейк', 'Голубой латте']
// Three text columns balanced by item count; the fourth column holds photos.
const COLUMNS = [['Горячие напитки'], ['Завтраки и обеды', 'Десерты'], ['Черный кофе', 'Маття', 'Холодные напитки']]

const cleanGroup = (t: string) => t.split(/\s*[|/]\s*/)[0]

function split(name: string) {
  const i = name.lastIndexOf(',')
  const tail = i > 0 ? name.slice(i + 1).trim() : ''
  if (/\d/.test(tail)) return { title: name.slice(0, i).trim(), size: tail }
  const m = name.match(/^(.*?)\s*(\d+\s*(?:г|гр\.?|мл))$/)
  return m ? { title: m[1].replace(/,$/, ''), size: m[2] } : { title: name, size: '' }
}

function Ribbon({ children }: { children: string }) {
  return (
    <h3 className="ribbon mx-auto mb-4 w-fit min-w-[180px] bg-[#141414] px-10 py-1.5 text-center font-['Oswald',sans-serif] text-[15px] font-medium uppercase tracking-[0.14em] text-white">
      {children}
    </h3>
  )
}

function Row({ d }: { d: Dish }) {
  const { title, size } = split(d.name)
  return (
    <li title={d.description}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-['Oswald',sans-serif] text-[15px] font-semibold uppercase leading-5 tracking-[0.02em] text-[#141414]">
          {title}
          {size && <span className="ml-2 whitespace-nowrap font-sans text-[11px] font-normal normal-case tracking-normal text-[#8A8A8A]">{size}</span>}
        </p>
        <p className="shrink-0 font-['Oswald',sans-serif] text-[15px] font-semibold tabular-nums text-[#141414]">{d.price}</p>
      </div>
    </li>
  )
}

function Group({ g }: { g: MenuGroup }) {
  return (
    <div className="mb-9 break-inside-avoid">
      <Ribbon>{cleanGroup(g.title)}</Ribbon>
      <ul className="flex flex-col gap-2.5">{g.items.map(d => <Row key={d.name} d={d} />)}</ul>
    </div>
  )
}

export default function Menu() {
  const all = MENU.flatMap(g => g.items)
  const photos = PHOTOS.map(p => all.find(d => d.name.startsWith(p))).filter((d): d is Dish => !!d?.image)

  return (
    <section id="menu" aria-labelledby="menu-title" className="menu-table px-[15px] py-24 mobile:px-[18px] mobile:py-16">
      <div className="menu-sheet mx-auto max-w-[1340px] px-16 pb-14 pt-14 md-tablet:px-10 mobile:px-5 mobile:pt-10">
        <h2 id="menu-title" className="mb-3 text-center font-['Advent_Pro',sans-serif] text-[84px] font-extralight uppercase leading-none tracking-[0.06em] text-[#141414] mobile:text-[68px]">Меню</h2>
        <p className="mb-10 text-center text-[11px] uppercase tracking-[0.3em] text-[#8A8A8A]">кофейня веранда · цены в рублях</p>

        <div className="grid grid-cols-4 gap-10 md-tablet:grid-cols-2 mobile:grid-cols-1">
          {COLUMNS.map(col => (
            <div key={col[0]}>
              {col.map(name => {
                const g = MENU.find(m => cleanGroup(m.title) === name)
                return g ? <Group key={name} g={g} /> : null
              })}
            </div>
          ))}
          <div className="flex flex-col gap-4 mobile:grid mobile:grid-cols-3 mobile:gap-2">
            {photos.map(d => (
              <figure key={d.name}>
                <img src={d.image} alt={split(d.name).title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <figcaption className="mt-2 text-center font-['Oswald',sans-serif] text-[12px] font-medium uppercase tracking-[0.1em] text-[#141414] mobile:text-[10px]">{split(d.name).title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
