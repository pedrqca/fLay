import type { FastifyInstance } from 'fastify'

import { prisma } from '../lib/prisma.js'

export async function bankTransactionRoutes(
    app: FastifyInstance,
) {
    // Buscar transações de um usuário
    app.get(
        '/users/:userId/bank-transactions',
        async (request) => {
            const { userId } =
                request.params as {
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

    // Criar transação
    app.post(
        '/bank-transactions',
        async (
            request,
            reply,
        ) => {
            const body =
                request.body as {
                    userId: number
                    date: string
                    type:
                    | 'EXTRA'
                    | 'COMPENSATION'
                    minutes: number
                    description: string
                }

            if (
                !body.userId ||
                !body.date ||
                !body.type ||
                typeof body.minutes !== 'number' ||
                body.minutes <= 0 ||
                !body.description?.trim()
            ) {
                return reply
                    .status(400)
                    .send({
                        message:
                            'Dados inválidos para criar a transação.',
                    })
            }

            const transaction =
                await prisma.bankTransaction.create({
                    data: {
                        userId: body.userId,
                        date: new Date(
                            body.date,
                        ),
                        type: body.type,
                        minutes: body.minutes,
                        description:
                            body.description.trim(),
                    },
                })

            return reply
                .status(201)
                .send(transaction)
        },
    )

    // Editar transação
    app.put(
        '/bank-transactions/:id',
        async (
            request,
            reply,
        ) => {
            const { id } =
                request.params as {
                    id: string
                }

            const body =
                request.body as {
                    date: string
                    type:
                    | 'EXTRA'
                    | 'COMPENSATION'
                    minutes: number
                    description: string
                }

            if (
                !body.date ||
                !body.type ||
                typeof body.minutes !== 'number' ||
                body.minutes <= 0 ||
                !body.description?.trim()
            ) {
                return reply
                    .status(400)
                    .send({
                        message:
                            'Dados inválidos para atualizar a transação.',
                    })
            }

            const transaction =
                await prisma.bankTransaction.update({
                    where: {
                        id: Number(id),
                    },
                    data: {
                        date: new Date(
                            body.date,
                        ),
                        type: body.type,
                        minutes: body.minutes,
                        description:
                            body.description.trim(),
                    },
                })

            return reply.send(
                transaction,
            )
        },
    )

    // Excluir transação
    app.delete(
        '/bank-transactions/:id',
        async (
            request,
            reply,
        ) => {
            const { id } =
                request.params as {
                    id: string
                }

            await prisma.bankTransaction.delete({
                where: {
                    id: Number(id),
                },
            })

            return reply
                .status(204)
                .send()
        },
    )
}