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

import {addService, getServices, ServiceWrapper} from '~/server/throttr/instances'
import {Service, ValueSize, TTLType, RequestType, StatusResponse, QueryResponse} from '@throttr/sdk'

export default defineEventHandler(async (event) => {
    const services = getServices();
    const body = await readBody(event)

    const { key } = body

    if (!key) {
        throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
    }
    const { id } = event.context.params!;

    const index = services.findIndex((item) => item.id === id);
    const service : ServiceWrapper = services[index];
    return (await service.instance.send({
        type: RequestType.Query,
        key: key,
    })) as QueryResponse;
})