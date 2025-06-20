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
import type {InfoResponse} from "@throttr/sdk";
import { formatDate } from "~/server/throttr/utils";

const route = useRoute()
const services = useServices()
const toast = useToast()
const {t} = useI18n()

const historic : Ref<InfoResponse[]> = ref([]);

const data : Ref<InfoResponse> = ref({
  success: false
} as InfoResponse);

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
}

onMounted(async () => {
  await fetch()
  intervalId.value = setInterval(async () => {
    await fetch(true);
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId.value);
})
</script>

<template>
  <div>
    <div v-if="data.success">
      <div>
        <div class="mb-10">
          <UCard>
            <div class="grid grid-cols-4 gap-10">
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

        <div>
          <div class="mb-10">
            <h1 class="text-2xl">Service</h1>
          </div>
          <div class="grid grid-cols-2 gap-10 mb-10">
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