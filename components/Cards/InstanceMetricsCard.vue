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

import type {InfoResponse} from "@throttr/sdk";

const props = defineProps(['service'])

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
  data.value = await services.info(props.service.id) as InfoResponse;
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

    <div class="grid grid-cols-4 gap-10 mb-10">
      <div>
        <UCard>
          <ChartsStorageChart :historic="historic"/>
        </UCard>
      </div>

      <div>
        <UCard>
          <ChartsMemoryChart :historic="historic" />
        </UCard>
      </div>

      <div class="col-span-2">
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
</template>

<style scoped>

</style>