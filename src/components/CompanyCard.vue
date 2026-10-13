<script setup lang="ts">
import { computed, ref } from "vue";
import type { Company } from "../data/companies";
import { FIRMS } from "../data/metrics";

const props = defineProps<{ company: Company; selected: boolean }>();
const base = import.meta.env.BASE_URL;
const emit = defineEmits<{ select: [name: string] }>();

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
const color = computed(
  () => FIRMS.find((f) => f.label === props.company.name)?.color ?? "#39daff",
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
    role="button"
    tabindex="0"
    :aria-pressed="selected"
    class="flex h-56 cursor-pointer flex-col justify-between rounded-2xl bg-panel px-3 py-4 text-white sm:h-52 sm:px-5 sm:py-4"
    :style="selected ? { boxShadow: `0 0 0 2px ${color}` } : undefined"
    @click="emit('select', company.name)"
    @keydown.enter.prevent="emit('select', company.name)"
  >
    <div class="flex items-center justify-between gap-2">
      <div class="flex min-w-0 items-center gap-2">
        <img :src="company.logo" :alt="company.name" class="size-6 shrink-0" />
        <h3 class="truncate text-xl font-medium">{{ company.name }}</h3>
      </div>
      <div class="flex shrink-0 gap-1">
        <button
          type="button"
          class="flex size-7 items-center justify-center rounded-full bg-accent text-panel disabled:opacity-30"
          :disabled="index === 0"
          aria-label="Previous quarter"
          @click.stop="step(-1)"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-3.5"
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
          class="flex size-7 items-center justify-center rounded-full bg-accent text-panel disabled:opacity-30"
          :disabled="isLatest"
          aria-label="Next quarter"
          @click.stop="step(1)"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-3.5"
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

    <p class="text-base whitespace-nowrap">Revenue {{ current.label }}</p>

    <div class="flex items-center justify-between gap-2">
      <span class="text-2xl font-medium">{{ current.revenue.toFixed(2) }}</span>

      <div
        v-if="previous"
        class="flex flex-col items-end text-base font-medium"
        :class="positive ? 'text-positive' : 'text-negative'"
      >
        <div class="flex items-center">
          <span>{{ signed(change) }}</span>
          <img
            :src="
              positive
                ? base + 'icons/arrow-up-green.svg'
                : base + 'icons/arrow-up-red.svg'
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
              positive
                ? base + 'icons/percent-green.svg'
                : base + 'icons/percent-red.svg'
            "
            alt=""
            class="size-5"
          />
        </div>
      </div>
    </div>

    <p class="text-sm">In Bill USD</p>
    <p v-if="previous" class="text-base whitespace-nowrap text-white/60">
      vs. {{ previous.label }}: {{ previous.revenue.toFixed(2) }}
    </p>
  </article>
</template>
