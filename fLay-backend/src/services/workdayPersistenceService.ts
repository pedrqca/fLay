import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/prisma/client.js'
import type { Workday } from '../utils/workdayBuilder.js'
import type { BankTransaction } from '../utils/bankCalculator.js'

export async function saveWorkday(
    userId: number,
    workday: Workday,
    bankTransaction: BankTransaction | null,
) {
    let savedWorkday

    try {
        savedWorkday =
            await prisma.workday.create({
                data: {
                    userId,
                    date: new Date(workday.date),
                },
            })
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new Error(
                'A jornada deste dia já foi registrada.',
            )
        }

        throw error
    }

    const timeEntries = [
        workday.entry,
        workday.lunchExit,
        workday.lunchReturn,
        workday.exit,
    ]

    await prisma.timeEntry.createMany({
        data: timeEntries.map((time) => ({
            workdayId: savedWorkday.id,
            time,
        })),
    })

    if (bankTransaction) {
        await prisma.bankTransaction.create({
            data: {
                userId,
                date: new Date(
                    bankTransaction.date,
                ),
                type: bankTransaction.type,
                minutes: bankTransaction.minutes,
                description:
                    bankTransaction.description,
            },
        })
    }

    return savedWorkday
}