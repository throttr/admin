<script setup lang="ts">
const services = useServices()
const {t} = useI18n()
</script>

<template>
  <UForm :schema="services.schema" :state="services.state" class="space-y-4" @submit="services.submit">
    <UFormField :label="t('forms.ip_address.title')" name="ip_address">
      <UInput :placeholder="t('forms.ip_address.description')" v-model="services.state.ip_address" type="text" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.port.title')" name="port">
      <UInput :placeholder="t('forms.port.description')" v-model="services.state.port" type="number" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.value_size.title')" name="value_size">
      <USelect v-model="services.state.value_size" :items="services.attributes.value_sizes" class="w-full" />
    </UFormField>

    <UFormField :label="t('forms.connections.title')" name="connections">
      <UInput :placeholder="t('forms.connections.description')" v-model="services.state.connections" type="number" class="w-full" />
    </UFormField>

    <UButton :label="t('forms.connect')" type="submit"/>
  </UForm>
</template>