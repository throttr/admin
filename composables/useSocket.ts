import ReconnectingWebSocket from 'reconnecting-websocket'

export const useSocket = () => {
    let socket: ReconnectingWebSocket | null = null

    const connect = (channel: string, instance: string, onMessage: (data: any) => void) => {
        socket = new ReconnectingWebSocket(`ws://localhost:4000/ws`)

        socket.addEventListener('open', () => {
            socket?.send(JSON.stringify({ action: 'SUBSCRIBE', channel: channel, instance: instance }))
        })

        socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            onMessage(data)
        })
    }

    const close = (channel: string, instance: string) => {
        socket?.send(JSON.stringify({ action: 'UNSUBSCRIBE', channel: channel, instance: instance }))
        socket?.close()
    }

    return { connect, close }
}