import { useEffect, useId, useRef, useState } from 'react'

interface LoadingScreenProps {
    isLoading: boolean
    minimumDuration?: number
    fadeDuration?: number
}

export function LoadingScreen({
    isLoading,
    minimumDuration = 2000,
    fadeDuration = 300,
}: LoadingScreenProps) {
    const [isFadingOut, setIsFadingOut] = useState(false)
    const [isUnmounted, setIsUnmounted] = useState(false)
    const [progress, setProgress] = useState(0)

    const startedAtRef = useRef<number | null>(null)
    const fadeTimerRef = useRef<number | null>(null)
    const unmountTimerRef = useRef<number | null>(null)
    const gradientId = useId()

    // Barra de progresso inteligente
    useEffect(() => {
        let progressInterval: number

        if (isLoading) {
            setProgress(0)
            progressInterval = window.setInterval(() => {
                setProgress((prev) => {
                    const diff = 90 - prev
                    return prev + diff * 0.15
                })
            }, 200)
        } else {
            setProgress(100)
        }

        return () => {
            if (progressInterval) window.clearInterval(progressInterval)
        }
    }, [isLoading])

    // Gerenciamento de tempo e fechamento
    useEffect(() => {
        if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current)
        if (unmountTimerRef.current !== null) window.clearTimeout(unmountTimerRef.current)

        if (isLoading) {
            if (startedAtRef.current === null) startedAtRef.current = Date.now()
            setIsFadingOut(false)
            setIsUnmounted(false)
            return
        }

        if (startedAtRef.current === null) startedAtRef.current = Date.now()

        const elapsed = Date.now() - startedAtRef.current
        const remaining = Math.max(0, minimumDuration - elapsed)
        const finalRemaining = Math.max(remaining, 400)

        fadeTimerRef.current = window.setTimeout(() => {
            setIsFadingOut(true)
            unmountTimerRef.current = window.setTimeout(() => {
                setIsUnmounted(true)
                startedAtRef.current = null
            }, fadeDuration)
        }, finalRemaining)

        return () => {
            if (fadeTimerRef.current !== null) window.clearTimeout(fadeTimerRef.current)
            if (unmountTimerRef.current !== null) window.clearTimeout(unmountTimerRef.current)
        }
    }, [fadeDuration, isLoading, minimumDuration])

    if (isUnmounted) return null

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Carregando aplicação"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0F172A] transition-all ${isFadingOut ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
                }`}
            style={{
                transitionDuration: `${fadeDuration}ms`,
                backgroundImage:
                    'radial-gradient(ellipse 60% 45% at 50% 42%, rgba(99,102,241,0.10), transparent 70%), radial-gradient(ellipse 40% 30% at 70% 70%, rgba(168,85,247,0.05), transparent 70%)',
            }}
        >
            <div aria-hidden="true" className="relative flex h-52 w-52 items-center justify-center">
                {/* Glow suave */}
                <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-fuchsia-500/30 blur-2xl animate-layn-glow motion-reduce:animate-none motion-reduce:opacity-30" />

                <svg viewBox="400 400 2200 2200" className="relative h-full w-full" fill="none">
                    <defs>
                        {/* Gradiente da logo */}
                        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="430" y1="300" x2="1600" y2="1560">
                            <stop offset="0" stopColor="#2F9BFF" />
                            <stop offset="0.5" stopColor="#4A4FFF" />
                            <stop offset="1" stopColor="#A745FF" />
                        </linearGradient>

                        {/* Gradiente do arco */}
                        <linearGradient id={`${gradientId}-arc`} gradientUnits="userSpaceOnUse" x1="174" y1="-985" x2="766" y2="643">
                            <stop offset="0" stopColor="#2F9BFF" stopOpacity="0" />
                            <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.7" />
                            <stop offset="1" stopColor="#A745FF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Arco de ~120° + marcações */}
                    <g transform="translate(1500 1500)">
                        <path
                            d="M173.7 -984.8 A1000 1000 0 0 1 766 642.8"
                            pathLength="1"
                            strokeDasharray="1"
                            stroke={`url(#${gradientId}-arc)`}
                            strokeWidth="14"
                            strokeLinecap="round"
                            className="animate-layn-draw motion-reduce:animate-none"
                        />

                        {[10, 50, 90, 130].map((deg, i) => (
                            <line
                                key={deg}
                                x1="0"
                                y1={deg === 90 ? -905 : -940}
                                x2="0"
                                y2="-1000"
                                transform={`rotate(${deg})`}
                                stroke="#A5B4FC"
                                strokeWidth={deg === 90 ? 22 : 14}
                                strokeLinecap="round"
                                strokeOpacity={deg === 90 ? 0.75 : 0.4}
                                className="animate-layn-fade motion-reduce:animate-none"
                                style={{ animationDelay: `${700 + i * 150}ms` }}
                            />
                        ))}
                    </g>

                    {/* Logo centralizada */}
                    <g transform="translate(489 572)">
                        <g className="animate-layn-logo motion-reduce:animate-none">
                            <path
                                fill={`url(#${gradientId})`}
                                d="M822 298C836 296 850 296 850 330L850 960C850 1035 822 1100 780 1137L436 1488C426 1496 422 1494 422 1480L422 770C422 540 590 340 822 298Z"
                            />
                            <path
                                fill={`url(#${gradientId})`}
                                d="M1040 1117L1560 1117C1590 1117 1602 1120 1600 1128C1540 1320 1330 1560 1040 1560L485 1560C455 1560 440 1550 440 1540C440 1535 445 1530 450 1527L800 1205C870 1145 940 1117 1040 1117Z"
                            />
                        </g>
                    </g>
                </svg>
            </div>

            {/* Marca */}
            <h1 className="mt-8 bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-2xl font-semibold uppercase tracking-[0.35em] text-transparent animate-layn-rise motion-reduce:animate-none" style={{ animationDelay: '500ms' }}>
                LAYN
            </h1>

            <p className="mt-3 text-sm tracking-wide text-slate-400 animate-layn-rise motion-reduce:animate-none" style={{ animationDelay: '700ms' }}>
                Seu tempo, em equilíbrio.
            </p>

            {/* Barra de Progresso Real */}
            <div aria-hidden="true" className="mt-10 h-[3px] w-32 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}