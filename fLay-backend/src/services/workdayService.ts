import type { ParsedProof } from '../utils/proofParser.js'
import {
    buildWorkday,
} from '../utils/workdayBuilder.js'
import {
    calculateWorkday,
} from '../utils/workdayCalculator.js'
import {
    createBankTransaction,
} from '../utils/bankCalculator.js'

export function processWorkday(
    proofs: ParsedProof[],
    expectedMinutes: number,
) {
    const workday = buildWorkday(proofs)

    const calculation = calculateWorkday({
        ...workday,
        expectedMinutes,
    })

    const bankTransaction =
        createBankTransaction(
            workday.date,
            calculation.balanceMinutes,
        )

    return {
        workday,
        calculation,
        bankTransaction,
    }
}