import {
    FileImage,
    History,
    LayoutDashboard,
    Menu,
    X,
    ChevronLeft, 
    ChevronRight 
} from 'lucide-react'

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo/flay-logo.png'

const menuItems = [
    {
        label: 'Visão geral',
        icon: LayoutDashboard,
        path: '/',
    },
    {
        label: 'Comprovantes',
        icon: FileImage,
        path: '/comprovantes',
    },
    {
        label: 'Histórico Semanal',
        icon: History,
        path: '/historico',
    },
]

export function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            {/* SIDEBAR DESKTOP */}
            <aside
                className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#A3B18A]/30 bg-[#DAD7CD] py-6 transition-all duration-300 md:flex 
                ${isDesktopCollapsed ? 'w-20 px-3' : 'w-64 px-5'}`}
            >
                {/* Header da Sidebar Desktop (Logo e Botão de Toggle) */}
                <div className={`mb-10 flex items-start ${isDesktopCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isDesktopCollapsed && (
                        <img
                            src={logo}
                            alt="fLay"
                            className="h-40 w-auto transition-opacity duration-300"
                        />
                    )}

                    {/* Botão de recolher/expandir */}
                    <button
                        type="button"
                        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#A3B18A]/30 ${isDesktopCollapsed ? 'mt-2' : ''}`}
                        title={isDesktopCollapsed ? "Expandir menu" : "Recolher menu"}
                    >
                        {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                title={isDesktopCollapsed ? item.label : undefined} 
                                className={({ isActive }) =>
                                    `flex items-center rounded-xl transition-all duration-200 text-sm font-medium ${
                                    isDesktopCollapsed
                                        ? 'justify-center w-12 h-12 mx-auto px-0'
                                        : 'gap-3 px-4 py-3'
                                    } ${isActive
                                        ? 'bg-[#A3B18A]/40 text-[#2F4A33]'
                                        : 'text-[#588157] hover:bg-[#A3B18A]/30'
                                    }`
                                }
                            >
                                <Icon size={19} className="shrink-0" />

                                {/* Esconde o texto quando a sidebar estiver recolhida */}
                                {!isDesktopCollapsed && (
                                    <span className="truncate whitespace-nowrap transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>
            </aside>

            {/* HEADER MOBILE */}
            <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-[#A3B18A]/30 bg-[#DAD7CD] px-5 md:hidden">
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(true)}
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
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#DAD7CD] px-5 py-6 shadow-xl transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={closeMobileMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                                        ? 'bg-[#A3B18A]/40 text-[#2F4A33]'
                                        : 'text-[#588157] hover:bg-[#A3B18A]/30'
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </nav>
            </aside>
        </>
    )
}