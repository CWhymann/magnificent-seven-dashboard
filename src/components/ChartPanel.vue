<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <article
    class="flex min-h-0 flex-col gap-3 rounded-2xl bg-panel p-3 text-white sm:gap-4 sm:p-5"
  >
    <h2 class="text-sm font-medium whitespace-nowrap sm:text-xl">
      {{ title }}
    </h2>
    <div
      class="flex min-h-0 flex-1 items-center justify-center py-2 text-sm text-white/50"
    >
      <slot>Placeholder, chart follows</slot>
    </div>
  </article>
</template>
