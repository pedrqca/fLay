import type { FastifyInstance } from 'fastify'
import type { ParsedProof } from '../utils/proofParser.js'
import { processWorkday } from '../services/workdayService.js'
import { saveWorkday } from '../services/workdayPersistenceService.js'

export async function workdayRoutes(
    app: FastifyInstance,
) {
    app.post('/workdays', async (request, reply) => {
        const body = request.body as {
            userId: number
            expectedMinutes: number
            proofs: ParsedProof[]
        }

        const result = processWorkday(
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
                    message: error.message,
                })
            }

            throw error
        }

        return reply.status(200).send({
            userId: body.userId,
            ...result,
        })
    })
}