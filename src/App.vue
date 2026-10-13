<script setup lang="ts">
import { ref } from "vue";
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
const selected = ref<string | null>(null);

function updateScrollState(): void {
  canScrollLeft.value = (strip.value?.scrollLeft ?? 0) > 4;
}

function scrollStrip(direction: 1 | -1): void {
  strip.value?.scrollBy({ left: 200 * direction, behavior: "smooth" });
}

/** Selects a firm, or clears the selection if it is already selected. */
function toggleSelected(name: string): void {
  selected.value = selected.value === name ? null : name;
}
</script>

<template>
  <main class="mx-auto flex w-full max-w-306 flex-col gap-8 px-4 py-16">
    <header class="flex items-center gap-6">
      <span class="h-8 w-24 rounded-r-full bg-accent" />
      <h1 class="text-4xl font-medium text-title">
        The Magnificent Seven Companies
      </h1>
    </header>

    <div class="flex items-center gap-4 rounded-[20px] bg-panel-wrap p-6">
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-panel"
        :class="{ invisible: !canScrollLeft }"
        aria-label="Show previous companies"
        @click="scrollStrip(-1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-4"
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
        class="flex min-w-0 flex-1 gap-6 overflow-x-auto scrollbar-none"
        @scroll="updateScrollState"
      >
        <CompanyCard
          v-for="company in companies"
          :key="company.name"
          :company="company"
          :selected="selected === company.name"
          class="w-44 shrink-0"
          @select="toggleSelected"
        />
      </section>

      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-panel"
        aria-label="Show more companies"
        @click="scrollStrip(1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-4"
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

    <section class="grid grid-cols-1 gap-8 xl:grid-cols-[714px_minmax(0,1fr)]">
      <ChartPanel title="Revenue last 3 years" class="h-88">
        <RevenueLineChart />
      </ChartPanel>
      <ChartPanel title="Revenue Breakdown Magnificent Seven" class="h-88">
        <RevenueDonut />
      </ChartPanel>
    </section>

    <section
      class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_293px_491px]"
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
