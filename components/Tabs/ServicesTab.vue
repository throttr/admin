<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const route = useRoute()

const active = computed({
  get() {
    return (route.params.tab as string) || '/'
  },
  set(tab: any) {
    // Hash is specified here to prevent the page from scrolling to the top
    navigateTo(`/services/${route.params.id}/${tab}`)
    items.value.forEach((item) => {
      item.active = tab === item.value;
    })
  }
})

const items = ref<TabsItem[]>([
  {
    label: 'Overview',
    value: 'overview',
    active: true,
  },
  {
    label: 'Connections',
    value: 'connections',
    active: false,
  }
])
</script>

<template>
  <UTabs v-model="active" size="xl" variant="pill" :content="false" :items="items" class="w-full" />



</template>

<style scoped>

</style>