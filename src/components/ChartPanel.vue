<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <article
    class="flex min-h-0 flex-col gap-4 rounded-2xl bg-panel p-2 text-white sm:p-5"
  >
    <h2
      class="text-[15px] font-medium whitespace-nowrap sm:text-xl sm:font-semibold"
    >
      {{ title }}
    </h2>
    <div
      class="flex min-h-0 flex-1 items-center justify-center text-sm text-white/50"
    >
      <slot>Placeholder, chart follows</slot>
    </div>
  </article>
</template>
