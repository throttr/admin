// Copyright (C) 2025 Ian Torres
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

import { addService } from '~/server/throttr/instances'
import { Service, ValueSize } from '@throttr/sdk'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { ip, port, value_type, connections } = body

    if (!ip || !port || !value_type || !connections) {
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
            max_connections: connections,
        })

        await instance.connect()
        addService(instance)
        return { success: true }
    } catch (err) {
        console.error('Connection failed:', err)
        throw createError({ statusCode: 500, statusMessage: 'Failed to connect' })
    }
})