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

import { getServices, ServiceWrapper } from '~/server/throttr/instances'
import { Connection } from '@throttr/sdk'

export default defineEventHandler(async (event) => {
    const servers = getServices().map((service: ServiceWrapper, index) => {
        return {
            id: service.id,
            instance: {
                config: service.instance.config,
                connected: !service.instance.connections.some((connection: Connection) => {
                    return !connection.isAlive();
                }),
                connections: service.instance.connections.map((connection: Connection, connection_index: number) => {
                    return {
                        id: connection_index,
                        connected: connection.isAlive(),
                        address: connection.socket.address(),
                    }
                }),
            }
        }
    })

    return {
        success: true,
        data: servers
    }
})