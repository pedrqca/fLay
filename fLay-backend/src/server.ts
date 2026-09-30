import Fastify from 'fastify'
import { prisma } from './lib/prisma.js'
import { userRoutes } from './routes/users.js'
import { timeEntryRoutes } from './routes/timeEntries.js'
import { bankTransactionRoutes } from './routes/bankTransactions.js'
import { workdayRoutes } from './routes/workDays.js'

const app = Fastify({
    logger: true,
})

app.get('/', async () => {
    return {
        message: 'fLay API is running',
    }
})

await app.register(userRoutes)
await app.register(timeEntryRoutes)
await app.register(bankTransactionRoutes)
await app.register(workdayRoutes)

const port = 3333

try {
    await prisma.$connect()

    console.log('Database connected')

    await app.listen({
        port,
        host: '0.0.0.0',
    })

    console.log(`fLay API running on port ${port}`)
} catch (error) {
    app.log.error(error)
    process.exit(1)
}