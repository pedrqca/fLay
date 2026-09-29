import {
    LayoutDashboard,
    FileImage,
    Clock3,
    Settings,
} from 'lucide-react'

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
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-[#A3B18A]/30 bg-[#DAD7CD] px-5 py-6">
            <div className="mb-10">
                <img
                    src="/src/assets/logo/flay-logo.png"
                    alt="fLay"
                    className="h-10 w-auto"
                />
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <button
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#588157] transition-colors hover:bg-[#A3B18A]/30"
                        >
                            <Icon size={19} />
                            {item.label}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}