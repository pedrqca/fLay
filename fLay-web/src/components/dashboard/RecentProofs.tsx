import {
    ArrowUpRight,
    FileImage,
    Plus,
    Upload,
} from 'lucide-react'
import { useState } from 'react'

import {
    CompensationModal,
    type CompensationData,
} from './CompensationModal'

interface Proof {
    date: string
    entry: string
    exit: string
}

interface RecentProofsProps {
    proofs: Proof[]
    onCompensationSubmit: (
        data: CompensationData,
    ) => void
}

export function RecentProofs({
    proofs,
    onCompensationSubmit,
}: RecentProofsProps) {
    const [
        isCompensationModalOpen,
        setIsCompensationModalOpen,
    ] = useState(false)

    return (
        <>
            <section className="mt-8">
                <div className="mb-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-[#2F4A33]">
                            Comprovantes recentes
                        </h2>

                        <p className="mt-1 text-sm text-[#588157]">
                            Seus últimos comprovantes de ponto.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
                        <button
                            type="button"
                            onClick={() =>
                                setIsCompensationModalOpen(
                                    true,
                                )
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] sm:w-auto"
                        >
                            <Plus size={17} />
                            Registrar compensação
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] sm:w-auto"
                        >
                            <Upload size={17} />
                            Enviar comprovante
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#A3B18A]/30 bg-white">
                    {proofs.map((proof, index) => (
                        <article
                            key={proof.date}
                            className={`flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 ${index !==
                                    proofs.length - 1
                                    ? 'border-b border-[#A3B18A]/20'
                                    : ''
                                }`}
                        >
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A3B18A]/20 text-[#588157] sm:h-11 sm:w-11">
                                    <FileImage
                                        size={20}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#2F4A33]">
                                        {proof.date}
                                    </p>

                                    <p className="mt-1 truncate text-sm text-[#588157]">
                                        <span className="sm:hidden">
                                            Entrada{' '}
                                            {proof.entry}{' '}
                                            · Saída{' '}
                                            {proof.exit}
                                        </span>

                                        <span className="hidden sm:inline">
                                            Entrada{' '}
                                            {proof.entry}{' '}
                                            · Saída{' '}
                                            {proof.exit}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#588157] transition-colors hover:text-[#2F4A33]"
                            >
                                <span>Ver</span>

                                <ArrowUpRight
                                    size={16}
                                />
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <CompensationModal
                isOpen={
                    isCompensationModalOpen
                }
                onClose={() =>
                    setIsCompensationModalOpen(
                        false,
                    )
                }
                onSubmit={
                    onCompensationSubmit
                }
            />
        </>
    )
}