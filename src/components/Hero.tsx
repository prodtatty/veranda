import { useEffect, useRef, useState } from 'react'

const POSTER = 'videos/hero-poster.jpg'
const ACCENT = '#F4A3B0'

// Pauses while the hero is off-screen or the tab is hidden, so the page
// isn't decoding video nobody can see.
function HeroVideo({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const sync = () => {
      const v = ref.current
      if (!v) return
      if (visible && !document.hidden) v.play().catch(() => {})
      else v.pause()
    }
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [visible])
  return (
    <video
      ref={ref}
      poster={POSTER}
      muted loop playsInline autoPlay preload="auto" aria-hidden="true"
      className="video-fade absolute inset-0 h-full w-full object-cover"
    >
      <source src="videos/hero.webm" type="video/webm" />
      <source src="videos/hero.mp4" type="video/mp4" />
    </video>
  )
}

export default function Hero() {
  const [revealed, setRevealed] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const [onScreen, setOnScreen] = useState(true)
  const accent = ACCENT

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setOnScreen(e.isIntersecting)
      if (e.intersectionRatio >= 0.35) setRevealed(true)
    }, { threshold: [0, 0.35] })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} aria-label="Кофейня Веранда" className={`relative h-[100svh] min-h-[640px] overflow-hidden ${revealed ? 'is-revealed' : ''}`}>
      <HeroVideo visible={onScreen} />
      <div className="absolute inset-0 z-[1] bg-black/10" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/55 to-transparent" aria-hidden="true" />
      {/* Bottom scrim keeps the copy readable over bright video frames. */}
      <div className="absolute inset-x-0 bottom-0 z-[1] h-[70%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" aria-hidden="true" />

      <div className="relative z-[2] mx-auto flex h-full max-w-[1340px] flex-col items-end justify-end gap-[150px] px-[15px] pt-[190px] mobile:items-start mobile:gap-[72px] mobile:px-[18px] mobile:pt-[140px]">
        <div className="hero-copy flex w-full mobile:flex-col mobile:gap-7">
          <div className="flex-[4]" aria-hidden="true" />
          <div className="flex flex-1 items-start gap-2 text-xs font-medium uppercase leading-4" role="status">
            <span className="status-dot mt-[4px]" style={{ background: accent, boxShadow: `0 0 10px 2px ${accent}99` }} aria-hidden="true" />
            Открыто — ждём вас
          </div>
        </div>

        <div className="flex w-full items-end pb-[60px] md-tablet:gap-7 md-tablet:pb-[52px] md-tablet:pl-6 mobile:flex-col mobile:items-start mobile:gap-8 mobile:pb-11">
          {/* "ВЕРАНДА." is ~1.5× wider than a short Latin name, so the size caps at
              the spec's 200px / 129.6px but shrinks with the viewport to leave the
              copy column room instead of overflowing. */}
          <div className="flex-none">
            <h1 className="reveal-up whitespace-nowrap text-[min(170px,10.5vw)] font-medium uppercase leading-[81%] tracking-[-0.03em] md-tablet:text-[min(110px,9vw)] md-tablet:leading-[0.875] md-tablet:tracking-[-0.06em] mobile:text-[clamp(56px,17vw,80px)] mobile:leading-[96px] mobile:tracking-[-4px]">
              Веранда<span style={{ color: accent }} className="transition-colors duration-700">.</span>
            </h1>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6 pl-10 mobile:pl-0">
            <p className="hero-copy reveal-right max-w-[640px] text-[17px] font-semibold leading-6 tracking-[-0.16px]">
              Семейная кофейня «Веранда», в которой всегда большой выбор вкусного кофе и чая! На выбор гостю предоставлены альтернативные методы заваривания кофе, растительное молоко. В ассортименте десерты и закуски собственного приготовления. Иногда Вам может сварить кофе сам хозяин, а хозяйку можно застать за обновлением внутреннего декора.</p>
            <a href="#menu" className="reveal-right reveal-delay cta-fill rounded-full border border-white px-6 py-3 text-sm font-medium lowercase">
              смотреть меню
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
