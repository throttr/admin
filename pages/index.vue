<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'

const open = ref(true)

const {t} = useI18n()

const schema = v.object({
  ipAddress: v.pipe(v.string(), v.ip(t('forms.ipAddress.on_error'))),
  port: v.pipe(v.number(), v.maxValue(65535, t('forms.port.on_error')))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  ipAddress: '',
  port: 9000
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({title: t('forms.success'), description: t('forms.submitted'), color: 'success'})
  console.log(event.data)
}
</script>

<template>
  <UModal v-model:open="open"
          :title="t('welcome.modal.title')"
          :description="t('welcome.modal.description')"
          :dismissible="false"
          :close="false">
    <UButton label="Open" color="neutral" variant="subtle"/>

    <template #body>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField :label="t('forms.ipAddress.title')" name="ipAddress">
          <UInput :placeholder="t('forms.ipAddress.description')" v-model="state.ipAddress" type="text" class="w-full" />
        </UFormField>

        <UFormField :label="t('forms.port.title')" name="port">
          <UInput :placeholder="t('forms.port.description')" v-model="state.port" type="number" class="w-full" />
        </UFormField>

        <UButton label="Submit" type="submit"/>
      </UForm>
    </template>
  </UModal>
</template>