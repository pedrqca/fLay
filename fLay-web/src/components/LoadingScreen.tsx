import { Hourglass } from 'lucide-react'
import {
    useEffect,
    useRef,
    useState,
} from 'react'

interface LoadingScreenProps {
    isLoading: boolean
    minimumDuration?: number
    fadeDuration?: number
}

export function LoadingScreen({
    isLoading,
    minimumDuration = 800,
    fadeDuration = 300,
}: LoadingScreenProps) {
    const [
        isFadingOut,
        setIsFadingOut,
    ] = useState(false)
    const [
        isUnmounted,
        setIsUnmounted,
    ] = useState(false)
    const startedAtRef =
        useRef<number | null>(null)
    const fadeTimerRef =
        useRef<number | null>(null)
    const unmountTimerRef =
        useRef<number | null>(null)

    useEffect(() => {
        if (fadeTimerRef.current !== null) {
            window.clearTimeout(
                fadeTimerRef.current,
            )
        }

        if (unmountTimerRef.current !== null) {
            window.clearTimeout(
                unmountTimerRef.current,
            )
        }

        if (isLoading) {
            if (startedAtRef.current === null) {
                startedAtRef.current =
                    Date.now()
            }

            setIsFadingOut(false)
            setIsUnmounted(false)
            return
        }

        if (startedAtRef.current === null) {
            startedAtRef.current =
                Date.now()
        }

        const elapsed =
            Date.now() -
            startedAtRef.current
        const remaining =
            Math.max(
                0,
                minimumDuration -
                    elapsed,
            )

        fadeTimerRef.current =
            window.setTimeout(() => {
                setIsFadingOut(true)

                unmountTimerRef.current =
                    window.setTimeout(() => {
                        setIsUnmounted(true)
                        startedAtRef.current =
                            null
                    }, fadeDuration)
            }, remaining)

        return () => {
            if (fadeTimerRef.current !== null) {
                window.clearTimeout(
                    fadeTimerRef.current,
                )
            }

            if (unmountTimerRef.current !== null) {
                window.clearTimeout(
                    unmountTimerRef.current,
                )
            }
        }
    }, [
        fadeDuration,
        isLoading,
        minimumDuration,
    ])

    if (isUnmounted) {
        return null
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Carregando aplicação"
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF9F6] transition-opacity ${isFadingOut ? 'opacity-0' : 'opacity-100'
                }`}
            style={{
                transitionDuration: `${ fadeDuration }ms`,
            }}
        >
            <div
                aria-hidden="true"
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#A3B18A]/20"
            >
                <Hourglass
                    size={40}
                    className="animate-pulse text-[#2F4A33]"
                />
            </div>

            <h1 className="mt-6 text-xl font-semibold tracking-tight text-[#2F4A33]">
                Carregando...
            </h1>

            <p className="mt-2 text-sm text-[#588157]">
                Preparando o seu ambiente
            </p>
        </div>
    )
}
