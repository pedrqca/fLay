import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    description: string
    icon: LucideIcon
}

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: StatCardProps) {
    return (
        <article className="rounded-2xl border border-[#A3B18A]/30 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
                <p className="text-base font-medium text-[#588157]">
                    {title}
                </p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A3B18A]/20 text-[#588157]">
                    <Icon size={20} />
                </div>
            </div>

            <p className="text-3xl font-semibold tracking-tight text-[#2F4A33]">
                {value}
            </p>

            <p className="mt-2 text-sm text-[#A3B18A]">
                {description}
            </p>
        </article>
    )
}