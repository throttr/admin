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

const route = useRoute();

const is_viewing_some_instance = computed(() => {
  return route.params.hasOwnProperty('id');
})

</script>

<template>
  <div>
    <div class="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
        <div class="flex shrink-0 items-center">
          <div class="flex py-4">
            <img class="h-16 w-auto inline-block" src="/logo.png" alt="Throttr" />
            <p class="py-5 text-xl pl-5">Administration</p>
          </div>
        </div>
        <nav v-if="is_viewing_some_instance"  class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li class="w-full">
              <TabsServicesTab />
            </li>
            <li>
              <ListsSubscriptionsList />
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="xl:pl-72">
      <main class="lg:pr-96">
       <slot/>
      </main>

      <aside v-if="is_viewing_some_instance" class="bg-black/10 lg:fixed lg:top-0 lg:right-0 lg:bottom-0 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
        <header class="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h2 class="text-base/7 font-semibold text-white">Instances</h2>
        </header>
        <div class="p-4">
          <ListsServicesList type="xs" />
        </div>
      </aside>
    </div>
  </div>
</template>

