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

import UCard from '@nuxt/ui/components/Card.vue';

const props = defineProps<{ channel: string }>()
const messages = ref<string[]>([])

const { connect, close } = useSocket()
const route = useRoute();

onMounted(() => {
  connect(props.channel, route.params.id!, (msg) => {
    if (msg.event === "MESSAGE") {
      const now = new Date();
      messages.value.push(`${now.toLocaleString()} RCV: ${msg.data}`)
    }
  })
})

onUnmounted(() => {
  close(props.channel, route.params.id!)
})
</script>

<template>
  <div>
    <h2 class="text-lg font-bold">Channel: {{ props.channel }}</h2>
    <pre
        class="w-full h-64 p-2 border border-gray-700 rounded mt-2 font-mono"
        readonly
        v-html="messages.join('\n')"
    ></pre>
  </div>
</template>

<style scoped>

</style>