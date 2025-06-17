<script setup lang="ts">
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

import MetricCard from "~/components/Cards/MetricCard.vue";
import TimedMetricCard from "~/components/Cards/TimedMetricCard.vue";
import type {InfoResponse} from "@throttr/sdk";
import { formatDate } from "~/server/throttr/utils";
import MemoryChart from "~/components/Charts/MemoryChart.vue";

const route = useRoute()
const services = useServices()
const toast = useToast()
const {t} = useI18n()

const historic : Ref<InfoResponse[]> = ref([]);

const data : Ref<InfoResponse> = ref({
  success: false
} as InfoResponse);

const sections = [
  { name: 'ALL', totalKey: 'total_requests', perMinuteKey: 'total_requests_per_minute' },
  { name: 'INSERT', totalKey: 'total_insert_requests', perMinuteKey: 'total_insert_requests_per_minute' },
  { name: 'QUERY', totalKey: 'total_query_requests', perMinuteKey: 'total_query_requests_per_minute' },
  { name: 'UPDATE', totalKey: 'total_update_requests', perMinuteKey: 'total_update_requests_per_minute' },
  { name: 'PURGE', totalKey: 'total_purge_requests', perMinuteKey: 'total_purge_requests_per_minute' },
  { name: 'SET', totalKey: 'total_set_requests', perMinuteKey: 'total_set_requests_per_minute' },
  { name: 'GET', totalKey: 'total_get_requests', perMinuteKey: 'total_get_requests_per_minute' },
  { name: 'LIST', totalKey: 'total_list_requests', perMinuteKey: 'total_list_requests_per_minute' },
  { name: 'INFO', totalKey: 'total_info_requests', perMinuteKey: 'total_info_requests_per_minute' },
  { name: 'STAT', totalKey: 'total_stat_requests', perMinuteKey: 'total_stat_requests_per_minute' },
  { name: 'STATS', totalKey: 'total_stats_requests', perMinuteKey: 'total_stats_requests_per_minute' },
  { name: 'SUBSCRIBE', totalKey: 'total_subscribe_requests', perMinuteKey: 'total_subscribe_requests_per_minute' },
  { name: 'UNSUBSCRIBE', totalKey: 'total_unsubscribe_requests', perMinuteKey: 'total_unsubscribe_requests_per_minute' },
  { name: 'PUBLISH', totalKey: 'total_publish_requests', perMinuteKey: 'total_publish_requests_per_minute' },
  { name: 'CONNECTIONS', totalKey: 'total_connections_requests', perMinuteKey: 'total_connections_requests_per_minute' },
  { name: 'CONNECTION', totalKey: 'total_connection_requests', perMinuteKey: 'total_connection_requests_per_minute' },
  { name: 'CHANNELS', totalKey: 'total_channels_requests', perMinuteKey: 'total_channels_requests_per_minute' },
  { name: 'CHANNEL', totalKey: 'total_channel_requests', perMinuteKey: 'total_channel_requests_per_minute' },
  { name: 'WHOAMI', totalKey: 'total_whoami_requests', perMinuteKey: 'total_whoami_requests_per_minute' },
];

const intervalId = ref()

const fetch = async (silence: boolean = false) => {
  data.value = await services.info(route.params.id) as InfoResponse;
  historic.value.push({
    ...data.value
  })
  if (!silence)
    toast.add({title: t('forms.event', { name: "Metrics Retrieved ⤑ Success"}), color: 'success'})

  if (historic.value.length > 10) {
    historic.value.shift();
  }
  console.log("Metrics Retrieved ⤑ Success", data.value)
}

onMounted(async () => {
  await fetch()
  intervalId.value = setInterval(async () => {
    await fetch(true);
    console.log("OVERVIEW INFO INTERVAL ASSIGNED")
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId.value);
  console.log("OVERVIEW INFO INTERVAL REMOVED")
})
</script>

<template>
  <div>
    <div v-if="data.success">
      <div class="grid grid-cols-4 gap-10 mb-10">

        <div>
          <div>
            <h1 class="text-2xl mb-10">Overview</h1>
          </div>

          <UCard>
            <div class="grid grid-cols-2 gap-10">
              <MetricCard
                  title="Report At" :value="formatDate(data.timestamp, false)" />
              <MetricCard
                  title="Started At" :value="formatDate(data.startup_timestamp, true)" />
              <MetricCard
                  title="Version" :value="data.version" />
              <MetricCard
                  title="Connections"
                  :value="data.total_connections" />
            </div>
          </UCard>
        </div>

        <div class="col-span-3">
          <div class="mb-10">
            <h1 class="text-2xl">Service</h1>
          </div>
          <div class="grid grid-cols-2 gap-10">
            <UCard>
              <ChartsRequestTypesChart :historic="historic"/>
            </UCard>
            <UCard>
              <ChartsRequestTypesPerMinuteChart :historic="historic"/>
            </UCard>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-4 gap-10 mb-10">
        <div>
          <div class="mb-10">
            <h1 class="text-2xl">Records</h1>
          </div>

          <UCard>
            <ChartsStorageChart :historic="historic"/>
          </UCard>
        </div>

        <div>
          <div class="mb-10">
            <h1 class="text-2xl">Memory</h1>
          </div>

          <UCard>
            <ChartsMemoryChart :historic="historic" />
          </UCard>
        </div>

        <div class="col-span-2">
          <div class="mb-10">
            <h1 class="text-2xl">Network</h1>
          </div>
          <div class="grid grid-cols-2 gap-10">
            <UCard>
              <ChartsNetworkChart :historic="historic"/>
            </UCard>
            <UCard>
              <ChartsNetworkPerMinuteChart :historic="historic"/>
            </UCard>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>