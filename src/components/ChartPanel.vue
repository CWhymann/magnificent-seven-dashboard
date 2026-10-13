<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <article
    class="flex min-h-0 flex-col gap-4 rounded-2xl bg-panel p-5 text-white"
  >
    <h2 class="text-base font-semibold text-balance sm:text-xl">{{ title }}</h2>
    <div
      class="flex min-h-0 flex-1 items-center justify-center text-sm text-white/50"
    >
      <slot>Placeholder, chart follows</slot>
    </div>
  </article>
</template>
