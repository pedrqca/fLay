import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function bankTransactionRoutes(
    app: FastifyInstance,
) {
    app.get(
        '/users/:userId/bank-transactions',
        async (request) => {
            const { userId } = request.params as {
                userId: string
            }

            const transactions =
                await prisma.bankTransaction.findMany({
                    where: {
                        userId: Number(userId),
                    },
                    orderBy: {
                        date: 'asc',
                    },
                })

            return transactions
        },
    )
}