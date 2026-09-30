import Fastify from 'fastify'
import cors from '@fastify/cors'

import { userRoutes } from './routes/users.js'
import { timeEntryRoutes } from './routes/timeEntries.js'
import { bankTransactionRoutes } from './routes/bankTransactions.js'
import { workdayRoutes } from './routes/workDays.js'

const app = Fastify({
    logger: true,
})

await app.register(cors, {
    origin: 'http://localhost:5173',
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

app.listen({
    port: 3333,
    host: '0.0.0.0',
})