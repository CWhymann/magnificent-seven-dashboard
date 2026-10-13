<script setup lang="ts">
import { ref } from "vue";
import CompanyCard from "./components/CompanyCard.vue";
import ChartPanel from "./components/ChartPanel.vue";
import { companies } from "./data/companies";

const strip = ref<HTMLElement | null>(null);

function scrollStrip(): void {
  strip.value?.scrollBy({ left: 200, behavior: "smooth" });
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
      <section
        ref="strip"
        class="flex min-w-0 flex-1 gap-6 overflow-x-auto scrollbar-none"
      >
        <CompanyCard
          v-for="company in companies"
          :key="company.name"
          :company="company"
          class="w-44 shrink-0"
        />
      </section>

      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-panel"
        aria-label="Weitere Firmen anzeigen"
        @click="scrollStrip"
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

    <section class="grid grid-cols-1 gap-8 xl:grid-cols-[714px_minmax(0,1fr)]">
      <ChartPanel title="Revenue last 3 years" class="h-88" />
      <ChartPanel title="Revenue Breakdown Magnificent Seven" class="h-88" />
    </section>

    <section
      class="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_293px_491px]"
    >
      <ChartPanel title="Net Income TTM" class="h-74" />
      <ChartPanel title="Gross Margin in % LQ" class="h-74" />
      <ChartPanel title="Revenue Growth in % YoY" class="h-74" />
    </section>
  </main>
</template>
