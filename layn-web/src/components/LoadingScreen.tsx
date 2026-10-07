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
            <div aria-hidden="true" className="relative flex h-40 w-40 items-center justify-center">
                
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-fuchsia-500/30 blur-2xl animate-layn-glow motion-reduce:animate-none motion-reduce:opacity-30" />

                
                <div className="relative animate-layn-float motion-reduce:animate-none">
                    <svg viewBox="400 280 1220 1300" className="h-28 w-28 drop-shadow-[0_4px_20px_rgba(99,102,241,0.25)]" fill="none">
                        <defs>
                            <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="430" y1="300" x2="1600" y2="1560">
                                <stop offset="0" stopColor="#2F9BFF" />
                                <stop offset="0.5" stopColor="#4A4FFF" />
                                <stop offset="1" stopColor="#A745FF" />
                            </linearGradient>
                        </defs>

                        <path className="animate-layn-drop motion-reduce:animate-none" fill={`url(#${gradientId})`} d="M822 298C836 296 850 296 850 330L850 960C850 1035 822 1100 780 1137L436 1488C426 1496 422 1494 422 1480L422 770C422 540 590 340 822 298Z" />
                        <path className="animate-layn-slide motion-reduce:animate-none" fill={`url(#${gradientId})`} d="M1040 1117L1560 1117C1590 1117 1602 1120 1600 1128C1540 1320 1330 1560 1040 1560L485 1560C455 1560 440 1550 440 1540C440 1535 445 1530 450 1527L800 1205C870 1145 940 1117 1040 1117Z" />
                    </svg>
                </div>
            </div>

            <h1 className="mt-8 bg-gradient-to-r from-sky-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-2xl font-semibold uppercase tracking-[0.35em] text-transparent animate-layn-rise motion-reduce:animate-none" style={{ animationDelay: '500ms' }}>
                LAYN
            </h1>

            <p className="mt-3 text-sm tracking-wide text-slate-400 animate-layn-rise motion-reduce:animate-none" style={{ animationDelay: '700ms' }}>
                Seu tempo, em equilíbrio.
            </p>

            <div aria-hidden="true" className="mt-10 h-[3px] w-32 overflow-hidden rounded-full bg-white/10">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}