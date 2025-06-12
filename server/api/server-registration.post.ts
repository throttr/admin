import { addServer } from '~/server/throttr/instances'
import { Service, ValueSize } from '@throttr/sdk/dist/src'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { ip, port, value_type } = body

    if (!ip || !port || !value_type) {
        throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
    }

    let server_value_type = ValueSize.UInt16;

    switch (value_type) {
        case 'UINT8':
            server_value_type = ValueSize.UInt8;
            break;
        case 'UINT16':
            server_value_type = ValueSize.UInt16;
            break;
        case 'UINT32':
            server_value_type = ValueSize.UInt32;
            break;
        case 'UINT64':
            server_value_type = ValueSize.UInt64;
            break;
    }

    try {
        const instance = new Service({
            host: ip,
            port: port,
            value_size: server_value_type,
        })

        await instance.connect()
        addServer(instance)
        return { success: true }
    } catch (err) {
        console.error('Connection failed:', err)
        throw createError({ statusCode: 500, statusMessage: 'Failed to connect' })
    }
})