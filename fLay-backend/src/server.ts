import Fastify from 'fastify'

console.log('BOOT: server.ts carregado')

const app = Fastify({ logger: true })

app.get('/', async () => ({ ok: true }))

export default app