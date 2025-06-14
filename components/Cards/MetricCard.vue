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

const props = defineProps(['title', 'value'])
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl">{{ props.title }}</h2>
    </template>

    {{ props.value }}
  </UCard>
</template>

<style scoped>

</style>