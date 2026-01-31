import { Server } from '@hocuspocus/server'
import { Database } from '@hocuspocus/extension-database'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const server = new Server({
    port: 1234, 
    debounce: 2000, // Wait 2 seconds after typing stops to save.

    extensions: [
        new Database({
            // A. LOAD: When a user joins a document, fetch it from Postgres
            fetch: async ({ documentName }) => {
                const doc = await prisma.document.findUnique({
                    where: { id: documentName },
                })
                return doc?.data || null
            },
            // B. SAVE: When users type, save the binary update to Postgres
            store: async ({ documentName, state }) => {
                await prisma.document.update({
                    where: { id: documentName },
                    data: {
                        data: state,
                        updatedAt: new Date()
                    },
                })

                console.log(`Saved doc: ${documentName}`)
            },
        }),
    ],
})

server.listen().then(() => {
    console.log('socket server running on port 1234')
})