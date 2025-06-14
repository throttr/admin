<script setup lang="ts">
const {t} = useI18n()
const services = useServices();
</script>

<template>

  <div>
    <UButton :label="t('forms.add_server')" type="button" @click="services.attributes.formOpen = true"/>
  </div>
  <UTable :data="services.services" :columns="services.columns" class="flex-1" />
</template>
