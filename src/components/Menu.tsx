import { MENU, type Dish, type MenuGroup } from '../data/menu'

// A printed bi-fold menu: two off-white pages with a centre fold, stamped
// grunge headings, condensed dish names and a photo per section.
const PAGES: { group: string; photo?: string }[][] = [
  [{ group: 'Горячие напитки', photo: 'Голубой латте' }, { group: 'Черный кофе' }, { group: 'Маття', photo: 'Маття латте' }],
  [{ group: 'Завтраки и обеды', photo: 'Английский завтрак' }, { group: 'Десерты', photo: 'Домашний Чизкейк' }, { group: 'Холодные напитки' }],
]

const cleanGroup = (t: string) => t.split(/\s*[|/]\s*/)[0]
const byName = (name: string) => MENU.find(g => cleanGroup(g.title) === name)

function split(name: string) {
  const i = name.lastIndexOf(',')
  const tail = i > 0 ? name.slice(i + 1).trim() : ''
  if (/\d/.test(tail)) return { title: name.slice(0, i).trim(), size: tail }
  const m = name.match(/^(.*?)\s*(\d+\s*(?:г|гр\.?|мл))$/)
  return m ? { title: m[1].replace(/,$/, ''), size: m[2] } : { title: name, size: '' }
}

function Row({ d }: { d: Dish }) {
  const { title, size } = split(d.name)
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-4">
      <p className="font-['Oswald',sans-serif] text-[17px] font-semibold uppercase leading-6 tracking-[0.01em] text-[#1C1A18]">
        {title}
        {size && <span className="ml-2 font-sans text-[11px] font-normal normal-case tracking-normal text-[#6B655E]">{size}</span>}
      </p>
      <p className="font-['Oswald',sans-serif] text-[17px] font-medium tabular-nums leading-6 text-[#1C1A18]">{d.price}</p>
      {d.description && <p className="col-span-2 mt-0.5 line-clamp-2 text-[12.5px] leading-[17px] text-[#5E5852]">{d.description}</p>}
    </li>
  )
}

function Section({ g, photo }: { g: MenuGroup; photo?: Dish }) {
  return (
    <section className="break-inside-avoid">
      <h3 className="mb-1 font-['Rubik_Dirt',sans-serif] text-[44px] uppercase leading-none text-[#1C1A18] mobile:text-[36px]">{cleanGroup(g.title)}</h3>
      <div className="mb-5 h-[2px] bg-[#1C1A18]" />
      {photo?.image && (
        <img src={photo.image} alt={split(photo.name).title} loading="lazy" className="mb-5 aspect-[2.2/1] w-full object-cover shadow-[0_2px_8px_rgba(0,0,0,.18)]" />
      )}
      <ul className="flex flex-col gap-4">{g.items.map(d => <Row key={d.name} d={d} />)}</ul>
    </section>
  )
}

export default function Menu() {
  const all = MENU.flatMap(g => g.items)
  const find = (prefix?: string) => (prefix ? all.find(d => d.name.startsWith(prefix)) : undefined)

  return (
    <section id="menu" aria-labelledby="menu-title" className="menu-table px-[15px] py-24 mobile:px-[18px] mobile:py-16">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-12 flex items-end justify-between gap-6 mobile:flex-col mobile:items-start">
          <h2 id="menu-title" className="font-['Rubik_Dirt',sans-serif] text-[96px] uppercase leading-[85%] text-white mobile:text-[60px]">Меню</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">цены в рублях</p>
        </div>

        <div className="booklet grid grid-cols-2 mobile:grid-cols-1">
          {PAGES.map((page, i) => (
            <div key={i} className={`menu-page ${i === 0 ? 'menu-page-left' : 'menu-page-right'} flex flex-col gap-12 px-12 py-14 md-tablet:px-8 mobile:px-6 mobile:py-10`}>
              {page.map(({ group, photo }) => {
                const g = byName(group)
                return g ? <Section key={group} g={g} photo={find(photo)} /> : null
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
