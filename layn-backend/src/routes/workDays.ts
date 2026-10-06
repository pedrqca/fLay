import type { FastifyInstance } from 'fastify'
import type { ParsedProof } from '../utils/proofParser.js'
import { prisma } from '../lib/prisma.js'
import { processWorkday } from '../services/workdayService.js'
import {
    saveWorkday,
    updateWorkday,
    deleteWorkday,
} from '../services/workdayPersistenceService.js'

const proofSchema = {
    type: 'object',
    required: [
        'date',
        'time',
    ],
    properties: {
        date: {
            type: 'string',
            pattern:
                '^\\d{4}-\\d{2}-\\d{2}(?:T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d{1,3})?Z?)?$',
        },
        time: {
            type: 'string',
            pattern:
                '^([01]\\d|2[0-3]):([0-5]\\d)$',
        },
    },
} as const

const proofsSchema = {
    type: 'array',
    items: proofSchema,
} as const

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
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                    },
                },
                body: {
                    type: 'object',
                    required: ['proofs'],
                    properties: {
                        proofs: proofsSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params as {
                id: string
            }

            const body = request.body as {
                proofs: ParsedProof[]
            }

            const result =
                processWorkday(
                    body.proofs,
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
        {
            schema: {
                params: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            type: 'integer',
                        },
                    },
                },
            },
        },
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
        {
            schema: {
                body: {
                    type: 'object',
                    required: [
                        'userId',
                        'proofs',
                    ],
                    properties: {
                        userId: {
                            type: 'integer',
                        },
                        proofs: proofsSchema,
                    },
                },
            },
        },
        async (request, reply) => {
            const body = request.body as {
                userId: number
                proofs: ParsedProof[]
            }

            const result =
                processWorkday(
                    body.proofs,
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