import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify({
    logger: true,
})

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

export default app