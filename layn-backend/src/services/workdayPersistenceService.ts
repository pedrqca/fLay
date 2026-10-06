import { prisma } from '../lib/prisma.js'
import { Prisma } from '../generated/prisma/client.js'
import type { Workday } from '../utils/workdayBuilder.js'
import type { BankTransaction } from '../utils/bankCalculator.js'

export async function saveWorkday(
    userId: number,
    workday: Workday,
    bankTransaction: BankTransaction | null,
) {
    try {
        const savedWorkday =
            await prisma.$transaction(
                async (transaction) => {
                    const savedWorkday =
                        await transaction.workday.create({
                            data: {
                                userId,
                                date: new Date(
                                    workday.date,
                                ),
                            },
                        })

                    await transaction.timeEntry.createMany({
                        data: workday.times.map(
                            (time) => ({
                                workdayId:
                                    savedWorkday.id,
                                time,
                            }),
                        ),
                    })

                    if (bankTransaction) {
                        await transaction.bankTransaction.create({
                            data: {
                                userId,
                                workdayId:
                                    savedWorkday.id,
                                date: new Date(
                                    bankTransaction.date,
                                ),
                                type: bankTransaction.type,
                                minutes:
                                    bankTransaction.minutes,
                                description:
                                    bankTransaction.description,
                            },
                        })
                    }

                    return savedWorkday
                },
            )

        return savedWorkday
    } catch (error) {
        if (
            error instanceof
            Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            throw new Error(
                'A jornada deste dia já foi registrada.',
            )
        }

        throw error
    }
}

export async function updateWorkday(
    workdayId: number,
    workday: Workday,
    bankTransaction: BankTransaction | null,
) {
    return prisma.$transaction(
        async (transaction) => {
            const existingWorkday =
                await transaction.workday.findUnique({
                    where: {
                        id: workdayId,
                    },
                })

            if (!existingWorkday) {
                throw new Error(
                    'Jornada não encontrada.',
                )
            }

            const updatedWorkday =
                await transaction.workday.update({
                    where: {
                        id: workdayId,
                    },
                    data: {
                        date: new Date(
                            workday.date,
                        ),
                    },
                })

            await transaction.timeEntry.deleteMany({
                where: {
                    workdayId,
                },
            })

            await transaction.timeEntry.createMany({
                data: workday.times.map(
                    (time) => ({
                        workdayId,
                        time,
                    }),
                ),
            })

            const existingBankTransaction =
                await transaction.bankTransaction.findUnique({
                    where: {
                        workdayId,
                    },
                })

            if (bankTransaction) {
                if (existingBankTransaction) {
                    await transaction.bankTransaction.update({
                        where: {
                            workdayId,
                        },
                        data: {
                            date: new Date(
                                bankTransaction.date,
                            ),
                            type: bankTransaction.type,
                            minutes:
                                bankTransaction.minutes,
                            description:
                                bankTransaction.description,
                        },
                    })
                } else {
                    await transaction.bankTransaction.create({
                        data: {
                            userId:
                                existingWorkday.userId,
                            workdayId,
                            date: new Date(
                                bankTransaction.date,
                            ),
                            type: bankTransaction.type,
                            minutes:
                                bankTransaction.minutes,
                            description:
                                bankTransaction.description,
                        },
                    })
                }
            } else if (
                existingBankTransaction
            ) {
                await transaction.bankTransaction.delete({
                    where: {
                        workdayId,
                    },
                })
            }

            return updatedWorkday
        },
    )
}

export async function deleteWorkday(
    workdayId: number,
) {
    return prisma.$transaction(
        async (transaction) => {
            await transaction.bankTransaction.deleteMany({
                where: {
                    workdayId,
                },
            })

            await transaction.timeEntry.deleteMany({
                where: {
                    workdayId,
                },
            })

            const deletedWorkday =
                await transaction.workday.delete({
                    where: {
                        id: workdayId,
                    },
                })

            return deletedWorkday
        },
    )
}