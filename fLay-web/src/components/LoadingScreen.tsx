import { Hourglass } from 'lucide-react'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
    // Estado para controlar a animação de saída (fade out)
    const [isFadingOut, setIsFadingOut] = useState(false)
    // Estado para remover completamente do DOM
    const [isUnmounted, setIsUnmounted] = useState(false)

    useEffect(() => {
        // Verifica no sessionStorage se já carregou antes nesta sessão
        const hasLoadedBefore = sessionStorage.getItem('hasLoadedBefore')

        if (hasLoadedBefore) {
            // Se já carregou, não mostra nada
            setIsUnmounted(true)
            return
        }

        // Se é a primeira vez, marca no sessionStorage e inicia o timer
        sessionStorage.setItem('hasLoadedBefore', 'true')

        // Tempo que a tela vai ficar visível (ex: 2 segundos)
        const timer = setTimeout(() => {
            setIsFadingOut(true) // Começa a sumir

            // Espera a animação de sumir terminar (300ms) para remover do DOM
            setTimeout(() => {
                setIsUnmounted(true)
            }, 300)

        }, 2000) // Ajuste este tempo como preferir (2000ms = 2s)

        return () => clearTimeout(timer)
    }, [])

    if (isUnmounted) return null

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF9F6] transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* O ícone da Ampulheta com animação de pulso e rotação */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#A3B18A]/20">
                <Hourglass
                    size={40}
                    className="animate-pulse text-[#2F4A33] transition-all duration-1000"
                // Se quiser que ela fique girando, pode adicionar a classe 'animate-spin'
                />
            </div>

            <h1 className="mt-6 text-xl font-semibold tracking-tight text-[#2F4A33] animate-pulse">
                Carregando...
            </h1>
            <p className="mt-2 text-sm text-[#588157]">
                Preparando o seu ambiente
            </p>
        </div>
    )
}