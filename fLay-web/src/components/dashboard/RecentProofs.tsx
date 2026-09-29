import { ArrowUpRight, FileImage, Upload } from 'lucide-react'

const proofs = [
    {
        date: '28/09/2026',
        entry: '08:02',
        exit: '18:12',
    },
    {
        date: '27/09/2026',
        entry: '08:05',
        exit: '18:01',
    },
    {
        date: '26/09/2026',
        entry: '08:01',
        exit: '17:54',
    },
]

export function RecentProofs() {
    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-[#2F4A33]">
                        Comprovantes recentes
                    </h2>

                    <p className="mt-1 text-sm text-[#588157]">
                        Seus últimos comprovantes de ponto.
                    </p>
                </div>

                <button
                    className="flex items-center gap-2 rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33]"
                >
                    <Upload size={17} />
                    Enviar comprovante
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#A3B18A]/30 bg-white">
                {proofs.map((proof, index) => (
                    <article
                        key={proof.date}
                        className={`flex items-center justify-between px-6 py-5 ${index !== proofs.length - 1
                                ? 'border-b border-[#A3B18A]/20'
                                : ''
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A3B18A]/20 text-[#588157]">
                                <FileImage size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#2F4A33]">
                                    {proof.date}
                                </p>

                                <p className="mt-1 text-sm text-[#588157]">
                                    Entrada {proof.entry} · Saída {proof.exit}
                                </p>
                            </div>
                        </div>

                        <button
                            className="flex items-center gap-1.5 text-sm font-medium text-[#588157] transition-colors hover:text-[#2F4A33]"
                        >
                            Ver
                            <ArrowUpRight size={16} />
                        </button>
                    </article>
                ))}
            </div>
        </section>
    )
}