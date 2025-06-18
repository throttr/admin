import { WebSocketServer } from 'ws'
import {getServices, ServiceWrapper} from "~/server/throttr/instances";
import {StatusResponse, RequestType} from "@throttr/sdk";

export default defineNitroPlugin((nitroApp) => {
    const wss = new WebSocketServer({ port: 4000 })

    console.log('Nitro plugin [Server]')
    const services = getServices();

    const subscriptions = new Map<string, Set<WebSocket>>() // channel -> sockets

    wss.on('connection', (socket) => {
        let currentChannel: string | null = null
        let currentInstance: string | null = null

        let callback = (data: string) => {
            socket.send(JSON.stringify({
                event: "MESSAGE",
                data: data
            }))
        }

        let connection;

        socket.on('message', async (message) => {
            const parsed = JSON.parse(message.toString())
            if (parsed.action === 'SUBSCRIBE') {
                currentChannel = parsed.channel
                currentInstance = parsed.instance
                const index = services.findIndex((item) => item.id === currentInstance);
                const service : ServiceWrapper = services[index];

                connection = await service.instance.getConnection();

                const response = (await connection.send({
                    type: RequestType.Subscribe,
                    channel: currentChannel!,
                    callback: callback,
                })) as StatusResponse;

                if (response.success) {
                    if (!subscriptions.has(currentChannel)) {
                        subscriptions.set(currentChannel, new Set());
                    }
                    subscriptions.get(currentChannel)!.add(socket);
                }

                socket.send(JSON.stringify({
                    event: "SYSTEM",
                    success: response.success,
                }))
            } else if (parsed.action === 'UNSUBSCRIBE') {
                currentChannel = parsed.channel
                currentInstance = parsed.instance
                const index = services.findIndex((item) => item.id === currentInstance);
                const service : ServiceWrapper = services[index];
                const response = (await service.instance.send({
                    type: RequestType.Unsubscribe,
                    channel: currentChannel!,
                })) as StatusResponse;

                if (currentChannel) {
                    const clients = subscriptions.get(currentChannel);
                    clients?.delete(socket);
                    if (clients && clients.size === 0) {
                        subscriptions.delete(currentChannel);
                    }
                }

                socket.send(JSON.stringify({
                    event: "SYSTEM",
                    success: response.success,
                }))
            }
        })

        socket.on('close', () => {
            if (currentChannel) {
                const clients = subscriptions.get(currentChannel)
                clients?.delete(socket)
                if (clients && clients.size === 0) {
                    subscriptions.delete(currentChannel)
                }
            }
        })
    })

    nitroApp.h3App.server?.on('upgrade', (req, socket, head) => {
        if (req.url === '/ws') {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req)
            })
        }
    })

    nitroApp.hooks.hook('broadcast:to', ({ channel, payload }) => {
        const clients = subscriptions.get(channel)
        if (!clients) return
        for (const client of clients) {
            if (client.readyState === 1) client.send(JSON.stringify(payload))
        }
    })
})
