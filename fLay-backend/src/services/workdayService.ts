import type { ParsedProof } from '../utils/proofParser.js'
import {
    buildWorkday,
} from '../utils/workdayBuilder.js'
import {
    calculateWorkday,
    getExpectedMinutes,
} from '../utils/workdayCalculator.js'
import {
    createBankTransaction,
} from '../utils/bankCalculator.js'

export function processWorkday(
    proofs: ParsedProof[],
) {
    const workday = buildWorkday(proofs)

    const expectedMinutes =
        getExpectedMinutes(
            workday.date,
        )

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