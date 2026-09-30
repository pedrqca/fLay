import Fastify from 'fastify'
import cors from '@fastify/cors'

import { prisma } from './lib/prisma.js'

import { userRoutes } from './routes/users.js'
import { timeEntryRoutes } from './routes/timeEntries.js'
import { workdayRoutes } from './routes/workDays.js'
import { bankTransactionRoutes } from './routes/bankTransactions.js'

const app = Fastify({
    logger: true,
})

const frontendUrl =
    process.env.FRONTEND_URL ??
    'http://localhost:5173'

await app.register(cors, {
    origin: frontendUrl,
})

app.get('/', async () => {
    await prisma.$queryRaw`SELECT 1`

    return {
        ok: true,
        database: 'connected',
    }
})

await app.register(userRoutes)
await app.register(timeEntryRoutes)
await app.register(workdayRoutes)
await app.register(bankTransactionRoutes)

const start = async () => {
    try {
        const port =
            Number(process.env.PORT) || 3333

        await app.listen({
            port,
            host: '0.0.0.0',
        })

        console.log(
            `🚀 API running on port ${port} `,
        )
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()
