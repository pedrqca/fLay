import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function timeEntryRoutes(
    app: FastifyInstance,
) {
    app.get('/time-entries', async () => {
        const timeEntries =
            await prisma.timeEntry.findMany({
                orderBy: {
                    createdAt: 'asc',
                },
                include: {
                    workday: true,
                },
            })

        return timeEntries
    })
}