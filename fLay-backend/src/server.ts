import Fastify from 'fastify'

const app = Fastify({ logger: true })

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