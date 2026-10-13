<script setup lang="ts">
import CompanyCard from "./components/CompanyCard.vue";
import ChartPanel from "./components/ChartPanel.vue";
import { companies } from "./data/companies";
</script>

<template>
  <main class="mx-auto flex w-full max-w-306 flex-col gap-8 px-4 py-16">
    <header class="flex items-center gap-6">
      <span class="h-8 w-24 rounded-r-full bg-accent" />
      <h1 class="text-4xl font-medium text-title">
        The Magnificent Seven Companies
      </h1>
    </header>

    <section
      class="grid grid-cols-2 gap-6 rounded-[20px] bg-panel-wrap p-6 sm:grid-cols-3 xl:grid-cols-6"
    >
      <CompanyCard
        v-for="company in companies"
        :key="company.name"
        :company="company"
      />
    </section>

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
