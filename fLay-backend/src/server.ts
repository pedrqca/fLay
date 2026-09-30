import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify({ logger: true })

const frontendUrl =
    process.env.FRONTEND_URL ??
    'http://localhost:5173'

await app.register(cors, {
    origin: frontendUrl,
})

app.get('/', async () => {
    return {
        ok: true,
    }
})

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3333

        await app.listen({
            port,
            host: '0.0.0.0',
        })

        console.log(`🚀 API running on port ${port}`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

start()