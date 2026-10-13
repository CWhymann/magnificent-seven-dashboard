<script setup lang="ts">
import { computed } from "vue";
import type { Company } from "../data/companies";

const props = defineProps<{ company: Company }>();

const positive = computed(() => props.company.change >= 0);

function signed(value: number): string {
  return (value > 0 ? "+" : "") + value.toFixed(2);
}
</script>

<template>
  <article
    class="flex flex-col gap-2 rounded-2xl bg-panel px-6 py-5 text-white"
  >
    <div class="flex items-center gap-2">
      <img :src="company.logo" :alt="company.name" class="size-5" />
      <h3 class="text-xl font-medium whitespace-nowrap">{{ company.name }}</h3>
    </div>

    <p class="text-xs whitespace-nowrap">Revenue {{ company.quarterLabel }}</p>

    <div class="flex items-center justify-between gap-2">
      <span class="text-2xl font-medium">{{ company.revenue.toFixed(2) }}</span>

      <div
        class="flex flex-col items-end text-[13px] font-medium"
        :class="positive ? 'text-positive' : 'text-negative'"
      >
        <div class="flex items-center">
          <span>{{ signed(company.change) }}</span>
          <img
            :src="
              positive ? '/icons/arrow-up-green.svg' : '/icons/arrow-up-red.svg'
            "
            alt=""
            class="size-5"
            :class="{ 'rotate-180': !positive }"
          />
        </div>
        <div class="flex items-center">
          <span>{{ signed(company.changePercent) }}</span>
          <img
            :src="
              positive ? '/icons/percent-green.svg' : '/icons/percent-red.svg'
            "
            alt=""
            class="size-5"
          />
        </div>
      </div>
    </div>

    <p class="text-[8px]">In Bill USD</p>
  </article>
</template>
