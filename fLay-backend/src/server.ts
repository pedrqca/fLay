import Fastify from 'fastify'

const app = Fastify({
    logger: true,
})

app.get('/', async () => {
    return {
        message: 'fLay API is running',
    }
})

const port = 3333

try {
    await app.listen({
        port,
        host: '0.0.0.0',
    })

    console.log(`fLay API running on port ${port}`)
} catch (error) {
    app.log.error(error)
    process.exit(1)
}