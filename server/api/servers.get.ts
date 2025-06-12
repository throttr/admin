import { getServers } from '~/server/throttr/instances'
import { Service } from '@throttr/sdk/dist/src'

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