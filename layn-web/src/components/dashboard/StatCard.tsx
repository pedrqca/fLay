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
        <article className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
                <p className="min-w-0 text-sm font-medium text-[#0F172A] sm:text-base">
                    {title}
                </p>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#6366F1]">
                    <Icon size={20} />
                </div>
            </div>

            <p className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                {value}
            </p>

            <p className="mt-2 text-sm text-slate-500">
                {description}
            </p>
        </article>
    )
}