<script setup lang="ts">
import UButton from "#ui/components/Button.vue";

const open_subscribe = ref(false);
const open_chat = ref(false);
const channel_listen = ref('');

const open = (channel: string) => {
  channel_listen.value = channel;
  open_chat.value = true;
}

const subscriptions = useSubscriptions();
</script>

<template>
  <!-- LISTEN -->
  <UModal v-model:open="open_chat"
          title="Listen Channel"
          description="Intercept and view channel messages"
          :dismissible="true"
          :close="true"
          class="max-w-3xl">
    <template #body>
      <CardsChannelChatCard :channel="channel_listen" />
    </template>
  </UModal>
  <!-- SUBSCRIBE -->
  <UModal v-model:open="open_subscribe"
          title="Subscribe"
          description="Complete the form to start to intercept channel"
          :dismissible="true"
          :close="true"
          class="max-w-sm">
    <template #body>
      <FormsSubscribeForm v-on:chat_closed="open_subscribe = false" />
    </template>
  </UModal>
  <ul role="list" class="-mx-2 mt-2 space-y-1">
    <li v-for="subscription in subscriptions.subscriptions" :key="subscription.name">
      <UButton variant="link" @click="open(subscription.name)"># {{subscription.name }}</UButton>
    </li>
  </ul>
  <div class="mt-5">
    <UButton type="button" variant="outline" @click="open_subscribe = true">Add</UButton>
  </div>
</template>

<style scoped>

</style>