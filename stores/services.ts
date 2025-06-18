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

import { defineStore } from 'pinia'
import type {
    Configuration,
    InfoResponse,
    ConnectionsResponse,
    ListResponse,
    StatusResponse,
    GetResponse,
    QueryResponse,
    StatResponse, StatsResponse, ChannelsResponse, ChannelResponse, ConnectionResponse
} from "@throttr/sdk";
import type {AddressInfo} from "net";
import * as z from "zod";
import type {FormSubmitEvent} from "@nuxt/ui";
import type { TableColumn } from '@nuxt/ui'
import { ValueSize } from "@throttr/sdk"
import { h } from 'vue'
import UBadge from '@nuxt/ui/components/Badge.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue'

export interface StoredConnection {
    id: number;
    connected: boolean;
    address: AddressInfo
}

export interface StoredInstance {
    config: Configuration;
    connected: boolean;
    connections: StoredConnection[];
}

export interface StoredService {
    id: string;
    instance: StoredInstance;
}

export interface ServicesAttributes {
    formOpen: boolean
    value_sizes: string[]
}

export const useServices = defineStore('services', () => {
    const {t} = useI18n()
    const toast = useToast()
    const services : Ref<StoredService[]> = ref([]);

    const attributes : Ref<ServicesAttributes> = ref({
        formOpen: false,
        value_sizes: ['UINT8', 'UINT16', 'UINT32', 'UINT64']
    })

    const schema = z.object({
        ip_address: z.string().ip({ version: "v4", message: t('forms.ip_address.on_error') }),
        // @ts-ignore: This is-as documentation said.
        value_size: z.enum(attributes.value.value_sizes),
        port: z.number().max(65535, t('forms.port.on_error')),
        connections: z.number().min(1),
    })

    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        ip_address: '127.0.0.1',
        value_size: 'UINT16',
        port: 9000,
        connections: 1,
    })

    const columns: TableColumn<StoredService>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => `${row.original.id.substring(0, 6)}`,
        },
        {
            accessorKey: 'host',
            header: 'Host',
            cell: ({ row }) => `${row.original.instance.config.host}`,
        },
        {
            accessorKey: 'port',
            header: 'Port',
            cell: ({ row }) => `${row.original.instance.config.port}`,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const isConnected = row.original.instance.connected;
                const color = isConnected ? 'success' : 'error';
                return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                    isConnected ? 'Connected' : 'Disconnected'
                )
            }
        },
        {
            accessorKey: 'connections',
            header: 'Connections',
            cell: ({ row }) => `${row.original.instance.config.max_connections}`,
        },
        {
            accessorKey: 'value_size',
            header: 'Value Size',
            cell: ({ row }) => {
                switch (row.original.instance.config.value_size) {
                    case ValueSize.UInt8:
                        return "UINT8";
                    case ValueSize.UInt16:
                        return "UINT16";
                    case ValueSize.UInt32:
                        return "UINT32";
                    case ValueSize.UInt64:
                        return "UINT64";
                }
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const items = [{
                    type: 'label',
                    label: 'Actions'
                }, {
                    label: 'View',
                    onSelect: () => {
                        navigateTo(`/services/${row.original.id}`)
                    }
                }, {
                    label: row.original.instance.connected ? 'Disconnect' : 'Connect',
                }, {
                    type: 'separator'
                }, {
                    label: '« Open in Terminal »'
                }, {
                    type: 'separator'
                }, {
                    label: 'Remove'
                }]

                // @ts-ignore Dropdown is-as-is.
                return h('div', { class: 'text-right' }, h(UDropdownMenu, {
                    'content': {
                        align: 'end'
                    },
                    items,
                    'aria-label': 'Actions dropdown'
                }, () => h(UButton, {
                    'icon': 'i-lucide-ellipsis-vertical',
                    'color': 'neutral',
                    'variant': 'ghost',
                    'class': 'ml-auto',
                    'aria-label': 'Actions dropdown'
                })))
            }
        }
    ]

    const submit = async (event: FormSubmitEvent<Schema>) => {
        try {
            const response = await $fetch('/api/service-registration', {
                method: 'POST',
                body: {
                    ip: event.data.ip_address,
                    port: event.data.port,
                    value_size: event.data.value_size,
                    connections: event.data.connections
                }
            })

            toast.add({title: t('forms.event', { name: "Service Registered"}), color: 'success'})
            console.log("Service Registered ⤑ Response", response)

            await setup();
        } catch (error) {
            toast.add({title: t('forms.event', { name: "Service Registered ⤑ Exception"}), color: 'error'})
            console.error("Service Registered ⤑ Exception", error)

            throw error;
        }
    }

    const info = async (id: any) => {
        const response = await $fetch(`/api/services/${id}/info`, {
            method: 'GET',
        });

        return response.data as InfoResponse
    }

    const purge = async (id: any, key: string) => {
        const response = await $fetch(`/api/services/${id}/purge`, {
            method: 'POST',
            body: {
                key: key,
            }
        });

        return response as StatusResponse;
    }

    const stat = async (id: any, key: string) => {
        const response = await $fetch(`/api/services/${id}/stat`, {
            method: 'POST',
            body: {
                key: key,
            }
        });

        return response as StatResponse;
    }

    const stats = async (id: any) => {
        const response = await $fetch(`/api/services/${id}/stats`, {
            method: 'GET'
        });

        return response as StatsResponse;
    }

    const channels = async (id: any) => {
        const response = await $fetch(`/api/services/${id}/channels`, {
            method: 'GET'
        });

        return response as ChannelsResponse;
    }

    const channel = async (id: any, channel: string) => {
        const response = await $fetch(`/api/services/${id}/channel`, {
            method: 'POST',
            body: {
                channel: channel
            }
        });

        return response as ChannelResponse
    }

    const get = async (id: any, key: string) => {
        const response = await $fetch(`/api/services/${id}/get`, {
            method: 'POST',
            body: {
                key: key
            }
        });

        return response as GetResponse
    }

    const query = async (id: any, key: string) => {
        const response = await $fetch(`/api/services/${id}/query`, {
            method: 'POST',
            body: {
                key: key
            }
        });

        return response as QueryResponse
    }

    const connections = async (id: any) => {
        const response = await $fetch(`/api/services/${id}/connections`, {
            method: 'GET',
        });

        return response as ConnectionsResponse
    }

    const connection = async (id: any, connection: string) => {
        const response = await $fetch(`/api/services/${id}/connection`, {
            method: 'POST',
            body: {
                connection: connection
            }
        });

        return response as ConnectionResponse
    }

    const list = async (id: any) => {
        const response = await $fetch(`/api/services/${id}/list`, {
            method: 'GET',
        });

        return response as ListResponse
    }

    const setup = async () => {
        try {
            const response = await $fetch('/api/services', {
                method: 'GET',
            })

            toast.add({title: t('forms.invoked', { name: "Fetch Registered Services"}), color: 'success'})
            console.log("Fetch Registered Services ⤑ Response", response)

            services.value = response.data as StoredService[];
            attributes.value.formOpen = services.value.length === 0;
        } catch (error) {
            toast.add({title: t('forms.exception', { name: "Fetch Registered Services"}), color: 'error'})
            console.error("Fetch Registered Services ⤑ Exception", error)

            throw error;
        }
    }

    return {
        state,
        schema,
        attributes,
        columns,
        services,
        info,
        list,
        purge,
        get,
        query,
        stat,
        stats,
        channels,
        channel,
        connections,
        connection,
        setup,
        submit,
    }
})