<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import CompanyCard from "./components/CompanyCard.vue";
import CompanyDetail from "./components/CompanyDetail.vue";
import ChartPanel from "./components/ChartPanel.vue";
import RevenueLineChart from "./components/charts/RevenueLineChart.vue";
import RevenueDonut from "./components/charts/RevenueDonut.vue";
import NetIncomeBar from "./components/charts/NetIncomeBar.vue";
import GrossMarginBar from "./components/charts/GrossMarginBar.vue";
import RevenueGrowthBar from "./components/charts/RevenueGrowthBar.vue";
import { companies } from "./data/companies";

const strip = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);
const selected = ref<string | null>(null);

/** Shows or hides each arrow depending on whether the strip can scroll that way. */
function updateScrollState(): void {
  const el = strip.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 4;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
}

/** Scrolls the strip by about one screen width, snapping to whole cards. */
function scrollStrip(direction: 1 | -1): void {
  if (!strip.value) return;
  strip.value.scrollBy({
    left: strip.value.clientWidth * 0.8 * direction,
    behavior: "smooth",
  });
}

/** Selects a firm, or clears the selection if it is already selected. */
function toggleSelected(name: string): void {
  selected.value = selected.value === name ? null : name;
}

onMounted(() => {
  updateScrollState();
  window.addEventListener("resize", updateScrollState);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScrollState);
});
</script>

<template>
  <main
    class="mx-auto flex w-full max-w-306 flex-col gap-6 px-3 py-10 sm:gap-8 sm:px-4 sm:py-16"
  >
    <header class="flex items-center gap-4 sm:gap-6">
      <span class="h-8 w-24 rounded-r-full bg-accent" />
      <h1 class="text-2xl font-medium text-title sm:text-4xl">
        The Magnificent Seven Companies
      </h1>
    </header>

    <div
      class="flex items-center gap-1 rounded-[20px] bg-panel-wrap p-2 sm:gap-4 sm:p-6"
    >
      <button
        type="button"
        class="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-panel sm:size-8"
        :class="{ invisible: !canScrollLeft }"
        aria-label="Show previous companies"
        @click="scrollStrip(-1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-3 sm:size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 6-6 6 6 6" />
        </svg>
      </button>

      <section
        ref="strip"
        class="flex min-w-0 flex-1 snap-x snap-mandatory scroll-px-2 gap-3 overflow-x-auto px-2 py-2 scrollbar-none sm:gap-6"
        @scroll="updateScrollState"
      >
        <CompanyCard
          v-for="company in companies"
          :key="company.name"
          :company="company"
          :selected="selected === company.name"
          class="w-52 shrink-0 snap-start sm:w-56"
          @select="toggleSelected"
        />
      </section>

      <button
        type="button"
        class="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-panel sm:size-8"
        :class="{ invisible: !canScrollRight }"
        aria-label="Show more companies"
        @click="scrollStrip(1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-3 sm:size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </button>
    </div>

    <CompanyDetail v-if="selected" :name="selected" @close="selected = null" />

    <section
      class="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-[714px_minmax(0,1fr)]"
    >
      <ChartPanel title="Revenue last 3 years" class="h-96 sm:h-88">
        <RevenueLineChart />
      </ChartPanel>
      <ChartPanel
        title="Revenue Breakdown Magnificent Seven"
        class="h-96 sm:h-88"
      >
        <RevenueDonut />
      </ChartPanel>
    </section>

    <section
      class="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-[minmax(0,1fr)_293px_491px]"
    >
      <ChartPanel title="Net Income TTM" class="h-74">
        <NetIncomeBar />
      </ChartPanel>
      <ChartPanel title="Gross Margin in % LQ" class="h-74">
        <GrossMarginBar />
      </ChartPanel>
      <ChartPanel title="Revenue Growth in % YoY" class="h-74">
        <RevenueGrowthBar />
      </ChartPanel>
    </section>
  </main>
</template>
