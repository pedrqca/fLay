import type { ParsedProof } from './proofParser.js'

export interface Workday {
    date: string
    times: string[]
}

export function buildWorkday(
    proofs: ParsedProof[],
): Workday {
    if (
        proofs.length === 0 ||
        proofs.length % 2 !== 0
    ) {
        throw new Error(
            'A jornada deve possuir uma quantidade par de registros de ponto.',
        )
    }

    const sortedProofs = [...proofs].sort(
        (a, b) => a.time.localeCompare(b.time),
    )

    const firstProof = sortedProofs[0]

    if (!firstProof) {
        throw new Error(
            'Não foi possível organizar os registros da jornada.',
        )
    }

    const firstDate = firstProof.date

    if (!firstDate) {
        throw new Error(
            'Não foi possível identificar a data da jornada.',
        )
    }

    const hasDifferentDate =
        sortedProofs.some(
            (proof) =>
                proof.date !== firstDate,
        )

    if (hasDifferentDate) {
        throw new Error(
            'Os registros devem pertencer à mesma data.',
        )
    }

    return {
        date: firstDate,
        times: sortedProofs.map(
            (proof) => proof.time,
        ),
    }
}