import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function userRoutes(
    app: FastifyInstance,
) {
    app.post('/users', async (request, reply) => {
        const body = request.body as {
            name: string
            email: string
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
            },
        })

        return reply.status(201).send(user)
    })

    app.get('/users', async () => {
        const users = await prisma.user.findMany()

        return users
    })
}