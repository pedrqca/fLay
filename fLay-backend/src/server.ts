import Fastify from 'fastify'
import cors from '@fastify/cors'

import { userRoutes } from './routes/users.js'
import { timeEntryRoutes } from './routes/timeEntries.js'
import { bankTransactionRoutes } from './routes/bankTransactions.js'
import { workdayRoutes } from './routes/workDays.js'

const app = Fastify({
    logger: true,
})

const frontendUrl =
    process.env.FRONTEND_URL ??
    'http://localhost:5173'

await app.register(cors, {
    origin: frontendUrl,
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
    ],
})

await app.register(userRoutes)
await app.register(timeEntryRoutes)
await app.register(bankTransactionRoutes)
await app.register(workdayRoutes)

app.get('/', async () => {
    return {
        message: 'fLay API funcionando!',
    }
})

const port = Number(
    process.env.PORT ?? 3333,
)

await app.listen({
    port,
    host: '0.0.0.0',
})