<script setup lang="ts">
import { computed, ref } from "vue";
import type { Company } from "../data/companies";

const props = defineProps<{ company: Company }>();

/** Index of the shown quarter. Starts on the latest reported quarter. */
const index = ref(props.company.quarters.length - 1);

const current = computed(() => props.company.quarters[index.value]);
const previous = computed(() =>
  index.value > 0 ? props.company.quarters[index.value - 1] : null,
);
const change = computed(() =>
  previous.value ? current.value.revenue - previous.value.revenue : 0,
);
const changePercent = computed(() =>
  previous.value ? (change.value / previous.value.revenue) * 100 : 0,
);
const positive = computed(() => change.value >= 0);
const isLatest = computed(
  () => index.value === props.company.quarters.length - 1,
);

function signed(value: number): string {
  return (value > 0 ? "+" : "") + value.toFixed(2);
}

function step(delta: number): void {
  const last = props.company.quarters.length - 1;
  index.value = Math.min(Math.max(index.value + delta, 0), last);
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

    <div class="flex items-center justify-between gap-2">
      <p class="text-xs whitespace-nowrap">Revenue {{ current.label }}</p>
      <div class="flex gap-1">
        <button
          type="button"
          class="flex size-5 items-center justify-center rounded-full bg-accent text-panel disabled:opacity-30"
          :disabled="index === 0"
          aria-label="Vorheriges Quartal"
          @click="step(-1)"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-3"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          class="flex size-5 items-center justify-center rounded-full bg-accent text-panel disabled:opacity-30"
          :disabled="isLatest"
          aria-label="Nächstes Quartal"
          @click="step(1)"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-3"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-2">
      <span class="text-2xl font-medium">{{ current.revenue.toFixed(2) }}</span>

      <div
        v-if="previous"
        class="flex flex-col items-end text-[13px] font-medium"
        :class="positive ? 'text-positive' : 'text-negative'"
      >
        <div class="flex items-center">
          <span>{{ signed(change) }}</span>
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
          <span>{{ signed(changePercent) }}</span>
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
    <p v-if="previous" class="text-xs whitespace-nowrap text-white/60">
      vs. {{ previous.label }}: {{ previous.revenue.toFixed(2) }}
    </p>
  </article>
</template>
