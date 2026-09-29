import {
    FileImage,
    LayoutDashboard,
    Clock3,
    Menu,
    Settings,
    X,
} from 'lucide-react'
import { useState } from 'react'

import logo from '../../assets/logo/flay-logo.png'

const menuItems = [
    {
        label: 'Visão geral',
        icon: LayoutDashboard,
    },
    {
        label: 'Comprovantes',
        icon: FileImage,
    },
    {
        label: 'Banco de horas',
        icon: Clock3,
    },
    {
        label: 'Configurações',
        icon: Settings,
    },
]

export function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false)

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* SIDEBAR DESKTOP */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#A3B18A]/30 bg-[#DAD7CD] px-5 py-6 md:flex">
                <div className="mb-10 flex justify-center">
                    <img
                        src={logo}
                        alt="fLay"
                        className="h-40 w-auto"
                    />
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <button
                                key={item.label}
                                type="button"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#588157] transition-colors hover:bg-[#A3B18A]/30"
                            >
                                <Icon size={19} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* HEADER MOBILE */}
            <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-[#A3B18A]/30 bg-[#DAD7CD] px-5 md:hidden">
                <button
                    type="button"
                    onClick={() =>
                        setIsMobileMenuOpen(true)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[#588157] transition-colors hover:bg-[#A3B18A]/30"
                    aria-label="Abrir menu"
                >
                    <Menu size={23} />
                </button>

                <img
                    src={logo}
                    alt="fLay"
                    className="h-12 w-auto"
                />

                <div className="h-10 w-10" />
            </header>

            {/* OVERLAY MOBILE */}
            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-50 bg-black/30 md:hidden"
                />
            )}

            {/* MENU MOBILE */}
            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#DAD7CD] px-5 py-6 shadow-xl transition-transform duration-300 md:hidden ${isMobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                    }`}
            >
                <div className="mb-8 flex items-center justify-between">
                    <img
                        src={logo}
                        alt="fLay"
                        className="h-24 w-auto"
                    />

                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-[#588157] transition-colors hover:bg-[#A3B18A]/30"
                        aria-label="Fechar menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <button
                                key={item.label}
                                type="button"
                                onClick={
                                    closeMobileMenu
                                }
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#588157] transition-colors hover:bg-[#A3B18A]/30"
                            >
                                <Icon size={19} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}