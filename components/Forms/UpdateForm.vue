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

import * as z from "zod";
import { TTLType, ChangeType, AttributeType } from "@throttr/sdk";
import type {FormSubmitEvent} from "@nuxt/ui";

const {t} = useI18n()

const emit = defineEmits(['success'])

const attribute_types = ref([
  {
    label: "Quota",
    value: AttributeType.Quota.valueOf()
  },
  {
    label: "TTL",
    value: AttributeType.TTL.valueOf()
  },
])

const change_types = ref([
  {
    label: "Patch",
    value: ChangeType.Patch.valueOf()
  },
  {
    label: "Increase",
    value: ChangeType.Increase.valueOf()
  },
  {
    label: "Decrease",
    value: ChangeType.Decrease.valueOf()
  },
])

const schema = z.object({
  key: z.string(),
  attribute_type: z.number().min(AttributeType.Quota.valueOf()).max(AttributeType.TTL.valueOf()),
  change_type: z.number().min(ChangeType.Patch.valueOf()).max(ChangeType.Decrease.valueOf()),
  value: z.number().max(65535),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  key: '',
  attribute_type: AttributeType.TTL.valueOf(),
  change_type: ChangeType.Increase.valueOf(),
  value: 1,
})

const toast = useToast()
const route = useRoute()
const services = useServices()

const props = defineProps(['stored_key']);

onMounted(async () => {
  state.key = props.stored_key.key;

  if (props.stored_key.key_type === 1) {
    attribute_types.value = [
      {
        label: "TTL",
        value: AttributeType.TTL.valueOf()
      },
    ];
    state.attribute_type = AttributeType.TTL.valueOf();
    state.change_type = ChangeType.Increase.valueOf();
  } else {
    attribute_types.value = [
      {
        label: "Quota",
        value: AttributeType.Quota.valueOf()
      },
      {
        label: "TTL",
        value: AttributeType.TTL.valueOf()
      },
    ];
    state.attribute_type = AttributeType.Quota.valueOf();
    state.change_type = ChangeType.Decrease.valueOf();
  }
  console.log(props.stored_key);
  // state.ttl_type = props.stored_key.ttl_type;
  // const response = await services.query(route.params.id, state.key!);
  // state.ttl = response.ttl as number;
  // state.quota = response.quota as number;
});

const submit = async (event: FormSubmitEvent<Schema>) => {
  try {
    const response = await $fetch(`/api/services/${route.params.id}/update`, {
      method: 'POST',
      body: {
        key: event.data.key,
        change_type: event.data.change_type,
        attribute_type: event.data.attribute_type,
        value: event.data.value,
      }
    })

    console.log(response);

    if (response.success) {
      toast.add({title: t('forms.event', { name: "Key Update ⤑ Success"}), color: 'success'})
      console.log("Key Updated ⤑ Accepted", response)
    } else {
      toast.add({title: t('forms.event', { name: "Key Update ⤑ Rejected"}), color: 'error'})
      console.log("Key Updated ⤑ Rejected", response)
    }


    emit('success');

  } catch (error) {
    toast.add({title: t('forms.event', { name: "Key Updated ⤑ Exception"}), color: 'error'})
    console.error("Key Updated ⤑ Exception", error)

    throw error;
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="submit">
    <UFormField label="Key" name="key">
      <UInput v-model="state.key" type="text" class="w-full" />
    </UFormField>

    <UFormField label="Change Type" name="change_type">
      <USelect v-model="state.change_type" :items="change_types" class="w-full" />
    </UFormField>

    <UFormField label="Attribute Type" name="attribute_type">
      <USelect v-model="state.attribute_type" :items="attribute_types" class="w-full" />
    </UFormField>

    <UFormField label="Value" name="value">
      <UInput v-model="state.value" type="number" class="w-full" />
    </UFormField>

    <UButton label="Confirm" type="submit"/>
  </UForm>
</template>