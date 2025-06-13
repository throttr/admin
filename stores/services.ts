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
import type {Configuration} from "@throttr/sdk";
import type {AddressInfo} from "net";

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

export const useServices = defineStore('services', () => {
    const services : Ref<StoredService[]> = ref([]);

    const retrieve = async () => {
        const { data } = await $fetch('/api/services', {
            method: 'GET',
        } as any)

        services.value = data as StoredService[];
    }

    return {
        services,
        retrieve,
    }
})