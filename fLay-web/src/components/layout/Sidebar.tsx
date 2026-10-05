import {
    ChevronLeft,
    ChevronRight,
    FileImage,
    History,
    LayoutDashboard,
    Menu,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import logo from '../../assets/layn-icon.png'

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

function navigationClass(
    isActive: boolean,
    collapsed = false,
) {
    return `flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
        collapsed
            ? 'mx-auto h-12 w-12 justify-center px-0'
            : 'gap-3 px-4 py-3'
    } ${
        isActive
            ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/30'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`
}

function Brand({
    compact = false,
}: {
    compact?: boolean
}) {
    return (
        <div className="flex items-center gap-3">
            <img
                src={logo}
                alt="LAYN"
                className={`${compact ? 'h-9 w-9' : 'h-10 w-10'} rounded-xl`}
            />

            {!compact && (
                <span className="text-xl font-bold tracking-[0.2em] text-white">
                    LAYN
                </span>
            )}
        </div>
    )
}

export function Sidebar() {
    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false)
    const [
        isDesktopCollapsed,
        setIsDesktopCollapsed,
    ] = useState(false)

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <aside
                className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-800 bg-[#0F172A] py-6 transition-all duration-300 md:flex ${
                    isDesktopCollapsed
                        ? 'w-20 px-3'
                        : 'w-64 px-5'
                }`}
            >
                <div
                    className={`mb-10 flex items-start ${
                        isDesktopCollapsed
                            ? 'justify-center'
                            : 'justify-between'
                    }`}
                >
                    <Brand
                        compact={
                            isDesktopCollapsed
                        }
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setIsDesktopCollapsed(
                                (collapsed) =>
                                    !collapsed,
                            )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                        title={
                            isDesktopCollapsed
                                ? 'Expandir menu'
                                : 'Recolher menu'
                        }
                        aria-label={
                            isDesktopCollapsed
                                ? 'Expandir menu'
                                : 'Recolher menu'
                        }
                    >
                        {isDesktopCollapsed ? (
                            <ChevronRight size={20} />
                        ) : (
                            <ChevronLeft size={20} />
                        )}
                    </button>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                title={
                                    isDesktopCollapsed
                                        ? item.label
                                        : undefined
                                }
                                className={({ isActive }) =>
                                    navigationClass(
                                        isActive,
                                        isDesktopCollapsed,
                                    )
                                }
                            >
                                <Icon
                                    size={19}
                                    className="shrink-0"
                                />

                                {!isDesktopCollapsed && (
                                    <span className="truncate whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        )
                    })}
                </nav>
            </aside>

            <header className="fixed left-0 right-0 top-0 z-40 flex h-20 items-center justify-between border-b border-slate-800 bg-[#0F172A] px-5 md:hidden">
                <button
                    type="button"
                    onClick={() =>
                        setIsMobileMenuOpen(true)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800"
                    aria-label="Abrir menu"
                >
                    <Menu size={23} />
                </button>

                <Brand compact />

                <div className="h-10 w-10" />
            </header>

            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Fechar menu"
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-50 bg-slate-950/60 md:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#0F172A] px-5 py-6 shadow-xl transition-transform duration-300 md:hidden ${
                    isMobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                <div className="mb-8 flex items-center justify-between">
                    <Brand />

                    <button
                        type="button"
                        onClick={closeMobileMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition-colors hover:bg-slate-800"
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
                                    navigationClass(
                                        isActive,
                                    )
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
