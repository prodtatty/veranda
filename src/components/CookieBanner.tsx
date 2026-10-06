import { Cookie } from 'lucide-react'
import { setConsent, useConsent } from '../lib/consent'

// Full-width bar pinned to the bottom of the screen until the visitor chooses.
export default function CookieBanner() {
  const consent = useConsent()
  if (consent) return null
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Использование cookie"
      className="cookie-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0E0B12]/95 px-[15px] pb-[calc(16px+env(safe-area-inset-bottom,0px))] pt-4 text-sm shadow-[0_-10px_40px_rgba(0,0,0,.5)] backdrop-blur mobile:px-[18px]"
    >
      <div className="mx-auto flex max-w-[1340px] items-center gap-6 mobile:flex-col mobile:items-start mobile:gap-4">
        <Cookie size={28} strokeWidth={1.5} className="shrink-0 text-[#F4A3B0] mobile:hidden" aria-hidden="true" />
        <p className="flex-1 leading-6 text-white/80">
          Мы используем файлы cookie, чтобы сайт работал корректно и становился удобнее. Подробнее — в{' '}
          <a href="#/cookies" className="underline hover:text-white">Политике cookie</a> и{' '}
          <a href="#/privacy" className="underline hover:text-white">Политике обработки персональных данных</a>.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={() => setConsent('necessary')} className="px-3 py-2.5 font-medium text-white/60 transition hover:text-white">
            Только необходимые
          </button>
          <button type="button" onClick={() => setConsent('all')} className="rounded-full bg-[#F4A3B0] px-7 py-2.5 font-semibold text-[#1A1016] transition hover:bg-white">
            Принимаю
          </button>
        </div>
      </div>
    </div>
  )
}
