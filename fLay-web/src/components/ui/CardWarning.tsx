import {
    AlertTriangle,
    Trash2,
    X,
} from 'lucide-react'

interface CardWarningProps {
    isOpen: boolean
    title: string
    description: string

    itemTitle?: string
    itemDetails?: string[]

    warning?: string

    confirmLabel?: string
    cancelLabel?: string

    isLoading?: boolean
    loadingLabel?: string

    onClose: () => void
    onConfirm: () => void
}

export function CardWarning({
    isOpen,
    title,
    description,
    itemTitle,
    itemDetails = [],
    warning,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isLoading = false,
    loadingLabel = 'Processando...',
    onClose,
    onConfirm,
}: CardWarningProps) {
    if (!isOpen) {
        return null
    }

    function handleClose() {
        if (isLoading) {
            return
        }

        onClose()
    }

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2F4A33]/30 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose()
                }
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#FAF9F6] shadow-2xl">
                <div className="px-5 pb-5 pt-6 sm:px-6 sm:pt-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <AlertTriangle
                                size={21}
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-[#2F4A33]">
                                {title}
                            </h3>

                            <p className="mt-1.5 text-sm leading-5 text-[#588157]">
                                {description}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Fechar"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {(itemTitle ||
                        itemDetails.length >
                        0) && (
                            <div className="mt-5 rounded-xl border border-[#D8CFBF] bg-[#F1EDE4] px-4 py-3.5">
                                {itemTitle && (
                                    <p className="truncate text-sm font-semibold text-[#5C5040]">
                                        {itemTitle}
                                    </p>
                                )}

                                {itemDetails.length >
                                    0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {itemDetails.map(
                                                (
                                                    detail,
                                                    index,
                                                ) => (
                                                    <span
                                                        key={`${detail}-${index}`}
                                                        className="rounded-lg bg-white/70 px-2.5 py-1 text-xs font-medium text-[#7A6F5D]"
                                                    >
                                                        {
                                                            detail
                                                        }
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}

                    {warning && (
                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3.5">
                            <p className="text-sm leading-5 text-red-700">
                                {warning}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-[#A3B18A]/20 bg-white/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-5 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        <Trash2 size={16} />

                        {isLoading
                            ? loadingLabel
                            : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}