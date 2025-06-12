// @ts-ignore
import { Service } from '@throttr/sdk/dist/src';

const servers: Service[] = [];

export function addServer(server: Service) {
    servers.push(server);
}

export function getServers(): Instance[] {
    return servers
}