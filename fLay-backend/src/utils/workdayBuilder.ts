import type { ParsedProof } from './proofParser.js'

export interface Workday {
    date: string
    entry: string
    lunchExit: string
    lunchReturn: string
    exit: string
}

export function buildWorkday(
    proofs: ParsedProof[],
): Workday {
    if (proofs.length !== 4) {
        throw new Error(
            'A jornada deve possuir exatamente 4 registros de ponto.',
        )
    }

    const sortedProofs = [...proofs].sort(
        (a, b) => a.time.localeCompare(b.time),
    )

    const [
        entryProof,
        lunchExitProof,
        lunchReturnProof,
        exitProof,
    ] = sortedProofs

    if (
        !entryProof ||
        !lunchExitProof ||
        !lunchReturnProof ||
        !exitProof
    ) {
        throw new Error(
            'Não foi possível organizar os registros da jornada.',
        )
    }

    const firstDate = entryProof.date

    if (!firstDate) {
        throw new Error(
            'Não foi possível identificar a data da jornada.',
        )
    }

    const hasDifferentDate = sortedProofs.some(
        (proof) => proof.date !== firstDate,
    )

    if (hasDifferentDate) {
        throw new Error(
            'Os registros devem pertencer à mesma data.',
        )
    }

    return {
        date: firstDate,
        entry: entryProof.time,
        lunchExit: lunchExitProof.time,
        lunchReturn: lunchReturnProof.time,
        exit: exitProof.time,
    }
}