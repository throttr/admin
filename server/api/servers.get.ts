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

import { getServers } from '~/server/throttr/instances'
import { Service } from '@throttr/sdk'

export default defineEventHandler(async (event) => {
    const servers = getServers().map((server: Service, index) => {
        return {
            id: index,
        }
    })

    return {
        success: true,
        data: servers
    }
})