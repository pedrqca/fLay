import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify({ logger: true })

await app.register(cors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

let initError: unknown = null

try {
    const { userRoutes } = await import('./routes/users.js')
    const { timeEntryRoutes } = await import('./routes/timeEntries.js')
    const { bankTransactionRoutes } = await import('./routes/bankTransactions.js')
    const { workdayRoutes } = await import('./routes/workDays.js')

    await app.register(userRoutes)
    await app.register(timeEntryRoutes)
    await app.register(bankTransactionRoutes)
    await app.register(workdayRoutes)
} catch (err) {
    initError = err
    console.error('INIT ERROR:', err)
}

app.get('/', async (_req, reply) => {
    if (initError) {
        const e = initError as Error
        return reply.code(500).send({ name: e.name, message: e.message, stack: e.stack })
    }
    return { message: 'fLay API funcionando!' }
})

export default app

if (process.env.VERCEL !== '1') {
    await app.listen({ port: Number(process.env.PORT ?? 3333), host: '0.0.0.0' })
}