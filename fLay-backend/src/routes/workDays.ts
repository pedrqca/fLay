import type { FastifyInstance } from 'fastify'
import type { ParsedProof } from '../utils/proofParser.js'
import { prisma } from '../lib/prisma.js'
import { processWorkday } from '../services/workdayService.js'
import {
    saveWorkday,
    updateWorkday,
    deleteWorkday,
} from '../services/workdayPersistenceService.js'

export async function workdayRoutes(
    app: FastifyInstance,
) {
    app.get(
        '/users/:userId/workdays',
        async (request) => {
            const { userId } = request.params as {
                userId: string
            }

            const workdays =
                await prisma.workday.findMany({
                    where: {
                        userId: Number(userId),
                    },
                    orderBy: {
                        date: 'desc',
                    },
                    include: {
                        timeEntries: {
                            orderBy: {
                                time: 'asc',
                            },
                        },
                    },
                })

            return workdays
        },
    )

    app.put(
        '/workdays/:id',
        async (request, reply) => {
            const { id } = request.params as {
                id: string
            }

            const body = request.body as {
                expectedMinutes: number
                proofs: ParsedProof[]
            }

            const result =
                processWorkday(
                    body.proofs,
                    body.expectedMinutes,
                )

            try {
                await updateWorkday(
                    Number(id),
                    result.workday,
                    result.bankTransaction,
                )
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message ===
                    'Jornada não encontrada.'
                ) {
                    return reply.status(404).send({
                        message:
                            error.message,
                    })
                }

                throw error
            }

            return reply.send({
                ...result,
            })
        },
    )

    app.delete(
        '/workdays/:id',
        async (request, reply) => {
            const { id } = request.params as {
                id: string
            }

            try {
                await deleteWorkday(
                    Number(id),
                )

                return reply.status(204).send()
            } catch (error) {
                console.error(
                    'Erro ao excluir jornada:',
                    error,
                )

                return reply.status(404).send({
                    message:
                        'Jornada não encontrada.',
                })
            }
        },
    )

    app.post(
        '/workdays',
        async (request, reply) => {
            const body = request.body as {
                userId: number
                expectedMinutes: number
                proofs: ParsedProof[]
            }

            const result =
                processWorkday(
                    body.proofs,
                    body.expectedMinutes,
                )

            try {
                await saveWorkday(
                    body.userId,
                    result.workday,
                    result.bankTransaction,
                )
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message ===
                    'A jornada deste dia já foi registrada.'
                ) {
                    return reply.status(409).send({
                        message:
                            error.message,
                    })
                }

                throw error
            }

            return reply.status(200).send({
                userId: body.userId,
                ...result,
            })
        },
    )
}